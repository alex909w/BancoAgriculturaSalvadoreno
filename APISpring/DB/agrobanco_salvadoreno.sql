-- Script corregido para AgroBanco Salvadoreño con relaciones correctas
-- filepath: c:\Users\rosma\OneDrive\Escritorio\DWF\BancoAgriculturaSalvadoreno\APISpring\DB\agrobanco_salvadoreno_corregido.sql

CREATE DATABASE IF NOT EXISTS `agrobanco_salvadoreno`;
USE `agrobanco_salvadoreno`;

-- Deshabilitar verificación de claves foráneas temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- Eliminar todas las tablas en el orden correcto
DROP TABLE IF EXISTS `auditoria`;
DROP TABLE IF EXISTS `pagos_prestamos`;
DROP TABLE IF EXISTS `prestamos`;
DROP TABLE IF EXISTS `beneficiarios`;
DROP TABLE IF EXISTS `transacciones`;
DROP TABLE IF EXISTS `cuentas`;
DROP TABLE IF EXISTS `solicitudes_empleados`;
DROP TABLE IF EXISTS `usuarios`;
DROP TABLE IF EXISTS `configuracion_sistema`;
DROP TABLE IF EXISTS `tipos_transaccion`;
DROP TABLE IF EXISTS `tipos_prestamo`;
DROP TABLE IF EXISTS `tipos_cuenta`;
DROP TABLE IF EXISTS `sucursales`;
DROP TABLE IF EXISTS `roles`;

-- Crear tablas en el orden correcto (tablas padre primero)

-- 1. Tabla roles (no tiene dependencias)
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabla sucursales (no tiene dependencias)
CREATE TABLE `sucursales` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabla tipos_cuenta (no tiene dependencias)
CREATE TABLE `tipos_cuenta` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` text,
  `tasa_interes` decimal(5,4) DEFAULT '0.0000',
  `monto_minimo` decimal(10,2) DEFAULT '0.00',
  `comision_mantenimiento` decimal(8,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabla tipos_prestamo (no tiene dependencias)
CREATE TABLE `tipos_prestamo` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Tabla tipos_transaccion (no tiene dependencias)
CREATE TABLE `tipos_transaccion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` text,
  `requiere_cuenta_destino` tinyint(1) DEFAULT '0',
  `comision` decimal(8,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Tabla usuarios (depende de roles y sucursales)
CREATE TABLE `usuarios` (
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
  KEY `idx_usuarios_dui` (`dui`),
  CONSTRAINT `fk_usuarios_rol` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_usuarios_sucursal` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Tabla configuracion_sistema (depende de usuarios)
CREATE TABLE `configuracion_sistema` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clave` varchar(100) NOT NULL,
  `valor` text NOT NULL,
  `descripcion` text,
  `tipo` enum('string','number','boolean','json') DEFAULT 'string',
  `updated_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clave` (`clave`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `fk_configuracion_usuario` FOREIGN KEY (`updated_by`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Tabla cuentas (depende de usuarios, tipos_cuenta, sucursales)
CREATE TABLE `cuentas` (
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
  KEY `idx_cuentas_cliente` (`cliente_id`),
  CONSTRAINT `fk_cuentas_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_cuentas_tipo` FOREIGN KEY (`tipo_cuenta_id`) REFERENCES `tipos_cuenta` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_cuentas_sucursal` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Tabla beneficiarios (depende de cuentas)
