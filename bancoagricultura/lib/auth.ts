// Tipos para la autenticación
export interface AuthResponse {
  token: string
  refreshToken?: string
  expiresIn?: number
}

export interface UserData {
  id: number
  username: string
  nombreCompleto: string
  email: string
  rol: {
    id: number
    nombre: string
  }
  sucursal?: {
    id: number
    nombre: string
  }
  estado: string
}

// Función para autenticar al usuario
export async function authenticateUser(username: string, password: string): Promise<AuthResponse> {
  const response = await fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Credenciales inválidas")
    } else {
      throw new Error("Error en el servidor. Intente nuevamente más tarde.")
    }
  }

  return await response.json()
}

// Función para obtener datos del usuario
export async function getUserData(username: string, token: string): Promise<UserData> {
  const response = await fetch(`http://localhost:8080/api/usuarios/username/${username}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Error al obtener información del usuario")
  }

  return await response.json()
}

// Función para verificar si el token es válido
export async function verifyToken(token: string): Promise<boolean> {
  try {
    const response = await fetch("http://localhost:8080/api/auth/info", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.ok
  } catch (error) {
    return false
  }
}

// Función para cerrar sesión
export function logout() {
  localStorage.removeItem("authToken")
  localStorage.removeItem("userData")
}
