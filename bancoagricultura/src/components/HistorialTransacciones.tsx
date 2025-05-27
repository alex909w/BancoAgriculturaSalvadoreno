"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./style/HistorialTransacciones.css"

interface Transaction {
  id: string
  date: string
  description: string
  amount: string
  type: string
}

const HistorialTransacciones: React.FC = () => {
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
  const transactions: Transaction[] = [
    { id: "1", date: "23/12/23", description: "Descripción", amount: "75.45 US", type: "ingreso" },
    { id: "2", date: "23/12/23", description: "Descripción", amount: "75.45 US", type: "ingreso" },
    { id: "3", date: "23/12/23", description: "Descripción", amount: "75.45 US", type: "egreso" },
    { id: "4", date: "23/12/23", description: "Descripción", amount: "75.45 US", type: "egreso" },
  ]

  return (
    <div className="historialTransaccionesContainer">
      <header className="historialTransaccionesHeader">
        <div className="historialTransaccionesLogoContainer">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="historialTransaccionesLogo" />
        </div>
        <h1 className="historialTransaccionesTitle">Transacciones</h1>
        <div className="historialTransaccionesUserMenu">
          <button className="historialTransaccionesAvatar" onClick={toggleMenu}>
            <img src="/assets/Usuario.png" alt="Usuario" className="historialTransaccionesAvatarImage" />
          </button>
          {menuVisible && (
            <div className="historialTransaccionesMenuDropdown">
              <button className="historialTransaccionesMenuItem" onClick={() => handleNavigate("/perfil-cliente")}>Perfil</button>
              <button className="historialTransaccionesMenuItem" onClick={() => handleNavigate("/configuracion-cliente")}>Configuración</button>
              <button className="historialTransaccionesMenuItem" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </header>

      <main className="historialTransaccionesMain">
        <div className="historialTransaccionesContentContainer">
          <div className="historialTransaccionesFilter">
            <label>Filtrar por:</label>
            <select>
              <option value="todos">todos</option>
            </select>
          </div>
          <div className="historialTransaccionesList">
            <div className="historialTransaccionesColumn">
              <h3>INGRESOS</h3>
              {transactions.filter(transaction => transaction.type === "ingreso").map((transaction) => (
                <div key={transaction.id} className="historialTransaccionesItem">
                  <p className="historialTransaccionesItemDescription">{transaction.description}</p>
                  <p className={`historialTransaccionesItemAmount ${transaction.type}`}>{transaction.amount}</p>
                  <p className="historialTransaccionesItemDate">{transaction.date}</p>
                </div>
              ))}
            </div>
            <div className="historialTransaccionesColumn">
              <h3>EGRESOS</h3>
              {transactions.filter(transaction => transaction.type === "egreso").map((transaction) => (
                <div key={transaction.id} className="historialTransaccionesItem">
                  <p className="historialTransaccionesItemDescription">{transaction.description}</p>
                  <p className={`historialTransaccionesItemAmount ${transaction.type}`}>{transaction.amount}</p>
                  <p className="historialTransaccionesItemDate">{transaction.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button className="historialTransaccionesReturnButton" onClick={() => navigate(-1)}>Regresar</button>
      </main>
    </div>
  )
}

export default HistorialTransacciones
