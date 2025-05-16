"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./style/Prestamos.css"

const Prestamos: React.FC = () => {
  const navigate = useNavigate()
  const [menuVisible, setMenuVisible] = useState(false)
  const [formData, setFormData] = useState({
    tipoPrestamo: "",
    montoPrestamo: "",
    cobrosAutomaticos: false,
    cuentaVinculada: "",
    fechaVencimiento: "",
    activarSeguroVida: false,
    profesion: "",
    cuentasEnPosesion: "",
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
    // Aquí puedes agregar la lógica para procesar el préstamo
    console.log("Préstamo registrado:", formData)
    setMessageVisible(true)
    setTimeout(() => {
      setMessageVisible(false)
    }, 5000) // El mensaje desaparece después de 5 segundos
  }

  return (
    <div className="prestamosContainer">
      <header className="prestamosHeader">
        <div className="prestamosLogoContainer">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="prestamosLogo" />
        </div>
        <h1 className="prestamosTitle">Nuevo Préstamo</h1>
        <div className="prestamosUserMenu">
          <button className="prestamosAvatar" onClick={toggleMenu}>
            <img src="/assets/Usuario.png" alt="Usuario" className="prestamosAvatarImage" />
          </button>
          {menuVisible && (
            <div className="prestamosMenuDropdown">
              <button className="prestamosMenuItem" onClick={() => handleNavigate("/perfil-cajero")}>Perfil</button>
              <button className="prestamosMenuItem" onClick={() => handleNavigate("/configuracion-cajero")}>Configuración</button>
              <button className="prestamosMenuItem" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </header>

      <main className="prestamosMain">
        <div className="prestamosContentContainer">
          <form className="prestamosForm" onSubmit={handleSubmit}>
            <div className="prestamosFormGroup">
              <label htmlFor="tipoPrestamo" className="prestamosLabel">Tipo de préstamo:</label>
              <select id="tipoPrestamo" name="tipoPrestamo" className="prestamosInput" value={formData.tipoPrestamo} onChange={handleChange} required>
                <option value="">Seleccione un tipo</option>
                <option value="personal">Personal</option>
                <option value="hipotecario">Hipotecario</option>
                <option value="automotriz">Automotriz</option>
              </select>
            </div>
            <div className="prestamosFormGroup">
              <label htmlFor="montoPrestamo" className="prestamosLabel">Monto de préstamo:</label>
              <input type="number" id="montoPrestamo" name="montoPrestamo" className="prestamosInput" value={formData.montoPrestamo} onChange={handleChange} required />
            </div>
            <div className="prestamosFormGroup">
              <label className="prestamosCheckboxLabel">
                <input type="checkbox" name="cobrosAutomaticos" checked={formData.cobrosAutomaticos} onChange={handleChange} />
                Cobros automáticos
              </label>
            </div>
            <div className="prestamosFormGroup">
              <label htmlFor="cuentaVinculada" className="prestamosLabel">Cuenta vinculada:</label>
              <input type="text" id="cuentaVinculada" name="cuentaVinculada" className="prestamosInput" value={formData.cuentaVinculada} onChange={handleChange} required />
            </div>
            <div className="prestamosFormGroup">
              <label htmlFor="fechaVencimiento" className="prestamosLabel">Fecha de vencimiento:</label>
              <input type="date" id="fechaVencimiento" name="fechaVencimiento" className="prestamosInput" value={formData.fechaVencimiento} onChange={handleChange} required />
            </div>
            <div className="prestamosFormGroup">
              <label className="prestamosCheckboxLabel">
                <input type="checkbox" name="activarSeguroVida" checked={formData.activarSeguroVida} onChange={handleChange} />
                Activar seguro de vida
              </label>
            </div>
            <div className="prestamosButtonContainer">
              <button type="submit" className="prestamosSubmitButton">Crear</button>
              <button type="button" className="prestamosCancelButton" onClick={() => navigate(-1)}>Cancelar</button>
            </div>
          </form>
          <div className="prestamosPreview">
            <img src="/assets/usuario.png" alt="Usuario" className="prestamosPreviewImage" />
            <div className="prestamosPreviewInfo">
              <p><strong>Tipo de Cuenta:</strong> {formData.tipoPrestamo || "Prestamista"}</p>
              <p><strong>ID de Cliente:</strong> {formData.cuentaVinculada || "15093293JR"}</p>
              <p><strong>Profesión:</strong> {formData.profesion || "Agricultor"}</p>
              <p><strong>Cuentas en Posesión:</strong> {formData.cuentasEnPosesion || "2"}</p>
            </div>
          </div>
          {messageVisible && (
            <div className="prestamosSuccessMessage">
              Préstamo registrado exitosamente.
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Prestamos
