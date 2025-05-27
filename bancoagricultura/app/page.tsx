"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function Home() {
  const router = useRouter()
  const [activeBar, setActiveBar] = useState(0)

  useEffect(() => {
    // Animación de las barras de carga
    const barInterval = setInterval(() => {
      setActiveBar((prev) => (prev + 1) % 3)
    }, 500)

    // Redirigir a la página de login después de 5 segundos
    const timer = setTimeout(() => {
      router.push("/login")
    }, 5000)

    return () => {
      clearTimeout(timer)
      clearInterval(barInterval)
    }
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#e0e0e0] p-4">
      <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl flex flex-col items-center justify-center">
        <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 relative mb-6 sm:mb-8">
          <Image src="/imagenes/logo.png" alt="Banco de Agricultura Logo" fill className="object-contain" priority />
        </div>

        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl italic mb-12 sm:mb-16 md:mb-20 text-center font-serif px-4">
          "Crecemos contigo desde la raíz"
        </p>

        <div className="mt-8 sm:mt-10 md:mt-12 flex flex-col items-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-4 sm:mb-6 font-serif">
            CARGANDO
          </h2>
          <div className="flex justify-center space-x-3 sm:space-x-4">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={`w-5 h-10 sm:w-6 sm:h-12 md:w-7 md:h-14 lg:w-8 lg:h-16 rounded-md transition-all duration-300 shadow-md ${
                  index <= activeBar ? "bg-green-500 shadow-green-500/30" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
