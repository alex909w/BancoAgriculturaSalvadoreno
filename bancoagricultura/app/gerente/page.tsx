"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function GerentePage() {
  const router = useRouter()
  const [menuVisible, setMenuVisible] = useState(false)

  const handleLogout = () => {
    router.push("/login")
  }

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/imagenes/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="h-12" />
        </div>

        <div className="relative">
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200" onClick={toggleMenu}>
            <img src="/imagenes/Usuario.png" alt="Usuario" className="w-8 h-8 rounded-full" />
          </button>

          {menuVisible && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <Link href="/perfil-gerente" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Perfil
              </Link>
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

      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-8">¡Bienvenido, Gerente!</h1>

        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
          <img src="/imagenes/gerente.png" alt="Gerente" className="max-w-full h-auto max-h-80 mb-6" />

          <p className="text-xl text-gray-700 mb-8">
            Bienvenido al panel de gerencia de AgroBanco Salvadoreño. Desde aquí podrás gestionar todas las operaciones
            de tu sucursal.
          </p>

          <button
            className="bg-green-600 text-white py-3 px-8 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors text-lg font-medium"
            onClick={() => router.push("/dashboard-gerente")}
          >
            Ir al Dashboard
          </button>
        </div>
      </main>
    </div>
  )
}
