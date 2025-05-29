"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface UserProfile {
  id: string
  nombre: string
  email: string
  telefono: string
  direccion: string
}

export default function PerfilCliente() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [menuVisible, setMenuVisible] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken")
      const role = localStorage.getItem("userRole")

      if (!token || role !== "cliente") {
        router.push("/login")
        return false
      }
      return true
    }

    const fetchProfile = async () => {
      if (!checkAuth()) return

      setLoading(true)
      try {
        // Intentar obtener datos de la API
        const userId = localStorage.getItem("userId")
        const response = await fetch(`http://localhost:8080/api/usuarios/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })

        if (!response.ok) {
          throw new Error("Error al cargar el perfil")
        }

        const data = await response.json()
        setProfile(data)
      } catch (err) {
        console.error("Error:", err)
        setError("No se pudo cargar el perfil. Usando datos de ejemplo.")

        // Datos de ejemplo como respaldo
        setProfile({
          id: "1",
          nombre: localStorage.getItem("username") || "Cliente",
          email: "cliente@example.com",
          telefono: "7777-7777",
          direccion: "San Salvador, El Salvador",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userRole")
    localStorage.removeItem("username")
    router.push("/login")
  }

  const handleEditProfile = () => {
    alert("Funcionalidad de edición de perfil en desarrollo")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Image src="/imagenes/logo.png" alt="AgroBanco Logo" width={50} height={50} />
          <h1 className="ml-4 text-xl font-semibold">Perfil del Cliente</h1>
        </div>
        <div className="relative">
          <button onClick={toggleMenu} className="focus:outline-none">
            <Image src="/imagenes/avatar.png" alt="Avatar" width={40} height={40} className="rounded-full" />
          </button>
          {menuVisible && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <button
                onClick={() => router.push("/perfil-cliente")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Perfil
              </button>
              <button
                onClick={() => router.push("/configuracion-cliente")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Configuración
              </button>
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

      <main className="container mx-auto p-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col items-center mb-6">
              <Image
                src="/imagenes/avatar.png"
                alt="Foto de perfil"
                width={120}
                height={120}
                className="rounded-full mb-4"
              />
              <h2 className="text-2xl font-bold">{profile?.nombre}</h2>
              <p className="text-gray-600">Cliente</p>
            </div>

            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="text-sm text-gray-500">Correo Electrónico</h3>
                <p className="font-medium">{profile?.email}</p>
              </div>
              <div className="border-b pb-2">
                <h3 className="text-sm text-gray-500">Teléfono</h3>
                <p className="font-medium">{profile?.telefono}</p>
              </div>
              <div className="border-b pb-2">
                <h3 className="text-sm text-gray-500">Dirección</h3>
                <p className="font-medium">{profile?.direccion}</p>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleEditProfile}
                className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Editar Perfil
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={() => router.push("/dashboard-cliente")}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
          >
            Regresar
          </button>
        </div>
      </main>
    </div>
  )
}
