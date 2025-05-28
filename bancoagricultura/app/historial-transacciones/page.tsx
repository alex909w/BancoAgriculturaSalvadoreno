"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { transaccionesAPI, cuentasAPI } from "@/lib/api"

interface Transaction {
  id?: string | number
  fecha: string
  descripcion: string
  monto: string
  tipo: "Ingreso" | "Egreso"
}

export default function HistorialTransaccionesPage() {
  const router = useRouter()
  const [menuVisible, setMenuVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [ingresos, setIngresos] = useState<Transaction[]>([])
  const [egresos, setEgresos] = useState<Transaction[]>([])
  const [allIngresos, setAllIngresos] = useState<Transaction[]>([])
  const [allEgresos, setAllEgresos] = useState<Transaction[]>([])
  const [filtro, setFiltro] = useState("todos")

  useEffect(() => {
    // Verificar autenticación
    const authToken = localStorage.getItem("authToken")
    const userRole = localStorage.getItem("userRole")

    if (!authToken || userRole !== "cliente") {
      router.push("/login")
      return
    }

    // Intentar cargar datos reales
    loadTransactions()
  }, [router])
  const loadTransactions = async () => {
    try {
      const clienteId = localStorage.getItem("userId")

      if (clienteId) {
        // Intentar obtener cuentas del cliente
        const cuentasResponse = await cuentasAPI.getByCliente(Number.parseInt(clienteId))

        if (!cuentasResponse.error && Array.isArray(cuentasResponse) && cuentasResponse.length > 0) {
          const allIngresos: Transaction[] = []
          const allEgresos: Transaction[] = []

          // Obtener transacciones para cada cuenta
          for (const cuenta of cuentasResponse) {
            const transResponse = await transaccionesAPI.getByCuenta(cuenta.id)

            if (!transResponse.error && Array.isArray(transResponse) && transResponse.length > 0) {
              transResponse.forEach((trans: any) => {
                const tipoTransaccion: "Ingreso" | "Egreso" = trans.tipo === "DEPOSITO" ? "Ingreso" : "Egreso"
                  const formattedTrans: Transaction = {
                  id: trans.id,
                  fecha: new Date(trans.fecha).toLocaleDateString("es-SV", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                  }),
                  descripcion: trans.descripcion || "Sin descripción",
                  monto: `${Number(trans.monto).toFixed(2)} USD`,
                  tipo: tipoTransaccion,
                }

                if (formattedTrans.tipo === "Ingreso") {
                  allIngresos.push(formattedTrans)
                } else {
                  allEgresos.push(formattedTrans)
                }
              })
            }
          }          // Ordenar por fecha más reciente primero
          const sortByDate = (a: Transaction, b: Transaction) => {
            // Las fechas vienen formateadas como dd/mm/yyyy desde toLocaleDateString
            const dateA = new Date(a.fecha.split('/').reverse().join('/'))
            const dateB = new Date(b.fecha.split('/').reverse().join('/'))
            return dateB.getTime() - dateA.getTime()
          }

          allIngresos.sort(sortByDate)
          allEgresos.sort(sortByDate)          // Actualizar estado (guardar todos los datos y aplicar filtro)
          setAllIngresos(allIngresos)
          setAllEgresos(allEgresos)
          setIngresos(allIngresos)
          setEgresos(allEgresos)
        } else {
          // Si no hay cuentas o hay error, mostrar listas vacías
          setIngresos([])
          setEgresos([])
        }
      }
    } catch (error) {
      console.error("Error al cargar transacciones:", error)
      // En caso de error, limpiar las listas
      setIngresos([])
      setEgresos([])
    } finally {
      setIsLoading(false)
    }
  }
  // Función para filtrar transacciones por fecha
  const filterTransactionsByDate = (transactions: Transaction[], filter: string): Transaction[] => {
    if (filter === "todos") return transactions

    const now = new Date()
    const filterDate = new Date()

    switch (filter) {
      case "semana":
        filterDate.setDate(now.getDate() - 7)
        break
      case "mes":
        filterDate.setMonth(now.getMonth() - 1)
        break
      case "año":
        filterDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        return transactions
    }

    return transactions.filter(transaction => {
      // Convertir la fecha formateada (dd/mm/yyyy) a Date para comparación
      const [day, month, year] = transaction.fecha.split('/')
      const transactionDate = new Date(Number(year), Number(month) - 1, Number(day))
      return transactionDate >= filterDate
    })
  }

  // Efecto para aplicar filtro cuando cambia
  useEffect(() => {
    setIngresos(filterTransactionsByDate(allIngresos, filtro))
    setEgresos(filterTransactionsByDate(allEgresos, filtro))
  }, [filtro, allIngresos, allEgresos])

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
    localStorage.removeItem("userId")
    router.push("/login")
  }

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          <p className="mt-2 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-green-600 shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/imagenes/logo.png" alt="AgroBanco Salvadoreño Logo" className="h-12" />
          <span className="ml-2 text-white text-lg">AgroBanco Salvadoreño</span>
        </div>
        <h1 className="text-xl font-bold text-white">Transacciones Recientes</h1>
        <div className="relative">
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200" onClick={toggleMenu}>
            <img src="/imagenes/Usuario.png" alt="Usuario" className="w-8 h-8 rounded-full" />
          </button>

          {menuVisible && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <Link href="/perfil-cliente" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Perfil
              </Link>
              <Link href="/configuracion-cliente" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
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

      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Transacciones Recientes</h2>

          <div className="mb-6">
            <label htmlFor="filtro" className="mr-2">
              Filtrar por:
            </label>
            <select
              id="filtro"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            >
              <option value="todos">todos</option>
              <option value="semana">última semana</option>
              <option value="mes">último mes</option>
              <option value="año">último año</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">            <div>
              <h2 className="text-2xl font-bold text-center mb-6">INGRESOS</h2>
              <div className="space-y-4">
                {ingresos.length > 0 ? (
                  ingresos.map((transaction, index) => (
                    <div key={transaction.id || index} className="bg-gray-50 p-4 rounded-md">
                      <p className="font-medium">Descripción: {transaction.descripcion}</p>
                      <p className="text-green-600 font-bold">{transaction.monto}</p>
                      <p className="text-gray-600 text-sm">{transaction.fecha}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No hay ingresos para mostrar</p>
                    <p className="text-sm">{filtro !== "todos" ? "Prueba con un filtro diferente" : "Aún no has recibido ingresos"}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-center mb-6">EGRESOS</h2>
              <div className="space-y-4">
                {egresos.length > 0 ? (
                  egresos.map((transaction, index) => (
                    <div key={transaction.id || index} className="bg-gray-50 p-4 rounded-md">
                      <p className="font-medium">Descripción: {transaction.descripcion}</p>
                      <p className="text-red-600 font-bold">{transaction.monto}</p>
                      <p className="text-gray-600 text-sm">{transaction.fecha}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No hay egresos para mostrar</p>
                    <p className="text-sm">{filtro !== "todos" ? "Prueba con un filtro diferente" : "Aún no has realizado retiros"}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            className="bg-gray-400 text-white py-2 px-6 rounded-md hover:bg-gray-500 transition-colors"
            onClick={() => router.push("/dashboard-cliente")}
          >
            Regresar
          </button>
        </div>
      </main>
    </div>
  )
}
