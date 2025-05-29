# Script para probar casos adicionales y validaciones del PrestamoController
Write-Host "=== PROBANDO CASOS ADICIONALES Y VALIDACIONES ===" -ForegroundColor Green
Write-Host ""

$baseUrl = "http://localhost:8081/api"

Write-Host "=== 1. PROBANDO VALIDACIONES DE MONTO ===" -ForegroundColor Yellow
Write-Host ""

try {
    # Intentar crear préstamo con monto fuera del rango permitido
    $prestamoInvalido = @{
        cliente = @{ id = 2 }
        tipoPrestamo = @{ id = 1 }  # Personal: min 500, max 10000
        cuentaVinculada = @{ id = 1 }
        montoSolicitado = 15000.00  # Excede el máximo
        tasaInteres = 0.1200
        plazoMeses = 24
        proposito = "Monto excede el límite"
        estado = "solicitado"
    }

    $body = $prestamoInvalido | ConvertTo-Json -Depth 3
    Write-Host "Intentando crear préstamo con monto excesivo ($15,000 para tipo Personal):"
    Write-Host $body -ForegroundColor Cyan
    Write-Host ""

    $response = Invoke-RestMethod -Uri "$baseUrl/prestamos" -Method POST -Body $body -ContentType "application/json"
    Write-Host "Respuesta inesperada (debería fallar):" -ForegroundColor Red
    $response | ConvertTo-Json -Depth 3

} catch {
    Write-Host "Validación correcta - Error esperado:" -ForegroundColor Green
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $errorContent = $reader.ReadToEnd()
        Write-Host $errorContent -ForegroundColor Yellow
    }
    Write-Host ""
}

Write-Host "=== 2. PROBANDO FILTROS POR ESTADO ===" -ForegroundColor Yellow
Write-Host ""

