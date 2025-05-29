"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { verifyToken, type UserData } from "@/lib/auth"

interface AuthContextType {
  user: UserData | null
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => void
  setUser: (user: UserData) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  logout: () => {},
  setUser: () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadUserFromLocalStorage() {
      setIsLoading(true)

      try {
        // Verificar si hay un token almacenado
        const token = localStorage.getItem("authToken")

        if (!token) {
          setIsLoading(false)
          return
        }

        // Verificar si el token es válido
        const isValid = await verifyToken(token)

        if (!isValid) {
          localStorage.removeItem("authToken")
          localStorage.removeItem("userData")
          setIsLoading(false)
          return
        }

        // Cargar datos del usuario desde localStorage
        const userDataStr = localStorage.getItem("userData")

        if (userDataStr) {
          const userData = JSON.parse(userDataStr) as UserData
          setUser(userData)
        }
      } catch (error) {
        console.error("Error al cargar la sesión:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserFromLocalStorage()
  }, [])

  const logout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userData")
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
