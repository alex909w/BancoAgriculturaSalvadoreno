# Script de pruebas para los endpoints de Usuario
# Banco Agricultura Salvadoreño - AWrite-Host "`n PRUEBAS DE ENDPOINTS DEL CONTROLADOR DE USUARIO" -ForegroundColor Magenta -BackgroundColor BlackI Spring Boot

# Configuración de la API
$BASE_URL = "http://localhost:8081/api"
$USUARIOS_URL = "$BASE_URL/usuarios"

# Headers para las peticiones
$headers = @{
    "Content-Type" = "application/json"
    "Accept" = "application/json"
}

# Función para mostrar resultados de forma legible
function Show-TestResult {
    param(
        [string]$Title,
        [object]$Response,
        [int]$StatusCode,
        [string]$Method,
        [string]$Url
    )
    
    Write-Host "`n" -NoNewline
    Write-Host "="*80 -ForegroundColor Yellow
    Write-Host " $Title" -ForegroundColor Cyan
    Write-Host "="*80 -ForegroundColor Yellow
    Write-Host "Método: $Method" -ForegroundColor Green
    Write-Host "URL: $Url" -ForegroundColor Green
    Write-Host "Código de Estado: $StatusCode" -ForegroundColor $(if($StatusCode -ge 200 -and $StatusCode -lt 300) { "Green" } else { "Red" })
    
    if ($Response) {
        Write-Host "Respuesta:" -ForegroundColor White
        if ($Response -is [string]) {
            Write-Host $Response -ForegroundColor Gray
        } else {
            $Response | ConvertTo-Json -Depth 3 | Write-Host -ForegroundColor Gray
        }
    }
    Write-Host "="*80 -ForegroundColor Yellow
}

# Función para realizar peticiones HTTP
function Invoke-ApiRequest {
    param(
        [string]$Method,
        [string]$Url,
        [object]$Body = $null,
        [string]$Title
    )
    
    try {
        $requestParams = @{
            Uri = $Url
            Method = $Method
            Headers = $headers
        }
        
        if ($Body) {
            $requestParams.Body = $Body | ConvertTo-Json -Depth 3
        }
        
        $response = Invoke-RestMethod @requestParams
        Show-TestResult -Title $Title -Response $response -StatusCode 200 -Method $Method -Url $Url
        return $response
    }
    catch {
        $statusCode = if ($_.Exception.Response) { $_.Exception.Response.StatusCode.value__ } else { "Error" }
        $errorBody = if ($_.Exception.Response) {
            try {
                $stream = $_.Exception.Response.GetResponseStream()
                $reader = New-Object System.IO.StreamReader($stream)
                $reader.ReadToEnd()
            } catch {
                $_.Exception.Message
            }
        } else {
            $_.Exception.Message
        }
        
        Show-TestResult -Title "$Title (ERROR)" -Response $errorBody -StatusCode $statusCode -Method $Method -Url $Url
        return $null
    }
}

Write-Host "`n" -NoNewline
Write-Host "🏦 PRUEBAS DE ENDPOINTS DEL CONTROLADOR DE USUARIO" -ForegroundColor Magenta -BackgroundColor Black
Write-Host "Base URL: $BASE_URL" -ForegroundColor Yellow
Write-Host "Usuarios URL: $USUARIOS_URL" -ForegroundColor Yellow

# ================================
# 1. GET /usuarios - Obtener todos los usuarios
# ================================
$usuarios = Invoke-ApiRequest -Method "GET" -Url $USUARIOS_URL -Title "1. Obtener todos los usuarios"

# ================================
# 2. GET /usuarios/{id} - Obtener usuario por ID
# ================================
if ($usuarios -and $usuarios.Length -gt 0) {
    $userId = $usuarios[0].id
    Invoke-ApiRequest -Method "GET" -Url "$USUARIOS_URL/$userId" -Title "2. Obtener usuario por ID ($userId)"
} else {
    # Probar con ID 1 por defecto
    Invoke-ApiRequest -Method "GET" -Url "$USUARIOS_URL/1" -Title "2. Obtener usuario por ID (1)"
}

# ================================
# 3. GET /usuarios/username/{username} - Obtener usuario por username
# ================================
if ($usuarios -and $usuarios.Length -gt 0) {
    $username = $usuarios[0].username
    Invoke-ApiRequest -Method "GET" -Url "$USUARIOS_URL/username/$username" -Title "3. Obtener usuario por username ($username)"
} else {
    # Probar con username común
    Invoke-ApiRequest -Method "GET" -Url "$USUARIOS_URL/username/admin" -Title "3. Obtener usuario por username (admin)"
}

