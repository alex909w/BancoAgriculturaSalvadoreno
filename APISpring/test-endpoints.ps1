# Script de Pruebas de Endpoints - Banco Agricultura Salvadoreño
# PowerShell script para probar los endpoints de la API

$baseUrl = "http://localhost:8081"

# Función para realizar peticiones HTTP
function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Url,
        [string]$Body = $null,
        [hashtable]$Headers = @{"Content-Type" = "application/json"}
    )
    
    try {
        Write-Host "🔍 Probando: $Method $Url" -ForegroundColor Cyan
        
        if ($Body) {
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Headers $Headers -Body $Body -ErrorAction Stop
        } else {
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Headers $Headers -ErrorAction Stop
        }
        
        Write-Host "✅ Éxito: $($response | ConvertTo-Json -Depth 3)" -ForegroundColor Green
        return $response
    }
    catch {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            Write-Host "📄 Código de estado: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
        }
        return $null
    }
    Write-Host "─────────────────────────────────────" -ForegroundColor Gray
}

# Verificar si el servidor está ejecutándose
Write-Host "🚀 Iniciando pruebas de endpoints del Banco Agricultura Salvadoreño" -ForegroundColor Magenta
Write-Host "📊 URL Base: $baseUrl" -ForegroundColor White

# Verificar estado del servidor
Write-Host "`n🔍 1. Verificando estado del servidor..." -ForegroundColor Yellow
Test-Endpoint -Method "GET" -Url "$baseUrl/actuator/health"

# Pruebas de Swagger
Write-Host "`n📚 2. Verificando documentación Swagger..." -ForegroundColor Yellow
Test-Endpoint -Method "GET" -Url "$baseUrl/swagger-ui.html"

# Pruebas de Autenticación
Write-Host "`n🔐 3. Pruebas de Autenticación..." -ForegroundColor Yellow

# Login válido con credenciales correctas
$loginBody = @{
    username = "admin"
    password = "admin2025"
} | ConvertTo-Json

Test-Endpoint -Method "POST" -Url "$baseUrl/api/auth/login" -Body $loginBody

# Login inválido
$loginInvalidBody = @{
    username = "usuarioInvalido"
    password = "passwordIncorrecto"
} | ConvertTo-Json

Test-Endpoint -Method "POST" -Url "$baseUrl/api/auth/login" -Body $loginInvalidBody

# Pruebas de Usuarios
Write-Host "`n👥 4. Pruebas de Usuarios..." -ForegroundColor Yellow

# Obtener todos los usuarios
Test-Endpoint -Method "GET" -Url "$baseUrl/api/usuarios"

# Obtener usuario por ID
Test-Endpoint -Method "GET" -Url "$baseUrl/api/usuarios/1"

# Crear nuevo usuario
$nuevoUsuario = @{
    nombre = "María García"
    apellido = "Rodríguez"
    email = "maria.garcia@test.com"
    telefono = "+503 7890-1234"
    dui = "03456789-1"
    usuario = "mgarcia"
    password = "password123"
    idRol = 2
    idSucursal = 1
} | ConvertTo-Json

Test-Endpoint -Method "POST" -Url "$baseUrl/api/usuarios" -Body $nuevoUsuario

# Pruebas de Cuentas
Write-Host "`n💳 5. Pruebas de Cuentas..." -ForegroundColor Yellow

# Obtener todas las cuentas
Test-Endpoint -Method "GET" -Url "$baseUrl/api/cuentas"

# Obtener cuenta por ID
Test-Endpoint -Method "GET" -Url "$baseUrl/api/cuentas/1"

# Obtener cuenta por número
Test-Endpoint -Method "GET" -Url "$baseUrl/api/cuentas/numero/0012345678"

# Obtener cuentas por usuario
Test-Endpoint -Method "GET" -Url "$baseUrl/api/cuentas/usuario/1"

