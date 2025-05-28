# Script de pruebas CORREGIDO para los endpoints de Usuario
# Banco Agricultura Salvadoreno - API Spring Boot

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
    Write-Host "Metodo: $Method" -ForegroundColor Green
    Write-Host "URL: $Url" -ForegroundColor Green
    Write-Host "Codigo de Estado: $StatusCode" -ForegroundColor $(if($StatusCode -ge 200 -and $StatusCode -lt 300) { "Green" } else { "Red" })
    
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

Write-Host "`n PRUEBAS CORREGIDAS DE ENDPOINTS DEL CONTROLADOR DE USUARIO" -ForegroundColor Magenta -BackgroundColor Black
Write-Host "Base URL: $BASE_URL" -ForegroundColor Yellow
Write-Host "Usuarios URL: $USUARIOS_URL" -ForegroundColor Yellow

# ================================
# PRUEBA DE CREACION CON USUARIO VALIDO
# ================================
$nuevoUsuarioValido = @{
    username = "testuser_$(Get-Date -Format 'yyyyMMddHHmmss')"
    email = "testuser$(Get-Date -Format 'yyyyMMddHHmmss')@agrobanco.com"
    passwordHash = 'hashed_password_123'  # Contraseña hasheada simulada
    nombreCompleto = "Usuario de Prueba Completo"
    dui = "$(Get-Random -Minimum 100000000 -Maximum 999999999)"
    telefono = "7$(Get-Random -Minimum 1000000 -Maximum 9999999)"
    direccion = "Calle Principal #123, San Salvador, El Salvador"
    fechaNacimiento = "1990-05-15"
    genero = "M"
    profesion = "Ingeniero de Software"
    salario = 1500.00
    rol = @{
        id = 4  # ID del rol cliente
    }
    sucursal = @{
        id = 1  # ID de la sucursal central
    }
    estado = "activo"
}

$usuarioCreado = Invoke-ApiRequest -Method "POST" -Url $USUARIOS_URL -Body $nuevoUsuarioValido -Title "CREAR USUARIO VALIDO"

# ================================
# PRUEBAS DE ACTUALIZACION
# ================================
if ($usuarioCreado -and $usuarioCreado.usuario) {
    $usuarioId = $usuarioCreado.usuario.id
    Write-Host "`nUsuario creado exitosamente con ID: $usuarioId" -ForegroundColor Green
    
    # Preparar datos para actualización
    $usuarioActualizado = @{
        username = $usuarioCreado.usuario.username
        email = $usuarioCreado.usuario.email
        passwordHash = $usuarioCreado.usuario.passwordHash
        nombreCompleto = "Usuario de Prueba ACTUALIZADO"
        dui = $usuarioCreado.usuario.dui
        telefono = "7$(Get-Random -Minimum 1000000 -Maximum 9999999)"
        direccion = "Nueva direccion actualizada - San Salvador"
        fechaNacimiento = $usuarioCreado.usuario.fechaNacimiento
        genero = $usuarioCreado.usuario.genero
        profesion = "Ingeniero Senior Actualizado"
        salario = 2000.00
        rol = $usuarioCreado.usuario.rol
        sucursal = $usuarioCreado.usuario.sucursal
        estado = $usuarioCreado.usuario.estado
    }
    
    # Actualizar usuario
    Invoke-ApiRequest -Method "PUT" -Url "$USUARIOS_URL/$usuarioId" -Body $usuarioActualizado -Title "ACTUALIZAR USUARIO ($usuarioId)"
    
    # Verificar actualización
    Invoke-ApiRequest -Method "GET" -Url "$USUARIOS_URL/$usuarioId" -Title "VERIFICAR ACTUALIZACION ($usuarioId)"
    
    # Cambiar estado del usuario
    $cambioEstado = @{
        estado = "suspendido"
    }
    
    Invoke-ApiRequest -Method "PUT" -Url "$USUARIOS_URL/$usuarioId/estado" -Body $cambioEstado -Title "CAMBIAR ESTADO A SUSPENDIDO ($usuarioId)"
    
    # Verificar cambio de estado
    Invoke-ApiRequest -Method "GET" -Url "$USUARIOS_URL/$usuarioId" -Title "VERIFICAR CAMBIO DE ESTADO ($usuarioId)"
    
    # Cambiar de vuelta a activo
    $cambioEstado.estado = "activo"
    Invoke-ApiRequest -Method "PUT" -Url "$USUARIOS_URL/$usuarioId/estado" -Body $cambioEstado -Title "CAMBIAR ESTADO A ACTIVO ($usuarioId)"
    
    # Eliminar usuario de prueba
    Invoke-ApiRequest -Method "DELETE" -Url "$USUARIOS_URL/$usuarioId" -Title "ELIMINAR USUARIO DE PRUEBA ($usuarioId)"
    
    # Verificar eliminación
    Invoke-ApiRequest -Method "GET" -Url "$USUARIOS_URL/$usuarioId" -Title "VERIFICAR ELIMINACION ($usuarioId) - Debe dar 404"
}