# ================================
# 4. GET /usuarios/email/{email} - Obtener usuario por email
# ================================
if ($usuarios -and $usuarios.Length -gt 0) {
    $email = $usuarios[0].email
    Invoke-ApiRequest -Method "GET" -Url "$USUARIOS_URL/email/$email" -Title "4. Obtener usuario por email ($email)"
} else {
    # Probar con email común
    Invoke-ApiRequest -Method "GET" -Url "$USUARIOS_URL/email/admin@agrobanco.com" -Title "4. Obtener usuario por email (admin@agrobanco.com)"
}

# ================================
# 5. GET /usuarios/dui/{dui} - Obtener usuario por DUI
# ================================
if ($usuarios -and $usuarios.Length -gt 0 -and $usuarios[0].dui) {
    $dui = $usuarios[0].dui
    Invoke-ApiRequest -Method "GET" -Url "$USUARIOS_URL/dui/$dui" -Title "5. Obtener usuario por DUI ($dui)"
} else {
    # Probar con DUI ejemplo
    Invoke-ApiRequest -Method "GET" -Url "$USUARIOS_URL/dui/123456789" -Title "5. Obtener usuario por DUI (123456789)"
}

# ================================
# 6. GET /usuarios/rol/{rolNombre} - Obtener usuarios por rol
# ================================
Invoke-ApiRequest -Method "GET" -Url "$USUARIOS_URL/rol/admin" -Title "6. Obtener usuarios por rol (admin)"
Invoke-ApiRequest -Method "GET" -Url "$USUARIOS_URL/rol/cliente" -Title "6. Obtener usuarios por rol (cliente)"

# ================================
# 7. GET /usuarios/sucursal/{sucursalId} - Obtener usuarios por sucursal
# ================================
Invoke-ApiRequest -Method "GET" -Url "$USUARIOS_URL/sucursal/1" -Title "7. Obtener usuarios por sucursal (1)"

# ================================
# 8. POST /usuarios - Crear nuevo usuario
# ================================
$nuevoUsuario = @{
    username = "test_user_$(Get-Date -Format 'yyyyMMddHHmmss')"
    email = "test$(Get-Date -Format 'yyyyMMddHHmmss')@agrobanco.com"
    passwordHash = "password123"
    nombreCompleto = "Usuario de Prueba"
    dui = "$(Get-Random -Minimum 100000000 -Maximum 999999999)"
    telefono = "7$(Get-Random -Minimum 1000000 -Maximum 9999999)"
    direccion = "San Salvador, El Salvador"
    fechaNacimiento = "1990-01-01"
    genero = "M"
    profesion = "Ingeniero"
    salario = 1200.00
    rol = @{
        id = 1
    }
    sucursal = @{
        id = 1
    }
    estado = "activo"
}

$usuarioCreado = Invoke-ApiRequest -Method "POST" -Url $USUARIOS_URL -Body $nuevoUsuario -Title "8. Crear nuevo usuario"

# ================================
# 9. PUT /usuarios/{id} - Actualizar usuario
# ================================
if ($usuarioCreado -and $usuarioCreado.usuario) {
    $usuarioId = $usuarioCreado.usuario.id
    $usuarioActualizado = @{
        username = $usuarioCreado.usuario.username
        email = $usuarioCreado.usuario.email
        passwordHash = $usuarioCreado.usuario.passwordHash
        nombreCompleto = "Usuario de Prueba ACTUALIZADO"
        dui = $usuarioCreado.usuario.dui
        telefono = "7$(Get-Random -Minimum 1000000 -Maximum 9999999)"
        direccion = "Nueva dirección - San Salvador"
        fechaNacimiento = $usuarioCreado.usuario.fechaNacimiento
        genero = $usuarioCreado.usuario.genero
        profesion = "Ingeniero Senior"
        salario = 1500.00
        rol = $usuarioCreado.usuario.rol
        sucursal = $usuarioCreado.usuario.sucursal
        estado = $usuarioCreado.usuario.estado
    }
    
    Invoke-ApiRequest -Method "PUT" -Url "$USUARIOS_URL/$usuarioId" -Body $usuarioActualizado -Title "9. Actualizar usuario ($usuarioId)"
} else {
    Write-Host "No se pudo obtener el ID del usuario creado para la prueba de actualización" -ForegroundColor Yellow
}

