import type {
  ComparisonOperator,
  Diagnostic,
  InspectionResult,
  ParameterNode,
  RecipeNode,
  RuleNode,
  Token,
} from './types'

const RESULTS = new Set<InspectionResult>(['APROVAR', 'REVISAR', 'REJEITAR'])
const SECTIONS = new Set(['GEOMETRIA', 'ALETAS', 'REGRA'])

export interface ParserResult {
  recipe?: RecipeNode
  diagnostics: Diagnostic[]
}

export function parse(tokens: Token[]): ParserResult {
  let current = 0
  const diagnostics: Diagnostic[] = []
  const parameters: ParameterNode[] = []
  const rules: RuleNode[] = []
  let defaultResult: InspectionResult | undefined

  const peek = () => tokens[current]
  const previous = () => tokens[Math.max(0, current - 1)]
  const isAtEnd = () => peek().type === 'EOF'
  const advance = () => {
    if (!isAtEnd()) current += 1
    return previous()
  }
  const skipNewlines = () => {
    while (peek().type === 'NEWLINE') advance()
  }
  const check = (type: Token['type'], lexeme?: string) =>
    peek().type === type && (lexeme === undefined || peek().lexeme === lexeme)
  const error = (token: Token, message: string) => {
    diagnostics.push({
      kind: 'sintatico',
      severity: 'erro',
      line: token.line,
      column: token.column,
      message,
    })
  }
  const consume = (type: Token['type'], message: string, lexeme?: string) => {
    if (check(type, lexeme)) return advance()
    error(peek(), message)
    return undefined
  }
  const synchronizeLine = () => {
    while (!isAtEnd() && !check('NEWLINE') && !check('RBRACE')) advance()
    skipNewlines()
  }

  skipNewlines()
  if (!consume('KEYWORD', 'A receita deve começar com RECEITA.', 'RECEITA')) {
    return { diagnostics }
  }

  const nameToken = consume('IDENTIFIER', 'Informe um nome após RECEITA.')
  const name = nameToken?.lexeme.toLowerCase() ?? 'receita_sem_nome'
  synchronizeLine()

  while (!isAtEnd()) {
    skipNewlines()
    if (isAtEnd()) break

    const sectionToken = peek()
    if (sectionToken.type !== 'KEYWORD' || !SECTIONS.has(sectionToken.lexeme)) {
      error(sectionToken, 'Esperado um bloco GEOMETRIA, ALETAS ou REGRA.')
      synchronizeLine()
      continue
    }

    const section = advance().lexeme as 'GEOMETRIA' | 'ALETAS' | 'REGRA'
    if (!consume('LBRACE', `Esperado { após ${section}.`)) {
      synchronizeLine()
      continue
    }
    skipNewlines()

    while (!isAtEnd() && !check('RBRACE')) {
      if (section === 'REGRA') {
        if (check('KEYWORD', 'SE')) {
          const start = advance()
          const left = consume('IDENTIFIER', 'Esperado um campo após SE.')
          const operator = consume('OPERATOR', 'Esperado um operador de comparação.')
          const right = check('NUMBER') || check('IDENTIFIER') ? advance() : undefined
          if (!right) error(peek(), 'Esperado um parâmetro ou número na comparação.')
          consume('KEYWORD', 'Esperado ENTAO após a condição.', 'ENTAO')
          const result = consume('KEYWORD', 'Esperado APROVAR, REVISAR ou REJEITAR.')

          if (result && !RESULTS.has(result.lexeme as InspectionResult)) {
            error(result, `Resultado inválido: ${result.lexeme}.`)
          }

          if (left && operator && right && result && RESULTS.has(result.lexeme as InspectionResult)) {
            rules.push({
              left: left.lexeme.toLowerCase(),
              operator: operator.lexeme as ComparisonOperator,
              right: {
                kind: right.type === 'NUMBER' ? 'number' : 'identifier',
                value: right.type === 'NUMBER' ? Number(right.lexeme) : right.lexeme.toLowerCase(),
              },
              result: result.lexeme as InspectionResult,
              line: start.line,
              source: `SE ${left.lexeme.toLowerCase()} ${operator.lexeme} ${right.lexeme.toLowerCase()} ENTAO ${result.lexeme}`,
            })
          }
          synchronizeLine()
        } else if (check('KEYWORD', 'SENAO')) {
          advance()
          const result = consume('KEYWORD', 'Esperado um resultado após SENAO.')
          if (result && RESULTS.has(result.lexeme as InspectionResult)) {
            defaultResult = result.lexeme as InspectionResult
          } else if (result) {
            error(result, `Resultado inválido: ${result.lexeme}.`)
          }
          synchronizeLine()
        } else {
          error(peek(), 'Esperado SE ou SENAO dentro do bloco REGRA.')
          synchronizeLine()
        }
      } else {
        const parameter = consume('IDENTIFIER', `Esperado um parâmetro no bloco ${section}.`)
        consume('EQUALS', 'Esperado = após o nome do parâmetro.')
        const value = consume('NUMBER', 'Esperado um valor numérico.')
        if (parameter && value) {
          parameters.push({
            name: parameter.lexeme.toLowerCase(),
            value: Number(value.lexeme),
            section,
            line: parameter.line,
          })
        }
        synchronizeLine()
      }
      skipNewlines()
    }

    consume('RBRACE', `Bloco ${section} não foi fechado com }.`)
    skipNewlines()
  }

  const recipe: RecipeNode = { name, parameters, rules, defaultResult }
  return { recipe, diagnostics }
}

