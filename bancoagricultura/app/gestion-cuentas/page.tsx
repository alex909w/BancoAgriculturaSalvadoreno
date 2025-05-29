"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Cuenta {
  id: number
  numeroCuenta: string
  cliente: {
    id: number
    username: string
    email: string
    nombreCompleto: string
    dui: string
    telefono: string
    direccion: string
    fechaNacimiento: string
    genero: string
    profesion: string
    salario: number
    rol: {
      id: number
      nombre: string
      descripcion: string
      createdAt: string
      updatedAt: string
    }
    sucursal: {
      id: number
      nombre: string
      codigo: string
      departamento: string
      municipio: string
      direccion: string
      telefono: string
      tipo: string
      estado: string
      createdAt: string
      updatedAt: string
    }
    estado: string
    ultimoLogin: string
    createdAt: string
    updatedAt: string
  }
  tipoCuenta: {
    id: number
    nombre: string
    descripcion: string
    tasaInteres: number
    montoMinimo: number
    comisionMantenimiento: number
    createdAt: string
  }
  sucursal: {
    id: number
    nombre: string
    codigo: string
    departamento: string
    municipio: string
    direccion: string
    telefono: string
    tipo: string
    estado: string
    createdAt: string
    updatedAt: string
  }
  saldo: number
  estado: string
  tieneSeguro: boolean
  fechaApertura: string
  createdAt: string
  updatedAt: string
}

async function fetchCuentas() {
  const response = await fetch("http://localhost:8081/api/cuentas", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  })

  if (!response.ok) {
    throw new Error("Error al cargar cuentas")
  }

  return await response.json()
}

export default function GestionCuentas() {
  const router = useRouter()
  const [cuentas, setCuentas] = useState<Cuenta[]>([])
  const [loading, setLoading] = useState(true)
  const [menuVisible, setMenuVisible] = useState(false)
  const [usingMockData, setUsingMockData] = useState(false)

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem("authToken")
    const userRole = localStorage.getItem("userRole")

    if (!token || !userRole) {
      router.push("/login")
      return
    }    if (userRole !== "admin") {
      router.push("/login")
      return
    }

    loadCuentas()
  }, [router])
  
  const loadCuentas = async () => {
    try {
      setLoading(true)
      console.log("Intentando cargar cuentas desde la API...")
      const data = await fetchCuentas()
      console.log("Respuesta de la API:", data)

      // Verificar si hay un error en la respuesta
      if (data && data.error) {
        console.error("Error al cargar cuentas:", data.message)
        // Si hay error, usamos datos simulados
        console.log("Usando datos simulados debido a error en API")
      } else if (Array.isArray(data)) {
        // Si la respuesta es exitosa y es un array, usamos los datos reales
        console.log(`Cargadas ${data.length} cuentas desde la API`)
        setCuentas(data)
        setUsingMockData(false)
      } else {
        console.warn("La respuesta de la API no es un array válido:", data)
        console.log("Usando datos simulados debido a formato inválido")
      }
    } catch (error) {
      console.error("Error inesperado al cargar cuentas:", error)
      console.log("Usando datos simulados debido a error de conexión")
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
          <h1 className="text-2xl font-bold">Gestión de Cuentas</h1>
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

      <main className="p-6 max-w-4xl mx-auto">        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Lista de Cuentas</h2>
            <div className="flex items-center gap-3">
              {usingMockData && (
                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                  ⚠️ Usando datos simulados
                </div>
              )}              <button
                onClick={loadCuentas}
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
                  console.log("=== DEBUG: Probando API ===")
                  console.log("Token:", localStorage.getItem("authToken"))
                  console.log("UserRole:", localStorage.getItem("userRole"))
                  try {
                    const data = await fetchCuentas()
                    console.log("Response data:", data)
                  } catch (error) {
                    console.error("Error en debug:", error)
                  }
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                🔍 Debug API
              </button>
            </div>
          </div>          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin text-4xl mb-4">⟳</div>
              <p className="text-gray-500">Cargando cuentas desde la API...</p>
            </div>
          ) : cuentas.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No se encontraron cuentas.</p>
              <button
                onClick={loadCuentas}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                🔄 Intentar nuevamente
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className={`border rounded-lg p-3 ${usingMockData ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
                <p className={`font-medium ${usingMockData ? 'text-yellow-800' : 'text-green-800'}`}>
                  {usingMockData ? '⚠️' : '✅'} Total de cuentas: {cuentas.length}
                  {usingMockData ? ' (datos de ejemplo - verifique la conexión a la API)' : ' (datos reales desde la API)'}
                </p>
              </div>
              {cuentas.map((cuenta) => (
                <div key={cuenta.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="font-semibold text-lg text-green-700">
                        Cuenta #{cuenta.numeroCuenta}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Cliente:</span> {cuenta.cliente.nombreCompleto}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">DUI:</span> {cuenta.cliente.dui}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Email:</span> {cuenta.cliente.email}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Teléfono:</span> {cuenta.cliente.telefono}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-semibold">Tipo de Cuenta:</span> {cuenta.tipoCuenta.nombre}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Saldo:</span> 
                        <span className="text-lg font-bold text-green-600 ml-2">
                          {formatCurrency(cuenta.saldo)}
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Estado:</span> 
                        <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                          cuenta.estado === 'activa' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {cuenta.estado}
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Seguro:</span> 
                        <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                          cuenta.tieneSeguro 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {cuenta.tieneSeguro ? 'Con seguro' : 'Sin seguro'}
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Sucursal:</span> {cuenta.sucursal.nombre}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Fecha de Apertura:</span> {new Date(cuenta.fechaApertura).toLocaleDateString('es-SV')}
                      </p>
                    </div>
                  </div>
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
