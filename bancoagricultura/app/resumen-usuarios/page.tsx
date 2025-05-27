"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { usuariosAPI } from "@/lib/api"

interface Usuario {
  id: number
  username: string
  nombreCompleto: string
  email: string
  rol: {
    id: number
    nombre: string
  }
}

export default function ResumenUsuarios() {
  const router = useRouter()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [menuVisible, setMenuVisible] = useState(false)

  const useMockData = useCallback(() => {
    const mockUsuarios: Usuario[] = [
      {
        id: 1,
        username: "usuario1",
        nombreCompleto: "Usuario 1",
        email: "usuario1@example.com",
        rol: { id: 3, nombre: "Cliente" },
      },
      {
        id: 2,
        username: "usuario2",
        nombreCompleto: "Usuario 2",
        email: "usuario2@example.com",
        rol: { id: 2, nombre: "Gerente" },
      },
      {
        id: 3,
        username: "usuario3",
        nombreCompleto: "Usuario 3",
        email: "usuario3@example.com",
        rol: { id: 3, nombre: "Cliente" },
      },
    ]
    setUsuarios(mockUsuarios)
  }, [])

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

    loadUsuarios()
  }, [router, useMockData])

  const loadUsuarios = async () => {
    try {
      setLoading(true)
      const data = await usuariosAPI.getAll()

      // Verificar si hay un error en la respuesta
      if (data && data.error) {
        console.error("Error al cargar usuarios:", data.message)
        // Si hay error, usamos datos simulados
        useMockData()
      } else {
        // Si la respuesta es exitosa, usamos los datos reales
        setUsuarios(data)
      }
    } catch (error) {
      console.error("Error inesperado:", error)
      useMockData()
    } finally {
      setLoading(false)
    }
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
          <img src="/imagenes/logo.png" alt="AgroBanco Salvadoreño" className="h-12 mr-4" />
          <h1 className="text-2xl font-bold">Resumen de Usuarios</h1>
        </div>
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
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Lista de Usuarios</h2>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Cargando usuarios...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {usuarios.map((usuario) => (
                <div key={usuario.id} className="border-b pb-4 last:border-b-0">
                  <p className="font-semibold">
                    Nombre: <span className="font-normal">{usuario.nombreCompleto}</span>
                  </p>
                  <p className="font-semibold">
                    Correo Electrónico: <span className="font-normal">{usuario.email}</span>
                  </p>
                  <p className="font-semibold">
                    Rol: <span className="font-normal capitalize">{usuario.rol.nombre}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link href="/dashboard-admin">
            <button className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600">Regresar</button>
          </Link>
        </div>
      </main>
    </div>
  )
}
