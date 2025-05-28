# Script Simple de Validación del Fix
# Prueba directa del endpoint de transacciones

$baseUrl = "http://localhost:8081/api"
$headers = @{"Content-Type" = "application/json"}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VALIDACIÓN SIMPLE DEL FIX DE TRANSACCIONES" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan

# 1. Probar endpoint principal que fallaba
Write-Host "`n1. Probando endpoint /api/transacciones..." -ForegroundColor Green

try {
    $response = Invoke-RestMethod -Method GET -Uri "$baseUrl/transacciones" -Headers $headers -ErrorAction Stop
    Write-Host "✅ ÉXITO: Endpoint /api/transacciones funciona correctamente" -ForegroundColor Green
    Write-Host "Total de transacciones: $($response.Count)" -ForegroundColor White
    
    if ($response.Count -gt 0) {
        $primera = $response[0]
        Write-Host "Primera transacción:" -ForegroundColor Gray
        Write-Host "  - ID: $($primera.id)" -ForegroundColor Gray
        Write-Host "  - Número: $($primera.numeroTransaccion)" -ForegroundColor Gray
        if ($primera.tipoTransaccion) {
            Write-Host "  - Tipo: $($primera.tipoTransaccion.nombre)" -ForegroundColor Gray
        } else {
            Write-Host "  - Tipo: NO ASIGNADO (problema persiste)" -ForegroundColor Red
        }
        Write-Host "  - Estado: $($primera.estado)" -ForegroundColor Gray
    }
    
    Write-Host "`n🎉 FIX CONFIRMADO: El problema HTTP 500 ha sido resuelto" -ForegroundColor Green
    
} catch {
    Write-Host "❌ FALLO: Error en endpoint: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "🔧 El fix necesita revisión adicional" -ForegroundColor Yellow
}

# 2. Verificar tipos de transacción
Write-Host "`n2. Verificando tipos de transacción..." -ForegroundColor Green

try {
    $tipos = Invoke-RestMethod -Method GET -Uri "$baseUrl/tipos-transaccion" -Headers $headers -ErrorAction Stop
    Write-Host "✅ Tipos de transacción disponibles: $($tipos.Count)" -ForegroundColor Green
    
    foreach ($tipo in $tipos) {
        Write-Host "  - $($tipo.nombre): $($tipo.descripcion)" -ForegroundColor Gray
    }
    
} catch {
    Write-Host "❌ Error obteniendo tipos: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "VALIDACIÓN COMPLETADA" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
