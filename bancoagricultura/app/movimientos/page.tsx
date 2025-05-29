"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Transaccion {
  id: number
  numero_transaccion: string
  tipo_transaccion: {
    id: number
    nombre: string
    descripcion: string
    requiere_cuenta_destino: boolean
    comision: number
  }
  cuenta_origen: {
    id: number
    numero_cuenta: string
    cliente: {
      nombre_completo: string
      dui: string
    }
    tipo_cuenta: {
      nombre: string
    }
  }
  cuenta_destino?: {
    id: number
    numero_cuenta: string
    cliente: {
      nombre_completo: string
      dui: string
    }
  }
  monto: number
  comision: number
  descripcion?: string
  estado: string
  sucursal: {
    id: number
    nombre: string
    codigo: string
  }
  fecha_transaccion: string
  cajero?: {
    id: number
    nombre_completo: string
  }
}

interface Cuenta {
  id: number
  numero_cuenta: string
  cliente: {
    nombre_completo: string
    dui: string
  }
  tipo_cuenta: {
    nombre: string
  }
  saldo: number
  estado: string
  fecha_apertura: string
  sucursal: {
    nombre: string
  }
}

export default function MovimientosPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("transacciones")
  const [transacciones, setTransacciones] = useState<Transaccion[]>([])
  const [cuentas, setCuentas] = useState<Cuenta[]>([])
  const [loading, setLoading] = useState(true)
  const [menuVisible, setMenuVisible] = useState(false)
  const [filtroFecha, setFiltroFecha] = useState("")
  const [filtroTipo, setFiltroTipo] = useState("")
  const [filtroMonto, setFiltroMonto] = useState("")

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem("authToken")
    const userRole = localStorage.getItem("userRole")

    if (!token || !userRole) {
      router.push("/login")
      return
    }

    if (userRole !== "gerente") {
      router.push("/login")
      return
    }

    loadData()
  }, [router])

  const loadData = async () => {
    try {
      setLoading(true)
      console.log("Cargando movimientos y cuentas...")

      // Datos basados en la estructura real de la BD
      const mockTransacciones: Transaccion[] = [
        {
          id: 1,
          numero_transaccion: "TXN-2025-001",
          tipo_transaccion: {
            id: 1,
            nombre: "Depósito",
            descripcion: "Depósito en efectivo",
            requiere_cuenta_destino: false,
            comision: 0.0,
          },
          cuenta_origen: {
            id: 1,
            numero_cuenta: "652732736823",
            cliente: {
              nombre_completo: "Cliente",
              dui: "046765789",
            },
            tipo_cuenta: {
              nombre: "Ahorros",
            },
          },
          monto: 500.0,
          comision: 0.0,
          descripcion: "Depósito en efectivo",
          estado: "completada",
          sucursal: {
            id: 1,
            nombre: "Sucursal Central",
            codigo: "SC001",
          },
          fecha_transaccion: "2025-01-28T10:30:00Z",
          cajero: {
            id: 3,
            nombre_completo: "Cajero",
          },
        },
        {
          id: 2,
          numero_transaccion: "TXN-2025-002",
          tipo_transaccion: {
            id: 2,
            nombre: "Retiro",
            descripcion: "Retiro en efectivo",
            requiere_cuenta_destino: false,
            comision: 1.0,
          },
          cuenta_origen: {
            id: 2,
            numero_cuenta: "57687676666",
            cliente: {
              nombre_completo: "Cliente",
              dui: "046765789",
            },
            tipo_cuenta: {
              nombre: "Corriente",
            },
          },
          monto: 200.0,
          comision: 1.0,
          descripcion: "Retiro en efectivo",
          estado: "completada",
          sucursal: {
            id: 1,
            nombre: "Sucursal Central",
            codigo: "SC001",
          },
          fecha_transaccion: "2025-01-28T14:15:00Z",
          cajero: {
            id: 3,
            nombre_completo: "Cajero",
          },
        },
        {
          id: 3,
          numero_transaccion: "TXN-2025-003",
          tipo_transaccion: {
            id: 3,
            nombre: "Transferencia",
            descripcion: "Transferencia entre cuentas",
            requiere_cuenta_destino: true,
            comision: 2.5,
          },
          cuenta_origen: {
            id: 1,
            numero_cuenta: "652732736823",
            cliente: {
              nombre_completo: "Cliente",
              dui: "046765789",
            },
            tipo_cuenta: {
              nombre: "Ahorros",
            },
          },
          cuenta_destino: {
            id: 2,
            numero_cuenta: "57687676666",
            cliente: {
              nombre_completo: "Cliente",
              dui: "046765789",
            },
          },
          monto: 300.0,
          comision: 2.5,
          descripcion: "Transferencia entre cuentas propias",
          estado: "completada",
          sucursal: {
            id: 1,
            nombre: "Sucursal Central",
            codigo: "SC001",
          },
          fecha_transaccion: "2025-01-28T16:45:00Z",
          cajero: {
            id: 3,
            nombre_completo: "Cajero",
          },
        },
      ]

      const mockCuentas: Cuenta[] = [
        {
          id: 1,
          numero_cuenta: "652732736823",
          cliente: {
            nombre_completo: "Cliente",
            dui: "046765789",
          },
          tipo_cuenta: {
            nombre: "Ahorros",
          },
          saldo: 1500.0,
          estado: "activa",
          fecha_apertura: "2024-01-10",
          sucursal: {
            nombre: "Sucursal Central",
          },
        },
        {
          id: 2,
          numero_cuenta: "57687676666",
          cliente: {
            nombre_completo: "Cliente",
            dui: "046765789",
          },
          tipo_cuenta: {
            nombre: "Corriente",
          },
          saldo: 3000.0,
          estado: "activa",
          fecha_apertura: "2024-03-15",
          sucursal: {
            nombre: "Sucursal Central",
          },
        },
        {
          id: 3,
          numero_cuenta: "1049170690",
          cliente: {
            nombre_completo: "Cliente",
            dui: "046765789",
          },
          tipo_cuenta: {
            nombre: "Ahorros",
          },
          saldo: 500.0,
          estado: "activa",
          fecha_apertura: "2025-05-28",
          sucursal: {
            nombre: "Sucursal Central",
          },
        },
      ]

      setTransacciones(mockTransacciones)
      setCuentas(mockCuentas)
    } catch (error) {
      console.error("Error al cargar datos:", error)
      setTransacciones([])
      setCuentas([])
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-SV", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-SV", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const filteredTransacciones = transacciones.filter((transaccion) => {
    const fechaMatch = !filtroFecha || transaccion.fecha_transaccion.includes(filtroFecha)
    const tipoMatch =
      !filtroTipo || transaccion.tipo_transaccion.nombre.toLowerCase().includes(filtroTipo.toLowerCase())
    const montoMatch = !filtroMonto || transaccion.monto >= Number.parseFloat(filtroMonto)

    return fechaMatch && tipoMatch && montoMatch
  })

  const totalTransacciones = filteredTransacciones.length
  const totalMonto = filteredTransacciones.reduce((sum, t) => sum + t.monto, 0)
  const totalCuentas = cuentas.length
  const totalSaldos = cuentas.reduce((sum, c) => sum + c.saldo, 0)

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full"
            title="Volver atrás"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <img src="/imagenes/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="h-12 mr-4" />
          <h1 className="text-xl font-bold text-green-700">Movimientos y Cuentas</h1>
        </div>
        <div className="relative">
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200" onClick={toggleMenu}>
            <img src="/imagenes/Usuario.png" alt="Usuario" className="w-8 h-8 rounded-full" />
          </button>

          {menuVisible && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <Link href="/perfil-gerente" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Perfil
              </Link>
              <Link href="/configuracion-gerente" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Configuración
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Transacciones</p>
                  <p className="text-2xl font-bold text-gray-900">{totalTransacciones}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Monto Total</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalMonto)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Cuentas</p>
                  <p className="text-2xl font-bold text-gray-900">{totalCuentas}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Saldos Totales</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSaldos)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="border-b">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab("transacciones")}
                  className={`px-6 py-3 font-medium text-sm ${
                    activeTab === "transacciones"
                      ? "border-b-2 border-green-500 text-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Transacciones
                </button>
                <button
                  onClick={() => setActiveTab("cuentas")}
                  className={`px-6 py-3 font-medium text-sm ${
                    activeTab === "cuentas"
                      ? "border-b-2 border-green-500 text-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Estado de Cuentas
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "transacciones" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <img src="/imagenes/movimiento.png" alt="Movimientos" className="w-16 h-16 mr-4" />
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">Historial de Transacciones</h2>
                        <p className="text-gray-600">Revisa todas las transacciones realizadas</p>
                      </div>
                    </div>
                    <button
                      onClick={loadData}
                      disabled={loading}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <span className="animate-spin">⟳</span>
                          Cargando...
                        </>
                      ) : (
                        <>🔄 Actualizar</>
                      )}
                    </button>
                  </div>

                  {/* Filtros */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por fecha</label>
                      <input
                        type="date"
                        value={filtroFecha}
                        onChange={(e) => setFiltroFecha(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por tipo</label>
                      <input
                        type="text"
                        value={filtroTipo}
                        onChange={(e) => setFiltroTipo(e.target.value)}
                        placeholder="Depósito, Retiro, Transferencia..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Monto mínimo</label>
                      <input
                        type="number"
                        value={filtroMonto}
                        onChange={(e) => setFiltroMonto(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin text-4xl mb-4">⟳</div>
                      <p className="text-gray-500">Cargando transacciones...</p>
                    </div>
                  ) : filteredTransacciones.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">💳</div>
                      <p className="text-gray-500 mb-4">No se encontraron transacciones.</p>
                      <p className="text-sm text-gray-400">
                        {transacciones.length === 0
                          ? "No hay transacciones registradas en el sistema."
                          : "Intente ajustar los filtros de búsqueda."}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Número
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tipo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Cliente
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Cuenta
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Monto
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Comisión
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Fecha
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Estado
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredTransacciones.map((transaccion) => (
                            <tr key={transaccion.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {transaccion.numero_transaccion}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    transaccion.tipo_transaccion.nombre === "Depósito"
                                      ? "bg-green-100 text-green-800"
                                      : transaccion.tipo_transaccion.nombre === "Retiro"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {transaccion.tipo_transaccion.nombre}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <div>
                                  <div className="font-medium">{transaccion.cuenta_origen.cliente.nombre_completo}</div>
                                  <div className="text-gray-500">{transaccion.cuenta_origen.cliente.dui}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <div>
                                  <div className="font-medium">{transaccion.cuenta_origen.numero_cuenta}</div>
                                  <div className="text-gray-500">{transaccion.cuenta_origen.tipo_cuenta.nombre}</div>
                                </div>
                                {transaccion.cuenta_destino && (
                                  <div className="text-gray-500 text-xs mt-1">
                                    → {transaccion.cuenta_destino.numero_cuenta}
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {formatCurrency(transaccion.monto)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatCurrency(transaccion.comision)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatDateTime(transaccion.fecha_transaccion)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                  {transaccion.estado}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "cuentas" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <img src="/imagenes/movimiento.png" alt="Cuentas" className="w-16 h-16 mr-4" />
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">Estado de Cuentas</h2>
                        <p className="text-gray-600">Resumen de todas las cuentas activas</p>
                      </div>
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin text-4xl mb-4">⟳</div>
                      <p className="text-gray-500">Cargando cuentas...</p>
                    </div>
                  ) : cuentas.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">🏦</div>
                      <p className="text-gray-500 mb-4">No se encontraron cuentas.</p>
                      <p className="text-sm text-gray-400">No hay cuentas registradas en el sistema.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {cuentas.map((cuenta) => (
                        <div key={cuenta.id} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-bold text-lg text-green-700">{cuenta.numero_cuenta}</h3>
                              <p className="text-sm text-gray-600">{cuenta.tipo_cuenta.nombre}</p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                cuenta.estado === "activa" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {cuenta.estado}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <p className="text-sm font-semibold">Cliente:</p>
                              <p className="text-sm text-gray-700">{cuenta.cliente.nombre_completo}</p>
                              <p className="text-xs text-gray-500">{cuenta.cliente.dui}</p>
                            </div>

                            <div>
                              <p className="text-sm font-semibold">Saldo Actual:</p>
                              <p className="text-xl font-bold text-green-600">{formatCurrency(cuenta.saldo)}</p>
                            </div>

                            <div>
                              <p className="text-sm font-semibold">Fecha de Apertura:</p>
                              <p className="text-sm text-gray-700">
                                {new Date(cuenta.fecha_apertura).toLocaleDateString("es-SV")}
                              </p>
                            </div>

                            <div>
                              <p className="text-sm font-semibold">Sucursal:</p>
                              <p className="text-sm text-gray-700">{cuenta.sucursal.nombre}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
