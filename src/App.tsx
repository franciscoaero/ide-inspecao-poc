import { useMemo, useState } from 'react'
import { Braces, CheckCircle2, ChevronRight, Play, ShieldCheck } from 'lucide-react'
import { EditorPanel } from './components/EditorPanel'
import { ProblemsPanel } from './components/ProblemsPanel'
import { SimulationPanel } from './components/SimulationPanel'
import { recipeExamples } from './data/examples'
import { analyze } from './language/analyze'
import type { AnalysisResult, InspectionInput, SimulationResult } from './language/types'
import { simulate } from './simulation/simulator'
import './styles.css'

const initialInput: InspectionInput = {
  ovalizacao: 3.9,
  aletas_detectadas: 18,
  presenca_aletas: 88,
}

function App() {
  const [activeExampleId, setActiveExampleId] = useState(recipeExamples[0].id)
  const [source, setSource] = useState(recipeExamples[0].source)
  const [analysis, setAnalysis] = useState<AnalysisResult>({ diagnostics: [] })
  const [hasValidated, setHasValidated] = useState(false)
  const [input, setInput] = useState(initialInput)
  const [simulationResult, setSimulationResult] = useState<SimulationResult>()

  const hasErrors = analysis.diagnostics.some(({ severity }) => severity === 'erro')
  const canSimulate = hasValidated && Boolean(analysis.recipe) && !hasErrors
  const activeExample = useMemo(
    () => recipeExamples.find(({ id }) => id === activeExampleId),
    [activeExampleId],
  )

  const selectExample = (id: string) => {
    const example = recipeExamples.find((item) => item.id === id)
    if (!example) return
    setActiveExampleId(id)
    setSource(example.source)
    setAnalysis({ diagnostics: [] })
    setHasValidated(false)
    setSimulationResult(undefined)
  }

  const changeSource = (value: string) => {
    setSource(value)
    setHasValidated(false)
    setSimulationResult(undefined)
  }

  const validate = () => {
    setAnalysis(analyze(source))
    setHasValidated(true)
    setSimulationResult(undefined)
  }

  const runSimulation = () => {
    if (!canSimulate || !analysis.recipe) return
    setSimulationResult(simulate(analysis.recipe, input))
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><Braces size={22} /></div>
          <div>
            <strong>Inspection Rules IDE</strong>
            <span>Prova de conceito · ambiente local</span>
          </div>
        </div>
        <div className="topbar-actions">
          <span className="local-badge"><ShieldCheck size={16} /> Somente local</span>
          <button className="validate-button" onClick={validate}>
            <CheckCircle2 size={18} /> Validar receita
          </button>
          <button className="run-button" onClick={runSimulation} disabled={!canSimulate}>
            <Play size={17} fill="currentColor" /> Simular
          </button>
        </div>
      </header>

      <main className="workspace">
        <nav className="recipe-sidebar" aria-label="Receitas de exemplo">
          <div className="sidebar-heading">
            <span className="eyebrow">EXPLORADOR</span>
            <strong>Receitas</strong>
          </div>
          <div className="recipe-list">
            {recipeExamples.map((example) => (
              <button
                className={example.id === activeExampleId ? 'recipe-item active' : 'recipe-item'}
                key={example.id}
                onClick={() => selectExample(example.id)}
              >
                <span className="recipe-icon">R</span>
                <span>
                  <strong>{example.name}</strong>
                  <small>{example.description}</small>
                </span>
                <ChevronRight size={16} />
              </button>
            ))}
          </div>
          <div className="dsl-summary">
            <span>LINGUAGEM</span>
            <strong>DSL Inspeção v0.1</strong>
            <p>Receitas, parâmetros, condições e resultados.</p>
          </div>
        </nav>

        <div className="center-column">
          <EditorPanel value={source} onChange={changeSource} />
          <ProblemsPanel diagnostics={analysis.diagnostics} hasValidated={hasValidated} />
        </div>

        <SimulationPanel
          input={input}
          result={simulationResult}
          disabled={!canSimulate}
          onInputChange={(nextInput) => {
            setInput(nextInput)
            setSimulationResult(undefined)
          }}
          onSimulate={runSimulation}
        />
      </main>

      <footer className="statusbar">
        <span><span className="status-dot" /> {hasValidated ? (hasErrors ? 'Receita com erros' : 'Receita validada') : 'Aguardando validação'}</span>
        <span>{activeExample?.name} · TypeScript · UTF-8</span>
      </footer>
    </div>
  )
}

export default App

