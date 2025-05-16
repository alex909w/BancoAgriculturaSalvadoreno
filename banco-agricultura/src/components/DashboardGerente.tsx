"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./style/DashboardGerente.css"

const DashboardGerente: React.FC = () => {
  const navigate = useNavigate()
  const [menuVisible, setMenuVisible] = useState(false)

  const handleLogout = () => {
    navigate("/login")
  }

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-logo-container">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="dashboard-logo" />
        </div>
        <h1 className="dashboard-title">Panel Gerente General</h1>
        <div className="user-menu">
          <button className="user-avatar" onClick={toggleMenu}>
            <img src="/assets/Usuario.png" alt="Usuario" className="avatar-image" />
          </button>
          {menuVisible && (
            <div className="menu-dropdown">
              <button className="menu-item" onClick={() => handleNavigate("/perfil-gerente")}>Perfil</button>
              <button className="menu-item" onClick={() => handleNavigate("/configuracion-gerente")}>Configuración</button>
              <button className="menu-item" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </header>

      <main className="dashboard-main">
        <div className="action-panel">
          <img src="/assets/gerente.png" alt="Selecciona una acción" className="action-image" />
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
