"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./style/NuevaSucursal.css"

interface Gerente {
  name: string
  sucursal: string
  dui: string
  puesto: string
  salario: string
}

const NuevaSucursal: React.FC = () => {
  const navigate = useNavigate()
  const [menuVisible, setMenuVisible] = useState(false)
  const [formData, setFormData] = useState({
    sucursal: "",
    departamento: "",
    ubicacion: "",
    tipo: "",
  })

  const gerente: Gerente = {
    name: "Juan Manuel Díaz Marquez",
    sucursal: "Altamira",
    dui: "3423232332",
    puesto: "Sub-Gerente",
    salario: "365",
  }

  const handleLogout = () => {
    navigate("/login")
  }

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí puedes agregar la lógica para procesar la nueva sucursal
    console.log("Nueva Sucursal registrada:", formData)
  }

  return (
    <div className="nuevaSucursalContainer">
      <header className="nuevaSucursalHeader">
        <div className="nuevaSucursalLogoContainer">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="nuevaSucursalLogo" />
        </div>
        <h1 className="nuevaSucursalTitle">Sucursales</h1>
        <div className="nuevaSucursalUserMenu">
          <button className="nuevaSucursalAvatar" onClick={toggleMenu}>
            <img src="/assets/Usuario.png" alt="Usuario" className="nuevaSucursalAvatarImage" />
          </button>
          {menuVisible && (
            <div className="nuevaSucursalMenuDropdown">
              <button className="nuevaSucursalMenuItem" onClick={() => handleNavigate("/perfil-gerente")}>Perfil</button>
              <button className="nuevaSucursalMenuItem" onClick={() => handleNavigate("/configuracion-gerente")}>Configuración</button>
              <button className="nuevaSucursalMenuItem" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </header>

      <main className="nuevaSucursalMain">
        <div className="nuevaSucursalContentContainer">
          <form className="nuevaSucursalForm" onSubmit={handleSubmit}>
            <div className="nuevaSucursalFormGroup">
              <label htmlFor="sucursal" className="nuevaSucursalLabel">Sucursal:</label>
              <input type="text" id="sucursal" name="sucursal" className="nuevaSucursalInput" value={formData.sucursal} onChange={handleChange} required />
            </div>
            <div className="nuevaSucursalFormGroup">
              <label htmlFor="departamento" className="nuevaSucursalLabel">Departamento:</label>
              <input type="text" id="departamento" name="departamento" className="nuevaSucursalInput" value={formData.departamento} onChange={handleChange} required />
            </div>
            <div className="nuevaSucursalFormGroup">
              <label htmlFor="ubicacion" className="nuevaSucursalLabel">Ubicación:</label>
              <input type="text" id="ubicacion" name="ubicacion" className="nuevaSucursalInput" value={formData.ubicacion} onChange={handleChange} required />
            </div>
            <div className="nuevaSucursalFormGroup">
              <label htmlFor="tipo" className="nuevaSucursalLabel">Tipo:</label>
              <select id="tipo" name="tipo" className="nuevaSucursalInput" value={formData.tipo} onChange={handleChange} required>
                <option value="">Seleccione un tipo</option>
                <option value="express">Express</option>
                <option value="standard">Standard</option>
              </select>
            </div>
            <div className="nuevaSucursalButtonContainer">
              <button type="submit" className="nuevaSucursalSubmitButton">Aprobar</button>
              <button type="button" className="nuevaSucursalRejectButton">Rechazar</button>
            </div>
          </form>
          <div className="nuevaSucursalPreview">
            <img src="/assets/usuario.png" alt="Usuario" className="nuevaSucursalPreviewImage" />
            <div className="nuevaSucursalPreviewInfo">
              <p><strong>Nombre:</strong> {gerente.name}</p>
              <p><strong>Sucursal:</strong> {gerente.sucursal}</p>
              <p><strong>DUI:</strong> {gerente.dui}</p>
              <p><strong>Puesto:</strong> {gerente.puesto}</p>
              <p><strong>Salario:</strong> {gerente.salario}</p>
            </div>
          </div>
        </div>
        <button className="nuevaSucursalReturnButton" onClick={() => navigate(-1)}>Regresar</button>
      </main>
    </div>
  )
}

export default NuevaSucursal
