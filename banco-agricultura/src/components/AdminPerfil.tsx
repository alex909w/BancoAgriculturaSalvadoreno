"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./style/AdminPerfil.css"

const AdminPerfil: React.FC = () => {
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
    <div className="perfilAdminContainer">
      <header className="perfilAdminHeader">
        <div className="perfilAdminLogoContainer">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="perfilAdminLogo" />
        </div>
        <h1 className="perfilAdminTitle">Perfil del Administrador</h1>
        <div className="perfilAdminUserMenu">
          <button className="perfilAdminAvatar" onClick={toggleMenu}>
            <img src="/assets/Usuario.png" alt="Usuario" className="perfilAdminAvatarImage" />
          </button>
          {menuVisible && (
            <div className="perfilAdminMenuDropdown">
              <button className="perfilAdminMenuItem" onClick={() => handleNavigate("/perfil-admin")}>Perfil</button>
              <button className="perfilAdminMenuItem" onClick={() => handleNavigate("/configuracion-admin")}>Configuración</button>
              <button className="perfilAdminMenuItem" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </header>

      <main className="perfilAdminMain">
        <div className="perfilAdminContent">
          <img src="/assets/usuario.png" alt="Icono de Administrador" className="perfilAdminIcon" />
          <div className="perfilAdminInfo">
            <h2>Información del Perfil</h2>
            <p><strong>Nombre:</strong> Administrador</p>
            <p><strong>Correo Electrónico:</strong> admin@example.com</p>
            <p><strong>Rol:</strong> Administrador</p>
            <button className="perfilAdminEditButton" onClick={() => handleNavigate("/editar-perfil-admin")}>Editar Perfil</button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminPerfil
