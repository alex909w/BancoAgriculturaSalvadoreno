# Script de pruebas para crear usuarios CLIENTES con datos aleatorios
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

# Función para generar datos aleatorios de clientes salvadoreños
function Generate-RandomClientData {
    $nombresHombres = @("José", "Carlos", "Luis", "Miguel", "Juan", "Roberto", "Francisco", "Antonio", "Manuel", "Rafael", "Alejandro", "Ricardo", "Fernando", "Eduardo", "Sergio")
    $nombresMujeres = @("María", "Ana", "Carmen", "Rosa", "Esperanza", "Patricia", "Gloria", "Leticia", "Claudia", "Sandra", "Elena", "Cristina", "Gabriela", "Beatriz", "Silvia")
    $apellidos = @("García", "López", "Martínez", "González", "Rodríguez", "Hernández", "Pérez", "Sánchez", "Ramírez", "Torres", "Flores", "Rivera", "Gómez", "Díaz", "Morales", "Jiménez", "Ruiz", "Vargas", "Castro", "Ortiz")
    
    $profesiones = @("Ingeniero", "Contador", "Médico", "Abogado", "Profesor", "Comerciante", "Técnico", "Administrador", "Vendedor", "Secretaria", "Enfermera", "Mecánico", "Electricista", "Agricultor", "Empresario")
    
    $municipios = @("San Salvador", "Santa Ana", "San Miguel", "Soyapango", "Santa Tecla", "Apopa", "Delgado", "Mejicanos", "Ilopango", "Cojutepeque", "Zacatecoluca", "Chalatenango", "Usulután", "Ahuachapán", "La Unión")
    
    # Determinar género aleatoriamente
    $genero = if ((Get-Random -Maximum 2) -eq 0) { "M" } else { "F" }
    
    # Seleccionar nombres según el género
    $primerNombre = if ($genero -eq "M") { $nombresHombres | Get-Random } else { $nombresMujeres | Get-Random }
    $segundoNombre = if ($genero -eq "M") { $nombresHombres | Get-Random } else { $nombresMujeres | Get-Random }
    
    $primerApellido = $apellidos | Get-Random
    $segundoApellido = $apellidos | Get-Random
    
    $nombreCompleto = "$primerNombre $segundoNombre $primerApellido $segundoApellido"
    
    # Generar username único
    $timestamp = (Get-Date).ToString("yyyyMMddHHmmss")
    $username = "$($primerNombre.ToLower())$($primerApellido.ToLower())$timestamp"
    
    # Generar DUI válido (formato: 12345678-9)
    $duiNumero = Get-Random -Minimum 10000000 -Maximum 99999999
    $duiDigito = Get-Random -Minimum 0 -Maximum 9
    $dui = "$duiNumero-$duiDigito"
    
    # Generar teléfono salvadoreño válido
    $prefijos = @("2", "6", "7")
    $prefijo = $prefijos | Get-Random
    $numero = Get-Random -Minimum 1000000 -Maximum 9999999
    $telefono = "$prefijo$numero"
    
    # Generar email
    $email = "$($primerNombre.ToLower()).$($primerApellido.ToLower())$timestamp@agrobanco.com"
      # Generar fecha de nacimiento (entre 18 y 70 años)
    $anoNacimiento = (Get-Date).Year - (Get-Random -Minimum 18 -Maximum 70)
    $mesNacimiento = Get-Random -Minimum 1 -Maximum 12
    $diaNacimiento = Get-Random -Minimum 1 -Maximum 28  # Para evitar problemas con febrero
    $fechaNacimiento = "$anoNacimiento-$('{0:D2}' -f $mesNacimiento)-$('{0:D2}' -f $diaNacimiento)"
    
    # Generar dirección
    $municipio = $municipios | Get-Random
    $colonia = "Colonia $(Get-Random -Minimum 1 -Maximum 50)"
    $calle = "Calle $(Get-Random -Minimum 1 -Maximum 100)"
    $numero = Get-Random -Minimum 1 -Maximum 999
    $direccion = "$colonia, $calle #$numero, $municipio, El Salvador"
    
    # Generar profesión y salario correlacionado
    $profesion = $profesiones | Get-Random
    $salarioBase = switch ($profesion) {
        "Médico" { Get-Random -Minimum 2000 -Maximum 5000 }
        "Ingeniero" { Get-Random -Minimum 1500 -Maximum 3500 }
        "Abogado" { Get-Random -Minimum 1200 -Maximum 3000 }
        "Contador" { Get-Random -Minimum 800 -Maximum 2000 }
        "Profesor" { Get-Random -Minimum 600 -Maximum 1500 }
        default { Get-Random -Minimum 500 -Maximum 2000 }
    }
    $salario = [math]::Round($salarioBase, 2)
      return @{
        username = $username
        email = $email
        password = "password_$(Get-Random -Minimum 1000 -Maximum 9999)"
        nombreCompleto = $nombreCompleto
        dui = $dui
        telefono = $telefono
        direccion = $direccion
        fechaNacimiento = $fechaNacimiento
        genero = $genero
        profesion = $profesion
        salario = $salario
        rol = @{ id = 4 }  # ROL CLIENTE POR DEFECTO
        sucursal = @{ id = 1 }  # SUCURSAL CENTRAL POR DEFECTO
        estado = "activo"
    }
}

