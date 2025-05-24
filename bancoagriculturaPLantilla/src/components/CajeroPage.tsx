"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./style/CajeroPage.css"
import { authService } from "../lib/auth"

const CajeroPage: React.FC = () => {
  const navigate = useNavigate()
  const [menuVisible, setMenuVisible] = useState(false)

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login")
    }
  }, [navigate])

  const handleLogout = () => {
    navigate("/login")
  }

  const handleGoBack = () => {
    navigate("/login") // Cambiar a login en lugar de cliente-page
  }

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }

  return (
    <div className="welcome-container">
      <header className="welcome-header">
        <div className="welcome-logo-container">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="welcome-logo" />
        </div>
        <div className="user-menu">
          <button className="user-avatar" onClick={toggleMenu}>
            <img src="/assets/Usuario.png" alt="Usuario" className="avatar-image" />
          </button>
          {menuVisible && (
            <div className="menu-dropdown">
              <button className="menu-item" onClick={() => navigate("/perfil-cajero")}>
                Perfil
              </button>
              <button className="menu-item" onClick={() => navigate("/configuracion-cajero")}>
                Configuración
              </button>
              <button className="menu-item" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="welcome-main">
        <h1 className="welcome-title">¡Bienvenido a AgroBanco Salvadoreño!</h1>

        <div className="welcome-content">
          <div className="service-image-container">
            <img src="/assets/customer-service.png" alt="Servicio al cliente" className="service-image" />
          </div>

          <div className="reminders-container">
            <h2 className="reminders-title">Recuerda siempre que:</h2>
            <ul className="reminders-list">
              <li className="reminder-item">
                <span className="check-mark">✓</span>
                <span>Recuerda siempre sonreír y saludar a los clientes de forma amable y cordial.</span>
              </li>
              <li className="reminder-item">
                <span className="check-mark">✓</span>
                <span>Utiliza un tono de voz amigable y muestra interés genuino en ayudar.</span>
              </li>
              <li className="reminder-item">
                <span className="check-mark">✓</span>
                <span>Habla de forma clara y concisa, utilizando un lenguaje sencillo y evitando tecnicismos.</span>
              </li>
              <li className="reminder-item">
                <span className="check-mark">✓</span>
                <span>Escucha atentamente a los clientes y asegúrate de comprender sus necesidades.</span>
              </li>
              <li className="reminder-item">
                <span className="check-mark">✓</span>
                <span>Explica los procedimientos y productos de forma clara y completa.</span>
              </li>
              <li className="reminder-item">
                <span className="check-mark">✓</span>
                <span>Muestra empatía y comprensión ante las preocupaciones o problemas de los clientes.</span>
              </li>
              <li className="reminder-item">
                <span className="check-mark">✓</span>
                <span>Mantén la confidencialidad de la información de los clientes.</span>
              </li>
              <li className="reminder-item">
                <span className="check-mark">✓</span>
                <span>Cuenta el dinero con cuidado y verifica la autenticidad de los billetes y monedas.</span>
              </li>
              <li className="reminder-item">
                <span className="check-mark">✓</span>
                <span>Mantén el área de trabajo limpia y organizada.</span>
              </li>
              <li className="reminder-item">
                <span className="check-mark">✓</span>
                <span>Colabora con tus compañeros de trabajo para brindar un servicio eficiente.</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="button-container">
          <button className="return-button" onClick={handleGoBack}>
            Regresar
          </button>
          <button className="continue-button" onClick={() => navigate("/dashboard-cajero")}>
            Continuar
          </button>
        </div>
      </main>
    </div>
  )
}

export default CajeroPage
