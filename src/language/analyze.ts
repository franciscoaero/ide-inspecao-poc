import { tokenize } from './lexer'
import { parse } from './parser'
import { validateSemantics } from './semantic'
import type { AnalysisResult } from './types'

export function analyze(source: string): AnalysisResult {
  const lexical = tokenize(source)
  const parsed = parse(lexical.tokens)
  const diagnostics = [...lexical.diagnostics, ...parsed.diagnostics]

  if (parsed.recipe && parsed.diagnostics.length === 0) {
    diagnostics.push(...validateSemantics(parsed.recipe))
  }

  return {
    recipe: parsed.recipe,
    diagnostics: diagnostics.sort((a, b) => a.line - b.line || a.column - b.column),
  }
}
