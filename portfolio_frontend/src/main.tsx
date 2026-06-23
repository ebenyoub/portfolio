import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './context/AuthProvider.tsx'
import Header from './components/Header.tsx'
import { Toaster } from 'sonner'
import Footer from './components/Footer.tsx'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex flex-col flex-1">
            <App />
          </main>
          <Footer />
        </div>
        <Toaster richColors position="bottom-right" />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
