"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Validación simple
    if (!username || !password) {
      setError("Por favor complete todos los campos")
      setIsLoading(false)
      return
    }

    try {
      // Para fines de demostración, usamos una autenticación simulada
      // ya que el endpoint real podría no estar disponible

      // Verificamos las credenciales (simulado)
      if (password !== "admin2025") {
        throw new Error("Credenciales inválidas")
      }

      // Determinamos el rol basado en el nombre de usuario
      let userRole = ""
      let userId = ""

      if (username.toLowerCase() === "admin") {
        userRole = "admin"
        userId = "1"
      } else if (username.toLowerCase() === "cliente") {
        userRole = "cliente"
        userId = "2"
      } else if (username.toLowerCase() === "cajero") {
        userRole = "cajero"
        userId = "3"
      } else if (username.toLowerCase() === "gerente") {
        userRole = "gerente"
        userId = "4"
      } else {
        // Si el usuario no coincide con ninguno de los roles predefinidos
        throw new Error("Usuario no encontrado")
      }

      // Simulamos almacenar el token y datos del usuario
      localStorage.setItem("authToken", "token-simulado-123456")
      localStorage.setItem("userRole", userRole)
      localStorage.setItem("username", username)
      localStorage.setItem("userId", userId)

      console.log("Datos guardados en localStorage:", {
        authToken: localStorage.getItem("authToken"),
        userRole: localStorage.getItem("userRole"),
        username: localStorage.getItem("username"),
        userId: localStorage.getItem("userId"),
      })

      console.log("Inicio de sesión exitoso. Rol:", userRole)

      // Redirigir según el rol
      switch (userRole) {
        case "cliente":
          router.push("/dashboard-cliente")
          break
        case "cajero":
          router.push("/dashboard-cajero")
          break
        case "gerente":
          router.push("/dashboard-gerente")
          break
        case "admin":
          router.push("/dashboard-admin")
          break
        default:
          router.push("/dashboard-cliente")
      }
    } catch (err) {
      console.error("Error de autenticación:", err)
      setError(err instanceof Error ? err.message : "Error de autenticación")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = () => {
    router.push("/register")
  }

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="w-full h-2 bg-green-600 absolute top-0"></div>
      <main className="p-6 flex justify-center items-center min-h-screen">
        <div className="w-full max-w-6xl flex flex-col md:flex-row bg-gray-200 rounded-lg overflow-hidden">
          <div className="md:w-1/2 p-4 flex flex-col items-start">
            <div className="flex items-center mb-8">
              <Image src="/imagenes/logo.png" alt="AgroBanco Salvadoreño Logo" width={80} height={80} />
              <div className="ml-4">
                <h1 className="text-2xl font-bold">AgroBanco</h1>
                <h2 className="text-xl">Salvadoreño</h2>
              </div>
            </div>

            <div className="w-full flex justify-center mb-4">
              <Image
                src="/imagenes/team-illustration.png"
                alt="Equipo de trabajo"
                width={400}
                height={300}
                className="object-contain"
              />
            </div>
          </div>

          <div className="md:w-1/2 p-8 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-center mb-8">INICIA SESIÓN</h2>

            <form onSubmit={handleLogin} className="w-full max-w-md mx-auto flex flex-col gap-4">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              <div className="w-full">
                <input
                  type="text"
                  placeholder="Nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md text-base"
                  disabled={isLoading}
                />
              </div>

              <div className="w-full">
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md text-base"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3 bg-green-600 text-white rounded-md text-base font-medium transition-colors hover:bg-green-700 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Procesando..." : "Siguiente"}
              </button>
            </form>

            <div className="text-center mt-8 max-w-md mx-auto">
              <p className="mb-2">¿No tienes cuenta con nosotros?</p>
              <button
                onClick={handleRegister}
                className="w-full py-3 bg-green-600 text-white rounded-md text-base font-medium transition-colors hover:bg-green-700"
                disabled={isLoading}
              >
                Regístrate
              </button>
            </div>
          </div>
        </div>
      </main>
      <div className="w-full h-4 bg-green-600 absolute bottom-0"></div>
    </div>
  )
}
