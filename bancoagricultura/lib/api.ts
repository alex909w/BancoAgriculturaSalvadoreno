// Configuración base de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api"

// Función helper para hacer peticiones
export async function apiRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
  const token = localStorage.getItem("authToken")

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }

  try {
    console.log(`Haciendo petición a: ${API_BASE_URL}${endpoint}`)
    console.log("Opciones:", options)

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    })

    console.log(`Respuesta HTTP: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      // Intentar obtener el mensaje de error del servidor
      let errorMessage = response.statusText
      try {
        const errorData = await response.text()
        console.log("Cuerpo del error:", errorData)

        // Intentar parsear como JSON
        try {
          const errorJson = JSON.parse(errorData)
          errorMessage = errorJson.message || errorJson.error || errorData
        } catch {
          errorMessage = errorData || response.statusText
        }
      } catch {
        errorMessage = response.statusText
      }

      console.error(`Error API: ${response.status} ${response.statusText}`)
      console.error("Mensaje de error:", errorMessage)

      return {
        error: true,
        status: response.status,
        message: errorMessage,
      }
    }

    const data = await response.json()
    console.log("Datos recibidos:", data)
    return data
  } catch (error) {
    console.error("Error de red:", error)
    return {
      error: true,
      message: "Error de conexión. Verifique su conexión a internet o que el servidor esté funcionando.",
    }
  }
}

// AUTENTICACIÓN
export const authAPI = {
  login: (username: string, password: string) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
  getInfo: () => apiRequest("/auth/info"),
}

// USUARIOS
export const usuariosAPI = {
  getAll: () => apiRequest("/usuarios"),
  getById: (id: number) => apiRequest(`/usuarios/${id}`),
  getByUsername: (username: string) => apiRequest(`/usuarios/username/${username}`),
  getByEmail: (email: string) => apiRequest(`/usuarios/email/${email}`),
  getByDui: (dui: string) => apiRequest(`/usuarios/dui/${dui}`),
  getByRol: (rolNombre: string) => apiRequest(`/usuarios/rol/${rolNombre}`),
  getBySucursal: (sucursalId: number) => apiRequest(`/usuarios/sucursal/${sucursalId}`),
  create: (data: any) => apiRequest("/usuarios", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiRequest(`/usuarios/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  changeStatus: (id: number, estado: string) =>
    apiRequest(`/usuarios/${id}/estado`, { method: "PUT", body: JSON.stringify({ estado }) }),
  delete: (id: number) => apiRequest(`/usuarios/${id}`, { method: "DELETE" }),
}

