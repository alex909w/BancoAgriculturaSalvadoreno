"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../lib/auth"
import { apiService, type Cliente } from "../lib/api"
import "./style/RegistroCliente.css"

const RegistroCliente: React.FC = () => {
  const navigate = useNavigate()
  const [menuVisible, setMenuVisible] = useState(false)
  const [formData, setFormData] = useState<Cliente>({
    nombres: "",
    apellidos: "",
    dui: "",
    direccion: "",
    telefono: "",
    lugarTrabajo: "",
    salario: 0,
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "salario" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Validaciones básicas
    if (!formData.nombres || !formData.apellidos || !formData.dui) {
      setError("Los campos nombres, apellidos y DUI son obligatorios")
      setIsLoading(false)
      return
    }

    // Validar formato DUI (básico)
    const duiRegex = /^\d{8}-\d$/
    if (!duiRegex.test(formData.dui)) {
      setError("El formato del DUI debe ser: 12345678-9")
      setIsLoading(false)
      return
    }

    try {
      await apiService.crearCliente(formData)
      alert("Cliente registrado exitosamente")
      navigate("/dashboard-cajero")
    } catch (error) {
      console.error("Error registrando cliente:", error)
      setError("Error al registrar el cliente. Verifique los datos e intente nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    authService.logout()
    navigate("/login")
  }

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }

  return (
    <div className="registroClienteContainer">
      <header className="registroClienteHeader">
        <div className="registroClienteLogoContainer">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="registroClienteLogo" />
        </div>
        <h1 className="registroClienteTitle">Registrar Nuevo Cliente</h1>
        <div className="registroClienteUserMenu">
          <button className="registroClienteAvatar" onClick={toggleMenu}>
            <img src="/assets/Usuario.png" alt="Usuario" className="registroClienteAvatarImage" />
          </button>
          {menuVisible && (
            <div className="registroClienteMenuDropdown">
              <button className="registroClienteMenuItem" onClick={() => navigate("/perfil-cajero")}>
                Perfil
              </button>
              <button className="registroClienteMenuItem" onClick={() => navigate("/configuracion-cajero")}>
                Configuración
              </button>
              <button className="registroClienteMenuItem" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="registroClienteMain">
        <div className="registroClienteContentContainer">
          <h2 className="registroClienteSubtitle">Información del Cliente</h2>

          {error && <div className="registroClienteError">{error}</div>}

          <form onSubmit={handleSubmit} className="registroClienteForm">
            <div className="registroClienteFormRow">
              <div className="registroClienteFormGroup">
                <label htmlFor="nombres" className="registroClienteLabel">
                  Nombres *
                </label>
                <input
                  type="text"
                  id="nombres"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  className="registroClienteInput"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="registroClienteFormGroup">
                <label htmlFor="apellidos" className="registroClienteLabel">
                  Apellidos *
                </label>
                <input
                  type="text"
                  id="apellidos"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  className="registroClienteInput"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="registroClienteFormGroup">
              <label htmlFor="dui" className="registroClienteLabel">
                DUI *
              </label>
              <input
                type="text"
                id="dui"
                name="dui"
                placeholder="12345678-9"
                value={formData.dui}
                onChange={handleChange}
                className="registroClienteInput"
                disabled={isLoading}
                required
              />
            </div>

            <div className="registroClienteFormGroup">
              <label htmlFor="direccion" className="registroClienteLabel">
                Dirección
              </label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="registroClienteInput"
                disabled={isLoading}
              />
            </div>

            <div className="registroClienteFormRow">
              <div className="registroClienteFormGroup">
                <label htmlFor="telefono" className="registroClienteLabel">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="registroClienteInput"
                  disabled={isLoading}
                />
              </div>

              <div className="registroClienteFormGroup">
                <label htmlFor="salario" className="registroClienteLabel">
                  Salario (USD)
                </label>
                <input
                  type="number"
                  id="salario"
                  name="salario"
                  step="0.01"
                  min="0"
                  value={formData.salario}
                  onChange={handleChange}
                  className="registroClienteInput"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="registroClienteFormGroup">
              <label htmlFor="lugarTrabajo" className="registroClienteLabel">
                Lugar de Trabajo
              </label>
              <input
                type="text"
                id="lugarTrabajo"
                name="lugarTrabajo"
                value={formData.lugarTrabajo}
                onChange={handleChange}
                className="registroClienteInput"
                disabled={isLoading}
              />
            </div>

            <div className="registroClienteButtonContainer">
              <button type="submit" className="registroClienteSubmitButton" disabled={isLoading}>
                {isLoading ? "Registrando..." : "Registrar Cliente"}
              </button>
              <button
                type="button"
                className="registroClienteCancelButton"
                onClick={() => navigate("/dashboard-cajero")}
                disabled={isLoading}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default RegistroCliente
