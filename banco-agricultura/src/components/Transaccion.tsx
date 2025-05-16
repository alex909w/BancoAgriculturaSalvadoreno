"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./style/Transaccion.css"

const Transaccion: React.FC = () => {
  const navigate = useNavigate()
  const [menuVisible, setMenuVisible] = useState(false)
  const [formData, setFormData] = useState({
    tipoTransaccion: "",
    montoTransaccion: "",
    cuentaOrigen: "",
    cuentaDestino: "",
    descripcion: "",
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
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí puedes agregar la lógica para procesar la transacción
    console.log("Transacción registrada:", formData)
    setMessageVisible(true)
    setTimeout(() => {
      setMessageVisible(false)
    }, 5000) // El mensaje desaparece después de 5 segundos
  }

  return (
    <div className="transaccionContainer">
      <header className="transaccionHeader">
        <div className="transaccionLogoContainer">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="transaccionLogo" />
        </div>
        <h1 className="transaccionTitle">Nueva Transacción</h1>
        <div className="transaccionUserMenu">
          <button className="transaccionAvatar" onClick={toggleMenu}>
            <img src="/assets/Usuario.png" alt="Usuario" className="transaccionAvatarImage" />
          </button>
          {menuVisible && (
            <div className="transaccionMenuDropdown">
              <button className="transaccionMenuItem" onClick={() => handleNavigate("/perfil-cajero")}>Perfil</button>
              <button className="transaccionMenuItem" onClick={() => handleNavigate("/configuracion-cajero")}>Configuración</button>
              <button className="transaccionMenuItem" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </header>

      <main className="transaccionMain">
        <div className="transaccionContentContainer">
          <form className="transaccionForm" onSubmit={handleSubmit}>
            <div className="transaccionFormGroup">
              <label htmlFor="tipoTransaccion" className="transaccionLabel">Tipo de transacción:</label>
              <select id="tipoTransaccion" name="tipoTransaccion" className="transaccionInput" value={formData.tipoTransaccion} onChange={handleChange} required>
                <option value="">Seleccione un tipo</option>
                <option value="deposito">Depósito</option>
                <option value="retiro">Retiro</option>
                <option value="transferencia">Transferencia</option>
              </select>
            </div>
            <div className="transaccionFormGroup">
              <label htmlFor="montoTransaccion" className="transaccionLabel">Monto de transacción:</label>
              <input type="number" id="montoTransaccion" name="montoTransaccion" className="transaccionInput" value={formData.montoTransaccion} onChange={handleChange} required />
            </div>
            <div className="transaccionFormGroup">
              <label htmlFor="cuentaOrigen" className="transaccionLabel">Cuenta de origen:</label>
              <input type="text" id="cuentaOrigen" name="cuentaOrigen" className="transaccionInput" value={formData.cuentaOrigen} onChange={handleChange} required />
            </div>
            <div className="transaccionFormGroup">
              <label htmlFor="cuentaDestino" className="transaccionLabel">Cuenta de destino:</label>
              <input type="text" id="cuentaDestino" name="cuentaDestino" className="transaccionInput" value={formData.cuentaDestino} onChange={handleChange} required />
            </div>
            <div className="transaccionFormGroup">
              <label htmlFor="descripcion" className="transaccionLabel">Descripción:</label>
              <input type="text" id="descripcion" name="descripcion" className="transaccionInput" value={formData.descripcion} onChange={handleChange} required />
            </div>
            <div className="transaccionButtonContainer">
              <button type="submit" className="transaccionSubmitButton">Realizar Transacción</button>
              <button type="button" className="transaccionCancelButton" onClick={() => navigate(-1)}>Cancelar</button>
            </div>
          </form>
          <div className="transaccionPreview">
            <img src="/assets/usuario.png" alt="Usuario" className="transaccionPreviewImage" />
            <div className="transaccionPreviewInfo">
              <p><strong>Tipo de Transacción:</strong> {formData.tipoTransaccion || "Transacción"}</p>
              <p><strong>ID de Cliente:</strong> {formData.cuentaOrigen || "15093293JR"}</p>
              <p><strong>Cuenta de Destino:</strong> {formData.cuentaDestino || "Cuenta de Destino"}</p>
            </div>
          </div>
          {messageVisible && (
            <div className="transaccionSuccessMessage">
              Transacción realizada exitosamente.
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Transaccion
