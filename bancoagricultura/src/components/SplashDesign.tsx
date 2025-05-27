"use client"

import type React from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import LoadingDots from "./LoadingDots"
import "./style/SplashDesign.css"

const SplashDesign: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Simular tiempo de carga y luego redirigir a la página de login
    const timer = setTimeout(() => {
      navigate("/login")
    }, 3000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="splash-container">
      <div className="splash-content">
        <div className="logo-container">
          <img src="/assets/logo.png" alt="AgroBanco Salvadoreño Logo" className="logo" />
        </div>
        <p className="slogan">"Crecemos contigo desde la raíz"</p>
        <div className="loading-container">
          <h2 className="loading-text">CARGANDO</h2>
          <LoadingDots />
        </div>
      </div>
    </div>
  )
}

export default SplashDesign
