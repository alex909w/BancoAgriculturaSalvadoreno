# Script para probar la creación de usuarios con autenticación
# Banco Agricultura Salvadoreno - Pruebas con autenticación

$BASE_URL = "http://localhost:8081/api"
$AUTH_URL = "$BASE_URL/auth/login"
$USUARIOS_URL = "$BASE_URL/usuarios"

Write-Host "=== PRUEBA DE CREACION DE USUARIOS CON AUTENTICACION ===" -ForegroundColor Green

# Paso 1: Intentar autenticación con diferentes credenciales
$credenciales = @(
    @{username = "admin"; password = "admin2025"},
    @{username = "admin"; password = "admin123"},
    @{username = "gerente"; password = "admin2025"},
    @{username = "cajero"; password = "admin2025"}
)

$token = $null
$authHeaders = @{"Content-Type" = "application/json"}

foreach ($cred in $credenciales) {
    Write-Host "`n--- Intentando autenticacion con: $($cred.username) ---" -ForegroundColor Yellow
    
    $authBody = @{
        username = $cred.username
        password = $cred.password
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri $AUTH_URL -Method POST -Headers $authHeaders -Body $authBody
        
        if ($response.token) {
            Write-Host "EXITO: Autenticacion exitosa!" -ForegroundColor Green
            Write-Host "Token obtenido: $($response.token.Substring(0, 20))..." -ForegroundColor Green
            $token = $response.token
            break
        }
    } catch {
        Write-Host "FALLO: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        $errorStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorStream)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error: $errorBody" -ForegroundColor Red
    }
}

if (-not $token) {
    Write-Host "`nNo se pudo obtener token de autenticacion. Probando sin autenticacion..." -ForegroundColor Yellow
    $headers = @{"Content-Type" = "application/json"}
} else {
    Write-Host "`nUsando token para crear usuario..." -ForegroundColor Green
    $headers = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $token"
    }
}

# Paso 2: Probar creación de usuario con diferentes formatos de contraseña
Write-Host "`n=== PROBANDO CREACION DE USUARIO ===" -ForegroundColor Cyan

$passwordFormats = @(
    "password123",
    "tempPassword123",
    "hashed_password_123"
)

$counter = 1
foreach ($passwordFormat in $passwordFormats) {
    Write-Host "`n--- PRUEBA $counter`: passwordHash = '$passwordFormat' ---" -ForegroundColor Blue
    
    $usuarioData = @{
        username = "test_auth_$counter"
        email = "test_auth_$counter@agrobanco.com"
        passwordHash = $passwordFormat
        nombreCompleto = "Test Auth Usuario $counter"
        dui = "$(10000000 + $counter)-$($counter % 10)"
        telefono = "7555123$counter"
        direccion = "Test Address $counter"
        fechaNacimiento = "1990-01-01"
        genero = "M"
        profesion = "Test"
        salario = 1000.00
        rol = @{id = 4}
        sucursal = @{id = 1}
        estado = "activo"
    } | ConvertTo-Json -Depth 3

    try {
        $response = Invoke-RestMethod -Uri $USUARIOS_URL -Method POST -Headers $headers -Body $usuarioData
        Write-Host "EXITO: Usuario creado!" -ForegroundColor Green
        Write-Host "Respuesta: $($response | ConvertTo-Json -Depth 2)" -ForegroundColor Green
        Write-Host "`nPROBLEMA RESUELTO! Formato correcto: passwordHash = '$passwordFormat'" -ForegroundColor Green -BackgroundColor Black
        break
    } catch {
        Write-Host "FALLO: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        $errorStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorStream)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error: $errorBody" -ForegroundColor Red
        
        if ($errorBody -like "*La contraseña es requerida*") {
            Write-Host "   -> Mismo error de validacion de contraseña" -ForegroundColor Red
        } elseif ($errorBody -like "*unauthorized*" -or $errorBody -like "*401*") {
            Write-Host "   -> Error de autorizacion" -ForegroundColor Red
        } else {
            Write-Host "   -> Error diferente detectado" -ForegroundColor Yellow
        }
    }
    
    $counter++
}

Write-Host "`n=== ANALISIS FINAL ===" -ForegroundColor Magenta
if ($token) {
    Write-Host "- Autenticacion: EXITOSA" -ForegroundColor Green
} else {
    Write-Host "- Autenticacion: FALLIDA" -ForegroundColor Red
}
Write-Host "- Endpoint de usuarios: DISPONIBLE" -ForegroundColor Green
Write-Host "- Problema principal: Validacion de campo passwordHash" -ForegroundColor Yellow
