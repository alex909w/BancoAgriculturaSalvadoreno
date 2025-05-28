"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Transaccion {
  id: number
  numeroTransaccion: string
  tipoTransaccion: {
    id: number
    nombre: string
  }
  cuentaOrigen?: {
    id: number
    numeroCuenta: string
  }
  cuentaDestino?: {
    id: number
    numeroCuenta: string
  }
  monto: number
  comision: number
  fechaTransaccion: string
  cajero?: {
    id: number
    nombreCompleto: string
  }
  sucursal: {
    id: number
    nombre: string
  }
  descripcion: string
  estado: string
}

async function fetchTransacciones() {
  const response = await fetch("http://localhost:8081/api/transacciones", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  })

  if (!response.ok) {
    throw new Error("Error al cargar transacciones")
  }

  return await response.json()
}

export default function TransaccionesRecientes() {
  const router = useRouter()
  const [transacciones, setTransacciones] = useState<Transaccion[]>([])
  const [loading, setLoading] = useState(true)
  const [menuVisible, setMenuVisible] = useState(false)

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

    loadTransacciones()
  }, [router])
  const loadTransacciones = async () => {
    try {
      setLoading(true)
      console.log("Intentando cargar transacciones desde la API...")
      const data = await fetchTransacciones()
      console.log("Respuesta completa de la API:", data)
      console.log("Tipo de datos recibidos:", typeof data)
      console.log("¿Es array?", Array.isArray(data))
      console.log("Longitud si es array:", Array.isArray(data) ? data.length : 'No es array')

      if (Array.isArray(data)) {
        console.log(`Cargadas ${data.length} transacciones desde la API`)
        setTransacciones(data)
      } else if (data && data.data && Array.isArray(data.data)) {
        // La respuesta podría estar envuelta en un objeto con propiedad 'data'
        console.log(`Encontradas ${data.data.length} transacciones en data.data`)
        setTransacciones(data.data)
      } else if (data && data.transacciones && Array.isArray(data.transacciones)) {
        // O podría estar en una propiedad 'transacciones'
        console.log(`Encontradas ${data.transacciones.length} transacciones en data.transacciones`)
        setTransacciones(data.transacciones)
      } else {
        console.warn("La respuesta de la API no es un array válido:", data)
        console.warn("Estructura de la respuesta:", Object.keys(data || {}))
        setTransacciones([])
      }
    } catch (error) {
      console.error("Error al cargar transacciones:", error)
      setTransacciones([])
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-SV", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    })
  }

  const getTipoTransaccion = (tipo: string) => {
    return tipo === "Depósito" ? "Ingreso" : "Egreso"
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
          <h1 className="text-2xl font-bold">Transacciones Recientes</h1>
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

      <main className="p-6 max-w-4xl mx-auto">        <div className="bg-white rounded-lg shadow-md p-6">          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Transacciones Recientes</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={loadTransacciones}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    Cargando...
                  </>
                ) : (
                  <>
                    🔄 Recargar
                  </>
                )}
              </button>              <button
                onClick={async () => {
                  console.log("=== DEBUG: Probando API Transacciones ===")
                  console.log("Token:", localStorage.getItem("authToken"))
                  console.log("UserRole:", localStorage.getItem("userRole"))
                  try {
                    console.log("Haciendo petición a: http://localhost:8081/api/transacciones")
                    const response = await fetch("http://localhost:8081/api/transacciones", {
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                      },
                    })
                    console.log("Status de respuesta:", response.status)
                    console.log("Headers de respuesta:", Object.fromEntries(response.headers.entries()))
                    
                    const data = await response.json()
                    console.log("Datos recibidos:", data)
                    console.log("Tipo de datos:", typeof data)
                    console.log("¿Es array?", Array.isArray(data))
                    console.log("Claves del objeto:", data && typeof data === 'object' ? Object.keys(data) : 'No es objeto')
                    
                    if (Array.isArray(data)) {
                      console.log("Longitud del array:", data.length)
                      console.log("Primer elemento:", data[0])
                    } else if (data && typeof data === 'object') {
                      console.log("Estructura del objeto:", JSON.stringify(data, null, 2))
                    }
                  } catch (error) {
                    console.error("Error en debug:", error)
                  }
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                🔍 Debug API
              </button>
            </div>
          </div>{loading ? (
            <div className="text-center py-8">
              <div className="animate-spin text-4xl mb-4">⟳</div>
              <p className="text-gray-500">Cargando transacciones desde la API...</p>
            </div>
          ) : transacciones.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No se encontraron transacciones.</p>
              <button
                onClick={loadTransacciones}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                🔄 Intentar nuevamente
              </button>
            </div>          ) : (
            <div className="space-y-6">
              <div className="border rounded-lg p-3 bg-green-50 border-green-200">
                <p className="font-medium text-green-800">
                  ✅ Total de transacciones: {transacciones.length} (datos desde la API)
                </p>
              </div>
              {transacciones.map((transaccion) => (
                <div key={transaccion.id} className="border-b pb-4 last:border-b-0">
                  <p className="font-semibold">
                    Fecha: <span className="font-normal">{formatDate(transaccion.fechaTransaccion)}</span>
                  </p>
                  <p className="font-semibold">
                    Descripción: <span className="font-normal">{transaccion.descripcion}</span>
                  </p>
                  <p className="font-semibold">
                    Monto: <span className="font-normal">{formatCurrency(transaccion.monto).replace("$", "")} US</span>
                  </p>
                  <p className="font-semibold">
                    Tipo: <span className="font-normal">{getTipoTransaccion(transaccion.tipoTransaccion.nombre)}</span>
                  </p>
                </div>
              ))}
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
