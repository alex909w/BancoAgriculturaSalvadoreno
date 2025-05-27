"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function DashboardAdminPage() {
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

    if (userRole !== "admin") {
      console.log("El usuario no es admin, redirigiendo a login")
      router.push("/login")
      return
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userRole")
    localStorage.removeItem("username")
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
        <h1 className="text-white text-xl font-bold">Panel de Administrador</h1>
        <div className="relative">
          <button
            className="w-16 h-16 rounded-full overflow-hidden bg-gray-400 cursor-pointer border-0 p-0"
            onClick={toggleMenu}
          >
            <Image src="/imagenes/Usuario.png" alt="Usuario" fill className="object-cover" />
          </button>
          {menuVisible && (
            <div className="absolute right-0 bg-white rounded-lg shadow-md p-2 flex flex-col z-10">
              <button
                className="bg-none border-0 p-2 cursor-pointer text-left hover:bg-gray-100"
                onClick={() => handleNavigate("/perfil-admin")}
              >
                Perfil
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
            src="/imagenes/admin.png"
            alt="Icono de Administrador"
            width={200}
            height={190}
            className="mx-auto mb-4"
          />
          <p className="text-2xl">Selecciona una opción</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer text-center hover:shadow-lg transition-shadow"
            onClick={() => handleNavigate("/resumen-usuarios")}
          >
            <h3 className="text-lg font-bold mb-2 text-green-600">Resumen de Usuarios</h3>
            <p className="text-gray-600">Ver resumen de usuarios registrados</p>
          </div>
          <div
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer text-center hover:shadow-lg transition-shadow"
            onClick={() => handleNavigate("/gestion-cuentas")}
          >
            <h3 className="text-lg font-bold mb-2 text-green-600">Gestión de Cuentas</h3>
            <p className="text-gray-600">Gestionar cuentas de usuarios</p>
          </div>
          <div
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer text-center hover:shadow-lg transition-shadow"
            onClick={() => handleNavigate("/transacciones-recientes")}
          >
            <h3 className="text-lg font-bold mb-2 text-green-600">Transacciones Recientes</h3>
            <p className="text-gray-600">Ver transacciones recientes</p>
          </div>
          <div
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer text-center hover:shadow-lg transition-shadow"
            onClick={() => handleNavigate("/reportes-estadisticas")}
          >
            <h3 className="text-lg font-bold mb-2 text-green-600">Reportes y Estadísticas</h3>
            <p className="text-gray-600">Acceder a reportes y estadísticas</p>
          </div>
          <div
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer text-center hover:shadow-lg transition-shadow"
            onClick={() => handleNavigate("/configuracion-sistema")}
          >
            <h3 className="text-lg font-bold mb-2 text-green-600">Configuración del Sistema</h3>
            <p className="text-gray-600">Configurar el sistema</p>
          </div>
        </div>
      </main>
    </div>
  )
}
