// Ejemplo de cómo validar en el frontend antes de enviar a la API

/**
 * Valida y sanitiza valores antes de enviarlos a la API
 */
function sanitizeValue(value) {
  // Si el valor es undefined, null, o string 'undefined'
  if (value === undefined || value === null || value === "undefined") {
    return null
  }

  // Si es un string vacío
  if (typeof value === "string" && value.trim() === "") {
    return null
  }

  return value
}

/**
 * Valida si un valor es un ID válido
 */
function isValidId(id) {
  const sanitized = sanitizeValue(id)
  if (sanitized === null) return false

  const parsed = Number.parseInt(sanitized)
  return !isNaN(parsed) && parsed > 0
}

/**
 * Ejemplo de llamada a la API con validación
 */
async function getCuentasByCliente(clienteId) {
  // Validar antes de hacer la llamada
  if (!isValidId(clienteId)) {
    console.error("ID de cliente inválido:", clienteId)
    return {
      success: false,
      message: "El ID del cliente debe ser un número válido mayor que 0",
    }
  }

  try {
    const response = await fetch(`http://localhost:8080/api/cuentas/cliente/${clienteId}`)

    if (!response.ok) {
      const error = await response.json()
      console.error("Error de la API:", error)
      return error
    }

    return await response.json()
  } catch (error) {
    console.error("Error de red:", error)
    return {
      success: false,
      message: "Error de conexión con el servidor",
    }
  }
}

/**
 * Ejemplo de uso con manejo de errores
 */
async function ejemploDeUso() {
  // Caso 1: ID válido
  const cuentasValidas = await getCuentasByCliente(1)
  console.log("Cuentas válidas:", cuentasValidas)

  // Caso 2: ID undefined (será manejado)
  const cuentasUndefined = await getCuentasByCliente(undefined)
  console.log("Resultado con undefined:", cuentasUndefined)

  // Caso 3: ID string 'undefined' (será manejado)
  const cuentasStringUndefined = await getCuentasByCliente("undefined")
  console.log('Resultado con "undefined":', cuentasStringUndefined)
}

/**
 * Función helper para construir URLs con parámetros opcionales
 */
function buildApiUrl(baseUrl, params = {}) {
  const url = new URL(baseUrl)

  Object.entries(params).forEach(([key, value]) => {
    const sanitized = sanitizeValue(value)
    if (sanitized !== null) {
      url.searchParams.append(key, sanitized)
    }
  })

  return url.toString()
}

// Ejemplo de uso del helper
const apiUrl = buildApiUrl("http://localhost:8080/api/usuarios", {
  rol: "cajero",
  sucursal: undefined, // Este será ignorado
  estado: "activo",
})
console.log("URL construida:", apiUrl)
// Output: http://localhost:8080/api/usuarios?rol=cajero&estado=activo
