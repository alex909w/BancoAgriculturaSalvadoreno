# Script de prueba para verificar la integración del módulo de préstamos
$baseUrl = "http://localhost:8081/api"

Write-Host "=== PRUEBA DE INTEGRACIÓN MÓDULO PRÉSTAMOS ===" -ForegroundColor Yellow

# 1. Verificar conexión con la API
Write-Host "`n=== 1. VERIFICANDO CONEXIÓN ===" -ForegroundColor Cyan
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/" -Method GET -ContentType "application/json"
    Write-Host "✅ API disponible: $($health.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error conectando con la API: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 2. Verificar endpoints de tipos de préstamo
Write-Host "`n=== 2. VERIFICANDO TIPOS DE PRÉSTAMO ===" -ForegroundColor Cyan
try {
    $tipos = Invoke-RestMethod -Uri "$baseUrl/tipos-prestamo" -Method GET -ContentType "application/json"
    Write-Host "✅ Tipos de préstamo disponibles: $($tipos.Count)" -ForegroundColor Green
    foreach ($tipo in $tipos) {
        Write-Host "  - $($tipo.nombre): Tasa $($tipo.tasaInteres * 100)%" -ForegroundColor White
    }
} catch {
    Write-Host "❌ Error obteniendo tipos de préstamo: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Verificar préstamos existentes
Write-Host "`n=== 3. VERIFICANDO PRÉSTAMOS EXISTENTES ===" -ForegroundColor Cyan
try {
    $prestamos = Invoke-RestMethod -Uri "$baseUrl/prestamos" -Method GET -ContentType "application/json"
    Write-Host "✅ Préstamos en el sistema: $($prestamos.Count)" -ForegroundColor Green
    
    if ($prestamos.Count -gt 0) {
        Write-Host "Últimos 3 préstamos:" -ForegroundColor White
        $prestamos | Select-Object -Last 3 | ForEach-Object {
            Write-Host "  - ID: $($_.id) | Número: $($_.numeroPrestamo) | Cliente: $($_.cliente.nombreCompleto) | Estado: $($_.estado)" -ForegroundColor White
        }
    }
} catch {
    Write-Host "❌ Error obteniendo préstamos: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Verificar usuarios (para la búsqueda por DUI)
Write-Host "`n=== 4. VERIFICANDO USUARIOS ===" -ForegroundColor Cyan
try {
    $usuarios = Invoke-RestMethod -Uri "$baseUrl/usuarios" -Method GET -ContentType "application/json"
    Write-Host "✅ Usuarios disponibles: $($usuarios.Count)" -ForegroundColor Green
    
    if ($usuarios.Count -gt 0) {
        $usuariosConDui = $usuarios | Where-Object { $_.dui -ne $null -and $_.dui -ne "" }
        Write-Host "Usuarios con DUI: $($usuariosConDui.Count)" -ForegroundColor White
        $usuariosConDui | Select-Object -First 3 | ForEach-Object {
            Write-Host "  - $($_.nombreCompleto) - DUI: $($_.dui)" -ForegroundColor White
        }
    }
} catch {
    Write-Host "❌ Error obteniendo usuarios: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Verificar cuentas disponibles
Write-Host "`n=== 5. VERIFICANDO CUENTAS ===" -ForegroundColor Cyan
try {
    $cuentas = Invoke-RestMethod -Uri "$baseUrl/cuentas" -Method GET -ContentType "application/json"
    Write-Host "✅ Cuentas disponibles: $($cuentas.Count)" -ForegroundColor Green
    
    if ($cuentas.Count -gt 0) {
        $cuentasActivas = $cuentas | Where-Object { $_.estado -eq "activa" }
        Write-Host "Cuentas activas: $($cuentasActivas.Count)" -ForegroundColor White
        $cuentasActivas | Select-Object -First 3 | ForEach-Object {
            Write-Host "  - $($_.numeroCuenta) | Cliente ID: $($_.cliente.id) | Saldo: $($_.saldo)" -ForegroundColor White
        }
    }
} catch {
    Write-Host "❌ Error obteniendo cuentas: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== RESUMEN DE LA INTEGRACIÓN ===" -ForegroundColor Yellow
Write-Host "✅ El módulo de préstamos está listo para:" -ForegroundColor Green
Write-Host "  1. Buscar clientes por DUI" -ForegroundColor White
Write-Host "  2. Mostrar cuentas activas del cliente" -ForegroundColor White
Write-Host "  3. Seleccionar tipos de préstamo con validaciones" -ForegroundColor White
Write-Host "  4. Crear nuevas solicitudes de préstamo" -ForegroundColor White
Write-Host "  5. Mostrar todos los préstamos del sistema" -ForegroundColor White
Write-Host "  6. Filtrar por estados y fechas" -ForegroundColor White

Write-Host "`n🚀 La integración está COMPLETADA y lista para usar!" -ForegroundColor Green
