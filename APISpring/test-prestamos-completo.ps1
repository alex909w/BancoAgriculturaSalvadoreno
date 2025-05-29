# Script corregido para probar endpoints POST y PUT del PrestamoController
# Asegúrate de que el servidor esté corriendo en localhost:8081

Write-Host "=== PROBANDO ENDPOINTS POST Y PUT DEL PRESTAMO CONTROLLER (CORREGIDO) ===" -ForegroundColor Green
Write-Host ""

# URL base
$baseUrl = "http://localhost:8081/api"

Write-Host "=== 1. PROBANDO POST /prestamos - Crear nuevo préstamo ===" -ForegroundColor Yellow
Write-Host ""

try {
    # Crear préstamo con datos completos incluyendo tasaInteres del tipo de préstamo
    $nuevoPrestamo = @{
        cliente = @{ id = 2 }
        tipoPrestamo = @{ id = 4 }  # Tipo Agrícola
        cuentaVinculada = @{ id = 1 }  # Cuenta existente del cliente
        montoSolicitado = 15000.00
        tasaInteres = 0.0900  # Tasa del tipo agrícola
        plazoMeses = 24
        proposito = "Compra de equipos agrícolas y semillas"
        estado = "solicitado"
        tieneSeguroVida = false
        cobrosAutomaticos = true
    }

    $body = $nuevoPrestamo | ConvertTo-Json -Depth 3
    Write-Host "Body del request para nuevo préstamo:"
    Write-Host $body -ForegroundColor Cyan
    Write-Host ""

    $response = Invoke-RestMethod -Uri "$baseUrl/prestamos" -Method POST -Body $body -ContentType "application/json"
    Write-Host "Respuesta del servidor:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5
    Write-Host ""

    # Guardar el ID del nuevo préstamo para las siguientes pruebas
    if ($response.prestamo) {
        $nuevoPrestamoId = $response.prestamo.id
        Write-Host "Nuevo préstamo creado con ID: $nuevoPrestamoId" -ForegroundColor Green
    }

} catch {
    Write-Host "Error al crear préstamo: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $errorContent = $reader.ReadToEnd()
        Write-Host "Detalles del error: $errorContent" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "=== 2. PROBANDO PUT /prestamos/{id}/aprobar - Aprobar préstamo ===" -ForegroundColor Yellow
Write-Host ""

try {
    # Usar el préstamo recién creado o crear uno específico para aprobar
    $prestamoIdParaAprobar = if ($nuevoPrestamoId) { $nuevoPrestamoId } else { 
        # Crear otro préstamo para aprobar
        $prestamoAprobacion = @{
            cliente = @{ id = 2 }
            tipoPrestamo = @{ id = 1 }  # Tipo Personal
            cuentaVinculada = @{ id = 1 }
            montoSolicitado = 8000.00
            tasaInteres = 0.1200
            plazoMeses = 12
            proposito = "Gastos personales"
            estado = "solicitado"
        }
        
        $bodyAprobacion = $prestamoAprobacion | ConvertTo-Json -Depth 3
        Write-Host "Creando préstamo para aprobar:"
        Write-Host $bodyAprobacion -ForegroundColor Cyan
        
        $responseAprobacion = Invoke-RestMethod -Uri "$baseUrl/prestamos" -Method POST -Body $bodyAprobacion -ContentType "application/json"
        $responseAprobacion.prestamo.id
    }
    
    # Datos para aprobar el préstamo
    $aprobacionData = @{
        montoAprobado = 7500.00
        gerenteId = 1  # ID del gerente que aprueba
    }
    
    $bodyAprobacion = $aprobacionData | ConvertTo-Json -Depth 2
    Write-Host "Datos para aprobar préstamo ID $prestamoIdParaAprobar"
    Write-Host $bodyAprobacion -ForegroundColor Cyan
    Write-Host ""
    
    $response = Invoke-RestMethod -Uri "$baseUrl/prestamos/$prestamoIdParaAprobar/aprobar" -Method PUT -Body $bodyAprobacion -ContentType "application/json"
    Write-Host "Respuesta al aprobar préstamo:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5
    Write-Host ""

} catch {
    Write-Host "Error al aprobar préstamo: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $errorContent = $reader.ReadToEnd()
        Write-Host "Detalles del error: $errorContent" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "=== 3. PROBANDO PUT /prestamos/{id}/desembolsar - Desembolsar préstamo ===" -ForegroundColor Yellow
Write-Host ""

try {
    # Usar el préstamo que acabamos de aprobar
    $prestamoIdParaDesembolsar = $prestamoIdParaAprobar
    
    # Datos para desembolsar
    $desembolsoData = @{
        cajeroId = 3  # ID del cajero que desembolsa
    }
    
    $bodyDesembolso = $desembolsoData | ConvertTo-Json -Depth 2
    Write-Host "Datos para desembolsar préstamo ID $prestamoIdParaDesembolsar"
    Write-Host $bodyDesembolso -ForegroundColor Cyan
    Write-Host ""
    
    $response = Invoke-RestMethod -Uri "$baseUrl/prestamos/$prestamoIdParaDesembolsar/desembolsar" -Method PUT -Body $bodyDesembolso -ContentType "application/json"
    Write-Host "Respuesta al desembolsar préstamo:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5
    Write-Host ""

} catch {
    Write-Host "Error al desembolsar préstamo: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $errorContent = $reader.ReadToEnd()
        Write-Host "Detalles del error: $errorContent" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "=== 4. CREANDO PRÉSTAMO PARA PROBAR RECHAZO ===" -ForegroundColor Yellow
Write-Host ""

try {
    # Crear otro préstamo para rechazar
    $prestamoParaRechazar = @{
        cliente = @{ id = 2 }
        tipoPrestamo = @{ id = 2 }  # Tipo Hipotecario
        cuentaVinculada = @{ id = 1 }
        montoSolicitado = 75000.00
        tasaInteres = 0.0800
        plazoMeses = 120
        proposito = "Compra de vivienda"
        estado = "solicitado"
    }

    $bodyRechazo = $prestamoParaRechazar | ConvertTo-Json -Depth 3
    Write-Host "Creando préstamo para rechazar:"
    Write-Host $bodyRechazo -ForegroundColor Cyan
    Write-Host ""

    $response = Invoke-RestMethod -Uri "$baseUrl/prestamos" -Method POST -Body $bodyRechazo -ContentType "application/json"
    Write-Host "Préstamo creado para rechazar:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5
    Write-Host ""

    if ($response.prestamo) {
        $prestamoParaRechazarId = $response.prestamo.id
    }

} catch {
    Write-Host "Error al crear préstamo para rechazar: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

Write-Host "=== 5. PROBANDO PUT /prestamos/{id}/rechazar - Rechazar préstamo ===" -ForegroundColor Yellow
Write-Host ""

try {
    if ($prestamoParaRechazarId) {
        # Datos para rechazar
        $rechazoData = @{
            observaciones = "No cumple con los requisitos de ingresos mínimos para el monto solicitado"
        }
        
        $bodyRechazoData = $rechazoData | ConvertTo-Json -Depth 2
        Write-Host "Datos para rechazar préstamo ID $prestamoParaRechazarId"
        Write-Host $bodyRechazoData -ForegroundColor Cyan
        Write-Host ""
        
        $response = Invoke-RestMethod -Uri "$baseUrl/prestamos/$prestamoParaRechazarId/rechazar" -Method PUT -Body $bodyRechazoData -ContentType "application/json"
        Write-Host "Respuesta al rechazar préstamo:" -ForegroundColor Green
        $response | ConvertTo-Json -Depth 5
        Write-Host ""
    } else {
        Write-Host "No se pudo crear el préstamo para rechazar" -ForegroundColor Red
    }

} catch {
    Write-Host "Error al rechazar préstamo: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
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
    
    if ($response -is [Array]) {
        Write-Host "Total de préstamos en el sistema: $($response.Count)" -ForegroundColor Green
        foreach ($prestamo in $response) {
            Write-Host "ID: $($prestamo.id) - Número: $($prestamo.numeroPrestamo) - Estado: $($prestamo.estado) - Monto: $($prestamo.montoSolicitado)" -ForegroundColor White
        }
    } else {
        $response | ConvertTo-Json -Depth 5
    }
    Write-Host ""

} catch {
    Write-Host "Error al obtener préstamos: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

Write-Host "=== PRUEBAS COMPLETADAS ===" -ForegroundColor Green
Write-Host ""
Write-Host "Resumen de pruebas realizadas:" -ForegroundColor Yellow
Write-Host "1. POST /prestamos - Crear prestamo" -ForegroundColor White
Write-Host "2. PUT /prestamos/{id}/aprobar - Aprobar prestamo" -ForegroundColor White
Write-Host "3. PUT /prestamos/{id}/desembolsar - Desembolsar prestamo" -ForegroundColor White
Write-Host "4. PUT /prestamos/{id}/rechazar - Rechazar prestamo" -ForegroundColor White
Write-Host "5. GET /prestamos - Verificar estado final" -ForegroundColor White
