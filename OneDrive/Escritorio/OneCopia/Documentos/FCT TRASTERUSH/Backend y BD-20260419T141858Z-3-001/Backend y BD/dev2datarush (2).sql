-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 24, 2026 at 12:34 PM
-- Server version: 10.11.14-MariaDB-0+deb12u2
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dev2datarush`
--

-- --------------------------------------------------------

--
-- Table structure for table `alquileres`
--

CREATE TABLE `alquileres` (
  `id_alquiler` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_trastero` int(11) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date DEFAULT NULL,
  `estado` enum('pendiente_pago','activo','finalizado','cancelado','pagado') DEFAULT 'pendiente_pago',
  `precio_mensual_aplicado` double NOT NULL,
  `creado_en` datetime DEFAULT current_timestamp(),
  `importe_total` double NOT NULL DEFAULT 0,
  `contrato` longblob DEFAULT NULL,
  `codigo_acceso` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `alquileres`
--

INSERT INTO `alquileres` (`id_alquiler`, `id_usuario`, `id_trastero`, `fecha_inicio`, `fecha_fin`, `estado`, `precio_mensual_aplicado`, `creado_en`, `importe_total`, `contrato`, `codigo_acceso`) VALUES
(113, 5, 15, '2026-02-20', '2026-03-20', 'finalizado', 100, '2026-03-19 13:08:17', 100, NULL, 985589),
(115, 5, 1, '2026-03-20', '2026-04-20', 'pagado', 150, '2026-03-20 09:33:37', 150, NULL, 620626),
(118, 8, 2, '2026-03-27', '2026-05-27', 'pagado', 150, '2026-03-20 10:59:41', 300, NULL, 618573);

--
-- Triggers `alquileres`
--
DELIMITER $$
CREATE TRIGGER `after_insert_alquiler` AFTER INSERT ON `alquileres` FOR EACH ROW BEGIN
    -- Cambiar el estado del trastero a 'ocupado' después de un nuevo alquiler
    UPDATE `trasteros`
    SET `estado` = 'ocupado'
    WHERE `id_trastero` = NEW.`id_trastero`;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_insert_alquiler_hist` AFTER INSERT ON `alquileres` FOR EACH ROW BEGIN
  INSERT INTO historico_alquileres (
    id_alquiler,
    id_usuario,
    id_trastero,
    fecha_inicio,
    fecha_fin,
    estado,
    precio_mensual_aplicado,
    importe_total,
    accion
  )
  VALUES (
    NEW.id_alquiler,
    NEW.id_usuario,
    NEW.id_trastero,
    NEW.fecha_inicio,
    NEW.fecha_fin,
    NEW.estado,
    NEW.precio_mensual_aplicado,
    NEW.importe_total,
    'INSERT'
  );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `before_delete_alquiler_hist` BEFORE DELETE ON `alquileres` FOR EACH ROW BEGIN
  INSERT INTO historico_alquileres (
    id_alquiler,
    id_usuario,
    id_trastero,
    fecha_inicio,
    fecha_fin,
    estado,
    precio_mensual_aplicado,
    importe_total,
    accion
  )
  VALUES (
    OLD.id_alquiler,
    OLD.id_usuario,
    OLD.id_trastero,
    OLD.fecha_inicio,
    OLD.fecha_fin,
    OLD.estado,
    OLD.precio_mensual_aplicado,
    OLD.importe_total,
    'DELETE'
  );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `before_update_alquiler_hist` BEFORE UPDATE ON `alquileres` FOR EACH ROW BEGIN
  INSERT INTO historico_alquileres (
    id_alquiler,
    id_usuario,
    id_trastero,
    fecha_inicio,
    fecha_fin,
    estado,
    precio_mensual_aplicado,
    importe_total,
    accion
  )
  VALUES (
    OLD.id_alquiler,
    OLD.id_usuario,
    OLD.id_trastero,
    OLD.fecha_inicio,
    OLD.fecha_fin,
    OLD.estado,
    OLD.precio_mensual_aplicado,
    OLD.importe_total,
    'UPDATE'
  );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `calcular_importe_insert` BEFORE INSERT ON `alquileres` FOR EACH ROW BEGIN
    DECLARE meses INT;

    -- Calcular meses completos (aproximación por 30 días)
    SET meses = PERIOD_DIFF(EXTRACT(YEAR_MONTH FROM NEW.fecha_fin), EXTRACT(YEAR_MONTH FROM NEW.fecha_inicio));
    
    -- Si la diferencia da 0, al menos 1 mes
    IF meses = 0 THEN
        SET meses = 1;
    END IF;

    -- Calcular importe_total
    SET NEW.importe_total = meses * NEW.precio_mensual_aplicado;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `tr_calcular_importe_update` BEFORE UPDATE ON `alquileres` FOR EACH ROW BEGIN
    DECLARE meses INT;

    -- Calcular meses completos
    SET meses = PERIOD_DIFF(EXTRACT(YEAR_MONTH FROM NEW.fecha_fin), EXTRACT(YEAR_MONTH FROM NEW.fecha_inicio));

    IF meses = 0 THEN
        SET meses = 1;
    END IF;

    SET NEW.importe_total = meses * NEW.precio_mensual_aplicado;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Stand-in structure for view `alquileres_historico`
-- (See below for the actual view)
--
CREATE TABLE `alquileres_historico` (
`id_alquiler` int(11)
,`id_usuario` int(11)
,`id_trastero` int(11)
,`fecha_inicio` date
,`fecha_fin` date
,`estado` enum('pendiente_pago','activo','finalizado','cancelado','pagado')
,`precio_mensual_aplicado` double
,`creado_en` datetime
,`importe_total` double
,`contrato` longblob
,`codigo_acceso` int(11)
);

-- --------------------------------------------------------

--
-- Table structure for table `historico_alquileres`
--

CREATE TABLE `historico_alquileres` (
  `id_historico` int(11) NOT NULL,
  `id_alquiler` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_trastero` int(11) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `precio_mensual_aplicado` double NOT NULL,
  `importe_total` double NOT NULL,
  `accion` enum('INSERT','UPDATE','DELETE') NOT NULL,
  `fecha_cambio` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `historico_alquileres`
