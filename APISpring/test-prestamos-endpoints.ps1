# Script para probar todos los endpoints de Préstamos
# URL base de la API
$baseUrl = "http://localhost:8081/api"

Write-Host "=== INICIANDO PRUEBAS DE ENDPOINTS DE PRÉSTAMOS ===" -ForegroundColor Green
Write-Host "URL Base: $baseUrl" -ForegroundColor Yellow
Write-Host ""

# Función para hacer peticiones HTTP y mostrar resultados
function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Url,
        [string]$Body = $null,
        [string]$Description
    )
    
    Write-Host "🔍 Probando: $Description" -ForegroundColor Cyan
    Write-Host "   Método: $Method" -ForegroundColor Gray
    Write-Host "   URL: $Url" -ForegroundColor Gray
    
    try {
        $headers = @{
            'Content-Type' = 'application/json'
            'Accept' = 'application/json'
        }
        
        if ($Body) {
            Write-Host "   Body: $Body" -ForegroundColor Gray
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Body $Body -Headers $headers
        } else {
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Headers $headers
        }
        
        Write-Host "✅ Éxito:" -ForegroundColor Green
        $response | ConvertTo-Json -Depth 10 | Write-Host
        
        return $response
    }
    catch {
        Write-Host "❌ Error:" -ForegroundColor Red
        Write-Host "   Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        Write-Host "   Mensaje: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $errorBody = $reader.ReadToEnd()
            if ($errorBody) {
                Write-Host "   Detalles: $errorBody" -ForegroundColor Red
            }
        }
        return $null
    }
    
    Write-Host ""
}

Write-Host "📋 PRUEBA 1: GET /prestamos - Obtener todos los préstamos" -ForegroundColor Yellow
$prestamos = Test-Endpoint -Method "GET" -Url "$baseUrl/prestamos" -Description "Obtener todos los préstamos"

Write-Host "📋 PRUEBA 2: POST /prestamos - Crear nuevo préstamo" -ForegroundColor Yellow
$nuevoPrestamo = @{
    numeroPrestamo = "PRE202505001"
    cliente = @{ id = 1 }
    tipoPrestamo = @{ id = 1 }
    cuentaVinculada = @{ id = 1 }
    montoSolicitado = 50000.00
    tasaInteres = 12.5
    plazoMeses = 24
    tieneSeguroVida = $true
    cobrosAutomaticos = $false
} | ConvertTo-Json -Depth 10

$prestamoCreado = Test-Endpoint -Method "POST" -Url "$baseUrl/prestamos" -Body $nuevoPrestamo -Description "Crear nuevo préstamo"

# Usar el ID del préstamo creado para las siguientes pruebas
$prestamoId = $null
if ($prestamoCreado -and $prestamoCreado.prestamo -and $prestamoCreado.prestamo.id) {
    $prestamoId = $prestamoCreado.prestamo.id
} elseif ($prestamos -and $prestamos.Count -gt 0) {
    $prestamoId = $prestamos[0].id
} else {
    $prestamoId = 1  # Usar ID por defecto
}

Write-Host "📋 PRUEBA 3: GET /prestamos/{id} - Obtener préstamo por ID" -ForegroundColor Yellow
Test-Endpoint -Method "GET" -Url "$baseUrl/prestamos/$prestamoId" -Description "Obtener préstamo por ID ($prestamoId)"

Write-Host "📋 PRUEBA 4: GET /prestamos/numero/{numeroPrestamo} - Obtener préstamo por número" -ForegroundColor Yellow
Test-Endpoint -Method "GET" -Url "$baseUrl/prestamos/numero/PRE202505001" -Description "Obtener préstamo por número"

Write-Host "📋 PRUEBA 5: GET /prestamos/cliente/{clienteId} - Obtener préstamos por cliente" -ForegroundColor Yellow
Test-Endpoint -Method "GET" -Url "$baseUrl/prestamos/cliente/1" -Description "Obtener préstamos del cliente 1"

Write-Host "📋 PRUEBA 6: GET /prestamos/estado/{estado} - Obtener préstamos por estado" -ForegroundColor Yellow
Test-Endpoint -Method "GET" -Url "$baseUrl/prestamos/estado/solicitado" -Description "Obtener préstamos solicitados"

Write-Host "📋 PRUEBA 7: PUT /prestamos/{id}/aprobar - Aprobar préstamo" -ForegroundColor Yellow
$datosAprobacion = @{
    montoAprobado = 45000.00
    gerenteId = 2
} | ConvertTo-Json

Test-Endpoint -Method "PUT" -Url "$baseUrl/prestamos/$prestamoId/aprobar" -Body $datosAprobacion -Description "Aprobar préstamo"

Write-Host "📋 PRUEBA 8: PUT /prestamos/{id}/desembolsar - Desembolsar préstamo" -ForegroundColor Yellow
$datosDesembolso = @{
    cajeroId = 3
} | ConvertTo-Json

Test-Endpoint -Method "PUT" -Url "$baseUrl/prestamos/$prestamoId/desembolsar" -Body $datosDesembolso -Description "Desembolsar préstamo"

Write-Host "📋 PRUEBA 9: Crear préstamo para rechazar" -ForegroundColor Yellow
$prestamoParaRechazar = @{
    numeroPrestamo = "PRE202505002"
    cliente = @{ id = 1 }
    tipoPrestamo = @{ id = 1 }
    cuentaVinculada = @{ id = 1 }
    montoSolicitado = 25000.00
    tasaInteres = 15.0
    plazoMeses = 12
    tieneSeguroVida = $false
    cobrosAutomaticos = $true
} | ConvertTo-Json -Depth 10

$prestamoParaRechazarCreado = Test-Endpoint -Method "POST" -Url "$baseUrl/prestamos" -Body $prestamoParaRechazar -Description "Crear préstamo para rechazar"

$prestamoRechazarId = $null
if ($prestamoParaRechazarCreado -and $prestamoParaRechazarCreado.prestamo -and $prestamoParaRechazarCreado.prestamo.id) {
    $prestamoRechazarId = $prestamoParaRechazarCreado.prestamo.id
} else {
    $prestamoRechazarId = $prestamoId + 1  # Usar siguiente ID
}

Write-Host "📋 PRUEBA 10: PUT /prestamos/{id}/rechazar - Rechazar préstamo" -ForegroundColor Yellow
$datosRechazo = @{
    observaciones = "No cumple con los requisitos de ingresos mínimos"
} | ConvertTo-Json

Test-Endpoint -Method "PUT" -Url "$baseUrl/prestamos/$prestamoRechazarId/rechazar" -Body $datosRechazo -Description "Rechazar préstamo"

Write-Host "📋 PRUEBA 11: Verificar estados después de las operaciones" -ForegroundColor Yellow
Test-Endpoint -Method "GET" -Url "$baseUrl/prestamos/estado/aprobado" -Description "Préstamos aprobados"
Test-Endpoint -Method "GET" -Url "$baseUrl/prestamos/estado/rechazado" -Description "Préstamos rechazados"
Test-Endpoint -Method "GET" -Url "$baseUrl/prestamos/estado/desembolsado" -Description "Préstamos desembolsados"

Write-Host ""
Write-Host "=== PRUEBAS COMPLETADAS ===" -ForegroundColor Green
Write-Host "Todas las pruebas de endpoints de préstamos han sido ejecutadas." -ForegroundColor Green
