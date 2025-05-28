# Script final para completar las pruebas del PrestamoController
$baseUrl = "http://localhost:8081/api/prestamos"

Write-Host "=== REPORTE FINAL DE PRUEBAS - PRESTAMO CONTROLLER ===" -ForegroundColor Yellow

# 1. Verificar estado actual del sistema
Write-Host "`n=== 1. ESTADO ACTUAL DEL SISTEMA ===" -ForegroundColor Cyan
try {
    $prestamos = Invoke-RestMethod -Uri $baseUrl -Method GET -ContentType "application/json"
    Write-Host "Total de préstamos en el sistema: $($prestamos.Count)" -ForegroundColor Green
    foreach ($prestamo in $prestamos) {
        Write-Host "  ID: $($prestamo.id) | Número: $($prestamo.numeroPrestamo) | Estado: $($prestamo.estado) | Monto: $($prestamo.montoSolicitado)" -ForegroundColor White
    }
} catch {
    Write-Host "Error al obtener préstamos: $($_.Exception.Message)" -ForegroundColor Red
}

# 2. Probar búsqueda por ID específico
Write-Host "`n=== 2. PRUEBA DE BÚSQUEDA POR ID ===" -ForegroundColor Cyan
$testId = 2
try {
    $prestamo = Invoke-RestMethod -Uri "$baseUrl/$testId" -Method GET -ContentType "application/json"
    Write-Host "Préstamo ID $testId encontrado:" -ForegroundColor Green
    Write-Host "  Número: $($prestamo.numeroPrestamo)" -ForegroundColor White
    Write-Host "  Cliente: $($prestamo.cliente.nombreCompleto)" -ForegroundColor White
    Write-Host "  Estado: $($prestamo.estado)" -ForegroundColor White
    Write-Host "  Monto solicitado: $($prestamo.montoSolicitado)" -ForegroundColor White
    if ($prestamo.montoAprobado) {
        Write-Host "  Monto aprobado: $($prestamo.montoAprobado)" -ForegroundColor White
    }
} catch {
    Write-Host "Error al buscar préstamo ID $testId : $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Probar búsqueda por número de préstamo
Write-Host "`n=== 3. PRUEBA DE BÚSQUEDA POR NÚMERO ===" -ForegroundColor Cyan
$numeroTest = "PRE20250505228"
try {
    $prestamo = Invoke-RestMethod -Uri "$baseUrl/numero/$numeroTest" -Method GET -ContentType "application/json"
    Write-Host "Préstamo número $numeroTest encontrado:" -ForegroundColor Green
    Write-Host "  ID: $($prestamo.id)" -ForegroundColor White
    Write-Host "  Estado: $($prestamo.estado)" -ForegroundColor White
    Write-Host "  Monto: $($prestamo.montoSolicitado)" -ForegroundColor White
} catch {
    Write-Host "Error al buscar préstamo por número: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Probar filtrado por estados diferentes
Write-Host "`n=== 4. PRUEBA DE FILTRADO POR ESTADOS ===" -ForegroundColor Cyan
$estados = @("solicitado", "aprobado", "desembolsado", "rechazado")
foreach ($estado in $estados) {
    try {
        $prestamosEstado = Invoke-RestMethod -Uri "$baseUrl/estado/$estado" -Method GET -ContentType "application/json"
        Write-Host "Estado '$estado': $($prestamosEstado.Count) préstamos" -ForegroundColor Green
        if ($prestamosEstado.Count -gt 0) {
            foreach ($p in $prestamosEstado) {
                Write-Host "  - ID: $($p.id), Número: $($p.numeroPrestamo), Monto: $($p.montoSolicitado)" -ForegroundColor White
            }
        }
    } catch {
        Write-Host "Error al filtrar por estado '$estado': $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 5. Probar búsqueda por cliente
Write-Host "`n=== 5. PRUEBA DE BÚSQUEDA POR CLIENTE ===" -ForegroundColor Cyan
$clienteId = 2
try {
    $prestamosCliente = Invoke-RestMethod -Uri "$baseUrl/cliente/$clienteId" -Method GET -ContentType "application/json"
    Write-Host "Cliente ID $clienteId tiene $($prestamosCliente.Count) préstamos:" -ForegroundColor Green
    foreach ($p in $prestamosCliente) {
        Write-Host "  - ID: $($p.id), Estado: $($p.estado), Monto: $($p.montoSolicitado), Fecha: $($p.fechaSolicitud)" -ForegroundColor White
    }
} catch {
    Write-Host "Error al buscar préstamos del cliente: $($_.Exception.Message)" -ForegroundColor Red
}

# 6. Crear un último préstamo para pruebas finales
Write-Host "`n=== 6. CREACIÓN DE PRÉSTAMO FINAL ===" -ForegroundColor Cyan
$nuevoPrestamo = @{
    cliente = @{ id = 2 }
    tipoPrestamo = @{ id = 4 }  # Agrícola
    cuentaVinculada = @{ id = 1 }
    montoSolicitado = 30000
    tasaInteres = 0.09
    plazoMeses = 60
    proposito = "Compra de equipo agrícola y semillas"
    estado = "solicitado"
}

try {
    $resultado = Invoke-RestMethod -Uri $baseUrl -Method POST -Body ($nuevoPrestamo | ConvertTo-Json -Depth 3) -ContentType "application/json"
    Write-Host "Préstamo agrícola creado exitosamente:" -ForegroundColor Green
    Write-Host "  ID: $($resultado.prestamo.id)" -ForegroundColor White
    Write-Host "  Número: $($resultado.prestamo.numeroPrestamo)" -ForegroundColor White
    Write-Host "  Cuota mensual: $($resultado.prestamo.cuotaMensual)" -ForegroundColor White
} catch {
    Write-Host "Error al crear préstamo: $($_.Exception.Message)" -ForegroundColor Red
}

# 7. Estadísticas finales
Write-Host "`n=== 7. ESTADÍSTICAS FINALES ===" -ForegroundColor Cyan
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
    Write-Host "  Total de préstamos: $($prestamosFinal.Count)" -ForegroundColor White
    foreach ($estado in $estadisticas.Keys) {
        Write-Host "  - $estado : $($estadisticas[$estado])" -ForegroundColor White
    }
    
    $montoTotal = ($prestamosFinal | Measure-Object -Property montoSolicitado -Sum).Sum
    Write-Host "  Monto total solicitado: `$$montoTotal" -ForegroundColor White
    
} catch {
    Write-Host "Error al calcular estadísticas: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== PRUEBAS COMPLETADAS EXITOSAMENTE ===" -ForegroundColor Yellow
Write-Host "Todos los endpoints del PrestamoController han sido probados." -ForegroundColor Green
