# Script final para resolver el problema de creación de usuarios
# Banco Agricultura Salvadoreno - Prueba con campo 'password'

$BASE_URL = "http://localhost:8081/api"
$USUARIOS_URL = "$BASE_URL/usuarios"

Write-Host "=== SOLUCION FINAL: PROBANDO CAMPO 'password' ===" -ForegroundColor Green

$headers = @{"Content-Type" = "application/json"}

# Probar con campo 'password' en lugar de 'passwordHash'
Write-Host "`n--- PRUEBA CON CAMPO 'password' ---" -ForegroundColor Cyan

$usuarioData = @{
    username = "test_final_solution"
    email = "test_final@agrobanco.com"
    password = "password123"
    nombreCompleto = "Test Final Solution"
    dui = "99999999-9"
    telefono = "75551234"
    direccion = "Test Address Final"
    fechaNacimiento = "1990-01-01"
    genero = "M"
    profesion = "Test"
    salario = 1000.00
    rol = @{id = 4}
    sucursal = @{id = 1}
    estado = "activo"
} | ConvertTo-Json -Depth 3

Write-Host "Datos a enviar:" -ForegroundColor Yellow
Write-Host $usuarioData -ForegroundColor Gray

try {
    $response = Invoke-RestMethod -Uri $USUARIOS_URL -Method POST -Headers $headers -Body $usuarioData
    Write-Host "`nEXITO: Usuario creado exitosamente!" -ForegroundColor Green -BackgroundColor Black
    Write-Host "Respuesta del servidor:" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 2) -ForegroundColor Green
    
    Write-Host "`nSOLUCION ENCONTRADA:" -ForegroundColor Green -BackgroundColor Black
    Write-Host "- Usar campo 'password' en lugar de 'passwordHash'" -ForegroundColor Green
    Write-Host "- No requiere autenticacion para crear usuarios" -ForegroundColor Green
    Write-Host "- El backend acepta contraseñas en texto plano" -ForegroundColor Green
    
} catch {
    Write-Host "`nFALLO PERSISTENTE" -ForegroundColor Red
    $errorStream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($errorStream)
    $errorBody = $reader.ReadToEnd()
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Error: $errorBody" -ForegroundColor Red
    
    if ($errorBody -like "*password*") {
        Write-Host "`nDIAGNOSTICO ADICIONAL NECESARIO:" -ForegroundColor Yellow
        Write-Host "- El problema puede estar en otro campo" -ForegroundColor Yellow
        Write-Host "- Verificar modelo Usuario en el backend" -ForegroundColor Yellow
        Write-Host "- Posible problema de base de datos" -ForegroundColor Yellow
    }
}

Write-Host "`n=== FIN DE DIAGNOSTICO ===" -ForegroundColor Magenta
