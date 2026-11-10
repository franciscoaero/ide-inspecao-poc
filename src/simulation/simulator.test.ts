import { describe, expect, it } from 'vitest'
import { recipeExamples, scenarios } from '../data/examples'
import { analyze } from '../language/analyze'
import { simulate } from './simulator'

const recipe = analyze(recipeExamples[0].source).recipe!

describe('simulate', () => {
  it('aprova valores dentro dos limites', () => {
    expect(simulate(recipe, scenarios[0].input).result).toBe('APROVAR')
  })

  it('envia para revisão quando faltam aletas', () => {
    const result = simulate(recipe, scenarios[1].input)

    expect(result.result).toBe('REVISAR')
    expect(result.matchedRule?.left).toBe('aletas_detectadas')
  })

  it('rejeita quando a ovalização excede o limite', () => {
    const result = simulate(recipe, scenarios[2].input)

    expect(result.result).toBe('REJEITAR')
    expect(result.matchedRule?.left).toBe('ovalizacao')
  })
})

