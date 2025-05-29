"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { transaccionesAPI, cuentasAPI, tiposTransaccionAPI, usuariosAPI, sucursalesAPI } from "@/lib/api"

// Definimos interfaces para los tipos de datos que manejaremos
interface Transaccion {
  id: number
  numeroTransaccion: string
  tipoTransaccion: {
    id: number
    nombre: string
  }
  cuentaOrigen?: {
    id: number
    numeroCuenta: string
  }
  cuentaDestino?: {
    id: number
    numeroCuenta: string
  }
  monto: number
  fecha: string
  descripcion: string
  cajero?: {
    id: number
    nombreCompleto: string
  }
  sucursal: {
    id: number
    nombre: string
  }
}

interface Cuenta {
  id: number
  numeroCuenta: string
  cliente: {
    id: number
    nombreCompleto: string
    dui: string
  }
}

interface TipoTransaccion {
  id: number
  nombre: string
  descripcion: string
}

interface Usuario {
  id: number
  username: string
  nombreCompleto: string
  rol: {
    nombre: string
  }
}

interface Sucursal {
  id: number
  nombre: string
  codigo: string
  direccion: string
}

interface Filtros {
  tipoTransaccion: string
  sucursal: string
  fechaInicio: string
  fechaFin: string
  numeroCuenta: string
  usuario: string
}

