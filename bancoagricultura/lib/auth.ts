import { apiService, type LoginResponse } from "./api"

export interface User {
  idUsuario: number
  usuario: string
  tipoUsuario: "EMPLEADO" | "CLIENTE" | "DEPENDIENTE"
  permisos: object
  datos_especificos: object
}

class AuthService {
  private currentUser: User | null = null

  async login(usuario: string, password: string): Promise<LoginResponse> {
    try {
      const response = await apiService.login({ usuario, password })

      if (response.success) {
        this.currentUser = {
          idUsuario: response.idUsuario,
          usuario: response.usuario,
          tipoUsuario: response.tipoUsuario,
          permisos: response.permisos,
          datos_especificos: response.datos_especificos,
        }

        // Guardar en localStorage
        localStorage.setItem("user", JSON.stringify(this.currentUser))
        localStorage.setItem("isAuthenticated", "true")
      }

      return response
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  logout(): void {
    this.currentUser = null
    localStorage.removeItem("user")
    localStorage.removeItem("isAuthenticated")
  }

  getCurrentUser(): User | null {
    if (!this.currentUser) {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser)
      }
    }
    return this.currentUser
  }

  isAuthenticated(): boolean {
    return localStorage.getItem("isAuthenticated") === "true"
  }

  getUserType(): string | null {
    const user = this.getCurrentUser()
    return user ? user.tipoUsuario : null
  }

  async cambiarPassword(currentPassword: string, newPassword: string): Promise<void> {
    const user = this.getCurrentUser()
    if (!user) {
      throw new Error("Usuario no autenticado")
    }

    await apiService.cambiarPassword(user.idUsuario, currentPassword, newPassword)
  }
}

export const authService = new AuthService()
