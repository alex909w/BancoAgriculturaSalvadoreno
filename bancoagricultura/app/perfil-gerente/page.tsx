"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface GerenteData {
  id: number
  username: string
  email: string
  nombre_completo: string
  dui?: string
  telefono?: string
  direccion?: string
  fecha_nacimiento?: string
  genero?: string
  profesion?: string
  salario?: number
  rol: {
    id: number
    nombre: string
    descripcion: string
  }
  sucursal?: {
    id: number
    nombre: string
    codigo: string
    departamento: string
    municipio: string
    direccion: string
    telefono: string
  }
  estado: string
  ultimo_login?: string
  created_at: string
  updated_at: string
}

export default function PerfilGerente() {
  const router = useRouter()
  const [gerente, setGerente] = useState<GerenteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [menuVisible, setMenuVisible] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    telefono: "",
    direccion: "",
    email: "",
  })

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem("authToken")
    const userRole = localStorage.getItem("userRole")
    const username = localStorage.getItem("username")

    if (!token || !userRole || userRole !== "gerente") {
      router.push("/login")
      return
    }

    loadGerenteData()
  }, [router])

  const loadGerenteData = async () => {
    try {
      setLoading(true)
      console.log("Cargando datos del gerente...")

      // Datos basados en la estructura real de la BD
      const mockGerenteData: GerenteData = {
        id: 4,
        username: "gerente",
        email: "gerente@gmail.com",
        nombre_completo: "Gerente",
        dui: "12345678-9",
        telefono: "7890-1234",
        direccion: "Colonia Escalón, San Salvador",
        fecha_nacimiento: "1980-05-15",
        genero: "M",
        profesion: "Administrador de Empresas",
        salario: 2500.0,
        rol: {
          id: 2,
          nombre: "gerente",
          descripcion: "Gerente de sucursal",
        },
        sucursal: {
          id: 1,
          nombre: "Sucursal Central",
          codigo: "SC001",
          departamento: "San Salvador",
          municipio: "San Salvador",
          direccion: "Av. Roosevelt, Centro Comercial Metrocentro",
          telefono: "2250-1000",
        },
        estado: "activo",
        ultimo_login: "2025-05-29T10:30:00Z",
        created_at: "2024-01-15T08:00:00Z",
        updated_at: "2025-05-29T10:30:00Z",
      }

      setGerente(mockGerenteData)
      setFormData({
        telefono: mockGerenteData.telefono || "",
        direccion: mockGerenteData.direccion || "",
        email: mockGerenteData.email || "",
      })
    } catch (error) {
      console.error("Error al cargar datos del gerente:", error)
      setGerente(null)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async () => {
    if (!gerente) return

    try {
      console.log("Actualizando datos del gerente:", formData)

      // Simular actualización exitosa
      setTimeout(() => {
        alert("Datos actualizados exitosamente")
        setEditMode(false)
        // Actualizar datos locales
        setGerente((prev) =>
          prev
            ? {
                ...prev,
                telefono: formData.telefono,
                direccion: formData.direccion,
                email: formData.email,
              }
            : null,
        )
      }, 500)
    } catch (error) {
      console.error("Error al actualizar datos:", error)
      alert("Error al actualizar los datos")
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-SV", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-SV", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-SV", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
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
          <h1 className="text-xl font-bold text-green-700">Mi Perfil</h1>
        </div>
        <div className="relative">
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200" onClick={toggleMenu}>
            <img src="/imagenes/Usuario.png" alt="Usuario" className="w-8 h-8 rounded-full" />
          </button>

          {menuVisible && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
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
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin text-4xl mb-4">⟳</div>
              <p className="text-gray-500">Cargando perfil...</p>
            </div>
          ) : gerente ? (
            <div className="space-y-6">
              {/* Información Personal */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <img src="/imagenes/gerente.png" alt="Gerente" className="w-16 h-16 mr-4" />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Información Personal</h2>
                      <p className="text-gray-600">Datos básicos del perfil</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    {editMode ? "Cancelar" : "Editar"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                      <p className="text-gray-900 bg-gray-50 p-2 rounded">{gerente.nombre_completo}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">DUI</label>
                      <p className="text-gray-900 bg-gray-50 p-2 rounded">{gerente.dui || "No especificado"}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                      <p className="text-gray-900 bg-gray-50 p-2 rounded">
                        {gerente.fecha_nacimiento ? formatDate(gerente.fecha_nacimiento) : "No especificado"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
                      <p className="text-gray-900 bg-gray-50 p-2 rounded">
                        {gerente.genero === "M" ? "Masculino" : gerente.genero === "F" ? "Femenino" : "No especificado"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      {editMode ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      ) : (
                        <p className="text-gray-900 bg-gray-50 p-2 rounded">{gerente.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                      {editMode ? (
                        <input
                          type="tel"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      ) : (
                        <p className="text-gray-900 bg-gray-50 p-2 rounded">{gerente.telefono || "No especificado"}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                      {editMode ? (
                        <input
                          type="text"
                          name="direccion"
                          value={formData.direccion}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      ) : (
                        <p className="text-gray-900 bg-gray-50 p-2 rounded">{gerente.direccion || "No especificado"}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Profesión</label>
                      <p className="text-gray-900 bg-gray-50 p-2 rounded">{gerente.profesion || "No especificado"}</p>
                    </div>
                  </div>
                </div>

                {editMode && (
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={handleSave}
                      className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                )}
              </div>

              {/* Información Laboral */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Información Laboral</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                      <p className="text-gray-900 bg-gray-50 p-2 rounded">{gerente.username}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                      <p className="text-gray-900 bg-gray-50 p-2 rounded capitalize">{gerente.rol.nombre}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Salario</label>
                      <p className="text-gray-900 bg-gray-50 p-2 rounded font-semibold text-green-600">
                        {gerente.salario ? formatCurrency(gerente.salario) : "No especificado"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          gerente.estado === "activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {gerente.estado}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Último Login</label>
                      <p className="text-gray-900 bg-gray-50 p-2 rounded">
                        {gerente.ultimo_login ? formatDateTime(gerente.ultimo_login) : "No disponible"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Ingreso</label>
                      <p className="text-gray-900 bg-gray-50 p-2 rounded">{formatDate(gerente.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información de Sucursal */}
              {gerente.sucursal && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Sucursal Asignada</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <p className="text-gray-900 bg-gray-50 p-2 rounded">{gerente.sucursal.nombre}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                        <p className="text-gray-900 bg-gray-50 p-2 rounded">{gerente.sucursal.codigo}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                        <p className="text-gray-900 bg-gray-50 p-2 rounded">
                          {gerente.sucursal.municipio}, {gerente.sucursal.departamento}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                        <p className="text-gray-900 bg-gray-50 p-2 rounded">{gerente.sucursal.direccion}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                        <p className="text-gray-900 bg-gray-50 p-2 rounded">{gerente.sucursal.telefono}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">⚠️</div>
              <p className="text-gray-500 mb-4">No se pudieron cargar los datos del perfil.</p>
              <button
                onClick={loadGerenteData}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Reintentar
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
