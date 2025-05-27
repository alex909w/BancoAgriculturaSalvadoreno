
CREATE DATABASE IF NOT EXISTS `agrobanco_salvadoreno`;
USE `agrobanco_salvadoreno`;

DROP TABLE IF EXISTS `auditoria`;
CREATE TABLE IF NOT EXISTS `auditoria` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tabla_afectada` varchar(50) NOT NULL,
  `registro_id` int NOT NULL,
  `accion` enum('INSERT','UPDATE','DELETE') NOT NULL,
  `datos_anteriores` json DEFAULT NULL,
  `datos_nuevos` json DEFAULT NULL,
  `usuario_id` int DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `idx_auditoria_tabla_registro` (`tabla_afectada`,`registro_id`)
);

DROP TABLE IF EXISTS `beneficiarios`;
CREATE TABLE IF NOT EXISTS `beneficiarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cuenta_id` int NOT NULL,
  `nombre_completo` varchar(150) NOT NULL,
  `dui` varchar(10) NOT NULL,
  `parentesco` varchar(50) DEFAULT NULL,
  `porcentaje` decimal(5,2) NOT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `direccion` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `cuenta_id` (`cuenta_id`)
) ;

INSERT INTO `beneficiarios` (`id`, `cuenta_id`, `nombre_completo`, `dui`, `parentesco`, `porcentaje`, `telefono`, `direccion`, `created_at`) VALUES
(1, 1, 'María Pérez', '01234567-8', 'Esposa', 50.00, '70123456', 'Colonia Escalón, San Salvador', '2025-05-27 00:45:15'),
(2, 1, 'Luis Pérez', '12345678-9', 'Hijo', 50.00, '70123457', 'Colonia Escalón, San Salvador', '2025-05-27 00:45:15');



DROP TABLE IF EXISTS `configuracion_sistema`;
CREATE TABLE IF NOT EXISTS `configuracion_sistema` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clave` varchar(100) NOT NULL,
  `valor` text NOT NULL,
  `descripcion` text,
  `tipo` enum('string','number','boolean','json') DEFAULT 'string',
  `updated_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clave` (`clave`),
  KEY `updated_by` (`updated_by`)
);

INSERT INTO `configuracion_sistema` (`id`, `clave`, `valor`, `descripcion`, `tipo`, `updated_by`, `updated_at`) VALUES
(1, 'banco_nombre', 'AgroBanco Salvadoreño', 'Nombre oficial del banco', 'string', NULL, '2025-05-24 18:37:42'),
(2, 'banco_slogan', 'Crecemos contigo desde la raíz', 'Slogan del banco', 'string', NULL, '2025-05-24 18:37:42'),
(3, 'tasa_interes_base', '0.05', 'Tasa de interés base del banco', 'number', NULL, '2025-05-24 18:37:42'),
(4, 'limite_transaccion_diaria', '5000.00', 'Límite de transacciones diarias', 'number', NULL, '2025-05-24 18:37:42'),
(5, 'notificaciones_activas', 'true', 'Estado de las notificaciones del sistema', 'boolean', NULL, '2025-05-24 18:37:42');

DROP TABLE IF EXISTS `cuentas`;
CREATE TABLE IF NOT EXISTS `cuentas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numero_cuenta` varchar(20) NOT NULL,
  `cliente_id` int NOT NULL,
  `tipo_cuenta_id` int NOT NULL,
  `sucursal_id` int NOT NULL,
  `saldo` decimal(15,2) DEFAULT '0.00',
  `estado` enum('activa','inactiva','bloqueada','cerrada') DEFAULT 'activa',
  `tiene_seguro` tinyint(1) DEFAULT '0',
  `fecha_apertura` date NOT NULL,
  `fecha_cierre` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `numero_cuenta` (`numero_cuenta`),
  KEY `tipo_cuenta_id` (`tipo_cuenta_id`),
  KEY `sucursal_id` (`sucursal_id`),
  KEY `idx_cuentas_numero` (`numero_cuenta`),
  KEY `idx_cuentas_cliente` (`cliente_id`)
);

