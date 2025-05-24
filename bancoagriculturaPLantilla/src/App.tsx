"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useEffect } from "react"
import SplashDesign from "./components/SplashDesign"
import LoginForm from "./components/LoginForm"
import RegisterForm from "./components/RegisterForm"
import CajeroPage from "./components/CajeroPage"
import ClientePage from "./components/ClientePage"
import GerentePage from "./components/GerentePage"
import DashboardGerente from "./components/DashboardGerente"
import DashboardCajero from "./components/DashboardCajero"
import DashboardCliente from "./components/DashboardCliente"
import ConfiguracionGerente from "./components/ConfiguracionGerente"
import GerentePerfil from "./components/GerentePerfil"
import CajeroPerfil from "./components/CajeroPerfil"
import CajeroConfiguracion from "./components/CajeroConfiguracion"
import ClienteConfiguracion from "./components/ClienteConfiguracion"
import ClientePerfil from "./components/ClientePerfil"
import CrearCuenta from "./components/CrearCuenta"
import HistorialTransacciones from "./components/HistorialTransacciones"
import RegistroCliente from "./components/RegistroCliente"
import Transacciones from "./components/Transacciones"
import Prestamos from "./components/Prestamos"
import "./App.css"

function App() {
  useEffect(() => {
    // Verificar si estamos en el navegador y si la URL actual no es la raíz de la aplicación React
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname
      // Si estamos en /src pero la URL del navegador muestra otra ruta, actualizar la historia
      if (currentPath === "/src" && window.location.hash) {
        const hashPath = window.location.hash.substring(1)
        if (hashPath && hashPath !== "/") {
          window.history.replaceState(null, "", `/src${hashPath}`)
        }
      }
    }
  }, [])

  return (
    <Router basename="/src">
      <Routes>
        <Route path="/" element={<SplashDesign />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/cajero" element={<CajeroPage />} />
        <Route path="/cliente" element={<ClientePage />} />
        <Route path="/gerente" element={<GerentePage />} />
        <Route path="/dashboard-gerente" element={<DashboardGerente />} />
        <Route path="/dashboard-cajero" element={<DashboardCajero />} />
        <Route path="/dashboard-cliente" element={<DashboardCliente />} />
        <Route path="/configuracion-gerente" element={<ConfiguracionGerente />} />
        <Route path="/perfil-gerente" element={<GerentePerfil />} />
        <Route path="/perfil-cajero" element={<CajeroPerfil />} />
        <Route path="/configuracion-cajero" element={<CajeroConfiguracion />} />
        <Route path="/configuracion-cliente" element={<ClienteConfiguracion />} />
        <Route path="/perfil-cliente" element={<ClientePerfil />} />
        <Route path="/crear-cuenta" element={<CrearCuenta />} />
        <Route path="/historial-transacciones" element={<HistorialTransacciones />} />
        <Route path="/registro-cliente" element={<RegistroCliente />} />
        <Route path="/transaccion" element={<Transacciones />} />
        <Route path="/prestamos" element={<Prestamos />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
