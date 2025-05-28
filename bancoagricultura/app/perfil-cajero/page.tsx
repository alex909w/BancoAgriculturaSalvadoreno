"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function PerfilCajero() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    nombres: "Carlos",
    apellidos: "Mendoza García",
    dui: "12345678-9",
    telefono: "7890-1234",
    email: "carlos.mendoza@agrobanco.sv",
    direccion: "Colonia Escalón, San Salvador",
    fechaIngreso: "2023-01-15",
    codigoEmpleado: "EMP001",
    sucursal: "Sucursal Central",
    cargo: "Cajero",
    estado: "Activo"
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = () => {
    // Aquí iría la lógica para guardar los cambios
    console.log("Datos actualizados:", profileData)
    setIsEditing(false)
    alert("Perfil actualizado exitosamente")
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Revertir cambios si es necesario
  }

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
          <h1 className="text-xl font-bold text-green-700">Mi Perfil</h1>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Header del perfil */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mr-6">
                  <img src="/imagenes/Usuario.png" alt="Foto de perfil" className="w-16 h-16 rounded-full" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {profileData.nombres} {profileData.apellidos}
                  </h2>
                  <p className="text-gray-600">{profileData.cargo}</p>
                  <p className="text-sm text-gray-500">{profileData.codigoEmpleado}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Editar Perfil
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      Guardar
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Información personal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Personal</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombres
                    </label>
                    {isEditing ? (                      <input
                        type="text"
                        name="nombres"
                        value={profileData.nombres}
                        onChange={handleInputChange}
                        title="Ingrese sus nombres"
                        placeholder="Ingrese sus nombres"
                        aria-label="Nombres del empleado"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-md">{profileData.nombres}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellidos
                    </label>
                    {isEditing ? (                      <input
                        type="text"
                        name="apellidos"
                        value={profileData.apellidos}
                        onChange={handleInputChange}
                        title="Ingrese sus apellidos"
                        placeholder="Ingrese sus apellidos"
                        aria-label="Apellidos del empleado"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-md">{profileData.apellidos}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      DUI
                    </label>
                    <p className="px-3 py-2 bg-gray-100 rounded-md text-gray-600">{profileData.dui}</p>
                    <span className="text-xs text-gray-500">Este campo no se puede modificar</span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    {isEditing ? (                      <input
                        type="tel"
                        name="telefono"
                        value={profileData.telefono}
                        onChange={handleInputChange}
                        title="Ingrese su número de teléfono"
                        placeholder="Ej: 7890-1234"
                        aria-label="Número de teléfono del empleado"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-md">{profileData.telefono}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo Electrónico
                    </label>
                    {isEditing ? (                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        title="Ingrese su dirección de correo electrónico"
                        placeholder="correo@ejemplo.com"
                        aria-label="Dirección de correo electrónico del empleado"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-md">{profileData.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección
                    </label>
                    {isEditing ? (                      <textarea
                        name="direccion"
                        value={profileData.direccion}
                        onChange={handleInputChange}
                        rows={2}
                        title="Ingrese su dirección completa"
                        placeholder="Ingrese su dirección completa"
                        aria-label="Dirección de residencia del empleado"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-md">{profileData.direccion}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Laboral</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código de Empleado
                    </label>
                    <p className="px-3 py-2 bg-gray-100 rounded-md text-gray-600">{profileData.codigoEmpleado}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cargo
                    </label>
                    <p className="px-3 py-2 bg-gray-100 rounded-md text-gray-600">{profileData.cargo}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sucursal
                    </label>
                    <p className="px-3 py-2 bg-gray-100 rounded-md text-gray-600">{profileData.sucursal}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Ingreso
                    </label>
                    <p className="px-3 py-2 bg-gray-100 rounded-md text-gray-600">{profileData.fechaIngreso}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <span className="inline-flex px-2 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                      {profileData.estado}
                    </span>
                  </div>
                </div>

                {/* Estadísticas del cajero */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Estadísticas del Mes</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-md">
                      <span className="text-sm font-medium text-blue-800">Transacciones Procesadas</span>
                      <span className="text-lg font-bold text-blue-600">245</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-md">
                      <span className="text-sm font-medium text-green-800">Clientes Atendidos</span>
                      <span className="text-lg font-bold text-green-600">189</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-md">
                      <span className="text-sm font-medium text-purple-800">Nuevos Clientes</span>
                      <span className="text-lg font-bold text-purple-600">12</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cambio de contraseña */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Seguridad</h3>
              <button className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors">
                Cambiar Contraseña
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
