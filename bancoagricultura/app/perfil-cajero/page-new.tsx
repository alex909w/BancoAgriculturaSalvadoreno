"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { apiRequest } from "@/lib/api"

interface PerfilCajero {
  id: number
  username: string
  nombreCompleto: string
  email: string
  telefono: string
  direccion: string
  dui: string
  fechaIngreso: string
  codigoEmpleado: string
  sucursal: string
  cargo: string
  estado: string
}

export default function PerfilCajero() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [menuVisible, setMenuVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [perfil, setPerfil] = useState<PerfilCajero>({
    id: 3,
    username: "cajero",
    nombreCompleto: "Carlos Mendoza García",
    email: "carlos.mendoza@agrobanco.sv",
    telefono: "7890-1234",
    direccion: "Colonia Escalón, San Salvador",
    dui: "12345678-9",
    fechaIngreso: "2023-01-15",
    codigoEmpleado: "EMP001",
    sucursal: "Sucursal Central",
    cargo: "Cajero",
    estado: "Activo"
  })

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem("authToken")
    const userRole = localStorage.getItem("userRole")

    if (!token || !userRole) {
      router.push("/login")
      return
    }

    if (userRole !== "cajero") {
      router.push("/login")
      return
    }

    loadPerfil()
  }, [router])

  const loadPerfil = async () => {
    try {
      setLoading(true)
      const userId = localStorage.getItem("userId")

      if (userId) {
        try {
          const data = await apiRequest(`/usuarios/${userId}`)
          if (data && !data.error) {
            setPerfil({
              id: data.id,
              username: data.username,
              nombreCompleto: data.nombreCompleto || data.nombre || "",
              email: data.email,
              telefono: data.telefono || "",
              direccion: data.direccion || "",
              dui: data.dui || data.identificacion || "",
              fechaIngreso: data.fechaIngreso || data.createdAt || "",
              codigoEmpleado: data.codigoEmpleado || `EMP${data.id}`,
              sucursal: data.sucursal?.nombre || "Sucursal Central",
              cargo: data.rol?.nombre || "Cajero",
              estado: data.estado || "Activo"
            })
          }
        } catch (error) {
          console.error("Error al cargar perfil:", error)
        }
      }
    } catch (error) {
      console.error("Error al cargar datos del perfil:", error)
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPerfil(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    try {
      // Aquí iría la lógica para guardar los cambios en la API
      console.log("Datos actualizados:", perfil)
      
      const userId = localStorage.getItem("userId")
      if (userId) {
        await apiRequest(`/usuarios/${userId}`, {
          method: "PUT",
          body: JSON.stringify(perfil)
        })
      }
      
      setIsEditing(false)
      alert("Perfil actualizado exitosamente")
    } catch (error) {
      console.error("Error al guardar perfil:", error)
      alert("Error al actualizar el perfil")
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Revertir cambios si es necesario
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-green-600 p-4 flex items-center justify-between">
        <div className="w-16 h-16 relative">
          <Image src="/imagenes/logo.png" alt="AgroBanco Salvadoreño Logo" fill className="object-cover" />
        </div>
        <h1 className="text-white text-xl font-bold">Mi Perfil - Cajero</h1>
        <div className="relative">
          <button
            className="w-16 h-16 rounded-full overflow-hidden bg-gray-400 cursor-pointer border-0 p-0"
            onClick={toggleMenu}
            title="Menú de usuario"
          >
            <Image src="/imagenes/Usuario.png" alt="Usuario" fill className="object-cover" />
          </button>
          {menuVisible && (
            <div className="absolute right-0 bg-white rounded-lg shadow-md p-2 flex flex-col z-10">
              <button
                className="bg-none border-0 p-2 cursor-pointer text-left hover:bg-gray-100"
                onClick={() => router.push("/dashboard-cajero")}
              >
                Dashboard
              </button>
              <button
                className="bg-none border-0 p-2 cursor-pointer text-left hover:bg-gray-100"
                onClick={() => router.push("/configuracion-cajero")}
              >
                Configuración
              </button>
              <button
                className="bg-none border-0 p-2 cursor-pointer text-left hover:bg-gray-100"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            <p className="mt-2 text-gray-600">Cargando perfil...</p>
          </div>
        </div>
      ) : (
        <main className="p-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Header del perfil */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                  <Image src="/imagenes/Usuario.png" alt="Foto de perfil" width={80} height={80} className="rounded-full" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {perfil.nombreCompleto}
                  </h2>
                  <p className="text-gray-600">{perfil.cargo}</p>
                  <p className="text-sm text-gray-500">{perfil.codigoEmpleado}</p>
                </div>
              </div>

              <div className="flex space-x-2">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Editar Perfil
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      Cancelar
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Información personal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Personal</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre Completo
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="nombreCompleto"
                        value={perfil.nombreCompleto}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        title="Ingrese su nombre completo"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-md">{perfil.nombreCompleto}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      DUI
                    </label>
                    <p className="px-3 py-2 bg-gray-100 rounded-md text-gray-600">{perfil.dui}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="telefono"
                        value={perfil.telefono}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        title="Ingrese su número de teléfono"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-md">{perfil.telefono}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={perfil.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        title="Ingrese su dirección de correo electrónico"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-md">{perfil.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección
                    </label>
                    {isEditing ? (
                      <textarea
                        name="direccion"
                        value={perfil.direccion}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        title="Ingrese su dirección completa"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-md">{perfil.direccion}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Laboral</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código de Empleado
                    </label>
                    <p className="px-3 py-2 bg-gray-100 rounded-md text-gray-600">{perfil.codigoEmpleado}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cargo
                    </label>
                    <p className="px-3 py-2 bg-gray-100 rounded-md text-gray-600">{perfil.cargo}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sucursal
                    </label>
                    <p className="px-3 py-2 bg-gray-100 rounded-md text-gray-600">{perfil.sucursal}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Ingreso
                    </label>
                    <p className="px-3 py-2 bg-gray-100 rounded-md text-gray-600">{perfil.fechaIngreso}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      perfil.estado === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {perfil.estado}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Estadísticas del cajero */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Estadísticas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-green-600 mb-1">Transacciones Hoy</h4>
                  <p className="text-2xl font-bold text-green-800">45</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-600 mb-1">Clientes Atendidos</h4>
                  <p className="text-2xl font-bold text-blue-800">32</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-purple-600 mb-1">Monto Procesado</h4>
                  <p className="text-2xl font-bold text-purple-800">$15,430</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  )
}
