"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cuentasAPI } from "@/lib/api"

interface Cuenta {
  id: number
  numeroCuenta: string
  cliente: {
    id: number
    nombreCompleto: string
  }
  tipoCuenta: {
    id: number
    nombre: string
  }
  sucursal: {
    id: number
    nombre: string
  }
  saldo: number
  estado: string
  fechaApertura: string
}

export default function GestionCuentas() {
  const router = useRouter()
  const [cuentas, setCuentas] = useState<Cuenta[]>([])
  const [loading, setLoading] = useState(true)
  const [menuVisible, setMenuVisible] = useState(false)
  const [usingMockData, setUsingMockData] = useState(false)

  const useMockData = useCallback(() => {
    const mockCuentas: Cuenta[] = [
      {
        id: 1,
        numeroCuenta: "652732736823",
        cliente: { id: 1, nombreCompleto: "Juan Pérez" },
        tipoCuenta: { id: 1, nombre: "Ahorros" },
        sucursal: { id: 1, nombre: "Sucursal Central" },
        saldo: 7545,
        estado: "activa",
        fechaApertura: "2023-01-15",
      },
      {
        id: 2,
        numeroCuenta: "657687676666",
        cliente: { id: 2, nombreCompleto: "María García" },
        tipoCuenta: { id: 2, nombre: "Corriente" },
        sucursal: { id: 1, nombre: "Sucursal Central" },
        saldo: 232.0,
        estado: "activa",
        fechaApertura: "2023-02-20",
      },
    ]
    setCuentas(mockCuentas)
    setUsingMockData(true)
  }, [])

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

    loadCuentas()
  }, [router, useMockData])

  const loadCuentas = async () => {
    try {
      setLoading(true)
      const data = await cuentasAPI.getAll()

      // Verificar si hay un error en la respuesta
      if (data && data.error) {
        console.error("Error al cargar cuentas:", data.message)
        // Si hay error, usamos datos simulados
        useMockData()
      } else {
        // Si la respuesta es exitosa, usamos los datos reales
        setCuentas(data)
        setUsingMockData(false)
      }
    } catch (error) {
      console.error("Error inesperado:", error)
      useMockData()
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

      <main className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Lista de Cuentas</h2>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Cargando cuentas...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cuentas.map((cuenta) => (
                <div key={cuenta.id} className="border-b pb-4 last:border-b-0">
                  <p className="font-semibold">
                    Número de Cuenta: <span className="font-normal">{cuenta.numeroCuenta}</span>
                  </p>
                  <p className="font-semibold">
                    Saldo: <span className="font-normal">{formatCurrency(cuenta.saldo).replace("$", "")} US</span>
                  </p>
                  <p className="font-semibold">
                    Tipo de Cuenta: <span className="font-normal">{cuenta.tipoCuenta.nombre}</span>
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
