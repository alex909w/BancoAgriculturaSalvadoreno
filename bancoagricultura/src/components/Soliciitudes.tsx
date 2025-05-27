"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./style/Solicitudes.css"

interface Client {
  name: string
  position: string
  date: string
  sucursal: string
  dui: string
  salary: string
}

const Solicitudes: React.FC = () => {
  const navigate = useNavigate()
  const [menuVisible, setMenuVisible] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

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

  const clients: Client[] = [
    { name: "Juan Manuel Díaz Marquez", position: "Limpieza", date: "23/12/23", sucursal: "Altamira", dui: "3423232332", salary: "365" },
    { name: "Mercado Duvan", position: "Cajero", date: "23/12/23", sucursal: "Altamira", dui: "3423232333", salary: "400" },
    { name: "Mirna Lopez", position: "Secretaria", date: "23/12/23", sucursal: "Altamira", dui: "3423232334", salary: "500" },
    { name: "Susana Lima", position: "Recepcionista", date: "23/12/23", sucursal: "Altamira", dui: "3423232335", salary: "450" },
  ]

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client)
  }

  return (
    <div className="solicitudesContainer">
      <header className="solicitudesHeader">
        <div className="solicitudesLogoContainer">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="solicitudesLogo" />
        </div>
        <h1 className="solicitudesTitle">Solicitudes</h1>
        <div className="solicitudesUserMenu">
          <button className="solicitudesAvatar" onClick={toggleMenu}>
            <img src="/assets/Usuario.png" alt="Usuario" className="solicitudesAvatarImage" />
          </button>
          {menuVisible && (
            <div className="solicitudesMenuDropdown">
              <button className="solicitudesMenuItem" onClick={() => handleNavigate("/perfil-gerente")}>Perfil</button>
              <button className="solicitudesMenuItem" onClick={() => handleNavigate("/configuracion-gerente")}>Configuración</button>
              <button className="solicitudesMenuItem" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </header>

      <main className="solicitudesMain">
        <div className="solicitudesContentContainer">
          <div className="solicitudesList">
            <h2 className="solicitudesListTitle">Solicitudes</h2>
            {clients.map((client, index) => (
              <div key={index} className="solicitudesClientItem" onClick={() => handleClientSelect(client)}>
                <div className="solicitudesClientInfo">
                  <p className="solicitudesClientName">{client.name}</p>
                  <p className="solicitudesClientPosition">{client.position}</p>
                </div>
                <p className="solicitudesClientDate">{client.date}</p>
              </div>
            ))}
          </div>
          <div className="solicitudesClientPreview">
            {selectedClient ? (
              <>
                <img src="/assets/usuario.png" alt="Usuario" className="solicitudesPreviewImage" />
                <div className="solicitudesPreviewInfo">
                  <p><strong>Nombre:</strong> {selectedClient.name}</p>
                  <p><strong>Sucursal:</strong> {selectedClient.sucursal}</p>
                  <p><strong>DUI:</strong> {selectedClient.dui}</p>
                  <p><strong>Puesto:</strong> {selectedClient.position}</p>
                  <p><strong>Salario:</strong> {selectedClient.salary}</p>
                </div>
              </>
            ) : (
              <p>Seleccione un cliente para ver los detalles.</p>
            )}
          </div>
        </div>
        <button className="solicitudesReturnButton" onClick={() => navigate(-1)}>Regresar</button>
      </main>
    </div>
  )
}

export default Solicitudes
