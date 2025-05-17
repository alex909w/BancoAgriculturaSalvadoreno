"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./style/GestionCuentas.css"

const GestionCuentas: React.FC = () => {
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

  // Datos de ejemplo para las cuentas
  const accounts = [
    { id: 1, number: "652732736823", balance: "75.45 US", type: "Ahorros" },
    { id: 2, number: "657687676666", balance: "232.00 US", type: "Corriente" },
  ]

  return (
    <div className="gestionCuentasContainer">
      <header className="gestionCuentasHeader">
        <div className="gestionCuentasLogoContainer">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="gestionCuentasLogo" />
        </div>
        <h1 className="gestionCuentasTitle">Gestión de Cuentas</h1>
        <div className="gestionCuentasUserMenu">
          <button className="gestionCuentasAvatar" onClick={toggleMenu}>
            <img src="/assets/Usuario.png" alt="Usuario" className="gestionCuentasAvatarImage" />
          </button>
          {menuVisible && (
            <div className="gestionCuentasMenuDropdown">
              <button className="gestionCuentasMenuItem" onClick={() => handleNavigate("/perfil-admin")}>Perfil</button>
              <button className="gestionCuentasMenuItem" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </header>

      <main className="gestionCuentasMain">
        <div className="gestionCuentasContent">
          <h2>Lista de Cuentas</h2>
          <div className="gestionCuentasList">
            {accounts.map((account) => (
              <div key={account.id} className="gestionCuentasItem">
                <p><strong>Número de Cuenta:</strong> {account.number}</p>
                <p><strong>Saldo:</strong> {account.balance}</p>
                <p><strong>Tipo de Cuenta:</strong> {account.type}</p>
              </div>
            ))}
          </div>
        </div>
        <button className="gestionCuentasReturnButton" onClick={() => navigate(-1)}>Regresar</button>
      </main>
    </div>
  )
}

export default GestionCuentas
