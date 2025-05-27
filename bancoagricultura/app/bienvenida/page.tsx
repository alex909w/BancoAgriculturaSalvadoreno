"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function BienvenidaPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Verificar autenticación
    const authToken = localStorage.getItem("authToken")
    const userRole = localStorage.getItem("userRole")

    if (!authToken || userRole !== "cliente") {
      router.push("/login")
      return
    }

    setIsAuthenticated(true)
  }, [router])

  const handleContinue = () => {
    router.push("/dashboard-cliente")
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          <p className="mt-2 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-green-600 shadow-md p-4 flex items-center">
        <img src="/imagenes/logo.png" alt="AgroBanco Salvadoreño Logo" className="h-12" />
        <span className="ml-2 text-white text-lg">AgroBanco Salvadoreño</span>
        <div className="ml-auto">
          <img src="/imagenes/Usuario.png" alt="Usuario" className="w-10 h-10 rounded-full" />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">¡Bienvenido a AgroBanco Salvadoreño!</h1>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <img
                src="/placeholder.svg?height=300&width=300&query=banco+agricola+ilustracion"
                alt="Ilustración AgroBanco"
                className="w-full max-w-sm mx-auto"
              />
            </div>

            <div className="flex-1 space-y-4">
              <p className="text-lg mb-4">
                En AgroBanco Salvadoreño, ofrecemos soluciones financieras diseñadas para el sector agrícola. Nuestra
                plataforma te permite:
              </p>

              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>
                    Solicitar créditos agrícolas para financiar cultivos, maquinaria y crecimiento de tu negocio.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Abrir y administrar cuentas diseñadas para productores y emprendedores del campo.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Realizar transferencias y pagos de forma rápida y segura.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Consultar estados de cuenta y gestionar tus finanzas en cualquier momento.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Acceder a programas de apoyo y subsidios exclusivos para el sector agropecuario.</span>
                </li>
              </ul>

              <p className="text-lg font-semibold mt-6">
                ¡Crecemos contigo y con el campo e impulsa tu producción con nosotros!
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={handleContinue}
              className="bg-green-600 text-white py-3 px-8 rounded-lg hover:bg-green-700 transition-colors text-lg font-medium"
            >
              Continuar
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
