import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react'
import type { Diagnostic } from '../language/types'

interface ProblemsPanelProps {
  diagnostics: Diagnostic[]
  hasValidated: boolean
}

export function ProblemsPanel({ diagnostics, hasValidated }: ProblemsPanelProps) {
  const errors = diagnostics.filter(({ severity }) => severity === 'erro')

  return (
    <section className="problems-panel" aria-live="polite">
      <div className="problems-heading">
        <strong>Problemas</strong>
        <span>{diagnostics.length}</span>
      </div>
      <div className="problem-list">
        {!hasValidated && (
          <div className="empty-problems">
            <AlertCircle size={17} /> Clique em Validar para analisar a receita.
          </div>
        )}
        {hasValidated && diagnostics.length === 0 && (
          <div className="empty-problems success">
            <CheckCircle2 size={17} /> Receita válida e pronta para simulação.
          </div>
        )}
        {diagnostics.map((diagnostic, index) => (
          <div className={`problem-item ${diagnostic.severity}`} key={`${diagnostic.line}-${index}`}>
            {diagnostic.severity === 'erro' ? <AlertCircle size={17} /> : <AlertTriangle size={17} />}
            <div>
              <p>{diagnostic.message}</p>
              <small>Linha {diagnostic.line}, coluna {diagnostic.column} · {diagnostic.kind}</small>
            </div>
          </div>
        ))}
      </div>
      {hasValidated && (
        <div className="problem-summary">
          {errors.length === 0 ? 'Nenhum erro bloqueante' : `${errors.length} erro(s) bloqueando a simulação`}
        </div>
      )}
    </section>
  )
}
