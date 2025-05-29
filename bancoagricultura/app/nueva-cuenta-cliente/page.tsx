"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cuentasAPI, tiposCuentaAPI } from "@/lib/api"

interface TipoCuenta {
  id: number
  nombre: string
  descripcion?: string
  montoMinimo?: number
  comision?: number
}

export default function NuevaCuentaClientePage() {
  const router = useRouter()
  const [menuVisible, setMenuVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [tiposCuenta, setTiposCuenta] = useState<TipoCuenta[]>([])
  const [formData, setFormData] = useState({
    tipoCuentaId: "",
    sucursal: "",
    correoElectronico: "",
    agregarBeneficiario: false,
    agregarSeguro: false,
    aceptaTerminos: false,
  })

  // Datos del cliente (simulados)
  const userData = {
    nombre: "Farmacia San Lorenzo",
    tipoCuenta: "Dependiente",
    idCliente: "150343434SL",
    giroComercial: "Farmaceutica",
    cuentasEnPosesion: 2,
  }

  useEffect(() => {
    // Verificar autenticación
    const authToken = localStorage.getItem("authToken")
    const userRole = localStorage.getItem("userRole")

    if (!authToken || userRole !== "cliente") {
      router.push("/login")
      return
    }

    // Cargar tipos de cuenta
    loadTiposCuenta()
  }, [router])

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
    } finally {
      setIsLoading(false)
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
    }

    if (!formData.tipoCuentaId || !formData.sucursal || !formData.correoElectronico) {
      alert("Por favor complete todos los campos obligatorios")
      return
    }

    setIsLoading(true)

    try {
      // Obtener el ID del cliente desde localStorage
      const clienteId = localStorage.getItem("userId")
      const userName = localStorage.getItem("userName")

      console.log("=== DEBUGGING DATOS DE USUARIO ===")
      console.log("clienteId desde localStorage:", clienteId)
      console.log("userName desde localStorage:", userName)

      if (!clienteId || clienteId === "null" || clienteId === "undefined") {
        console.error("ERROR: clienteId no válido:", clienteId)
        alert("Error: No se encontró la información del cliente. Por favor, inicie sesión nuevamente.")
        setIsLoading(false)
        return
      }

      // Convertir a número y validar
      const clienteIdNumero = Number.parseInt(clienteId)
      console.log("clienteId convertido a número:", clienteIdNumero)

      if (isNaN(clienteIdNumero)) {
        console.error("ERROR: clienteId no es un número válido:", clienteId)
        alert("Error: ID de cliente inválido. Por favor, inicie sesión nuevamente.")
        setIsLoading(false)
        return
      }

      // Obtener el tipo de cuenta seleccionado
      const tipoSeleccionado = tiposCuenta.find((tipo) => tipo.id === Number.parseInt(formData.tipoCuentaId))

      // Generar número de cuenta único
      const timestamp = Date.now()
      const random = Math.floor(Math.random() * 10000)
      const numeroCuenta = `${timestamp}${random}`

      // Obtener fecha actual en formato correcto
      const fechaActual = new Date()
      const fechaApertura = fechaActual.toISOString().split("T")[0] // YYYY-MM-DD

      // Preparar los datos con nombres de campos en snake_case (como espera la BD)
      const cuentaData = {
        // Campos básicos
        numero: numeroCuenta,
        saldo: 0.0,
        estado: "activa",
        fecha_apertura: fechaApertura, // snake_case

        // IDs de relaciones con nombres en snake_case
        cliente_id: clienteIdNumero,
        sucursal_id: Number.parseInt(formData.sucursal),
        tipo_cuenta_id: Number.parseInt(formData.tipoCuentaId),
      }

      console.log("=== DATOS CON SNAKE_CASE ===")
      console.log("Datos completos:", cuentaData)
      console.log("cliente_id:", cuentaData.cliente_id)
      console.log("sucursal_id:", cuentaData.sucursal_id)
      console.log("tipo_cuenta_id:", cuentaData.tipo_cuenta_id)

      // También probar con camelCase por si acaso
      const cuentaDataCamelCase = {
        numero: numeroCuenta,
        saldo: 0.0,
        estado: "activa",
        fechaApertura: fechaApertura,
        clienteId: clienteIdNumero,
        sucursalId: Number.parseInt(formData.sucursal),
        tipoCuentaId: Number.parseInt(formData.tipoCuentaId),
      }

      console.log("=== DATOS CON CAMELCASE ===")
      console.log("Datos completos:", cuentaDataCamelCase)

      // Intentar primero con snake_case
      console.log("Intentando crear cuenta con snake_case...")
      let response = await cuentasAPI.create(cuentaData)

      // Si falla, intentar con camelCase
      if (response && response.error) {
        console.log("Snake_case falló, intentando con camelCase...")
        response = await cuentasAPI.create(cuentaDataCamelCase)
      }

      console.log("Respuesta final de la API:", response)

      if (response && response.error) {
        console.error("Error al crear cuenta:", response)
        alert(`Error al crear la cuenta: ${response.message || "Error del servidor"}`)
      } else if (response) {
        console.log("Cuenta creada exitosamente:", response)
        alert("¡Cuenta creada exitosamente!")

        // Limpiar el formulario
        setFormData({
          tipoCuentaId: "",
          sucursal: "",
          correoElectronico: "",
          agregarBeneficiario: false,
          agregarSeguro: false,
          aceptaTerminos: false,
        })

        // Redirigir al dashboard después de un breve delay
        setTimeout(() => {
          router.push("/dashboard-cliente")
        }, 1500)
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
                </div>

                <div className="mb-4">
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
                    <option value="1">Sucursal Principal (ID: 1)</option>
                    <option value="2">Sucursal Centro (ID: 2)</option>
                    <option value="3">Sucursal Norte (ID: 3)</option>
                    <option value="4">Sucursal Sur (ID: 4)</option>
                  </select>
                </div>

                <div className="mb-4">
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
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
              <img src="/imagenes/usuario.png" alt="Usuario" className="w-32 h-32 mb-4" />
              <div className="text-center space-y-2">
                <p>
                  <strong>Nombre:</strong> {userData.nombre}
                </p>
                <p>
                  <strong>Tipo de Cuenta:</strong> {userData.tipoCuenta}
                </p>
                <p>
                  <strong>ID de Cliente:</strong> {userData.idCliente}
                </p>
                <p>
                  <strong>Giro Comercial:</strong> {userData.giroComercial}
                </p>
                <p>
                  <strong>Cuentas en Posesión:</strong> {userData.cuentasEnPosesion}
                </p>
              </div>

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
