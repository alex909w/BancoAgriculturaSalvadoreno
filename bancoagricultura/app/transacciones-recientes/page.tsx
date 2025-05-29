"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { transaccionesAPI } from "@/lib/api"

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

export default function TransaccionesRecientes() {
  const router = useRouter()
  const [transacciones, setTransacciones] = useState<Transaccion[]>([])
  const [loading, setLoading] = useState(true)
  const [menuVisible, setMenuVisible] = useState(false)
  const [usingMockData, setUsingMockData] = useState(false)

  const useMockData = useCallback(() => {
    const mockTransacciones: Transaccion[] = [
      {
        id: 1,
        numeroTransaccion: "TRX202401001",
        tipoTransaccion: { id: 1, nombre: "Depósito" },
        cuentaDestino: { id: 1, numeroCuenta: "1000000001" },
        monto: 100.0,
        comision: 0.0,
        fechaTransaccion: "2023-12-23T10:30:00",
        cajero: { id: 2, nombreCompleto: "María García" },
        sucursal: { id: 1, nombre: "Sucursal Central" },
        descripcion: "Depósito",
        estado: "completada",
      },
      {
        id: 2,
        numeroTransaccion: "TRX202401002",
        tipoTransaccion: { id: 2, nombre: "Retiro" },
        cuentaOrigen: { id: 2, numeroCuenta: "1000000002" },
        monto: 50.0,
        comision: 1.0,
        fechaTransaccion: "2023-12-23T11:15:00",
        cajero: { id: 2, nombreCompleto: "María García" },
        sucursal: { id: 1, nombre: "Sucursal Central" },
        descripcion: "Retiro",
        estado: "completada",
      },
    ]
    setTransacciones(mockTransacciones)
    setUsingMockData(true)
  }, [setTransacciones])

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
  }, [router, useMockData])

  const loadTransacciones = async () => {
    try {
      setLoading(true)
      // Usar el endpoint real
      const data = await transaccionesAPI.getAll()

      // Verificar si hay un error en la respuesta
      if (data && data.error) {
        console.error("Error al cargar transacciones:", data.message)
        // Si hay error, usamos datos simulados
        useMockData()
      } else {
        // Si la respuesta es exitosa, usamos los datos reales
        setTransacciones(data)
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

      <main className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Transacciones Recientes</h2>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Cargando transacciones...</p>
            </div>
          ) : (
            <div className="space-y-6">
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