CREATE TABLE `beneficiarios` (
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
  KEY `cuenta_id` (`cuenta_id`),
  CONSTRAINT `fk_beneficiarios_cuenta` FOREIGN KEY (`cuenta_id`) REFERENCES `cuentas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Tabla solicitudes_empleados (depende de sucursales y usuarios)
CREATE TABLE `solicitudes_empleados` (
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
  KEY `gerente_revisor_id` (`gerente_revisor_id`),
  CONSTRAINT `fk_solicitudes_sucursal` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_solicitudes_gerente` FOREIGN KEY (`gerente_revisor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Tabla prestamos (depende de usuarios, tipos_prestamo, cuentas)
CREATE TABLE `prestamos` (
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
  KEY `idx_prestamos_estado` (`estado`),
  CONSTRAINT `fk_prestamos_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_prestamos_tipo` FOREIGN KEY (`tipo_prestamo_id`) REFERENCES `tipos_prestamo` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_prestamos_cuenta` FOREIGN KEY (`cuenta_vinculada_id`) REFERENCES `cuentas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_prestamos_cajero` FOREIGN KEY (`cajero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_prestamos_gerente` FOREIGN KEY (`gerente_aprobador_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Tabla transacciones (depende de tipos_transaccion, cuentas, usuarios, sucursales)
CREATE TABLE `transacciones` (
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
  KEY `idx_transacciones_cuenta_origen` (`cuenta_origen_id`),
  CONSTRAINT `fk_transacciones_tipo` FOREIGN KEY (`tipo_transaccion_id`) REFERENCES `tipos_transaccion` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_transacciones_cuenta_origen` FOREIGN KEY (`cuenta_origen_id`) REFERENCES `cuentas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_transacciones_cuenta_destino` FOREIGN KEY (`cuenta_destino_id`) REFERENCES `cuentas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_transacciones_cajero` FOREIGN KEY (`cajero_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_transacciones_sucursal` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Tabla pagos_prestamos (depende de prestamos y transacciones)
CREATE TABLE `pagos_prestamos` (
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
  KEY `transaccion_id` (`transaccion_id`),
  CONSTRAINT `fk_pagos_prestamo` FOREIGN KEY (`prestamo_id`) REFERENCES `prestamos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_pagos_transaccion` FOREIGN KEY (`transaccion_id`) REFERENCES `transacciones` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Tabla auditoria (depende de usuarios)
CREATE TABLE `auditoria` (
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
  KEY `idx_auditoria_tabla_registro` (`tabla_afectada`,`registro_id`),
  CONSTRAINT `fk_auditoria_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar datos en el orden correcto

-- Insertar roles
INSERT INTO `roles` (`id`, `nombre`, `descripcion`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'Administrador del sistema', '2025-05-24 18:37:41', '2025-05-24 18:37:41'),
(2, 'gerente', 'Gerente de sucursal', '2025-05-24 18:37:41', '2025-05-24 18:37:41'),
(3, 'cajero', 'Cajero de ventanilla', '2025-05-24 18:37:41', '2025-05-24 18:37:41'),
(4, 'cliente', 'Cliente del banco', '2025-05-24 18:37:41', '2025-05-24 18:37:41');

-- Insertar sucursales
INSERT INTO `sucursales` (`id`, `nombre`, `codigo`, `departamento`, `municipio`, `direccion`, `telefono`, `email`, `tipo`, `estado`, `created_at`, `updated_at`) VALUES
(1, 'Sucursal Central', 'SC001', 'San Salvador', 'San Salvador', 'Av. Roosevelt, Centro Comercial Metrocentro', '2250-1000', NULL, 'standard', 'activa', '2025-05-24 18:37:41', '2025-05-24 18:37:41'),
(2, 'Sucursal El Paseo', 'EP002', 'San Salvador', 'Santa Tecla', 'Centro Comercial El Paseo', '2250-1001', NULL, 'express', 'activa', '2025-05-24 18:37:41', '2025-05-24 18:37:41'),
(3, 'Sucursal Buena Vista', 'BV003', 'San Salvador', 'Antiguo Cuscatlán', 'Plaza Buena Vista', '2250-1002', NULL, 'standard', 'activa', '2025-05-24 18:37:41', '2025-05-24 18:37:41'),
(4, 'Sucursal Amanecer', 'AM004', 'La Libertad', 'Comasagua', 'Centro de Comasagua', '2250-1003', NULL, 'express', 'activa', '2025-05-24 18:37:41', '2025-05-24 18:37:41');

-- Insertar tipos de cuenta
INSERT INTO `tipos_cuenta` (`id`, `nombre`, `descripcion`, `tasa_interes`, `monto_minimo`, `comision_mantenimiento`, `created_at`) VALUES
(1, 'Ahorros', 'Cuenta de ahorros básica', 0.0200, 25.00, 2.00, '2025-05-24 18:37:41'),
(2, 'Corriente', 'Cuenta corriente para empresas', 0.0100, 100.00, 5.00, '2025-05-24 18:37:41'),
(3, 'Dependiente', 'Cuenta para personas dependientes', 0.0150, 10.00, 1.00, '2025-05-24 18:37:41'),
(4, 'Independiente', 'Cuenta para personas independientes', 0.0250, 50.00, 3.00, '2025-05-24 18:37:41');

-- Insertar tipos de préstamo
INSERT INTO `tipos_prestamo` (`id`, `nombre`, `descripcion`, `tasa_interes`, `plazo_maximo_meses`, `monto_minimo`, `monto_maximo`, `requiere_garantia`, `created_at`) VALUES
(1, 'Personal', 'Préstamo personal sin garantía', 0.1200, 60, 500.00, 10000.00, 0, '2025-05-24 18:37:41'),
(2, 'Hipotecario', 'Préstamo para vivienda', 0.0800, 360, 5000.00, 150000.00, 1, '2025-05-24 18:37:41'),
(3, 'Automotriz', 'Préstamo para vehículos', 0.1000, 84, 2000.00, 50000.00, 1, '2025-05-24 18:37:41'),
(4, 'Agrícola', 'Préstamo para actividades agrícolas', 0.0900, 120, 1000.00, 25000.00, 0, '2025-05-24 18:37:41');

-- Insertar tipos de transacción
INSERT INTO `tipos_transaccion` (`id`, `nombre`, `descripcion`, `requiere_cuenta_destino`, `comision`, `created_at`) VALUES
(1, 'Depósito', 'Depósito en efectivo', 0, 0.00, '2025-05-24 18:37:41'),
(2, 'Retiro', 'Retiro en efectivo', 0, 1.00, '2025-05-24 18:37:41'),
(3, 'Transferencia', 'Transferencia entre cuentas', 1, 2.50, '2025-05-24 18:37:41'),
(4, 'Pago de Servicios', 'Pago de servicios públicos', 0, 1.50, '2025-05-24 18:37:41');

-- Insertar usuarios
INSERT INTO `usuarios` (`id`, `username`, `email`, `password_hash`, `nombre_completo`, `dui`, `telefono`, `direccion`, `fecha_nacimiento`, `genero`, `profesion`, `salario`, `rol_id`, `sucursal_id`, `estado`, `ultimo_login`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@agrobanco.com', 'admin2025', 'Administrador del Sistema', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, 'activo', '2025-05-27 08:32:47', '2025-05-24 18:37:41', '2025-05-27 08:32:47'),
(2, 'cliente', 'cliente@gmail.com', 'admin2025', 'Cliente', '04676578-9', '78573605', 'asdasdasdasd', '1992-08-28', 'M', 'asdasdasd', 500.00, 4, 4, 'activo', '2025-05-27 08:34:48', '2025-05-24 20:47:01', '2025-05-27 08:34:48'),
(3, 'cajero', 'cajero@gmail.com', 'admin2025', 'Cajero', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3, 1, 'activo', NULL, '2025-05-24 20:47:43', '2025-05-26 23:24:44'),
(4, 'gerente', 'gerente@gmail.com', 'admin2025', 'Gerente', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, 1, 'activo', '2025-05-27 05:26:54', '2025-05-24 20:49:28', '2025-05-27 05:26:54');

-- Insertar configuración del sistema
INSERT INTO `configuracion_sistema` (`id`, `clave`, `valor`, `descripcion`, `tipo`, `updated_by`, `updated_at`) VALUES
(1, 'banco_nombre', 'AgroBanco Salvadoreño', 'Nombre oficial del banco', 'string', NULL, '2025-05-24 18:37:42'),
(2, 'banco_slogan', 'Crecemos contigo desde la raíz', 'Slogan del banco', 'string', NULL, '2025-05-24 18:37:42'),
(3, 'tasa_interes_base', '0.05', 'Tasa de interés base del banco', 'number', NULL, '2025-05-24 18:37:42'),
(4, 'limite_transaccion_diaria', '5000.00', 'Límite de transacciones diarias', 'number', NULL, '2025-05-24 18:37:42'),
(5, 'notificaciones_activas', 'true', 'Estado de las notificaciones del sistema', 'boolean', NULL, '2025-05-24 18:37:42');

-- Insertar cuentas
INSERT INTO `cuentas` (`id`, `numero_cuenta`, `cliente_id`, `tipo_cuenta_id`, `sucursal_id`, `saldo`, `estado`, `tiene_seguro`, `fecha_apertura`, `fecha_cierre`, `created_at`, `updated_at`) VALUES
(1, '652732736823', 2, 1, 1, 1500.00, 'activa', 1, '2024-01-10', NULL, '2025-05-27 00:45:32', '2025-05-27 02:53:23'),
(2, '57687676666', 2, 2, 1, 3000.00, 'activa', 0, '2024-03-15', NULL, '2025-05-27 00:45:32', '2025-05-27 02:53:30');

-- Insertar beneficiarios
INSERT INTO `beneficiarios` (`id`, `cuenta_id`, `nombre_completo`, `dui`, `parentesco`, `porcentaje`, `telefono`, `direccion`, `created_at`) VALUES
(1, 1, 'María Pérez', '01234567-8', 'Esposa', 50.00, '70123456', 'Colonia Escalón, San Salvador', '2025-05-27 00:45:15'),
(2, 1, 'Luis Pérez', '12345678-9', 'Hijo', 50.00, '70123457', 'Colonia Escalón, San Salvador', '2025-05-27 00:45:15');

-- Insertar solicitudes de empleados
INSERT INTO `solicitudes_empleados` (`id`, `nombre_completo`, `dui`, `email`, `telefono`, `direccion`, `puesto_solicitado`, `salario_propuesto`, `sucursal_id`, `estado`, `fecha_solicitud`, `gerente_revisor_id`, `fecha_revision`, `observaciones`, `created_at`, `updated_at`) VALUES
(1, 'Carlos Hernández', '09876543-2', 'carlos@example.com', '77223344', 'San Miguel, El Salvador', 'Cajero', 500.00, 1, 'pendiente', '2025-05-20', NULL, NULL, NULL, '2025-05-27 00:45:51', '2025-05-27 00:45:51');

-- Insertar préstamos (corregido cliente_id)
INSERT INTO `prestamos` (`id`, `numero_prestamo`, `cliente_id`, `tipo_prestamo_id`, `cuenta_vinculada_id`, `monto_solicitado`, `monto_aprobado`, `tasa_interes`, `plazo_meses`, `cuota_mensual`, `saldo_pendiente`, `estado`, `tiene_seguro_vida`, `cobros_automaticos`, `fecha_solicitud`, `fecha_aprobacion`, `fecha_desembolso`, `fecha_vencimiento`, `cajero_id`, `gerente_aprobador_id`, `observaciones`, `created_at`, `updated_at`) VALUES
(1, 'PRE-001', 2, 1, 1, 1000.00, 1000.00, 0.0500, 12, 105.00, 1050.00, 'desembolsado', 0, 0, '2025-05-01', '2025-05-05', '2025-05-10', '2026-05-10', NULL, NULL, NULL, '2025-05-27 00:45:43', '2025-05-27 00:45:43');

-- Insertar transacciones (corregida sucursal_id)
INSERT INTO `transacciones` (`id`, `numero_transaccion`, `tipo_transaccion_id`, `cuenta_origen_id`, `cuenta_destino_id`, `monto`, `comision`, `descripcion`, `estado`, `cajero_id`, `sucursal_id`, `fecha_transaccion`, `fecha_procesamiento`, `created_at`) VALUES
(1, 'TRX-001', 1, 1, NULL, 100.00, 0.00, 'Depósito inicial', 'completada', 3, 1, '2025-05-27 00:55:30', '2025-05-27 00:55:30', '2025-05-27 00:55:30');

-- Insertar pagos de préstamos
INSERT INTO `pagos_prestamos` (`id`, `prestamo_id`, `numero_cuota`, `monto_cuota`, `monto_capital`, `monto_interes`, `fecha_vencimiento`, `fecha_pago`, `monto_pagado`, `estado`, `transaccion_id`, `created_at`) VALUES
(1, 1, 1, 105.00, 100.00, 5.00, '2025-06-15', '2025-06-10', 105.00, 'pagado', NULL, '2025-05-27 00:45:38'),
(2, 1, 2, 105.00, 100.00, 5.00, '2025-07-15', NULL, NULL, 'pendiente', NULL, '2025-05-27 00:45:38');

-- Habilitar verificación de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;

-- Crear índices adicionales para mejorar rendimiento
CREATE INDEX idx_cuentas_estado ON cuentas(estado);
CREATE INDEX idx_prestamos_fecha_solicitud ON prestamos(fecha_solicitud);
CREATE INDEX idx_transacciones_estado ON transacciones(estado);
CREATE INDEX idx_usuarios_estado ON usuarios(estado);

COMMIT;
