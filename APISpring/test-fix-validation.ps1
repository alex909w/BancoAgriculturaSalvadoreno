# Script de Pruebas Actualizado - Sistema Bancario Agro Banco Salvadoreño
# Fecha: 27 de Mayo, 2025
# Estado: POST-FIX - Correcciones aplicadas al endpoint de transacciones

# Configuración
$baseUrl = "http://localhost:8081/api"
$headers = @{"Content-Type" = "application/json"}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "BANCO AGRICULTURA SALVADOREÑO - PRUEBAS POST-FIX" -ForegroundColor Yellow
Write-Host "Validación de correcciones en TransaccionService" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan

# Función para realizar solicitudes HTTP con manejo de errores
function Invoke-ApiRequest {
    param(
        [string]$Method,
        [string]$Uri,
        [hashtable]$Headers,
        [string]$Body = $null
    )
    
    try {
        if ($Body) {
            $response = Invoke-RestMethod -Method $Method -Uri $Uri -Headers $Headers -Body $Body -ErrorAction Stop
        } else {
            $response = Invoke-RestMethod -Method $Method -Uri $Uri -Headers $Headers -ErrorAction Stop
        }
        return @{ Success = $true; Data = $response; Error = $null }
    }
    catch {
        return @{ Success = $false; Data = $null; Error = $_.Exception.Message }
    }
}

# 1. VERIFICAR TIPOS DE TRANSACCIÓN (CRÍTICO)
Write-Host "`n1. Verificando tipos de transacción disponibles..." -ForegroundColor Green
$tiposResult = Invoke-ApiRequest -Method "GET" -Uri "$baseUrl/tipos-transaccion" -Headers $headers

if ($tiposResult.Success) {
    Write-Host "✅ Tipos de transacción obtenidos exitosamente" -ForegroundColor Green
    Write-Host "Total de tipos: $($tiposResult.Data.Count)" -ForegroundColor White
    
    foreach ($tipo in $tiposResult.Data) {
        Write-Host "  - $($tipo.nombre): $($tipo.descripcion)" -ForegroundColor Gray
    }
} else {
    Write-Host "❌ Error obteniendo tipos de transacción: $($tiposResult.Error)" -ForegroundColor Red
    Write-Host "⚠️  Los tipos de transacción son necesarios para las pruebas" -ForegroundColor Yellow
}

# 2. PROBAR ENDPOINT PRINCIPAL DE TRANSACCIONES (FIX PRINCIPAL)
Write-Host "`n2. Probando endpoint principal de transacciones..." -ForegroundColor Green
$transaccionesResult = Invoke-ApiRequest -Method "GET" -Uri "$baseUrl/transacciones" -Headers $headers

if ($transaccionesResult.Success) {
    Write-Host "✅ ÉXITO: Endpoint /api/transacciones funcionando correctamente" -ForegroundColor Green
    Write-Host "Total de transacciones: $($transaccionesResult.Data.Count)" -ForegroundColor White
    
    if ($transaccionesResult.Data.Count -gt 0) {
        $primeraTransaccion = $transaccionesResult.Data[0]
        Write-Host "Primera transacción:" -ForegroundColor Gray
        Write-Host "  - ID: $($primeraTransaccion.id)" -ForegroundColor Gray
        Write-Host "  - Número: $($primeraTransaccion.numeroTransaccion)" -ForegroundColor Gray
        Write-Host "  - Tipo: $($primeraTransaccion.tipoTransaccion.nombre)" -ForegroundColor Gray
        Write-Host "  - Estado: $($primeraTransaccion.estado)" -ForegroundColor Gray
    }
} else {
    Write-Host "❌ FALLO: Error en endpoint /api/transacciones: $($transaccionesResult.Error)" -ForegroundColor Red
    Write-Host "🔧 Verificar que el servidor esté ejecutándose y la base de datos conectada" -ForegroundColor Yellow
}

# 3. VERIFICAR OTROS ENDPOINTS CRÍTICOS
Write-Host "`n3. Verificando otros endpoints del sistema..." -ForegroundColor Green

$endpoints = @(
    @{Name = "Usuarios"; Url = "$baseUrl/usuarios"},
    @{Name = "Cuentas"; Url = "$baseUrl/cuentas"},
    @{Name = "Préstamos"; Url = "$baseUrl/prestamos"},
    @{Name = "Sucursales"; Url = "$baseUrl/sucursales"}
)

$endpointsOk = 0
foreach ($endpoint in $endpoints) {
    $result = Invoke-ApiRequest -Method "GET" -Uri $endpoint.Url -Headers $headers
    if ($result.Success) {
        Write-Host "✅ $($endpoint.Name): OK ($($result.Data.Count) registros)" -ForegroundColor Green
        $endpointsOk++
    } else {
        Write-Host "❌ $($endpoint.Name): Error - $($result.Error)" -ForegroundColor Red
    }
}

