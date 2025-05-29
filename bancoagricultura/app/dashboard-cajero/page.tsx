"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function DashboardCajero() {
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

    if (userRole !== "cajero") {
      console.log("El usuario no es cajero, redirigiendo a login")
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

  const handleNavigate = (path: string) => {
    router.push(path)
  }

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-green-600 p-4 flex items-center justify-between">
        <div className="w-16 h-16 relative">
          <Image src="/imagenes/logo.png" alt="AgroBanco Salvadoreño Logo" fill className="object-cover" />
        </div>
        <h1 className="text-white text-xl font-bold">Panel de Cajero</h1>
        <div className="relative">          <button
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
                onClick={() => handleNavigate("/perfil-cajero")}
              >
                Perfil
              </button>
              <button
                className="bg-none border-0 p-2 cursor-pointer text-left hover:bg-gray-100"
                onClick={() => handleNavigate("/configuracion-cajero")}
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

      <main className="p-6 max-w-6xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md text-center mb-8">
          <Image
            src="/imagenes/cajero.png"
            alt="Icono de Cajero"
            width={200}
            height={190}
            className="mx-auto mb-4"
          />
          <p className="text-2xl">Selecciona una opción</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer text-center hover:shadow-lg transition-shadow"
            onClick={() => handleNavigate("/crear-cliente")}
          >
            <h3 className="text-lg font-bold mb-2 text-green-600">Registrar Nuevo Cliente</h3>
            <p className="text-gray-600">Crear una nueva cuenta de cliente</p>
          </div>
          <div
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer text-center hover:shadow-lg transition-shadow"
            onClick={() => handleNavigate("/prestamos")}
          >
            <h3 className="text-lg font-bold mb-2 text-green-600">Préstamos</h3>
            <p className="text-gray-600">Gestionar préstamos</p>
          </div>
          <div
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer text-center hover:shadow-lg transition-shadow"
            onClick={() => handleNavigate("/transaccion")}
          >
            <h3 className="text-lg font-bold mb-2 text-green-600">Transacciones</h3>
            <p className="text-gray-600">Realizar transacciones</p>
          </div>
        </div>
      </main>
    </div>
  )
}
