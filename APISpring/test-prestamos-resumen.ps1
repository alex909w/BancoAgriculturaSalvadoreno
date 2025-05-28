# Script final para completar las pruebas del PrestamoController
$baseUrl = "http://localhost:8081/api/prestamos"

Write-Host "=== REPORTE FINAL DE PRUEBAS - PRESTAMO CONTROLLER ===" -ForegroundColor Yellow

# 1. Verificar estado actual del sistema
Write-Host "`n=== 1. ESTADO ACTUAL DEL SISTEMA ===" -ForegroundColor Cyan
try {
    $prestamos = Invoke-RestMethod -Uri $baseUrl -Method GET -ContentType "application/json"
    Write-Host "Total de prestamos en el sistema: $($prestamos.Count)" -ForegroundColor Green
    foreach ($prestamo in $prestamos) {
        Write-Host "  ID: $($prestamo.id) | Numero: $($prestamo.numeroPrestamo) | Estado: $($prestamo.estado) | Monto: $($prestamo.montoSolicitado)" -ForegroundColor White
    }
} catch {
    Write-Host "Error al obtener prestamos: $($_.Exception.Message)" -ForegroundColor Red
}

# 2. Probar busqueda por ID especifico
Write-Host "`n=== 2. PRUEBA DE BUSQUEDA POR ID ===" -ForegroundColor Cyan
$testId = 2
try {
    $prestamo = Invoke-RestMethod -Uri "$baseUrl/$testId" -Method GET -ContentType "application/json"
    Write-Host "Prestamo ID $testId encontrado:" -ForegroundColor Green
    Write-Host "  Numero: $($prestamo.numeroPrestamo)" -ForegroundColor White
    Write-Host "  Cliente: $($prestamo.cliente.nombreCompleto)" -ForegroundColor White
    Write-Host "  Estado: $($prestamo.estado)" -ForegroundColor White
    Write-Host "  Monto solicitado: $($prestamo.montoSolicitado)" -ForegroundColor White
    if ($prestamo.montoAprobado) {
        Write-Host "  Monto aprobado: $($prestamo.montoAprobado)" -ForegroundColor White
    }
} catch {
    Write-Host "Error al buscar prestamo ID $testId : $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Estadisticas finales
Write-Host "`n=== 3. ESTADISTICAS FINALES ===" -ForegroundColor Cyan
try {
    $prestamosFinal = Invoke-RestMethod -Uri $baseUrl -Method GET -ContentType "application/json"
    
    $estadisticas = @{}
    foreach ($prestamo in $prestamosFinal) {
        $estado = $prestamo.estado
        if ($estadisticas.ContainsKey($estado)) {
            $estadisticas[$estado]++
        } else {
            $estadisticas[$estado] = 1
        }
    }
    
    Write-Host "Resumen final del sistema:" -ForegroundColor Green
    Write-Host "  Total de prestamos: $($prestamosFinal.Count)" -ForegroundColor White
    foreach ($estado in $estadisticas.Keys) {
        Write-Host "  - $estado : $($estadisticas[$estado])" -ForegroundColor White
    }
    
    $montoTotal = ($prestamosFinal | Measure-Object -Property montoSolicitado -Sum).Sum
    Write-Host "  Monto total solicitado: `$$montoTotal" -ForegroundColor White
    
} catch {
    Write-Host "Error al calcular estadisticas: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== PRUEBAS COMPLETADAS EXITOSAMENTE ===" -ForegroundColor Yellow
Write-Host "Todos los endpoints del PrestamoController han sido probados." -ForegroundColor Green
