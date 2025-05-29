# Script para probar diferentes formatos de passwordHash
# Banco Agricultura Salvadoreno - Depuracion de validacion de contrasenas

$BASE_URL = "http://localhost:8081/api"
$USUARIOS_URL = "$BASE_URL/usuarios"

$headers = @{"Content-Type" = "application/json"}

# Diferentes formatos de passwordHash para probar
$passwordFormats = @(
    "password123",
    '$2a$10$examplehashherewithlongstring123456',
    '$2b$12$N9qo8uLOickgx2ZMRZoMye.xjPH.FcVoIDvFv.t3T5UhqGcjOaYGa',
    'pbkdf2:sha256:150000$abcdef$1234567890abcdef1234567890abcdef12345678',
    'scrypt:32768:8:1$salt$hash',
    "hashed_password_with_very_long_string_here_123456789",
    "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
    "securepasswordhashsecurepasswordhashsecurepasswordhash",
    "123456789012345678901234567890",
    "12345678901234567890123456789012345678901234567890"
)

$counter = 1
foreach ($passwordHash in $passwordFormats) {
    Write-Host "`n--- PRUEBA $counter de $($passwordFormats.Count) ---" -ForegroundColor Blue
    Write-Host "Probando passwordHash: $($passwordHash.Substring(0, [Math]::Min(30, $passwordHash.Length)))..." -ForegroundColor Yellow
    Write-Host "Longitud: $($passwordHash.Length) caracteres" -ForegroundColor Gray
    
    $body = @{
        username = "test_pass_$counter"
        email = "test_pass_$counter@agrobanco.com"
        passwordHash = $passwordHash
        nombreCompleto = "Test Password $counter"
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
        $response = Invoke-RestMethod -Uri $USUARIOS_URL -Method POST -Headers $headers -Body $body
        Write-Host "EXITO: Usuario creado con este formato de passwordHash!" -ForegroundColor Green
        Write-Host "Formato exitoso: $passwordHash" -ForegroundColor Green
        $response | ConvertTo-Json -Depth 2
        Write-Host "`nPROBLEMA RESUELTO! Usar este formato de passwordHash en adelante." -ForegroundColor Green -BackgroundColor Black
        break
    } catch {
        Write-Host "FALLO: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        $errorStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorStream)
        $errorBody = $reader.ReadToEnd()
        if ($errorBody -like "*La contrasena es requerida*") {
            Write-Host "   Mismo error de validacion" -ForegroundColor Red
        } else {
            Write-Host "   Error diferente: $errorBody" -ForegroundColor Yellow
        }
    }
    
    $counter++
}

Write-Host "`nANALISIS COMPLETADO" -ForegroundColor Magenta
Write-Host "Si ningun formato funciono, el problema puede ser:" -ForegroundColor Yellow
Write-Host "  1. Autenticacion requerida" -ForegroundColor Gray  
Write-Host "  2. Validacion personalizada en el backend" -ForegroundColor Gray
Write-Host "  3. Campo adicional requerido" -ForegroundColor Gray
Write-Host "  4. Configuracion especifica del servidor" -ForegroundColor Gray