try {
    Write-Host "Obteniendo préstamos por estado 'solicitado':"
    $response = Invoke-RestMethod -Uri "$baseUrl/prestamos/estado/solicitado" -Method GET
    if ($response -and $response.Count -gt 0) {
        Write-Host "Préstamos encontrados: $($response.Count)" -ForegroundColor Green
        foreach ($prestamo in $response) {
            Write-Host "ID: $($prestamo.id) - Estado: $($prestamo.estado)" -ForegroundColor White
        }
    } else {
        Write-Host "No hay préstamos en estado 'solicitado'" -ForegroundColor Yellow
    }
    Write-Host ""

    Write-Host "Obteniendo préstamos por estado 'rechazado':"
    $response = Invoke-RestMethod -Uri "$baseUrl/prestamos/estado/rechazado" -Method GET
    if ($response -and $response.Count -gt 0) {
        Write-Host "Préstamos encontrados: $($response.Count)" -ForegroundColor Green
        foreach ($prestamo in $response) {
            Write-Host "ID: $($prestamo.id) - Estado: $($prestamo.estado) - Observaciones: $($prestamo.observaciones)" -ForegroundColor White
        }
    } else {
        Write-Host "No hay préstamos en estado 'rechazado'" -ForegroundColor Yellow
    }
    Write-Host ""

} catch {
    Write-Host "Error al filtrar préstamos: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

Write-Host "=== 3. PROBANDO BÚSQUEDA POR CLIENTE ===" -ForegroundColor Yellow
Write-Host ""

try {
    Write-Host "Obteniendo préstamos del cliente ID 2:"
    $response = Invoke-RestMethod -Uri "$baseUrl/prestamos/cliente/2" -Method GET
    if ($response -and $response.Count -gt 0) {
        Write-Host "Préstamos encontrados para cliente 2: $($response.Count)" -ForegroundColor Green
        foreach ($prestamo in $response) {
            Write-Host "ID: $($prestamo.id) - Estado: $($prestamo.estado) - Monto: $($prestamo.montoSolicitado)" -ForegroundColor White
        }
    } else {
        Write-Host "No hay préstamos para el cliente 2" -ForegroundColor Yellow
    }
    Write-Host ""

} catch {
    Write-Host "Error al buscar préstamos por cliente: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

Write-Host "=== 4. PROBANDO BÚSQUEDA POR NÚMERO DE PRÉSTAMO ===" -ForegroundColor Yellow
Write-Host ""

try {
    Write-Host "Buscando préstamo por número 'PRE20250505228':"
    $response = Invoke-RestMethod -Uri "$baseUrl/prestamos/numero/PRE20250505228" -Method GET
    if ($response) {
        Write-Host "Préstamo encontrado:" -ForegroundColor Green
        Write-Host "ID: $($response.id) - Estado: $($response.estado) - Monto Aprobado: $($response.montoAprobado)" -ForegroundColor White
    }
    Write-Host ""

} catch {
    Write-Host "Error al buscar préstamo por número: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

Write-Host "=== 5. PROBANDO TRANSICIONES DE ESTADO INVÁLIDAS ===" -ForegroundColor Yellow
Write-Host ""

try {
    # Intentar aprobar un préstamo ya desembolsado
    Write-Host "Intentando aprobar préstamo ya desembolsado (ID 2):"
    $aprobacionData = @{
        montoAprobado = 8000.00
        gerenteId = 1
    }
    
    $body = $aprobacionData | ConvertTo-Json -Depth 2
    $response = Invoke-RestMethod -Uri "$baseUrl/prestamos/2/aprobar" -Method PUT -Body $body -ContentType "application/json"
    Write-Host "Respuesta inesperada (debería fallar):" -ForegroundColor Red
    $response | ConvertTo-Json -Depth 3

} catch {
    Write-Host "Validación correcta - Error esperado para transición inválida:" -ForegroundColor Green
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $errorContent = $reader.ReadToEnd()
        Write-Host $errorContent -ForegroundColor Yellow
    }
    Write-Host ""
}

try {
    # Intentar desembolsar un préstamo rechazado
    Write-Host "Intentando desembolsar préstamo rechazado (ID 3):"
    $desembolsoData = @{
        cajeroId = 3
    }
    
    $body = $desembolsoData | ConvertTo-Json -Depth 2
    $response = Invoke-RestMethod -Uri "$baseUrl/prestamos/3/desembolsar" -Method PUT -Body $body -ContentType "application/json"
    Write-Host "Respuesta inesperada (debería fallar):" -ForegroundColor Red
    $response | ConvertTo-Json -Depth 3

} catch {
    Write-Host "Validación correcta - Error esperado para préstamo rechazado:" -ForegroundColor Green
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $errorContent = $reader.ReadToEnd()
        Write-Host $errorContent -ForegroundColor Yellow
    }
    Write-Host ""
}

Write-Host "=== 6. PROBANDO PRÉSTAMO CON TIPO DIFERENTE ===" -ForegroundColor Yellow
Write-Host ""

try {
    # Crear préstamo automotriz
    $prestamoAutomotriz = @{
        cliente = @{ id = 2 }
        tipoPrestamo = @{ id = 3 }  # Automotriz
        cuentaVinculada = @{ id = 1 }
        montoSolicitado = 25000.00
        tasaInteres = 0.1000
        plazoMeses = 48
        proposito = "Compra de vehículo usado"
        estado = "solicitado"
    }

    $body = $prestamoAutomotriz | ConvertTo-Json -Depth 3
    Write-Host "Creando préstamo automotriz:"
    Write-Host $body -ForegroundColor Cyan
    Write-Host ""

    $response = Invoke-RestMethod -Uri "$baseUrl/prestamos" -Method POST -Body $body -ContentType "application/json"
    if ($response.success) {
        Write-Host "Préstamo automotriz creado exitosamente:" -ForegroundColor Green
        Write-Host "ID: $($response.prestamo.id) - Número: $($response.prestamo.numeroPrestamo)" -ForegroundColor White
        Write-Host "Cuota mensual calculada: $($response.prestamo.cuotaMensual)" -ForegroundColor White
    }
    Write-Host ""

} catch {
    Write-Host "Error al crear préstamo automotriz: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $errorContent = $reader.ReadToEnd()
        Write-Host "Detalles: $errorContent" -ForegroundColor Yellow
    }
    Write-Host ""
}

Write-Host "=== PRUEBAS ADICIONALES COMPLETADAS ===" -ForegroundColor Green
