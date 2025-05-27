"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { apiRequest } from "@/lib/api"

interface EstadisticasGenerales {
  totalUsuarios: number
  usuariosActivos: number
  totalTransacciones: number
  saldoTotal: number
}

export default function ReportesEstadisticasPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [menuVisible, setMenuVisible] = useState(false)
  const [estadisticas, setEstadisticas] = useState<EstadisticasGenerales>({
    totalUsuarios: 150,
    usuariosActivos: 120,
    totalTransacciones: 500,
    saldoTotal: 100000,
  })

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem("authToken")
    const userRole = localStorage.getItem("userRole")

    if (!token || !userRole) {
      router.push("/login")
      return
    }

    if (userRole !== "admin") {
      router.push("/login")
      return
    }

    loadEstadisticas()
  }, [router])

  const loadEstadisticas = async () => {
    try {
      setLoading(true)
      // En producción, esto sería una llamada GET a /estadisticas
      try {
        const data = await apiRequest("/estadisticas")
        setEstadisticas({
          totalUsuarios: data.totalUsuarios || 150,
          usuariosActivos: data.usuariosActivos || 120,
          totalTransacciones: data.totalTransacciones || 500,
          saldoTotal: data.saldoTotal || 100000,
        })
      } catch (error) {
        console.error("Error al cargar estadísticas:", error)
        // Si falla, usamos los datos por defecto
      }
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

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userRole")
    localStorage.removeItem("username")
    router.push("/login")
  }

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-green-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/imagenes/logo.png" alt="AgroBanco Salvadoreño" className="h-12 mr-4" />
          <h1 className="text-2xl font-bold">Reportes y Estadísticas</h1>
        </div>
        <div className="relative">
          <button
            className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden cursor-pointer border-0 p-0"
            onClick={toggleMenu}
          >
            <img src="/imagenes/Usuario.png" alt="Usuario" className="w-full h-full object-cover" />
          </button>
          {menuVisible && (
            <div className="absolute right-0 bg-white rounded-lg shadow-md p-2 flex flex-col z-10 mt-2">
              <button
                className="bg-none border-0 p-2 cursor-pointer text-left hover:bg-gray-100 text-gray-700"
                onClick={() => router.push("/perfil-admin")}
              >
                Perfil
              </button>
              <button
                className="bg-none border-0 p-2 cursor-pointer text-left hover:bg-gray-100 text-gray-700"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Estadísticas del Sistema</h2>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Cargando estadísticas...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <h3 className="text-green-600 font-semibold mb-2">Usuarios Totales</h3>
                <p className="text-2xl font-bold">{estadisticas.totalUsuarios}</p>
              </div>
              <div>
                <h3 className="text-green-600 font-semibold mb-2">Usuarios Activos</h3>
                <p className="text-2xl font-bold">{estadisticas.usuariosActivos}</p>
              </div>
              <div>
                <h3 className="text-green-600 font-semibold mb-2">Transacciones Totales</h3>
                <p className="text-2xl font-bold">{estadisticas.totalTransacciones}</p>
              </div>
              <div>
                <h3 className="text-green-600 font-semibold mb-2">Saldo Total</h3>
                <p className="text-2xl font-bold">{formatCurrency(estadisticas.saldoTotal).replace("$", "")} US</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link href="/dashboard-admin">
            <button className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600">Regresar</button>
          </Link>
        </div>
      </main>
    </div>
  )
}
