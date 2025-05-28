# Script de Pruebas de Endpoints - Banco Agricultura Salvadoreno
# Version simplificada sin caracteres especiales

Write-Host "PRUEBAS DE ENDPOINTS - BANCO AGRICULTURA SALVADORENO" -ForegroundColor Magenta
Write-Host "==========================================================" -ForegroundColor Gray

$baseUrl = "http://localhost:8081"

function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Url,
        [string]$Body = $null,
        [string]$Description
    )
    
    Write-Host ""
    Write-Host "Probando: $Description" -ForegroundColor Cyan
    Write-Host "   $Method $Url" -ForegroundColor White
    
    try {
        $headers = @{
            "Content-Type" = "application/json"
            "Accept" = "application/json"
        }
        
        if ($Body) {
            $response = Invoke-WebRequest -Uri $Url -Method $Method -Headers $headers -Body $Body -TimeoutSec 10
        } else {
            $response = Invoke-WebRequest -Uri $Url -Method $Method -Headers $headers -TimeoutSec 10
        }
        
        $statusCode = $response.StatusCode
        Write-Host "   Exito: Estado $statusCode" -ForegroundColor Green
        
        if ($response.Content) {
            $sample = $response.Content.Substring(0, [Math]::Min(150, $response.Content.Length))
            if ($response.Content.Length -gt 150) { $sample += "..." }
            Write-Host "   Respuesta: $sample" -ForegroundColor Gray
        }
        
        return $true
    }
    catch {
        if ($_.Exception.Response) {
            $statusCode = $_.Exception.Response.StatusCode.value__
            Write-Host "   Error: Codigo $statusCode" -ForegroundColor Red
        } else {
            Write-Host "   Error de conexion: $($_.Exception.Message)" -ForegroundColor Red
        }
        return $false
    }
}

Write-Host ""
Write-Host "Verificando si el servidor esta ejecutandose..." -ForegroundColor Yellow

$serverRunning = Test-Endpoint -Method "GET" -Url "$baseUrl/" -Description "Verificar servidor base"

if (-not $serverRunning) {
    Write-Host ""
    Write-Host "El servidor no esta ejecutandose en $baseUrl" -ForegroundColor Yellow
    Write-Host "Para ejecutar el servidor:" -ForegroundColor Cyan
    Write-Host "   1. mvn clean compile" -ForegroundColor White
    Write-Host "   2. mvn spring-boot:run" -ForegroundColor White
    Write-Host ""
    Write-Host "Endpoints que se probarian cuando este activo:" -ForegroundColor Yellow
    Write-Host "   GET  $baseUrl/actuator/health - Health Check" -ForegroundColor Gray
    Write-Host "   GET  $baseUrl/api/usuarios - Listar usuarios" -ForegroundColor Gray
    Write-Host "   POST $baseUrl/api/usuarios/login - Login de usuario" -ForegroundColor Gray
    Write-Host "   GET  $baseUrl/api/cuentas - Listar cuentas" -ForegroundColor Gray
    Write-Host "   GET  $baseUrl/api/transacciones - Listar transacciones" -ForegroundColor Gray
    Write-Host "   GET  $baseUrl/api/prestamos - Listar prestamos" -ForegroundColor Gray
    Write-Host "   GET  $baseUrl/api/roles - Listar roles" -ForegroundColor Gray
    Write-Host "   GET  $baseUrl/api/sucursales - Listar sucursales" -ForegroundColor Gray
    Write-Host "   GET  $baseUrl/api/configuracion - Configuracion del sistema" -ForegroundColor Gray
    Write-Host "   GET  $baseUrl/api/auditoria - Registros de auditoria" -ForegroundColor Gray
    return
}

Write-Host ""
Write-Host "Servidor activo. Iniciando pruebas..." -ForegroundColor Green

# Health Check
Test-Endpoint -Method "GET" -Url "$baseUrl/actuator/health" -Description "Health Check del sistema"

# Swagger
Test-Endpoint -Method "GET" -Url "$baseUrl/swagger-ui.html" -Description "Interfaz Swagger UI"

# Endpoints principales
Test-Endpoint -Method "GET" -Url "$baseUrl/api/usuarios" -Description "Obtener todos los usuarios"
Test-Endpoint -Method "GET" -Url "$baseUrl/api/cuentas" -Description "Obtener todas las cuentas"
Test-Endpoint -Method "GET" -Url "$baseUrl/api/transacciones" -Description "Obtener todas las transacciones"
Test-Endpoint -Method "GET" -Url "$baseUrl/api/prestamos" -Description "Obtener todos los prestamos"
Test-Endpoint -Method "GET" -Url "$baseUrl/api/roles" -Description "Obtener todos los roles"
Test-Endpoint -Method "GET" -Url "$baseUrl/api/sucursales" -Description "Obtener todas las sucursales"
Test-Endpoint -Method "GET" -Url "$baseUrl/api/tipos-cuenta" -Description "Obtener tipos de cuenta"
Test-Endpoint -Method "GET" -Url "$baseUrl/api/configuracion" -Description "Obtener configuracion del sistema"

# Prueba de Login
Write-Host ""
Write-Host "PRUEBAS DE AUTENTICACION" -ForegroundColor Yellow

$loginData = @{
    usuario = "jlopez"
    password = "1234"
} | ConvertTo-Json

Test-Endpoint -Method "POST" -Url "$baseUrl/api/usuarios/login" -Body $loginData -Description "Login con credenciales validas"

# Endpoints especificos por ID
Test-Endpoint -Method "GET" -Url "$baseUrl/api/usuarios/1" -Description "Obtener usuario por ID"
Test-Endpoint -Method "GET" -Url "$baseUrl/api/cuentas/1" -Description "Obtener cuenta por ID"

Write-Host ""
Write-Host "PRUEBAS COMPLETADAS" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Gray