export default function Movimientos() {
  const router = useRouter()
  const [menuVisible, setMenuVisible] = useState(false)
  const [transacciones, setTransacciones] = useState<Transaccion[]>([])
  const [cuentas, setCuentas] = useState<Cuenta[]>([])
  const [tiposTransacciones, setTiposTransacciones] = useState<TipoTransaccion[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [userRole, setUserRole] = useState<string | null>(null)
  const [filtros, setFiltros] = useState<Filtros>({
    tipoTransaccion: "",
    sucursal: "",
    fechaInicio: "",
    fechaFin: "",
    numeroCuenta: "",
    usuario: ""
  })
  useEffect(() => {
    // Verificar autenticación
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("authToken") : null
      const role = typeof window !== 'undefined' ? localStorage.getItem("userRole") : null
      
      if (!token) {
        console.log("No hay token, redirigiendo a login")
        router.push("/login")
        return
      }

      setUserRole(role)
      
      // Si hay token, cargamos los datos
      cargarDatos()
    } catch (error) {
      console.error("Error al acceder a localStorage:", error)
      router.push("/login")
    }
  }, [])

  const cargarDatos = async () => {
    setIsLoading(true)
    setError("")
    
    try {
      // Cargamos todas las transacciones
      const transaccionesResponse = await transaccionesAPI.getAll()
      if (transaccionesResponse.error) {
        throw new Error(transaccionesResponse.message || "Error al cargar transacciones")
      }
      
      // Cargamos los tipos de transacciones
      const tiposResponse = await tiposTransaccionAPI.getAll()
      if (tiposResponse.error) {
        throw new Error(tiposResponse.message || "Error al cargar tipos de transacciones")
      }
      
      // Cargamos las cuentas
      const cuentasResponse = await cuentasAPI.getAll()
      if (cuentasResponse.error) {
        throw new Error(cuentasResponse.message || "Error al cargar cuentas")
      }
      
      // Cargamos usuarios cajeros
      const cajerosResponse = await usuariosAPI.getByRol("cajero")
      if (cajerosResponse.error) {
        throw new Error(cajerosResponse.message || "Error al cargar usuarios cajeros")
      }
      
      // Cargamos sucursales
      const sucursalesResponse = await sucursalesAPI.getAll()
      if (sucursalesResponse.error) {
        throw new Error(sucursalesResponse.message || "Error al cargar sucursales")
      }
      
      // Actualizamos el estado
      setTransacciones(Array.isArray(transaccionesResponse) ? transaccionesResponse : [])
      setTiposTransacciones(Array.isArray(tiposResponse) ? tiposResponse : [])
      setCuentas(Array.isArray(cuentasResponse) ? cuentasResponse : [])
      setUsuarios(Array.isArray(cajerosResponse) ? cajerosResponse : [])
      setSucursales(Array.isArray(sucursalesResponse) ? sucursalesResponse : [])
      
    } catch (err: any) {
      console.error("Error al cargar datos:", err)
      setError(err.message || "Ocurrió un error al cargar los datos.")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleFiltroChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target
    setFiltros(prevFiltros => ({
      ...prevFiltros,
      [name]: value
    }))
  }
    const aplicarFiltros = () => {
    if (!transacciones.length) return []
    
    return transacciones.filter(transaccion => {
      // Filtro por tipo de transacción
      if (filtros.tipoTransaccion && transaccion.tipoTransaccion && 
          transaccion.tipoTransaccion.id.toString() !== filtros.tipoTransaccion) {
        return false
      }
      
      // Filtro por sucursal
      if (filtros.sucursal && transaccion.sucursal && 
          transaccion.sucursal.id.toString() !== filtros.sucursal) {
        return false
      }
      
      // Filtro por fecha inicio
      if (filtros.fechaInicio && transaccion.fecha && 
          new Date(transaccion.fecha) < new Date(filtros.fechaInicio)) {
        return false
      }
      
      // Filtro por fecha fin
      if (filtros.fechaFin && transaccion.fecha && 
          new Date(transaccion.fecha) > new Date(filtros.fechaFin)) {
        return false
      }
      
      // Filtro por número de cuenta (origen o destino)
      if (filtros.numeroCuenta) {
        const cuentaOrigenMatch = transaccion.cuentaOrigen && transaccion.cuentaOrigen.numeroCuenta && 
                                 transaccion.cuentaOrigen.numeroCuenta.includes(filtros.numeroCuenta)
        const cuentaDestinoMatch = transaccion.cuentaDestino && transaccion.cuentaDestino.numeroCuenta && 
                                  transaccion.cuentaDestino.numeroCuenta.includes(filtros.numeroCuenta)
        if (!cuentaOrigenMatch && !cuentaDestinoMatch) {
          return false
        }
      }
      
      // Filtro por cajero
      if (filtros.usuario && transaccion.cajero && 
          transaccion.cajero.id && transaccion.cajero.id.toString() !== filtros.usuario) {
        return false
      }
      
      return true
    })
  }
  
  const transaccionesFiltradas = aplicarFiltros()
  
  const resetFiltros = () => {
    setFiltros({
      tipoTransaccion: "",
      sucursal: "",
      fechaInicio: "",
      fechaFin: "",
      numeroCuenta: "",
      usuario: ""
    })
  }

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }
  
  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userRole")
    localStorage.removeItem("username")
    localStorage.removeItem("userId")
    router.push("/login")
  }
    const formatoFecha = (fechaString: string) => {
    if (!fechaString) return '-'
    try {
      const fecha = new Date(fechaString)
      return fecha.toLocaleString('es-ES', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      console.error("Error al formatear fecha:", error)
      return fechaString
    }
  }
    const formatoMoneda = (monto: number) => {
    if (monto === undefined || monto === null) return '-'
    try {
      return new Intl.NumberFormat('es-SV', {
        style: 'currency',
        currency: 'USD'
      }).format(monto)
    } catch (error) {
      console.error("Error al formatear monto:", error)
      return `$${monto}`
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-green-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Image 
            src="/imagenes/logo-login.png" 
            alt="AgroBanco Salvadoreño" 
            width={40} 
            height={40} 
            className="mr-3" 
          />
          <h1 className="text-xl font-bold">Movimientos Bancarios</h1>
        </div>

        <div className="flex items-center">
          <button 
            onClick={() => router.back()} 
            className="mr-4 px-4 py-2 bg-green-700 hover:bg-green-800 rounded-md"
          >
            Volver
          </button>
          
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
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 p-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Filtros de búsqueda</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Transacción</label>              <select 
                name="tipoTransaccion"
                value={filtros.tipoTransaccion}
                onChange={handleFiltroChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                aria-label="Filtrar por tipo de transacción"
                title="Tipo de transacción"
              >
                <option value="">Todos</option>
                {tiposTransacciones.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sucursal</label>              <select 
                name="sucursal"
                value={filtros.sucursal}
                onChange={handleFiltroChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                aria-label="Filtrar por sucursal"
                title="Sucursal"
              >
                <option value="">Todas</option>
                {sucursales.map(sucursal => (
                  <option key={sucursal.id} value={sucursal.id}>{sucursal.nombre}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cajero</label>              <select 
                name="usuario"
                value={filtros.usuario}
                onChange={handleFiltroChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                aria-label="Filtrar por cajero"
                title="Cajero"
              >
                <option value="">Todos</option>
                {usuarios.map(usuario => (
                  <option key={usuario.id} value={usuario.id}>{usuario.nombreCompleto}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número de Cuenta</label>              <input 
                type="text" 
                name="numeroCuenta"
                value={filtros.numeroCuenta}
                onChange={handleFiltroChange}
                placeholder="Buscar por número de cuenta"
                aria-label="Buscar por número de cuenta"
                title="Número de cuenta"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Desde</label>              <input 
                type="date" 
                name="fechaInicio"
                value={filtros.fechaInicio}
                onChange={handleFiltroChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                aria-label="Fecha inicial para filtrar transacciones"
                title="Fecha desde"
                placeholder="Seleccione fecha inicial"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Hasta</label>              <input 
                type="date" 
                name="fechaFin"
                value={filtros.fechaFin}
                onChange={handleFiltroChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                aria-label="Fecha final para filtrar transacciones"
                title="Fecha hasta"
                placeholder="Seleccione fecha final"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={resetFiltros}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none mr-4"
            >
              Restablecer
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Historial de Movimientos</h2>
            <span className="text-sm text-gray-600">
              Total: {transaccionesFiltradas?.length || 0} movimientos
            </span>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : transaccionesFiltradas && transaccionesFiltradas.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nº Transacción
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cuenta Origen
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cuenta Destino
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sucursal
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cajero
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transaccionesFiltradas.map((transaccion) => (
                    <tr key={transaccion.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaccion.numeroTransaccion}
                      </td>                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaccion.tipoTransaccion?.nombre || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatoFecha(transaccion.fecha)}
                      </td>                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                        transaccion.tipoTransaccion?.nombre?.toLowerCase() === 'retiro' ? 'text-red-500' : 
                        transaccion.tipoTransaccion?.nombre?.toLowerCase() === 'depósito' || 
                        transaccion.tipoTransaccion?.nombre?.toLowerCase() === 'deposito' ? 'text-green-600' : 
                        'text-gray-900'
                      }`}>
                        {formatoMoneda(transaccion.monto)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaccion.cuentaOrigen?.numeroCuenta || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaccion.cuentaDestino?.numeroCuenta || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaccion.sucursal?.nombre || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaccion.cajero?.nombreCompleto || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">
                        {transaccion.descripcion}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              No se encontraron movimientos con los filtros aplicados.
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
