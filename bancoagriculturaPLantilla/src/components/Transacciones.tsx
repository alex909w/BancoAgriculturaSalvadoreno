"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../lib/auth"
import { apiService } from "../lib/api"
import "./style/Transacciones.css"

const Transacciones: React.FC = () => {
  const navigate = useNavigate()
  const [menuVisible, setMenuVisible] = useState(false)
  const [tipoTransaccion, setTipoTransaccion] = useState<"deposito" | "retiro" | "transferencia">("deposito")
  const [formData, setFormData] = useState({
    numeroCuenta: "",
    numeroCuentaDestino: "",
    monto: 0,
    descripcion: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [cuentas, setCuentas] = useState<any[]>([])

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login")
      return
    }
    loadCuentas()
  }, [navigate])

  const loadCuentas = async () => {
    try {
      const cuentasData = await apiService.getCuentas()
      setCuentas(cuentasData)
    } catch (error) {
      console.error("Error cargando cuentas:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "monto" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (formData.monto <= 0) {
      setError("El monto debe ser mayor a 0")
      setIsLoading(false)
      return
    }

    try {
      // Buscar la cuenta por número
      const cuenta = cuentas.find((c) => c.numeroCuenta === formData.numeroCuenta)
      if (!cuenta) {
        setError("Cuenta no encontrada")
        setIsLoading(false)
        return
      }

      let response
      switch (tipoTransaccion) {
        case "deposito":
          response = await apiService.deposito({
            idCuenta: cuenta.idCuenta,
            monto: formData.monto,
          })
          break
        case "retiro":
          response = await apiService.retiro({
            idCuenta: cuenta.idCuenta,
            monto: formData.monto,
          })
          break
        case "transferencia":
          const cuentaDestino = cuentas.find((c) => c.numeroCuenta === formData.numeroCuentaDestino)
          if (!cuentaDestino) {
            setError("Cuenta destino no encontrada")
            setIsLoading(false)
            return
          }
          response = await apiService.transferencia({
            cuentaOrigen: cuenta.idCuenta,
            cuentaDestino: cuentaDestino.idCuenta,
            monto: formData.monto,
          })
          break
      }

      alert(`${tipoTransaccion.charAt(0).toUpperCase() + tipoTransaccion.slice(1)} realizado exitosamente`)
      setFormData({
        numeroCuenta: "",
        numeroCuentaDestino: "",
        monto: 0,
        descripcion: "",
      })
    } catch (error) {
      console.error(`Error en ${tipoTransaccion}:`, error)
      setError(`Error al realizar ${tipoTransaccion}. Verifique los datos e intente nuevamente.`)
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
    <div className="transaccionesContainer">
      <header className="transaccionesHeader">
        <div className="transaccionesLogoContainer">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="transaccionesLogo" />
        </div>
        <h1 className="transaccionesTitle">Transacciones</h1>
        <div className="transaccionesUserMenu">
          <button className="transaccionesAvatar" onClick={toggleMenu}>
            <img src="/assets/Usuario.png" alt="Usuario" className="transaccionesAvatarImage" />
          </button>
          {menuVisible && (
            <div className="transaccionesMenuDropdown">
              <button className="transaccionesMenuItem" onClick={() => navigate("/perfil-cajero")}>
                Perfil
              </button>
              <button className="transaccionesMenuItem" onClick={() => navigate("/configuracion-cajero")}>
                Configuración
              </button>
              <button className="transaccionesMenuItem" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="transaccionesMain">
        <div className="transaccionesContentContainer">
          <div className="transaccionesTabs">
            <button
              className={`transaccionesTab ${tipoTransaccion === "deposito" ? "active" : ""}`}
              onClick={() => setTipoTransaccion("deposito")}
            >
              Depósito
            </button>
            <button
              className={`transaccionesTab ${tipoTransaccion === "retiro" ? "active" : ""}`}
              onClick={() => setTipoTransaccion("retiro")}
            >
              Retiro
            </button>
            <button
              className={`transaccionesTab ${tipoTransaccion === "transferencia" ? "active" : ""}`}
              onClick={() => setTipoTransaccion("transferencia")}
            >
              Transferencia
            </button>
          </div>

          {error && <div className="transaccionesError">{error}</div>}

          <form onSubmit={handleSubmit} className="transaccionesForm">
            <div className="transaccionesFormGroup">
              <label htmlFor="numeroCuenta" className="transaccionesLabel">
                {tipoTransaccion === "transferencia" ? "Cuenta Origen:" : "Número de Cuenta:"}
              </label>
              <select
                id="numeroCuenta"
                name="numeroCuenta"
                value={formData.numeroCuenta}
                onChange={handleChange}
                className="transaccionesSelect"
                disabled={isLoading}
                required
              >
                <option value="">Seleccione una cuenta</option>
                {cuentas.map((cuenta) => (
                  <option key={cuenta.idCuenta} value={cuenta.numeroCuenta}>
                    {cuenta.numeroCuenta} - ${cuenta.saldo.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            {tipoTransaccion === "transferencia" && (
              <div className="transaccionesFormGroup">
                <label htmlFor="numeroCuentaDestino" className="transaccionesLabel">
                  Cuenta Destino:
                </label>
                <select
                  id="numeroCuentaDestino"
                  name="numeroCuentaDestino"
                  value={formData.numeroCuentaDestino}
                  onChange={handleChange}
                  className="transaccionesSelect"
                  disabled={isLoading}
                  required
                >
                  <option value="">Seleccione cuenta destino</option>
                  {cuentas
                    .filter((cuenta) => cuenta.numeroCuenta !== formData.numeroCuenta)
                    .map((cuenta) => (
                      <option key={cuenta.idCuenta} value={cuenta.numeroCuenta}>
                        {cuenta.numeroCuenta} - ${cuenta.saldo.toFixed(2)}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div className="transaccionesFormGroup">
              <label htmlFor="monto" className="transaccionesLabel">
                Monto (USD):
              </label>
              <input
                type="number"
                id="monto"
                name="monto"
                step="0.01"
                min="0.01"
                value={formData.monto}
                onChange={handleChange}
                className="transaccionesInput"
                disabled={isLoading}
                required
              />
            </div>

            <div className="transaccionesButtonContainer">
              <button type="submit" className="transaccionesSubmitButton" disabled={isLoading}>
                {isLoading
                  ? "Procesando..."
                  : `Realizar ${tipoTransaccion.charAt(0).toUpperCase() + tipoTransaccion.slice(1)}`}
              </button>
              <button
                type="button"
                className="transaccionesCancelButton"
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

export default Transacciones
