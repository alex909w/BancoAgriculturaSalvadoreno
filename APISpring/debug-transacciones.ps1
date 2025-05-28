# Script para debuggear el endpoint de transacciones
param(
    [string]$BaseUrl = "http://localhost:8081"
)

Write-Host "🔍 DEBUGGING ENDPOINT /api/transacciones" -ForegroundColor Cyan
Write-Host "========================================"

# Función para probar endpoints
function Test-Endpoint {
    param(
        [string]$Url,
        [string]$Description
    )
    
    Write-Host "`n🔍 Probando: $Description" -ForegroundColor Yellow
    Write-Host "URL: $Url" -ForegroundColor Gray
    
    try {
        $response = Invoke-RestMethod -Uri $Url -Method GET -ErrorAction Stop
        Write-Host "✅ ÉXITO - Respuesta recibida" -ForegroundColor Green
        Write-Host "Elementos encontrados: $($response.Count)" -ForegroundColor Green
        
        if ($response.Count -gt 0) {
            $primer = $response[0]
            Write-Host "Primer elemento:" -ForegroundColor Gray
            Write-Host "  ID: $($primer.id)" -ForegroundColor Gray
            Write-Host "  Número: $($primer.numeroTransaccion)" -ForegroundColor Gray
            if ($primer.tipoTransaccion) {
                Write-Host "  Tipo: $($primer.tipoTransaccion.nombre)" -ForegroundColor Gray
            } else {
                Write-Host "  ❌ Tipo: NULL - ¡PROBLEMA DETECTADO!" -ForegroundColor Red
            }
        }
        
        return $true
    }
    catch {
        Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
            Write-Host "Status Description: $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
        }
        return $false
    }
}

# 1. Verificar que el servidor esté ejecutándose
Write-Host "`n1. Verificando servidor..." -ForegroundColor Green
$serverOk = Test-Endpoint "$BaseUrl/api/tipos-transaccion" "Tipos de transacción (control)"

if (-not $serverOk) {
    Write-Host "❌ El servidor no está respondiendo. Verifica que esté ejecutándose." -ForegroundColor Red
    exit 1
}

# 2. Probar endpoint problemático
Write-Host "`n2. Probando endpoint problemático..." -ForegroundColor Green
$transaccionesOk = Test-Endpoint "$BaseUrl/api/transacciones" "Todas las transacciones"

# 3. Probar endpoints relacionados
Write-Host "`n3. Probando endpoints relacionados..." -ForegroundColor Green
Test-Endpoint "$BaseUrl/api/cuentas" "Cuentas (para verificar datos relacionados)"

# 4. Conclusiones
Write-Host "`n📊 RESUMEN DEL DIAGNÓSTICO" -ForegroundColor Cyan
Write-Host "=========================="

if ($transaccionesOk) {
    Write-Host "✅ El endpoint /api/transacciones está funcionando" -ForegroundColor Green
    Write-Host "🎉 ¡El problema parece estar resuelto!" -ForegroundColor Green
} else {
    Write-Host "❌ El endpoint /api/transacciones sigue fallando" -ForegroundColor Red
    Write-Host "🔧 Se requiere investigación adicional" -ForegroundColor Yellow
    
    Write-Host "`nPosibles causas restantes:" -ForegroundColor Yellow
    Write-Host "- Problema en lazy loading de relaciones" -ForegroundColor Yellow
    Write-Host "- Error de codificación en nombres de tipos" -ForegroundColor Yellow
    Write-Host "- Datos corruptos en la base de datos" -ForegroundColor Yellow
    Write-Host "- Configuración de serialización JSON" -ForegroundColor Yellow
}

}

Write-Host "`n🏁 Diagnóstico completado." -ForegroundColor Cyan