--

INSERT INTO `historico_alquileres` (`id_historico`, `id_alquiler`, `id_usuario`, `id_trastero`, `fecha_inicio`, `fecha_fin`, `estado`, `precio_mensual_aplicado`, `importe_total`, `accion`, `fecha_cambio`) VALUES
(8, 109, 2, 1, '2026-03-26', '2026-05-26', 'pagado', 150, 300, 'INSERT', '2026-03-19 13:00:55'),
(9, 109, 2, 1, '2026-03-26', '2026-05-26', 'pagado', 150, 300, 'UPDATE', '2026-03-19 13:01:34'),
(10, 109, 2, 1, '2026-03-26', '2026-03-19', 'finalizado', 150, 150, 'DELETE', '2026-03-19 13:03:44'),
(11, 110, 2, 15, '2026-03-26', '2026-05-26', 'pagado', 100, 200, 'INSERT', '2026-03-19 13:04:09'),
(12, 110, 2, 15, '2026-03-26', '2026-05-26', 'pagado', 100, 200, 'DELETE', '2026-03-19 13:04:40'),
(13, 111, 5, 2, '2026-03-25', '2026-04-25', 'pagado', 150, 150, 'INSERT', '2026-03-19 13:05:20'),
(14, 112, 2, 3, '2026-02-19', '2026-03-19', 'pagado', 150, 150, 'INSERT', '2026-03-19 13:06:37'),
(15, 112, 2, 3, '2026-02-19', '2026-03-19', 'pagado', 150, 150, 'DELETE', '2026-03-19 13:07:22'),
(16, 113, 5, 15, '2026-02-20', '2026-03-20', 'pagado', 100, 100, 'INSERT', '2026-03-19 13:08:17'),
(17, 111, 5, 2, '2026-03-25', '2026-04-25', 'pagado', 150, 150, 'UPDATE', '2026-03-19 13:30:39'),
(18, 114, 2, 1, '2026-03-27', '2026-05-27', 'pagado', 150, 300, 'INSERT', '2026-03-20 09:24:43'),
(19, 114, 2, 1, '2026-03-27', '2026-05-27', 'pagado', 150, 300, 'DELETE', '2026-03-20 09:26:27'),
(20, 115, 5, 1, '2026-03-20', '2026-04-20', 'pagado', 150, 150, 'INSERT', '2026-03-20 09:33:37'),
(21, 116, 2, 2, '2026-03-20', '2026-05-20', 'pagado', 150, 300, 'INSERT', '2026-03-20 09:33:45'),
(22, 117, 5, 3, '2026-03-20', '2026-09-20', 'pagado', 150, 900, 'INSERT', '2026-03-20 09:34:06'),
(23, 116, 2, 2, '2026-03-20', '2026-05-20', 'pagado', 150, 300, 'DELETE', '2026-03-20 09:34:08'),
(24, 111, 5, 2, '2026-03-25', '2026-04-25', 'finalizado', 150, 150, 'DELETE', '2026-03-20 09:37:04'),
(25, 118, 8, 2, '2026-03-27', '2026-05-27', 'pagado', 150, 300, 'INSERT', '2026-03-20 10:59:41'),
(26, 113, 5, 15, '2026-02-20', '2026-03-20', 'pagado', 100, 100, 'UPDATE', '2026-03-23 10:04:28'),
(27, 119, 2, 4, '2026-03-25', '2026-05-25', 'pagado', 150, 300, 'INSERT', '2026-03-24 11:10:06'),
(28, 120, 14, 5, '2026-03-31', '2026-05-31', 'pagado', 150, 300, 'INSERT', '2026-03-24 11:27:28'),
(29, 120, 14, 5, '2026-03-31', '2026-05-31', 'pagado', 150, 300, 'DELETE', '2026-03-24 12:13:54'),
(30, 119, 2, 4, '2026-03-25', '2026-05-25', 'pagado', 150, 300, 'DELETE', '2026-03-24 12:14:42'),
(31, 117, 5, 3, '2026-03-20', '2026-09-20', 'pagado', 150, 900, 'DELETE', '2026-03-24 12:19:48');

