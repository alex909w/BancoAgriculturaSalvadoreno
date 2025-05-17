"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./style/ReportesEstadisticas.css"

const ReportesEstadisticas: React.FC = () => {
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

  // Datos de ejemplo para las estadísticas
  const statistics = {
    totalUsers: 150,
    activeUsers: 120,
    totalTransactions: 500,
    totalBalance: "100,000.00 US",
  }

  return (
    <div className="reportesEstadisticasContainer">
      <header className="reportesEstadisticasHeader">
        <div className="reportesEstadisticasLogoContainer">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="reportesEstadisticasLogo" />
        </div>
        <h1 className="reportesEstadisticasTitle">Reportes y Estadísticas</h1>
        <div className="reportesEstadisticasUserMenu">
          <button className="reportesEstadisticasAvatar" onClick={toggleMenu}>
            <img src="/assets/Usuario.png" alt="Usuario" className="reportesEstadisticasAvatarImage" />
          </button>
          {menuVisible && (
            <div className="reportesEstadisticasMenuDropdown">
              <button className="reportesEstadisticasMenuItem" onClick={() => handleNavigate("/perfil-admin")}>Perfil</button>
              <button className="reportesEstadisticasMenuItem" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </header>

      <main className="reportesEstadisticasMain">
        <div className="reportesEstadisticasContent">
          <h2>Estadísticas del Sistema</h2>
          <div className="reportesEstadisticasStats">
            <div className="reportesEstadisticasStat">
              <h3>Usuarios Totales</h3>
              <p>{statistics.totalUsers}</p>
            </div>
            <div className="reportesEstadisticasStat">
              <h3>Usuarios Activos</h3>
              <p>{statistics.activeUsers}</p>
            </div>
            <div className="reportesEstadisticasStat">
              <h3>Transacciones Totales</h3>
              <p>{statistics.totalTransactions}</p>
            </div>
            <div className="reportesEstadisticasStat">
              <h3>Saldo Total</h3>
              <p>{statistics.totalBalance}</p>
            </div>
          </div>
        </div>
        <button className="reportesEstadisticasReturnButton" onClick={() => navigate(-1)}>Regresar</button>
      </main>
    </div>
  )
}

export default ReportesEstadisticas
