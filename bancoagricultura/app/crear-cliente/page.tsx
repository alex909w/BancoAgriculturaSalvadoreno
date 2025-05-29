"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { usuariosAPI } from "@/lib/api"
import Image from "next/image"

export default function CrearCliente() {
  const router = useRouter()
  const [menuVisible, setMenuVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    dui: "",
    telefono: "",
    email: "",
    direccion: "",
    fechaNacimiento: "",
    ocupacion: "",
    ingresos: "",
    password: " ",
    tipoCuenta: "ahorros",
    genero: "M"
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem("authToken")
    const userRole = localStorage.getItem("userRole")

    if (!token || !userRole) {
      router.push("/login")
      return
    }

    if (userRole !== "cajero" && userRole !== "admin") {
      router.push("/login")
      return
    }

    setLoading(false)
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
    
    // Limpiar error del campo si existe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }))
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    // Validaciones requeridas
    if (!formData.nombres.trim()) newErrors.nombres = "Los nombres son requeridos"
    if (!formData.apellidos.trim()) newErrors.apellidos = "Los apellidos son requeridos"
    if (!formData.dui.trim()) newErrors.dui = "El DUI es requerido"
    if (!formData.telefono.trim()) newErrors.telefono = "El teléfono es requerido"
    if (!formData.email.trim()) newErrors.email = "El email es requerido"
    if (!formData.direccion.trim()) newErrors.direccion = "La dirección es requerida"
    if (!formData.fechaNacimiento) newErrors.fechaNacimiento = "La fecha de nacimiento es requerida"

    // Validaciones de formato
    const duiRegex = /^\d{8}-\d$/
    if (formData.dui && !duiRegex.test(formData.dui)) {
      newErrors.dui = "El DUI debe tener el formato 00000000-0"
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "El email no tiene un formato válido"
    }

    const telefonoRegex = /^[267]\d{3}-?\d{4}$/
    if (formData.telefono && !telefonoRegex.test(formData.telefono.replace('-', ''))) {
      newErrors.telefono = "El teléfono debe tener 8 dígitos y comenzar con 2, 6 o 7"
    }

    // Validar edad mínima (18 años)
    if (formData.fechaNacimiento) {
      const fechaNac = new Date(formData.fechaNacimiento)
      const hoy = new Date()
      const edad = hoy.getFullYear() - fechaNac.getFullYear()
      const mesActual = hoy.getMonth()
      const mesNacimiento = fechaNac.getMonth()
      
      if (edad < 18 || (edad === 18 && mesActual < mesNacimiento)) {
        newErrors.fechaNacimiento = "El cliente debe ser mayor de 18 años"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const generateUsername = () => {
    // Generar username basado en nombres y apellidos
    const nombres = formData.nombres.trim().toLowerCase()
    const apellidos = formData.apellidos.trim().toLowerCase()
    const timestamp = new Date().getTime().toString().slice(-4)
    
    const primerNombre = nombres.split(' ')[0] || ''
    const primerApellido = apellidos.split(' ')[0] || ''
    
    return `${primerNombre.slice(0, 3)}${primerApellido.slice(0, 3)}${timestamp}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {      // Preparar datos según la estructura del test de usuarios
      const usuarioData = {
        username: generateUsername(),
        email: formData.email,
        password: formData.password, // Contraseña temporal que debería ser cambiada
        nombreCompleto: `${formData.nombres} ${formData.apellidos}`,
        dui: formData.dui,
        telefono: formData.telefono,
        direccion: formData.direccion,
        fechaNacimiento: formData.fechaNacimiento,
        genero: formData.genero,
        profesion: formData.ocupacion || 'No especificada',
        salario: parseFloat(formData.ingresos) || 0.0,
        rol: {
          id: 4  // ID del rol cliente según el test
        },
        sucursal: {
          id: 1  // ID de la sucursal central según el test
        },
        estado: "activo"
      }

      console.log("Enviando datos del usuario:", usuarioData)

      // Crear el usuario usando la API
      const response = await usuariosAPI.create(usuarioData)
      
      if (response.error) {
        throw new Error(response.message || "Error al crear el usuario")
      }

      console.log("Usuario creado exitosamente:", response)
      
      // Mostrar mensaje de éxito
      alert(`Cliente registrado exitosamente!\nUsername: ${usuarioData.username}\nEmail: ${usuarioData.email}`)
      
      // Redirigir al dashboard
      router.push("/dashboard-cajero")
      
    } catch (error: any) {
      console.error("Error al crear cliente:", error)
      alert(`Error al registrar cliente: ${error.message || "Error desconocido"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <Image src="/imagenes/logo-login.png" alt="AgroBanco Salvadoreño Logo" width={150} height={150} className="mb-4" />
          <h1 className="text-2xl font-bold text-green-700 mb-2">Cargando...</h1>
          <p className="text-gray-600">Por favor, espere un momento.</p>
          <div className="mt-4 animate-spin">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx={12} cy={12} r={10} strokeWidth={4} />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-1.415 1.415a3 3 0 11-4.243-4.243l1.415-1.415M9.343 15.757l1.415-1.415a3 3 0 014.243 4.243l-1.415 1.415" />
            </svg>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => router.back()} 
            className="mr-4 p-2 hover:bg-green-700 rounded-full"
            title="Volver atrás"
            aria-label="Volver atrás"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <Image src="/imagenes/logo-login.png" alt="AgroBanco Salvadoreño" width={40} height={40} className="mr-3" />
          <h1 className="text-xl font-bold">Registrar Nuevo Cliente</h1>
        </div>

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
                onClick={() => router.push("/dashboard-cajero")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Dashboard
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
      </header>

      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">            <div className="flex items-center mb-6">
              <Image src="/imagenes/nuevo-usuario.png" alt="Nuevo Cliente" width={64} height={64} className="mr-4" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Nuevo Cliente</h2>
                <p className="text-gray-600">Complete la información del cliente</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombres *
                  </label>
                  <input
                    type="text"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleInputChange}
                    required
                    title="Ingrese los nombres del cliente"
                    aria-label="Nombres del cliente"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.nombres ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.nombres && (
                    <p className="mt-1 text-sm text-red-600">{errors.nombres}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellidos *
                  </label>
                  <input
                    type="text"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    required
                    title="Ingrese los apellidos del cliente"
                    aria-label="Apellidos del cliente"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.apellidos ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.apellidos && (
                    <p className="mt-1 text-sm text-red-600">{errors.apellidos}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DUI *
                  </label>
                  <input
                    type="text"
                    name="dui"
                    value={formData.dui}
                    onChange={handleInputChange}
                    placeholder="00000000-0"
                    required
                    maxLength={10}
                    title="Ingrese el DUI del cliente en formato 00000000-0"
                    aria-label="DUI del cliente"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.dui ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.dui && (
                    <p className="mt-1 text-sm text-red-600">{errors.dui}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="0000-0000"
                    required
                    maxLength={9}
                    title="Ingrese el número de teléfono del cliente"
                    aria-label="Teléfono del cliente"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.telefono ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.telefono && (
                    <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    title="Ingrese el correo electrónico del cliente"
                    aria-label="Correo electrónico del cliente"
                    placeholder="ejemplo@correo.com"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Nacimiento *
                  </label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleInputChange}
                    required
                    title="Seleccione la fecha de nacimiento del cliente"
                    aria-label="Fecha de nacimiento del cliente"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.fechaNacimiento ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.fechaNacimiento && (
                    <p className="mt-1 text-sm text-red-600">{errors.fechaNacimiento}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Género *
                  </label>
                  <select
                    name="genero"
                    value={formData.genero}
                    onChange={handleInputChange}
                    required
                    title="Seleccione el género del cliente"
                    aria-label="Género del cliente"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ocupación
                  </label>
                  <input
                    type="text"
                    name="ocupacion"
                    value={formData.ocupacion}
                    onChange={handleInputChange}
                    title="Ingrese la ocupación del cliente (opcional)"
                    aria-label="Ocupación del cliente"
                    placeholder="Ej: Ingeniero, Contador, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ingresos Mensuales (USD)
                  </label>
                  <input
                    type="number"
                    name="ingresos"
                    value={formData.ingresos}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    title="Ingrese los ingresos mensuales del cliente"
                    aria-label="Ingresos mensuales del cliente"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Cuenta *
                  </label>
                  <select
                    name="tipoCuenta"
                    value={formData.tipoCuenta}
                    onChange={handleInputChange}
                    required
                    title="Seleccione el tipo de cuenta"
                    aria-label="Tipo de cuenta"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="ahorros">Cuenta de Ahorros</option>
                    <option value="corriente">Cuenta Corriente</option>
                    <option value="plazo-fijo">Cuenta a Plazo Fijo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección Completa *
                </label>
                <textarea
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  title="Ingrese la dirección completa del cliente"
                  aria-label="Dirección completa del cliente"
                  placeholder="Ingrese la dirección completa del cliente"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.direccion ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.direccion && (
                  <p className="mt-1 text-sm text-red-600">{errors.direccion}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  title="Ingrese la contraseña del cliente"
                  aria-label="Contraseña del cliente"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Registrando..." : "Registrar Cliente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
