import type { InspectionInput } from '../language/types'

export interface RecipeExample {
  id: string
  name: string
  description: string
  source: string
}

export interface Scenario {
  id: string
  name: string
  description: string
  input: InspectionInput
}

export const recipeExamples: RecipeExample[] = [
  {
    id: 'modelo-a',
    name: 'Modelo demonstrativo A',
    description: 'Receita completa para a demonstração.',
    source: `# Receita fictícia para demonstração
RECEITA modelo_demonstrativo_a

GEOMETRIA {
  ovalizacao_maxima = 4.7
}

ALETAS {
  quantidade_esperada = 18
  presenca_minima = 81
}

REGRA {
  SE ovalizacao > ovalizacao_maxima ENTAO REJEITAR
  SE aletas_detectadas < quantidade_esperada ENTAO REVISAR
  SE presenca_aletas < presenca_minima ENTAO REVISAR
  SENAO APROVAR
}`,
  },
  {
    id: 'modelo-b',
    name: 'Modelo demonstrativo B',
    description: 'Limites mais restritivos.',
    source: `RECEITA modelo_demonstrativo_b

GEOMETRIA {
  ovalizacao_maxima = 3.2
}

ALETAS {
  quantidade_esperada = 16
  presenca_minima = 86
}

REGRA {
  SE ovalizacao > ovalizacao_maxima ENTAO REJEITAR
  SE aletas_detectadas < quantidade_esperada ENTAO REVISAR
  SE presenca_aletas < presenca_minima ENTAO REVISAR
  SENAO APROVAR
}`,
  },
  {
    id: 'com-erro',
    name: 'Exemplo com erro',
    description: 'Mostra a validação semântica.',
    source: `RECEITA exemplo_com_erro

GEOMETRIA {
  ovalizacao_maxima = 4.1
}

ALETAS {
  presenca_minima = 120
}

REGRA {
  SE ovalizacao > limite_inexistente ENTAO REJEITAR
  SENAO APROVAR
}`,
  },
]

export const scenarios: Scenario[] = [
  {
    id: 'aprovada',
    name: 'Peça aprovada',
    description: 'Todos os valores ficam dentro dos limites.',
    input: { ovalizacao: 3.9, aletas_detectadas: 18, presenca_aletas: 88 },
  },
  {
    id: 'revisao',
    name: 'Revisão manual',
    description: 'A quantidade de aletas fica abaixo do esperado.',
    input: { ovalizacao: 4.2, aletas_detectadas: 17, presenca_aletas: 84 },
  },
  {
    id: 'rejeitada',
    name: 'Peça rejeitada',
    description: 'A ovalização ultrapassa o limite.',
    input: { ovalizacao: 5.1, aletas_detectadas: 18, presenca_aletas: 88 },
  },
]

