"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function SplashPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirigir a la página de bienvenida después de 3 segundos
    const timer = setTimeout(() => {
      router.push("/bienvenida")
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md flex flex-col items-center">
        <div className="w-64 h-64 relative mb-6">
          <Image src="/logo.png" alt="AgroBanco Logo" fill className="object-contain" />
        </div>
        <p className="text-lg italic mb-12 text-center">"Crecemos contigo desde la raíz"</p>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-center mb-4">CARGANDO</h2>
          <div className="flex justify-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