# Crear nueva cuenta
$nuevaCuenta = @{
    numero = "0098765432"
    saldo = 1000.00
    fechaCreacion = "2024-01-15"
    estado = "ACTIVA"
    idUsuario = 1
    idTipoCuenta = 1
    idSucursal = 1
} | ConvertTo-Json

Test-Endpoint -Method "POST" -Url "$baseUrl/api/cuentas" -Body $nuevaCuenta

# Pruebas de Transacciones
Write-Host "`n💰 6. Pruebas de Transacciones..." -ForegroundColor Yellow

# Obtener todas las transacciones
Test-Endpoint -Method "GET" -Url "$baseUrl/api/transacciones"

# Obtener transacciones por cuenta
Test-Endpoint -Method "GET" -Url "$baseUrl/api/transacciones/cuenta/1"

# Realizar depósito
$deposito = @{
    monto = 500.00
    descripcion = "Depósito de prueba"
    idCuenta = 1
    idTipoTransaccion = 1
} | ConvertTo-Json

Test-Endpoint -Method "POST" -Url "$baseUrl/api/transacciones" -Body $deposito

# Realizar transferencia
$transferencia = @{
    monto = 100.00
    descripcion = "Transferencia de prueba"
    idCuentaOrigen = 1
    idCuentaDestino = 2
    idTipoTransaccion = 3
} | ConvertTo-Json

Test-Endpoint -Method "POST" -Url "$baseUrl/api/transacciones/transferencia" -Body $transferencia

# Pruebas de Préstamos
Write-Host "`n🏦 7. Pruebas de Préstamos..." -ForegroundColor Yellow

# Obtener todos los préstamos
Test-Endpoint -Method "GET" -Url "$baseUrl/api/prestamos"

# Obtener préstamos por usuario
Test-Endpoint -Method "GET" -Url "$baseUrl/api/prestamos/usuario/1"

# Solicitar nuevo préstamo
$prestamo = @{
    monto = 5000.00
    plazoMeses = 12
    tasaInteres = 8.5
    descripcion = "Préstamo personal de prueba"
    estado = "PENDIENTE"
    idUsuario = 1
    idTipoPrestamo = 1
} | ConvertTo-Json

Test-Endpoint -Method "POST" -Url "$baseUrl/api/prestamos" -Body $prestamo

# Pruebas de Configuración del Sistema
Write-Host "`n⚙️ 8. Pruebas de Configuración del Sistema..." -ForegroundColor Yellow

# Obtener configuraciones
Test-Endpoint -Method "GET" -Url "$baseUrl/api/configuracion"

# Pruebas de Tipos de Cuenta
Write-Host "`n📋 9. Pruebas de Tipos de Cuenta..." -ForegroundColor Yellow

# Obtener tipos de cuenta
Test-Endpoint -Method "GET" -Url "$baseUrl/api/tipos-cuenta"

# Pruebas de Sucursales
Write-Host "`n🏢 10. Pruebas de Sucursales..." -ForegroundColor Yellow

# Obtener sucursales
Test-Endpoint -Method "GET" -Url "$baseUrl/api/sucursales"

# Pruebas de Roles
Write-Host "`n👤 11. Pruebas de Roles..." -ForegroundColor Yellow

# Obtener roles
Test-Endpoint -Method "GET" -Url "$baseUrl/api/roles"

# Pruebas de Auditoría
Write-Host "`n📊 12. Pruebas de Auditoría..." -ForegroundColor Yellow

# Obtener registros de auditoría
Test-Endpoint -Method "GET" -Url "$baseUrl/api/auditoria"

# Obtener auditoría por usuario
Test-Endpoint -Method "GET" -Url "$baseUrl/api/auditoria/usuario/1"

Write-Host "`n🎉 Pruebas completadas!" -ForegroundColor Green
Write-Host "📈 Resumen de pruebas ejecutadas para todos los endpoints principales" -ForegroundColor Cyan
