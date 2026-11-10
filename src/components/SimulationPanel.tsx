import { FlaskConical, Gauge, RotateCcw } from 'lucide-react'
import { scenarios } from '../data/examples'
import type { InspectionInput, SimulationResult } from '../language/types'

interface SimulationPanelProps {
  input: InspectionInput
  result?: SimulationResult
  disabled: boolean
  onInputChange: (input: InspectionInput) => void
  onSimulate: () => void
}

const resultLabels = {
  APROVAR: 'Peça aprovada',
  REVISAR: 'Revisão necessária',
  REJEITAR: 'Peça rejeitada',
}

export function SimulationPanel({
  input,
  result,
  disabled,
  onInputChange,
  onSimulate,
}: SimulationPanelProps) {
  const update = (field: keyof InspectionInput, value: string) => {
    onInputChange({ ...input, [field]: Number(value) })
  }

  return (
    <aside className="simulation-panel">
      <div className="panel-heading compact">
        <div>
          <span className="eyebrow">LABORATÓRIO</span>
          <h2>Dados fictícios</h2>
        </div>
        <FlaskConical size={20} />
      </div>

      <p className="panel-description">
        Escolha um cenário ou altere as medições para testar as regras.
      </p>

      <div className="scenario-grid">
        {scenarios.map((scenario) => (
          <button
            className="scenario-button"
            key={scenario.id}
            onClick={() => onInputChange(scenario.input)}
            title={scenario.description}
          >
            {scenario.name}
          </button>
        ))}
      </div>

      <div className="field-list">
        <label>
          <span>Ovalização</span>
          <div className="input-with-unit">
            <input
              type="number"
              step="0.1"
              value={input.ovalizacao}
              onChange={(event) => update('ovalizacao', event.target.value)}
            />
            <span>px</span>
          </div>
        </label>
        <label>
          <span>Aletas detectadas</span>
          <div className="input-with-unit">
            <input
              type="number"
              step="1"
              value={input.aletas_detectadas}
              onChange={(event) => update('aletas_detectadas', event.target.value)}
            />
            <span>un.</span>
          </div>
        </label>
        <label>
          <span>Presença de aletas</span>
          <div className="input-with-unit">
            <input
              type="number"
              step="0.1"
              value={input.presenca_aletas}
              onChange={(event) => update('presenca_aletas', event.target.value)}
            />
            <span>%</span>
          </div>
        </label>
      </div>

      <button className="simulate-button" onClick={onSimulate} disabled={disabled}>
        <Gauge size={18} /> Simular inspeção
      </button>

      {disabled && (
        <p className="simulation-hint">Valide uma receita sem erros para liberar a simulação.</p>
      )}

      {result ? (
        <div className={`result-card result-${result.result.toLowerCase()}`}>
          <span>RESULTADO DA SIMULAÇÃO</span>
          <strong>{result.result}</strong>
          <h3>{resultLabels[result.result]}</h3>
          <p>{result.explanation}</p>
        </div>
      ) : (
        <div className="result-placeholder">
          <RotateCcw size={20} />
          <p>O resultado aparecerá aqui depois da simulação.</p>
        </div>
      )}

      <div className="local-note">
        <strong>Ambiente seguro e local</strong>
        <p>Nenhum dado é enviado para a internet ou para equipamentos industriais.</p>
      </div>
    </aside>
  )
}

