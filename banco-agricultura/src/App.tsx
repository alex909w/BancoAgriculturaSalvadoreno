import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import SplashDesign from "./components/SplashDesign"
import LoginForm from "./components/LoginForm"
import RegisterForm from "./components/RegisterForm"
import CajeroPage from "./components/CajeroPage"
import ClientePage from "./components/ClientePage"
import GerentePage from "./components/GerentePage"
import DashboardGerente from "./components/DashboardGerente"
import DashboardCajero from "./components/DashboardCajero"
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
        <Route path="/dashboardgerente" element={<DashboardGerente />} />
        <Route path="/dashboardcajero" element={<DashboardCajero />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