-- --------------------------------------------------------

--
-- Table structure for table `trasteros`
--

CREATE TABLE `trasteros` (
  `id_trastero` int(11) NOT NULL,
  `codigo` int(11) DEFAULT NULL,
  `tamanio` enum('pequeño','mediano','grande') NOT NULL,
  `precio` double NOT NULL,
  `estado` enum('libre','ocupado','mantenimiento') DEFAULT 'libre',
  `id_rele` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trasteros`
--

INSERT INTO `trasteros` (`id_trastero`, `codigo`, `tamanio`, `precio`, `estado`, `id_rele`) VALUES
(1, 620626, 'grande', 150, 'ocupado', 1),
(2, 618573, 'grande', 150, 'ocupado', 2),
(3, NULL, 'grande', 150, 'libre', 3),
(4, NULL, 'grande', 150, 'libre', 4),
(5, NULL, 'grande', 150, 'libre', 5),
(6, NULL, 'pequeño', 50, 'mantenimiento', 6),
(7, NULL, 'pequeño', 50, 'mantenimiento', 7),
(8, NULL, 'pequeño', 50, 'mantenimiento', 8),
(9, NULL, 'pequeño', 50, 'mantenimiento', 9),
(10, NULL, 'pequeño', 50, 'mantenimiento', 10),
(11, NULL, 'mediano', 100, 'mantenimiento', 11),
(12, NULL, 'mediano', 100, 'libre', 12),
(13, NULL, 'mediano', 100, 'libre', 13),
(14, NULL, 'mediano', 100, 'libre', 14),
(15, 985589, 'mediano', 100, 'libre', 15);

-- --------------------------------------------------------

--
-- Table structure for table `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` int(11) NOT NULL DEFAULT 0,
  `dni` varchar(9) DEFAULT NULL,
  `direccion` varchar(200) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `token_sesion` varchar(255) DEFAULT NULL,
  `cif` varchar(10) DEFAULT NULL,
  `razon_social` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombre`, `email`, `password`, `rol`, `dni`, `direccion`, `telefono`, `token_sesion`, `cif`, `razon_social`) VALUES
