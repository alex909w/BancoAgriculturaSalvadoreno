"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./style/RegisterForm.css"

const RegisterForm: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "El nombre completo es requerido"
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El correo electrónico no es válido"
    }

    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es requerido"
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // En una aplicación real, aquí enviarías los datos al servidor
      alert("Registro exitoso. Ahora puedes iniciar sesión.")
      navigate("/login")
    }
  }

  const handleBackToLogin = () => {
    navigate("/login")
  }

  return (
    <div className="register-container">
      <main className="register-main">
        <div className="register-content">
          <div className="register-left-section">
            <div className="logo-container-centered">
              <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="logo-centered" />
            </div>
            <div className="register-image-container">
              <img src="/assets/Registrarse.png" alt="Registro" className="register-image" />
            </div>
          </div>

          <div className="register-form-container">
            <h2 className="register-title">CREAR CUENTA</h2>

            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`form-input ${errors.fullName ? "input-error" : ""}`}
                />
                {errors.fullName && <p className="error-text">{errors.fullName}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? "input-error" : ""}`}
                />
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Nombre de Usuario
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`form-input ${errors.username ? "input-error" : ""}`}
                />
                {errors.username && <p className="error-text">{errors.username}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? "input-error" : ""}`}
                />
                {errors.password && <p className="error-text">{errors.password}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-input ${errors.confirmPassword ? "input-error" : ""}`}
                />
                {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
              </div>

              <button type="submit" className="register-button">
                Registrarse
              </button>

              <div className="login-link">
                <p>¿Ya tienes una cuenta?</p>
                <button type="button" onClick={handleBackToLogin} className="back-to-login-button">
                  Iniciar Sesión
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default RegisterForm
