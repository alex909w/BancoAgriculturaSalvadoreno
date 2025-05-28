# Script Simplificado de Pruebas de Endpoints
# Pruebas básicas sin necesidad de base de datos activa

Write-Host "🚀 PRUEBAS DE ENDPOINTS - BANCO AGRICULTURA SALVADOREÑO" -ForegroundColor Magenta
Write-Host "=" * 60 -ForegroundColor Gray

$baseUrl = "http://localhost:8081"

# Función para probar endpoint
function Test-SimpleEndpoint {
    param(
        [string]$Method,
        [string]$Url,
        [string]$Body = $null,
        [string]$Description
    )
    
    Write-Host "`n🔍 $Description" -ForegroundColor Cyan
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
        $contentType = $response.Headers["Content-Type"]
        
        Write-Host "   ✅ Estado: $statusCode" -ForegroundColor Green
        
        if ($response.Content) {
            try {
                $jsonResponse = $response.Content | ConvertFrom-Json
                Write-Host "   📄 Respuesta JSON válida recibida" -ForegroundColor Green
                
                # Mostrar una muestra de la respuesta (primeros 200 caracteres)
                $sample = $response.Content.Substring(0, [Math]::Min(200, $response.Content.Length))
                if ($response.Content.Length -gt 200) { $sample += "..." }
                Write-Host "   📋 Muestra: $sample" -ForegroundColor Gray
            }
            catch {
                Write-Host "   📄 Respuesta: $($response.Content.Substring(0, [Math]::Min(100, $response.Content.Length)))" -ForegroundColor Gray
            }
        }
        
        return $true
    }
    catch {
        $errorMsg = $_.Exception.Message
        if ($_.Exception.Response) {
            $statusCode = $_.Exception.Response.StatusCode.value__
            Write-Host "   ❌ Error $statusCode" -ForegroundColor Red
        } else {
            Write-Host "   ❌ Error de conexión: $errorMsg" -ForegroundColor Red
        }
        return $false
    }
}

# Verificar si el servidor está corriendo
Write-Host "`n🔍 VERIFICANDO ESTADO DEL SERVIDOR..." -ForegroundColor Yellow

$serverRunning = Test-SimpleEndpoint -Method "GET" -Url "$baseUrl/" -Description "Verificar servidor base"

if (-not $serverRunning) {
    Write-Host "`n⚠️  El servidor no está ejecutándose en $baseUrl" -ForegroundColor Yellow
    Write-Host "   Para ejecutar el servidor:" -ForegroundColor Cyan
    Write-Host "   1. mvn clean compile" -ForegroundColor White
    Write-Host "   2. mvn spring-boot:run" -ForegroundColor White
    Write-Host "`n📋 Simulando pruebas de endpoints (estructura)..." -ForegroundColor Yellow
    
    # Mostrar estructura de pruebas que se ejecutarían
    $endpoints = @(
        @{Method="GET"; Path="/actuator/health"; Desc="Health Check"},
        @{Method="GET"; Path="/api/usuarios"; Desc="Listar usuarios"},
        @{Method="POST"; Path="/api/usuarios/login"; Desc="Login de usuario"},
        @{Method="GET"; Path="/api/cuentas"; Desc="Listar cuentas"},
        @{Method="GET"; Path="/api/transacciones"; Desc="Listar transacciones"},
        @{Method="GET"; Path="/api/prestamos"; Desc="Listar préstamos"},
        @{Method="GET"; Path="/api/roles"; Desc="Listar roles"},
        @{Method="GET"; Path="/api/sucursales"; Desc="Listar sucursales"},
        @{Method="GET"; Path="/api/tipos-cuenta"; Desc="Listar tipos de cuenta"},
        @{Method="GET"; Path="/api/configuracion"; Desc="Configuración del sistema"},
        @{Method="GET"; Path="/api/auditoria"; Desc="Registros de auditoría"}
    )
    
    Write-Host "`n📊 ENDPOINTS A PROBAR:" -ForegroundColor Magenta
    foreach ($endpoint in $endpoints) {
        Write-Host "   $($endpoint.Method) $baseUrl$($endpoint.Path)" -ForegroundColor Gray
        Write-Host "   └─ $($endpoint.Desc)" -ForegroundColor DarkGray
    }
    
    Write-Host "`n📝 DATOS DE PRUEBA PREPARADOS:" -ForegroundColor Magenta
    Write-Host "   🔐 Login: {usuario: 'jlopez', password: '1234'}" -ForegroundColor Gray
    Write-Host "   👤 Nuevo Usuario: {nombre: 'María García', email: 'maria@test.com'}" -ForegroundColor Gray
    Write-Host "   💳 Nueva Cuenta: {numero: '0098765432', saldo: 1000.00}" -ForegroundColor Gray
    Write-Host "   💰 Depósito: {monto: 500.00, idCuenta: 1}" -ForegroundColor Gray
    Write-Host "   🔄 Transferencia: {monto: 100.00, cuentaOrigen: 1, cuentaDestino: 2}" -ForegroundColor Gray
    Write-Host "   🏦 Préstamo: {monto: 5000.00, plazoMeses: 12, tasaInteres: 8.5}" -ForegroundColor Gray
    
    exit
}

