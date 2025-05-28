# Script para probar endpoints de Préstamos
$baseUrl = "http://localhost:8081/api"

Write-Host "=== INICIANDO PRUEBAS DE ENDPOINTS DE PRÉSTAMOS ===" -ForegroundColor Green
Write-Host "URL Base: $baseUrl" -ForegroundColor Yellow
Write-Host ""

# PRUEBA 1: GET /prestamos - Obtener todos los préstamos
Write-Host "📋 PRUEBA 1: GET /prestamos - Obtener todos los préstamos" -ForegroundColor Yellow
try {
    $prestamos = Invoke-RestMethod -Uri "$baseUrl/prestamos" -Method GET -Headers @{'Content-Type'='application/json'}
    Write-Host "✅ Éxito: Obtenidos $($prestamos.Count) préstamos" -ForegroundColor Green
    $prestamos | ConvertTo-Json -Depth 3 | Write-Host
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# PRUEBA 2: POST /prestamos - Crear nuevo préstamo
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

try {
    $prestamoCreado = Invoke-RestMethod -Uri "$baseUrl/prestamos" -Method POST -Body $nuevoPrestamo -Headers @{'Content-Type'='application/json'}
    Write-Host "✅ Éxito: Préstamo creado" -ForegroundColor Green
    $prestamoCreado | ConvertTo-Json -Depth 3 | Write-Host
    $prestamoId = $prestamoCreado.prestamo.id
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    $prestamoId = 1  # Usar ID por defecto
}
Write-Host ""

# PRUEBA 3: GET /prestamos/{id} - Obtener préstamo por ID
Write-Host "📋 PRUEBA 3: GET /prestamos/$prestamoId - Obtener préstamo por ID" -ForegroundColor Yellow
try {
    $prestamo = Invoke-RestMethod -Uri "$baseUrl/prestamos/$prestamoId" -Method GET -Headers @{'Content-Type'='application/json'}
    Write-Host "✅ Éxito: Préstamo obtenido" -ForegroundColor Green
    $prestamo | ConvertTo-Json -Depth 3 | Write-Host
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# PRUEBA 4: GET /prestamos/numero/{numeroPrestamo} - Obtener préstamo por número
Write-Host "📋 PRUEBA 4: GET /prestamos/numero/PRE202505001 - Obtener préstamo por número" -ForegroundColor Yellow
try {
    $prestamo = Invoke-RestMethod -Uri "$baseUrl/prestamos/numero/PRE202505001" -Method GET -Headers @{'Content-Type'='application/json'}
    Write-Host "✅ Éxito: Préstamo obtenido por número" -ForegroundColor Green
    $prestamo | ConvertTo-Json -Depth 3 | Write-Host
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# PRUEBA 5: GET /prestamos/cliente/{clienteId} - Obtener préstamos por cliente
Write-Host "📋 PRUEBA 5: GET /prestamos/cliente/1 - Obtener préstamos por cliente" -ForegroundColor Yellow
try {
    $prestamosCliente = Invoke-RestMethod -Uri "$baseUrl/prestamos/cliente/1" -Method GET -Headers @{'Content-Type'='application/json'}
    Write-Host "✅ Éxito: $($prestamosCliente.Count) préstamos del cliente" -ForegroundColor Green
    $prestamosCliente | ConvertTo-Json -Depth 3 | Write-Host
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# PRUEBA 6: GET /prestamos/estado/solicitado - Obtener préstamos por estado
Write-Host "📋 PRUEBA 6: GET /prestamos/estado/solicitado - Obtener préstamos solicitados" -ForegroundColor Yellow
try {
    $prestamosSolicitados = Invoke-RestMethod -Uri "$baseUrl/prestamos/estado/solicitado" -Method GET -Headers @{'Content-Type'='application/json'}
    Write-Host "✅ Éxito: $($prestamosSolicitados.Count) préstamos solicitados" -ForegroundColor Green
    $prestamosSolicitados | ConvertTo-Json -Depth 3 | Write-Host
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# PRUEBA 7: PUT /prestamos/{id}/aprobar - Aprobar préstamo
Write-Host "📋 PRUEBA 7: PUT /prestamos/$prestamoId/aprobar - Aprobar préstamo" -ForegroundColor Yellow
$datosAprobacion = @{
    montoAprobado = 45000.00
    gerenteId = 2
} | ConvertTo-Json

try {
    $prestamoAprobado = Invoke-RestMethod -Uri "$baseUrl/prestamos/$prestamoId/aprobar" -Method PUT -Body $datosAprobacion -Headers @{'Content-Type'='application/json'}
    Write-Host "✅ Éxito: Préstamo aprobado" -ForegroundColor Green
    $prestamoAprobado | ConvertTo-Json -Depth 3 | Write-Host
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# PRUEBA 8: PUT /prestamos/{id}/desembolsar - Desembolsar préstamo
Write-Host "📋 PRUEBA 8: PUT /prestamos/$prestamoId/desembolsar - Desembolsar préstamo" -ForegroundColor Yellow
$datosDesembolso = @{
    cajeroId = 3
} | ConvertTo-Json

try {
    $prestamoDesembolsado = Invoke-RestMethod -Uri "$baseUrl/prestamos/$prestamoId/desembolsar" -Method PUT -Body $datosDesembolso -Headers @{'Content-Type'='application/json'}
    Write-Host "✅ Éxito: Préstamo desembolsado" -ForegroundColor Green
    $prestamoDesembolsado | ConvertTo-Json -Depth 3 | Write-Host
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# PRUEBA 9: Crear préstamo para rechazar
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

try {
    $prestamoParaRechazarCreado = Invoke-RestMethod -Uri "$baseUrl/prestamos" -Method POST -Body $prestamoParaRechazar -Headers @{'Content-Type'='application/json'}
    Write-Host "✅ Éxito: Préstamo para rechazar creado" -ForegroundColor Green
    $prestamoParaRechazarCreado | ConvertTo-Json -Depth 3 | Write-Host
    $prestamoRechazarId = $prestamoParaRechazarCreado.prestamo.id
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    $prestamoRechazarId = $prestamoId + 1
}
Write-Host ""

# PRUEBA 10: PUT /prestamos/{id}/rechazar - Rechazar préstamo
Write-Host "📋 PRUEBA 10: PUT /prestamos/$prestamoRechazarId/rechazar - Rechazar préstamo" -ForegroundColor Yellow
$datosRechazo = @{
    observaciones = "No cumple con los requisitos de ingresos mínimos"
} | ConvertTo-Json

try {
    $prestamoRechazado = Invoke-RestMethod -Uri "$baseUrl/prestamos/$prestamoRechazarId/rechazar" -Method PUT -Body $datosRechazo -Headers @{'Content-Type'='application/json'}
    Write-Host "✅ Éxito: Préstamo rechazado" -ForegroundColor Green
    $prestamoRechazado | ConvertTo-Json -Depth 3 | Write-Host
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "=== PRUEBAS COMPLETADAS ===" -ForegroundColor Green
