-- Insertar tipos de transacción básicos si no existen
INSERT INTO tipos_transaccion (nombre, descripcion, requiere_cuenta_destino, comision, created_at) VALUES
('Depósito', 'Depósito de dinero en efectivo', false, 0.00, NOW()),
('Retiro', 'Retiro de dinero en efectivo', false, 1.00, NOW()),
('Transferencia', 'Transferencia entre cuentas', true, 2.50, NOW()),
('Pago de Servicios', 'Pago de servicios públicos', false, 1.50, NOW()),
('Consulta de Saldo', 'Consulta de saldo de cuenta', false, 0.00, NOW())
ON DUPLICATE KEY UPDATE nombre=nombre;
