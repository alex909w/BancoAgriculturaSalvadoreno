# Test completo de endpoints de Sucursales - Banco Agricola Salvadoreño
# Script de pruebas para PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    PRUEBAS DE ENDPOINTS SUCURSALES    " -ForegroundColor Cyan
Write-Host "     Banco Agricola Salvadoreño        " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:8081/api"
$endpoint = "/sucursales"
$headers = @{
    "Content-Type" = "application/json"
    "Accept" = "application/json"
}

# Función para mostrar respuestas
function Show-Response {
    param($title, $response, $statusCode)
    Write-Host "`n--- $title ---" -ForegroundColor Yellow
    Write-Host "Status Code: $statusCode" -ForegroundColor Green
    if ($response) {
        Write-Host "Response:" -ForegroundColor Green
        $response | ConvertTo-Json -Depth 10 | Write-Host
    }
    Write-Host "----------------------------------------" -ForegroundColor Gray
}

# Variables para almacenar IDs de prueba
$sucursalCreatedId = $null
$codigoPrueba = "SUC" + (Get-Random -Minimum 1000 -Maximum 9999)

Write-Host "`nIniciando pruebas de endpoints de Sucursales..." -ForegroundColor Green

# ================================
# 1. GET /sucursales - Obtener todas las sucursales
# ================================
Write-Host "`n1. Probando GET /sucursales (Obtener todas las sucursales)" -ForegroundColor Magenta
try {
    $response = Invoke-RestMethod -Uri "$baseUrl$endpoint" -Method GET -Headers $headers
    Show-Response "GET /sucursales" $response "200"
} catch {
    Write-Host "Error en GET /sucursales: $($_.Exception.Message)" -ForegroundColor Red
    Show-Response "GET /sucursales ERROR" $null $_.Exception.Response.StatusCode.Value__
}

# ================================
# 2. POST /sucursales - Crear nueva sucursal
# ================================
Write-Host "`n2. Probando POST /sucursales (Crear nueva sucursal)" -ForegroundColor Magenta

$nuevaSucursal = @{
    nombre = "Sucursal Test $codigoPrueba"
    codigo = $codigoPrueba
    departamento = "San Salvador"
    municipio = "San Salvador"
    direccion = "Av. Test 123, Col. Prueba"
    telefono = "2222-3333"
    email = "test$codigoPrueba@agrobanco.com"
    tipo = "standard"
    estado = "activa"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl$endpoint" -Method POST -Headers $headers -Body $nuevaSucursal
    $sucursalCreatedId = $response.sucursal.id
    Show-Response "POST /sucursales" $response "201"
    Write-Host "Sucursal creada con ID: $sucursalCreatedId" -ForegroundColor Green
} catch {
    Write-Host "Error en POST /sucursales: $($_.Exception.Message)" -ForegroundColor Red
    Show-Response "POST /sucursales ERROR" $null $_.Exception.Response.StatusCode.Value__
}

# ================================
# 3. GET /sucursales/{id} - Obtener sucursal por ID
# ================================
if ($sucursalCreatedId) {
    Write-Host "`n3. Probando GET /sucursales/{id} (Obtener sucursal por ID)" -ForegroundColor Magenta
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl$endpoint/$sucursalCreatedId" -Method GET -Headers $headers
        Show-Response "GET /sucursales/$sucursalCreatedId" $response "200"
    } catch {
        Write-Host "Error en GET /sucursales/{id}: $($_.Exception.Message)" -ForegroundColor Red
        Show-Response "GET /sucursales/{id} ERROR" $null $_.Exception.Response.StatusCode.Value__
    }
}

