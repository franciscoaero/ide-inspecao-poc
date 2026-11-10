import type { Diagnostic, RecipeNode } from './types'

const INPUTS = new Set(['ovalizacao', 'aletas_detectadas', 'presenca_aletas'])

export function validateSemantics(recipe: RecipeNode): Diagnostic[] {
  const diagnostics: Diagnostic[] = []
  const parameters = new Map<string, number>()

  for (const parameter of recipe.parameters) {
    if (parameters.has(parameter.name)) {
      diagnostics.push({
        kind: 'semantico',
        severity: 'erro',
        line: parameter.line,
        column: 1,
        message: `O parâmetro ${parameter.name} foi declarado mais de uma vez.`,
      })
    }
    parameters.set(parameter.name, parameter.value)

    if (parameter.value < 0) {
      diagnostics.push({
        kind: 'semantico',
        severity: 'erro',
        line: parameter.line,
        column: 1,
        message: `${parameter.name} não pode ser negativo.`,
      })
    }

    if (parameter.name.includes('presenca') && parameter.value > 100) {
      diagnostics.push({
        kind: 'semantico',
        severity: 'erro',
        line: parameter.line,
        column: 1,
        message: `${parameter.name} deve ficar entre 0 e 100%.`,
      })
    }
  }

  for (const rule of recipe.rules) {
    if (!INPUTS.has(rule.left)) {
      diagnostics.push({
        kind: 'semantico',
        severity: 'erro',
        line: rule.line,
        column: 1,
        message: `Campo de inspeção desconhecido: ${rule.left}.`,
      })
    }

    if (rule.right.kind === 'identifier' && !parameters.has(String(rule.right.value))) {
      diagnostics.push({
        kind: 'semantico',
        severity: 'erro',
        line: rule.line,
        column: 1,
        message: `Parâmetro não declarado: ${String(rule.right.value)}.`,
      })
    }
  }

  if (recipe.parameters.length === 0) {
    diagnostics.push({
      kind: 'semantico',
      severity: 'aviso',
      line: 1,
      column: 1,
      message: 'A receita não declara parâmetros.',
    })
  }
  if (recipe.rules.length === 0) {
    diagnostics.push({
      kind: 'semantico',
      severity: 'erro',
      line: 1,
      column: 1,
      message: 'A receita precisa ter pelo menos uma regra SE.',
    })
  }
  if (!recipe.defaultResult) {
    diagnostics.push({
      kind: 'semantico',
      severity: 'erro',
      line: 1,
      column: 1,
      message: 'O bloco REGRA precisa terminar com SENAO.',
    })
  }

  return diagnostics
}

