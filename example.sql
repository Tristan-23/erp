-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.2.0 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for erp
CREATE DATABASE IF NOT EXISTS `erp` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `erp`;

-- Dumping structure for table erp.dashboard
CREATE TABLE IF NOT EXISTS `dashboard` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  `begin_time` timestamp NULL DEFAULT NULL,
  `end_time` timestamp NULL DEFAULT NULL,
  `active_time` time DEFAULT NULL,
  `start_break` timestamp NULL DEFAULT NULL,
  `stop_break` timestamp NULL DEFAULT NULL,
  `passive_time` time DEFAULT NULL,
  `worked_time` time DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table erp.dashboard: 3 rows
/*!40000 ALTER TABLE `dashboard` DISABLE KEYS */;
INSERT INTO `dashboard` (`id`, `user_id`, `project_id`, `begin_time`, `end_time`, `active_time`, `start_break`, `stop_break`, `passive_time`, `worked_time`, `created_at`) VALUES
	(29, 11, NULL, '2024-06-12 11:31:50', '2024-06-12 11:31:53', '00:00:03', '2024-06-12 11:31:50', '2024-06-12 11:31:52', '00:00:02', '00:00:01', '2024-06-12 11:31:53'),
	(28, 11, NULL, '2024-06-12 11:31:44', '2024-06-12 11:31:47', '00:00:03', NULL, NULL, '00:00:00', '00:00:03', '2024-06-12 11:31:47'),
	(27, 11, NULL, '2024-06-12 11:26:02', '2024-06-12 11:26:05', '00:00:03', '2024-06-12 11:26:03', '2024-06-12 11:26:04', '00:00:01', '00:00:02', '2024-06-12 11:26:05');
/*!40000 ALTER TABLE `dashboard` ENABLE KEYS */;

-- Dumping structure for table erp.opdrachten
CREATE TABLE IF NOT EXISTS `opdrachten` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_of_customers` json NOT NULL,
  `id_of_workers` json NOT NULL,
  `project_name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table erp.opdrachten: 0 rows
/*!40000 ALTER TABLE `opdrachten` DISABLE KEYS */;
INSERT INTO `opdrachten` (`id`, `id_of_customers`, `id_of_workers`, `project_name`) VALUES
	(2, '[{"user_id": 1}, {"user_id": 2}]', '[{"user_id": 1}, {"user_id": 2}]', 'Bami');
/*!40000 ALTER TABLE `opdrachten` ENABLE KEYS */;

-- Dumping structure for table erp.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `secret_password` varchar(500) DEFAULT NULL,
  `permission_level` int DEFAULT NULL,
  `name` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table erp.users: 1 rows
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `email`, `secret_password`, `permission_level`, `name`) VALUES
	(11, 'bami.bal@outlook.com', 'f7000fdc3aa978f6f12445e82d2ab071', 50, '2024-06-11 12:45:39');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
