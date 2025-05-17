"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./style/ResumenUsuarios.css"

const ResumenUsuarios: React.FC = () => {
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

  // Datos de ejemplo para los usuarios
  const users = [
    { id: 1, name: "Usuario 1", email: "usuario1@example.com", role: "Cliente" },
    { id: 2, name: "Usuario 2", email: "usuario2@example.com", role: "Gerente" },
    { id: 3, name: "Usuario 3", email: "usuario3@example.com", role: "Cliente" },
  ]

  return (
    <div className="resumenUsuariosContainer">
      <header className="resumenUsuariosHeader">
        <div className="resumenUsuariosLogoContainer">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="resumenUsuariosLogo" />
        </div>
        <h1 className="resumenUsuariosTitle">Resumen de Usuarios</h1>
        <div className="resumenUsuariosUserMenu">
          <button className="resumenUsuariosAvatar" onClick={toggleMenu}>
            <img src="/assets/Usuario.png" alt="Usuario" className="resumenUsuariosAvatarImage" />
          </button>
          {menuVisible && (
            <div className="resumenUsuariosMenuDropdown">
              <button className="resumenUsuariosMenuItem" onClick={() => handleNavigate("/perfil-admin")}>Perfil</button>
              <button className="resumenUsuariosMenuItem" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </header>

      <main className="resumenUsuariosMain">
        <div className="resumenUsuariosContent">
          <h2>Lista de Usuarios</h2>
          <div className="resumenUsuariosList">
            {users.map((user) => (
              <div key={user.id} className="resumenUsuariosItem">
                <p><strong>Nombre:</strong> {user.name}</p>
                <p><strong>Correo Electrónico:</strong> {user.email}</p>
                <p><strong>Rol:</strong> {user.role}</p>
              </div>
            ))}
          </div>
        </div>
        <button className="resumenUsuariosReturnButton" onClick={() => navigate(-1)}>Regresar</button>
      </main>
    </div>
  )
}

export default ResumenUsuarios
