import type {
  ComparisonOperator,
  InspectionInput,
  RecipeNode,
  SimulationResult,
} from '../language/types'

const compare = (left: number, operator: ComparisonOperator, right: number) => {
  switch (operator) {
    case '>': return left > right
    case '<': return left < right
    case '>=': return left >= right
    case '<=': return left <= right
    case '==': return left === right
    case '!=': return left !== right
  }
}

export function simulate(recipe: RecipeNode, input: InspectionInput): SimulationResult {
  const parameters = Object.fromEntries(
    recipe.parameters.map((parameter) => [parameter.name, parameter.value]),
  )

  for (const rule of recipe.rules) {
    const left = input[rule.left as keyof InspectionInput]
    const right = rule.right.kind === 'number'
      ? Number(rule.right.value)
      : parameters[String(rule.right.value)]

    if (compare(left, rule.operator, right)) {
      return {
        result: rule.result,
        explanation: `A regra da linha ${rule.line} foi satisfeita: ${rule.source}.`,
        matchedRule: rule,
      }
    }
  }

  const result = recipe.defaultResult ?? 'REVISAR'
  return {
    result,
    explanation: `Nenhuma condição anterior foi satisfeita. Aplicado SENAO ${result}.`,
  }
}

