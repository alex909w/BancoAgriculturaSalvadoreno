"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./style/ConfiguracionGerente.css"
import { authService } from "../lib/auth"

const ConfiguracionPage: React.FC = () => {
  const navigate = useNavigate()
  const [menuVisible, setMenuVisible] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    authService.logout()
    navigate("/login")
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuVisible(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="configuracionDashboardContainer">
      <header className="configuracionDashboardHeader">
        <div className="configuracionLogoContainer">
          <img src="/assets/logo-login.png" alt="Logo" className="configuracionLogo" />
        </div>

        <h1 className="configuracionDashboardTitle">Configuración</h1>

        <div className="configuracionAvatar" ref={menuRef}>
          <button className="configuracionAvatar" onClick={() => setMenuVisible(!menuVisible)}>
            <img src="/assets/Usuario.png" alt="Usuario" className="configuracionAvatarImage" />
          </button>

          {menuVisible && (
            <div className="configuracionMenuDropdown">
              <button
                className="configuracionMenuItem"
                onClick={() => {
                  setMenuVisible(false)
                  navigate("/perfil-cajero")
                }}
              >
                Perfil
              </button>
              <button
                className="configuracionMenuItem"
                onClick={() => {
                  setMenuVisible(false)
                  navigate("/configuracion-cajero")
                }}
              >
                Configuración
              </button>
              <button
                className="configuracionMenuItem"
                onClick={() => {
                  setMenuVisible(false)
                  handleLogout()
                }}
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="configuracionDashboardMain">
        <div className="configuracionContentContainer">
          <h2 className="configuracionTitle">Configuración de cuenta</h2>
          <form className="configuracionForm">
            <div className="configuracionFormGroup">
              <label htmlFor="nombre" className="configuracionLabel">
                Nombre
              </label>
              <input type="text" id="nombre" className="configuracionInput" placeholder="Ingresa tu nombre" />
            </div>
            <div className="configuracionFormGroup">
              <label htmlFor="email" className="configuracionLabel">
                Correo Electrónico
              </label>
              <input type="email" id="email" className="configuracionInput" placeholder="correo@ejemplo.com" />
            </div>
            <div className="configuracionFormGroup">
              <label htmlFor="password" className="configuracionLabel">
                Contraseña
              </label>
              <input type="password" id="password" className="configuracionInput" placeholder="********" />
            </div>
            <div className="configuracionButtonContainer">
              <button type="submit" className="configuracionSaveButton">
                Guardar Cambios
              </button>
              <button type="button" className="gerenteConfiguracionReturnButton" onClick={() => navigate(-1)}>
                Regresar
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default ConfiguracionPage
