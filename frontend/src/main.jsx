import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/react'
import { BrowserRouter } from 'react-router'


const PUBLISHAIBLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHAIBLE_KEY) {
  throw new Error("Missing publishable key");
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <ClerkProvider publishableKey={PUBLISHAIBLE_KEY}>
      <BrowserRouter>
      <App />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
)
