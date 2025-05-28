-- Script para corregir el problema de sucursal_id = 0 en transacciones
-- Autor: Sistema de Corrección de Datos
-- Fecha: 28 de mayo de 2025

-- Paso 1: Verificar el problema actual
SELECT 'Transacciones con sucursal_id = 0:' as diagnostico, COUNT(*) as cantidad
FROM transacciones WHERE sucursal_id = 0;

-- Paso 2: Verificar sucursales existentes
SELECT 'Sucursales disponibles:' as info, id, nombre 
FROM sucursales ORDER BY id LIMIT 10;

-- Paso 3: Crear sucursal principal si no existe
INSERT IGNORE INTO sucursales (id, nombre, direccion, telefono, estado, created_at) 
VALUES (1, 'Sucursal Principal', 'San Salvador, El Salvador', '2222-2222', 'activa', NOW());

-- Paso 4: Alternativa - Crear sucursal virtual con id = 0 si es necesario
INSERT IGNORE INTO sucursales (id, nombre, direccion, telefono, estado, created_at) 
VALUES (0, 'Sucursal Virtual', 'Sistema', 'N/A', 'activa', NOW());

-- Paso 5: Actualizar transacciones problemáticas
-- Opción A: Cambiar sucursal_id de 0 a 1 (sucursal principal)
UPDATE transacciones SET sucursal_id = 1 WHERE sucursal_id = 0;

-- Paso 6: Verificar que se corrigió el problema
SELECT 'Transacciones con sucursal_id = 0 después de la corrección:' as resultado, COUNT(*) as cantidad
FROM transacciones WHERE sucursal_id = 0;

-- Paso 7: Verificar integridad de los datos
SELECT 'Verificación de integridad:' as verificacion,
       COUNT(t.id) as total_transacciones,
       COUNT(s.id) as transacciones_con_sucursal_valida
FROM transacciones t
LEFT JOIN sucursales s ON t.sucursal_id = s.id;

-- Paso 8: Mostrar ejemplo de transacciones corregidas
SELECT 'Ejemplo de transacciones corregidas:' as ejemplo,
       t.id, t.numero_transaccion, t.sucursal_id, s.nombre as sucursal_nombre
FROM transacciones t
JOIN sucursales s ON t.sucursal_id = s.id
ORDER BY t.id DESC
LIMIT 5;
