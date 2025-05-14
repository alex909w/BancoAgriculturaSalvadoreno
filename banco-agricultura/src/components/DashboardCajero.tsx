"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./style/DashboardCajero.css"

const DashboardCajero: React.FC = () => {
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
    <div className="cajeroDashboardContainer">
      <header className="cajeroDashboardHeader">
        <div className="cajeroLogoContainer">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="cajeroLogo" />
        </div>
        <h1 className="cajeroDashboardTitle">CAJERO</h1>
        <div className="cajeroUserMenu">
          <button className="cajeroAvatar" onClick={toggleMenu}>
            <img src="/assets/Usuario.png" alt="Usuario" className="cajeroAvatarImage" />
          </button>
          {menuVisible && (
            <div className="cajeroMenuDropdown">
              <button className="cajeroMenuItem" onClick={() => handleNavigate("/perfil-cajero")}>Perfil</button>
              <button className="cajeroMenuItem" onClick={() => handleNavigate("/configuracion-cajero")}>Configuración</button>
              <button className="cajeroMenuItem" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </header>

      <main className="cajeroDashboardMain">
        <div className="cajeroActionPanel">
          <img src="/assets/cajero.png" alt="Selecciona una acción" className="action-cajero-image" />
          <p className="cajeroActionText">Selecciona que tipo de movimiento quieres realizar</p>
        </div>

        <div className="cajeroOptionsContainer">
          <button className="cajeroOptionButton" onClick={() => handleNavigate("/registro-cliente")}>
            <img src="/assets/nuevo-usuario.png" alt="Registrar Nuevo Cliente" className="cajeroOptionIcon" />
            <span>REGISTRAR NUEVO CLIENTE</span>
          </button>
          <button className="cajeroOptionButton" onClick={() => handleNavigate("/prestamos")}>
            <img src="/assets/deposito.png" alt="Prestamos" className="cajeroOptionIcon" />
            <span>PRÉSTAMOS</span>
          </button>
          <button className="cajeroOptionButton" onClick={() => handleNavigate("/transaccion")}>
            <img src="/assets/transaccion.png" alt="Transacción" className="cajeroOptionIcon" />
            <span>TRANSACCIÓN</span>
          </button>
        </div>
      </main>
    </div>
  )
}

export default DashboardCajero
