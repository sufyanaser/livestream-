import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './styles.css'
import { ProjectProvider } from '@/state/project-context'

const root = document.getElementById('root')

if (!root) throw new Error('Application root element was not found')

createRoot(root).render(
  <StrictMode>
    <ProjectProvider><App /></ProjectProvider>
  </StrictMode>
)
