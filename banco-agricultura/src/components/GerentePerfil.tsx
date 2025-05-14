"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./style/GerentePerfil.css"

const GerentePerfil: React.FC = () => {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleGoBack = () => {
    navigate("/dashboard-gerente") // Asegúrate de que esta ruta esté configurada en tu aplicación
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const handleNavigate = (path: string) => {
    navigate(path)
    setMenuOpen(false)
  }

  const handleLogout = () => {
    // Agregar lógica para cerrar sesión
  }

  return (
    <div className="gerentePerfilDashboardContainer">
      <header className="gerentePerfilDashboardHeader">
        <div className="gerentePerfilLogoContainer">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="gerentePerfilLogo" />
        </div>
        <h1 className="gerentePerfilDashboardTitle">Perfil</h1>
        <div className="gerentePerfilUserMenu">
          <button className="gerentePerfilAvatar" onClick={toggleMenu}>
            <img src="/assets/Usuario.png" alt="Usuario" className="gerentePerfilAvatarImage" />
          </button>
          {menuOpen && (
            <div className="gerentePerfilMenuDropdown">
              <button className="gerentePerfilMenuItem" onClick={() => navigate("/perfil-cliente")}>Perfil</button>
              <button className="gerentePerfilMenuItem" onClick={() => navigate("/configuracion-cliente")}>Configuración</button>
              <button className="gerentePerfilMenuItem" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </header>

      <main className="gerentePerfilDashboardMain">
        <div className="gerentePerfilContentContainer">
          <h2 className="gerentePerfilTitle">Información del Perfil</h2>
          <div className="gerentePerfilInfo">
            <div className="gerentePerfilImageContainer">
              <img src="/assets/usuario.png" alt="Usuario" className="gerentePerfilUserImage" />
            </div>
            <div className="gerentePerfilDetails">
              <p className="gerentePerfilDetailItem"><strong>Nombre:</strong> Mario Alberto Córdova Moreno</p>
              <p className="gerentePerfilDetailItem"><strong>Email:</strong> mario.cordova@example.com</p>
              <p className="gerentePerfilDetailItem"><strong>Teléfono:</strong> +123 456 7890</p>
              <p className="gerentePerfilDetailItem"><strong>Dirección:</strong> 123 Calle Principal, Ciudad</p>
              <p className="gerentePerfilDetailItem"><strong>Profesión:</strong> Gerente</p>
            </div>
          </div>
          <div className="gerentePerfilButtonContainer">
            <button className="gerentePerfilEditButton">Editar Perfil</button>
            <button className="gerentePerfilReturnButton" onClick={handleGoBack}>Regresar</button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default GerentePerfil
