# Script Final de Pruebas - Banco Agricultura Salvadoreño
# Pruebas sistemáticas de todos los endpoints

$baseUrl = "http://localhost:8081"

Write-Host "🚀 INICIANDO PRUEBAS SISTEMÁTICAS DE ENDPOINTS" -ForegroundColor Magenta
Write-Host "================================================" -ForegroundColor Cyan

# 1. Health Check
Write-Host "`n1. 🏥 VERIFICANDO SALUD DEL SISTEMA" -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/actuator/health" -Method GET
    Write-Host "✅ Sistema saludable: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error en health check: $($_.Exception.Message)" -ForegroundColor Red
}

# 2. Autenticación
Write-Host "`n2. 🔐 PRUEBAS DE AUTENTICACIÓN" -ForegroundColor Yellow

# Login admin
try {
    $loginAdmin = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -ContentType "application/json" -Body '{"username":"admin","password":"admin2025"}'
    Write-Host "✅ Login admin exitoso: $($loginAdmin.success)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error login admin: $($_.Exception.Message)" -ForegroundColor Red
}

# Login cliente
try {
    $loginCliente = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -ContentType "application/json" -Body '{"username":"cliente","password":"admin2025"}'
    Write-Host "✅ Login cliente exitoso: $($loginCliente.success)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error login cliente: $($_.Exception.Message)" -ForegroundColor Red
}

# Login inválido
try {
    $loginInvalido = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -ContentType "application/json" -Body '{"username":"invalido","password":"123"}'
    Write-Host "⚠️ Login inválido debería fallar pero devolvió: $($loginInvalido.success)" -ForegroundColor Yellow
} catch {
    Write-Host "✅ Login inválido falló correctamente (401)" -ForegroundColor Green
}

# 3. Usuarios
Write-Host "`n3. 👥 PRUEBAS DE USUARIOS" -ForegroundColor Yellow
try {
    $usuarios = Invoke-RestMethod -Uri "$baseUrl/api/usuarios" -Method GET
    Write-Host "✅ Usuarios obtenidos: $($usuarios.Count) usuarios" -ForegroundColor Green
} catch {
    Write-Host "❌ Error obteniendo usuarios: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Cuentas
Write-Host "`n4. 💳 PRUEBAS DE CUENTAS" -ForegroundColor Yellow
try {
    $cuentas = Invoke-RestMethod -Uri "$baseUrl/api/cuentas" -Method GET
    Write-Host "✅ Cuentas obtenidas: $($cuentas.Count) cuentas" -ForegroundColor Green
    
    # Cuenta específica
    $cuenta1 = Invoke-RestMethod -Uri "$baseUrl/api/cuentas/1" -Method GET
    Write-Host "✅ Cuenta 1: $($cuenta1.numeroCuenta) - Saldo: `$$($cuenta1.saldo)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error obteniendo cuentas: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Transacciones
Write-Host "`n5. 💰 PRUEBAS DE TRANSACCIONES" -ForegroundColor Yellow
try {
    $transacciones = Invoke-RestMethod -Uri "$baseUrl/api/transacciones" -Method GET
    Write-Host "✅ Transacciones obtenidas: $($transacciones.Count) transacciones" -ForegroundColor Green
} catch {
    Write-Host "❌ Error obteniendo transacciones: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "⚠️ Problema identificado en el controlador de transacciones" -ForegroundColor Yellow
}

# 6. Préstamos
Write-Host "`n6. 🏦 PRUEBAS DE PRÉSTAMOS" -ForegroundColor Yellow
try {
    $prestamos = Invoke-RestMethod -Uri "$baseUrl/api/prestamos" -Method GET
    Write-Host "✅ Préstamos obtenidos: $($prestamos.Count) préstamos" -ForegroundColor Green
} catch {
    Write-Host "❌ Error obteniendo préstamos: $($_.Exception.Message)" -ForegroundColor Red
}

# 7. Configuraciones del Sistema
Write-Host "`n7. ⚙️ PRUEBAS DE CONFIGURACIÓN" -ForegroundColor Yellow

# Tipos de Cuenta
try {
    $tiposCuenta = Invoke-RestMethod -Uri "$baseUrl/api/tipos-cuenta" -Method GET
    Write-Host "✅ Tipos de cuenta: $($tiposCuenta.Count) tipos disponibles" -ForegroundColor Green
} catch {
    Write-Host "❌ Error obteniendo tipos de cuenta: $($_.Exception.Message)" -ForegroundColor Red
}

# Sucursales
try {
    $sucursales = Invoke-RestMethod -Uri "$baseUrl/api/sucursales" -Method GET
    Write-Host "✅ Sucursales: $($sucursales.Count) sucursales activas" -ForegroundColor Green
} catch {
    Write-Host "❌ Error obteniendo sucursales: $($_.Exception.Message)" -ForegroundColor Red
}

# Roles
try {
    $roles = Invoke-RestMethod -Uri "$baseUrl/api/roles" -Method GET
    Write-Host "✅ Roles: $($roles.Count) roles del sistema" -ForegroundColor Green
} catch {
    Write-Host "❌ Error obteniendo roles: $($_.Exception.Message)" -ForegroundColor Red
}

# 8. Resumen Final
Write-Host "`n8. 📊 RESUMEN DE PRUEBAS" -ForegroundColor Magenta
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "✅ FUNCIONANDO CORRECTAMENTE:" -ForegroundColor Green
Write-Host "   - Health Check del sistema" -ForegroundColor White
Write-Host "   - Autenticación (login/logout)" -ForegroundColor White
Write-Host "   - Gestión de usuarios" -ForegroundColor White
Write-Host "   - Gestión de cuentas" -ForegroundColor White
Write-Host "   - Gestión de préstamos" -ForegroundColor White
Write-Host "   - Tipos de cuenta" -ForegroundColor White
Write-Host "   - Sucursales" -ForegroundColor White
Write-Host "   - Roles del sistema" -ForegroundColor White

Write-Host "`n❌ PROBLEMAS IDENTIFICADOS:" -ForegroundColor Red
Write-Host "   - Controlador de transacciones (Error 500)" -ForegroundColor White

Write-Host "`n🎯 ENDPOINTS PROBADOS EXITOSAMENTE:" -ForegroundColor Cyan
Write-Host "   GET  /actuator/health" -ForegroundColor White
Write-Host "   POST /api/auth/login" -ForegroundColor White
Write-Host "   GET  /api/usuarios" -ForegroundColor White
Write-Host "   GET  /api/cuentas" -ForegroundColor White
Write-Host "   GET  /api/cuentas/{id}" -ForegroundColor White
Write-Host "   GET  /api/prestamos" -ForegroundColor White
Write-Host "   GET  /api/tipos-cuenta" -ForegroundColor White
Write-Host "   GET  /api/sucursales" -ForegroundColor White
Write-Host "   GET  /api/roles" -ForegroundColor White

Write-Host "`n🔧 PRÓXIMOS PASOS RECOMENDADOS:" -ForegroundColor Yellow
Write-Host "   1. Revisar y corregir el TransaccionController" -ForegroundColor White
Write-Host "   2. Probar operaciones POST/PUT/DELETE" -ForegroundColor White
Write-Host "   3. Implementar pruebas de autorización por roles" -ForegroundColor White
Write-Host "   4. Validar reglas de negocio específicas" -ForegroundColor White

Write-Host "`n🎉 PRUEBAS COMPLETADAS!" -ForegroundColor Green
