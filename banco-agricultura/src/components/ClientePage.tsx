"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import "./style/ClientePage.css"

const ClientePage: React.FC = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate("/login")
  }

  return (
    <div className="cliente-container">
      <header className="cliente-header">
        <div className="cliente-logo-container">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="cliente-logo" />
        </div>
        <button className="cliente-avatar-button" onClick={handleLogout}>
          <img src="/assets/Usuario.png" alt="Cliente" className="cliente-avatar-image" />
        </button>
      </header>

      <main className="cliente-main">
        <h1 className="cliente-title">Bienvenido, estimado cliente</h1>

        <div className="cliente-content">
          <div className="cliente-image-container">
            <img src="/assets/customer-service.png" alt="Atención al cliente" className="cliente-image" />
          </div>

          <div className="cliente-info-container">
            <h2 className="cliente-info-title">En AgroBanco Salvadoreño, ofrecemos soluciones financieras diseñadas para el sector agrícola.
              Nuestra plataforma te permite:</h2>
            <ul className="cliente-info-list">
              <li className="cliente-info-item">✓ Solicitar créditos agrícolas para financiar cultivos, maquinaria y crecimiento de tu negocio.</li>
              <li className="cliente-info-item">✓ Abrir y administrar cuentas diseñadas para productores y emprendedores del campo.</li>
              <li className="cliente-info-item">✓ Realizar transferencias y pagos de forma rápida y segura.</li>
              <li className="cliente-info-item">✓ Consultar estados de cuenta y gestionar tus finanzas en cualquier momento.</li>
              <li className="cliente-info-item">✓ Acceder a programas de apoyo y subsidios exclusivos para el sector agropecuario.</li>
              <h2 className="cliente-info-title">Crecemos contigo y con el campo. ¡Impulsa tu producción con nosotros!</h2>
            </ul>
          </div>
        </div>

        <div className="cliente-button-container">
          <button className="cliente-continue-button" onClick={() => navigate("/cliente-dashboard")}>
            Continuar
          </button>
        </div>
      </main>
    </div>
  )
}

export default ClientePage
