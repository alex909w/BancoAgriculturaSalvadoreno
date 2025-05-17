"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./style/ConfiguracionSistema.css"

const ConfiguracionSistema: React.FC = () => {
  const navigate = useNavigate()
  const [menuVisible, setMenuVisible] = useState(false)
  const [formData, setFormData] = useState({
    notifications: true,
    language: "español",
  })

  const handleLogout = () => {
    navigate("/login")
  }

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const isCheckbox = (e.target as HTMLInputElement).type === "checkbox"
    setFormData({
      ...formData,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Configuración guardada")
  }

  return (
    <div className="configuracionSistemaContainer">
      <header className="configuracionSistemaHeader">
        <div className="configuracionSistemaLogoContainer">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="configuracionSistemaLogo" />
        </div>
        <h1 className="configuracionSistemaTitle">Configuración del Sistema</h1>
        <div className="configuracionSistemaUserMenu">
          <button className="configuracionSistemaAvatar" onClick={toggleMenu}>
            <img src="/assets/Usuario.png" alt="Usuario" className="configuracionSistemaAvatarImage" />
          </button>
          {menuVisible && (
            <div className="configuracionSistemaMenuDropdown">
              <button className="configuracionSistemaMenuItem" onClick={() => handleNavigate("/perfil-admin")}>Perfil</button>
              <button className="configuracionSistemaMenuItem" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </header>

      <main className="configuracionSistemaMain">
        <div className="configuracionSistemaContent">
          <h2>Configuración del Sistema</h2>
          <form className="configuracionSistemaForm" onSubmit={handleSubmit}>
            <div className="configuracionSistemaFormGroup">
              <label className="configuracionSistemaLabel">
                <input type="checkbox" name="notifications" checked={formData.notifications} onChange={handleChange} />
                Activar Notificaciones
              </label>
            </div>
            <div className="configuracionSistemaFormGroup">
              <label htmlFor="language" className="configuracionSistemaLabel">Idioma:</label>
              <select id="language" name="language" className="configuracionSistemaInput" value={formData.language} onChange={handleChange}>
                <option value="español">Español</option>
                <option value="ingles">Inglés</option>
              </select>
            </div>
            <button type="submit" className="configuracionSistemaSaveButton">Guardar Configuración</button>
          </form>
        </div>
        <button className="configuracionSistemaReturnButton" onClick={() => navigate(-1)}>Regresar</button>
      </main>
    </div>
  )
}

export default ConfiguracionSistema
