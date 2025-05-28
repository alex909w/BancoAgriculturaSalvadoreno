"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CrearCliente() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    dui: "",
    telefono: "",
    email: "",
    direccion: "",
    fechaNacimiento: "",
    ocupacion: "",
    ingresos: "",
    tipoCuenta: "ahorros"
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para crear el cliente
    console.log("Datos del cliente:", formData)
    // Simular éxito y redirigir
    alert("Cliente registrado exitosamente")
    router.push("/dashboard-cajero")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md p-4 flex items-center">        <button 
          onClick={() => router.back()} 
          className="mr-4 p-2 hover:bg-gray-100 rounded-full"
          title="Volver atrás"
          aria-label="Volver atrás"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center">
          <img src="/imagenes/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="h-12 mr-4" />
          <h1 className="text-xl font-bold text-green-700">Registrar Nuevo Cliente</h1>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <img src="/imagenes/nuevo-usuario.png" alt="Nuevo Cliente" className="w-16 h-16 mr-4" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Nuevo Cliente</h2>
                <p className="text-gray-600">Complete la información del cliente</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombres *
                  </label>                  <input
                    type="text"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleInputChange}
                    required
                    title="Ingrese los nombres del cliente"
                    aria-label="Nombres del cliente"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellidos *
                  </label>                  <input
                    type="text"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    required
                    title="Ingrese los apellidos del cliente"
                    aria-label="Apellidos del cliente"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DUI *
                  </label>                  <input
                    type="text"
                    name="dui"
                    value={formData.dui}
                    onChange={handleInputChange}
                    placeholder="00000000-0"
                    required
                    title="Ingrese el DUI del cliente en formato 00000000-0"
                    aria-label="DUI del cliente"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="0000-0000"
                    required
                    title="Ingrese el número de teléfono del cliente"
                    aria-label="Teléfono del cliente"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico *
                  </label>                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    title="Ingrese el correo electrónico del cliente"
                    aria-label="Correo electrónico del cliente"
                    placeholder="ejemplo@correo.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Nacimiento *
                  </label>                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleInputChange}
                    required
                    title="Seleccione la fecha de nacimiento del cliente"
                    aria-label="Fecha de nacimiento del cliente"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ocupación
                  </label>                  <input
                    type="text"
                    name="ocupacion"
                    value={formData.ocupacion}
                    onChange={handleInputChange}
                    title="Ingrese la ocupación del cliente (opcional)"
                    aria-label="Ocupación del cliente"
                    placeholder="Ej: Ingeniero, Contador, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ingresos Mensuales
                  </label>
                  <input
                    type="number"
                    name="ingresos"
                    value={formData.ingresos}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección Completa *
                </label>                <textarea
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  title="Ingrese la dirección completa del cliente"
                  aria-label="Dirección completa del cliente"
                  placeholder="Ingrese la dirección completa del cliente"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Cuenta *
                </label>                <select
                  name="tipoCuenta"
                  value={formData.tipoCuenta}
                  onChange={handleInputChange}
                  required
                  title="Seleccione el tipo de cuenta"
                  aria-label="Tipo de cuenta"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="ahorros">Cuenta de Ahorros</option>
                  <option value="corriente">Cuenta Corriente</option>
                  <option value="plazo-fijo">Cuenta a Plazo Fijo</option>
                </select>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Registrar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
