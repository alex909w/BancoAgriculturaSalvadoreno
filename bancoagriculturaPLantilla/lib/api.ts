const API_BASE_URL = "http://localhost:8080"

// Tipos de datos
export interface LoginRequest {
  usuario: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message: string
  idUsuario: number
  usuario: string
  tipoUsuario: "EMPLEADO" | "CLIENTE" | "DEPENDIENTE"
  permisos: object
  datos_especificos: object
}

export interface Cliente {
  idCliente?: number
  nombres: string
  apellidos: string
  dui: string
  direccion: string
  telefono: string
  lugarTrabajo: string
  salario: number
}

export interface Cuenta {
  idCuenta?: number
  cliente: {
    idCliente: number
  }
  numeroCuenta: string
  saldo: number
}

export interface Movimiento {
  idCuenta: number
  monto: number
}

export interface Transferencia {
  cuentaOrigen: number
  cuentaDestino: number
  monto: number
}

export interface Prestamo {
  idCliente: number
  montoPrestamo: number
  tasaInteres: number
  plazoMeses: number
}

// Clase para manejar las llamadas a la API
class ApiService {
  private baseUrl = API_BASE_URL

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  // Autenticación
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>("/api/usuarios/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }

  async cambiarPassword(id: number, currentPassword: string, newPassword: string): Promise<any> {
    return this.request(`/api/usuarios/${id}/password`, {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    })
  }

  async getTiposUsuario(): Promise<any> {
    return this.request("/api/usuarios/tipos")
  }

  // Usuarios
  async getUsuarios(): Promise<any[]> {
    return this.request("/api/usuarios")
  }

  async getUsuario(id: number): Promise<any> {
    return this.request(`/api/usuarios/${id}`)
  }

  async crearUsuario(usuario: { usuario: string; password: string }): Promise<any> {
    return this.request("/api/usuarios", {
      method: "POST",
      body: JSON.stringify(usuario),
    })
  }

  // Clientes
  async getClientes(): Promise<Cliente[]> {
    return this.request("/api/clientes")
  }

  async getCliente(id: number): Promise<Cliente> {
    return this.request(`/api/clientes/${id}`)
  }

  async getClientePorDui(dui: string): Promise<Cliente> {
    return this.request(`/api/clientes/dui/${dui}`)
  }

  async crearCliente(cliente: Cliente): Promise<Cliente> {
    return this.request("/api/clientes", {
      method: "POST",
      body: JSON.stringify(cliente),
    })
  }

  async actualizarCliente(id: number, cliente: Cliente): Promise<Cliente> {
    return this.request(`/api/clientes/${id}`, {
      method: "PUT",
      body: JSON.stringify(cliente),
    })
  }

  async eliminarCliente(id: number): Promise<void> {
    return this.request(`/api/clientes/${id}`, {
      method: "DELETE",
    })
  }

  // Cuentas
  async getCuentas(): Promise<Cuenta[]> {
    return this.request("/api/cuentas")
  }

  async getCuenta(id: number): Promise<Cuenta> {
    return this.request(`/api/cuentas/${id}`)
  }

  async getCuentaPorNumero(numeroCuenta: string): Promise<Cuenta> {
    return this.request(`/api/cuentas/numero/${numeroCuenta}`)
  }

  async getCuentasPorCliente(idCliente: number): Promise<Cuenta[]> {
    return this.request(`/api/cuentas/cliente/${idCliente}`)
  }

  async crearCuenta(cuenta: Cuenta): Promise<Cuenta> {
    return this.request("/api/cuentas", {
      method: "POST",
      body: JSON.stringify(cuenta),
    })
  }

  async actualizarCuenta(id: number, cuenta: Cuenta): Promise<Cuenta> {
    return this.request(`/api/cuentas/${id}`, {
      method: "PUT",
      body: JSON.stringify(cuenta),
    })
  }

  async eliminarCuenta(id: number): Promise<void> {
    return this.request(`/api/cuentas/${id}`, {
      method: "DELETE",
    })
  }

  // Movimientos
  async deposito(movimiento: Movimiento): Promise<any> {
    return this.request("/api/movimientos/deposito", {
      method: "POST",
      body: JSON.stringify(movimiento),
    })
  }

  async retiro(movimiento: Movimiento): Promise<any> {
    return this.request("/api/movimientos/retiro", {
      method: "POST",
      body: JSON.stringify(movimiento),
    })
  }

  async transferencia(transferencia: Transferencia): Promise<any> {
    return this.request("/api/movimientos/transferencia", {
      method: "POST",
      body: JSON.stringify(transferencia),
    })
  }

  async getHistorialCuenta(idCuenta: number): Promise<any[]> {
    return this.request(`/api/movimientos/cuenta/${idCuenta}`)
  }

  // Préstamos
  async getPrestamos(): Promise<any[]> {
    return this.request("/api/prestamos")
  }

  async getPrestamosPorCliente(idCliente: number): Promise<any[]> {
    return this.request(`/api/prestamos/cliente/${idCliente}`)
  }

  async solicitarPrestamo(prestamo: Prestamo): Promise<any> {
    return this.request("/api/prestamos", {
      method: "POST",
      body: JSON.stringify(prestamo),
    })
  }

  async aprobarPrestamo(id: number): Promise<any> {
    return this.request(`/api/prestamos/${id}/aprobar`, {
      method: "PUT",
    })
  }

  async rechazarPrestamo(id: number): Promise<any> {
    return this.request(`/api/prestamos/${id}/rechazar`, {
      method: "PUT",
    })
  }

  // Sistema
  async getEstado(): Promise<any> {
    return this.request("/")
  }

  async getSalud(): Promise<any> {
    return this.request("/health")
  }

  async test(): Promise<any> {
    return this.request("/api/usuarios/test")
  }
}

export const apiService = new ApiService()
