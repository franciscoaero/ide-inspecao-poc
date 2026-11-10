export type DiagnosticKind = 'lexico' | 'sintatico' | 'semantico'
export type DiagnosticSeverity = 'erro' | 'aviso'

export interface Diagnostic {
  kind: DiagnosticKind
  severity: DiagnosticSeverity
  line: number
  column: number
  message: string
}

export type TokenType =
  | 'KEYWORD'
  | 'IDENTIFIER'
  | 'NUMBER'
  | 'LBRACE'
  | 'RBRACE'
  | 'EQUALS'
  | 'OPERATOR'
  | 'NEWLINE'
  | 'EOF'

export interface Token {
  type: TokenType
  lexeme: string
  line: number
  column: number
}

export type InspectionResult = 'APROVAR' | 'REVISAR' | 'REJEITAR'
export type ComparisonOperator = '>' | '<' | '>=' | '<=' | '==' | '!='

export interface ParameterNode {
  name: string
  value: number
  section: 'GEOMETRIA' | 'ALETAS'
  line: number
}

export interface OperandNode {
  kind: 'identifier' | 'number'
  value: string | number
}

export interface RuleNode {
  left: string
  operator: ComparisonOperator
  right: OperandNode
  result: InspectionResult
  line: number
  source: string
}

export interface RecipeNode {
  name: string
  parameters: ParameterNode[]
  rules: RuleNode[]
  defaultResult?: InspectionResult
}

export interface AnalysisResult {
  recipe?: RecipeNode
  diagnostics: Diagnostic[]
}

export interface InspectionInput {
  ovalizacao: number
  aletas_detectadas: number
  presenca_aletas: number
}

export interface SimulationResult {
  result: InspectionResult
  explanation: string
  matchedRule?: RuleNode
}

