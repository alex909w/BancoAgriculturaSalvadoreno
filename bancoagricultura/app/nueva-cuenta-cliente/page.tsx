"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cuentasAPI, tiposCuentaAPI, sucursalesAPI, usuariosAPI } from "@/lib/api"

interface TipoCuenta {
  id: number
  nombre: string
  descripcion?: string
  montoMinimo?: number
  comision?: number
}

interface Sucursal {
  id: number
  nombre: string
  codigo?: string
  direccion?: string
  departamento?: string
}

interface UserData {
  id: number
  nombre: string
  apellido?: string
  email?: string
  dui?: string
  telefono?: string
  cuentasEnPosesion?: number
}

export default function NuevaCuentaClientePage() {
  const router = useRouter()
  const [menuVisible, setMenuVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [tiposCuenta, setTiposCuenta] = useState<TipoCuenta[]>([])
  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [userData, setUserData] = useState<UserData | null>(null)
  const [formData, setFormData] = useState({
    tipoCuentaId: "",
    sucursal: "",
    correoElectronico: "",
    saldoInicial: "",
    agregarBeneficiario: false,
    agregarSeguro: false,
    aceptaTerminos: false,
  })
  useEffect(() => {
    // Verificar autenticación
    const authToken = localStorage.getItem("authToken")
    const userRole = localStorage.getItem("userRole")

    if (!authToken || userRole !== "cliente") {
      router.push("/login")
      return
    }

    // Cargar datos iniciales
    loadInitialData()
  }, [router])

  const loadInitialData = async () => {
    try {
      await Promise.all([
        loadTiposCuenta(),
        loadSucursales(),
        loadUserData()
      ])
    } catch (error) {
      console.error("Error al cargar datos iniciales:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadUserData = async () => {
    try {
      const userId = localStorage.getItem("userId")
      if (userId) {
        const response = await usuariosAPI.getById(Number.parseInt(userId))
        if (response && !response.error) {
          // Obtener número de cuentas del usuario
          const cuentasResponse = await cuentasAPI.getByCliente(Number.parseInt(userId))
          const numCuentas = Array.isArray(cuentasResponse) ? cuentasResponse.length : 0
          
          setUserData({
            ...response,
            cuentasEnPosesion: numCuentas
          })
          
          // Pre-llenar el email si está disponible
          if (response.email) {
            setFormData(prev => ({
              ...prev,
              correoElectronico: response.email
            }))
          }
        }
      }
    } catch (error) {
      console.error("Error al cargar datos del usuario:", error)
    }
  }

  const loadSucursales = async () => {
    try {
      const response = await sucursalesAPI.getAll()
      if (response && !response.error && Array.isArray(response)) {
        setSucursales(response)
      } else {
        // Sucursales por defecto si la API falla
        setSucursales([
          { id: 1, nombre: "Sucursal Principal" },
          { id: 2, nombre: "Sucursal Centro" },
          { id: 3, nombre: "Sucursal Norte" },
          { id: 4, nombre: "Sucursal Sur" },
        ])
      }
    } catch (error) {
      console.error("Error al cargar sucursales:", error)
      setSucursales([
        { id: 1, nombre: "Sucursal Principal" },
        { id: 2, nombre: "Sucursal Centro" },
        { id: 3, nombre: "Sucursal Norte" },
        { id: 4, nombre: "Sucursal Sur" },
      ])
    }
  }
  const loadTiposCuenta = async () => {
    try {
      console.log("Cargando tipos de cuenta...")
      const response = await tiposCuentaAPI.getAll()

      if (response && !response.error) {
        console.log("Tipos de cuenta cargados:", response)
        setTiposCuenta(response)
      } else {
        console.error("Error al cargar tipos de cuenta:", response)
        // Tipos de cuenta por defecto si la API falla
        setTiposCuenta([
          { id: 1, nombre: "Cuenta de Ahorros", descripcion: "Cuenta básica de ahorros" },
          { id: 2, nombre: "Cuenta Corriente", descripcion: "Cuenta para movimientos frecuentes" },
          { id: 3, nombre: "Cuenta Empresarial", descripcion: "Cuenta para empresas" },
        ])
      }
    } catch (error) {
      console.error("Error al cargar tipos de cuenta:", error)
      // Tipos de cuenta por defecto
      setTiposCuenta([
        { id: 1, nombre: "Cuenta de Ahorros", descripcion: "Cuenta básica de ahorros" },
        { id: 2, nombre: "Cuenta Corriente", descripcion: "Cuenta para movimientos frecuentes" },
        { id: 3, nombre: "Cuenta Empresarial", descripcion: "Cuenta para empresas" },
      ])
    }
  }

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.aceptaTerminos) {
      alert("Debe aceptar los términos y condiciones")
      return
    }    if (!formData.tipoCuentaId || !formData.sucursal || !formData.correoElectronico || !formData.saldoInicial) {
      alert("Por favor complete todos los campos obligatorios")
      return
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.correoElectronico)) {
      alert("Por favor ingrese un correo electrónico válido")
      return
    }

    // Validar saldo inicial
    const saldo = Number.parseFloat(formData.saldoInicial)
    if (isNaN(saldo) || saldo < 0) {
      alert("Por favor ingrese un saldo inicial válido (mayor o igual a 0)")
      return
    }

    setIsLoading(true)

    try {
      const clienteId = localStorage.getItem("userId")

      if (!clienteId || clienteId === "null" || clienteId === "undefined") {
        alert("Error: No se encontró la información del cliente. Por favor, inicie sesión nuevamente.")
        setIsLoading(false)
        return
      }

      const clienteIdNumero = Number.parseInt(clienteId)
      if (isNaN(clienteIdNumero)) {
        alert("Error: ID de cliente inválido. Por favor, inicie sesión nuevamente.")
        setIsLoading(false)
        return
      }      // Preparar los datos para crear la cuenta (estructura correcta según backend)
      const cuentaData = {
        cliente: { id: clienteIdNumero },
        tipoCuenta: { id: Number.parseInt(formData.tipoCuentaId) },
        sucursal: { id: Number.parseInt(formData.sucursal) },
        saldo: saldo,
        tieneSeguro: formData.agregarSeguro
      }

      console.log("Creando cuenta con datos:", cuentaData)

      const response = await cuentasAPI.create(cuentaData)

      if (response && response.error) {
        console.error("Error al crear cuenta:", response)
        alert(`Error al crear la cuenta: ${response.message || "Error del servidor"}`)      } else if (response) {
        console.log("Cuenta creada exitosamente:", response)
        const numeroCuenta = response.cuenta?.numeroCuenta || response.numeroCuenta || "Generado automáticamente"
        alert(`¡Cuenta creada exitosamente!\nNúmero de cuenta: ${numeroCuenta}`)        // Limpiar el formulario
        setFormData({
          tipoCuentaId: "",
          sucursal: "",
          correoElectronico: "",
          saldoInicial: "",
          agregarBeneficiario: false,
          agregarSeguro: false,
          aceptaTerminos: false,
        })

        // Recargar datos del usuario para actualizar el número de cuentas
        await loadUserData()

        // Redirigir al dashboard después de un breve delay
        setTimeout(() => {
          router.push("/dashboard-cliente")
        }, 2000)
      } else {
        console.error("Respuesta vacía o inválida:", response)
        alert("Error: No se recibió respuesta del servidor")
      }
    } catch (error) {
      console.error("Error de conexión:", error)
      alert("Error de conexión. Verifique que el servidor esté funcionando.")
    } finally {
      setIsLoading(false)
    }
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
        <h1 className="text-xl font-bold text-white">Crear Nueva Cuenta</h1>
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
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="tipoCuentaId" className="block mb-2 font-medium">
                    Tipo de cuenta: *
                  </label>
                  <select
                    id="tipoCuentaId"
                    name="tipoCuentaId"
                    value={formData.tipoCuentaId}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  >
                    <option value="">Seleccione un tipo de cuenta</option>
                    {tiposCuenta.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nombre}
                        {tipo.descripcion && ` - ${tipo.descripcion}`}
                        {tipo.montoMinimo && ` (Mínimo: $${tipo.montoMinimo})`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="agregarBeneficiario"
                      checked={formData.agregarBeneficiario}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Agregar beneficiario
                  </label>
                </div>

                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="agregarSeguro"
                      checked={formData.agregarSeguro}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Agregar seguro
                  </label>
                </div>                <div className="mb-4">
                  <label htmlFor="sucursal" className="block mb-2 font-medium">
                    Sucursal de preferencia: *
                  </label>
                  <select
                    id="sucursal"
                    name="sucursal"
                    value={formData.sucursal}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  >
                    <option value="">Seleccione una sucursal</option>
                    {sucursales.map((sucursal) => (
                      <option key={sucursal.id} value={sucursal.id}>
                        {sucursal.nombre}
                        {sucursal.codigo && ` (${sucursal.codigo})`}
                        {sucursal.departamento && ` - ${sucursal.departamento}`}
                      </option>
                    ))}
                  </select>
                </div>                <div className="mb-4">
                  <label htmlFor="correoElectronico" className="block mb-2 font-medium">
                    Correo electrónico: *
                  </label>
                  <input
                    type="email"
                    id="correoElectronico"
                    name="correoElectronico"
                    value={formData.correoElectronico}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="saldoInicial" className="block mb-2 font-medium">
                    Saldo inicial: *
                  </label>
                  <input
                    type="number"
                    id="saldoInicial"
                    name="saldoInicial"
                    value={formData.saldoInicial}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Ingrese el monto con el que desea abrir la cuenta (mínimo $0.00)
                  </p>
                </div>

                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="aceptaTerminos"
                      checked={formData.aceptaTerminos}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Confirmo haber leído Términos y Condiciones
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creando..." : "Crear"}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard-cliente")}
                    className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>            <div className="flex-1 flex flex-col items-center justify-center">
              <img src="/imagenes/usuario.png" alt="Usuario" className="w-32 h-32 mb-4" />
              {userData ? (
                <div className="text-center space-y-2">
                  <p>
                    <strong>Nombre:</strong> {userData.nombre} {userData.apellido || ""}
                  </p>
                  <p>
                    <strong>Email:</strong> {userData.email || "No registrado"}
                  </p>
                  <p>
                    <strong>DUI:</strong> {userData.dui || "No disponible"}
                  </p>
                  <p>
                    <strong>Teléfono:</strong> {userData.telefono || "No registrado"}
                  </p>
                  <p>
                    <strong>Cuentas en Posesión:</strong> {userData.cuentasEnPosesion || 0}
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-500">Cargando información del usuario...</p>
                </div>
              )}

              {/* Información del tipo de cuenta seleccionado */}
              {formData.tipoCuentaId && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg w-full">
                  <h3 className="font-semibold text-blue-800 mb-2">Información del Tipo de Cuenta</h3>
                  {(() => {
                    const tipoSeleccionado = tiposCuenta.find(
                      (tipo) => tipo.id === Number.parseInt(formData.tipoCuentaId),
                    )
                    return tipoSeleccionado ? (
                      <div className="text-sm text-blue-700">
                        <p>
                          <strong>Tipo:</strong> {tipoSeleccionado.nombre}
                        </p>
                        {tipoSeleccionado.descripcion && (
                          <p>
                            <strong>Descripción:</strong> {tipoSeleccionado.descripcion}
                          </p>
                        )}
                        {tipoSeleccionado.montoMinimo && (
                          <p>
                            <strong>Monto mínimo:</strong> ${tipoSeleccionado.montoMinimo}
                          </p>
                        )}
                        {tipoSeleccionado.comision && (
                          <p>
                            <strong>Comisión:</strong> ${tipoSeleccionado.comision}
                          </p>
                        )}
                      </div>
                    ) : null
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
