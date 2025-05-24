"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../lib/auth"
import { apiService } from "../lib/api"
import "./style/HistorialTransacciones.css"

interface Movimiento {
  id: number
  fecha: string
  tipo: string
  monto: number
  descripcion: string
  saldoAnterior: number
  saldoNuevo: number
}

const HistorialTransacciones: React.FC = () => {
  const navigate = useNavigate()
  const [menuVisible, setMenuVisible] = useState(false)
  const [movimientos, setMovimientos] = useState<Movimiento[]>([])
  const [cuentas, setCuentas] = useState<any[]>([])
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const user = authService.getCurrentUser()

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login")
      return
    }
    loadCuentas()
  }, [navigate])

  const loadCuentas = async () => {
    try {
      setIsLoading(true)
      const user = authService.getCurrentUser()
      if (
        user?.datos_especificos &&
        typeof user.datos_especificos === "object" &&
        "idCliente" in user.datos_especificos
      ) {
        const idCliente = (user.datos_especificos as any).idCliente
        const cuentasData = await apiService.getCuentasPorCliente(idCliente)
        setCuentas(cuentasData)

        if (cuentasData.length > 0) {
          setCuentaSeleccionada(cuentasData[0].idCuenta)
          loadMovimientos(cuentasData[0].idCuenta)
        }
      }
    } catch (error) {
      console.error("Error cargando cuentas:", error)
      setError("Error al cargar las cuentas")
    } finally {
      setIsLoading(false)
    }
  }

  const loadMovimientos = async (idCuenta: number) => {
    try {
      setIsLoading(true)
      const movimientosData = await apiService.getHistorialCuenta(idCuenta)
      setMovimientos(movimientosData)
    } catch (error) {
      console.error("Error cargando movimientos:", error)
      setError("Error al cargar el historial de transacciones")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCuentaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idCuenta = Number.parseInt(e.target.value)
    setCuentaSeleccionada(idCuenta)
    if (idCuenta) {
      loadMovimientos(idCuenta)
    }
  }

  const handleLogout = () => {
    authService.logout()
    navigate("/login")
  }

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="historialContainer">
      <header className="historialHeader">
        <div className="historialLogoContainer">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="historialLogo" />
        </div>
        <h1 className="historialTitle">Historial de Transacciones</h1>
        <div className="historialUserMenu">
          <button className="historialAvatar" onClick={toggleMenu}>
            <img src="/assets/Usuario.png" alt="Usuario" className="historialAvatarImage" />
          </button>
          {menuVisible && (
            <div className="historialMenuDropdown">
              <button className="historialMenuItem" onClick={() => navigate("/perfil-cliente")}>
                Perfil
              </button>
              <button className="historialMenuItem" onClick={() => navigate("/configuracion-cliente")}>
                Configuración
              </button>
              <button className="historialMenuItem" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="historialMain">
        <div className="historialContentContainer">
          {error && <div className="historialError">{error}</div>}

          <div className="historialFilters">
            <div className="historialFilterGroup">
              <label htmlFor="cuenta" className="historialLabel">
                Seleccionar Cuenta:
              </label>
              <select
                id="cuenta"
                value={cuentaSeleccionada || ""}
                onChange={handleCuentaChange}
                className="historialSelect"
                disabled={isLoading}
              >
                <option value="">Seleccione una cuenta</option>
                {cuentas.map((cuenta) => (
                  <option key={cuenta.idCuenta} value={cuenta.idCuenta}>
                    {cuenta.numeroCuenta} - {formatCurrency(cuenta.saldo)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="historialLoading">
              <p>Cargando historial...</p>
            </div>
          ) : (
            <div className="historialTable">
              {movimientos.length === 0 ? (
                <div className="historialEmpty">
                  <p>No hay transacciones registradas para esta cuenta</p>
                </div>
              ) : (
                <table className="historialTableElement">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Tipo</th>
                      <th>Descripción</th>
                      <th>Monto</th>
                      <th>Saldo Anterior</th>
                      <th>Saldo Nuevo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movimientos.map((movimiento) => (
                      <tr key={movimiento.id}>
                        <td>{formatDate(movimiento.fecha)}</td>
                        <td>
                          <span className={`historialTipo ${movimiento.tipo.toLowerCase()}`}>{movimiento.tipo}</span>
                        </td>
                        <td>{movimiento.descripcion}</td>
                        <td
                          className={
                            movimiento.tipo === "RETIRO" ? "historialMonto negativo" : "historialMonto positivo"
                          }
                        >
                          {movimiento.tipo === "RETIRO" ? "-" : "+"}
                          {formatCurrency(Math.abs(movimiento.monto))}
                        </td>
                        <td>{formatCurrency(movimiento.saldoAnterior)}</td>
                        <td>{formatCurrency(movimiento.saldoNuevo)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          <div className="historialButtonContainer">
            <button className="historialReturnButton" onClick={() => navigate("/dashboard-cliente")}>
              Regresar al Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default HistorialTransacciones
