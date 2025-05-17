"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./style/AdminConfiguracion.css"

const AdminConfiguracion: React.FC = () => {
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
    <div className="configuracionAdminContainer">
      <header className="configuracionAdminHeader">
        <div className="configuracionAdminLogoContainer">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="configuracionAdminLogo" />
        </div>
        <h1 className="configuracionAdminTitle">Configuración del Administrador</h1>
        <div className="configuracionAdminUserMenu">
          <button className="configuracionAdminAvatar" onClick={toggleMenu}>
            <img src="/assets/Usuario.png" alt="Usuario" className="configuracionAdminAvatarImage" />
          </button>
          {menuVisible && (
            <div className="configuracionAdminMenuDropdown">
              <button className="configuracionAdminMenuItem" onClick={() => handleNavigate("/perfil-admin")}>Perfil</button>
              <button className="configuracionAdminMenuItem" onClick={() => handleNavigate("/configuracion-admin")}>Configuración</button>
              <button className="configuracionAdminMenuItem" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </header>

      <main className="configuracionAdminMain">
        <div className="configuracionAdminContent">
          <h2>Configuración del Sistema</h2>
          <div className="configuracionAdminFormGroup">
            <label htmlFor="notificaciones" className="configuracionAdminLabel">Notificaciones:</label>
            <select id="notificaciones" className="configuracionAdminInput">
              <option value="activadas">Activadas</option>
              <option value="desactivadas">Desactivadas</option>
            </select>
          </div>
          <div className="configuracionAdminFormGroup">
            <label htmlFor="idioma" className="configuracionAdminLabel">Idioma:</label>
            <select id="idioma" className="configuracionAdminInput">
              <option value="español">Español</option>
              <option value="ingles">Inglés</option>
            </select>
          </div>
          <button className="configuracionAdminSaveButton" onClick={() => alert("Configuración guardada")}>Guardar Configuración</button>
        </div>
      </main>
    </div>
  )
}

export default AdminConfiguracion
