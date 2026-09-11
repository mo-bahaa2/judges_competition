import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { EventProvider } from './contexts/EventContext';
import { ToastProvider } from './components/ui/Toast';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EventProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </EventProvider>
  </StrictMode>,
)
