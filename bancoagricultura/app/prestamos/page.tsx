"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { prestamosAPI, usuariosAPI, tiposPrestamoAPI, cuentasAPI } from "@/lib/api"
import { Prestamo, Cliente, TipoPrestamo, Cuenta, FormDataPrestamo } from "@/lib/types"

export default function Prestamos() {
  const router = useRouter()
  const [menuVisible, setMenuVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("solicitar")
  const [prestamos, setPrestamos] = useState<Prestamo[]>([])
  const [tiposPrestamo, setTiposPrestamo] = useState<TipoPrestamo[]>([])
  const [clienteEncontrado, setClienteEncontrado] = useState<Cliente | null>(null)
  const [cuentasCliente, setCuentasCliente] = useState<Cuenta[]>([])
  const [buscandoCliente, setBuscandoCliente] = useState(false)
  const [formData, setFormData] = useState<FormDataPrestamo>({
    clienteId: "",
    clienteDui: "",
    clienteNombre: "",
    tipoPrestamo: "",
    cuentaVinculada: "",
    montoPrestamo: "",
    plazo: "12",
    proposito: "",
    garantia: "",
    ingresosMensuales: "",
    gastosPromedios: ""
  })

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem("authToken")
    const userRole = localStorage.getItem("userRole")

    if (!token || !userRole) {
      router.push("/login")
      return
    }

    if (userRole !== "cajero" && userRole !== "admin") {
      router.push("/login")
      return
    }

    // Cargar datos iniciales
    loadInitialData()
  }, [router])

  const loadInitialData = async () => {
    try {
      // Cargar préstamos existentes
      const prestamosResponse = await prestamosAPI.getAll()
      if (!prestamosResponse.error) {
        setPrestamos(prestamosResponse)
      }

      // Cargar tipos de préstamo
      const tiposResponse = await tiposPrestamoAPI.getAll()
      if (!tiposResponse.error) {
        setTiposPrestamo(tiposResponse)
      }

      setLoading(false)
    } catch (error) {
      console.error("Error cargando datos iniciales:", error)
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userRole")
    localStorage.removeItem("username")
    localStorage.removeItem("userId")
    router.push("/login")
  }

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (!clienteEncontrado) {
        alert("Debe buscar y seleccionar un cliente válido")
        setSubmitting(false)
        return
      }

      if (!formData.cuentaVinculada) {
        alert("Debe seleccionar una cuenta vinculada")
        setSubmitting(false)
        return
      }

      if (!formData.tipoPrestamo) {
        alert("Debe seleccionar un tipo de préstamo")
        setSubmitting(false)
        return
      }

      const tipoSeleccionado = tiposPrestamo.find(t => t.id.toString() === formData.tipoPrestamo)
      if (!tipoSeleccionado) {
        alert("Tipo de préstamo no válido")
        setSubmitting(false)
        return
      }

      const monto = parseFloat(formData.montoPrestamo)
      if (monto < tipoSeleccionado.montoMinimo || monto > tipoSeleccionado.montoMaximo) {
        alert(`El monto debe estar entre $${tipoSeleccionado.montoMinimo} y $${tipoSeleccionado.montoMaximo}`)
        setSubmitting(false)
        return
      }

      const plazo = parseInt(formData.plazo)
      if (plazo < tipoSeleccionado.plazoMinimo || plazo > tipoSeleccionado.plazoMaximo) {
        alert(`El plazo debe estar entre ${tipoSeleccionado.plazoMinimo} y ${tipoSeleccionado.plazoMaximo} meses`)
        setSubmitting(false)
        return
      }

      const prestamoData = {
        cliente: { id: clienteEncontrado.id },
        tipoPrestamo: { id: parseInt(formData.tipoPrestamo) },
        cuentaVinculada: { id: parseInt(formData.cuentaVinculada) },
        montoSolicitado: monto,
        tasaInteres: tipoSeleccionado.tasaInteres,
        plazoMeses: plazo,
        proposito: formData.proposito,
        estado: "solicitado"
      }

      console.log("Enviando solicitud de préstamo:", prestamoData)
      const response = await prestamosAPI.create(prestamoData)

      if (response.error) {
        alert(`Error al crear el préstamo: ${response.message}`)
      } else {
        alert(`Préstamo creado exitosamente. Número: ${response.prestamo.numeroPrestamo}`)
        
        // Limpiar formulario
        setFormData({
          clienteId: "",
          clienteDui: "",
          clienteNombre: "",
          tipoPrestamo: "",
          cuentaVinculada: "",
          montoPrestamo: "",
          plazo: "12",
          proposito: "",
          garantia: "",
          ingresosMensuales: "",
          gastosPromedios: ""
        })
        setClienteEncontrado(null)
        setCuentasCliente([])
        
        // Recargar préstamos
        loadInitialData()
        
        // Cambiar a la pestaña de consultar
        setActiveTab("consultar")
      }
    } catch (error) {
      console.error("Error al crear préstamo:", error)
      alert("Error al procesar la solicitud de préstamo")
    } finally {
      setSubmitting(false)
    }
  }

  const buscarCliente = async () => {
    if (!formData.clienteDui.trim()) {
      alert("Ingrese un DUI para buscar")
      return
    }

    setBuscandoCliente(true)
    try {
      const response = await usuariosAPI.getByDui(formData.clienteDui)
      
      if (response.error) {
        alert(`Cliente no encontrado: ${response.message}`)
        setClienteEncontrado(null)
        setCuentasCliente([])
        setFormData(prev => ({ ...prev, clienteNombre: "", clienteId: "" }))
      } else {
        setClienteEncontrado(response)
        setFormData(prev => ({ 
          ...prev, 
          clienteNombre: response.nombreCompleto,
          clienteId: response.id.toString()
        }))

        // Buscar cuentas del cliente
        const cuentasResponse = await cuentasAPI.getByCliente(response.id)
        if (!cuentasResponse.error) {
          const cuentasActivas = cuentasResponse.filter((cuenta: Cuenta) => cuenta.estado === 'activa')
          setCuentasCliente(cuentasActivas)
        }
      }
    } catch (error) {
      console.error("Error buscando cliente:", error)
      alert("Error al buscar el cliente")
    } finally {
      setBuscandoCliente(false)
    }
  }

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  // Función para obtener el color del estado
  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'solicitado':
        return 'bg-yellow-100 text-yellow-800'
      case 'aprobado':
        return 'bg-green-100 text-green-800'
      case 'desembolsado':
        return 'bg-blue-100 text-blue-800'
      case 'rechazado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando gestión de préstamos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => router.back()} 
            className="mr-4 p-2 hover:bg-green-700 rounded-full"
            title="Volver atrás"
            aria-label="Volver a la página anterior"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <Image src="/imagenes/logo-login.png" alt="AgroBanco Salvadoreño" width={40} height={40} className="mr-3" />
          <h1 className="text-xl font-bold">Gestión de Préstamos</h1>
        </div>

        <div className="relative">
          <button
            onClick={toggleMenu}
            className="p-2 hover:bg-green-700 rounded-full"
            title="Menú de usuario"
            aria-label="Abrir menú de usuario"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>

          {menuVisible && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <button
                onClick={() => router.push("/dashboard-cajero")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Dashboard
              </button>
              <hr className="my-1" />
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="border-b">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab("solicitar")}
                  className={`px-6 py-3 font-medium text-sm $\{
                    activeTab === "solicitar"
                      ? "border-b-2 border-green-500 text-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Solicitar Préstamo
                </button>
                <button
                  onClick={() => setActiveTab("consultar")}
                  className={`px-6 py-3 font-medium text-sm $\{
                    activeTab === "consultar"
                      ? "border-b-2 border-green-500 text-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Consultar Préstamos
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "solicitar" && (
                <div>
                  <div className="flex items-center mb-6">
                    <img src="/imagenes/deposito.png" alt="Préstamo" className="w-16 h-16 mr-4" />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Nueva Solicitud de Préstamo</h2>
                      <p className="text-gray-600">Complete la información para la solicitud</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          DUI del Cliente *
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            name="clienteDui"
                            value={formData.clienteDui}
                            onChange={handleInputChange}
                            placeholder="00000000-0"
                            required
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                          <button
                            type="button"
                            onClick={buscarCliente}
                            disabled={buscandoCliente}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                          >
                            {buscandoCliente ? "Buscando..." : "Buscar"}
                          </button>
                        </div>
                        {clienteEncontrado && (
                          <p className="mt-2 text-sm text-green-600">Cliente encontrado: {clienteEncontrado.nombreCompleto}</p>
                        )}
                      </div>

                      {clienteEncontrado && (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cuenta Vinculada *
                          </label>
                          <select
                            name="cuentaVinculada"
                            value={formData.cuentaVinculada}
                            onChange={handleInputChange}
                            required
                            title="Seleccione la cuenta a vincular con el préstamo"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            <option value="">Seleccione una cuenta</option>
                            {cuentasCliente.map((cuenta) => (
                              <option key={cuenta.id} value={cuenta.id}>
                                {cuenta.numeroCuenta} - Saldo: ${cuenta.saldo.toLocaleString()}
                              </option>
                            ))}
                          </select>
                          {cuentasCliente.length === 0 && (
                            <p className="mt-2 text-sm text-red-600">El cliente no tiene cuentas activas</p>
                          )}
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de Préstamo *
                        </label>
                        <select
                          name="tipoPrestamo"
                          value={formData.tipoPrestamo}
                          onChange={handleInputChange}
                          required
                          title="Seleccione el tipo de préstamo"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="">Seleccione un tipo</option>
                          {tiposPrestamo.map((tipo) => (
                            <option key={tipo.id} value={tipo.id}>
                              {tipo.nombre} - Tasa: {(tipo.tasaInteres * 100).toFixed(2)}%
                            </option>
                          ))}
                        </select>
                        {formData.tipoPrestamo && (
                          (() => {
                            const tipoSeleccionado = tiposPrestamo.find(t => t.id.toString() === formData.tipoPrestamo)
                            return tipoSeleccionado ? (
                              <div className="mt-2 text-sm text-gray-600">
                                <p>Monto: ${tipoSeleccionado.montoMinimo.toLocaleString()} - ${tipoSeleccionado.montoMaximo.toLocaleString()}</p>
                                <p>Plazo: {tipoSeleccionado.plazoMinimo} - {tipoSeleccionado.plazoMaximo} meses</p>
                                {tipoSeleccionado.requiereGarantia && (
                                  <p className="text-orange-600">⚠️ Requiere garantía</p>
                                )}
                              </div>
                            ) : null
                          })()
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Monto del Préstamo (USD) *
                        </label>
                        <input
                          type="number"
                          name="montoPrestamo"
                          value={formData.montoPrestamo}
                          onChange={handleInputChange}
                          placeholder="0.00"
                          step="0.01"
                          min="100"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Plazo (meses) *
                        </label>
                        <select
                          name="plazo"
                          value={formData.plazo}
                          onChange={handleInputChange}
                          required
                          title="Seleccionar plazo del préstamo en meses"
                          aria-label="Plazo del préstamo en meses"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="6">6 meses</option>
                          <option value="12">12 meses</option>
                          <option value="18">18 meses</option>
                          <option value="24">24 meses</option>
                          <option value="36">36 meses</option>
                          <option value="48">48 meses</option>
                          <option value="60">60 meses</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ingresos Mensuales (USD) *
                        </label>
                        <input
                          type="number"
                          name="ingresosMensuales"
                          value={formData.ingresosMensuales}
                          onChange={handleInputChange}
                          placeholder="0.00"
                          step="0.01"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gastos Promedios (USD)
                        </label>
                        <input
                          type="number"
                          name="gastosPromedios"
                          value={formData.gastosPromedios}
                          onChange={handleInputChange}
                          placeholder="0.00"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Propósito del Préstamo *
                      </label>
                      <textarea
                        name="proposito"
                        value={formData.proposito}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        placeholder="Describe el propósito del préstamo..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Garantía/Colateral
                      </label>
                      <textarea
                        name="garantia"
                        value={formData.garantia}
                        onChange={handleInputChange}
                        rows={2}
                        placeholder="Describe la garantía o colateral (opcional)..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div className="flex justify-end space-x-4 pt-6">
                      <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {submitting ? "Enviando..." : "Enviar Solicitud"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === "consultar" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <img src="/imagenes/deposito.png" alt="Préstamos" className="w-16 h-16 mr-4" />
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">Préstamos del Sistema</h2>
                        <p className="text-gray-600">Consulta el estado de todos los préstamos</p>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Número
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cliente
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            DUI
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Monto Solicitado
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Monto Aprobado
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Plazo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha Solicitud
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {prestamos.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                              No hay préstamos registrados
                            </td>
                          </tr>
                        ) : (
                          prestamos.map((prestamo) => (
                            <tr key={prestamo.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {prestamo.numeroPrestamo}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {prestamo.cliente.nombreCompleto}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {prestamo.cliente.dui || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ${prestamo.montoSolicitado.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {prestamo.montoAprobado ? `$${prestamo.montoAprobado.toLocaleString()}` : 'Pendiente'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {prestamo.plazoMeses} meses
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatDate(prestamo.fechaSolicitud)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(prestamo.estado)}`}>
                                  {prestamo.estado.charAt(0).toUpperCase() + prestamo.estado.slice(1)}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
