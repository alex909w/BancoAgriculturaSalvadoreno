"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function DashboardGerente() {
  const router = useRouter()
  const [menuVisible, setMenuVisible] = useState(false)

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem("authToken")
    const userRole = localStorage.getItem("userRole")
    const username = localStorage.getItem("username")

    console.log("Token:", token)
    console.log("Role:", userRole)
    console.log("Username:", username)

    if (!token || !userRole) {
      console.log("No hay token o rol, redirigiendo a login")
      router.push("/login")
      return
    }

    if (userRole !== "gerente") {
      console.log("El usuario no es gerente, redirigiendo a login")
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
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-green-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Image src="/imagenes/logo-login.png" alt="AgroBanco Salvadoreño" width={40} height={40} className="mr-3" />
          <h1 className="text-xl font-bold">Panel Gerente General</h1>
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
      </header>      <main className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 flex flex-col items-center">
          <Image src="/imagenes/gerente.png" alt="Selecciona una acción" width={128} height={128} className="mb-4" />
          <p className="text-xl text-gray-700 mb-4">Selecciona una acción</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center hover:bg-gray-50 transition-colors"
            onClick={() => router.push("/solicitudes")}
          >
            <Image src="/imagenes/solicitud.png" alt="Solicitudes" width={80} height={80} className="mb-4" />
            <span className="text-lg font-medium text-gray-800 text-center">SOLICITUDES</span>
          </button>

          <button
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center hover:bg-gray-50 transition-colors"
            onClick={() => router.push("/movimientos")}
          >
            <Image src="/imagenes/movimiento.png" alt="Movimientos" width={80} height={80} className="mb-4" />
            <span className="text-lg font-medium text-gray-800 text-center">MOVIMIENTOS</span>
          </button>

          <button
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center hover:bg-gray-50 transition-colors"
            onClick={() => router.push("/nueva-sucursal")}
          >
            <Image src="/imagenes/sucursal-icon.png" alt="Nueva Sucursal" width={80} height={80} className="mb-4" />
            <span className="text-lg font-medium text-gray-800 text-center">NUEVA SUCURSAL</span>
          </button>
        </div>
      </main>
    </div>
  )
}
