"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function CajeroPage() {
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
          <div className="h-12 w-32 bg-green-600 text-white flex items-center justify-center rounded">
            AgroBanco Logo
          </div>
        </div>

        <div className="relative">
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200" onClick={toggleMenu}>
            <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white">U</div>
          </button>

          {menuVisible && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <Link href="/perfil-cajero" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Perfil
              </Link>
              <Link href="/configuracion-cajero" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
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
        <h1 className="text-3xl font-bold text-center text-green-700 mb-8">¡Bienvenido a AgroBanco Salvadoreño!</h1>

        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-8">
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-md h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Imagen de Servicio al Cliente</span>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-semibold text-green-700 mb-4">Recuerda siempre que:</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>Recuerda siempre sonreír y saludar a los clientes de forma amable y cordial.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>Utiliza un tono de voz amigable y muestra interés genuino en ayudar.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>Habla de forma clara y concisa, utilizando un lenguaje sencillo y evitando tecnicismos.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>Escucha atentamente a los clientes y asegúrate de comprender sus necesidades.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>Explica los procedimientos y productos de forma clara y completa.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>Muestra empatía y comprensión ante las preocupaciones o problemas de los clientes.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>Mantén la confidencialidad de la información de los clientes.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            className="bg-green-600 text-white py-3 px-8 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors text-lg font-medium"
            onClick={() => router.push("/dashboard-cajero")}
          >
            Continuar
          </button>
        </div>
      </main>
    </div>
  )
}
