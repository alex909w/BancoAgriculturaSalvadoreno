"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { apiRequest } from "@/lib/api"

interface ConfiguracionSistema {
  notificacionesActivas: boolean
  idioma: string
}

export default function ConfiguracionSistemaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [menuVisible, setMenuVisible] = useState(false)
  const [configuracion, setConfiguracion] = useState<ConfiguracionSistema>({
    notificacionesActivas: true,
    idioma: "Español",
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

    loadConfiguracion()
  }, [router])

  const loadConfiguracion = async () => {
    try {
      setLoading(true)
      // En producción, esto sería una llamada GET a /configuracion
      try {
        const data = await apiRequest("/configuracion")
        setConfiguracion({
          notificacionesActivas: data.notificacionesActivas ?? true,
          idioma: data.idioma || "Español",
        })
      } catch (error) {
        console.error("Error al cargar configuración:", error)
        // Si falla, usamos los datos por defecto que ya están en el estado
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      // En producción, esto sería una llamada PUT a /configuracion
      await apiRequest("/configuracion", {
        method: "PUT",
        body: JSON.stringify(configuracion),
      })
      alert("Configuración guardada con éxito")
    } catch (error) {
      console.error("Error al guardar configuración:", error)
      alert("Error al guardar la configuración")
    } finally {
      setSaving(false)
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
          <h1 className="text-2xl font-bold">Configuración del Sistema</h1>
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
          <h2 className="text-xl font-bold mb-6">Configuración del Sistema</h2>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Cargando configuración...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={configuracion.notificacionesActivas}
                    onChange={(e) => setConfiguracion({ ...configuracion, notificacionesActivas: e.target.checked })}
                    className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700">Activar Notificaciones</span>
                </label>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Idioma:</label>
                <select
                  value={configuracion.idioma}
                  onChange={(e) => setConfiguracion({ ...configuracion, idioma: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Español">Español</option>
                  <option value="English">English</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Guardar Configuración"}
              </button>
            </form>
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