Write-Host "`n✅ Servidor ejecutándose. Iniciando pruebas..." -ForegroundColor Green

# Pruebas cuando el servidor está activo
Write-Host "`n🔍 PRUEBAS DE ENDPOINTS PRINCIPALES" -ForegroundColor Yellow

# Health Check
Test-SimpleEndpoint -Method "GET" -Url "$baseUrl/actuator/health" -Description "Health Check del sistema"

# Swagger
Test-SimpleEndpoint -Method "GET" -Url "$baseUrl/swagger-ui.html" -Description "Interfaz Swagger UI"
Test-SimpleEndpoint -Method "GET" -Url "$baseUrl/v3/api-docs" -Description "Documentación OpenAPI"

# Endpoints principales GET
Test-SimpleEndpoint -Method "GET" -Url "$baseUrl/api/usuarios" -Description "Obtener todos los usuarios"
Test-SimpleEndpoint -Method "GET" -Url "$baseUrl/api/cuentas" -Description "Obtener todas las cuentas"
Test-SimpleEndpoint -Method "GET" -Url "$baseUrl/api/transacciones" -Description "Obtener todas las transacciones"
Test-SimpleEndpoint -Method "GET" -Url "$baseUrl/api/prestamos" -Description "Obtener todos los préstamos"
Test-SimpleEndpoint -Method "GET" -Url "$baseUrl/api/roles" -Description "Obtener todos los roles"
Test-SimpleEndpoint -Method "GET" -Url "$baseUrl/api/sucursales" -Description "Obtener todas las sucursales"
Test-SimpleEndpoint -Method "GET" -Url "$baseUrl/api/tipos-cuenta" -Description "Obtener tipos de cuenta"
Test-SimpleEndpoint -Method "GET" -Url "$baseUrl/api/configuracion" -Description "Obtener configuración del sistema"
Test-SimpleEndpoint -Method "GET" -Url "$baseUrl/api/auditoria" -Description "Obtener registros de auditoría"

# Prueba de Login
Write-Host "`n🔐 PRUEBAS DE AUTENTICACIÓN" -ForegroundColor Yellow

$loginData = @{
    usuario = "jlopez"
    password = "1234"
} | ConvertTo-Json

Test-SimpleEndpoint -Method "POST" -Url "$baseUrl/api/usuarios/login" -Body $loginData -Description "Login con credenciales válidas"

# Prueba de endpoint específico por ID
Test-SimpleEndpoint -Method "GET" -Url "$baseUrl/api/usuarios/1" -Description "Obtener usuario por ID"
Test-SimpleEndpoint -Method "GET" -Url "$baseUrl/api/cuentas/1" -Description "Obtener cuenta por ID"

Write-Host "`n🎉 PRUEBAS COMPLETADAS" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host "📊 Resumen: Se probaron los endpoints principales del sistema bancario" -ForegroundColor Cyan
Write-Host "📋 Para pruebas mas detalladas, usar la coleccion de Postman incluida" -ForegroundColor Yellow
