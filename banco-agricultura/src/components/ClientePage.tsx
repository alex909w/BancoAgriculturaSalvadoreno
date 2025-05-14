"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./style/ClientePage.css"

const ClientePage: React.FC = () => {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    navigate("/login")
  }

  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <div className="welcome-container">
      <header className="welcome-header">
        <div className="welcome-logo-container">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="welcome-logo" />
        </div>

        <div className="user-menu">
          <button className="user-avatar" onClick={handleToggleMenu}>
            <img src="/assets/Usuario.png" alt="Cliente" className="avatar-image" />
          </button>
          {menuOpen && (
            <div className="menu-dropdown">
              <button className="menu-item" onClick={() => navigate("/perfil-cliente")}>Perfil</button>
              <button className="menu-item" onClick={() => navigate("/configuracion-cliente")}>Configuración</button>
              <button className="menu-item" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </header>

      <main className="welcome-main">
        <h1 className="welcome-title">¡Bienvenido a AgroBanco Salvadoreño!</h1>

        <div className="welcome-content">
          <div className="service-image-container">
            <img src="/assets/cliente.png" alt="Atención al cliente" className="service-image" />
          </div>

          <div className="reminders-container">
            <h2 className="reminders-title">En AgroBanco Salvadoreño, ofrecemos soluciones financieras diseñadas para el sector agrícola. Nuestra plataforma te permite:</h2>
            <ul className="reminders-list">
              <li className="reminder-item">
                <span className="check-mark">✓</span>
                <span>Solicitar créditos agrícolas para financiar cultivos, maquinaria y crecimiento de tu negocio.</span>
              </li>
              <li className="reminder-item">
                <span className="check-mark">✓</span>
                <span>Abrir y administrar cuentas diseñadas para productores y emprendedores del campo.</span>
              </li>
              <li className="reminder-item">
                <span className="check-mark">✓</span>
                <span>Realizar transferencias y pagos de forma rápida y segura.</span>
              </li>
              <li className="reminder-item">
                <span className="check-mark">✓</span>
                <span>Consultar estados de cuenta y gestionar tus finanzas en cualquier momento.</span>
              </li>
              <li className="reminder-item">
                <span className="check-mark">✓</span>
                <span>Acceder a programas de apoyo y subsidios exclusivos para el sector agropecuario.</span>
                </li>
               </ul>
           <h2 className="reminders-title">¡Crecemos contigo y con el campo. ¡Impulsa tu producción con nosotros!</h2>
          </div>
        </div>

        <div className="button-container">
          <button className="continue-button" onClick={() => navigate("/dashboard-cliente")}>
            Continuar
          </button>
        </div>
      </main>
    </div>
  )
}

export default ClientePage
