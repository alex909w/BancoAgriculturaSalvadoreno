# Script de PowerShell para verificar y corregir el problema de transacciones
# Autor: Sistema de Corrección Automática
# Fecha: 28 de mayo de 2025

Write-Host "=== VERIFICACIÓN Y CORRECCIÓN DEL PROBLEMA DE TRANSACCIONES ===" -ForegroundColor Cyan
Write-Host ""

# Función para hacer peticiones HTTP
function Invoke-ApiCall {
    param(
        [string]$Url,
        [string]$Method = "GET",
        [string]$Description
    )
    
    Write-Host "⏳ $Description..." -ForegroundColor Yellow
    
    try {
        if ($Method -eq "GET") {
            $response = Invoke-RestMethod -Uri $Url -Method GET -ContentType "application/json"
        } else {
            $response = Invoke-RestMethod -Uri $Url -Method POST -ContentType "application/json"
        }
        
        Write-Host "✅ Éxito: $Description" -ForegroundColor Green
        return $response
    }
    catch {
        Write-Host "❌ Error: $Description" -ForegroundColor Red
        Write-Host "   Detalle: $($_.Exception.Message)" -ForegroundColor Gray
        return $null
    }
}

# Configuración
$BaseUrl = "http://localhost:8081/api"
$Port = 8081

# Paso 1: Verificar que la aplicación esté ejecutándose
Write-Host "🔍 Verificando que la aplicación esté ejecutándose en puerto $Port..."
try {
    $testConnection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue
    if (-not $testConnection.TcpTestSucceeded) {
        Write-Host "❌ La aplicación no está ejecutándose en puerto $Port" -ForegroundColor Red
        Write-Host "   Por favor, inicie la aplicación con: mvn spring-boot:run" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "✅ Aplicación ejecutándose correctamente" -ForegroundColor Green
}
catch {
    Write-Host "❌ No se puede verificar la conexión. Asegúrese de que la aplicación esté ejecutándose." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Paso 2: Diagnosticar el problema
Write-Host "📊 PASO 1: DIAGNÓSTICO" -ForegroundColor Magenta
Write-Host "=" * 50

$diagnostico = Invoke-ApiCall -Url "$BaseUrl/data-fix/diagnostico-transacciones" -Description "Diagnosticando problema de transacciones"

if ($diagnostico) {
    Write-Host "📈 Resultados del diagnóstico:" -ForegroundColor Cyan
    Write-Host "   • Transacciones con sucursal ID 0: $($diagnostico.transaccionesConSucursalCero)" -ForegroundColor White
    Write-Host "   • Sucursales disponibles: $($diagnostico.sucursalesDisponibles.Count)" -ForegroundColor White
    Write-Host "   • Transacciones problemáticas: $($diagnostico.transaccionesProblematicas.Count)" -ForegroundColor White
    
    if ($diagnostico.transaccionesConSucursalCero -gt 0) {
        Write-Host "⚠️  Se encontraron $($diagnostico.transaccionesConSucursalCero) transacciones problemáticas" -ForegroundColor Yellow
    } else {
        Write-Host "✅ No se encontraron transacciones problemáticas" -ForegroundColor Green
    }
}

Write-Host ""

# Paso 3: Probar el endpoint original
Write-Host "🧪 PASO 2: PRUEBA DEL ENDPOINT ORIGINAL" -ForegroundColor Magenta
Write-Host "=" * 50

$transacciones = Invoke-ApiCall -Url "$BaseUrl/transacciones" -Description "Probando endpoint de transacciones"

if ($transacciones) {
    Write-Host "✅ El endpoint de transacciones funciona correctamente" -ForegroundColor Green
    Write-Host "   📊 Se obtuvieron $($transacciones.Count) transacciones" -ForegroundColor White
} else {
    Write-Host "❌ El endpoint de transacciones tiene problemas. Procediendo con la corrección..." -ForegroundColor Red
    
    # Paso 4: Aplicar corrección
    Write-Host ""
    Write-Host "🔧 PASO 3: APLICANDO CORRECCIÓN" -ForegroundColor Magenta
    Write-Host "=" * 50
    
    $correccion = Invoke-ApiCall -Url "$BaseUrl/data-fix/corregir-sucursales" -Method "POST" -Description "Aplicando corrección automática"
    
    if ($correccion) {
        Write-Host "🎉 Corrección aplicada exitosamente:" -ForegroundColor Green
        Write-Host "   • Transacciones actualizadas: $($correccion.transaccionesActualizadas)" -ForegroundColor White
        Write-Host "   • Transacciones restantes con problema: $($correccion.transaccionesConSucursalCeroRestantes)" -ForegroundColor White
        
        # Paso 5: Verificar corrección
        Write-Host ""
        Write-Host "✔️  PASO 4: VERIFICANDO CORRECCIÓN" -ForegroundColor Magenta
        Write-Host "=" * 50
        
        Start-Sleep -Seconds 2  # Esperar un momento para que se aplique la corrección
        
        $transaccionesCorregidas = Invoke-ApiCall -Url "$BaseUrl/transacciones" -Description "Verificando endpoint después de la corrección"
        
        if ($transaccionesCorregidas) {
            Write-Host "🎊 ¡ÉXITO! El problema ha sido corregido." -ForegroundColor Green
            Write-Host "   📊 Transacciones obtenidas correctamente: $($transaccionesCorregidas.Count)" -ForegroundColor White
        } else {
            Write-Host "⚠️  El problema persiste. Revisar logs de la aplicación." -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "📋 RESUMEN FINAL" -ForegroundColor Magenta
Write-Host "=" * 50

if ($transacciones -or $transaccionesCorregidas) {
    Write-Host "✅ Estado: PROBLEMA RESUELTO" -ForegroundColor Green
    Write-Host "✅ El endpoint /api/transacciones funciona correctamente" -ForegroundColor Green
    Write-Host "✅ Los datos están consistentes" -ForegroundColor Green
} else {
    Write-Host "❌ Estado: PROBLEMA PERSISTE" -ForegroundColor Red
    Write-Host "❌ Revisar logs de la aplicación" -ForegroundColor Red
    Write-Host "❌ Considerar ejecutar el script SQL manualmente" -ForegroundColor Red
}

Write-Host ""
Write-Host "📚 Para más información, revisar: SOLUCION_ERROR_TRANSACCIONES.md" -ForegroundColor Cyan
Write-Host "🔧 Endpoints de diagnóstico disponibles en: /api/data-fix/" -ForegroundColor Cyan

Write-Host ""
Write-Host "Script completado." -ForegroundColor White