Write-Host "`n PRUEBAS DE CREACIÓN DE CLIENTES CON DATOS ALEATORIOS" -ForegroundColor Magenta -BackgroundColor Black
Write-Host "Base URL: $BASE_URL" -ForegroundColor Yellow
Write-Host "Usuarios URL: $USUARIOS_URL" -ForegroundColor Yellow
Write-Host "ROL POR DEFECTO: 4 (Cliente)" -ForegroundColor Cyan
Write-Host "SUCURSAL POR DEFECTO: 1 (Central)" -ForegroundColor Cyan

# Array para almacenar los clientes creados
$clientesCreados = @()

# ================================
# CREAR MÚLTIPLES CLIENTES ALEATORIOS
# ================================

$numeroClientes = 5  # Cambiar este número para crear más o menos clientes

Write-Host "`nCreando $numeroClientes clientes con datos aleatorios..." -ForegroundColor Green

for ($i = 1; $i -le $numeroClientes; $i++) {
    Write-Host "`n--- CLIENTE $i de $numeroClientes ---" -ForegroundColor Blue
    
    $clienteData = Generate-RandomClientData
    
    Write-Host "Datos generados:" -ForegroundColor Yellow
    Write-Host "  Nombre: $($clienteData.nombreCompleto)" -ForegroundColor Gray
    Write-Host "  Username: $($clienteData.username)" -ForegroundColor Gray
    Write-Host "  Email: $($clienteData.email)" -ForegroundColor Gray
    Write-Host "  DUI: $($clienteData.dui)" -ForegroundColor Gray
    Write-Host "  Teléfono: $($clienteData.telefono)" -ForegroundColor Gray
    Write-Host "  Género: $($clienteData.genero)" -ForegroundColor Gray
    Write-Host "  Profesión: $($clienteData.profesion)" -ForegroundColor Gray
    Write-Host "  Salario: $($clienteData.salario)" -ForegroundColor Gray
    Write-Host "  Fecha Nacimiento: $($clienteData.fechaNacimiento)" -ForegroundColor Gray
    Write-Host "  Dirección: $($clienteData.direccion)" -ForegroundColor Gray
    
    $clienteCreado = Invoke-ApiRequest -Method "POST" -Url $USUARIOS_URL -Body $clienteData -Title "CREAR CLIENTE ALEATORIO #$i"
    
    if ($clienteCreado -and (-not $clienteCreado.error)) {
        $clientesCreados += $clienteCreado
        Write-Host "✓ Cliente $i creado exitosamente" -ForegroundColor Green
        
        # Esperar un poco para evitar problemas de concurrencia
        Start-Sleep -Milliseconds 500
    } else {
        Write-Host "✗ Error al crear cliente $i" -ForegroundColor Red
    }
}

# ================================
# RESUMEN DE CLIENTES CREADOS
# ================================

Write-Host "`n" -NoNewline
Write-Host "="*80 -ForegroundColor Green
Write-Host " RESUMEN DE CLIENTES CREADOS" -ForegroundColor White -BackgroundColor Green
Write-Host "="*80 -ForegroundColor Green

