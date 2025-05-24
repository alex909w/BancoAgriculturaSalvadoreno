"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../lib/auth"
import { apiService, type Cuenta } from "../lib/api"
import "./style/DashboardCliente.css"

const DashboardCliente: React.FC = () => {
  const navigate = useNavigate()
  const [menuVisible, setMenuVisible] = useState(false)
  const [cuentas, setCuentas] = useState<Cuenta[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [clienteInfo, setClienteInfo] = useState<any>(null)

  const user = authService.getCurrentUser()

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login")
      return
    }
    loadData()
  }, [navigate])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const user = authService.getCurrentUser()
      if (
        user?.datos_especificos &&
        typeof user.datos_especificos === "object" &&
        "idCliente" in user.datos_especificos
      ) {
        const idCliente = (user.datos_especificos as any).idCliente

        // Cargar cuentas del cliente
        const cuentasData = await apiService.getCuentasPorCliente(idCliente)
        setCuentas(cuentasData)

        // Cargar información del cliente
        const clienteData = await apiService.getCliente(idCliente)
        setClienteInfo(clienteData)
      }
    } catch (error) {
      console.error("Error cargando datos:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    authService.logout()
    navigate("/login")
  }

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="clienteDashboardContainer">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <p>Cargando información...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="clienteDashboardContainer">
      <header className="clienteDashboardHeader">
        <div className="clienteLogoContainer">
          <img src="/assets/logo-login.png" alt="AgroBanco Salvadoreño Logo" className="clienteLogo" />
        </div>
        <h1 className="clienteDashboardTitle">Panel de Clientes</h1>
        <div className="clienteUserMenu">
          <button className="clienteAvatar" onClick={toggleMenu}>
            <img src="/assets/Usuario.png" alt="Usuario" className="clienteAvatarImage" />
          </button>
          {menuVisible && (
            <div className="clienteMenuDropdown">
              <button className="clienteMenuItem" onClick={() => handleNavigate("/perfil-cliente")}>
                Perfil
              </button>
              <button className="clienteMenuItem" onClick={() => handleNavigate("/configuracion-cliente")}>
                Configuración
              </button>
              <button className="clienteMenuItem" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="clienteDashboardMain">
        <h2 className="clienteInfoTitle">Informacion Usuario</h2>
        <div className="clienteInfoContainer">
          <div className="clienteAccountsContainer">
            {cuentas.length === 0 ? (
              <div className="clienteAccountBox">
                <p>No tienes cuentas registradas</p>
                <button className="clienteDetailsButton" onClick={() => handleNavigate("/crear-cuenta")}>
                  Crear Primera Cuenta
                </button>
              </div>
            ) : (
              cuentas.map((cuenta) => (
                <div key={cuenta.idCuenta} className="clienteAccountBox">
                  <p>Número de cuenta: {cuenta.numeroCuenta}</p>
                  <p>{formatCurrency(cuenta.saldo)}</p>
                  <button
                    className="clienteDetailsButton"
                    onClick={() => handleNavigate(`/cuenta/${cuenta.idCuenta}/detalles`)}
                  >
                    Detalles
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="clienteProfileContainer">
            <img src="/assets/usuario.png" alt="Usuario" className="clienteProfileImage" />
            <h3>{clienteInfo ? `${clienteInfo.nombres} ${clienteInfo.apellidos}` : user?.usuario || "Usuario"}</h3>
            <p>TIPO DE CUENTA: {user?.tipoUsuario}</p>
            <p>ID. DE CLIENTE: {user?.idUsuario}</p>
            <p>PROFESIÓN: {clienteInfo?.lugarTrabajo || "No especificado"}</p>
            <p>CUENTAS EN POSESIÓN: {cuentas.length}</p>
          </div>
        </div>
        <div className="clienteActionsContainer">
          <button className="clienteActionButton" onClick={() => handleNavigate("/crear-cuenta")}>
            <img src="/assets/movimiento.png" alt="Crear Otra Cuenta" className="clienteActionIcon" />
            <span>CREAR OTRA CUENTA</span>
          </button>
          <button className="clienteActionButton" onClick={() => handleNavigate("/historial-transacciones")}>
            <img src="/assets/historial.png" alt="Historial de Transacciones" className="clienteActionIcon" />
            <span>HISTORIAL DE TRANSACCIONES</span>
          </button>
          <button className="clienteRegisterButton" onClick={() => handleNavigate("/cliente")}>
            <span>REGRESAR</span>
          </button>
        </div>
      </main>
    </div>
  )
}

export default DashboardCliente
