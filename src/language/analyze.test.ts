import { describe, expect, it } from 'vitest'
import { recipeExamples } from '../data/examples'
import { analyze } from './analyze'

describe('analyze', () => {
  it('aceita a receita principal', () => {
    const result = analyze(recipeExamples[0].source)

    expect(result.diagnostics).toEqual([])
    expect(result.recipe?.name).toBe('modelo_demonstrativo_a')
    expect(result.recipe?.parameters).toHaveLength(3)
    expect(result.recipe?.rules).toHaveLength(3)
    expect(result.recipe?.defaultResult).toBe('APROVAR')
  })

  it('identifica parâmetro inexistente e percentual inválido', () => {
    const result = analyze(recipeExamples[2].source)
    const messages = result.diagnostics.map(({ message }) => message)

    expect(messages).toContain('presenca_minima deve ficar entre 0 e 100%.')
    expect(messages).toContain('Parâmetro não declarado: limite_inexistente.')
  })

  it('identifica um bloco não fechado', () => {
    const result = analyze(`RECEITA teste
GEOMETRIA {
  ovalizacao_maxima = 4.7`)

    expect(result.diagnostics.some(({ message }) => message.includes('não foi fechado'))).toBe(true)
  })

  it('identifica caracteres não reconhecidos', () => {
    const result = analyze(`RECEITA teste@
REGRA {
  SE ovalizacao > 5 ENTAO REJEITAR
  SENAO APROVAR
}`)

    expect(result.diagnostics.some(({ kind }) => kind === 'lexico')).toBe(true)
  })
})

