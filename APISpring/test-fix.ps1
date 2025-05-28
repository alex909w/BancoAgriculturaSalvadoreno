# Script para probar la corrección del endpoint de transacciones
Write-Host "=== PROBANDO CORRECCIÓN DEL ENDPOINT DE TRANSACCIONES ===" -ForegroundColor Green

# Probar si la aplicación está ejecutándose
Write-Host "`n1. Verificando si la aplicación está ejecutándose..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/health" -Method GET -TimeoutSec 5
    Write-Host "✓ Aplicación ejecutándose correctamente" -ForegroundColor Green
    Write-Host "Estado: $($healthResponse.status)" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Error: La aplicación no está ejecutándose en puerto 8081" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Probar el endpoint de transacciones que estaba fallando
Write-Host "`n2. Probando endpoint de transacciones..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8081/api/transacciones" -Method GET -TimeoutSec 10
    Write-Host "✓ ¡ÉXITO! El endpoint de transacciones ahora funciona correctamente" -ForegroundColor Green
    Write-Host "Número de transacciones encontradas: $($response.Count)" -ForegroundColor Cyan
    
    if ($response.Count -gt 0) {
        Write-Host "`nPrimera transacción:" -ForegroundColor Cyan
        $firstTransaction = $response[0]
        Write-Host "- ID: $($firstTransaction.id)" -ForegroundColor White
        Write-Host "- Número: $($firstTransaction.numeroTransaccion)" -ForegroundColor White
        Write-Host "- Monto: $($firstTransaction.monto)" -ForegroundColor White
        Write-Host "- Estado: $($firstTransaction.estado)" -ForegroundColor White
        Write-Host "- Tipo: $($firstTransaction.tipoTransaccion.nombre)" -ForegroundColor White
    }
} catch {
    Write-Host "✗ Error: El endpoint de transacciones sigue fallando" -ForegroundColor Red
    Write-Host "Código de estado: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    # Si el error es HTTP 500, mostrar que necesitamos reiniciar la aplicación
    if ($_.Exception.Response.StatusCode -eq 500) {
        Write-Host "`n⚠️  La aplicación necesita ser reiniciada para aplicar las correcciones" -ForegroundColor Yellow
    }
}

Write-Host "`n=== FIN DE PRUEBAS ===" -ForegroundColor Green
