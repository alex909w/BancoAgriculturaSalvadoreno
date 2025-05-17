"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./style/DashboardAdmin.css"

const DashboardAdmin: React.FC = () => {
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
    <div className="adminDashboardContainer">
      <header className="adminDashboardHeader">
        <div className="adminLogoContainer">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="adminLogo" />
        </div>
        <h1 className="adminDashboardTitle">Panel de Administrador</h1>
        <div className="adminUserMenu">
          <button className="adminAvatar" onClick={toggleMenu}>
            <img src="/assets/Usuario.png" alt="Usuario" className="adminAvatarImage" />
          </button>
          {menuVisible && (
            <div className="adminMenuDropdown">
              <button className="adminMenuItem" onClick={() => handleNavigate("/perfil-admin")}>Perfil</button>
              <button className="adminMenuItem" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </header>

      <main className="adminDashboardMain">
        <div className="adminDashboardWelcomeBox">
          <img src="/assets/admin.png" alt="Icono de Administrador" className="adminDashboardIcon" />
          <p className="adminDashboardWelcomeText">Selecciona una opción</p>
        </div>
        <div className="adminDashboardOptions">
          <div className="adminDashboardOption" onClick={() => handleNavigate("/resumen-usuarios")}>
            <h3>Resumen de Usuarios</h3>
            <p>Ver resumen de usuarios registrados</p>
          </div>
          <div className="adminDashboardOption" onClick={() => handleNavigate("/gestion-cuentas")}>
            <h3>Gestión de Cuentas</h3>
            <p>Gestionar cuentas de usuarios</p>
          </div>
          <div className="adminDashboardOption" onClick={() => handleNavigate("/transacciones-recientes")}>
            <h3>Transacciones Recientes</h3>
            <p>Ver transacciones recientes</p>
          </div>
          <div className="adminDashboardOption" onClick={() => handleNavigate("/reportes-estadisticas")}>
            <h3>Reportes y Estadísticas</h3>
            <p>Acceder a reportes y estadísticas</p>
          </div>
          <div className="adminDashboardOption" onClick={() => handleNavigate("/configuracion-sistema")}>
            <h3>Configuración del Sistema</h3>
            <p>Configurar el sistema</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardAdmin
