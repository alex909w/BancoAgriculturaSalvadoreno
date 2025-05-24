"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../lib/auth"
import { apiService, type Cuenta } from "../lib/api"
import "./style/CrearCuenta.css"

const CrearCuenta: React.FC = () => {
  const navigate = useNavigate()
  const [menuVisible, setMenuVisible] = useState(false)
  const [formData, setFormData] = useState({
    numeroCuenta: "",
    saldoInicial: 0,
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const user = authService.getCurrentUser()

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login")
      return
    }

    // Generar número de cuenta automáticamente
    generateAccountNumber()
  }, [navigate])

  const generateAccountNumber = () => {
    const timestamp = Date.now().toString()
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    const accountNumber = `00${timestamp.slice(-6)}${random}`
    setFormData((prev) => ({ ...prev, numeroCuenta: accountNumber }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "saldoInicial" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (formData.saldoInicial < 0) {
      setError("El saldo inicial no puede ser negativo")
      setIsLoading(false)
      return
    }

    try {
      const user = authService.getCurrentUser()
      if (
        user?.datos_especificos &&
        typeof user.datos_especificos === "object" &&
        "idCliente" in user.datos_especificos
      ) {
        const idCliente = (user.datos_especificos as any).idCliente

        const nuevaCuenta: Cuenta = {
          cliente: { idCliente },
          numeroCuenta: formData.numeroCuenta,
          saldo: formData.saldoInicial,
        }

        await apiService.crearCuenta(nuevaCuenta)
        alert("Cuenta creada exitosamente")
        navigate("/dashboard-cliente")
      } else {
        setError("Error: No se pudo obtener la información del cliente")
      }
    } catch (error) {
      console.error("Error creando cuenta:", error)
      setError("Error al crear la cuenta. Intente nuevamente.")
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
    <div className="crearCuentaContainer">
      <header className="crearCuentaHeader">
        <div className="crearCuentaLogoContainer">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="crearCuentaLogo" />
        </div>
        <h1 className="crearCuentaTitle">Crear Nueva Cuenta</h1>
        <div className="crearCuentaUserMenu">
          <button className="crearCuentaAvatar" onClick={toggleMenu}>
            <img src="/assets/Usuario.png" alt="Usuario" className="crearCuentaAvatarImage" />
          </button>
          {menuVisible && (
            <div className="crearCuentaMenuDropdown">
              <button className="crearCuentaMenuItem" onClick={() => navigate("/perfil-cliente")}>
                Perfil
              </button>
              <button className="crearCuentaMenuItem" onClick={() => navigate("/configuracion-cliente")}>
                Configuración
              </button>
              <button className="crearCuentaMenuItem" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="crearCuentaMain">
        <div className="crearCuentaContentContainer">
          <h2 className="crearCuentaSubtitle">Nueva Cuenta Bancaria</h2>

          {error && <div className="crearCuentaError">{error}</div>}

          <form onSubmit={handleSubmit} className="crearCuentaForm">
            <div className="crearCuentaFormGroup">
              <label htmlFor="numeroCuenta" className="crearCuentaLabel">
                Número de Cuenta:
              </label>
              <input
                type="text"
                id="numeroCuenta"
                name="numeroCuenta"
                value={formData.numeroCuenta}
                onChange={handleChange}
                className="crearCuentaInput"
                readOnly
              />
              <small className="crearCuentaHelp">Este número se genera automáticamente</small>
            </div>

            <div className="crearCuentaFormGroup">
              <label htmlFor="saldoInicial" className="crearCuentaLabel">
                Saldo Inicial (USD):
              </label>
              <input
                type="number"
                id="saldoInicial"
                name="saldoInicial"
                value={formData.saldoInicial}
                onChange={handleChange}
                className="crearCuentaInput"
                min="0"
                step="0.01"
                disabled={isLoading}
              />
            </div>

            <div className="crearCuentaButtonContainer">
              <button type="submit" className="crearCuentaSubmitButton" disabled={isLoading}>
                {isLoading ? "Creando..." : "Crear Cuenta"}
              </button>
              <button
                type="button"
                className="crearCuentaCancelButton"
                onClick={() => navigate("/dashboard-cliente")}
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

export default CrearCuenta
