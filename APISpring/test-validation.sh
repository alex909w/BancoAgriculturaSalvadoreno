#!/bin/bash

# Script para probar el manejo de valores undefined

echo "=== Probando manejo de valores undefined ==="
echo

# Test 1: Valor undefined en endpoint de usuario
echo "1. Probando GET /usuarios/undefined:"
curl -X GET http://localhost:8080/api/usuarios/undefined
echo -e "\n"

# Test 2: Valor undefined en endpoint de cuenta
echo "2. Probando GET /cuentas/cliente/undefined:"
curl -X GET http://localhost:8080/api/cuentas/cliente/undefined
echo -e "\n"

# Test 3: Validación de entero con undefined
echo "3. Probando validación de entero con 'undefined':"
curl -X GET http://localhost:8080/api/validation/check-integer/undefined
echo -e "\n"

# Test 4: Validación de entero con valor válido
echo "4. Probando validación de entero con '123':"
curl -X GET http://localhost:8080/api/validation/check-integer/123
echo -e "\n"

# Test 5: Validación de decimal con undefined
echo "5. Probando validación de decimal con 'undefined':"
curl -X GET http://localhost:8080/api/validation/check-decimal/undefined
echo -e "\n"

# Test 6: Validación de decimal con valor válido
echo "6. Probando validación de decimal con '123.45':"
curl -X GET http://localhost:8080/api/validation/check-decimal/123.45
echo -e "\n"
