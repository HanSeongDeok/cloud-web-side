import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import { Toaster } from 'sonner'

// 전역 컨텍스트 메뉴 차단
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

// 파일 드래그 기본 동작 차단
document.addEventListener('dragover', (e) => {
  e.preventDefault();
});

document.addEventListener('drop', (e) => {
  e.preventDefault();
});

ModuleRegistry.registerModules([AllCommunityModule])
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
      <Toaster
        position="bottom-right"
        richColors
        closeButton
        duration={5000}
        visibleToasts={7}
      />
  </BrowserRouter>,
)