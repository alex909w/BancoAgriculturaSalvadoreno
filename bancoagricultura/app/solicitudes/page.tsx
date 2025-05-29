"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface Solicitud {
  id: string
  cliente: string
  dui: string
  tipo: "prestamo" | "cuenta" | "tarjeta"
  monto?: string
  estado: "pendiente" | "aprobada" | "rechazada"
  fecha: string
  descripcion: string
}

export default function Solicitudes() {
  const router = useRouter()
  const [menuVisible, setMenuVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([
    {
      id: "SOL001",
      cliente: "María González",
      dui: "12345678-9",
      tipo: "prestamo",
      monto: "$15,000",
      estado: "pendiente",
      fecha: "2024-01-15",
      descripcion: "Préstamo para inversión agrícola"
    },
    {
      id: "SOL002",
      cliente: "Carlos Martínez",
      dui: "98765432-1",
      tipo: "cuenta",
      estado: "pendiente",
      fecha: "2024-01-14",
      descripcion: "Apertura de cuenta de ahorros"
    },
    {
      id: "SOL003",
      cliente: "Ana López",
      dui: "11223344-5",
      tipo: "tarjeta",
      estado: "aprobada",
      fecha: "2024-01-13",
      descripcion: "Solicitud de tarjeta de débito"
    }
  ])

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem("authToken")
    const userRole = localStorage.getItem("userRole")

    if (!token || !userRole) {
      router.push("/login")
      return
    }

    if (userRole !== "gerente" && userRole !== "admin") {
      router.push("/login")
      return
    }

    setLoading(false)
  }, [router])

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

  const handleApprove = (id: string) => {
    setSolicitudes(prev => prev.map(solicitud => 
      solicitud.id === id ? { ...solicitud, estado: "aprobada" as const } : solicitud
    ))
    alert("Solicitud aprobada exitosamente")
  }

  const handleReject = (id: string) => {
    setSolicitudes(prev => prev.map(solicitud => 
      solicitud.id === id ? { ...solicitud, estado: "rechazada" as const } : solicitud
    ))
    alert("Solicitud rechazada")
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "aprobada":
        return "bg-green-100 text-green-800"
      case "rechazada":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "prestamo":
        return "💰"
      case "cuenta":
        return "🏦"
      case "tarjeta":
        return "💳"
      default:
        return "📄"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando solicitudes...</p>
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
          <h1 className="text-xl font-bold">Gestión de Solicitudes</h1>
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
                onClick={() => router.push("/dashboard-gerente")}
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
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
              <Image src="/imagenes/solicitud.png" alt="Solicitudes" width={64} height={64} className="mr-4" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Solicitudes Pendientes</h2>
                <p className="text-gray-600">Gestiona las solicitudes de clientes</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center">
                  <div className="bg-yellow-500 p-2 rounded-full mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-800">
                      {solicitudes.filter(s => s.estado === "pendiente").length}
                    </p>
                    <p className="text-yellow-600">Pendientes</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <div className="bg-green-500 p-2 rounded-full mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-800">
                      {solicitudes.filter(s => s.estado === "aprobada").length}
                    </p>
                    <p className="text-green-600">Aprobadas</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center">
                  <div className="bg-red-500 p-2 rounded-full mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-800">
                      {solicitudes.filter(s => s.estado === "rechazada").length}
                    </p>
                    <p className="text-red-600">Rechazadas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-lg font-bold text-gray-800">Lista de Solicitudes</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Solicitud
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {solicitudes.map((solicitud) => (
                    <tr key={solicitud.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{getTipoIcon(solicitud.tipo)}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{solicitud.id}</div>
                            <div className="text-sm text-gray-500">{solicitud.descripcion}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{solicitud.cliente}</div>
                          <div className="text-sm text-gray-500">{solicitud.dui}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="capitalize text-sm text-gray-900">{solicitud.tipo}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {solicitud.monto || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(solicitud.estado)}`}>
                          {solicitud.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(solicitud.fecha).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {solicitud.estado === "pendiente" && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApprove(solicitud.id)}
                              className="text-green-600 hover:text-green-900 px-3 py-1 bg-green-100 rounded-md"
                            >
                              Aprobar
                            </button>
                            <button
                              onClick={() => handleReject(solicitud.id)}
                              className="text-red-600 hover:text-red-900 px-3 py-1 bg-red-100 rounded-md"
                            >
                              Rechazar
                            </button>
                          </div>
                        )}
                        {solicitud.estado !== "pendiente" && (
                          <span className="text-gray-400">Procesada</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}