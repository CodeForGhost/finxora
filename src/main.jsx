import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'
import './expanded.css'
import './lifecycle.css'
import './brokerflow.css'
import './crm-theme.css'

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>)
