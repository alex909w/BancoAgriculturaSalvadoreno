"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface SucursalForm {
  nombre: string
  codigo: string
  departamento: string
  municipio: string
  direccion: string
  telefono: string
  email: string
  tipo: "express" | "standard"
  estado: "activa" | "inactiva"
}

export default function NuevaSucursal() {
  const router = useRouter()
  const [menuVisible, setMenuVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")

  const [formData, setFormData] = useState<SucursalForm>({
    nombre: "",
    codigo: "",
    departamento: "",
    municipio: "",
    direccion: "",
    telefono: "",
    email: "",
    tipo: "standard",
    estado: "activa"
  })

  const departamentosSalvador = [
    "Ahuachapán", "Cabañas", "Chalatenango", "Cuscatlán", "La Libertad",
    "La Paz", "La Unión", "Morazán", "San Miguel", "San Salvador",
    "San Vicente", "Santa Ana", "Sonsonate", "Usulután"
  ]

  useEffect(() => {
    // Verificar autenticación y permisos
    const token = localStorage.getItem("authToken")
    const userRole = localStorage.getItem("userRole")

    if (!token || userRole !== "gerente") {
      router.push("/login")
      return
    }
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  const generateCodigoSucursal = () => {
    if (!formData.departamento) {
      setMessage("Por favor seleccione un departamento primero")
      setMessageType("error")
      return
    }
    const prefijo = formData.departamento.substring(0, 3).toUpperCase()
    const numero = Math.floor(Math.random() * 9000) + 1000
    const codigo = `${prefijo}${numero}`
    setFormData(prev => ({ ...prev, codigo }))
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    // Validaciones adicionales
    if (!formData.nombre.trim()) {
      setMessage("El nombre de la sucursal es requerido")
      setMessageType("error")
      setLoading(false)
      return
    }

    if (!formData.codigo.trim()) {
      setMessage("El código de la sucursal es requerido")
      setMessageType("error")
      setLoading(false)
      return
    }

    if (!formData.departamento) {
      setMessage("Debe seleccionar un departamento")
      setMessageType("error")
      setLoading(false)
      return
    }

    if (!formData.municipio.trim()) {
      setMessage("El municipio es requerido")
      setMessageType("error")
      setLoading(false)
      return
    }

    if (!formData.direccion.trim()) {
      setMessage("La dirección es requerida")
      setMessageType("error")
      setLoading(false)
      return
    }

    // Validar email si se proporciona
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      setMessage("El formato del email no es válido")
      setMessageType("error")
      setLoading(false)
      return
    }

    try {
      const token = localStorage.getItem("authToken")
      
      const response = await fetch("http://localhost:8081/api/sucursales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const result = await response.json()
        setMessage("Sucursal creada exitosamente")
        setMessageType("success")
        
        // Limpiar formulario después de 2 segundos y redirigir
        setTimeout(() => {
          router.push("/dashboard-gerente")
        }, 2000)
      } else {
        const errorData = await response.json()
        setMessage(errorData.message || "Error al crear la sucursal")
        setMessageType("error")
      }
    } catch (error) {
      console.error("Error:", error)
      setMessage("Error de conexión al servidor")
      setMessageType("error")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
      codigo: "",
      departamento: "",
      municipio: "",
      direccion: "",
      telefono: "",
      email: "",
      tipo: "standard",
      estado: "activa"
    })
    setMessage("")
    setMessageType("")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Image src="/imagenes/logo-login.png" alt="AgroBanco Salvadoreño" width={40} height={40} className="mr-3" />
          <h1 className="text-xl font-bold">Nueva Sucursal</h1>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push("/dashboard-gerente")}
            className="px-4 py-2 bg-green-500 hover:bg-green-700 rounded-md transition-colors"
          >
            Volver al Dashboard
          </button>

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
                  onClick={() => router.push("/perfil-gerente")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Mi Perfil
                </button>
                <button
                  onClick={() => router.push("/configuracion-gerente")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Configuración
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
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Título y descripción */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
              <Image src="/imagenes/sucursal-icon.png" alt="Nueva Sucursal" width={64} height={64} className="mr-4" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Crear Nueva Sucursal</h2>
                <p className="text-gray-600">Complete la información para registrar una nueva sucursal</p>
              </div>
            </div>
          </div>

          {/* Mensaje de estado */}
          {message && (
            <div className={`mb-6 p-4 rounded-md ${
              messageType === "success" 
                ? "bg-green-100 text-green-700 border border-green-300" 
                : "bg-red-100 text-red-700 border border-red-300"
            }`}>
              {message}
            </div>
          )}

          {/* Formulario */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información básica */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  Información Básica
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de la Sucursal *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                      maxLength={100}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Ej: Sucursal Centro San Salvador"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código de Sucursal *
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        name="codigo"
                        value={formData.codigo}
                        onChange={handleInputChange}
                        required
                        maxLength={20}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Ej: SUC001"
                      />                      <button
                        type="button"
                        onClick={generateCodigoSucursal}
                        disabled={!formData.departamento}
                        className="px-3 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                        title="Generar código automático"
                      >
                        Auto
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ubicación */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  Ubicación
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Departamento *
                    </label>                    <select
                      name="departamento"
                      value={formData.departamento}
                      onChange={handleInputChange}
                      required
                      title="Seleccionar departamento"
                      aria-label="Seleccionar departamento"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Seleccione un departamento</option>
                      {departamentosSalvador.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Municipio *
                    </label>
                    <input
                      type="text"
                      name="municipio"
                      value={formData.municipio}
                      onChange={handleInputChange}
                      required
                      maxLength={50}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Ej: San Salvador"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección Completa *
                  </label>
                  <textarea
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ej: Avenida España, Colonia Escalón, frente al Centro Comercial Galerias"
                  />
                </div>
              </div>

              {/* Contacto */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  Información de Contacto
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      maxLength={15}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Ej: 2222-3333"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      maxLength={100}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Ej: sucursal@agrobanco.com"
                    />
                  </div>
                </div>
              </div>

              {/* Configuración */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  Configuración
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Sucursal *
                    </label>                    <select
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleInputChange}
                      required
                      title="Seleccionar tipo de sucursal"
                      aria-label="Seleccionar tipo de sucursal"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="standard">Standard</option>
                      <option value="express">Express</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Standard: Sucursal completa | Express: Sucursal con servicios básicos
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado *
                    </label>                    <select
                      name="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                      required
                      title="Seleccionar estado de la sucursal"
                      aria-label="Seleccionar estado de la sucursal"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="activa">Activa</option>
                      <option value="inactiva">Inactiva</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? "Creando Sucursal..." : "Crear Sucursal"}
                </button>
                
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={loading}
                  className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Limpiar Formulario
                </button>
              </div>
            </form>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 rounded-lg p-4 mt-6">
            <h4 className="font-medium text-blue-800 mb-2">Información importante:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Los campos marcados con (*) son obligatorios</li>
              <li>• El código de sucursal debe ser único en el sistema</li>
              <li>• Puede generar un código automático basado en el departamento</li>
              <li>• Los tipos de sucursal determinan los servicios disponibles</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
