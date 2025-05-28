-- Script de inicialización manual de tipos de transacción
-- Banco Agricultura Salvadoreño
-- Fecha: 27 de Mayo, 2025

USE agrobanco_salvadoreno;

-- Verificar tipos de transacción existentes
SELECT 'Tipos de transacción existentes:' as info;
SELECT id, nombre, descripcion, requiere_cuenta_destino, comision, created_at 
FROM tipos_transaccion 
ORDER BY id;

-- Insertar tipos de transacción básicos (solo si no existen)
INSERT INTO tipos_transaccion (nombre, descripcion, requiere_cuenta_destino, comision, created_at) 
VALUES 
  ('Depósito', 'Depósito de dinero en efectivo', false, 0.00, NOW()),
  ('Retiro', 'Retiro de dinero en efectivo', false, 1.00, NOW()),
  ('Transferencia', 'Transferencia entre cuentas', true, 2.50, NOW()),
  ('Pago de Servicios', 'Pago de servicios públicos', false, 1.50, NOW()),
  ('Consulta de Saldo', 'Consulta de saldo de cuenta', false, 0.00, NOW())
ON DUPLICATE KEY UPDATE 
  descripcion = VALUES(descripcion),
  requiere_cuenta_destino = VALUES(requiere_cuenta_destino),
  comision = VALUES(comision);

-- Verificar inserción
SELECT 'Tipos de transacción después de la inserción:' as info;
SELECT id, nombre, descripcion, requiere_cuenta_destino, comision, created_at 
FROM tipos_transaccion 
ORDER BY id;

-- Verificar si hay transacciones sin tipo asignado
SELECT 'Transacciones sin tipo asignado:' as info;
SELECT COUNT(*) as cantidad_sin_tipo 
FROM transacciones 
WHERE tipo_transaccion_id IS NULL;

-- Si hay transacciones sin tipo, mostrarlas
SELECT id, numero_transaccion, monto, descripcion, fecha_transaccion
FROM transacciones 
WHERE tipo_transaccion_id IS NULL
LIMIT 10;
