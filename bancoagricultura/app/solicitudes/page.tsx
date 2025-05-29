"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Prestamo {
  id: number
  numero_prestamo: string
  cliente: {
    id: number
    nombre_completo: string
    dui: string
    email: string
    telefono: string
  }
  tipo_prestamo: {
    id: number
    nombre: string
    descripcion: string
    tasa_interes: number
    requiere_garantia: boolean
    monto_minimo: number
    monto_maximo: number
  }
  monto_solicitado: number
  monto_aprobado?: number
  plazo_meses: number
  estado: string
  fecha_solicitud: string
  observaciones?: string
  cuenta_vinculada_id: number
}

export default function SolicitudesPrestamos() {
  const router = useRouter()
  const [prestamos, setPrestamos] = useState<Prestamo[]>([])
  const [loading, setLoading] = useState(true)
  const [menuVisible, setMenuVisible] = useState(false)
  const [selectedPrestamo, setSelectedPrestamo] = useState<Prestamo | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<"aprobar" | "rechazar">("aprobar")
  const [montoAprobado, setMontoAprobado] = useState("")
  const [observaciones, setObservaciones] = useState("")
  const [processing, setProcessing] = useState(false)

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

    loadSolicitudes()
  }, [router])

  const loadSolicitudes = async () => {
    try {
      setLoading(true)
      console.log("Cargando solicitudes de préstamos...")

      // Simular datos basados en la estructura real de la BD
      const mockPrestamos: Prestamo[] = [
        {
          id: 2,
          numero_prestamo: "PRE-002",
          cliente: {
            id: 2,
            nombre_completo: "Cliente",
            dui: "046765789",
            email: "cliente@gmail.com",
            telefono: "78573605",
          },
          tipo_prestamo: {
            id: 1,
            nombre: "Personal",
            descripcion: "Préstamo personal sin garantía",
            tasa_interes: 0.12,
            requiere_garantia: false,
            monto_minimo: 500.0,
            monto_maximo: 10000.0,
          },
          monto_solicitado: 5000.0,
          plazo_meses: 24,
          estado: "solicitado",
          fecha_solicitud: "2025-01-28",
          cuenta_vinculada_id: 1,
        },
        {
          id: 3,
          numero_prestamo: "PRE-003",
          cliente: {
            id: 2,
            nombre_completo: "Cliente",
            dui: "046765789",
            email: "cliente@gmail.com",
            telefono: "78573605",
          },
          tipo_prestamo: {
            id: 4,
            nombre: "Agrícola",
            descripcion: "Préstamo para actividades agrícolas",
            tasa_interes: 0.09,
            requiere_garantia: false,
            monto_minimo: 1000.0,
            monto_maximo: 25000.0,
          },
          monto_solicitado: 15000.0,
          plazo_meses: 36,
          estado: "en_revision",
          fecha_solicitud: "2025-01-25",
          cuenta_vinculada_id: 2,
        },
      ]

      setPrestamos(mockPrestamos)
    } catch (error) {
      console.error("Error al cargar solicitudes:", error)
      setPrestamos([])
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

  const calcularCuotaMensual = (monto: number, tasa: number, meses: number) => {
    const tasaMensual = tasa / 12
    const cuota = (monto * tasaMensual * Math.pow(1 + tasaMensual, meses)) / (Math.pow(1 + tasaMensual, meses) - 1)
    return cuota
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

  const handleAprobar = (prestamo: Prestamo) => {
    setSelectedPrestamo(prestamo)
    setModalType("aprobar")
    setMontoAprobado(prestamo.monto_solicitado.toString())
    setObservaciones("")
    setShowModal(true)
  }

  const handleRechazar = (prestamo: Prestamo) => {
    setSelectedPrestamo(prestamo)
    setModalType("rechazar")
    setObservaciones("")
    setShowModal(true)
  }

  const procesarSolicitud = async () => {
    if (!selectedPrestamo) return

    setProcessing(true)

    try {
      if (modalType === "aprobar") {
        const monto = Number.parseFloat(montoAprobado)
        if (isNaN(monto) || monto <= 0 || monto > selectedPrestamo.monto_solicitado) {
          alert("Monto inválido")
          return
        }

        // Simular aprobación
        console.log("Aprobando préstamo:", {
          id: selectedPrestamo.id,
          montoAprobado: monto,
          gerenteId: 4, // ID del gerente en la BD
          observaciones,
        })

        alert("Préstamo aprobado con éxito")
        loadSolicitudes()
      } else if (modalType === "rechazar") {
        // Simular rechazo
        console.log("Rechazando préstamo:", {
          id: selectedPrestamo.id,
          observaciones,
        })

        alert("Préstamo rechazado con éxito")
        loadSolicitudes()
      }
    } catch (error) {
      console.error("Error al procesar la solicitud:", error)
      alert("Error al procesar la solicitud")
    } finally {
      setProcessing(false)
      setShowModal(false)
    }
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
          <h1 className="text-xl font-bold text-green-700">Solicitudes de Préstamos</h1>
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
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <img src="/imagenes/solicitud.png" alt="Solicitudes" className="w-16 h-16 mr-4" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Solicitudes Pendientes</h2>
                  <p className="text-gray-600">Revisa y procesa las solicitudes de préstamos</p>
                </div>
              </div>
              <button
                onClick={loadSolicitudes}
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

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin text-4xl mb-4">⟳</div>
                <p className="text-gray-500">Cargando solicitudes...</p>
              </div>
            ) : prestamos.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-gray-500 mb-4">No hay solicitudes pendientes en este momento.</p>
                <p className="text-sm text-gray-400">Las nuevas solicitudes aparecerán aquí automáticamente.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {prestamos.map((prestamo) => {
                  const cuotaMensual = calcularCuotaMensual(
                    prestamo.monto_solicitado,
                    prestamo.tipo_prestamo.tasa_interes,
                    prestamo.plazo_meses,
                  )

                  return (
                    <div key={prestamo.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Información del Cliente */}
                        <div className="space-y-3">
                          <h3 className="font-bold text-lg text-green-700">Información del Cliente</h3>
                          <div className="space-y-2 text-sm">
                            <p>
                              <span className="font-semibold">Nombre:</span> {prestamo.cliente.nombre_completo}
                            </p>
                            <p>
                              <span className="font-semibold">DUI:</span> {prestamo.cliente.dui}
                            </p>
                            <p>
                              <span className="font-semibold">Email:</span> {prestamo.cliente.email}
                            </p>
                            <p>
                              <span className="font-semibold">Teléfono:</span> {prestamo.cliente.telefono}
                            </p>
                          </div>
                        </div>

                        {/* Información del Préstamo */}
                        <div className="space-y-3">
                          <h3 className="font-bold text-lg text-green-700">Detalles del Préstamo</h3>
                          <div className="space-y-2 text-sm">
                            <p>
                              <span className="font-semibold">Número:</span> {prestamo.numero_prestamo}
                            </p>
                            <p>
                              <span className="font-semibold">Tipo:</span> {prestamo.tipo_prestamo.nombre}
                            </p>
                            <p>
                              <span className="font-semibold">Monto:</span>{" "}
                              <span className="text-lg font-bold text-green-600">
                                {formatCurrency(prestamo.monto_solicitado)}
                              </span>
                            </p>
                            <p>
                              <span className="font-semibold">Plazo:</span> {prestamo.plazo_meses} meses
                            </p>
                            <p>
                              <span className="font-semibold">Tasa:</span>{" "}
                              {(prestamo.tipo_prestamo.tasa_interes * 100).toFixed(2)}%
                            </p>
                            <p>
                              <span className="font-semibold">Fecha:</span>{" "}
                              {new Date(prestamo.fecha_solicitud).toLocaleDateString("es-SV")}
                            </p>
                          </div>
                        </div>

                        {/* Análisis Financiero */}
                        <div className="space-y-3">
                          <h3 className="font-bold text-lg text-green-700">Análisis del Préstamo</h3>
                          <div className="space-y-2 text-sm">
                            <p>
                              <span className="font-semibold">Cuota Mensual:</span>{" "}
                              <span className="text-lg font-bold text-blue-600">{formatCurrency(cuotaMensual)}</span>
                            </p>
                            <p>
                              <span className="font-semibold">Rango Permitido:</span>{" "}
                              {formatCurrency(prestamo.tipo_prestamo.monto_minimo)} -{" "}
                              {formatCurrency(prestamo.tipo_prestamo.monto_maximo)}
                            </p>
                            <p>
                              <span className="font-semibold">Garantía:</span>
                              <span
                                className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                                  prestamo.tipo_prestamo.requiere_garantia
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {prestamo.tipo_prestamo.requiere_garantia ? "Requerida" : "No requerida"}
                              </span>
                            </p>
                            <p>
                              <span className="font-semibold">Estado:</span>
                              <span
                                className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                                  prestamo.estado === "solicitado"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-orange-100 text-orange-800"
                                }`}
                              >
                                {prestamo.estado === "solicitado" ? "Nuevo" : "En Revisión"}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Descripción del Tipo de Préstamo */}
                      <div className="mt-4 space-y-2">
                        <div>
                          <span className="font-semibold">Descripción:</span>
                          <p className="text-sm text-gray-700 mt-1">{prestamo.tipo_prestamo.descripcion}</p>
                        </div>
                        <div>
                          <span className="font-semibold">Cuenta Vinculada:</span>
                          <p className="text-sm text-gray-700 mt-1">ID: {prestamo.cuenta_vinculada_id}</p>
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="mt-6 flex justify-end space-x-4">
                        <button
                          onClick={() => handleRechazar(prestamo)}
                          className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                          Rechazar
                        </button>
                        <button
                          onClick={() => handleAprobar(prestamo)}
                          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                          Aprobar
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal para aprobar/rechazar */}
      {showModal && selectedPrestamo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold mb-4">
              {modalType === "aprobar" ? "Aprobar Préstamo" : "Rechazar Préstamo"}
            </h3>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Cliente:</span> {selectedPrestamo.cliente.nombre_completo}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Monto solicitado:</span>{" "}
                {formatCurrency(selectedPrestamo.monto_solicitado)}
              </p>
            </div>

            {modalType === "aprobar" ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monto a aprobar (USD) *</label>
                  <input
                    type="number"
                    value={montoAprobado}
                    onChange={(e) => setMontoAprobado(e.target.value)}
                    step="0.01"
                    min={selectedPrestamo.tipo_prestamo.monto_minimo}
                    max={selectedPrestamo.monto_solicitado}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones (opcional)</label>
                  <textarea
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Comentarios adicionales..."
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Motivo del rechazo *</label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Explique el motivo del rechazo..."
                  required
                />
              </div>
            )}

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={processing}
              >
                Cancelar
              </button>
              <button
                onClick={procesarSolicitud}
                disabled={
                  processing ||
                  (modalType === "aprobar" && !montoAprobado) ||
                  (modalType === "rechazar" && !observaciones)
                }
                className={`px-4 py-2 rounded-md text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  modalType === "aprobar" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {processing ? "Procesando..." : modalType === "aprobar" ? "Aprobar" : "Rechazar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
