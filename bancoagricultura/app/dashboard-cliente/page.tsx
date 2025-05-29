"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cuentasAPI, usuariosAPI } from "@/lib/api"

// Define una interfaz para el tipo de cuenta
interface Account {
  id?: number
  numero: string
  saldo: string
  tipo?: string | any // Puede ser un string o un objeto
  fechaApertura?: string
  estado?: string
  clienteId?: number
  saldoNumerico?: number
}

interface UserData {
  nombre: string
  id: string
  profesion: string
  tipoCuenta: string
  cuentas: number
}

export default function DashboardCliente() {
  const router = useRouter()
  const [menuVisible, setMenuVisible] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingAccountDetails, setIsLoadingAccountDetails] = useState(false)
  const [userData, setUserData] = useState<UserData>({
    nombre: "",
    id: "",
    profesion: "",
    tipoCuenta: "",
    cuentas: 0,
  })
  const [accounts, setAccounts] = useState<Account[]>([])
  const [error, setError] = useState("")
  const [clienteId, setClienteId] = useState<number | null>(null)

  useEffect(() => {
    // Verificar autenticación
    const authToken = localStorage.getItem("authToken")
    const userRole = localStorage.getItem("userRole")

    if (!authToken || userRole !== "cliente") {
      router.push("/login")
      return
    }

    // Cargar datos del cliente
    loadClientData()
  }, [router])

  const loadClientData = async () => {
    try {
      const storedClienteId = localStorage.getItem("userId")
      const username = localStorage.getItem("username")

      console.log("Datos de localStorage:", { storedClienteId, username })

      if (!storedClienteId && !username) {
        setError("No se encontró información de identificación del usuario")
        setIsLoading(false)
        return
      }

      let currentClienteId: number | null = null

      // Cargar datos del usuario
      let userLoaded = false
      if (storedClienteId) {
        currentClienteId = Number.parseInt(storedClienteId)
        setClienteId(currentClienteId)

        try {
          console.log(`Cargando datos del usuario con ID: ${currentClienteId}`)
          const userResponse = await usuariosAPI.getById(currentClienteId)

          console.log("Respuesta completa del usuario:", userResponse)

          if (!userResponse.error) {
            console.log("Datos del usuario cargados:", userResponse)
            setUserData({
              nombre: userResponse.nombre || userResponse.nombreCompleto || "",
              id: userResponse.identificacion || userResponse.id || "",
              profesion: userResponse.profesion || "",
              tipoCuenta: userResponse.tipoCuenta || userResponse.tipoCliente || "",
              cuentas: 0, // Se actualizará después de cargar las cuentas
            })
            userLoaded = true
          } else {
            console.error("Error en respuesta del usuario:", userResponse)
          }
        } catch (userError) {
          console.error("Error al cargar datos del usuario por ID:", userError)
        }
      }

      // Si no se pudo cargar por ID, intentar por username
      if (!userLoaded && username) {
        try {
          console.log(`Cargando datos del usuario con username: ${username}`)
          const userByUsernameResponse = await usuariosAPI.getByUsername(username)

          console.log("Respuesta completa del usuario por username:", userByUsernameResponse)

          if (!userByUsernameResponse.error) {
            console.log("Datos del usuario por username cargados:", userByUsernameResponse)
            currentClienteId = userByUsernameResponse.id
            setClienteId(currentClienteId)

            setUserData({
              nombre: userByUsernameResponse.nombre || userByUsernameResponse.nombreCompleto || "",
              id: userByUsernameResponse.identificacion || userByUsernameResponse.id || "",
              profesion: userByUsernameResponse.profesion || "",
              tipoCuenta: userByUsernameResponse.tipoCuenta || userByUsernameResponse.tipoCliente || "",
              cuentas: 0, // Se actualizará después de cargar las cuentas
            })
            userLoaded = true
          } else {
            console.error("Error en respuesta del usuario por username:", userByUsernameResponse)
          }
        } catch (usernameError) {
          console.error("Error al cargar datos del usuario por username:", usernameError)
        }
      }

      if (!userLoaded) {
        setError("No se pudieron cargar los datos del usuario desde la API")
      }

      // Cargar cuentas del cliente específico
      if (currentClienteId) {
        try {
          console.log(`Cargando cuentas para el cliente ID: ${currentClienteId}`)

          // Intentar primero con el endpoint específico del cliente
          const cuentasResponse = await cuentasAPI.getByCliente(currentClienteId)
          console.log("Respuesta de cuentas por cliente:", cuentasResponse)

          let cuentasDelCliente = []

          if (!cuentasResponse.error && Array.isArray(cuentasResponse) && cuentasResponse.length > 0) {
            cuentasDelCliente = cuentasResponse
          } else {
            // Si no funciona, intentar con todas las cuentas y filtrar
            console.log("Intentando obtener todas las cuentas y filtrar...")
            const todasLasCuentas = await cuentasAPI.getAll()
            console.log("Todas las cuentas:", todasLasCuentas)

            if (!todasLasCuentas.error && Array.isArray(todasLasCuentas)) {
              cuentasDelCliente = todasLasCuentas.filter(
                (cuenta: any) =>
                  cuenta.clienteId === currentClienteId ||
                  cuenta.cliente_id === currentClienteId ||
                  Number.parseInt(cuenta.clienteId) === currentClienteId ||
                  Number.parseInt(cuenta.cliente_id) === currentClienteId,
              )
              console.log(`Cuentas filtradas de todas las cuentas:`, cuentasDelCliente)
            }
          }

          if (cuentasDelCliente.length > 0) {
            const formattedAccounts = cuentasDelCliente.map((cuenta: any) => {
              // Asegurarse de que el tipo sea un string
              let tipoString = "Cuenta General"
              if (cuenta.tipo) {
                if (typeof cuenta.tipo === "string") {
                  tipoString = cuenta.tipo
                } else if (typeof cuenta.tipo === "object" && cuenta.tipo.nombre) {
                  tipoString = cuenta.tipo.nombre
                }
              } else if (cuenta.tipoCuenta) {
                if (typeof cuenta.tipoCuenta === "string") {
                  tipoString = cuenta.tipoCuenta
                } else if (typeof cuenta.tipoCuenta === "object" && cuenta.tipoCuenta.nombre) {
                  tipoString = cuenta.tipoCuenta.nombre
                }
              }

              return {
                id: cuenta.id,
                numero: cuenta.numero || cuenta.numeroCuenta || `CUENTA-${cuenta.id}`,
                saldo: cuenta.saldo ? `${Number.parseFloat(cuenta.saldo).toFixed(2)} US` : "0.00 US",
                saldoNumerico: Number.parseFloat(cuenta.saldo) || 0,
                tipo: tipoString,
                fechaApertura: cuenta.fechaApertura || cuenta.fechaCreacion || new Date().toISOString(),
                estado: cuenta.estado || (cuenta.activo !== false ? "Activa" : "Inactiva"),
                clienteId: cuenta.clienteId || cuenta.cliente_id,
              }
            })

            console.log("Cuentas formateadas:", formattedAccounts)
            setAccounts(formattedAccounts)

            // Actualizar el número de cuentas en userData
            setUserData((prev) => ({
              ...prev,
              cuentas: formattedAccounts.length,
            }))

            console.log(`Se cargaron ${formattedAccounts.length} cuentas para el cliente`)
          } else {
            console.warn(`No se encontraron cuentas vinculadas al cliente ${currentClienteId}`)
            setAccounts([])
            setUserData((prev) => ({
              ...prev,
              cuentas: 0,
            }))
          }
        } catch (cuentasError) {
          console.error("Error al cargar cuentas desde la API:", cuentasError)
          setError("Error al cargar las cuentas desde la API")
        }
      }
    } catch (error) {
      console.error("Error general al cargar datos del cliente:", error)
      setError("Error al conectar con la API")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
    localStorage.removeItem("userId")
    localStorage.removeItem("username")
    router.push("/login")
  }

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }

  const handleDetailsClick = (account: Account) => {
    // Simplemente mostrar el modal con los datos que ya tenemos
    setSelectedAccount(account)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setSelectedAccount(null)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "No disponible en API"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    } catch {
      return dateString
    }
  }

  // Función para obtener el tipo de cuenta como string
  const getTipoCuenta = (tipo: any): string => {
    if (!tipo) return "No especificado en API"
    if (typeof tipo === "string") return tipo
    if (typeof tipo === "object" && tipo.nombre) return tipo.nombre
    return "Cuenta General"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          <p className="mt-2 text-gray-600">Cargando datos desde la API...</p>
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
        <h1 className="text-xl font-bold text-white">Panel de Clientes</h1>
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
        <h2 className="text-2xl font-bold text-center mb-6">Información Usuario</h2>

        {error && (
          <div className="max-w-6xl mx-auto mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
            <p>{error}</p>
            <button
              onClick={loadClientData}
              className="mt-2 bg-red-600 text-white py-1 px-3 rounded text-sm hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        )}

        {clienteId && (
          <div className="max-w-6xl mx-auto mb-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4">
            <p>Cliente ID: {clienteId} - Mostrando solo cuentas vinculadas a este cliente</p>
          </div>
        )}

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4">
              {accounts.length > 0 ? (
                accounts.map((account, index) => (
                  <div key={account.id || index} className="bg-white p-6 rounded-lg shadow-md text-center">
                    <p className="text-gray-700 mb-2">
                      Número de cuenta: <span className="font-medium">{account.numero || "No disponible"}</span>
                    </p>
                    <p className="text-green-700 font-bold text-2xl mb-3">{account.saldo}</p>
                    {account.clienteId && <p className="text-xs text-gray-500 mb-2">Cliente ID: {account.clienteId}</p>}
                    <button
                      className="bg-gray-300 text-gray-800 py-2 px-6 rounded hover:bg-gray-400 transition-colors"
                      onClick={() => handleDetailsClick(account)}
                    >
                      Detalles
                    </button>
                  </div>
                ))
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <p className="text-gray-500 mb-4">
                    No se encontraron cuentas vinculadas al cliente {clienteId} en la API
                  </p>
                  <button
                    onClick={() => router.push("/nueva-cuenta-cliente")}
                    className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition-colors"
                  >
                    Crear Primera Cuenta
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
              <img src="/imagenes/usuario.png" alt="Usuario" className="w-32 h-32 mb-4" />
              <h3 className="text-xl font-bold text-center mb-4">{userData.nombre || "Nombre no disponible en API"}</h3>
              <div className="text-center space-y-2">
                <p className="text-gray-700">TIPO DE CUENTA: {userData.tipoCuenta || "No especificado en API"}</p>
                <p className="text-gray-700">ID. DE CLIENTE: {userData.id || "No disponible en API"}</p>
                <p className="text-gray-700">PROFESIÓN: {userData.profesion || "No especificada en API"}</p>
                <p className="text-gray-700">CUENTAS EN POSESIÓN: {userData.cuentas}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center hover:bg-gray-50 transition-colors">
              <img src="/imagenes/movimiento.png" alt="Crear Otra Cuenta" className="w-20 h-20 mb-4" />
              <span className="text-lg font-medium text-gray-800">CREAR OTRA CUENTA</span>
              <button
                onClick={() => router.push("/nueva-cuenta-cliente")}
                className="mt-4 bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition-colors"
              >
                Ir
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center hover:bg-gray-50 transition-colors">
              <img src="/imagenes/historial.png" alt="Historial de Transacciones" className="w-20 h-20 mb-4" />
              <span className="text-lg font-medium text-gray-800">HISTORIAL DE TRANSACCIONES</span>
              <button
                onClick={() => router.push("/historial-transacciones")}
                className="mt-4 bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition-colors"
              >
                Ir
              </button>
            </div>
          </div>
        </div>
      </main>

      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Detalles de la Cuenta</h3>
              <button className="text-gray-500 hover:text-gray-700 text-2xl" onClick={closeModal}>
                ×
              </button>
            </div>

            {isLoadingAccountDetails ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-500"></div>
                <p className="mt-2 text-gray-600">Cargando detalles actualizados...</p>
              </div>
            ) : (
              selectedAccount && (
                <div className="space-y-4">
                  <p>
                    <strong>Número de Cuenta:</strong> {selectedAccount.numero || "No disponible en API"}
                  </p>
                  <p>
                    <strong>Saldo Actual:</strong>{" "}
                    <span className="text-green-600 font-bold text-lg">{selectedAccount.saldo}</span>
                  </p>
                  <p>
                    <strong>Tipo de Cuenta:</strong> {getTipoCuenta(selectedAccount.tipo)}
                  </p>
                  <p>
                    <strong>Fecha de Apertura:</strong> {formatDate(selectedAccount.fechaApertura || "")}
                  </p>
                  <p>
                    <strong>Estado:</strong>{" "}
                    <span
                      className={`font-medium ${
                        selectedAccount.estado === "Activa" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {selectedAccount.estado || "No disponible en API"}
                    </span>
                  </p>
                  {selectedAccount.clienteId && (
                    <p>
                      <strong>Cliente ID:</strong> {selectedAccount.clienteId}
                    </p>
                  )}
                  {selectedAccount.saldoNumerico !== undefined && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-700">
                        <strong>Saldo disponible:</strong> ${selectedAccount.saldoNumerico.toFixed(2)} USD
                      </p>
                    </div>
                  )}
                </div>
              )
            )}

            <div className="mt-6 flex justify-end">
              <button className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700" onClick={closeModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
