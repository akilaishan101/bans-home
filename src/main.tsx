import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@ionic/react/css/core.css'
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'
import './index.css'
import './i18n'
import App from './App'
import { registerPwaAutoUpdate } from './services/pwaUpdate'

registerPwaAutoUpdate()

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
