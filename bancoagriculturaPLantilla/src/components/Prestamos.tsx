"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../lib/auth"
import { apiService } from "../lib/api"
import "./style/Prestamos.css"

const Prestamos: React.FC = () => {
  const navigate = useNavigate()
  const [menuVisible, setMenuVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<"solicitar" | "gestionar">("solicitar")
  const [formData, setFormData] = useState({
    duiCliente: "",
    montoPrestamo: 0,
    tasaInteres: 5.5,
    plazoMeses: 12,
  })
  const [prestamos, setPrestamos] = useState<any[]>([])
  const [clientes, setClientes] = useState<any[]>([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const user = authService.getCurrentUser()
  const esGerente = user?.permisos && typeof user.permisos === "object" && "esGerente" in user.permisos

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login")
      return
    }
    loadData()
  }, [navigate])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [prestamosData, clientesData] = await Promise.all([apiService.getPrestamos(), apiService.getClientes()])
      setPrestamos(prestamosData)
      setClientes(clientesData)
    } catch (error) {
      console.error("Error cargando datos:", error)
      setError("Error al cargar los datos")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: ["montoPrestamo", "tasaInteres", "plazoMeses"].includes(name) ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleSolicitar = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (formData.montoPrestamo <= 0) {
      setError("El monto del préstamo debe ser mayor a 0")
      setIsLoading(false)
      return
    }

    try {
      // Buscar cliente por DUI
      const cliente = clientes.find((c) => c.dui === formData.duiCliente)
      if (!cliente) {
        setError("Cliente no encontrado con ese DUI")
        setIsLoading(false)
        return
      }

      await apiService.solicitarPrestamo({
        idCliente: cliente.idCliente,
        montoPrestamo: formData.montoPrestamo,
        tasaInteres: formData.tasaInteres,
        plazoMeses: formData.plazoMeses,
      })

      alert("Préstamo solicitado exitosamente")
      setFormData({
        duiCliente: "",
        montoPrestamo: 0,
        tasaInteres: 5.5,
        plazoMeses: 12,
      })
      loadData()
    } catch (error) {
      console.error("Error solicitando préstamo:", error)
      setError("Error al solicitar el préstamo. Intente nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAprobar = async (id: number) => {
    try {
      await apiService.aprobarPrestamo(id)
      alert("Préstamo aprobado exitosamente")
      loadData()
    } catch (error) {
      console.error("Error aprobando préstamo:", error)
      alert("Error al aprobar el préstamo")
    }
  }

  const handleRechazar = async (id: number) => {
    try {
      await apiService.rechazarPrestamo(id)
      alert("Préstamo rechazado")
      loadData()
    } catch (error) {
      console.error("Error rechazando préstamo:", error)
      alert("Error al rechazar el préstamo")
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

  return (
    <div className="prestamosContainer">
      <header className="prestamosHeader">
        <div className="prestamosLogoContainer">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="prestamosLogo" />
        </div>
        <h1 className="prestamosTitle">Gestión de Préstamos</h1>
        <div className="prestamosUserMenu">
          <button className="prestamosAvatar" onClick={toggleMenu}>
            <img src="/assets/Usuario.png" alt="Usuario" className="prestamosAvatarImage" />
          </button>
          {menuVisible && (
            <div className="prestamosMenuDropdown">
              <button className="prestamosMenuItem" onClick={() => navigate("/perfil-cajero")}>
                Perfil
              </button>
              <button className="prestamosMenuItem" onClick={() => navigate("/configuracion-cajero")}>
                Configuración
              </button>
              <button className="prestamosMenuItem" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="prestamosMain">
        <div className="prestamosContentContainer">
          <div className="prestamosTabs">
            <button
              className={`prestamosTab ${activeTab === "solicitar" ? "active" : ""}`}
              onClick={() => setActiveTab("solicitar")}
            >
              Solicitar Préstamo
            </button>
            {esGerente && (
              <button
                className={`prestamosTab ${activeTab === "gestionar" ? "active" : ""}`}
                onClick={() => setActiveTab("gestionar")}
              >
                Gestionar Préstamos
              </button>
            )}
          </div>

          {error && <div className="prestamosError">{error}</div>}

          {activeTab === "solicitar" && (
            <form onSubmit={handleSolicitar} className="prestamosForm">
              <div className="prestamosFormGroup">
                <label htmlFor="duiCliente" className="prestamosLabel">
                  DUI del Cliente:
                </label>
                <input
                  type="text"
                  id="duiCliente"
                  name="duiCliente"
                  placeholder="12345678-9"
                  value={formData.duiCliente}
                  onChange={handleChange}
                  className="prestamosInput"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="prestamosFormRow">
                <div className="prestamosFormGroup">
                  <label htmlFor="montoPrestamo" className="prestamosLabel">
                    Monto del Préstamo (USD):
                  </label>
                  <input
                    type="number"
                    id="montoPrestamo"
                    name="montoPrestamo"
                    step="0.01"
                    min="100"
                    value={formData.montoPrestamo}
                    onChange={handleChange}
                    className="prestamosInput"
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="prestamosFormGroup">
                  <label htmlFor="tasaInteres" className="prestamosLabel">
                    Tasa de Interés (%):
                  </label>
                  <input
                    type="number"
                    id="tasaInteres"
                    name="tasaInteres"
                    step="0.1"
                    min="0.1"
                    max="50"
                    value={formData.tasaInteres}
                    onChange={handleChange}
                    className="prestamosInput"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="prestamosFormGroup">
                <label htmlFor="plazoMeses" className="prestamosLabel">
                  Plazo (Meses):
                </label>
                <select
                  id="plazoMeses"
                  name="plazoMeses"
                  value={formData.plazoMeses}
                  onChange={handleChange}
                  className="prestamosSelect"
                  disabled={isLoading}
                  required
                >
                  <option value={6}>6 meses</option>
                  <option value={12}>12 meses</option>
                  <option value={18}>18 meses</option>
                  <option value={24}>24 meses</option>
                  <option value={36}>36 meses</option>
                  <option value={48}>48 meses</option>
                  <option value={60}>60 meses</option>
                </select>
              </div>

              <div className="prestamosButtonContainer">
                <button type="submit" className="prestamosSubmitButton" disabled={isLoading}>
                  {isLoading ? "Procesando..." : "Solicitar Préstamo"}
                </button>
                <button
                  type="button"
                  className="prestamosCancelButton"
                  onClick={() => navigate("/dashboard-cajero")}
                  disabled={isLoading}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {activeTab === "gestionar" && esGerente && (
            <div className="prestamosGestion">
              <h3 className="prestamosSubtitle">Préstamos Pendientes de Aprobación</h3>
              {prestamos.length === 0 ? (
                <div className="prestamosEmpty">
                  <p>No hay préstamos pendientes</p>
                </div>
              ) : (
                <div className="prestamosTable">
                  <table className="prestamosTableElement">
                    <thead>
                      <tr>
                        <th>Cliente</th>
                        <th>Monto</th>
                        <th>Tasa</th>
                        <th>Plazo</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prestamos.map((prestamo) => (
                        <tr key={prestamo.id}>
                          <td>
                            {prestamo.cliente?.nombres} {prestamo.cliente?.apellidos}
                          </td>
                          <td>{formatCurrency(prestamo.montoPrestamo)}</td>
                          <td>{prestamo.tasaInteres}%</td>
                          <td>{prestamo.plazoMeses} meses</td>
                          <td>
                            <span className={`prestamosEstado ${prestamo.estado?.toLowerCase()}`}>
                              {prestamo.estado}
                            </span>
                          </td>
                          <td>
                            {prestamo.estado === "PENDIENTE" && (
                              <div className="prestamosAcciones">
                                <button className="prestamosAprobar" onClick={() => handleAprobar(prestamo.id)}>
                                  Aprobar
                                </button>
                                <button className="prestamosRechazar" onClick={() => handleRechazar(prestamo.id)}>
                                  Rechazar
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Prestamos
