"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../lib/auth"
import "./style/LoginForm.css"

const LoginForm: React.FC = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showDemoCredentials, setShowDemoCredentials] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Validación simple
    if (!username || !password) {
      setError("Por favor complete todos los campos")
      setIsLoading(false)
      return
    }

    try {
      const response = await authService.login(username, password)

      if (response.success) {
        // Redirigir según el tipo de usuario
        const userType = authService.getUserType()
        const user = authService.getCurrentUser()

        switch (userType) {
          case "EMPLEADO":
            // Verificar si es gerente o cajero basado en permisos
            if (user?.permisos && typeof user.permisos === "object" && "esGerente" in user.permisos) {
              navigate("/gerente")
            } else {
              navigate("/cajero")
            }
            break
          case "CLIENTE":
            navigate("/cliente")
            break
          case "DEPENDIENTE":
            navigate("/cliente")
            break
          default:
            navigate("/cliente")
        }
      } else {
        setError(response.message || "Credenciales inválidas")
      }
    } catch (error) {
      console.error("Error en login:", error)
      setError("Error de conexión. Usando modo de demostración.")
      setShowDemoCredentials(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = (demoUser: string, demoPass: string) => {
    setUsername(demoUser)
    setPassword(demoPass)
    setShowDemoCredentials(false)
  }

  const handleRegister = () => {
    navigate("/register")
  }

  return (
    <div className="login-container">
      <main className="login-main">
        <div className="login-content">
          <div className="login-left-section">
            <div className="logo-container-centered">
              <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="logo-centered" />
            </div>
            <div className="illustration-container">
              <img src="/assets/team-illustration.png" alt="Equipo de trabajo" className="team-illustration" />
            </div>
          </div>

          <div className="form-container">
            <h2 className="form-title">INICIA SESIÓN</h2>

            {showDemoCredentials && (
              <div
                style={{
                  backgroundColor: "#e3f2fd",
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  marginBottom: "1rem",
                  border: "1px solid #2196f3",
                }}
              >
                <h4 style={{ margin: "0 0 0.5rem 0", color: "#1976d2" }}>🔧 Modo Demostración</h4>
                <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>Usa estas credenciales de prueba:</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin("gerente", "admin")}
                    style={{
                      padding: "0.5rem",
                      backgroundColor: "#4caf50",
                      color: "white",
                      border: "none",
                      borderRadius: "0.25rem",
                      cursor: "pointer",
                    }}
                  >
                    👨‍💼 Gerente: gerente / admin
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin("cajero", "admin")}
                    style={{
                      padding: "0.5rem",
                      backgroundColor: "#2196f3",
                      color: "white",
                      border: "none",
                      borderRadius: "0.25rem",
                      cursor: "pointer",
                    }}
                  >
                    👨‍💻 Cajero: cajero / admin
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin("cliente", "admin")}
                    style={{
                      padding: "0.5rem",
                      backgroundColor: "#ff9800",
                      color: "white",
                      border: "none",
                      borderRadius: "0.25rem",
                      cursor: "pointer",
                    }}
                  >
                    👤 Cliente: cliente / admin
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="login-form">
              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <input
                  type="text"
                  placeholder="Nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input"
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  disabled={isLoading}
                />
              </div>

              <button type="submit" className="form-button" disabled={isLoading}>
                {isLoading ? "Iniciando sesión..." : "Siguiente"}
              </button>
            </form>

            <div className="register-section">
              <p className="register-text">¿No tienes cuenta con nosotros?</p>
              <button onClick={handleRegister} className="register-button" disabled={isLoading}>
                Regístrate
              </button>
            </div>

            {!showDemoCredentials && (
              <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setShowDemoCredentials(true)}
                  style={{
                    background: "none",
                    border: "1px solid #ccc",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.25rem",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  🔧 Mostrar credenciales de prueba
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default LoginForm