# ================================
# PRUEBAS DE VALIDACION Y ERRORES
# ================================

# Intentar crear usuario con username duplicado
$usuarioDuplicado = @{
    username = "admin"  # Username que ya existe
    email = "nuevo@test.com"
    passwordHash = "password123"
    nombreCompleto = "Usuario Duplicado"
    rol = @{ id = 4 }
    sucursal = @{ id = 1 }
}

Invoke-ApiRequest -Method "POST" -Url $USUARIOS_URL -Body $usuarioDuplicado -Title "CREAR USUARIO CON USERNAME DUPLICADO (Debe fallar)"

# Intentar crear usuario con email duplicado
$usuarioEmailDuplicado = @{
    username = "nuevo_usuario"
    email = "admin@agrobanco.com"  # Email que ya existe
    passwordHash = "password123"
    nombreCompleto = "Usuario Email Duplicado"
    rol = @{ id = 4 }
    sucursal = @{ id = 1 }
}

Invoke-ApiRequest -Method "POST" -Url $USUARIOS_URL -Body $usuarioEmailDuplicado -Title "CREAR USUARIO CON EMAIL DUPLICADO (Debe fallar)"

# ================================
# PRUEBAS DE BUSQUEDA ESPECIALES
# ================================

# Buscar usuarios por rol específico
Invoke-ApiRequest -Method "GET" -Url "$USUARIOS_URL/rol/gerente" -Title "BUSCAR USUARIOS POR ROL GERENTE"

# Buscar usuarios por sucursal específica  
Invoke-ApiRequest -Method "GET" -Url "$USUARIOS_URL/sucursal/4" -Title "BUSCAR USUARIOS POR SUCURSAL 4"

# Buscar usuario con DUI real
Invoke-ApiRequest -Method "GET" -Url "$USUARIOS_URL/dui/04676578-9" -Title "BUSCAR USUARIO POR DUI REAL"

Write-Host "`nPRUEBAS COMPLETADAS" -ForegroundColor Green -BackgroundColor Black
Write-Host "Funcionalidades probadas:" -ForegroundColor White
Write-Host "  * Creacion de usuario con datos validos" -ForegroundColor Gray
Write-Host "  * Actualizacion de usuario existente" -ForegroundColor Gray
Write-Host "  * Cambio de estado de usuario" -ForegroundColor Gray
Write-Host "  * Eliminacion de usuario" -ForegroundColor Gray
Write-Host "  * Validacion de datos duplicados" -ForegroundColor Gray
Write-Host "  * Busquedas por diferentes criterios" -ForegroundColor Gray
Write-Host "  * Manejo de errores y validaciones" -ForegroundColor Gray

Write-Host "`nNota: La aplicacion debe estar ejecutandose en http://localhost:8081" -ForegroundColor Yellow
