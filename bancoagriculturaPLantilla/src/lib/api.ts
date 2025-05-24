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
  private isDevelopment = process.env.NODE_ENV === "development"

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
        // En desarrollo, simular respuestas para ciertos endpoints
        if (this.isDevelopment && endpoint === "/api/usuarios/login") {
          return this.simulateLoginResponse(options.body as string) as T
        }

        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("API request failed:", error)

      // En desarrollo, proporcionar respuestas simuladas para endpoints críticos
      if (this.isDevelopment) {
        return this.handleDevelopmentFallback<T>(endpoint, options)
      }

      throw error
    }
  }

  private simulateLoginResponse(body: string): LoginResponse {
    try {
      const credentials = JSON.parse(body)
      const { usuario, password } = credentials

      // Simular diferentes tipos de usuarios
      if (usuario === "gerente" && password === "admin") {
        return {
          success: true,
          message: "Login exitoso",
          idUsuario: 1,
          usuario: "gerente",
          tipoUsuario: "EMPLEADO",
          permisos: { esGerente: true },
          datos_especificos: { idEmpleado: 1, sucursal: "Principal" },
        }
      } else if (usuario === "cajero" && password === "admin") {
        return {
          success: true,
          message: "Login exitoso",
          idUsuario: 2,
          usuario: "cajero",
          tipoUsuario: "EMPLEADO",
          permisos: { esCajero: true },
          datos_especificos: { idEmpleado: 2, sucursal: "Principal" },
        }
      } else if (usuario === "cliente" && password === "admin") {
        return {
          success: true,
          message: "Login exitoso",
          idUsuario: 3,
          usuario: "cliente",
          tipoUsuario: "CLIENTE",
          permisos: {},
          datos_especificos: { idCliente: 1 },
        }
      } else {
        return {
          success: false,
          message: "Credenciales inválidas",
          idUsuario: 0,
          usuario: "",
          tipoUsuario: "CLIENTE",
          permisos: {},
          datos_especificos: {},
        }
      }
    } catch {
      return {
        success: false,
        message: "Error en el formato de datos",
        idUsuario: 0,
        usuario: "",
        tipoUsuario: "CLIENTE",
        permisos: {},
        datos_especificos: {},
      }
    }
  }

  private handleDevelopmentFallback<T>(endpoint: string, options: RequestInit): T {
    console.warn(`🔧 Modo desarrollo: Simulando respuesta para ${endpoint}`)

    // Simular respuestas para diferentes endpoints
    switch (endpoint) {
      case "/api/clientes":
        if (options.method === "GET") {
          return [
            {
              idCliente: 1,
              nombres: "Juan Carlos",
              apellidos: "Pérez García",
              dui: "12345678-9",
              direccion: "San Salvador, El Salvador",
              telefono: "7890-1234",
              lugarTrabajo: "Agricultor Independiente",
              salario: 800.0,
            },
          ] as T
        }
        break

      case "/api/cuentas":
        if (options.method === "GET") {
          return [
            {
              idCuenta: 1,
              cliente: { idCliente: 1 },
              numeroCuenta: "001234567890",
              saldo: 1500.0,
            },
          ] as T
        }
        break

      default:
        if (endpoint.includes("/api/cuentas/cliente/")) {
          return [
            {
              idCuenta: 1,
              cliente: { idCliente: 1 },
              numeroCuenta: "001234567890",
              saldo: 1500.0,
            },
          ] as T
        }

        if (endpoint.includes("/api/clientes/")) {
          return {
            idCliente: 1,
            nombres: "Juan Carlos",
            apellidos: "Pérez García",
            dui: "12345678-9",
            direccion: "San Salvador, El Salvador",
            telefono: "7890-1234",
            lugarTrabajo: "Agricultor Independiente",
            salario: 800.0,
          } as T
        }

        if (endpoint.includes("/api/movimientos/cuenta/")) {
          return [
            {
              id: 1,
              fecha: new Date().toISOString(),
              tipo: "DEPOSITO",
              monto: 500.0,
              descripcion: "Depósito inicial",
              saldoAnterior: 1000.0,
              saldoNuevo: 1500.0,
            },
          ] as T
        }

        return {} as T
    }

    return {} as T
  }

  // Resto de métodos permanecen igual...
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
