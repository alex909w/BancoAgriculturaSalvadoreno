import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
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
import "./App.css"

function App() {
  return (
    <Router>
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
