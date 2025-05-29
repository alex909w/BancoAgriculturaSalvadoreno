"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function Transaccion() {
  const router = useRouter()
  const [menuVisible, setMenuVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("deposito")
  const [formData, setFormData] = useState({
    clienteDui: "",
    clienteNombre: "",
    numeroCuenta: "",
    monto: "",
    concepto: "",
    cuentaOrigen: "",
    cuentaDestino: ""
  })

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem("authToken")
    const userRole = localStorage.getItem("userRole")

    if (!token || !userRole) {
      router.push("/login")
      return
    }

    if (userRole !== "cajero" && userRole !== "admin") {
      router.push("/login")
      return
    }

    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userRole")
    localStorage.removeItem("username")
    localStorage.removeItem("userId")
    router.push("/login")
  }

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const buscarCliente = () => {
    if (formData.clienteDui) {
      // Simular búsqueda exitosa
      setFormData(prev => ({
        ...prev,
        clienteNombre: "Ana Martínez López",
        numeroCuenta: "1234567890"
      }))
    }
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Transacción:", { tipo: activeTab, ...formData })
    alert(`${activeTab === "deposito" ? "Depósito" : activeTab === "retiro" ? "Retiro" : "Transferencia"} procesado exitosamente`)
    router.push("/dashboard-cajero")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando transacciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => router.back()} 
            className="mr-4 p-2 hover:bg-green-700 rounded-full"
            title="Volver atrás"
            aria-label="Volver a la página anterior"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <Image src="/imagenes/logo-login.png" alt="AgroBanco Salvadoreño" width={40} height={40} className="mr-3" />
          <h1 className="text-xl font-bold">Transacciones</h1>
        </div>

        <div className="relative">
          <button
            onClick={toggleMenu}
            className="p-2 hover:bg-green-700 rounded-full"
            title="Menú de usuario"
            aria-label="Abrir menú de usuario"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>

          {menuVisible && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <button
                onClick={() => router.push("/dashboard-cajero")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Dashboard
              </button>
              <hr className="my-1" />
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Cerrar Sesión
              </button>
            </div>          )}
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="border-b">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab("deposito")}
                  className={`px-6 py-3 font-medium text-sm ${
                    activeTab === "deposito"
                      ? "border-b-2 border-green-500 text-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Depósito
                </button>
                <button
                  onClick={() => setActiveTab("retiro")}
                  className={`px-6 py-3 font-medium text-sm ${
                    activeTab === "retiro"
                      ? "border-b-2 border-green-500 text-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Retiro
                </button>
                <button
                  onClick={() => setActiveTab("transferencia")}
                  className={`px-6 py-3 font-medium text-sm ${
                    activeTab === "transferencia"
                      ? "border-b-2 border-green-500 text-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Transferencia
                </button>
              </nav>
            </div>

            <div className="p-6">
              <div className="flex items-center mb-6">
                <img src="/imagenes/transaccion.png" alt="Transacción" className="w-16 h-16 mr-4" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {activeTab === "deposito" && "Realizar Depósito"}
                    {activeTab === "retiro" && "Realizar Retiro"}
                    {activeTab === "transferencia" && "Realizar Transferencia"}
                  </h2>
                  <p className="text-gray-600">
                    {activeTab === "deposito" && "Depositar dinero en la cuenta del cliente"}
                    {activeTab === "retiro" && "Retirar dinero de la cuenta del cliente"}
                    {activeTab === "transferencia" && "Transferir dinero entre cuentas"}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {(activeTab === "deposito" || activeTab === "retiro") && (
                  <>
                    <div>
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
                        <div className="mt-2 p-3 bg-green-50 rounded-md">
                          <p className="text-sm text-green-600">Cliente: {formData.clienteNombre}</p>
                          <p className="text-sm text-green-600">Cuenta: {formData.numeroCuenta}</p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Monto (USD) *
                        </label>
                        <input
                          type="number"
                          name="monto"
                          value={formData.monto}
                          onChange={handleInputChange}
                          placeholder="0.00"
                          step="0.01"
                          min="0.01"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Concepto
                        </label>
                        <input
                          type="text"
                          name="concepto"
                          value={formData.concepto}
                          onChange={handleInputChange}
                          placeholder="Motivo de la transacción"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "transferencia" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cuenta Origen *
                        </label>
                        <input
                          type="text"
                          name="cuentaOrigen"
                          value={formData.cuentaOrigen}
                          onChange={handleInputChange}
                          placeholder="Número de cuenta origen"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cuenta Destino *
                        </label>
                        <input
                          type="text"
                          name="cuentaDestino"
                          value={formData.cuentaDestino}
                          onChange={handleInputChange}
                          placeholder="Número de cuenta destino"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Monto (USD) *
                        </label>
                        <input
                          type="number"
                          name="monto"
                          value={formData.monto}
                          onChange={handleInputChange}
                          placeholder="0.00"
                          step="0.01"
                          min="0.01"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Concepto
                        </label>
                        <input
                          type="text"
                          name="concepto"
                          value={formData.concepto}
                          onChange={handleInputChange}
                          placeholder="Motivo de la transferencia"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Resumen de la transacción */}
                {formData.monto && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-blue-800 mb-2">Resumen de la Transacción</h3>
                    <div className="space-y-1 text-sm text-blue-700">
                      <p><strong>Tipo:</strong> {activeTab === "deposito" ? "Depósito" : activeTab === "retiro" ? "Retiro" : "Transferencia"}</p>
                      <p><strong>Monto:</strong> ${parseFloat(formData.monto || "0").toLocaleString()}</p>
                      {activeTab !== "transferencia" && formData.clienteNombre && (
                        <>
                          <p><strong>Cliente:</strong> {formData.clienteNombre}</p>
                          <p><strong>Cuenta:</strong> {formData.numeroCuenta}</p>
                        </>
                      )}
                      {activeTab === "transferencia" && (
                        <>
                          <p><strong>Desde:</strong> {formData.cuentaOrigen}</p>
                          <p><strong>Hacia:</strong> {formData.cuentaDestino}</p>
                        </>
                      )}
                      {formData.concepto && <p><strong>Concepto:</strong> {formData.concepto}</p>}
                    </div>
                  </div>
                )}

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
                    Procesar Transacción
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
