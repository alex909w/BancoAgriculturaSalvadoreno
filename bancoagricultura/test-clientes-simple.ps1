# Script simplificado para crear clientes con datos aleatorios
# Banco Agricultura Salvadoreno - API Spring Boot

# Configuracion de la API
$BASE_URL = "http://localhost:8081/api"
$USUARIOS_URL = "$BASE_URL/usuarios"

# Headers para las peticiones
$headers = @{
    "Content-Type" = "application/json"
    "Accept" = "application/json"
}

# Funcion para mostrar resultados
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

# Funcion para realizar peticiones HTTP
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

Write-Host "`n PRUEBAS DE CREACION DE CLIENTES CON DATOS ALEATORIOS" -ForegroundColor Magenta -BackgroundColor Black
Write-Host "Base URL: $BASE_URL" -ForegroundColor Yellow
Write-Host "Usuarios URL: $USUARIOS_URL" -ForegroundColor Yellow
Write-Host "ROL POR DEFECTO: 4 (Cliente)" -ForegroundColor Cyan
Write-Host "SUCURSAL POR DEFECTO: 1 (Central)" -ForegroundColor Cyan

# Generar datos para 3 clientes de prueba
$clientesData = @(    @{
        username = "maria_garcia_$(Get-Date -Format 'yyyyMMddHHmmss')"
        email = "maria.garcia$(Get-Date -Format 'yyyyMMddHHmmss')@agrobanco.com"
        password = 'password123'
        nombreCompleto = "Maria Elena Garcia Lopez"
        dui = "$(Get-Random -Minimum 10000000 -Maximum 99999999)-$(Get-Random -Minimum 0 -Maximum 9)"
        telefono = "7$(Get-Random -Minimum 1000000 -Maximum 9999999)"
        direccion = "Colonia Escalon, Calle Principal #123, San Salvador, El Salvador"
        fechaNacimiento = "1990-05-15"
        genero = "F"
        profesion = "Contadora"
        salario = 1200.00
        rol = @{ id = 4 }
        sucursal = @{ id = 1 }
        estado = "activo"
    },
    @{
        username = "carlos_martinez_$(Get-Date -Format 'yyyyMMddHHmmss')"
        email = "carlos.martinez$(Get-Date -Format 'yyyyMMddHHmmss')@agrobanco.com"
        password = 'password456'
        nombreCompleto = "Carlos Roberto Martinez Hernandez"
        dui = "$(Get-Random -Minimum 10000000 -Maximum 99999999)-$(Get-Random -Minimum 0 -Maximum 9)"
        telefono = "7$(Get-Random -Minimum 1000000 -Maximum 9999999)"
        direccion = "Colonia San Benito, Avenida Las Magnolias #456, San Salvador, El Salvador"
        fechaNacimiento = "1985-08-22"
        genero = "M"
        profesion = "Ingeniero"
        salario = 2500.00
        rol = @{ id = 4 }
        sucursal = @{ id = 1 }
        estado = "activo"
    },    @{
        username = "ana_rodriguez_$(Get-Date -Format 'yyyyMMddHHmmss')"
        email = "ana.rodriguez$(Get-Date -Format 'yyyyMMddHHmmss')@agrobanco.com"
        password = 'password789'
        nombreCompleto = "Ana Patricia Rodriguez Flores"
        dui = "$(Get-Random -Minimum 10000000 -Maximum 99999999)-$(Get-Random -Minimum 0 -Maximum 9)"
        telefono = "7$(Get-Random -Minimum 1000000 -Maximum 9999999)"
        direccion = "Colonia Miramonte, Pasaje Los Rosales #789, San Salvador, El Salvador"
        fechaNacimiento = "1992-12-03"
        genero = "F"
        profesion = "Profesora"
        salario = 900.00
        rol = @{ id = 4 }
        sucursal = @{ id = 1 }
        estado = "activo"
    }
)

# Array para almacenar los clientes creados exitosamente
$clientesCreados = @()

