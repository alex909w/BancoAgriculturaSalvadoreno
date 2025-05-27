"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./style/NuevaCuentaCliente.css"

const NuevaCuentaCliente: React.FC = () => {
  const navigate = useNavigate()
  const [menuVisible, setMenuVisible] = useState(false)
  const [formData, setFormData] = useState({
    accountType: "",
    addBeneficiary: false,
    addInsurance: false,
    preferredBranch: "",
    email: "",
    acceptTerms: false,
  })

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
    // Aquí puedes agregar la lógica para procesar la nueva cuenta
    console.log("Nueva Cuenta registrada:", formData)
    navigate("/dashboard-cliente")
  }

  return (
    <div className="nuevaCuentaContainer">
      <header className="nuevaCuentaHeader">
        <div className="nuevaCuentaLogoContainer">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="nuevaCuentaLogo" />
        </div>
        <h1 className="nuevaCuentaTitle">Crear Nueva Cuenta</h1>
        <div className="nuevaCuentaUserMenu">
          <button className="nuevaCuentaAvatar" onClick={toggleMenu}>
            <img src="/assets/Usuario.png" alt="Usuario" className="nuevaCuentaAvatarImage" />
          </button>
          {menuVisible && (
            <div className="nuevaCuentaMenuDropdown">
              <button className="nuevaCuentaMenuItem" onClick={() => handleNavigate("/perfil-cliente")}>Perfil</button>
              <button className="nuevaCuentaMenuItem" onClick={() => handleNavigate("/configuracion-cliente")}>Configuración</button>
              <button className="nuevaCuentaMenuItem" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </header>

      <main className="nuevaCuentaMain">
        <div className="nuevaCuentaContentContainer">
          <form className="nuevaCuentaForm" onSubmit={handleSubmit}>
            <div className="nuevaCuentaFormGroup">
              <label htmlFor="accountType" className="nuevaCuentaLabel">Tipo de cuenta:</label>
              <select id="accountType" name="accountType" className="nuevaCuentaInput" value={formData.accountType} onChange={handleChange} required>
                <option value="">Seleccione un tipo</option>
                <option value="dependiente">Dependiente</option>
                <option value="independiente">Independiente</option>
              </select>
            </div>
            <div className="nuevaCuentaFormGroup">
              <label className="nuevaCuentaCheckboxLabel">
                <input type="checkbox" name="addBeneficiary" checked={formData.addBeneficiary} onChange={handleChange} />
                Agregar beneficiario
              </label>
            </div>
            <div className="nuevaCuentaFormGroup">
              <label className="nuevaCuentaCheckboxLabel">
                <input type="checkbox" name="addInsurance" checked={formData.addInsurance} onChange={handleChange} />
                Agregar seguro
              </label>
            </div>
            <div className="nuevaCuentaFormGroup">
              <label htmlFor="preferredBranch" className="nuevaCuentaLabel">Sucursal de preferencia:</label>
              <select id="preferredBranch" name="preferredBranch" className="nuevaCuentaInput" value={formData.preferredBranch} onChange={handleChange} required>
                <option value="">Seleccione una sucursal</option>
                <option value="sucursal1">Farmaceutica</option>
                <option value="sucursal2">Mercado</option>
                <option value="sucursal3">Centro Comercial</option>
                <option value="sucursal4">Otra Sucursal</option>
              </select>
            </div>
            <div className="nuevaCuentaFormGroup">
              <label htmlFor="email" className="nuevaCuentaLabel">Correo electrónico:</label>
              <input type="email" id="email" name="email" className="nuevaCuentaInput" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="nuevaCuentaFormGroup">
              <label className="nuevaCuentaCheckboxLabel">
                <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} />
                Confirmo haber leído Términos y Condiciones
              </label>
            </div>
            <div className="nuevaCuentaButtonContainer">
              <button type="submit" className="nuevaCuentaSubmitButton">Crear</button>
              <button type="button" className="nuevaCuentaCancelButton" onClick={() => navigate(-1)}>Cancelar</button>
            </div>
          </form>
          <div className="nuevaCuentaPreview">
            <img src="/assets/usuario.png" alt="Usuario" className="nuevaCuentaPreviewImage" />
            <div className="nuevaCuentaPreviewInfo">
              <p><strong>Nombre:</strong> Farmacia San Lorenzo</p>
              <p><strong>Tipo de Cuenta:</strong> Dependiente</p>
              <p><strong>ID de Cliente:</strong> 150343434SL</p>
              <p><strong>Giro Comercial:</strong> Farmaceutica</p>
              <p><strong>Cuentas en Posesión:</strong> 2</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default NuevaCuentaCliente
