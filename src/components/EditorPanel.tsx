import Editor, { type BeforeMount } from '@monaco-editor/react'

interface EditorPanelProps {
  value: string
  onChange: (value: string) => void
}

const configureLanguage: BeforeMount = (monaco) => {
  if (monaco.languages.getLanguages().some((language: { id: string }) => language.id === 'inspecao')) return

  monaco.languages.register({ id: 'inspecao' })
  monaco.languages.setMonarchTokensProvider('inspecao', {
    keywords: ['RECEITA', 'GEOMETRIA', 'ALETAS', 'REGRA', 'SE', 'ENTAO', 'SENAO'],
    outcomes: ['APROVAR', 'REVISAR', 'REJEITAR'],
    tokenizer: {
      root: [
        [/#.*$/, 'comment'],
        [/[A-Z_À-Ú][A-Z0-9_À-Ú]*/, { cases: { '@keywords': 'keyword', '@outcomes': 'type', '@default': 'identifier' } }],
        [/[a-z_à-ú][a-zA-Z0-9_À-ÿ]*/, 'variable'],
        [/\d+(\.\d+)?/, 'number'],
        [/[{}]/, 'delimiter.bracket'],
        [/[><=!]=?/, 'operator'],
      ],
    },
  })
  monaco.languages.setLanguageConfiguration('inspecao', {
    comments: { lineComment: '#' },
    brackets: [['{', '}']],
    autoClosingPairs: [{ open: '{', close: '}' }],
  })
  monaco.editor.defineTheme('inspection-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '7DD3FC', fontStyle: 'bold' },
      { token: 'type', foreground: 'FBBF24', fontStyle: 'bold' },
      { token: 'variable', foreground: 'E2E8F0' },
      { token: 'number', foreground: '86EFAC' },
      { token: 'comment', foreground: '64748B', fontStyle: 'italic' },
    ],
    colors: {
      'editor.background': '#111827',
      'editorLineNumber.foreground': '#475569',
      'editorLineNumber.activeForeground': '#CBD5E1',
    },
  })
}

export function EditorPanel({ value, onChange }: EditorPanelProps) {
  return (
    <section className="editor-panel" aria-label="Editor da receita">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">RECEITA ATIVA</span>
          <h2>editor.inspecao</h2>
        </div>
        <span className="language-pill">DSL Inspeção</span>
      </div>
      <div className="editor-area">
        <Editor
          height="100%"
          language="inspecao"
          theme="inspection-dark"
          value={value}
          beforeMount={configureLanguage}
          onChange={(nextValue) => onChange(nextValue ?? '')}
          options={{
            minimap: { enabled: false },
            fontFamily: "'Cascadia Code', 'Fira Code', monospace",
            fontSize: 14,
            lineHeight: 22,
            padding: { top: 18 },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
          }}
        />
      </div>
    </section>
  )
}

