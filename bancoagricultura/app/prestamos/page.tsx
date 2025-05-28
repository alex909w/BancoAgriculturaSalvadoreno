"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Prestamos() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("solicitar")
  const [formData, setFormData] = useState({
    clienteDui: "",
    clienteNombre: "",
    montoPrestamo: "",
    plazo: "12",
    proposito: "",
    garantia: "",
    ingresosMensuales: "",
    gastosPromedios: ""
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
    console.log("Solicitud de préstamo:", formData)
    alert("Solicitud de préstamo enviada para evaluación")
    router.push("/dashboard-cajero")
  }

  const buscarCliente = () => {
    // Aquí iría la lógica para buscar al cliente por DUI
    if (formData.clienteDui) {
      // Simular búsqueda exitosa
      setFormData(prev => ({
        ...prev,
        clienteNombre: "Juan Pérez Ejemplo"
      }))
    }
  }

  // Datos simulados de préstamos existentes
  const prestamosExistentes = [
    {
      id: "P001",
      cliente: "María González",
      dui: "12345678-9",
      monto: 5000,
      saldoPendiente: 3200,
      cuotas: "8/24",
      proximoVencimiento: "2025-06-15",
      estado: "Activo"
    },
    {
      id: "P002",
      cliente: "Carlos Martínez",
      dui: "98765432-1",
      monto: 10000,
      saldoPendiente: 8500,
      cuotas: "6/36",
      proximoVencimiento: "2025-06-10",
      estado: "Activo"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md p-4 flex items-center">        <button 
          onClick={() => router.back()} 
          className="mr-4 p-2 hover:bg-gray-100 rounded-full"
          title="Volver atrás"
          aria-label="Volver a la página anterior"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center">
          <img src="/imagenes/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="h-12 mr-4" />
          <h1 className="text-xl font-bold text-green-700">Gestión de Préstamos</h1>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="border-b">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab("solicitar")}
                  className={`px-6 py-3 font-medium text-sm ${
                    activeTab === "solicitar"
                      ? "border-b-2 border-green-500 text-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Solicitar Préstamo
                </button>
                <button
                  onClick={() => setActiveTab("consultar")}
                  className={`px-6 py-3 font-medium text-sm ${
                    activeTab === "consultar"
                      ? "border-b-2 border-green-500 text-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Consultar Préstamos
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "solicitar" && (
                <div>
                  <div className="flex items-center mb-6">
                    <img src="/imagenes/deposito.png" alt="Préstamo" className="w-16 h-16 mr-4" />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Nueva Solicitud de Préstamo</h2>
                      <p className="text-gray-600">Complete la información para la solicitud</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          DUI del Cliente *
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            name="clienteDui"
                            value={formData.clienteDui}
                            onChange={handleInputChange}
                            placeholder="00000000-0"
                            required
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                          <button
                            type="button"
                            onClick={buscarCliente}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Buscar
                          </button>
                        </div>
                        {formData.clienteNombre && (
                          <p className="mt-2 text-sm text-green-600">Cliente encontrado: {formData.clienteNombre}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Monto del Préstamo (USD) *
                        </label>
                        <input
                          type="number"
                          name="montoPrestamo"
                          value={formData.montoPrestamo}
                          onChange={handleInputChange}
                          placeholder="0.00"
                          step="0.01"
                          min="100"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Plazo (meses) *
                        </label>                        <select
                          name="plazo"
                          value={formData.plazo}
                          onChange={handleInputChange}
                          required
                          title="Seleccionar plazo del préstamo en meses"
                          aria-label="Plazo del préstamo en meses"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="6">6 meses</option>
                          <option value="12">12 meses</option>
                          <option value="18">18 meses</option>
                          <option value="24">24 meses</option>
                          <option value="36">36 meses</option>
                          <option value="48">48 meses</option>
                          <option value="60">60 meses</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ingresos Mensuales (USD) *
                        </label>
                        <input
                          type="number"
                          name="ingresosMensuales"
                          value={formData.ingresosMensuales}
                          onChange={handleInputChange}
                          placeholder="0.00"
                          step="0.01"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gastos Promedios (USD) *
                        </label>
                        <input
                          type="number"
                          name="gastosPromedios"
                          value={formData.gastosPromedios}
                          onChange={handleInputChange}
                          placeholder="0.00"
                          step="0.01"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Propósito del Préstamo *
                      </label>
                      <textarea
                        name="proposito"
                        value={formData.proposito}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        placeholder="Describe el propósito del préstamo..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Garantía/Colateral
                      </label>
                      <textarea
                        name="garantia"
                        value={formData.garantia}
                        onChange={handleInputChange}
                        rows={2}
                        placeholder="Describe la garantía o colateral (opcional)..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
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
                        Enviar Solicitud
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === "consultar" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <img src="/imagenes/deposito.png" alt="Préstamos" className="w-16 h-16 mr-4" />
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">Préstamos Activos</h2>
                        <p className="text-gray-600">Consulta el estado de los préstamos</p>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cliente
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            DUI
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Monto Original
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Saldo Pendiente
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cuotas
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Próximo Vencimiento
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {prestamosExistentes.map((prestamo) => (
                          <tr key={prestamo.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {prestamo.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {prestamo.cliente}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {prestamo.dui}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${prestamo.monto.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${prestamo.saldoPendiente.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {prestamo.cuotas}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {prestamo.proximoVencimiento}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                {prestamo.estado}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
