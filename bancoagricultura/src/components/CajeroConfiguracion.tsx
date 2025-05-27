"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./style/CajeroConfiguracion.css"

const CajeroConfiguracionPage: React.FC = () => {
  const navigate = useNavigate()
  const [menuVisible, setMenuVisible] = useState(false)

  const handleLogout = () => {
    navigate("/login")
  }

  const handleGoBack = () => {
    navigate("/cajero-page") // Asegúrate de que esta ruta esté configurada en tu aplicación
  }

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }

  return (
    <div className="cajeroConfiguracionDashboardContainer">
      <header className="cajeroConfiguracionDashboardHeader">
        <div className="cajeroConfiguracionLogoContainer">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="cajeroConfiguracionLogo" />
        </div>
        <div className="cajeroConfiguracionUserMenu">
          <button className="cajeroConfiguracionAvatar" onClick={toggleMenu}>
            <img src="/assets/Usuario.png" alt="Usuario" className="cajeroConfiguracionAvatarImage" />
          </button>
          {menuVisible && (
            <div className="cajeroConfiguracionMenuDropdown">
              <button className="cajeroConfiguracionMenuItem" onClick={() => navigate("/perfil-cajero")}>Perfil</button>
              <button className="cajeroConfiguracionMenuItem" onClick={() => navigate("/configuracion-cajero")}>Configuración</button>
              <button className="cajeroConfiguracionMenuItem" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </header>

      <main className="cajeroConfiguracionDashboardMain">
        <div className="cajeroConfiguracionContentContainer">
          <h2 className="cajeroConfiguracionTitle">Ajustes de Cuenta</h2>
          <div className="cajeroConfiguracionForm">
            <div className="cajeroConfiguracionFormGroup">
              <label htmlFor="nombre" className="cajeroConfiguracionLabel">Nombre:</label>
              <input type="text" id="nombre" className="cajeroConfiguracionInput" />
            </div>
            <div className="cajeroConfiguracionFormGroup">
              <label htmlFor="email" className="cajeroConfiguracionLabel">Email:</label>
              <input type="email" id="email" className="cajeroConfiguracionInput" />
            </div>
            <div className="cajeroConfiguracionFormGroup">
              <label htmlFor="contrasena" className="cajeroConfiguracionLabel">Contraseña:</label>
              <input type="password" id="contrasena" className="cajeroConfiguracionInput" />
            </div>
            <div className="cajeroConfiguracionButtonContainer">
              <button className="cajeroConfiguracionSaveButton">Guardar Cambios</button>
              <button className="cajeroConfiguracionReturnButton" onClick={() => navigate("/dashboard-cajero")}>
                Regresar
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CajeroConfiguracionPage
