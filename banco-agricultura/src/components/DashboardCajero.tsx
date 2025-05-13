"use client"

import React from "react"
import { useNavigate } from "react-router-dom"
import "./style/DashboardCajero.css"

const DashboardCajero: React.FC = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate("/login")
  }

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  return (
    <div className="cajeroDashboardContainer">
      <header className="cajeroDashboardHeader">
        <div className="cajeroLogoContainer">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="cajeroLogo" />
        </div>
        <h1 className="cajeroDashboardTitle">Cajero</h1>
        <button className="cajeroAvatar" onClick={handleLogout}>
          <img src="/assets/Usuario.png" alt="Usuario" className="cajeroAvatarImage" />
        </button>
      </header>

      <main className="cajeroDashboardMain">
        <div className="cajeroActionPanel">
          <p className="cajeroActionText">Selecciona que tipo de movimiento quieres realizar</p>
        </div>

        <div className="cajeroOptionsContainer">
          <button className="cajeroOptionButton" onClick={() => handleNavigate("/registro-cliente")}>
            <img src="/assets/nuevo-usuario.png" alt="Registrar Nuevo Cliente" className="cajeroOptionIcon" />
            <span>REGISTRAR NUEVO CLIENTE</span>
          </button>
          <button className="cajeroOptionButton" onClick={() => handleNavigate("/prestamos")}>
            <img src="/assets/transaccion.png" alt="Préstamos" className="cajeroOptionIcon" />
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