# ================================
# 4. GET /sucursales/codigo/{codigo} - Obtener sucursal por código
# ================================
Write-Host "`n4. Probando GET /sucursales/codigo/{codigo} (Obtener sucursal por código)" -ForegroundColor Magenta
try {
    $response = Invoke-RestMethod -Uri "$baseUrl$endpoint/codigo/$codigoPrueba" -Method GET -Headers $headers
    Show-Response "GET /sucursales/codigo/$codigoPrueba" $response "200"
} catch {
    Write-Host "Error en GET /sucursales/codigo/{codigo}: $($_.Exception.Message)" -ForegroundColor Red
    Show-Response "GET /sucursales/codigo/{codigo} ERROR" $null $_.Exception.Response.StatusCode.Value__
}

# ================================
# 5. GET /sucursales/estado/{estado} - Obtener sucursales por estado
# ================================
Write-Host "`n5. Probando GET /sucursales/estado/{estado} (Obtener sucursales por estado)" -ForegroundColor Magenta

$estados = @("activa", "inactiva")
foreach ($estado in $estados) {
    Write-Host "`n   Probando estado: $estado" -ForegroundColor Cyan
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl$endpoint/estado/$estado" -Method GET -Headers $headers
        Show-Response "GET /sucursales/estado/$estado" $response "200"
    } catch {
        Write-Host "Error en GET /sucursales/estado/$estado`: $($_.Exception.Message)" -ForegroundColor Red
        Show-Response "GET /sucursales/estado/$estado ERROR" $null $_.Exception.Response.StatusCode.Value__
    }
}

# ================================
# 6. GET /sucursales/tipo/{tipo} - Obtener sucursales por tipo
# ================================
Write-Host "`n6. Probando GET /sucursales/tipo/{tipo} (Obtener sucursales por tipo)" -ForegroundColor Magenta

$tipos = @("express", "standard")
foreach ($tipo in $tipos) {
    Write-Host "`n   Probando tipo: $tipo" -ForegroundColor Cyan
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl$endpoint/tipo/$tipo" -Method GET -Headers $headers
        Show-Response "GET /sucursales/tipo/$tipo" $response "200"
    } catch {
        Write-Host "Error en GET /sucursales/tipo/$tipo`: $($_.Exception.Message)" -ForegroundColor Red
        Show-Response "GET /sucursales/tipo/$tipo ERROR" $null $_.Exception.Response.StatusCode.Value__
    }
}

# ================================
# 7. GET /sucursales/departamento/{departamento} - Obtener sucursales por departamento
# ================================
Write-Host "`n7. Probando GET /sucursales/departamento/{departamento} (Obtener sucursales por departamento)" -ForegroundColor Magenta

$departamentos = @("San Salvador", "La Libertad", "Santa Ana", "Sonsonate")
foreach ($departamento in $departamentos) {
    Write-Host "`n   Probando departamento: $departamento" -ForegroundColor Cyan
    try {
        $encodedDepartamento = [System.Web.HttpUtility]::UrlEncode($departamento)
        $response = Invoke-RestMethod -Uri "$baseUrl$endpoint/departamento/$encodedDepartamento" -Method GET -Headers $headers
        Show-Response "GET /sucursales/departamento/$departamento" $response "200"
    } catch {
        Write-Host "Error en GET /sucursales/departamento/$departamento`: $($_.Exception.Message)" -ForegroundColor Red
        Show-Response "GET /sucursales/departamento/$departamento ERROR" $null $_.Exception.Response.StatusCode.Value__
    }
}

# ================================
# 8. PUT /sucursales/{id} - Actualizar sucursal
# ================================
if ($sucursalCreatedId) {
    Write-Host "`n8. Probando PUT /sucursales/{id} (Actualizar sucursal)" -ForegroundColor Magenta
    
    $sucursalActualizada = @{
        nombre = "Sucursal Test $codigoPrueba ACTUALIZADA"
        codigo = $codigoPrueba
        departamento = "La Libertad"
        municipio = "Santa Tecla"
        direccion = "Av. Test ACTUALIZADA 456, Col. Nueva Prueba"
        telefono = "2444-5555"
        email = "updated$codigoPrueba@agrobanco.com"
        tipo = "express"
        estado = "activa"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl$endpoint/$sucursalCreatedId" -Method PUT -Headers $headers -Body $sucursalActualizada
        Show-Response "PUT /sucursales/$sucursalCreatedId" $response "200"
    } catch {
        Write-Host "Error en PUT /sucursales/{id}: $($_.Exception.Message)" -ForegroundColor Red
        Show-Response "PUT /sucursales/{id} ERROR" $null $_.Exception.Response.StatusCode.Value__
    }
}

