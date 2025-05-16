"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./style/Movimientos.css"

interface Movimiento {
  name: string
  accountType: string
  accountNumber: string
  date: string
}

const Movimientos: React.FC = () => {
  const navigate = useNavigate()
  const [menuVisible, setMenuVisible] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Movimiento | null>(null)

  const handleLogout = () => {
    navigate("/login")
  }

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }

  const handleClose = () => {
    setSelectedClient(null)
  }

  const movimientos: Movimiento[] = [
    { name: "Juan Manuel", accountType: "Cuenta Corriente", accountNumber: "78509685678758", date: "04/05/2023" },
    { name: "Mercado Duvan", accountType: "Ahorros", accountNumber: "78509685678759", date: "04/05/2023" },
    { name: "Mirna Lopez", accountType: "Cuenta Corriente", accountNumber: "78509685678760", date: "04/05/2023" },
    { name: "Susana Lima", accountType: "Ahorros", accountNumber: "78509685678761", date: "04/05/2023" },
  ]

  const handleClientSelect = (movimiento: Movimiento) => {
    setSelectedClient(movimiento)
  }

  return (
    <div className="movimientosContainer">
      <header className="movimientosHeader">
        <div className="movimientosLogoContainer">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="movimientosLogo" />
        </div>
        <h1 className="movimientosTitle">Movimientos</h1>
        <div className="movimientosUserMenu">
          <button className="movimientosAvatar" onClick={toggleMenu}>
            <img src="/assets/Usuario.png" alt="Usuario" className="movimientosAvatarImage" />
          </button>
          {menuVisible && (
            <div className="movimientosMenuDropdown">
              <button className="movimientosMenuItem" onClick={() => handleNavigate("/perfil-gerente")}>Perfil</button>
              <button className="movimientosMenuItem" onClick={() => handleNavigate("/configuracion-gerente")}>Configuración</button>
              <button className="movimientosMenuItem" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </header>

      <main className="movimientosMain">
        <div className="movimientosContentContainer">
          <div className="movimientosList">
            <h2 className="movimientosListTitle">Movimientos</h2>
            {movimientos.map((movimiento, index) => (
              <div key={index} className="movimientosClientItem" onClick={() => handleClientSelect(movimiento)}>
                <div className="movimientosClientInfo">
                  <p className="movimientosClientName">{movimiento.name}</p>
                  <p className="movimientosClientAccountType">{movimiento.accountType}</p>
                </div>
                <p className="movimientosClientDate">{movimiento.date}</p>
              </div>
            ))}
          </div>
          <div className="movimientosClientPreview">
            {selectedClient ? (
              <>
                <img src="/assets/usuario.png" alt="Usuario" className="movimientosPreviewImage" />
                <div className="movimientosPreviewInfo">
                  <p><strong>Nombre:</strong> {selectedClient.name}</p>
                  <p><strong>Tipo de Cuenta:</strong> {selectedClient.accountType}</p>
                  <p><strong>Número de Cuenta:</strong> {selectedClient.accountNumber}</p>
                  <p><strong>Fecha:</strong> {selectedClient.date}</p>
                </div>
              </>
            ) : (
              <p>Seleccione un movimiento para ver los detalles.</p>
            )}
          </div>
        </div>
        <button className="movimientosReturnButton" onClick={() => navigate(-1)}>Regresar</button>
      </main>
    </div>
  )
}

export default Movimientos
