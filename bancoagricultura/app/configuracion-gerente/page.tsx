"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ConfiguracionGerente() {
  const router = useRouter()
  const [menuVisible, setMenuVisible] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const [settings, setSettings] = useState({
    notificaciones: {
      email: true,
      sms: false,
      push: true,
      solicitudesPrestamos: true,
      transaccionesAltas: true,
      reportesDiarios: false,
    },
    seguridad: {
      cambiarPassword: false,
      autenticacionDosFactor: false,
      sesionTimeout: "30",
    },
    preferencias: {
      idioma: "es",
      moneda: "USD",
      formatoFecha: "dd/mm/yyyy",
      tema: "claro",
    },
  })

  const handleNotificationChange = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      notificaciones: {
        ...prev.notificaciones,
        [key]: !prev.notificaciones[key as keyof typeof prev.notificaciones],
      },
    }))
  }

  const handleSecurityChange = (key: string, value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      seguridad: {
        ...prev.seguridad,
        [key]: value,
      },
    }))
  }

  const handlePreferenceChange = (key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      preferencias: {
        ...prev.preferencias,
        [key]: value,
      },
    }))
  }

  const handleSave = () => {
    console.log("Guardando configuración:", settings)
    alert("Configuración guardada exitosamente")
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full"
            title="Volver atrás"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <img src="/imagenes/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="h-12 mr-4" />
          <h1 className="text-xl font-bold text-green-700">Configuración</h1>
        </div>
        <div className="relative">
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200" onClick={toggleMenu}>
            <img src="/imagenes/Usuario.png" alt="Usuario" className="w-8 h-8 rounded-full" />
          </button>

          {menuVisible && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <Link href="/perfil-gerente" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md">
            {/* Tabs */}
            <div className="border-b">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab("general")}
                  className={`px-6 py-3 font-medium text-sm ${
                    activeTab === "general"
                      ? "border-b-2 border-green-500 text-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  General
                </button>
                <button
                  onClick={() => setActiveTab("notificaciones")}
                  className={`px-6 py-3 font-medium text-sm ${
                    activeTab === "notificaciones"
                      ? "border-b-2 border-green-500 text-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Notificaciones
                </button>
                <button
                  onClick={() => setActiveTab("seguridad")}
                  className={`px-6 py-3 font-medium text-sm ${
                    activeTab === "seguridad"
                      ? "border-b-2 border-green-500 text-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Seguridad
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "general" && (
                <div>
                  <div className="flex items-center mb-6">
                    <svg className="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Preferencias Generales</h2>
                      <p className="text-gray-600">Configura las preferencias básicas del sistema</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
                        <select
                          value={settings.preferencias.idioma}
                          onChange={(e) => handlePreferenceChange("idioma", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="es">Español</option>
                          <option value="en">English</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Moneda</label>
                        <select
                          value={settings.preferencias.moneda}
                          onChange={(e) => handlePreferenceChange("moneda", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="USD">USD - Dólar Estadounidense</option>
                          <option value="EUR">EUR - Euro</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Formato de Fecha</label>
                        <select
                          value={settings.preferencias.formatoFecha}
                          onChange={(e) => handlePreferenceChange("formatoFecha", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                          <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                          <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
                        <select
                          value={settings.preferencias.tema}
                          onChange={(e) => handlePreferenceChange("tema", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="claro">Claro</option>
                          <option value="oscuro">Oscuro</option>
                          <option value="auto">Automático</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notificaciones" && (
                <div>
                  <div className="flex items-center mb-6">
                    <svg className="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h8v-2H4v2zM4 11h10V9H4v2z"
                      />
                    </svg>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Notificaciones</h2>
                      <p className="text-gray-600">Configura cómo y cuándo recibir notificaciones</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-4">Canales de Notificación</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-700">Notificaciones por Email</p>
                            <p className="text-sm text-gray-500">Recibir notificaciones en tu correo electrónico</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.notificaciones.email}
                              onChange={() => handleNotificationChange("email")}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-700">Notificaciones SMS</p>
                            <p className="text-sm text-gray-500">Recibir notificaciones por mensaje de texto</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.notificaciones.sms}
                              onChange={() => handleNotificationChange("sms")}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-700">Notificaciones Push</p>
                            <p className="text-sm text-gray-500">Recibir notificaciones en el navegador</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.notificaciones.push}
                              onChange={() => handleNotificationChange("push")}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-4">Tipos de Notificación</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-700">Solicitudes de Préstamos</p>
                            <p className="text-sm text-gray-500">Nuevas solicitudes que requieren aprobación</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.notificaciones.solicitudesPrestamos}
                              onChange={() => handleNotificationChange("solicitudesPrestamos")}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-700">Transacciones de Alto Monto</p>
                            <p className="text-sm text-gray-500">Transacciones superiores a $5,000</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.notificaciones.transaccionesAltas}
                              onChange={() => handleNotificationChange("transaccionesAltas")}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-700">Reportes Diarios</p>
                            <p className="text-sm text-gray-500">Resumen diario de actividades</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.notificaciones.reportesDiarios}
                              onChange={() => handleNotificationChange("reportesDiarios")}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "seguridad" && (
                <div>
                  <div className="flex items-center mb-6">
                    <svg className="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Seguridad</h2>
                      <p className="text-gray-600">Configura las opciones de seguridad de tu cuenta</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                      <div className="flex">
                        <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>
                          <h3 className="text-sm font-medium text-yellow-800">Importante</h3>
                          <p className="text-sm text-yellow-700 mt-1">
                            Los cambios de seguridad requieren confirmación adicional y pueden requerir contactar al
                            administrador del sistema.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                        <div>
                          <p className="font-medium text-gray-700">Cambiar Contraseña</p>
                          <p className="text-sm text-gray-500">Actualiza tu contraseña regularmente</p>
                        </div>
                        <button
                          onClick={() => alert("Funcionalidad de cambio de contraseña - Contacte al administrador")}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                          Cambiar
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                        <div>
                          <p className="font-medium text-gray-700">Autenticación de Dos Factores</p>
                          <p className="text-sm text-gray-500">Añade una capa extra de seguridad</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.seguridad.autenticacionDosFactor}
                            onChange={(e) => handleSecurityChange("autenticacionDosFactor", e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-md">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-medium text-gray-700">Tiempo de Sesión</p>
                            <p className="text-sm text-gray-500">Tiempo antes de cerrar sesión automáticamente</p>
                          </div>
                        </div>
                        <select
                          value={settings.seguridad.sesionTimeout}
                          onChange={(e) => handleSecurityChange("sesionTimeout", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="15">15 minutos</option>
                          <option value="30">30 minutos</option>
                          <option value="60">1 hora</option>
                          <option value="120">2 horas</option>
                          <option value="480">8 horas</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-8 pt-6 border-t">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Guardar Configuración
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