# 4. PRUEBAS DE TRANSACCIONES (SI HAY CUENTAS DISPONIBLES)
Write-Host "`n4. Verificando cuentas para pruebas de transacciones..." -ForegroundColor Green
$cuentasResult = Invoke-ApiRequest -Method "GET" -Uri "$baseUrl/cuentas" -Headers $headers

if ($cuentasResult.Success -and $cuentasResult.Data.Count -gt 0) {
    Write-Host "✅ Cuentas disponibles para pruebas: $($cuentasResult.Data.Count)" -ForegroundColor Green
    
    # Obtener primera cuenta activa para pruebas
    $cuentaActiva = $cuentasResult.Data | Where-Object { $_.estado -eq "activa" } | Select-Object -First 1
    
    if ($cuentaActiva) {
        Write-Host "📋 Cuenta de prueba seleccionada:" -ForegroundColor Cyan
        Write-Host "  - ID: $($cuentaActiva.id)" -ForegroundColor Gray
        Write-Host "  - Número: $($cuentaActiva.numeroCuenta)" -ForegroundColor Gray
        Write-Host "  - Saldo: $($cuentaActiva.saldo)" -ForegroundColor Gray
        
        # Intentar crear una transacción de depósito pequeña (prueba real del fix)
        Write-Host "`n5. Probando creación de transacción (depósito de prueba)..." -ForegroundColor Green
        $depositoData = @{
            cuentaId = $cuentaActiva.id
            monto = 10.00
            cajeroId = 1
            sucursalId = 1
            descripcion = "Depósito de prueba - Validación del fix"
        } | ConvertTo-Json
        
        $depositoResult = Invoke-ApiRequest -Method "POST" -Uri "$baseUrl/transacciones/deposito" -Headers $headers -Body $depositoData
        
        if ($depositoResult.Success) {
            Write-Host "✅ ÉXITO CRÍTICO: Transacción de depósito creada correctamente" -ForegroundColor Green
            Write-Host "🎉 FIX CONFIRMADO: El problema del TipoTransaccion ha sido resuelto" -ForegroundColor Yellow
            Write-Host "Transacción creada:" -ForegroundColor Gray
            Write-Host "  - ID: $($depositoResult.Data.transaccion.id)" -ForegroundColor Gray
            Write-Host "  - Número: $($depositoResult.Data.transaccion.numeroTransaccion)" -ForegroundColor Gray
            Write-Host "  - Tipo: $($depositoResult.Data.transaccion.tipoTransaccion.nombre)" -ForegroundColor Gray
        } else {
            Write-Host "❌ FALLO: Error creando transacción de depósito: $($depositoResult.Error)" -ForegroundColor Red
            Write-Host "🔧 El fix puede necesitar ajustes adicionales" -ForegroundColor Yellow
        }
    } else {
        Write-Host "⚠️  No hay cuentas activas disponibles para pruebas" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  No hay cuentas disponibles para pruebas de transacciones" -ForegroundColor Yellow
}

# RESUMEN FINAL
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "RESUMEN DE VALIDACIÓN POST-FIX" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan

if ($transaccionesResult.Success) {
    Write-Host "🎯 RESULTADO PRINCIPAL: ✅ ÉXITO" -ForegroundColor Green
    Write-Host "   El endpoint /api/transacciones está funcionando" -ForegroundColor Green
} else {
    Write-Host "🎯 RESULTADO PRINCIPAL: ❌ FALLO" -ForegroundColor Red
    Write-Host "   El endpoint /api/transacciones sigue fallando" -ForegroundColor Red
}

Write-Host "📊 Endpoints funcionando: $endpointsOk/4" -ForegroundColor White
$porcentaje = [math]::Round(($endpointsOk/4) * 100, 1)
Write-Host "📈 Porcentaje de éxito del sistema: $porcentaje%" -ForegroundColor White

if ($tiposResult.Success) {
    Write-Host "✅ Tipos de transacción: Disponibles" -ForegroundColor Green
} else {
    Write-Host "❌ Tipos de transacción: No disponibles" -ForegroundColor Red
}

Write-Host "`n🔧 CAMBIOS IMPLEMENTADOS:" -ForegroundColor Cyan
Write-Host "   - Agregada dependencia TipoTransaccionService" -ForegroundColor Gray
Write-Host "   - Asignación de TipoTransaccion en todos los métodos" -ForegroundColor Gray
Write-Host "   - Datos iniciales en data.sql" -ForegroundColor Gray
Write-Host "   - Configuración de inicialización automática" -ForegroundColor Gray

Write-Host "`n✨ Pruebas completadas a las $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Cyan