# Crear cada cliente
for ($i = 0; $i -lt $clientesData.Count; $i++) {
    $clienteData = $clientesData[$i]
    
    Write-Host "`n--- CLIENTE $($i+1) de $($clientesData.Count) ---" -ForegroundColor Blue
    Write-Host "Creando: $($clienteData.nombreCompleto)" -ForegroundColor Yellow
    Write-Host "Username: $($clienteData.username)" -ForegroundColor Gray
    Write-Host "Email: $($clienteData.email)" -ForegroundColor Gray
    Write-Host "DUI: $($clienteData.dui)" -ForegroundColor Gray
    Write-Host "Profesion: $($clienteData.profesion)" -ForegroundColor Gray
    Write-Host "Salario: $($clienteData.salario)" -ForegroundColor Gray
    
    $clienteCreado = Invoke-ApiRequest -Method "POST" -Url $USUARIOS_URL -Body $clienteData -Title "CREAR CLIENTE $($i+1)"
    
    if ($clienteCreado -and $clienteCreado.usuario) {
        $clientesCreados += $clienteCreado
        Write-Host "Cliente creado exitosamente con ID: $($clienteCreado.usuario.id)" -ForegroundColor Green
    } elseif ($clienteCreado -and (-not $clienteCreado.error)) {
        $clientesCreados += $clienteCreado
        Write-Host "Cliente creado exitosamente" -ForegroundColor Green
    } else {
        Write-Host "Error al crear cliente" -ForegroundColor Red
    }
    
    # Esperar un poco entre creaciones
    Start-Sleep -Seconds 1
}

# Mostrar resumen
Write-Host "`n" -NoNewline
Write-Host "="*80 -ForegroundColor Green
Write-Host " RESUMEN DE CLIENTES CREADOS" -ForegroundColor White -BackgroundColor Green
Write-Host "="*80 -ForegroundColor Green

Write-Host "Total de clientes creados: $($clientesCreados.Count)" -ForegroundColor Green

if ($clientesCreados.Count -gt 0) {
    Write-Host "`nListado de clientes creados:" -ForegroundColor Yellow
    
    for ($i = 0; $i -lt $clientesCreados.Count; $i++) {
        $cliente = $clientesCreados[$i]
        $usuario = if ($cliente.usuario) { $cliente.usuario } else { $cliente }
        
        Write-Host "`nCliente $($i+1):" -ForegroundColor Cyan
        Write-Host "  ID: $($usuario.id)" -ForegroundColor Gray
        Write-Host "  Username: $($usuario.username)" -ForegroundColor Gray
        Write-Host "  Nombre: $($usuario.nombreCompleto)" -ForegroundColor Gray
        Write-Host "  Email: $($usuario.email)" -ForegroundColor Gray
        Write-Host "  DUI: $($usuario.dui)" -ForegroundColor Gray
    }
}

# Pruebas de consulta
Write-Host "`n" -NoNewline
Write-Host "="*80 -ForegroundColor Blue
Write-Host " PRUEBAS DE CONSULTA" -ForegroundColor White -BackgroundColor Blue
Write-Host "="*80 -ForegroundColor Blue

# Consultar todos los clientes
Invoke-ApiRequest -Method "GET" -Url "$USUARIOS_URL/rol/cliente" -Title "CONSULTAR TODOS LOS CLIENTES"

# Consultar clientes por sucursal
Invoke-ApiRequest -Method "GET" -Url "$USUARIOS_URL/sucursal/1" -Title "CONSULTAR CLIENTES POR SUCURSAL 1"

Write-Host "`nPRUEBAS COMPLETADAS" -ForegroundColor Green -BackgroundColor Black
Write-Host "Funcionalidades probadas:" -ForegroundColor White
Write-Host "  * Creacion de usuarios con rol cliente (ID: 4)" -ForegroundColor Gray
Write-Host "  * Asignacion automatica a sucursal central (ID: 1)" -ForegroundColor Gray
Write-Host "  * Generacion de datos de clientes salvadorenos" -ForegroundColor Gray
Write-Host "  * Consultas por rol y sucursal" -ForegroundColor Gray
Write-Host "  * Manejo de errores y validaciones" -ForegroundColor Gray

Write-Host "`nNota: La aplicacion debe estar ejecutandose en http://localhost:8081" -ForegroundColor Yellow