(2, 'Rafael Garcia', 'rafaele@gmail.com', 'rafa', 0, '22463809H', 'Calle  Alemania', '62261110', NULL, NULL, NULL),
(5, 'paco', 'paco@gmail.com', '$2y$10$04iu8BSavSidMlh6YMZkw.O7bJrTko6puS5VlIWmooGapQLLJEbtq', 0, '432156', 'calle nueva ', '2345', NULL, NULL, NULL),
(8, 'edus', 'edu@gmail.com', '$2y$10$GLLnk6hhcSKcpDupAjU45uN9F.3kDt1hbaRrccDcjDuMpmYSEsCAS', 1, '1111111', 'jjj', '22222', NULL, NULL, NULL),
(9, 'admin', 'admin@gmail.com', '$2y$10$urffpEK0KbStAZ2meUAxteK/e6oFDncG4fD7a9uvwu9RmBckMVUlq', 1, '000', '000', '000', NULL, NULL, NULL),
(10, 'eduardo', 'eduardo@gmail.com', '$2y$10$jfnxXtwckcFJM38suj..4uJDx91IiZ1Y1Vj/F.7I64gdBR5sQYe7y', 1, '444', 'ssss', '2222', NULL, NULL, NULL),
(14, 'fede', 'fede@gmail.com', '$2y$10$tI3rdKBHXToPZyJiqhicE.ulm7VtDX9HWxX1LpElGRQmgz4JSr.6q', 0, '32345', 'torremolinos', '4444', NULL, NULL, NULL),
(15, 'Caye', 'caye@gmail.com', '$2y$10$7kYvtoKGSTNxoJDBy87ymulKzvVAcRI60U39EQoNQmNkWgIPA0Hr6', 1, '123456789', 'calle caye', '001122334', NULL, NULL, NULL),
(16, 'Sofia Perez', 'sofia@gmail.com', '$2y$10$ciCbwBdC4YuHHLCJCD1m6eIOTXswc/DdllA58lDxtCzmCKE4Wj2I2', 0, '46328907J', 'Calle Francia 6 1ª A', '832124565', NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alquileres`
--
ALTER TABLE `alquileres`
  ADD PRIMARY KEY (`id_alquiler`),
  ADD KEY `idx_alquiler_usuario` (`id_usuario`),
  ADD KEY `idx_alquiler_trastero` (`id_trastero`),
  ADD KEY `idx_alquiler_estado` (`estado`);

--
-- Indexes for table `historico_alquileres`
--
ALTER TABLE `historico_alquileres`
  ADD PRIMARY KEY (`id_historico`);

--
-- Indexes for table `trasteros`
--
ALTER TABLE `trasteros`
  ADD PRIMARY KEY (`id_trastero`),
  ADD UNIQUE KEY `codigo` (`codigo`);

--
-- Indexes for table `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alquileres`
--
ALTER TABLE `alquileres`
  MODIFY `id_alquiler` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=121;

--
-- AUTO_INCREMENT for table `historico_alquileres`
--
ALTER TABLE `historico_alquileres`
  MODIFY `id_historico` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `trasteros`
--
ALTER TABLE `trasteros`
  MODIFY `id_trastero` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

-- --------------------------------------------------------

--
-- Structure for view `alquileres_historico`
--
DROP TABLE IF EXISTS `alquileres_historico`;

CREATE ALGORITHM=UNDEFINED DEFINER=`dev2_datarush`@`localhost` SQL SECURITY DEFINER VIEW `alquileres_historico`  AS SELECT `alquileres`.`id_alquiler` AS `id_alquiler`, `alquileres`.`id_usuario` AS `id_usuario`, `alquileres`.`id_trastero` AS `id_trastero`, `alquileres`.`fecha_inicio` AS `fecha_inicio`, `alquileres`.`fecha_fin` AS `fecha_fin`, `alquileres`.`estado` AS `estado`, `alquileres`.`precio_mensual_aplicado` AS `precio_mensual_aplicado`, `alquileres`.`creado_en` AS `creado_en`, `alquileres`.`importe_total` AS `importe_total`, `alquileres`.`contrato` AS `contrato`, `alquileres`.`codigo_acceso` AS `codigo_acceso` FROM `alquileres` WHERE `alquileres`.`fecha_fin` < curdate() ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `alquileres`
--
ALTER TABLE `alquileres`
  ADD CONSTRAINT `fk_alquiler_trastero` FOREIGN KEY (`id_trastero`) REFERENCES `trasteros` (`id_trastero`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_alquiler_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
