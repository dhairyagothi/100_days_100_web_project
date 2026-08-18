import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter  } from 'react-router-dom'
import App from './App.jsx'

// BrowserRouter wraps the entire app so any component
// inside can use routing (useNavigate, Link, Routes, etc.)
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename="/public/BigSales-Prediction">
    <App />
  </BrowserRouter>
)
