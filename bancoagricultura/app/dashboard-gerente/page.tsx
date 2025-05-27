"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function DashboardGerente() {
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
        <h1 className="text-xl font-bold text-green-700">Panel Gerente General</h1>
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
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 flex flex-col items-center">
          <img src="/imagenes/gerente.png" alt="Selecciona una acción" className="w-32 h-32 mb-4" />
          <p className="text-xl text-gray-700 mb-4">Selecciona una acción</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center hover:bg-gray-50 transition-colors"
            onClick={() => router.push("/solicitudes")}
          >
            <img src="/imagenes/solicitud.png" alt="Solicitudes" className="w-20 h-20 mb-4" />
            <span className="text-lg font-medium text-gray-800 text-center">SOLICITUDES</span>
          </button>

          <button
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center hover:bg-gray-50 transition-colors"
            onClick={() => router.push("/movimientos")}
          >
            <img src="/imagenes/movimiento.png" alt="Movimientos" className="w-20 h-20 mb-4" />
            <span className="text-lg font-medium text-gray-800 text-center">MOVIMIENTOS</span>
          </button>

          <button
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center hover:bg-gray-50 transition-colors"
            onClick={() => router.push("/nueva-sucursal")}
          >
            <img src="/imagenes/sucursal-icon.png" alt="Nueva Sucursal" className="w-20 h-20 mb-4" />
            <span className="text-lg font-medium text-gray-800 text-center">NUEVA SUCURSAL</span>
          </button>
        </div>
      </main>
    </div>
  )
}
