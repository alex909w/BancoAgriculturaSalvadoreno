"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./style/ClienteConfiguracion.css"

const ClienteConfiguracionPage: React.FC = () => {
  const navigate = useNavigate()
  const [menuVisible, setMenuVisible] = useState(false)

  const handleLogout = () => {
    navigate("/login")
  }

  const handleGoBack = () => {
    navigate("/cliente-page") // Asegúrate de que esta ruta esté configurada en tu aplicación
  }

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }

  return (
    <div className="clienteConfiguracionContainer">
      <header className="clienteConfiguracionHeader">
        <div className="clienteConfiguracionLogoContainer">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="clienteConfiguracionLogo" />
        </div>
        <div className="clienteConfiguracionUserMenu">
          <button className="clienteConfiguracionAvatar" onClick={toggleMenu}>
            <img src="/assets/Usuario.png" alt="Usuario" className="clienteConfiguracionAvatarImage" />
          </button>
          {menuVisible && (
            <div className="clienteConfiguracionMenuDropdown">
              <button className="clienteConfiguracionMenuItem" onClick={() => navigate("/perfil-cliente")}>Perfil</button>
              <button className="clienteConfiguracionMenuItem" onClick={() => navigate("/configuracion-cliente")}>Configuración</button>
              <button className="clienteConfiguracionMenuItem" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </header>

      <main className="clienteConfiguracionMain">
        <div className="clienteConfiguracionContentContainer">
          <h2 className="clienteConfiguracionTitle">Ajustes de Cuenta</h2>
          <div className="clienteConfiguracionForm">
            <div className="clienteConfiguracionFormGroup">
              <label htmlFor="nombre" className="clienteConfiguracionLabel">Nombre:</label>
              <input type="text" id="nombre" className="clienteConfiguracionInput" />
            </div>
            <div className="clienteConfiguracionFormGroup">
              <label htmlFor="email" className="clienteConfiguracionLabel">Email:</label>
              <input type="email" id="email" className="clienteConfiguracionInput" />
            </div>
            <div className="clienteConfiguracionFormGroup">
              <label htmlFor="contrasena" className="clienteConfiguracionLabel">Contraseña:</label>
              <input type="password" id="contrasena" className="clienteConfiguracionInput" />
            </div>
            <div className="clienteConfiguracionButtonContainer">
              <button className="clienteConfiguracionSaveButton">Guardar Cambios</button>
                <button type="button" className="clienteConfiguracionReturnButton" onClick={() => navigate(-1)}>
              Regresar </button>
            
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ClienteConfiguracionPage
