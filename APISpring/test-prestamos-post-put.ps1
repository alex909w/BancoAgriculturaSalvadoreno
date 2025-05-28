# Script para probar endpoints POST y PUT del PrestamoController
# Asegúrate de que el servidor esté corriendo en localhost:8081

Write-Host "=== PROBANDO ENDPOINTS POST Y PUT DEL PRESTAMO CONTROLLER ===" -ForegroundColor Green
Write-Host ""

# URL base
$baseUrl = "http://localhost:8081/api"

Write-Host "=== 1. PROBANDO POST /prestamos - Crear nuevo préstamo ===" -ForegroundColor Yellow
Write-Host ""

try {
    # Datos para crear un nuevo préstamo
    $nuevoPrestamo = @{
        cliente = @{ id = 2 }
        tipoPrestamoId = 1
        monto = 50000.00
        plazoMeses = 24
        proposito = "Compra de equipos agrícolas"
    }

    $body = $nuevoPrestamo | ConvertTo-Json -Depth 3
    Write-Host "Body del request:"
    Write-Host $body -ForegroundColor Cyan
    Write-Host ""

    $response = Invoke-RestMethod -Uri "$baseUrl/prestamos" -Method POST -Body $body -ContentType "application/json"
    Write-Host "Respuesta del servidor:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5
    Write-Host ""

    # Guardar el ID del nuevo préstamo para las siguientes pruebas
    $nuevoPrestamoId = $response.id
    Write-Host "Nuevo préstamo creado con ID: $nuevoPrestamoId" -ForegroundColor Green

} catch {
    Write-Host "Error al crear préstamo: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorBody = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorBody)
        $errorContent = $reader.ReadToEnd()
        Write-Host "Detalles del error: $errorContent" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "=== 2. PROBANDO PUT /prestamos/{id}/aprobar - Aprobar préstamo ===" -ForegroundColor Yellow
Write-Host ""

try {
    # Usar el préstamo recién creado o el existente (ID 1)
    $prestamoIdParaAprobar = if ($nuevoPrestamoId) { $nuevoPrestamoId } else { 1 }
    
    $response = Invoke-RestMethod -Uri "$baseUrl/prestamos/$prestamoIdParaAprobar/aprobar" -Method PUT
    Write-Host "Respuesta al aprobar préstamo ID $prestamoIdParaAprobar" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5
    Write-Host ""

} catch {
    Write-Host "Error al aprobar préstamo: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorBody = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorBody)
        $errorContent = $reader.ReadToEnd()
        Write-Host "Detalles del error: $errorContent" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "=== 3. PROBANDO PUT /prestamos/{id}/desembolsar - Desembolsar préstamo ===" -ForegroundColor Yellow
Write-Host ""

try {
    # Usar el mismo préstamo para desembolsar
    $prestamoIdParaDesembolsar = if ($nuevoPrestamoId) { $nuevoPrestamoId } else { 1 }
    
    $response = Invoke-RestMethod -Uri "$baseUrl/prestamos/$prestamoIdParaDesembolsar/desembolsar" -Method PUT
    Write-Host "Respuesta al desembolsar préstamo ID $prestamoIdParaDesembolsar" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5
    Write-Host ""

} catch {
    Write-Host "Error al desembolsar préstamo: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorBody = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorBody)
        $errorContent = $reader.ReadToEnd()
        Write-Host "Detalles del error: $errorContent" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "=== 4. CREANDO OTRO PRÉSTAMO PARA PROBAR RECHAZO ===" -ForegroundColor Yellow
Write-Host ""

try {
    # Crear otro préstamo para rechazar
    $prestamoParaRechazar = @{
        cliente = @{ id = 2 }
        tipoPrestamoId = 2
        monto = 25000.00
        plazoMeses = 12
        proposito = "Mejoras en la vivienda"
    }

    $body = $prestamoParaRechazar | ConvertTo-Json -Depth 3
    Write-Host "Creando préstamo para rechazar:"
    Write-Host $body -ForegroundColor Cyan
    Write-Host ""

    $response = Invoke-RestMethod -Uri "$baseUrl/prestamos" -Method POST -Body $body -ContentType "application/json"
    Write-Host "Préstamo creado:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5
    Write-Host ""

    $prestamoParaRechazarId = $response.id

} catch {
    Write-Host "Error al crear segundo préstamo: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

Write-Host "=== 5. PROBANDO PUT /prestamos/{id}/rechazar - Rechazar préstamo ===" -ForegroundColor Yellow
Write-Host ""

try {
    if ($prestamoParaRechazarId) {
        $response = Invoke-RestMethod -Uri "$baseUrl/prestamos/$prestamoParaRechazarId/rechazar" -Method PUT
        Write-Host "Respuesta al rechazar préstamo ID $prestamoParaRechazarId" -ForegroundColor Green
        $response | ConvertTo-Json -Depth 5
        Write-Host ""
    } else {
        Write-Host "No se pudo crear el préstamo para rechazar" -ForegroundColor Red
    }

} catch {
    Write-Host "Error al rechazar préstamo: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorBody = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorBody)
        $errorContent = $reader.ReadToEnd()
        Write-Host "Detalles del error: $errorContent" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "=== 6. VERIFICANDO ESTADO FINAL DE LOS PRÉSTAMOS ===" -ForegroundColor Yellow
Write-Host ""

try {
    Write-Host "Obteniendo todos los préstamos:" -ForegroundColor Cyan
    $response = Invoke-RestMethod -Uri "$baseUrl/prestamos" -Method GET
    $response | ConvertTo-Json -Depth 5
    Write-Host ""

} catch {
    Write-Host "Error al obtener préstamos: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

Write-Host "=== PRUEBAS COMPLETADAS ===" -ForegroundColor Green
