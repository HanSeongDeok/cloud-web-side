import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import { Toaster } from 'sonner'

ModuleRegistry.registerModules([AllCommunityModule])
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
    <Toaster 
      position="bottom-right"
      richColors
      closeButton
      duration={3000}
    />
  </BrowserRouter>,
)