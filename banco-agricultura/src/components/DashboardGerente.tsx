"use client"

import React from "react"
import { useNavigate } from "react-router-dom"
import "./style/DashboardGerente.css"

const DashboardGerente: React.FC = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate("/login")
  }

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-logo-container">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="dashboard-logo" />
        </div>
        <h1 className="dashboard-title">Panel Gerente General</h1>
        <button className="user-avatar" onClick={handleLogout}>
          <img src="/assets/Usuario.png" alt="Usuario" className="avatar-image" />
        </button>
      </header>

      <main className="dashboard-main">
        <div className="action-panel">
          <img src="/assets/customer-service.png" alt="Selecciona una acción" className="action-image" />
          <p className="action-text">Selecciona una acción</p>
        </div>

        <div className="options-container">
          <button className="option-button" onClick={() => handleNavigate("/solicitudes")}>
            <img src="/assets/solicitud.png" alt="Solicitudes" className="option-icon" />
            <span>SOLICITUDES</span>
          </button>
          <button className="option-button" onClick={() => handleNavigate("/movimientos")}>
            <img src="/assets/movimiento.png" alt="Movimientos" className="option-icon" />
            <span>MOVIMIENTOS</span>
          </button>
          <button className="option-button" onClick={() => handleNavigate("/nueva-sucursal")}>
            <img src="/assets/sucursal-icon.png" alt="Nueva Sucursal" className="option-icon" />
            <span>NUEVA SUCURSAL</span>
          </button>
        </div>
      </main>
    </div>
  )
}

export default DashboardGerente
