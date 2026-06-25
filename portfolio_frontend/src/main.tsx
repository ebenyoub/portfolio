import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './context/AuthProvider.tsx'
import { Toaster } from 'sonner'
import AppShell from './components/AppShell.tsx'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
        <Toaster richColors position="bottom-right" />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