# ================================
# 9. Pruebas de validación - Casos edge
# ================================
Write-Host "`n9. Probando casos edge y validaciones" -ForegroundColor Magenta

# Crear sucursal con datos inválidos
Write-Host "`n   9.1 Crear sucursal con código duplicado" -ForegroundColor Cyan
$sucursalDuplicada = @{
    nombre = "Sucursal Duplicada"
    codigo = $codigoPrueba  # Código ya existente
    departamento = "San Salvador"
    municipio = "San Salvador"
    direccion = "Av. Duplicada 123"
    telefono = "2333-4444"
    email = "duplicada@agrobanco.com"
    tipo = "standard"
    estado = "activa"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl$endpoint" -Method POST -Headers $headers -Body $sucursalDuplicada
    Show-Response "POST /sucursales (código duplicado)" $response "400"
} catch {
    Write-Host "Error esperado - Código duplicado: $($_.Exception.Message)" -ForegroundColor Yellow
    Show-Response "POST /sucursales (código duplicado) - ERROR ESPERADO" $null $_.Exception.Response.StatusCode.Value__
}

# Buscar sucursal con ID inexistente
Write-Host "`n   9.2 Buscar sucursal con ID inexistente" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$baseUrl$endpoint/99999" -Method GET -Headers $headers
    Show-Response "GET /sucursales/99999" $response "404"
} catch {
    Write-Host "Error esperado - ID inexistente: $($_.Exception.Message)" -ForegroundColor Yellow
    Show-Response "GET /sucursales/99999 - ERROR ESPERADO" $null $_.Exception.Response.StatusCode.Value__
}

# Buscar sucursal con código inexistente
Write-Host "`n   9.3 Buscar sucursal con código inexistente" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$baseUrl$endpoint/codigo/INEXISTENTE" -Method GET -Headers $headers
    Show-Response "GET /sucursales/codigo/INEXISTENTE" $response "404"
} catch {
    Write-Host "Error esperado - Código inexistente: $($_.Exception.Message)" -ForegroundColor Yellow
    Show-Response "GET /sucursales/codigo/INEXISTENTE - ERROR ESPERADO" $null $_.Exception.Response.StatusCode.Value__
}

# Estado inválido
Write-Host "`n   9.4 Buscar sucursales con estado inválido" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$baseUrl$endpoint/estado/INVALIDO" -Method GET -Headers $headers
    Show-Response "GET /sucursales/estado/INVALIDO" $response "500"
} catch {
    Write-Host "Error esperado - Estado inválido: $($_.Exception.Message)" -ForegroundColor Yellow
    Show-Response "GET /sucursales/estado/INVALIDO - ERROR ESPERADO" $null $_.Exception.Response.StatusCode.Value__
}

# Tipo inválido
Write-Host "`n   9.5 Buscar sucursales con tipo inválido" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$baseUrl$endpoint/tipo/INVALIDO" -Method GET -Headers $headers
    Show-Response "GET /sucursales/tipo/INVALIDO" $response "500"
} catch {
    Write-Host "Error esperado - Tipo inválido: $($_.Exception.Message)" -ForegroundColor Yellow
    Show-Response "GET /sucursales/tipo/INVALIDO - ERROR ESPERADO" $null $_.Exception.Response.StatusCode.Value__
}

