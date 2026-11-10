import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor/editor'
import EditorWorker from 'monaco-editor/editor/editor.worker?worker'
import App from './App'

const environment = globalThis as typeof globalThis & {
  MonacoEnvironment: { getWorker: () => Worker }
}

environment.MonacoEnvironment = {
  getWorker: () => new EditorWorker(),
}

loader.config({ monaco })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
