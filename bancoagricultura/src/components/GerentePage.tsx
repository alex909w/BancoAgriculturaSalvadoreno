"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./style/GerentePage.css"

const GerentePage: React.FC = () => {
  const navigate = useNavigate()
  const [gerenteName, setGerenteName] = useState("Mario Alberto Córdova Moreno")
  const [menuVisible, setMenuVisible] = useState(false)

  const handleLogout = () => {
    navigate("/login")
  }

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }

  return (
    <div className="gerenteDashboardContainer">
      <header className="gerenteDashboardHeader">
        <div className="gerenteLogoContainer">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="gerenteLogo" />
        </div>
        <div className="gerenteUserMenu">
          <button className="gerenteAvatar" onClick={toggleMenu}>
            <img src="/assets/Usuario.png" alt="Usuario" className="gerenteAvatarImage" />
          </button>
          {menuVisible && (
            <div className="gerenteMenuDropdown">
              <button className="gerenteMenuItem" onClick={() => navigate("/perfil-gerente")}>Perfil</button>
              <button className="gerenteMenuItem" onClick={() => navigate("/configuracion-gerente")}>Configuración</button>
              <button className="gerenteMenuItem" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </header>

      <main className="gerenteDashboardMain">
        <div className="gerenteWelcomeContent">
          <div className="gerenteWelcomeBox">
            <h1 className="gerenteWelcomeTitle">¡Bienvenido!</h1>
            <h2 className="gerenteWelcomeSubtitle">{gerenteName}</h2>
            <h3 className="gerenteWelcomeRole">Gerente General</h3>
          </div>

          <div className="gerenteContentContainer">
            <div className="gerenteTextContainer">
              <div className="gerenteStatsBox">
                <h3 className="gerenteStatsTitle">Gráfica de transacciones completadas en el mes de Febrero</h3>
                <ul className="gerenteStatsList">
                  <li className="gerenteStatsItem">
                    <span className="gerenteCheckMark">✓</span>
                    <span>Hubo un aumento en la tasa de préstamos diarios</span>
                  </li>
                  <li className="gerenteStatsItem">
                    <span className="gerenteCheckMark">✓</span>
                    <span>Algunas sucursales tuvieron problemas con los retiros</span>
                  </li>
                </ul>
              </div>
              <div className="gerenteBranchesBox">
                <h3 className="gerenteBranchesTitle">Sucursales con más préstamos completados:</h3>
                <ul className="gerenteBranchesList">
                  <li className="gerenteBranchItem">
                    <span className="gerenteCheckMark">1.</span>
                    <span>Sucursal El Paseo</span>
                  </li>
                  <li className="gerenteBranchItem">
                    <span className="gerenteCheckMark">2.</span>
                    <span>Sucursal Buena Vista</span>
                  </li>
                  <li className="gerenteBranchItem">
                    <span className="gerenteCheckMark">3.</span>
                    <span>Sucursal Amanecer</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="gerenteImagesContainer">
              <img src="/assets/grafica.png" alt="Gráfica de transacciones" className="gerenteStatsImage" />
              <img src="/assets/sucursal.png" alt="Sucursal" className="gerenteBranchImage" />
            </div>
          </div>
        </div>
        <div className="gerenteContinueButtonContainer">
          <button className="gerenteContinueButton" onClick={() => navigate("/dashboard-gerente")}>
            Continuar
          </button>
        </div>
      </main>
    </div>
  )
}

export default GerentePage