INSERT INTO `cuentas` (`id`, `numero_cuenta`, `cliente_id`, `tipo_cuenta_id`, `sucursal_id`, `saldo`, `estado`, `tiene_seguro`, `fecha_apertura`, `fecha_cierre`, `created_at`, `updated_at`) VALUES
(1, '652732736823', 2, 1, 1, 1500.00, 'activa', 1, '2024-01-10', NULL, '2025-05-27 00:45:32', '2025-05-27 02:53:23'),
(2, '57687676666', 2, 2, 1, 3000.00, 'activa', 0, '2024-03-15', NULL, '2025-05-27 00:45:32', '2025-05-27 02:53:30');


DROP TABLE IF EXISTS `pagos_prestamos`;
CREATE TABLE IF NOT EXISTS `pagos_prestamos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `prestamo_id` int NOT NULL,
  `numero_cuota` int NOT NULL,
  `monto_cuota` decimal(10,2) NOT NULL,
  `monto_capital` decimal(10,2) NOT NULL,
  `monto_interes` decimal(10,2) NOT NULL,
  `fecha_vencimiento` date NOT NULL,
  `fecha_pago` date DEFAULT NULL,
  `monto_pagado` decimal(10,2) DEFAULT NULL,
  `estado` enum('pendiente','pagado','vencido') DEFAULT 'pendiente',
  `transaccion_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `prestamo_id` (`prestamo_id`),
  KEY `transaccion_id` (`transaccion_id`)
);

INSERT INTO `pagos_prestamos` (`id`, `prestamo_id`, `numero_cuota`, `monto_cuota`, `monto_capital`, `monto_interes`, `fecha_vencimiento`, `fecha_pago`, `monto_pagado`, `estado`, `transaccion_id`, `created_at`) VALUES
(1, 1, 1, 105.00, 100.00, 5.00, '2025-06-15', '2025-06-10', 105.00, 'pagado', NULL, '2025-05-27 00:45:38'),
(2, 1, 2, 105.00, 100.00, 5.00, '2025-07-15', NULL, NULL, 'pendiente', NULL, '2025-05-27 00:45:38');


DROP TABLE IF EXISTS `prestamos`;
CREATE TABLE IF NOT EXISTS `prestamos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numero_prestamo` varchar(20) NOT NULL,
  `cliente_id` int NOT NULL,
  `tipo_prestamo_id` int NOT NULL,
  `cuenta_vinculada_id` int NOT NULL,
  `monto_solicitado` decimal(12,2) NOT NULL,
  `monto_aprobado` decimal(12,2) DEFAULT NULL,
  `tasa_interes` decimal(5,4) NOT NULL,
  `plazo_meses` int NOT NULL,
  `cuota_mensual` decimal(10,2) DEFAULT NULL,
  `saldo_pendiente` decimal(12,2) DEFAULT NULL,
  `estado` enum('solicitado','en_revision','aprobado','rechazado','desembolsado','pagado','vencido') DEFAULT 'solicitado',
  `tiene_seguro_vida` tinyint(1) DEFAULT '0',
  `cobros_automaticos` tinyint(1) DEFAULT '0',
  `fecha_solicitud` date NOT NULL,
  `fecha_aprobacion` date DEFAULT NULL,
  `fecha_desembolso` date DEFAULT NULL,
  `fecha_vencimiento` date DEFAULT NULL,
  `cajero_id` int DEFAULT NULL,
  `gerente_aprobador_id` int DEFAULT NULL,
  `observaciones` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `numero_prestamo` (`numero_prestamo`),
  KEY `tipo_prestamo_id` (`tipo_prestamo_id`),
  KEY `cuenta_vinculada_id` (`cuenta_vinculada_id`),
  KEY `cajero_id` (`cajero_id`),
  KEY `gerente_aprobador_id` (`gerente_aprobador_id`),
  KEY `idx_prestamos_cliente` (`cliente_id`),
  KEY `idx_prestamos_estado` (`estado`)
) ;


