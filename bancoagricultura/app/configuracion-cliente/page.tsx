"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function ConfiguracionCliente() {
  const router = useRouter()
  const [notificaciones, setNotificaciones] = useState(true)
  const [idioma, setIdioma] = useState("es")
  const [loading, setLoading] = useState(true)
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

    const loadConfig = async () => {
      if (!checkAuth()) return

      setLoading(true)
      try {
        // Intentar obtener datos de la API
        const userId = localStorage.getItem("userId")
        const response = await fetch(`http://localhost:8080/api/usuarios/${userId}/configuracion`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })

        if (!response.ok) {
          throw new Error("Error al cargar la configuración")
        }

        const data = await response.json()
        setNotificaciones(data.notificaciones)
        setIdioma(data.idioma)
      } catch (err) {
        console.error("Error:", err)
        // Usar configuración predeterminada
        setNotificaciones(true)
        setIdioma("es")
      } finally {
        setLoading(false)
      }
    }

    loadConfig()
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

  const handleSaveConfig = async () => {
    try {
      const userId = localStorage.getItem("userId")
      const response = await fetch(`http://localhost:8080/api/usuarios/${userId}/configuracion`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          notificaciones,
          idioma,
        }),
      })

      if (!response.ok) {
        throw new Error("Error al guardar la configuración")
      }

      alert("Configuración guardada correctamente")
    } catch (err) {
      console.error("Error:", err)
      alert("No se pudo guardar la configuración. Intente nuevamente.")
    }
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
          <h1 className="ml-4 text-xl font-semibold">Configuración</h1>
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
            <h2 className="text-2xl font-bold mb-6">Configuración</h2>

            <div className="space-y-6">
              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={notificaciones}
                    onChange={(e) => setNotificaciones(e.target.checked)}
                    className="form-checkbox h-5 w-5 text-green-600"
                  />
                  <span>Activar Notificaciones</span>
                </label>
              </div>

              <div>
                <label className="block mb-2">Idioma:</label>
                <select
                  value={idioma}
                  onChange={(e) => setIdioma(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="es">Español</option>
                  <option value="en">Inglés</option>
                </select>
              </div>

              <button
                onClick={handleSaveConfig}
                className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Guardar Configuración
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
