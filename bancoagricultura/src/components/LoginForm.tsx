"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./style/LoginForm.css"

const LoginForm: React.FC = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Validación simple
    if (!username || !password) {
      setError("Por favor complete todos los campos")
      return
    }

    // En una aplicación real, aquí iría la autenticación
    navigate("/usuario")
  }

  const handleRegister = () => {
    // Redirigir a la página de registro
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

            <form onSubmit={handleLogin} className="login-form">
              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <input
                  type="text"
                  placeholder="Nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                />
              </div>

              <button type="submit" className="form-button">
                Siguiente
              </button>
            </form>

            <div className="register-section">
              <p className="register-text">¿No tienes cuenta con nosotros?</p>
              <button onClick={handleRegister} className="register-button">
                Regístrate
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LoginForm