INSERT INTO `prestamos` (`id`, `numero_prestamo`, `cliente_id`, `tipo_prestamo_id`, `cuenta_vinculada_id`, `monto_solicitado`, `monto_aprobado`, `tasa_interes`, `plazo_meses`, `cuota_mensual`, `saldo_pendiente`, `estado`, `tiene_seguro_vida`, `cobros_automaticos`, `fecha_solicitud`, `fecha_aprobacion`, `fecha_desembolso`, `fecha_vencimiento`, `cajero_id`, `gerente_aprobador_id`, `observaciones`, `created_at`, `updated_at`) VALUES
(1, 'PRE-001', 1, 1, 1, 1000.00, 1000.00, 0.0500, 12, 105.00, 1050.00, 'desembolsado', 0, 0, '2025-05-01', '2025-05-05', '2025-05-10', '2026-05-10', NULL, NULL, NULL, '2025-05-27 00:45:43', '2025-05-27 00:45:43');


DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
);

INSERT INTO `roles` (`id`, `nombre`, `descripcion`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'Administrador del sistema', '2025-05-24 18:37:41', '2025-05-24 18:37:41'),
(2, 'gerente', 'Gerente de sucursal', '2025-05-24 18:37:41', '2025-05-24 18:37:41'),
(3, 'cajero', 'Cajero de ventanilla', '2025-05-24 18:37:41', '2025-05-24 18:37:41'),
(4, 'cliente', 'Cliente del banco', '2025-05-24 18:37:41', '2025-05-24 18:37:41');


DROP TABLE IF EXISTS `solicitudes_empleados`;
CREATE TABLE IF NOT EXISTS `solicitudes_empleados` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_completo` varchar(150) NOT NULL,
  `dui` varchar(10) NOT NULL,
  `email` varchar(100) NOT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `direccion` text,
  `puesto_solicitado` varchar(100) NOT NULL,
  `salario_propuesto` decimal(10,2) DEFAULT NULL,
  `sucursal_id` int NOT NULL,
  `estado` enum('pendiente','en_revision','aprobado','rechazado') DEFAULT 'pendiente',
  `fecha_solicitud` date NOT NULL,
  `gerente_revisor_id` int DEFAULT NULL,
  `fecha_revision` date DEFAULT NULL,
  `observaciones` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `sucursal_id` (`sucursal_id`),
  KEY `gerente_revisor_id` (`gerente_revisor_id`)
);

INSERT INTO `solicitudes_empleados` (`id`, `nombre_completo`, `dui`, `email`, `telefono`, `direccion`, `puesto_solicitado`, `salario_propuesto`, `sucursal_id`, `estado`, `fecha_solicitud`, `gerente_revisor_id`, `fecha_revision`, `observaciones`, `created_at`, `updated_at`) VALUES
(1, 'Carlos Hernández', '09876543-2', 'carlos@example.com', '77223344', 'San Miguel, El Salvador', 'Cajero', 500.00, 1, 'pendiente', '2025-05-20', NULL, NULL, NULL, '2025-05-27 00:45:51', '2025-05-27 00:45:51');


DROP TABLE IF EXISTS `sucursales`;
CREATE TABLE IF NOT EXISTS `sucursales` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `codigo` varchar(20) NOT NULL,
  `departamento` varchar(50) NOT NULL,
  `municipio` varchar(50) NOT NULL,
  `direccion` text NOT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `tipo` enum('express','standard') NOT NULL,
  `estado` enum('activa','inactiva') DEFAULT 'activa',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`)
);

