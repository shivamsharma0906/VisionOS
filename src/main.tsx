import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { VisionProvider } from './context/VisionContext'
import { ThemeProvider } from './context/ThemeContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="vision-ui-theme">
            <VisionProvider>
                <App />
            </VisionProvider>
        </ThemeProvider>
    </React.StrictMode>,
)