// CUENTAS
export const cuentasAPI = {
  getAll: () => apiRequest("/cuentas"),
  getById: (id: number) => apiRequest(`/cuentas/${id}`),
  getByNumero: (numeroCuenta: string) => apiRequest(`/cuentas/numero/${numeroCuenta}`),
  getByCliente: (clienteId: number) => apiRequest(`/cuentas/cliente/${clienteId}`),
  getBySucursal: (sucursalId: number) => apiRequest(`/cuentas/sucursal/${sucursalId}`),
  getByDui: (dui: string) => apiRequest(`/cuentas/dui/${dui}`),
  create: (data: any) => apiRequest("/cuentas", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiRequest(`/cuentas/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  changeStatus: (id: number, estado: string) =>
    apiRequest(`/cuentas/${id}/estado`, { method: "PUT", body: JSON.stringify({ estado }) }),
  delete: (id: number) => apiRequest(`/cuentas/${id}`, { method: "DELETE" }),
}

// OPERACIONES
export const operacionesAPI = {
  getCuentasByDui: (dui: string) => apiRequest(`/operaciones/cuentas/${dui}`),
  abonarEfectivo: (numeroCuenta: string, monto: number) =>
    apiRequest("/operaciones/abonarefectivo", {
      method: "POST",
      body: JSON.stringify({ numeroCuenta, monto }),
    }),
  retirarEfectivo: (numeroCuenta: string, monto: number) =>
    apiRequest("/operaciones/retirarefectivo", {
      method: "POST",
      body: JSON.stringify({ numeroCuenta, monto }),
    }),
  consultarSaldo: (numeroCuenta: string) => apiRequest(`/operaciones/saldo/${numeroCuenta}`),
}

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
    fecha: string
  }) => apiRequest("/transacciones/deposito", { method: "POST", body: JSON.stringify(data) }),
  retiro: (data: {
    cuentaId: number
    monto: number
    cajeroId: number
    sucursalId: number
    descripcion: string
    fecha: string
  }) => apiRequest("/transacciones/retiro", { method: "POST", body: JSON.stringify(data) }),
  transferencia: (data: {
    cuentaOrigenId: number
    cuentaDestinoId: number
    monto: number
    cajeroId: number
    sucursalId: number
    descripcion: string
    fecha: string
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
export const sucursalesAPI = {
  getAll: () => apiRequest("/sucursales"),
  getById: (id: number) => apiRequest(`/sucursales/${id}`),
  getByCodigo: (codigo: string) => apiRequest(`/sucursales/codigo/${codigo}`),
  getByEstado: (estado: string) => apiRequest(`/sucursales/estado/${estado}`),
  getByTipo: (tipo: string) => apiRequest(`/sucursales/tipo/${tipo}`),
  getByDepartamento: (departamento: string) => apiRequest(`/sucursales/departamento/${departamento}`),
  create: (data: any) => apiRequest("/sucursales", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiRequest(`/sucursales/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number) => apiRequest(`/sucursales/${id}`, { method: "DELETE" }),
}

// TIPOS DE CUENTA
export const tiposCuentaAPI = {
  getAll: () => apiRequest("/tipos-cuenta"),
  getById: (id: number) => apiRequest(`/tipos-cuenta/${id}`),
  getByNombre: (nombre: string) => apiRequest(`/tipos-cuenta/nombre/${nombre}`),
  create: (data: any) => apiRequest("/tipos-cuenta", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiRequest(`/tipos-cuenta/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number) => apiRequest(`/tipos-cuenta/${id}`, { method: "DELETE" }),
}

// TIPOS DE TRANSACCIÓN
export const tiposTransaccionAPI = {
  getAll: () => apiRequest("/tipos-transaccion"),
  getById: (id: number) => apiRequest(`/tipos-transaccion/${id}`),
  getByNombre: (nombre: string) => apiRequest(`/tipos-transaccion/nombre/${nombre}`),
  create: (data: any) => apiRequest("/tipos-transaccion", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: any) =>
    apiRequest(`/tipos-transaccion/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number) => apiRequest(`/tipos-transaccion/${id}`, { method: "DELETE" }),
}

// TIPOS DE PRÉSTAMO
export const tiposPrestamoAPI = {
  getAll: () => apiRequest("/tipos-prestamo"),
  getById: (id: number) => apiRequest(`/tipos-prestamo/${id}`),
  getByNombre: (nombre: string) => apiRequest(`/tipos-prestamo/nombre/${nombre}`),
  getByGarantia: (requiere: boolean) => apiRequest(`/tipos-prestamo/garantia/${requiere}`),
  create: (data: any) => apiRequest("/tipos-prestamo", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiRequest(`/tipos-prestamo/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number) => apiRequest(`/tipos-prestamo/${id}`, { method: "DELETE" }),
}

// SISTEMA
export const sistemaAPI = {
  getInfo: () => apiRequest("/"),
  getHealth: () => apiRequest("/health"),
}

// VALIDACIÓN
export const validacionAPI = {
  checkInteger: (value: string) => apiRequest(`/validation/check-integer/${value}`),
  checkDecimal: (value: string) => apiRequest(`/validation/check-decimal/${value}`),
}

// DOCUMENTACIÓN
export const documentacionAPI = {
  getSwaggerUI: () => `${API_BASE_URL}/swagger-ui.html`,
  getApiDocs: () => apiRequest("/api-docs"),
}