INSERT INTO `sucursales` (`id`, `nombre`, `codigo`, `departamento`, `municipio`, `direccion`, `telefono`, `email`, `tipo`, `estado`, `created_at`, `updated_at`) VALUES
(1, 'Sucursal Central', 'SC001', 'San Salvador', 'San Salvador', 'Av. Roosevelt, Centro Comercial Metrocentro', '2250-1000', NULL, 'standard', 'activa', '2025-05-24 18:37:41', '2025-05-24 18:37:41'),
(2, 'Sucursal El Paseo', 'EP002', 'San Salvador', 'Santa Tecla', 'Centro Comercial El Paseo', '2250-1001', NULL, 'express', 'activa', '2025-05-24 18:37:41', '2025-05-24 18:37:41'),
(3, 'Sucursal Buena Vista', 'BV003', 'San Salvador', 'Antiguo Cuscatlán', 'Plaza Buena Vista', '2250-1002', NULL, 'standard', 'activa', '2025-05-24 18:37:41', '2025-05-24 18:37:41'),
(4, 'Sucursal Amanecer', 'AM004', 'La Libertad', 'Comasagua', 'Centro de Comasagua', '2250-1003', NULL, 'express', 'activa', '2025-05-24 18:37:41', '2025-05-24 18:37:41');

