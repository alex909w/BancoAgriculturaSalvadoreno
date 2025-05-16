"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./style/CrearCliente.css"

const RegistroCliente: React.FC = () => {
  const navigate = useNavigate()
  const [menuVisible, setMenuVisible] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    dui: "",
    domicilio: "",
    profesion: "",
    genero: "",
    salario: "",
    tipoCuenta: "",
    seguro: false,
    sucursalPreferencia: "",
    correoElectronico: "",
    aceptaTerminos: false,
  })
  const [messageVisible, setMessageVisible] = useState(false)

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
    const { name, value, type } = e.target
    const isCheckbox = (e.target as HTMLInputElement).type === "checkbox"
    setFormData({
      ...formData,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí puedes agregar la lógica para guardar los datos del cliente
    console.log("Cliente registrado:", formData)
    setMessageVisible(true)
    setTimeout(() => {
      setMessageVisible(false)
    }, 5000) // El mensaje desaparece después de 5 segundos
  }

  return (
    <div className="registroClienteContainer">
      <header className="registroClienteHeader">
        <div className="registroClienteLogoContainer">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="registroClienteLogo" />
        </div>
        <h1 className="registroClienteTitle">Crear Nuevo Cliente</h1>
        <div className="registroClienteUserMenu">
          <button className="registroClienteAvatar" onClick={toggleMenu}>
            <img src="/assets/Usuario.png" alt="Usuario" className="registroClienteAvatarImage" />
          </button>
          {menuVisible && (
            <div className="registroClienteMenuDropdown">
              <button className="registroClienteMenuItem" onClick={() => handleNavigate("/perfil-cajero")}>Perfil</button>
              <button className="registroClienteMenuItem" onClick={() => handleNavigate("/configuracion-cajero")}>Configuración</button>
              <button className="registroClienteMenuItem" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </header>

      <main className="registroClienteMain">
        <div className="registroClienteContentContainer">
          <form className="registroClienteForm" onSubmit={handleSubmit}>
            <div className="registroClienteFormGroup">
              <label htmlFor="tipoCuenta" className="registroClienteLabel">Tipo de cuenta:</label>
              <select id="tipoCuenta" name="tipoCuenta" className="registroClienteInput" value={formData.tipoCuenta} onChange={handleChange} required>
                <option value="">Seleccione un tipo</option>
                <option value="ahorros">Ahorros</option>
                <option value="corriente">Corriente</option>
              </select>
            </div>
            <div className="registroClienteFormGroup">
              <label className="registroClienteCheckboxLabel">
                <input type="checkbox" name="seguro" checked={formData.seguro} onChange={handleChange} />
                Agregar seguro
              </label>
            </div>
            <div className="registroClienteFormGroup">
              <label htmlFor="sucursalPreferencia" className="registroClienteLabel">Sucursal de preferencia:</label>
              <select id="sucursalPreferencia" name="sucursalPreferencia" className="registroClienteInput" value={formData.sucursalPreferencia} onChange={handleChange} required>
                <option value="">Seleccione una sucursal</option>
                <option value="sucursal1">Sucursal 1</option>
                <option value="sucursal2">Sucursal 2</option>
              </select>
            </div>
            <div className="registroClienteFormGroup">
              <label htmlFor="correoElectronico" className="registroClienteLabel">Correo electrónico:</label>
              <input type="email" id="correoElectronico" name="correoElectronico" className="registroClienteInput" value={formData.correoElectronico} onChange={handleChange} required />
            </div>
            <div className="registroClienteFormGroup">
              <label className="registroClienteCheckboxLabel">
                <input type="checkbox" name="aceptaTerminos" checked={formData.aceptaTerminos} onChange={handleChange} />
                Confirmo haber leído Términos y Condiciones
              </label>
            </div>
            <div className="registroClienteButtonContainer">
              <button type="submit" className="registroClienteSubmitButton">Crear</button>
              <button type="button" className="registroClienteCancelButton" onClick={() => navigate(-1)}>Cancelar</button>
            </div>
          </form>
          <div className="registroClientePreview">
            <img src="/assets/usuario.png" alt="Usuario" className="registroClientePreviewImage" />
            <div className="registroClientePreviewInfo">
              <p><strong>Nombre:</strong> {formData.nombre || "Nombre del Cliente"}</p>
              <p><strong>DUI:</strong> {formData.dui || "00000000-0"}</p>
              <p><strong>Domicilio:</strong> {formData.domicilio || "Domicilio"}</p>
              <p><strong>Profesión:</strong> {formData.profesion || "Profesión"}</p>
              <p><strong>Género:</strong> {formData.genero || "Género"}</p>
              <p><strong>Salario:</strong> {formData.salario || "0.00"}</p>
            </div>
          </div>
          {messageVisible && (
            <div className="registroClienteSuccessMessage">
              Cliente registrado exitosamente.
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default RegistroCliente
