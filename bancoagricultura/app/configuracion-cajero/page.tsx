"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function ConfiguracionCajero() {
  const router = useRouter()
  const [menuVisible, setMenuVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState({
    notificaciones: {
      email: true,
      push: false,
      transacciones: true,
      alertas: true
    },
    seguridad: {
      dobleFactorAuth: false,
      sesionTimeout: "30",
      bloqueoAutomatico: true
    },
    interfaz: {
      tema: "claro",
      idioma: "es",
      moneda: "USD",
      formatoFecha: "dd/mm/yyyy"
    },
    limites: {
      montoMaximoTransaccion: "10000",
      transaccionesDiarias: "100",
      alertaMonto: "5000"
    }
  })

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem("authToken")
    const userRole = localStorage.getItem("userRole")

    if (!token || !userRole) {
      router.push("/login")
      return
    }

    if (userRole !== "cajero") {
      router.push("/login")
      return
    }

    loadConfiguration()
  }, [router])

  const loadConfiguration = async () => {
    try {
      setLoading(true)
      // Intentar cargar configuración desde la API
      // await apiRequest("/configuracion/cajero")
      console.log("Configuración cargada")
    } catch (error) {
      console.error("Error al cargar configuración:", error)
    } finally {
      setLoading(false)
    }
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
  const handleToggle = (category: string, setting: string) => {
    setSettings(prev => {
      const categoryObj = prev[category as keyof typeof prev] as Record<string, any>
      return {
        ...prev,
        [category]: {
          ...categoryObj,
          [setting]: !categoryObj[setting]
        }
      }
    })
  }
  const handleSelectChange = (category: string, setting: string, value: string) => {
    setSettings(prev => {
      const categoryObj = prev[category as keyof typeof prev] as Record<string, any>
      return {
        ...prev,
        [category]: {
          ...categoryObj,
          [setting]: value
        }
      }
    })
  }

  const handleSave = () => {
    console.log("Configuración guardada:", settings)
    alert("Configuración guardada exitosamente")
  }

  const handleReset = () => {
    if (confirm("¿Está seguro de que desea restablecer toda la configuración a los valores predeterminados?")) {
      // Restablecer a valores por defecto
      setSettings({
        notificaciones: {
          email: true,
          push: false,
          transacciones: true,
          alertas: true
        },
        seguridad: {
          dobleFactorAuth: false,
          sesionTimeout: "30",
          bloqueoAutomatico: true
        },
        interfaz: {
          tema: "claro",
          idioma: "es",
          moneda: "USD",
          formatoFecha: "dd/mm/yyyy"
        },
        limites: {
          montoMaximoTransaccion: "10000",
          transaccionesDiarias: "100",
          alertaMonto: "5000"
        }
      })
      alert("Configuración restablecida a valores predeterminados")
    }
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando configuración...</p>
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
          <h1 className="text-xl font-bold">Configuración - Cajero</h1>
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
              <button
                onClick={() => router.push("/perfil-cajero")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Mi Perfil
              </button>
              <hr className="my-1" />
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Notificaciones */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 17H7l5 5v-5z" />
              </svg>
              Notificaciones
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-700">Notificaciones por Email</h3>
                  <p className="text-sm text-gray-500">Recibir notificaciones importantes por correo electrónico</p>
                </div>                <button
                  onClick={() => handleToggle('notificaciones', 'email')}
                  title={`${settings.notificaciones.email ? 'Desactivar' : 'Activar'} notificaciones por email`}
                  aria-label={`${settings.notificaciones.email ? 'Desactivar' : 'Activar'} notificaciones por email`}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    settings.notificaciones.email ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.notificaciones.email ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-700">Notificaciones Push</h3>
                  <p className="text-sm text-gray-500">Recibir notificaciones en tiempo real</p>
                </div>                <button
                  onClick={() => handleToggle('notificaciones', 'push')}
                  title={`${settings.notificaciones.push ? 'Desactivar' : 'Activar'} notificaciones push`}
                  aria-label={`${settings.notificaciones.push ? 'Desactivar' : 'Activar'} notificaciones push`}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    settings.notificaciones.push ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.notificaciones.push ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-700">Alertas de Transacciones</h3>
                  <p className="text-sm text-gray-500">Notificar sobre transacciones importantes</p>
                </div>                <button
                  onClick={() => handleToggle('notificaciones', 'transacciones')}
                  title={`${settings.notificaciones.transacciones ? 'Desactivar' : 'Activar'} alertas de transacciones`}
                  aria-label={`${settings.notificaciones.transacciones ? 'Desactivar' : 'Activar'} alertas de transacciones`}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    settings.notificaciones.transacciones ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.notificaciones.transacciones ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Seguridad */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Seguridad
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-700">Autenticación de Dos Factores</h3>
                  <p className="text-sm text-gray-500">Agregar una capa extra de seguridad</p>
                </div>                <button
                  onClick={() => handleToggle('seguridad', 'dobleFactorAuth')}
                  title={`${settings.seguridad.dobleFactorAuth ? 'Desactivar' : 'Activar'} autenticación de dos factores`}
                  aria-label={`${settings.seguridad.dobleFactorAuth ? 'Desactivar' : 'Activar'} autenticación de dos factores`}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    settings.seguridad.dobleFactorAuth ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.seguridad.dobleFactorAuth ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-700">Timeout de Sesión (minutos)</h3>
                  <p className="text-sm text-gray-500">Tiempo antes de cerrar sesión automáticamente</p>
                </div>                <select
                  value={settings.seguridad.sesionTimeout}
                  onChange={(e) => handleSelectChange('seguridad', 'sesionTimeout', e.target.value)}
                  title="Seleccionar tiempo de timeout de sesión"
                  aria-label="Tiempo de timeout de sesión en minutos"
                  className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="15">15 minutos</option>
                  <option value="30">30 minutos</option>
                  <option value="60">1 hora</option>
                  <option value="120">2 horas</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-700">Bloqueo Automático</h3>
                  <p className="text-sm text-gray-500">Bloquear pantalla cuando esté inactivo</p>
                </div>                <button
                  onClick={() => handleToggle('seguridad', 'bloqueoAutomatico')}
                  title={`${settings.seguridad.bloqueoAutomatico ? 'Desactivar' : 'Activar'} bloqueo automático`}
                  aria-label={`${settings.seguridad.bloqueoAutomatico ? 'Desactivar' : 'Activar'} bloqueo automático`}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    settings.seguridad.bloqueoAutomatico ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.seguridad.bloqueoAutomatico ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Interfaz */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
              Interfaz
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>                <select
                  value={settings.interfaz.tema}
                  onChange={(e) => handleSelectChange('interfaz', 'tema', e.target.value)}
                  title="Seleccionar tema de la interfaz"
                  aria-label="Tema de la interfaz de usuario"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="claro">Claro</option>
                  <option value="oscuro">Oscuro</option>
                  <option value="automatico">Automático</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>                <select
                  value={settings.interfaz.idioma}
                  onChange={(e) => handleSelectChange('interfaz', 'idioma', e.target.value)}
                  title="Seleccionar idioma de la aplicación"
                  aria-label="Idioma de la aplicación"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Moneda</label>                <select
                  value={settings.interfaz.moneda}
                  onChange={(e) => handleSelectChange('interfaz', 'moneda', e.target.value)}
                  title="Seleccionar moneda predeterminada"
                  aria-label="Moneda predeterminada para las transacciones"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Formato de Fecha</label>                <select
                  value={settings.interfaz.formatoFecha}
                  onChange={(e) => handleSelectChange('interfaz', 'formatoFecha', e.target.value)}
                  title="Seleccionar formato de fecha"
                  aria-label="Formato de fecha para mostrar en la aplicación"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                  <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                  <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>

          {/* Límites de Transacciones */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Límites de Transacciones
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto Máximo por Transacción (USD)
                </label>                <input
                  type="number"
                  value={settings.limites.montoMaximoTransaccion}
                  onChange={(e) => handleSelectChange('limites', 'montoMaximoTransaccion', e.target.value)}
                  title="Monto máximo permitido por transacción"
                  placeholder="Ingrese el monto máximo"
                  aria-label="Monto máximo por transacción en USD"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transacciones Máximas por Día
                </label>                <input
                  type="number"
                  value={settings.limites.transaccionesDiarias}
                  onChange={(e) => handleSelectChange('limites', 'transaccionesDiarias', e.target.value)}
                  title="Número máximo de transacciones permitidas por día"
                  placeholder="Ingrese el número máximo"
                  aria-label="Número máximo de transacciones por día"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alerta de Monto (USD)
                </label>                <input
                  type="number"
                  value={settings.limites.alertaMonto}
                  onChange={(e) => handleSelectChange('limites', 'alertaMonto', e.target.value)}
                  title="Monto que activará alertas de seguridad"
                  placeholder="Ingrese el monto de alerta"
                  aria-label="Monto de alerta en USD"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-between">
            <button
              onClick={handleReset}
              className="px-6 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors"
            >
              Restablecer Todo
            </button>
            <div className="space-x-4">
              <button
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Guardar Configuración
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
