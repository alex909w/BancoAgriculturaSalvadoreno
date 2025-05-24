"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"

// Importar la aplicación React de forma dinámica para evitar problemas de SSR
const App = dynamic(() => import("../../src/App"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">AgroBanco Salvadoreño</h1>
        <p className="text-gray-600">Cargando aplicación...</p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        </div>
      </div>
    </div>
  ),
})

export default function ReactApp() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">AgroBanco Salvadoreño</h1>
            <p className="text-gray-600">Inicializando...</p>
            <div className="mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            </div>
          </div>
        </div>
      }
    >
      <App />
    </Suspense>
  )
}
