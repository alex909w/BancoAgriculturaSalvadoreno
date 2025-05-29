// Tipos para el sistema de préstamos

export interface Cliente {
  id: number
  nombreCompleto: string
  dui?: string
  email?: string
  telefono?: string
  direccion?: string
}

export interface TipoPrestamo {
  id: number
  nombre: string
  descripcion?: string
  tasaInteres: number
  montoMinimo: number
  montoMaximo: number
  plazoMinimo: number
  plazoMaximo: number
  requiereGarantia: boolean
}

export interface Cuenta {
  id: number
  numeroCuenta: string
  saldo: number
  estado: string
}

export interface Prestamo {
  id: number
  numeroPrestamo: string
  cliente: Cliente
  tipoPrestamo: TipoPrestamo
  cuentaVinculada: Cuenta
  montoSolicitado: number
  montoAprobado?: number
  tasaInteres: number
  plazoMeses: number
  cuotaMensual?: number
  proposito: string
  estado: 'solicitado' | 'aprobado' | 'desembolsado' | 'rechazado'
  fechaSolicitud: string
  fechaAprobacion?: string
  fechaDesembolso?: string
  observaciones?: string
  gerenteAprobador?: {
    id: number
    nombre: string
  }
  cajeroDesembolso?: {
    id: number
    nombre: string
  }
}

export interface FormDataPrestamo {
  clienteId: string
  clienteDui: string
  clienteNombre: string
  tipoPrestamo: string
  cuentaVinculada: string
  montoPrestamo: string
  plazo: string
  proposito: string
  garantia: string
  ingresosMensuales: string
  gastosPromedios: string
}

export interface PrestamoResponse {
  prestamo: Prestamo
  cuotaMensual: number
  montoTotal: number
  interesTotal: number
}