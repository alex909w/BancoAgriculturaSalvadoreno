"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./style/GerentePage.css"

const GerentePage: React.FC = () => {
  const navigate = useNavigate()
  const [gerenteName, setGerenteName] = useState("Mario Alberto Córdova Moreno")

  const handleLogout = () => {
    navigate("/login")
  }

  return (
    <div className="welcome-container">
      <header className="welcome-header">
        <div className="welcome-logo-container">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="welcome-logo" />
        </div>
        <button className="user-avatar" onClick={handleLogout}>
          <img src="/assets/Usuario.png" alt="Usuario" className="avatar-image" />
        </button>
      </header>

      <main className="welcome-main">
        <div className="welcome-content">
          <div className="welcome-box">
            <h1 className="welcome-title">¡Bienvenido!</h1>
            <h2 className="welcome-subtitle">{gerenteName}</h2>
            <h3 className="welcome-role">Gerente General</h3>
          </div>

          <div className="content-container">
            <div className="text-container">
              <div className="stats-box">
                <h3 className="stats-title">Gráfica de transacciones completadas en el mes de Febrero</h3>
                <ul className="stats-list">
                  <li className="stats-item">
                    <span className="check-mark">✓</span>
                    <span>Hubo un aumento en la tasa de préstamos diarios</span>
                  </li>
                  <li className="stats-item">
                    <span className="check-mark">✓</span>
                    <span>Algunas sucursales tuvieron problemas con los retiros</span>
                  </li>
                </ul>
              </div>
              <div className="branches-box">
                <h3 className="branches-title">Sucursales con más préstamos completados:</h3>
                <ul className="branches-list">
                  <li className="branch-item">
                    <span className="check-mark">1.</span>
                    <span>Sucursal El Paseo</span>
                  </li>
                  <li className="branch-item">
                    <span className="check-mark">2.</span>
                    <span>Sucursal Buena Vista</span>
                  </li>
                  <li className="branch-item">
                    <span className="check-mark">3.</span>
                    <span>Sucursal Amanecer</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="images-container">
              <img src="/assets/grafica.png" alt="Gráfica de transacciones" className="stats-image" />
              <img src="/assets/sucursal.png" alt="Sucursal" className="branch-image" />
            </div>
          </div>
        </div>
        <div className="continue-button-container">
          <button className="continue-button" onClick={() => navigate("/DashboardGerente")}>
            Continuar
          </button>
        </div>
      </main>
    </div>
  )
}

export default GerentePage
