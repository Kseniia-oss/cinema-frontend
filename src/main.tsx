import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { Provider } from 'react-redux'
import App from './App'
import { store } from './app/store'
import '@fontsource/montserrat/500.css'
import '@fontsource/unbounded/400.css'
import '@fontsource/unbounded/500.css'
import '@fontsource/unbounded/700.css'
import './styles/theme.css'
import './index.css'
import './styles/responsive.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)