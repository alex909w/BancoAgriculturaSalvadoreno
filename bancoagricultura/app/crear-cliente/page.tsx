"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function CrearCliente() {
  const router = useRouter()
  const { data: session } = useSession()
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (session?.user) {
      setUserRole(session.user.role as string)
    }
  }, [session])

  useEffect(() => {
    if (!session) {
      router.push("/login")
    }
  }, [session, router])

  const [formData, setFormData] = useState({
    tipoCuenta: "",
    agregarBeneficiario: "no",
    agregarSeguro: "no",
    sucursalPreferencia: "",
    correoElectronico: "",
    firmaValidacion: "",
    aceptaTerminos: "no",
    nombreCompleto: "",
    dui: "",
    telefono: "",
    fechaNacimiento: "",
    genero: "",
    profesion: "",
    direccion: "",
    ingresosMensuales: "",
  })

  const [sucursales, setSucursales] = useState([])

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const response = await fetch("/api/sucursales")
        if (response.ok) {
          const data = await response.json()
          setSucursales(data)
        } else {
          console.error("Failed to fetch sucursales")
        }
      } catch (error) {
        console.error("Error fetching sucursales:", error)
      }
    }

    fetchSucursales()
  }, [])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        console.log("Cliente creado exitosamente")
        alert("Cliente creado exitosamente")
        // Redirigir al dashboard correspondiente según el rol
        if (userRole === "admin") {
          router.push("/dashboard-admin")
        } else {
          router.push("/dashboard-cajero")
        }
      } else {
        console.error("Error al crear el cliente")
        alert("Error al crear el cliente")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al crear el cliente")
    } finally {
      setIsLoading(false)
    }
  }

  if (!session) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 bg-gray-100">
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Left Form */}
          <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tipo de cuenta */}
              <div>
                <label htmlFor="tipo-cuenta" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de cuenta*
                </label>
                <select
                  name="tipoCuenta"
                  value={formData.tipoCuenta}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Seleccionar tipo de cuenta</option>
                  <option value="1">Cuenta de Ahorros</option>
                  <option value="2">Cuenta Corriente</option>
                  <option value="3">Cuenta Empresarial</option>
                  <option value="4">Cuenta Premium</option>
                  <option value="5">Cuenta Prestamista</option>
                </select>
              </div>

              {/* Agregar beneficiario */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Agregar beneficiario</label>
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="agregarBeneficiario"
                      value="si"
                      checked={formData.agregarBeneficiario === "si"}
                      onChange={handleChange}
                      className="mr-2 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm">Sí</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="agregarBeneficiario"
                      value="no"
                      checked={formData.agregarBeneficiario === "no"}
                      onChange={handleChange}
                      className="mr-2 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm">No</span>
                  </label>
                </div>
              </div>

              {/* Agregar seguro */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Agregar seguro</label>
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="agregarSeguro"
                      value="si"
                      checked={formData.agregarSeguro === "si"}
                      onChange={handleChange}
                      className="mr-2 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm">Sí</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="agregarSeguro"
                      value="no"
                      checked={formData.agregarSeguro === "no"}
                      onChange={handleChange}
                      className="mr-2 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm">No</span>
                  </label>
                </div>
              </div>

              {/* Sucursal de preferencia */}
              <div>
                <label htmlFor="sucursal" className="block text-sm font-medium text-gray-700 mb-1">
                  Sucursal de preferencia*
                </label>
                <select
                  name="sucursalPreferencia"
                  value={formData.sucursalPreferencia}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Seleccionar sucursal</option>
                  {sucursales.map((sucursal) => (
                    <option key={sucursal.id} value={sucursal.id}>
                      {sucursal.nombre}
                      {sucursal.codigo && ` (${sucursal.codigo})`}
                      {sucursal.departamento && ` - ${sucursal.departamento}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Correo electrónico */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico*
                </label>
                <input
                  type="email"
                  name="correoElectronico"
                  value={formData.correoElectronico}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              {/* Firma de validación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Firma de validación</label>
                <div className="h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Área de firma digital</span>
                </div>
                <textarea
                  name="firmaValidacion"
                  value={formData.firmaValidacion}
                  onChange={handleChange}
                  placeholder="Observaciones de validación"
                  rows={2}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                />
              </div>

              {/* Términos y condiciones */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    id="terminos-check"
                    checked={formData.aceptaTerminos === "si"}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, aceptaTerminos: e.target.checked ? "si" : "no" }))
                    }
                    className="text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="terminos-check" className="text-sm text-gray-700">
                    Confirmo haber leído Términos y Condiciones
                  </label>
                </div>

                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="aceptaTerminos"
                      value="si"
                      checked={formData.aceptaTerminos === "si"}
                      onChange={handleChange}
                      className="mr-2 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm">Sí</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="aceptaTerminos"
                      value="no"
                      checked={formData.aceptaTerminos === "no"}
                      onChange={handleChange}
                      className="mr-2 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm">No</span>
                  </label>
                </div>
              </div>

              {/* Campos adicionales opcionales */}
              <div className="border-t pt-4 mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Información adicional del cliente (opcional)</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="nombreCompleto"
                    value={formData.nombreCompleto}
                    onChange={handleChange}
                    placeholder="Nombre completo"
                    className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />

                  <input
                    type="text"
                    name="dui"
                    value={formData.dui}
                    onChange={handleChange}
                    placeholder="DUI (00000000-0)"
                    maxLength={10}
                    className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />

                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="Teléfono"
                    className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />

                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />

                  <select
                    name="genero"
                    value={formData.genero}
                    onChange={handleChange}
                    className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Género</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                  </select>

                  <input
                    type="text"
                    name="profesion"
                    value={formData.profesion}
                    onChange={handleChange}
                    placeholder="Profesión"
                    className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <textarea
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder="Dirección completa"
                  rows={2}
                  className="w-full mt-4 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                />

                <input
                  type="number"
                  name="ingresosMensuales"
                  value={formData.ingresosMensuales}
                  onChange={handleChange}
                  placeholder="Ingresos mensuales (USD)"
                  min="0"
                  step="0.01"
                  className="w-full mt-4 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </form>
          </div>

          {/* Right Profile Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-gray-600">👤</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{formData.nombreCompleto || "NUEVO CLIENTE"}</h3>
                  <p className="text-sm text-gray-600">{formData.dui || "DUI: Pendiente"}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">TIPO DE CUENTA:</span>
                  <span className="text-gray-900">
                    {formData.tipoCuenta === "1" && "AHORROS"}
                    {formData.tipoCuenta === "2" && "CORRIENTE"}
                    {formData.tipoCuenta === "3" && "EMPRESARIAL"}
                    {formData.tipoCuenta === "4" && "PREMIUM"}
                    {formData.tipoCuenta === "5" && "PRESTAMISTA"}
                    {!formData.tipoCuenta && "NO SELECCIONADO"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">PROFESIÓN:</span>
                  <span className="text-gray-900">{formData.profesion || "NO ESPECIFICADA"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">SUCURSAL:</span>
                  <span className="text-gray-900">
                    {sucursales.find((s) => s.id.toString() === formData.sucursalPreferencia)?.nombre ||
                      "NO SELECCIONADA"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">BENEFICIARIO:</span>
                  <span className="text-gray-900">{formData.agregarBeneficiario === "si" ? "SÍ" : "NO"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">SEGURO:</span>
                  <span className="text-gray-900">{formData.agregarSeguro === "si" ? "SÍ" : "NO"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">TÉRMINOS:</span>
                  <span
                    className={`font-medium ${formData.aceptaTerminos === "si" ? "text-green-600" : "text-red-600"}`}
                  >
                    {formData.aceptaTerminos === "si" ? "ACEPTADOS" : "PENDIENTES"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                onClick={handleSubmit}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                <span>✓</span>
                {isLoading ? "Creando..." : "Crear Cliente"}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (userRole === "admin") {
                    router.push("/dashboard-admin")
                  } else {
                    router.push("/dashboard-cajero")
                  }
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-md transition-colors flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                <span>✗</span>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
