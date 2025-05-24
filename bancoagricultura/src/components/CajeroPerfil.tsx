"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./style/CajeroPerfil.css"

const CajeroPerfilPage: React.FC = () => {
  const navigate = useNavigate()
  const [menuVisible, setMenuVisible] = useState(false)

  const handleLogout = () => {
    navigate("/login")
  }

  const handleGoBack = () => {
    navigate("/dashboard-cajero") // Cambiar a dashboard en lugar de cajero-page
  }

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }

  return (
    <div className="cajeroPerfilDashboardContainer">
      <header className="cajeroPerfilDashboardHeader">
        <div className="cajeroPerfilLogoContainer">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="cajeroPerfilLogo" />
        </div>
        <div className="cajeroPerfilUserMenu">
          <button className="cajeroPerfilAvatar" onClick={toggleMenu}>
            <img src="/assets/Usuario.png" alt="Usuario" className="cajeroPerfilAvatarImage" />
          </button>
          {menuVisible && (
            <div className="cajeroPerfilMenuDropdown">
              <button className="cajeroPerfilMenuItem" onClick={() => navigate("/perfil-cajero")}>
                Perfil
              </button>
              <button className="cajeroPerfilMenuItem" onClick={() => navigate("/configuracion-cajero")}>
                Configuración
              </button>
              <button className="cajeroPerfilMenuItem" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="cajeroPerfilDashboardMain">
        <div className="cajeroPerfilContentContainer">
          <h2 className="cajeroPerfilTitle">Información del Perfil</h2>
          <div className="cajeroPerfilInfo">
            <div className="cajeroPerfilImageContainer">
              <img src="/assets/usuario.png" alt="Usuario" className="cajeroPerfilUserImage" />
            </div>
            <div className="cajeroPerfilDetails">
              <p className="cajeroPerfilDetailItem">
                <strong>Nombre:</strong> Juan Pérez
              </p>
              <p className="cajeroPerfilDetailItem">
                <strong>Email:</strong> juan.perez@example.com
              </p>
              <p className="cajeroPerfilDetailItem">
                <strong>Teléfono:</strong> +123 456 7890
              </p>
              <p className="cajeroPerfilDetailItem">
                <strong>Dirección:</strong> 123 Calle Principal, Ciudad
              </p>
              <p className="cajeroPerfilDetailItem">
                <strong>Profesión:</strong> Cajero
              </p>
            </div>
          </div>
          <div className="cajeroPerfilButtonContainer">
            <button className="cajeroPerfilEditButton">Editar Perfil</button>
            <button className="cajeroPerfilReturnButton" onClick={() => navigate("/dashboard-cajero")}>
              Regresar
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CajeroPerfilPage
