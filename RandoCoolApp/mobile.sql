-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 09, 2025 at 02:56 PM
-- Server version: 8.0.44-0ubuntu0.22.04.1
-- PHP Version: 8.1.2-1ubuntu2.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mobile`
--

-- --------------------------------------------------------

--
-- Table structure for table `rando`
--

CREATE TABLE `rando` (
  `id` int NOT NULL,
  `nom` varchar(255) NOT NULL,
  `longitude` double NOT NULL,
  `latitude` double NOT NULL,
  `longueur` float NOT NULL,
  `denivele` int NOT NULL,
  `difficulte` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `rando`
--

INSERT INTO `rando` (`id`, `nom`, `longitude`, `latitude`, `longueur`, `denivele`, `difficulte`) VALUES
(1, 'Mont Jacques-Cartier', -65.9547, 48.9889, 10.6, 465, 4),
(2, 'Mont Albert', -65.8833, 49.0167, 17.2, 775, 5),
(3, 'Mont Xalibu', -66.0167, 48.9833, 9.8, 530, 4),
(4, 'Lac aux Américains', -65.9333, 49, 15.4, 320, 3),
(5, 'Mont Joseph-Fortin', -65.9667, 48.9667, 8.5, 425, 4),
(6, 'Sentier du Ruisseau', -65.92, 48.995, 4.2, 120, 1),
(7, 'Mont Richardson', -66.05, 49.0333, 12.3, 580, 4),
(8, 'Boucle de la Serpentine', -65.91, 49.01, 6.8, 250, 3),
(9, 'Lac Paul', -65.85, 49.05, 11.5, 380, 3),
(10, 'Sentier du Pic du Brûlé', -66.0833, 48.95, 7.9, 445, 4),
(11, 'Mont Olivine', -65.8167, 49.0833, 14.6, 650, 5),
(12, 'Sentier des Caribous', -65.98, 48.975, 5.3, 180, 2),
(13, 'Mont Blanche-Lamontagne', -66.1167, 49.0167, 13.2, 615, 4),
(14, 'Vallée de la Rivière Sainte-Anne', -65.89, 49.02, 8.7, 210, 2),
(15, 'Mont Hog\'s Back', -65.7833, 49.1, 16.8, 720, 5),
(16, 'Mont Vallières de Saint-Réal', -66.3167, 48.8333, 12.4, 685, 5);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `rando`
--
ALTER TABLE `rando`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `rando`
--
ALTER TABLE `rando`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
