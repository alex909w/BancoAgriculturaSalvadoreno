"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./style/AdminPage.css"

const BienvenidaAdmin: React.FC = () => {
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
    <div className="bienvenidaAdminContainer">
      <header className="bienvenidaAdminHeader">
        <div className="bienvenidaAdminLogoContainer">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="bienvenidaAdminLogo" />
        </div>
        <h1 className="bienvenidaAdminTitle">Bienvenido, Administrador</h1>
        <div className="bienvenidaAdminUserMenu">
          <button className="bienvenidaAdminAvatar" onClick={toggleMenu}>
            <img src="/assets/Usuario.png" alt="Usuario" className="bienvenidaAdminAvatarImage" />
          </button>
          {menuVisible && (
            <div className="bienvenidaAdminMenuDropdown">
              <button className="bienvenidaAdminMenuItem" onClick={() => handleNavigate("/perfil-admin")}>Perfil</button>
              <button className="bienvenidaAdminMenuItem" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </header>

      <main className="bienvenidaAdminMain">
        <div className="bienvenidaAdminContent">
          <img src="/assets/admin.png" alt="Icono de Administrador" className="bienvenidaAdminIcon" />
          <p>¡Bienvenido al Panel de Administrador!</p>
          <button className="bienvenidaAdminButton" onClick={() => handleNavigate("/dashboard-admin")}>
            Ir al Dashboard
          </button>
        </div>
      </main>
    </div>
  )
}

export default BienvenidaAdmin
