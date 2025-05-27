"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "El nombre completo es requerido"
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El correo electrónico no es válido"
    }

    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es requerido"
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // En una aplicación real, aquí enviarías los datos al servidor
      alert("Registro exitoso. Ahora puedes iniciar sesión.")
      router.push("/login")
    }
  }

  const handleBackToLogin = () => {
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gray-300">
      <main className="p-6 flex justify-center items-center min-h-screen">
        <div className="w-full max-w-6xl flex flex-col md:flex-row bg-gray-300 rounded-lg overflow-hidden">
          <div className="md:w-1/2 flex flex-col items-end p-0">
            <div className="w-full flex justify-end mb-0">
              <Image src="/imagenes/logo-login.png" alt="AgroBanco Salvadoreño Logo" width={350} height={100} />
            </div>
            <div className="w-full flex justify-center">
              <Image
                src="/imagenes/Registrarse.png"
                alt="Registro"
                width={356}
                height={296}
                className="object-contain"
              />
            </div>
          </div>

          <div className="md:w-1/2 p-0 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-center mb-8 text-black">CREAR CUENTA</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
              <div className="flex flex-col gap-1">
                <label htmlFor="fullName" className="text-sm font-normal text-black">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full p-2 border-2 border-black rounded-md text-base ${errors.fullName ? "border-red-500" : ""}`}
                />
                {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-sm font-normal text-black">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-2 border-2 border-black rounded-md text-base ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="username" className="text-sm font-normal text-black">
                  Nombre de Usuario
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full p-2 border-2 border-black rounded-md text-base ${errors.username ? "border-red-500" : ""}`}
                />
                {errors.username && <p className="text-xs text-red-500">{errors.username}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="password" className="text-sm font-normal text-black">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full p-2 border-2 border-black rounded-md text-base ${errors.password ? "border-red-500" : ""}`}
                />
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="confirmPassword" className="text-sm font-normal text-black">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full p-2 border-2 border-black rounded-md text-base ${errors.confirmPassword ? "border-red-500" : ""}`}
                />
                {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                className="mt-4 py-2.5 px-5 bg-green-600 text-white border-none rounded-md text-base font-medium cursor-pointer transition-colors hover:bg-green-700"
              >
                Registrarse
              </button>

              <div className="mt-6 text-center">
                <p>¿Ya tienes una cuenta?</p>
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="mt-2 w-full py-2 bg-transparent text-green-600 border border-green-600 rounded-md text-sm font-medium cursor-pointer transition-all hover:bg-green-600 hover:text-white"
                >
                  Iniciar Sesión
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
