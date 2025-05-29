// Configuración base de la API
<<<<<<< Updated upstream
<<<<<<< Updated upstream
const API_BASE_URL = "http://localhost:8080/api"
=======
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
>>>>>>> Stashed changes
=======
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
>>>>>>> Stashed changes

// Función auxiliar para hacer peticiones HTTP
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }

  // Agregar token de autenticación si existe
  const token = localStorage.getItem("authToken")
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  try {
    console.log(`API Request: ${options.method || "GET"} ${url}`)
    const response = await fetch(url, config)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log(`API Response:`, data)
    return data
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error)
    return { error: true, message: error.message }
  }
}

// API de Préstamos
export const prestamosAPI = {
  getAll: () => apiRequest("/prestamos"),
  getById: (id: number) => apiRequest(`/prestamos/${id}`),
  getByNumero: (numero: string) => apiRequest(`/prestamos/numero/${numero}`),
  getByCliente: (clienteId: number) => apiRequest(`/prestamos/cliente/${clienteId}`),
  getByEstado: (estado: string) => apiRequest(`/prestamos/estado/${estado}`),
  create: (prestamo: any) =>
    apiRequest("/prestamos", {
      method: "POST",
      body: JSON.stringify(prestamo),
    }),
  aprobar: (id: number, data: { montoAprobado: number; gerenteId: number }) =>
    apiRequest(`/prestamos/${id}/aprobar`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  rechazar: (id: number, data: { observaciones: string }) =>
    apiRequest(`/prestamos/${id}/rechazar`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  desembolsar: (id: number, data: { cajeroId: number }) =>
    apiRequest(`/prestamos/${id}/desembolsar`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
}

// API de Transacciones
export const transaccionesAPI = {
  getAll: () => apiRequest("/transacciones"),
  getById: (id: number) => apiRequest(`/transacciones/${id}`),
  getByNumero: (numero: string) => apiRequest(`/transacciones/numero/${numero}`),
  getByCuenta: (cuentaId: number) => apiRequest(`/transacciones/cuenta/${cuentaId}`),
  deposito: (data: any) =>
    apiRequest("/transacciones/deposito", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  retiro: (data: any) =>
    apiRequest("/transacciones/retiro", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  transferencia: (data: any) =>
    apiRequest("/transacciones/transferencia", {
      method: "POST",
      body: JSON.stringify(data),
    }),
}

// API de Cuentas
export const cuentasAPI = {
  getAll: () => apiRequest("/cuentas"),
  getById: (id: number) => apiRequest(`/cuentas/${id}`),
  getByNumero: (numero: string) => apiRequest(`/cuentas/numero/${numero}`),
  getByCliente: (clienteId: number) => apiRequest(`/cuentas/cliente/${clienteId}`),
  getBySucursal: (sucursalId: number) => apiRequest(`/cuentas/sucursal/${sucursalId}`),
  getByDui: (dui: string) => apiRequest(`/cuentas/dui/${dui}`),
  create: (cuenta: any) =>
    apiRequest("/cuentas", {
      method: "POST",
      body: JSON.stringify(cuenta),
    }),
  update: (id: number, cuenta: any) =>
    apiRequest(`/cuentas/${id}`, {
      method: "PUT",
      body: JSON.stringify(cuenta),
    }),
  updateEstado: (id: number, estado: string) =>
    apiRequest(`/cuentas/${id}/estado`, {
      method: "PUT",
      body: JSON.stringify({ estado }),
    }),
  delete: (id: number) =>
    apiRequest(`/cuentas/${id}`, {
      method: "DELETE",
    }),
}

// API de Usuarios
export const usuariosAPI = {
  getAll: () => apiRequest("/usuarios"),
  getById: (id: number) => apiRequest(`/usuarios/${id}`),
  getByUsername: (username: string) => apiRequest(`/usuarios/username/${username}`),
  getByEmail: (email: string) => apiRequest(`/usuarios/email/${email}`),
  getByDui: (dui: string) => apiRequest(`/usuarios/dui/${dui}`),
  getByRol: (rol: string) => apiRequest(`/usuarios/rol/${rol}`),
  getBySucursal: (sucursalId: number) => apiRequest(`/usuarios/sucursal/${sucursalId}`),
  create: (usuario: any) =>
    apiRequest("/usuarios", {
      method: "POST",
      body: JSON.stringify(usuario),
    }),
  update: (id: number, usuario: any) =>
    apiRequest(`/usuarios/${id}`, {
      method: "PUT",
      body: JSON.stringify(usuario),
    }),
  updateEstado: (id: number, estado: string) =>
    apiRequest(`/usuarios/${id}/estado`, {
      method: "PUT",
      body: JSON.stringify({ estado }),
    }),
  delete: (id: number) =>
    apiRequest(`/usuarios/${id}`, {
      method: "DELETE",
    }),
}

<<<<<<< Updated upstream
<<<<<<< Updated upstream
// TRANSACCIONES
export const transaccionesAPI = {
  getAll: () => apiRequest("/transacciones"),
  getById: (id: number) => apiRequest(`/transacciones/${id}`),
  getByNumero: (numeroTransaccion: string) => apiRequest(`/transacciones/numero/${numeroTransaccion}`),
  getByCuenta: (cuentaId: number) => apiRequest(`/transacciones/cuenta/${cuentaId}`),
  deposito: (data: {
    cuentaId: number
    monto: number
    cajeroId: number
    sucursalId: number
    descripcion: string
  }) => apiRequest("/transacciones/deposito", { method: "POST", body: JSON.stringify(data) }),
  retiro: (data: {
    cuentaId: number
    monto: number
    cajeroId: number
    sucursalId: number
    descripcion: string
  }) => apiRequest("/transacciones/retiro", { method: "POST", body: JSON.stringify(data) }),
  transferencia: (data: {
    cuentaOrigenId: number
    cuentaDestinoId: number
    monto: number
    cajeroId: number
    sucursalId: number
    descripcion: string
  }) => apiRequest("/transacciones/transferencia", { method: "POST", body: JSON.stringify(data) }),
}

// PRÉSTAMOS
export const prestamosAPI = {
  getAll: () => apiRequest("/prestamos"),
  getById: (id: number) => apiRequest(`/prestamos/${id}`),
  getByNumero: (numeroPrestamo: string) => apiRequest(`/prestamos/numero/${numeroPrestamo}`),
  getByCliente: (clienteId: number) => apiRequest(`/prestamos/cliente/${clienteId}`),
  getByEstado: (estado: string) => apiRequest(`/prestamos/estado/${estado}`),
  create: (data: any) => apiRequest("/prestamos", { method: "POST", body: JSON.stringify(data) }),
  aprobar: (id: number, data: { montoAprobado: number; gerenteId: number }) =>
    apiRequest(`/prestamos/${id}/aprobar`, { method: "PUT", body: JSON.stringify(data) }),
  rechazar: (id: number, data: { observaciones: string }) =>
    apiRequest(`/prestamos/${id}/rechazar`, { method: "PUT", body: JSON.stringify(data) }),
  desembolsar: (id: number, data: { cajeroId: number }) =>
    apiRequest(`/prestamos/${id}/desembolsar`, { method: "PUT", body: JSON.stringify(data) }),
}

// ROLES
export const rolesAPI = {
  getAll: () => apiRequest("/roles"),
  getById: (id: number) => apiRequest(`/roles/${id}`),
  getByNombre: (nombre: string) => apiRequest(`/roles/nombre/${nombre}`),
  create: (data: any) => apiRequest("/roles", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiRequest(`/roles/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number) => apiRequest(`/roles/${id}`, { method: "DELETE" }),
}

// SUCURSALES
=======
// API de Sucursales
>>>>>>> Stashed changes
=======
// API de Sucursales
>>>>>>> Stashed changes
export const sucursalesAPI = {
  getAll: () => apiRequest("/sucursales"),
  getById: (id: number) => apiRequest(`/sucursales/${id}`),
  getByCodigo: (codigo: string) => apiRequest(`/sucursales/codigo/${codigo}`),
  getByEstado: (estado: string) => apiRequest(`/sucursales/estado/${estado}`),
  getByTipo: (tipo: string) => apiRequest(`/sucursales/tipo/${tipo}`),
  getByDepartamento: (departamento: string) => apiRequest(`/sucursales/departamento/${departamento}`),
  create: (sucursal: any) =>
    apiRequest("/sucursales", {
      method: "POST",
      body: JSON.stringify(sucursal),
    }),
  update: (id: number, sucursal: any) =>
    apiRequest(`/sucursales/${id}`, {
      method: "PUT",
      body: JSON.stringify(sucursal),
    }),
  delete: (id: number) =>
    apiRequest(`/sucursales/${id}`, {
      method: "DELETE",
    }),
}

// API de Autenticación
export const authAPI = {
  login: (credentials: { username: string; password: string }) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  getInfo: () => apiRequest("/auth/info"),
}

// API de Operaciones
export const operacionesAPI = {
  getCuentasByDui: (dui: string) => apiRequest(`/operaciones/cuentas/${dui}`),
  abonarEfectivo: (data: { numeroCuenta: string; monto: number }) =>
    apiRequest("/operaciones/abonarefectivo", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  retirarEfectivo: (data: { numeroCuenta: string; monto: number }) =>
    apiRequest("/operaciones/retirarefectivo", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  consultarSaldo: (numeroCuenta: string) => apiRequest(`/operaciones/saldo/${numeroCuenta}`),
}
