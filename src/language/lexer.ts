import type { Diagnostic, Token } from './types'

const KEYWORDS = new Set([
  'RECEITA',
  'GEOMETRIA',
  'ALETAS',
  'REGRA',
  'SE',
  'ENTAO',
  'SENAO',
  'APROVAR',
  'REVISAR',
  'REJEITAR',
])

export interface LexerResult {
  tokens: Token[]
  diagnostics: Diagnostic[]
}

export function tokenize(source: string): LexerResult {
  const tokens: Token[] = []
  const diagnostics: Diagnostic[] = []
  let index = 0
  let line = 1
  let column = 1

  const add = (type: Token['type'], lexeme: string, tokenLine = line, tokenColumn = column) => {
    tokens.push({ type, lexeme, line: tokenLine, column: tokenColumn })
  }

  while (index < source.length) {
    const char = source[index]

    if (char === ' ' || char === '\t' || char === '\r') {
      index += 1
      column += 1
      continue
    }

    if (char === '\n') {
      add('NEWLINE', '\n')
      index += 1
      line += 1
      column = 1
      continue
    }

    if (char === '#') {
      while (index < source.length && source[index] !== '\n') {
        index += 1
        column += 1
      }
      continue
    }

    const tokenLine = line
    const tokenColumn = column

    if (char === '{' || char === '}') {
      add(char === '{' ? 'LBRACE' : 'RBRACE', char, tokenLine, tokenColumn)
      index += 1
      column += 1
      continue
    }

    if ('><=!'.includes(char)) {
      const next = source[index + 1]
      const candidate = next === '=' ? `${char}=` : char
      if (candidate === '=') {
        add('EQUALS', candidate, tokenLine, tokenColumn)
      } else if (['>', '<', '>=', '<=', '==', '!='].includes(candidate)) {
        add('OPERATOR', candidate, tokenLine, tokenColumn)
      } else {
        diagnostics.push({
          kind: 'lexico',
          severity: 'erro',
          line: tokenLine,
          column: tokenColumn,
          message: `Operador inválido: ${candidate}`,
        })
      }
      index += candidate.length
      column += candidate.length
      continue
    }

    if (/\d/.test(char) || (char === '.' && /\d/.test(source[index + 1] ?? ''))) {
      let lexeme = ''
      let decimalPoints = 0
      while (index < source.length && /[\d.]/.test(source[index])) {
        if (source[index] === '.') decimalPoints += 1
        lexeme += source[index]
        index += 1
        column += 1
      }
      if (decimalPoints > 1) {
        diagnostics.push({
          kind: 'lexico',
          severity: 'erro',
          line: tokenLine,
          column: tokenColumn,
          message: `Número inválido: ${lexeme}`,
        })
      } else {
        add('NUMBER', lexeme, tokenLine, tokenColumn)
      }
      continue
    }

    if (/[A-Za-z_À-ÿ]/.test(char)) {
      let lexeme = ''
      while (index < source.length && /[A-Za-z0-9_À-ÿ]/.test(source[index])) {
        lexeme += source[index]
        index += 1
        column += 1
      }
      const normalized = lexeme.toUpperCase()
      add(KEYWORDS.has(normalized) ? 'KEYWORD' : 'IDENTIFIER', normalized, tokenLine, tokenColumn)
      continue
    }

    diagnostics.push({
      kind: 'lexico',
      severity: 'erro',
      line: tokenLine,
      column: tokenColumn,
      message: `Caractere não reconhecido: ${char}`,
    })
    index += 1
    column += 1
  }

  tokens.push({ type: 'EOF', lexeme: '', line, column })
  return { tokens, diagnostics }
}