DROP TABLE IF EXISTS `tipos_cuenta`;
CREATE TABLE IF NOT EXISTS `tipos_cuenta` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` text,
  `tasa_interes` decimal(5,4) DEFAULT '0.0000',
  `monto_minimo` decimal(10,2) DEFAULT '0.00',
  `comision_mantenimiento` decimal(8,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
);

INSERT INTO `tipos_cuenta` (`id`, `nombre`, `descripcion`, `tasa_interes`, `monto_minimo`, `comision_mantenimiento`, `created_at`) VALUES
(1, 'Ahorros', 'Cuenta de ahorros básica', 0.0200, 25.00, 2.00, '2025-05-24 18:37:41'),
(2, 'Corriente', 'Cuenta corriente para empresas', 0.0100, 100.00, 5.00, '2025-05-24 18:37:41'),
(3, 'Dependiente', 'Cuenta para personas dependientes', 0.0150, 10.00, 1.00, '2025-05-24 18:37:41'),
(4, 'Independiente', 'Cuenta para personas independientes', 0.0250, 50.00, 3.00, '2025-05-24 18:37:41');


DROP TABLE IF EXISTS `tipos_prestamo`;
CREATE TABLE IF NOT EXISTS `tipos_prestamo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` text,
  `tasa_interes` decimal(5,4) NOT NULL,
  `plazo_maximo_meses` int NOT NULL,
  `monto_minimo` decimal(10,2) NOT NULL,
  `monto_maximo` decimal(12,2) NOT NULL,
  `requiere_garantia` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
);

INSERT INTO `tipos_prestamo` (`id`, `nombre`, `descripcion`, `tasa_interes`, `plazo_maximo_meses`, `monto_minimo`, `monto_maximo`, `requiere_garantia`, `created_at`) VALUES
(1, 'Personal', 'Préstamo personal sin garantía', 0.1200, 60, 500.00, 10000.00, 0, '2025-05-24 18:37:41'),
(2, 'Hipotecario', 'Préstamo para vivienda', 0.0800, 360, 5000.00, 150000.00, 1, '2025-05-24 18:37:41'),
(3, 'Automotriz', 'Préstamo para vehículos', 0.1000, 84, 2000.00, 50000.00, 1, '2025-05-24 18:37:41'),
(4, 'Agrícola', 'Préstamo para actividades agrícolas', 0.0900, 120, 1000.00, 25000.00, 0, '2025-05-24 18:37:41');

DROP TABLE IF EXISTS `tipos_transaccion`;
CREATE TABLE IF NOT EXISTS `tipos_transaccion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` text,
  `requiere_cuenta_destino` tinyint(1) DEFAULT '0',
  `comision` decimal(8,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
);

INSERT INTO `tipos_transaccion` (`id`, `nombre`, `descripcion`, `requiere_cuenta_destino`, `comision`, `created_at`) VALUES
(1, 'Depósito', 'Depósito en efectivo', 0, 0.00, '2025-05-24 18:37:41'),
(2, 'Retiro', 'Retiro en efectivo', 0, 1.00, '2025-05-24 18:37:41'),
(3, 'Transferencia', 'Transferencia entre cuentas', 1, 2.50, '2025-05-24 18:37:41'),
(4, 'Pago de Servicios', 'Pago de servicios públicos', 0, 1.50, '2025-05-24 18:37:41');


DROP TABLE IF EXISTS `transacciones`;
CREATE TABLE IF NOT EXISTS `transacciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numero_transaccion` varchar(30) NOT NULL,
  `tipo_transaccion_id` int NOT NULL,
  `cuenta_origen_id` int NOT NULL,
  `cuenta_destino_id` int DEFAULT NULL,
  `monto` decimal(15,2) NOT NULL,
  `comision` decimal(8,2) DEFAULT '0.00',
  `descripcion` text,
  `estado` enum('pendiente','completada','fallida','cancelada') DEFAULT 'pendiente',
  `cajero_id` int DEFAULT NULL,
  `sucursal_id` int NOT NULL,
  `fecha_transaccion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_procesamiento` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `numero_transaccion` (`numero_transaccion`),
  KEY `tipo_transaccion_id` (`tipo_transaccion_id`),
  KEY `cuenta_destino_id` (`cuenta_destino_id`),
  KEY `cajero_id` (`cajero_id`),
  KEY `sucursal_id` (`sucursal_id`),
  KEY `idx_transacciones_fecha` (`fecha_transaccion`),
  KEY `idx_transacciones_cuenta_origen` (`cuenta_origen_id`)
) ;

INSERT INTO `transacciones` (`id`, `numero_transaccion`, `tipo_transaccion_id`, `cuenta_origen_id`, `cuenta_destino_id`, `monto`, `comision`, `descripcion`, `estado`, `cajero_id`, `sucursal_id`, `fecha_transaccion`, `fecha_procesamiento`, `created_at`) VALUES
(1, '1', 1, 1, 1, 100.00, 0.00, NULL, 'pendiente', NULL, 0, '2025-05-27 00:55:30', NULL, '2025-05-27 00:55:30');

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `nombre_completo` varchar(150) NOT NULL,
  `dui` varchar(10) DEFAULT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `direccion` text,
  `fecha_nacimiento` date DEFAULT NULL,
  `genero` enum('M','F','Otro') DEFAULT NULL,
  `profesion` varchar(100) DEFAULT NULL,
  `salario` decimal(10,2) DEFAULT NULL,
  `rol_id` int NOT NULL,
  `sucursal_id` int DEFAULT NULL,
  `estado` enum('activo','inactivo','suspendido') DEFAULT 'activo',
  `ultimo_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `dui` (`dui`),
  KEY `rol_id` (`rol_id`),
  KEY `sucursal_id` (`sucursal_id`),
  KEY `idx_usuarios_email` (`email`),
  KEY `idx_usuarios_dui` (`dui`)
);

INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `nombre_completo`, `dui`, `telefono`, `direccion`, `fecha_nacimiento`, `genero`, `profesion`, `salario`, `rol_id`, `sucursal_id`, `estado`, `ultimo_login`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@agrobanco.com', 'admin2025', 'Administrador del Sistema', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, 'activo', '2025-05-27 08:32:47', '2025-05-24 18:37:41', '2025-05-27 08:32:47'),
(2, 'cliente', 'cliente@gmail.com', 'admin2025', 'Cliente', '046765789', '78573605', 'asdasdasdasd', '1992-08-28', 'M', 'asdasdasd', 500.00, 4, 4, 'activo', '2025-05-27 08:34:48', '2025-05-24 20:47:01', '2025-05-27 08:34:48'),
(3, 'cajero', 'cajero@gmail.com', 'admin2025', 'Cajero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, 'activo', NULL, '2025-05-24 20:47:43', '2025-05-26 23:24:44'),
(4, 'gerente', 'gerente@gmail.com', 'admin2025', 'Gerente', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, NULL, 'activo', '2025-05-27 05:26:54', '2025-05-24 20:49:28', '2025-05-27 05:26:54');
