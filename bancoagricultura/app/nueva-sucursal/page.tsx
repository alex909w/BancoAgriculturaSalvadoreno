"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface FormData {
  nombre: string
  codigo: string
  departamento: string
  municipio: string
  direccion: string
  telefono: string
  email: string
  tipo: string
  estado: string
}

export default function NuevaSucursal() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    codigo: "",
    departamento: "",
    municipio: "",
    direccion: "",
    telefono: "",
    email: "",
    tipo: "standard",
    estado: "activa",
  })
  const [loading, setLoading] = useState(false)
  const [menuVisible, setMenuVisible] = useState(false)

  const departamentosSV = [
    "Ahuachapán",
    "Cabañas",
    "Chalatenango",
    "Cuscatlán",
    "La Libertad",
    "La Paz",
    "La Unión",
    "Morazán",
    "San Miguel",
    "San Salvador",
    "San Vicente",
    "Santa Ana",
    "Sonsonate",
    "Usulután",
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const generateCodigo = () => {
    const departamentoCode = formData.departamento.substring(0, 2).toUpperCase()
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    const codigo = `${departamentoCode}${randomNum}`
    setFormData((prev) => ({
      ...prev,
      codigo,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("Creando nueva sucursal:", formData)

      // Simular creación de sucursal basada en estructura de BD
      const nuevaSucursal = {
        nombre: formData.nombre,
        codigo: formData.codigo,
        departamento: formData.departamento,
        municipio: formData.municipio,
        direccion: formData.direccion,
        telefono: formData.telefono,
        email: formData.email,
        tipo: formData.tipo, // 'express' o 'standard'
        estado: formData.estado, // 'activa' o 'inactiva'
      }

      // Simular respuesta exitosa
      setTimeout(() => {
        alert("Sucursal creada exitosamente")
        router.push("/dashboard-gerente")
      }, 1000)
    } catch (error) {
      console.error("Error al crear sucursal:", error)
      alert("Error al crear la sucursal. Verifique los datos e intente nuevamente.")
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full"
            title="Volver atrás"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <img src="/imagenes/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="h-12 mr-4" />
          <h1 className="text-xl font-bold text-green-700">Nueva Sucursal</h1>
        </div>
        <div className="relative">
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200" onClick={toggleMenu}>
            <img src="/imagenes/Usuario.png" alt="Usuario" className="w-8 h-8 rounded-full" />
          </button>

          {menuVisible && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <Link href="/perfil-gerente" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Perfil
              </Link>
              <Link href="/configuracion-gerente" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
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

      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <img src="/imagenes/sucursal-icon.png" alt="Nueva Sucursal" className="w-16 h-16 mr-4" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Crear Nueva Sucursal</h2>
                <p className="text-gray-600">Complete la información para registrar una nueva sucursal</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Sucursal *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Ej: Sucursal San Salvador Centro"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Código de Sucursal *</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      name="codigo"
                      value={formData.codigo}
                      onChange={handleInputChange}
                      placeholder="Ej: SS001"
                      required
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      type="button"
                      onClick={generateCodigo}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Generar
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">El código debe ser único para cada sucursal</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departamento *</label>
                  <select
                    name="departamento"
                    value={formData.departamento}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Seleccione un departamento</option>
                    {departamentosSV.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Municipio *</label>
                  <input
                    type="text"
                    name="municipio"
                    value={formData.municipio}
                    onChange={handleInputChange}
                    placeholder="Ej: San Salvador"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono *</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="Ej: 2234-5678"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Ej: sucursal@agrobanco.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Sucursal *</label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="standard">Standard</option>
                    <option value="express">Express</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Standard: Servicios completos | Express: Servicios básicos
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado *</label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="activa">Activa</option>
                    <option value="inactiva">Inactiva</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dirección Completa *</label>
                <textarea
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  placeholder="Ingrese la dirección completa de la sucursal..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium text-gray-800 mb-2">Resumen de la Sucursal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p>
                      <span className="font-semibold">Nombre:</span> {formData.nombre || "Sin especificar"}
                    </p>
                    <p>
                      <span className="font-semibold">Código:</span> {formData.codigo || "Sin especificar"}
                    </p>
                    <p>
                      <span className="font-semibold">Ubicación:</span>{" "}
                      {formData.municipio && formData.departamento
                        ? `${formData.municipio}, ${formData.departamento}`
                        : "Sin especificar"}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-semibold">Teléfono:</span> {formData.telefono || "Sin especificar"}
                    </p>
                    <p>
                      <span className="font-semibold">Tipo:</span>{" "}
                      {formData.tipo === "standard" ? "Standard" : "Express"}
                    </p>
                    <p>
                      <span className="font-semibold">Estado:</span>{" "}
                      {formData.estado === "activa" ? "Activa" : "Inactiva"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "Creando..." : "Crear Sucursal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
