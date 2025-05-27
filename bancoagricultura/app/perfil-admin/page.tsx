"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { apiRequest } from "@/lib/api"

interface PerfilAdmin {
  id: number
  username: string
  nombreCompleto: string
  email: string
  rol: string
}

export default function PerfilAdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [menuVisible, setMenuVisible] = useState(false)
  const [perfil, setPerfil] = useState<PerfilAdmin>({
    id: 1,
    username: "admin",
    nombreCompleto: "Administrador",
    email: "admin@example.com",
    rol: "Administrador",
  })

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

    loadPerfil()
  }, [router])

  const loadPerfil = async () => {
    try {
      setLoading(true)
      const userId = localStorage.getItem("userId")

      if (userId) {
        try {
          const data = await apiRequest(`/usuarios/${userId}`)
          setPerfil({
            id: data.id,
            username: data.username,
            nombreCompleto: data.nombreCompleto || "Administrador",
            email: data.email,
            rol: "Administrador",
          })
        } catch (error) {
          console.error("Error al cargar perfil:", error)
          // Si falla, usamos los datos por defecto que ya están en el estado
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const handleEditarPerfil = () => {
    // Aquí podríamos navegar a una página de edición o mostrar un modal
    alert("Funcionalidad de edición de perfil")
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
          <img src="/imagenes/logo.png" alt="AgroBanco Salvadoreño" className="h-12" />
        </div>
        <h1 className="text-2xl font-bold text-center flex-grow">Perfil del Administrador</h1>
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
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">Cargando perfil...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <img src="/imagenes/Usuario.png" alt="Foto de perfil" className="w-24 h-24" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-center mb-6">Información del Perfil</h2>

            <div className="max-w-md mx-auto">
              <div className="mb-4">
                <p className="font-bold inline-block w-48">Nombre:</p>
                <span>{perfil.nombreCompleto}</span>
              </div>
              <div className="mb-4">
                <p className="font-bold inline-block w-48">Correo Electrónico:</p>
                <span>{perfil.email}</span>
              </div>
              <div className="mb-6">
                <p className="font-bold inline-block w-48">Rol:</p>
                <span>{perfil.rol}</span>
              </div>

              <div className="text-center mt-8">
                <button
                  onClick={handleEditarPerfil}
                  className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Editar Perfil
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/dashboard-admin">
            <button className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600">Regresar</button>
          </Link>
        </div>
      </main>
    </div>
  )
}
