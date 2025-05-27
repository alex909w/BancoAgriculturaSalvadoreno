"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./style/TransaccionesRecientes.css"

const TransaccionesRecientes: React.FC = () => {
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

  // Datos de ejemplo para las transacciones
  const transactions = [
    { id: 1, date: "23/12/23", description: "Depósito", amount: "100.00 US", type: "Ingreso" },
    { id: 2, date: "23/12/23", description: "Retiro", amount: "50.00 US", type: "Egreso" },
  ]

  return (
    <div className="transaccionesRecientesContainer">
      <header className="transaccionesRecientesHeader">
        <div className="transaccionesRecientesLogoContainer">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="transaccionesRecientesLogo" />
        </div>
        <h1 className="transaccionesRecientesTitle">Transacciones Recientes</h1>
        <div className="transaccionesRecientesUserMenu">
          <button className="transaccionesRecientesAvatar" onClick={toggleMenu}>
            <img src="/assets/Usuario.png" alt="Usuario" className="transaccionesRecientesAvatarImage" />
          </button>
          {menuVisible && (
            <div className="transaccionesRecientesMenuDropdown">
              <button className="transaccionesRecientesMenuItem" onClick={() => handleNavigate("/perfil-admin")}>Perfil</button>
              <button className="transaccionesRecientesMenuItem" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </header>

      <main className="transaccionesRecientesMain">
        <div className="transaccionesRecientesContent">
          <h2>Transacciones Recientes</h2>
          <div className="transaccionesRecientesList">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="transaccionesRecientesItem">
                <p><strong>Fecha:</strong> {transaction.date}</p>
                <p><strong>Descripción:</strong> {transaction.description}</p>
                <p><strong>Monto:</strong> {transaction.amount}</p>
                <p><strong>Tipo:</strong> {transaction.type}</p>
              </div>
            ))}
          </div>
        </div>
        <button className="transaccionesRecientesReturnButton" onClick={() => navigate(-1)}>Regresar</button>
      </main>
    </div>
  )
}

export default TransaccionesRecientes
