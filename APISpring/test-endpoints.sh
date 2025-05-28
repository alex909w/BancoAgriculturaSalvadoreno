# Test de Endpoints usando cURL - Banco Agricultura Salvadoreño
# Script Bash para pruebas con curl

base_url="http://localhost:8081"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Función para imprimir títulos
print_header() {
    echo -e "${MAGENTA}🚀 $1${NC}"
}

# Función para imprimir subtítulos
print_section() {
    echo -e "\n${CYAN}📍 $1${NC}"
}

# Función para realizar peticiones
test_endpoint() {
    local method=$1
    local url=$2
    local data=$3
    local description=$4
    
    echo -e "${YELLOW}Probando: $description${NC}"
    echo -e "${BLUE}$method $url${NC}"
    
    if [ -n "$data" ]; then
        response=$(curl -s -X $method -H "Content-Type: application/json" -d "$data" "$url" -w "\n%{http_code}")
    else
        response=$(curl -s -X $method -H "Content-Type: application/json" "$url" -w "\n%{http_code}")
    fi
    
    # Separar respuesta y código de estado
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✅ Éxito ($http_code)${NC}"
        echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
    else
        echo -e "${RED}❌ Error ($http_code)${NC}"
        echo "$body"
    fi
    echo "─────────────────────────────────────"
}

print_header "Iniciando pruebas de endpoints del Banco Agricultura Salvadoreño"
echo "URL Base: $base_url"

# 1. Verificar estado del servidor
print_section "1. Verificando estado del servidor"
test_endpoint "GET" "$base_url/actuator/health" "" "Health Check"

# 2. Swagger
print_section "2. Verificando Swagger"
test_endpoint "GET" "$base_url/v3/api-docs" "" "OpenAPI Documentation"

# 3. Autenticación
print_section "3. Pruebas de Autenticación"

# Login válido con credenciales correctas
login_data='{
    "username": "admin",
    "password": "admin2025"
}'
test_endpoint "POST" "$base_url/api/auth/login" "$login_data" "Login válido con admin"

# Login inválido
login_invalid_data='{
    "usuario": "usuarioInvalido",
    "password": "passwordIncorrecto"
}'
test_endpoint "POST" "$base_url/api/usuarios/login" "$login_invalid_data" "Login inválido"

# 4. Usuarios
print_section "4. Pruebas de Usuarios"

test_endpoint "GET" "$base_url/api/usuarios" "" "Obtener todos los usuarios"
test_endpoint "GET" "$base_url/api/usuarios/1" "" "Obtener usuario por ID"

# Crear nuevo usuario
nuevo_usuario='{
    "nombre": "María García",
    "apellido": "Rodríguez", 
    "email": "maria.garcia@test.com",
    "telefono": "+503 7890-1234",
    "dui": "03456789-1",
    "usuario": "mgarcia",
    "password": "password123",
    "idRol": 2,
    "idSucursal": 1
}'
test_endpoint "POST" "$base_url/api/usuarios" "$nuevo_usuario" "Crear nuevo usuario"

# 5. Cuentas
print_section "5. Pruebas de Cuentas"

test_endpoint "GET" "$base_url/api/cuentas" "" "Obtener todas las cuentas"
test_endpoint "GET" "$base_url/api/cuentas/1" "" "Obtener cuenta por ID"
test_endpoint "GET" "$base_url/api/cuentas/numero/0012345678" "" "Obtener cuenta por número"
test_endpoint "GET" "$base_url/api/cuentas/usuario/1" "" "Obtener cuentas por usuario"

# Crear nueva cuenta
nueva_cuenta='{
    "numero": "0098765432",
    "saldo": 1000.00,
    "fechaCreacion": "2024-01-15",
    "estado": "ACTIVA",
    "idUsuario": 1,
    "idTipoCuenta": 1,
    "idSucursal": 1
}'
test_endpoint "POST" "$base_url/api/cuentas" "$nueva_cuenta" "Crear nueva cuenta"

# 6. Transacciones
print_section "6. Pruebas de Transacciones"

test_endpoint "GET" "$base_url/api/transacciones" "" "Obtener todas las transacciones"
test_endpoint "GET" "$base_url/api/transacciones/cuenta/1" "" "Obtener transacciones por cuenta"

# Realizar depósito
deposito='{
    "monto": 500.00,
    "descripcion": "Depósito de prueba",
    "idCuenta": 1,
    "idTipoTransaccion": 1
}'
test_endpoint "POST" "$base_url/api/transacciones" "$deposito" "Realizar depósito"

# Realizar transferencia
transferencia='{
    "monto": 100.00,
    "descripcion": "Transferencia de prueba",
    "idCuentaOrigen": 1,
    "idCuentaDestino": 2,
    "idTipoTransaccion": 3
}'
test_endpoint "POST" "$base_url/api/transacciones/transferencia" "$transferencia" "Realizar transferencia"

# 7. Préstamos
print_section "7. Pruebas de Préstamos"

test_endpoint "GET" "$base_url/api/prestamos" "" "Obtener todos los préstamos"
test_endpoint "GET" "$base_url/api/prestamos/usuario/1" "" "Obtener préstamos por usuario"

# Solicitar préstamo
prestamo='{
    "monto": 5000.00,
    "plazoMeses": 12,
    "tasaInteres": 8.5,
    "descripcion": "Préstamo personal de prueba",
    "estado": "PENDIENTE",
    "idUsuario": 1,
    "idTipoPrestamo": 1
}'
test_endpoint "POST" "$base_url/api/prestamos" "$prestamo" "Solicitar nuevo préstamo"

# 8. Configuración del Sistema
print_section "8. Pruebas de Configuración del Sistema"
test_endpoint "GET" "$base_url/api/configuracion" "" "Obtener configuraciones"

# 9. Tipos de Cuenta
print_section "9. Pruebas de Tipos de Cuenta"
test_endpoint "GET" "$base_url/api/tipos-cuenta" "" "Obtener tipos de cuenta"

# 10. Sucursales
print_section "10. Pruebas de Sucursales"
test_endpoint "GET" "$base_url/api/sucursales" "" "Obtener sucursales"

# 11. Roles
print_section "11. Pruebas de Roles"
test_endpoint "GET" "$base_url/api/roles" "" "Obtener roles"

# 12. Auditoría
print_section "12. Pruebas de Auditoría"
test_endpoint "GET" "$base_url/api/auditoria" "" "Obtener registros de auditoría"
test_endpoint "GET" "$base_url/api/auditoria/usuario/1" "" "Obtener auditoría por usuario"

print_header "🎉 Pruebas completadas!"
echo -e "${CYAN}📈 Resumen de pruebas ejecutadas para todos los endpoints principales${NC}"