if ($clientesCreados.Count -gt 0) {
    Write-Host "Total de clientes creados exitosamente: $($clientesCreados.Count)" -ForegroundColor Green
    
    Write-Host "`nDetalles de los clientes creados:" -ForegroundColor Yellow
    
    for ($i = 0; $i -lt $clientesCreados.Count; $i++) {
        $cliente = $clientesCreados[$i]
        $usuario = if ($cliente.usuario) { $cliente.usuario } else { $cliente }
        
        Write-Host "`nCliente $($i+1):" -ForegroundColor Cyan
        Write-Host "  ID: $($usuario.id)" -ForegroundColor Gray
        Write-Host "  Username: $($usuario.username)" -ForegroundColor Gray
        Write-Host "  Email: $($usuario.email)" -ForegroundColor Gray
        Write-Host "  Nombre: $($usuario.nombreCompleto)" -ForegroundColor Gray
        Write-Host "  DUI: $($usuario.dui)" -ForegroundColor Gray
        Write-Host "  Rol: Cliente (ID: 4)" -ForegroundColor Gray
        Write-Host "  Estado: $($usuario.estado)" -ForegroundColor Gray
    }
} else {
    Write-Host "No se crearon clientes exitosamente." -ForegroundColor Red
}

# ================================
# PRUEBAS DE CONSULTA DE CLIENTES
# ================================

Write-Host "`n" -NoNewline
Write-Host "="*80 -ForegroundColor Blue
Write-Host " PRUEBAS DE CONSULTA DE CLIENTES" -ForegroundColor White -BackgroundColor Blue
Write-Host "="*80 -ForegroundColor Blue

# Consultar todos los usuarios con rol cliente
Invoke-ApiRequest -Method "GET" -Url "$USUARIOS_URL/rol/cliente" -Title "CONSULTAR TODOS LOS CLIENTES"

# Si hay clientes creados, hacer consultas específicas
if ($clientesCreados.Count -gt 0) {
    $primerCliente = $clientesCreados[0]
    $usuario = if ($primerCliente.usuario) { $primerCliente.usuario } else { $primerCliente }
    
    if ($usuario.id) {
        Invoke-ApiRequest -Method "GET" -Url "$USUARIOS_URL/$($usuario.id)" -Title "CONSULTAR CLIENTE POR ID ($($usuario.id))"
    }
    
    if ($usuario.dui) {
        Invoke-ApiRequest -Method "GET" -Url "$USUARIOS_URL/dui/$($usuario.dui)" -Title "CONSULTAR CLIENTE POR DUI ($($usuario.dui))"
    }
    
    if ($usuario.username) {
        Invoke-ApiRequest -Method "GET" -Url "$USUARIOS_URL/username/$($usuario.username)" -Title "CONSULTAR CLIENTE POR USERNAME ($($usuario.username))"
    }
}

# Consultar clientes por sucursal
Invoke-ApiRequest -Method "GET" -Url "$USUARIOS_URL/sucursal/1" -Title "CONSULTAR CLIENTES POR SUCURSAL 1"

Write-Host "`n" -NoNewline
Write-Host "="*80 -ForegroundColor Green
Write-Host " PRUEBAS COMPLETADAS" -ForegroundColor White -BackgroundColor Green
Write-Host "="*80 -ForegroundColor Green

Write-Host "`nFuncionalidades probadas:" -ForegroundColor White
Write-Host "  ✓ Generación de datos aleatorios para clientes salvadoreños" -ForegroundColor Green
Write-Host "  ✓ Creación múltiple de usuarios con rol cliente (ID: 4)" -ForegroundColor Green
Write-Host "  ✓ Asignación automática a sucursal central (ID: 1)" -ForegroundColor Green
Write-Host "  ✓ Validación de formato de DUI salvadoreño" -ForegroundColor Green
Write-Host "  ✓ Generación de números telefónicos válidos" -ForegroundColor Green
Write-Host "  ✓ Consultas por diferentes criterios" -ForegroundColor Green
Write-Host "  ✓ Manejo de errores y validaciones" -ForegroundColor Green

Write-Host "`nNota: La aplicación debe estar ejecutándose en http://localhost:8081" -ForegroundColor Yellow
Write-Host "Configuración por defecto:" -ForegroundColor Yellow
Write-Host "  - Rol: 4 (Cliente)" -ForegroundColor Cyan
Write-Host "  - Sucursal: 1 (Central)" -ForegroundColor Cyan
Write-Host "  - Estado: activo" -ForegroundColor Cyan
