-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 12-05-2025 a las 22:57:52
-- Versión del servidor: 8.3.0
-- Versión de PHP: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `banco_db`
--
CREATE DATABASE IF NOT EXISTS `banco_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `banco_db`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

DROP TABLE IF EXISTS `cliente`;
CREATE TABLE IF NOT EXISTS `cliente` (
  `id_cliente` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `dui` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nombres` varchar(100) DEFAULT NULL,
  `apellidos` varchar(100) DEFAULT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `telefono` varchar(9) DEFAULT NULL,
  `lugar_trabajo` varchar(200) DEFAULT NULL,
  `salario` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id_cliente`),
  KEY `id_usuario` (`id_usuario`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `cliente`
--

INSERT INTO `cliente` (`id_cliente`, `id_usuario`, `dui`, `nombres`, `apellidos`, `direccion`, `telefono`, `lugar_trabajo`, `salario`) VALUES
(1, 3, '12345678-9', 'Carlos', 'García', 'Colonia Escalón, SS', '77778888', 'Empresa XYZ', 1200.00),
(2, 4, '23456789-0', 'Rosa', 'Vásquez', 'Santa Tecla, LP', '76667777', 'Tienda Local', 700.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cuenta`
--

DROP TABLE IF EXISTS `cuenta`;
CREATE TABLE IF NOT EXISTS `cuenta` (
  `id_cuenta` int NOT NULL AUTO_INCREMENT,
  `id_cliente` int DEFAULT NULL,
  `numero_cuenta` varchar(10) DEFAULT NULL,
  `saldo` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id_cuenta`),
  KEY `id_cliente` (`id_cliente`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `cuenta`
--

INSERT INTO `cuenta` (`id_cuenta`, `id_cliente`, `numero_cuenta`, `saldo`) VALUES
(1, 1, '0012345678', 910.00),
(2, 2, '0098765432', 1500.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dependiente`
--

DROP TABLE IF EXISTS `dependiente`;
CREATE TABLE IF NOT EXISTS `dependiente` (
  `id_dependiente` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `cui` char(10) DEFAULT NULL,
  `nombre_comercio` varchar(100) DEFAULT NULL,
  `comision` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id_dependiente`),
  KEY `id_usuario` (`id_usuario`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `dependiente`
--

INSERT INTO `dependiente` (`id_dependiente`, `id_usuario`, `cui`, `nombre_comercio`, `comision`) VALUES
(1, 5, 'C003445566', 'Comedor Rojas', 5.50);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleado`
--

DROP TABLE IF EXISTS `empleado`;
CREATE TABLE IF NOT EXISTS `empleado` (
  `id_empleado` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `id_sucursal` int DEFAULT NULL,
  `id_rol` int DEFAULT NULL,
  `dui` char(10) DEFAULT NULL,
  `nombres` varchar(100) DEFAULT NULL,
  `apellidos` varchar(100) DEFAULT NULL,
  `salario` decimal(10,2) DEFAULT NULL,
  `activo` char(1) DEFAULT NULL,
  PRIMARY KEY (`id_empleado`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_sucursal` (`id_sucursal`),
  KEY `id_rol` (`id_rol`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `empleado`
--

INSERT INTO `empleado` (`id_empleado`, `id_usuario`, `id_sucursal`, `id_rol`, `dui`, `nombres`, `apellidos`, `salario`, `activo`) VALUES
(1, 1, 1, 1, '01234567-8', 'José', 'López', 600.00, 'S'),
(2, 2, 2, 2, '98765432-1', 'María', 'Hernández', 850.00, 'S');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimiento`
--

DROP TABLE IF EXISTS `movimiento`;
CREATE TABLE IF NOT EXISTS `movimiento` (
  `id_movimiento` int NOT NULL AUTO_INCREMENT,
  `id_cuenta` int DEFAULT NULL,
  `tipo_movimiento` varchar(10) DEFAULT NULL,
  `monto` decimal(10,2) DEFAULT NULL,
  `fecha_hora` datetime DEFAULT NULL,
  `cuenta_origen` int DEFAULT NULL,
  `cuenta_destino` int DEFAULT NULL,
  PRIMARY KEY (`id_movimiento`),
  KEY `id_cuenta` (`id_cuenta`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `movimiento`
--

INSERT INTO `movimiento` (`id_movimiento`, `id_cuenta`, `tipo_movimiento`, `monto`, `fecha_hora`, `cuenta_origen`, `cuenta_destino`) VALUES
(1, 1, 'DEPOSITO', 300.00, '2025-05-12 16:22:52', NULL, NULL),
(2, 2, 'TRANSFER', 100.00, '2025-05-12 16:22:52', 2, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prestamo`
--

DROP TABLE IF EXISTS `prestamo`;
CREATE TABLE IF NOT EXISTS `prestamo` (
  `id_prestamo` int NOT NULL AUTO_INCREMENT,
  `id_cliente` int DEFAULT NULL,
  `id_cajero` int DEFAULT NULL,
  `monto_prestamo` decimal(10,2) DEFAULT NULL,
  `tasa_interes` decimal(10,2) DEFAULT NULL,
  `plazo_meses` int DEFAULT NULL,
  `cuota_mensual` decimal(10,2) DEFAULT NULL,
  `estado_prestamo` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_prestamo`),
  KEY `id_cliente` (`id_cliente`),
  KEY `id_cajero` (`id_cajero`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `prestamo`
--

INSERT INTO `prestamo` (`id_prestamo`, `id_cliente`, `id_cajero`, `monto_prestamo`, `tasa_interes`, `plazo_meses`, `cuota_mensual`, `estado_prestamo`) VALUES
(1, 1, 1, 5000.00, 5.00, 12, 450.00, 'Activo'),
(2, 2, 1, 3000.00, 4.50, 10, 320.00, 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

DROP TABLE IF EXISTS `rol`;
CREATE TABLE IF NOT EXISTS `rol` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id_rol`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`id_rol`, `nombre`) VALUES
(1, 'Cajero'),
(2, 'Gerente'),
(3, 'Asesor');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sucursal`
--

DROP TABLE IF EXISTS `sucursal`;
CREATE TABLE IF NOT EXISTS `sucursal` (
  `id_sucursal` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `telefono` varchar(9) DEFAULT NULL,
  PRIMARY KEY (`id_sucursal`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sucursal`
--

INSERT INTO `sucursal` (`id_sucursal`, `nombre`, `direccion`, `telefono`) VALUES
(1, 'Sucursal Centro', 'Av. Bolívar #234, San Salvador', '22221111'),
(2, 'Sucursal Norte', 'Calle el Progreso #45, Apopa', '22223333');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

DROP TABLE IF EXISTS `usuario`;
CREATE TABLE IF NOT EXISTS `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `usuario` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  PRIMARY KEY (`id_usuario`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `usuario`, `password`) VALUES
(1, 'jlopez', '1234'),
(2, 'mhernandez', 'abcd'),
(3, 'cgarcia', 'admin123'),
(4, 'rvasquez', 'pass456'),
(5, 'krojas', 'clave789');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
