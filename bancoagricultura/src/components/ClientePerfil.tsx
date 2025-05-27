"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./style/ClientePerfil.css"

const ClientePerfilPage: React.FC = () => {
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
    <div className="clientePerfilContainer">
      <header className="clientePerfilHeader">
        <div className="clientePerfilLogoContainer">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="clientePerfilLogo" />
        </div>
        <div className="clientePerfilUserMenu">
          <button className="clientePerfilAvatar" onClick={toggleMenu}>
            <img src="/assets/Usuario.png" alt="Usuario" className="clientePerfilAvatarImage" />
          </button>
          {menuVisible && (
            <div className="clientePerfilMenuDropdown">
              <button className="clientePerfilMenuItem" onClick={() => navigate("/perfil-cliente")}>Perfil</button>
              <button className="clientePerfilMenuItem" onClick={() => navigate("/configuracion-cliente")}>Configuración</button>
              <button className="clientePerfilMenuItem" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </header>

      <main className="clientePerfilMain">
        <div className="clientePerfilContentContainer">
          <h2 className="clientePerfilTitle">Información del Perfil</h2>
          <div className="clientePerfilInfo">
            <div className="clientePerfilImageContainer">
              <img src="/assets/usuario.png" alt="Usuario" className="clientePerfilUserImage" />
            </div>
            <div className="clientePerfilDetails">
              <p className="clientePerfilDetailItem"><strong>Nombre:</strong> Juan Pérez</p>
              <p className="clientePerfilDetailItem"><strong>Email:</strong> juan.perez@example.com</p>
              <p className="clientePerfilDetailItem"><strong>Teléfono:</strong> +123 456 7890</p>
              <p className="clientePerfilDetailItem"><strong>Dirección:</strong> 123 Calle Principal, Ciudad</p>
              <p className="clientePerfilDetailItem"><strong>Profesión:</strong> Cliente</p>
            </div>
          </div>
          <div className="clientePerfilButtonContainer">
            <button className="clientePerfilEditButton">Editar Perfil</button>
              <button type="button" className="clientePerfilReturnButton" onClick={() => navigate(-1)}>
              Regresar 
              </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ClientePerfilPage
