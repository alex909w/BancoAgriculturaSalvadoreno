import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import SplashDesign from "./components/SplashDesign"
import LoginForm from "./components/LoginForm"
import RegisterForm from "./components/RegisterForm"
import CajeroPage from "./components/CajeroPage"
import ClientePage from "./components/ClientePage"
import GerentePage from "./components/GerentePage"
import AdminPage from "./components/AdminPage"
import DashboardGerente from "./components/DashboardGerente"
import DashboardCajero from "./components/DashboardCajero"
import DashboardCliente from "./components/DashboardCliente"
import DashboardAdmin from "./components/DashboardAdmin"
import GerentePerfil from "./components/GerentePerfil"
import CajeroPerfil from "./components/CajeroPerfil"
import ClientePerfil from "./components/ClientePerfil"
import AdminPerfil from "./components/AdminPerfil"
import GerenteConfiguracion from "./components/GerenteConfiguracion"
import CajeroConfiguracion from "./components/CajeroConfiguracion"
import ClienteConfiguracion from "./components/ClienteConfiguracion"
import AdminConfiguracion from "./components/AdminConfiguracion"
import CrearCliente from "./components/CrearCliente"
import Prestamos from "./components/Prestamos"
import Transaccion from "./components/Transaccion"
import Solicitudes from "./components/Soliciitudes"
import Movimientos from "./components/Movimientos"
import NuevaSucursal from "./components/NuevaSucursal"
import NuevaCuentaCliente from "./components/NuevaCuentaCliente"
import HistorialTransacciones from "./components/HistorialTransacciones"
import ResumenUsuarios from "./components/ResumenUsuarios"
import GestionCuentas from "./components/GestionCuentas"
import TransaccionesRecientes from "./components/TransaccionesRecientes"
import ReportesEstadisticas from "./components/ReportesEstadisticas"
import ConfiguracionSistema from "./components/ConfiguracionSistema"
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
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/dashboard-gerente" element={<DashboardGerente />} />
        <Route path="/dashboard-cajero" element={<DashboardCajero />} />
        <Route path="/dashboard-cliente" element={<DashboardCliente />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
        <Route path="/perfil-gerente" element={<GerentePerfil />} />
        <Route path="/perfil-cajero" element={<CajeroPerfil />} />
        <Route path="/perfil-cliente" element={<ClientePerfil />} />
        <Route path="/perfil-admin" element={<AdminPerfil />} />
        <Route path="/configuracion-gerente" element={<GerenteConfiguracion/>} />
        <Route path="/configuracion-cajero" element={<CajeroConfiguracion />} />
        <Route path="/configuracion-cliente" element={<ClienteConfiguracion />} />
        <Route path="/configuracion-admin" element={<AdminConfiguracion />} />
        <Route path="/crear-cliente" element={<CrearCliente />} />
        <Route path="/prestamos" element={<Prestamos />} />
        <Route path="/transaccion" element={<Transaccion />} />
        <Route path="/solicitudes" element={<Solicitudes />} />
        <Route path="/movimientos" element={<Movimientos />} />
        <Route path="/nueva-sucursal" element={<NuevaSucursal />} />
        <Route path="/nueva-cuenta-cliente" element={<NuevaCuentaCliente />} />
        <Route path="/historial-transacciones" element={<HistorialTransacciones />} />
        <Route path="/resumen-usuarios" element={<ResumenUsuarios />} />
        <Route path="/gestion-cuentas" element={<GestionCuentas />} />
        <Route path="/transacciones-recientes" element={<TransaccionesRecientes />} />
        <Route path="/reportes-estadisticas" element={<ReportesEstadisticas />} />
        <Route path="/configuracion-sistema" element={<ConfiguracionSistema />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
