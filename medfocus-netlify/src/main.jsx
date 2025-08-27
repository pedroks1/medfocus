import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Flashcards from './pages/Flashcards.jsx'
import Exams from './pages/Exams.jsx'
import Login from './pages/Login.jsx'
import './styles.css'

function App() {
  return (
    <BrowserRouter>
      <nav className="nav">
        <Link to="/" className="brand">MedFocus</Link>
        <div className="spacer" />
        <Link to="/flashcards">Flashcards</Link>
        <Link to="/exams">Simulados</Link>
        <Link to="/dashboard">Painel</Link>
        <Link to="/login" className="login">Entrar</Link>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/flashcards" element={<Flashcards/>} />
          <Route path="/exams" element={<Exams/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)