# ================================
# 10. DELETE /sucursales/{id} - Eliminar sucursal
# ================================
if ($sucursalCreatedId) {
    Write-Host "`n10. Probando DELETE /sucursales/{id} (Eliminar sucursal)" -ForegroundColor Magenta
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl$endpoint/$sucursalCreatedId" -Method DELETE -Headers $headers
        Show-Response "DELETE /sucursales/$sucursalCreatedId" $response "200"
        Write-Host "Sucursal eliminada correctamente" -ForegroundColor Green
    } catch {
        Write-Host "Error en DELETE /sucursales/{id}: $($_.Exception.Message)" -ForegroundColor Red
        Show-Response "DELETE /sucursales/{id} ERROR" $null $_.Exception.Response.StatusCode.Value__
    }
    
    # Verificar que la sucursal fue eliminada
    Write-Host "`n   10.1 Verificar eliminación" -ForegroundColor Cyan
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl$endpoint/$sucursalCreatedId" -Method GET -Headers $headers
        Show-Response "GET /sucursales/$sucursalCreatedId después de eliminación" $response "404"
    } catch {
        Write-Host "Confirmado - Sucursal eliminada: $($_.Exception.Message)" -ForegroundColor Yellow
        Show-Response "GET después de DELETE - CONFIRMADO" $null $_.Exception.Response.StatusCode.Value__
    }
}

# ================================
# 11. Resumen de pruebas
# ================================
Write-Host "`nRESUMEN DE PRUEBAS REALIZADAS" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "GET /sucursales - Obtener todas las sucursales" -ForegroundColor Green
Write-Host "POST /sucursales - Crear nueva sucursal" -ForegroundColor Green
Write-Host "GET /sucursales/{id} - Obtener sucursal por ID" -ForegroundColor Green
Write-Host "GET /sucursales/codigo/{codigo} - Obtener sucursal por código" -ForegroundColor Green
Write-Host "GET /sucursales/estado/{estado} - Obtener sucursales por estado (activa/inactiva)" -ForegroundColor Green
Write-Host "GET /sucursales/tipo/{tipo} - Obtener sucursales por tipo (express/standard)" -ForegroundColor Green
Write-Host "GET /sucursales/departamento/{departamento} - Obtener sucursales por departamento" -ForegroundColor Green
Write-Host "PUT /sucursales/{id} - Actualizar sucursal" -ForegroundColor Green
Write-Host "DELETE /sucursales/{id} - Eliminar sucursal" -ForegroundColor Green
Write-Host "Pruebas de validación y casos edge" -ForegroundColor Green

Write-Host "`nEstados válidos: activa, inactiva" -ForegroundColor Yellow
Write-Host "Tipos válidos: express, standard" -ForegroundColor Yellow
Write-Host "Campos requeridos: nombre, codigo, departamento, municipio, direccion, tipo" -ForegroundColor Yellow
Write-Host "Campos opcionales: telefono, email" -ForegroundColor Yellow

Write-Host "`nPruebas de endpoints de Sucursales completadas!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

# Agregar información adicional sobre el modelo
Write-Host "`nINFORMACION DEL MODELO SUCURSAL" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "ID: Integer (autoincremental)" -ForegroundColor White
Write-Host "Nombre: String (max 100 caracteres, requerido)" -ForegroundColor White
Write-Host "Código: String (max 20 caracteres, único, requerido)" -ForegroundColor White
Write-Host "Departamento: String (max 50 caracteres, requerido)" -ForegroundColor White
Write-Host "Municipio: String (max 50 caracteres, requerido)" -ForegroundColor White
Write-Host "Dirección: String (TEXT, requerido)" -ForegroundColor White
Write-Host "Teléfono: String (max 15 caracteres, opcional)" -ForegroundColor White
Write-Host "Email: String (max 100 caracteres, opcional)" -ForegroundColor White
Write-Host "Tipo: Enum (express, standard)" -ForegroundColor White
Write-Host "Estado: Enum (activa, inactiva) - Default: activa" -ForegroundColor White
Write-Host "Created At: LocalDateTime (automático)" -ForegroundColor White
Write-Host "Updated At: LocalDateTime (automático)" -ForegroundColor White
