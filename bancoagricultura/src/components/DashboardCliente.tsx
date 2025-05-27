"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./style/DashboardCliente.css"

// Define una interfaz para el tipo de cuenta
interface Account {
  number: string
  balance: string
}

const DashboardCliente: React.FC = () => {
  const navigate = useNavigate()
  const [menuVisible, setMenuVisible] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [modalVisible, setModalVisible] = useState(false)

  const handleLogout = () => {
    navigate("/login")
  }

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }

  const handleDetailsClick = (account: Account) => {
    setSelectedAccount(account)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
  }

  // Define el array de cuentas con el tipo Account
  const accounts: Account[] = [
    { number: "652732736823", balance: "75.45 US" },
    { number: "657687676666", balance: "232.00 US" },
  ]

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
              <button className="clienteMenuItem" onClick={() => handleNavigate("/perfil-cliente")}>Perfil</button>
              <button className="clienteMenuItem" onClick={() => handleNavigate("/configuracion-cliente")}>Configuración</button>
              <button className="clienteMenuItem" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </header>

      <main className="clienteDashboardMain">
        <h2 className="clienteInfoTitle">Informacion Usuario</h2>
        <div className="clienteInfoContainer">
          <div className="clienteAccountsContainer">
            {accounts.map((account, index) => (
              <div key={index} className="clienteAccountBox">
                <p>Número de cuenta: {account.number}</p>
                <p>{account.balance}</p>
                <button className="clienteDetailsButton" onClick={() => handleDetailsClick(account)}>Detalles</button>
              </div>
            ))}
          </div>
          <div className="clienteProfileContainer">
            <img src="/assets/usuario.png" alt="Usuario" className="clienteProfileImage" />
            <h3>JOSÉ ALEXANDER RAMOS HERNÁNDEZ</h3>
            <p>TIPO DE CUENTA: PRESTAMISTA</p>
            <p>ID. DE CLIENTE: 15093293JR</p>
            <p>PROFESIÓN: AGRICULTOR</p>
            <p>CUENTAS EN POSESIÓN: 2</p>
          </div>
        </div>
        <div className="clienteActionsContainer">
          <button className="clienteActionButton" onClick={() => handleNavigate("/nueva-cuenta-cliente")}>
            <img src="/assets/movimiento.png" alt="Crear Otra Cuenta" className="clienteActionIcon" />
            <span>CREAR OTRA CUENTA</span>
          </button>
          <button className="clienteActionButton" onClick={() => handleNavigate("/historial-transacciones")}>
            <img src="/assets/historial.png" alt="Historial de Transacciones" className="clienteActionIcon" />
            <span>HISTORIAL DE TRANSACCIONES</span>
          </button>
        </div>
      </main>

      {modalVisible && (
        <div className="clienteModalOverlay">
          <div className="clienteModalContent">
            <button className="clienteModalCloseButton" onClick={closeModal}>×</button>
            <h2>Detalles de la Cuenta</h2>
            {selectedAccount && (
              <>
                <p><strong>Número de Cuenta:</strong> {selectedAccount.number}</p>
                <p><strong>Saldo:</strong> {selectedAccount.balance}</p>
                {/* Aquí puedes agregar más detalles de la cuenta */}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardCliente
