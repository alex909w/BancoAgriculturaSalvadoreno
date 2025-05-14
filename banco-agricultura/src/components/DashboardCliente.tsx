"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./style/DashboardCliente.css"

const DashboardCliente: React.FC = () => {
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
    <div className="clienteDashboardContainer">
      <header className="clienteDashboardHeader">
        <div className="clienteLogoContainer">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="clienteLogo" />
        </div>
        <h1 className="clienteDashboardTitle">Panel de Clientes</h1>
        <div className="clienteUserMenu">
          <button className="clienteAvatar" onClick={toggleMenu}>
            <img src="/assets/Usuario.png" alt="Usuario" className="clienteAvatarImage" />
          </button>
          {menuVisible && (
            <div className="clienteMenuDropdown">
              <button className="clienteMenuItem" onClick={() => handleNavigate("/perfil-cliente")}>Perfil</button>
              <button className="clienteMenuItem" onClick={() => handleNavigate("/configuracion-cliente")}>Configuración</button>
              <button className="clienteMenuItem" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </header>

      <main className="clienteDashboardMain">
        <h2 className="clienteInfoTitle">Informacion Usuario</h2>
        <div className="clienteInfoContainer">
          <div className="clienteAccountsContainer">
            <div className="clienteAccountBox">
              <p>Número de cuenta: 652732736823</p>
              <p>75.45 US</p>
              <button className="clienteDetailsButton">Detalles</button>
            </div>
            <div className="clienteAccountBox">
              <p>Número de cuenta: 657687676666</p>
              <p>232.00 US</p>
              <button className="clienteDetailsButton">Detalles</button>
            </div>
            <div className="clienteAccountBox">
              <p>Número de cuenta: 652799966343</p>
              <p>12.67 US</p>
              <button className="clienteDetailsButton">Detalles</button>
            </div>
          </div>
          <div className="clienteProfileContainer">
            <img src="/assets/usuario.png" alt="Usuario" className="clienteProfileImage" />
            <h3>JOSÉ ALEXANDER RAMOS HERNÁNDEZ</h3>
            <p>TIPO DE CUENTA: PRESTAMISTA</p>
            <p>ID. DE CLIENTE: 15093293JR</p>
            <p>PROFESIÓN: AGRICULTOR</p>
            <p>CUENTAS EN POSESIÓN: 2</p>
          </div>
        </div>
        <div className="clienteActionsContainer">
          <button className="clienteActionButton" onClick={() => handleNavigate("/crear-cuenta")}>
            <img src="/assets/movimiento.png" alt="Crear Otra Cuenta" className="clienteActionIcon" />
            <span>CREAR OTRA CUENTA</span>
          </button>
          <button className="clienteActionButton" onClick={() => handleNavigate("/historial-transacciones")}>
            <img src="/assets/historial.png" alt="Historial de Transacciones" className="clienteActionIcon" />
            <span>HISTORIAL DE TRANSACCIONES</span>
          </button>
          <button className="clienteRegisterButton" onClick={() => handleNavigate("/cliente")}>
            <span>REGRESAR</span>
          </button>
        </div>
      </main>
    </div>
  )
}

export default DashboardCliente
