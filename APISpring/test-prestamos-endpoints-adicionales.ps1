# Script para probar endpoints adicionales del PrestamoController
$baseUrl = "http://localhost:8081/api/prestamos"

Write-Host "=== PROBANDO ENDPOINTS ADICIONALES DEL PRESTAMO CONTROLLER ===" -ForegroundColor Yellow

# 1. Probando endpoint de estadísticas
Write-Host "`n=== 1. PROBANDO ENDPOINT DE ESTADÍSTICAS ===" -ForegroundColor Cyan
try {
    $stats = Invoke-RestMethod -Uri "$baseUrl/estadisticas" -Method GET -ContentType "application/json"
    Write-Host "Estadísticas obtenidas:" -ForegroundColor Green
    $stats | ConvertTo-Json -Depth 3
} catch {
    Write-Host "Error al obtener estadísticas: $($_.Exception.Message)" -ForegroundColor Red
}

# 2. Probando endpoint de cuotas del préstamo ID 2
Write-Host "`n=== 2. PROBANDO ENDPOINT DE CUOTAS (PRÉSTAMO ID 2) ===" -ForegroundColor Cyan
try {
    $cuotas = Invoke-RestMethod -Uri "$baseUrl/2/cuotas" -Method GET -ContentType "application/json"
    if ($cuotas -is [array]) {
        Write-Host "Cuotas encontradas: $($cuotas.Count)" -ForegroundColor Green
        if ($cuotas.Count -gt 0) {
            Write-Host "Primeras 3 cuotas:"
            $cuotas | Select-Object -First 3 | ConvertTo-Json -Depth 2
        }
    } else {
        Write-Host "Respuesta de cuotas:"
        $cuotas | ConvertTo-Json -Depth 3
    }
} catch {
    Write-Host "Error al obtener cuotas: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Probando endpoint de búsqueda por rango de fechas
Write-Host "`n=== 3. PROBANDO BÚSQUEDA POR RANGO DE FECHAS ===" -ForegroundColor Cyan
$fechaInicio = "2025-05-01"
$fechaFin = "2025-12-31"
try {
    $prestamosFecha = Invoke-RestMethod -Uri "$baseUrl/buscar/fecha?fechaInicio=$fechaInicio&fechaFin=$fechaFin" -Method GET -ContentType "application/json"
    Write-Host "Préstamos en rango $fechaInicio a $fechaFin" -ForegroundColor Green
    if ($prestamosFecha -is [array]) {
        Write-Host "Total encontrados: $($prestamosFecha.Count)"
        foreach ($prestamo in $prestamosFecha) {
            Write-Host "ID: $($prestamo.id) - Fecha: $($prestamo.fechaSolicitud) - Estado: $($prestamo.estado)"
        }
    } else {
        $prestamosFecha | ConvertTo-Json -Depth 2
    }
} catch {
    Write-Host "Error en búsqueda por fechas: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Probando endpoint de préstamos vencidos
Write-Host "`n=== 4. PROBANDO ENDPOINT DE PRÉSTAMOS VENCIDOS ===" -ForegroundColor Cyan
try {
    $prestamosVencidos = Invoke-RestMethod -Uri "$baseUrl/vencidos" -Method GET -ContentType "application/json"
    Write-Host "Préstamos vencidos:" -ForegroundColor Green
    if ($prestamosVencidos -is [array]) {
        Write-Host "Total vencidos: $($prestamosVencidos.Count)"
        foreach ($prestamo in $prestamosVencidos) {
            Write-Host "ID: $($prestamo.id) - Saldo pendiente: $($prestamo.saldoPendiente)"
        }
    } else {
        $prestamosVencidos | ConvertTo-Json -Depth 2
    }
} catch {
    Write-Host "Error al obtener préstamos vencidos: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Probando endpoint de cálculo de cuota
Write-Host "`n=== 5. PROBANDO CÁLCULO DE CUOTA ===" -ForegroundColor Cyan
$monto = 50000
$plazo = 36
$tasa = 0.095
try {
    $cuotaCalculada = Invoke-RestMethod -Uri "$baseUrl/calcular-cuota?monto=$monto&plazoMeses=$plazo&tasaInteres=$tasa" -Method GET -ContentType "application/json"
    Write-Host "Cálculo de cuota para monto $monto, plazo $plazo meses, tasa $($tasa*100)%" -ForegroundColor Green
    $cuotaCalculada | ConvertTo-Json -Depth 2
} catch {
    Write-Host "Error al calcular cuota: $($_.Exception.Message)" -ForegroundColor Red
}

# 6. Probando endpoint de resumen del préstamo
Write-Host "`n=== 6. PROBANDO RESUMEN DE PRÉSTAMO (ID 2) ===" -ForegroundColor Cyan
try {
    $resumen = Invoke-RestMethod -Uri "$baseUrl/2/resumen" -Method GET -ContentType "application/json"
    Write-Host "Resumen del préstamo ID 2" -ForegroundColor Green
    $resumen | ConvertTo-Json -Depth 3
} catch {
    Write-Host "Error al obtener resumen: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== PRUEBAS DE ENDPOINTS ADICIONALES COMPLETADAS ===" -ForegroundColor Yellow
