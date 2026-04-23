import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthProvider.jsx'
import { ThemeProvider } from './contexts/ThemeProvider.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
);