# ================================
# 10. PUT /usuarios/{id}/estado - Cambiar estado del usuario
# ================================
if ($usuarioCreado -and $usuarioCreado.usuario) {
    $usuarioId = $usuarioCreado.usuario.id
    $cambioEstado = @{
        estado = "suspendido"
    }
    
    Invoke-ApiRequest -Method "PUT" -Url "$USUARIOS_URL/$usuarioId/estado" -Body $cambioEstado -Title "10. Cambiar estado del usuario ($usuarioId) a suspendido"
    
    # Cambiar de vuelta a activo
    $cambioEstado.estado = "activo"
    Invoke-ApiRequest -Method "PUT" -Url "$USUARIOS_URL/$usuarioId/estado" -Body $cambioEstado -Title "10. Cambiar estado del usuario ($usuarioId) a activo"
} else {
    Write-Host "No se pudo obtener el ID del usuario para la prueba de cambio de estado" -ForegroundColor Yellow
}

# ================================
# 11. DELETE /usuarios/{id} - Eliminar usuario
# ================================
if ($usuarioCreado -and $usuarioCreado.usuario) {
    $usuarioId = $usuarioCreado.usuario.id
    Invoke-ApiRequest -Method "DELETE" -Url "$USUARIOS_URL/$usuarioId" -Title "11. Eliminar usuario ($usuarioId)"
} else {
    Write-Host "No se pudo obtener el ID del usuario para la prueba de eliminación" -ForegroundColor Yellow
}

# ================================
# 12. Casos de error - Usuarios no encontrados
# ================================
Invoke-ApiRequest -Method "GET" -Url "$USUARIOS_URL/99999" -Title "12. Usuario no encontrado por ID (99999)"
Invoke-ApiRequest -Method "GET" -Url "$USUARIOS_URL/username/usuario_inexistente" -Title "12. Usuario no encontrado por username"
Invoke-ApiRequest -Method "GET" -Url "$USUARIOS_URL/email/inexistente@test.com" -Title "12. Usuario no encontrado por email"

# ================================
# 13. Casos de error - Datos inválidos para creación
# ================================
$usuarioInvalido = @{
    username = ""  # Username vacío
    email = "email-invalido"  # Email inválido
    passwordHash = ""  # Password vacío
    nombreCompleto = ""  # Nombre vacío
}

Invoke-ApiRequest -Method "POST" -Url $USUARIOS_URL -Body $usuarioInvalido -Title "13. Crear usuario con datos inválidos"

Write-Host "`n" -NoNewline
Write-Host "PRUEBAS COMPLETADAS" -ForegroundColor Green -BackgroundColor Black
Write-Host "Resumen de pruebas realizadas:" -ForegroundColor White
Write-Host "   • GET /usuarios - Listar todos los usuarios" -ForegroundColor Gray
Write-Host "   • GET /usuarios/{id} - Obtener usuario por ID" -ForegroundColor Gray
Write-Host "   • GET /usuarios/username/{username} - Obtener usuario por username" -ForegroundColor Gray
Write-Host "   • GET /usuarios/email/{email} - Obtener usuario por email" -ForegroundColor Gray
Write-Host "   • GET /usuarios/dui/{dui} - Obtener usuario por DUI" -ForegroundColor Gray
Write-Host "   • GET /usuarios/rol/{rolNombre} - Obtener usuarios por rol" -ForegroundColor Gray
Write-Host "   • GET /usuarios/sucursal/{sucursalId} - Obtener usuarios por sucursal" -ForegroundColor Gray
Write-Host "   • POST /usuarios - Crear nuevo usuario" -ForegroundColor Gray
Write-Host "   • PUT /usuarios/{id} - Actualizar usuario" -ForegroundColor Gray
Write-Host "   • PUT /usuarios/{id}/estado - Cambiar estado del usuario" -ForegroundColor Gray
Write-Host "   • DELETE /usuarios/{id} - Eliminar usuario" -ForegroundColor Gray
Write-Host "   • Casos de error y validaciones" -ForegroundColor Gray

Write-Host "`nNota: Asegurate de que la aplicacion Spring Boot este ejecutandose en http://localhost:8081" -ForegroundColor Yellow
