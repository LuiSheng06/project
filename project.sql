-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 27, 2025 at 09:48 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project`
--

-- --------------------------------------------------------

--
-- Table structure for table `employeedetails`
--

CREATE TABLE `employeedetails` (
  `EmployeedetailId` int(11) NOT NULL,
  `Employeeid` int(11) NOT NULL,
  `First_name` varchar(100) NOT NULL,
  `Last_name` varchar(100) NOT NULL,
  `Gender` enum('Male','Female','Other') NOT NULL,
  `Phonenumber` varchar(14) NOT NULL,
  `Emailed` varchar(255) NOT NULL,
  `Department` varchar(100) NOT NULL,
  `Created_by` varchar(100) NOT NULL,
  `Created_date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employeedetails`
--

INSERT INTO `employeedetails` (`EmployeedetailId`, `Employeeid`, `First_name`, `Last_name`, `Gender`, `Phonenumber`, `Emailed`, `Department`, `Created_by`, `Created_date`) VALUES
(9, 8, 'binayak', 'Shrestha', 'Male', '9779800000111', 'binayak@example.com', 'IT', 'admin', '2025-10-16 12:52:17'),
(11, 8, 'harini', 'lal', 'Male', '9752143698', 'harini@example.com', 'account', 'binayak', '2025-10-16 14:33:51'),
(14, 8, 'binayak', 'lal', 'Male', '9779800000', 'harini@example.comm', 'IT', 'binayak', '2025-10-16 14:34:38'),
(15, 8, 'hari', 'lal', 'Other', '9779800000', 'harini@example.comn', 'IT', 'binayak', '2025-10-16 14:35:01'),
(17, 8, 'gita', 'Shrestha', 'Female', '977-984125879', 'gita@email.com', 'account', 'binayak', '2025-10-16 15:09:17'),
(18, 8, 'laxmi', 'gautam', 'Female', '977-985412365', 'lax@email.com', 'Finance', 'binayak', '2025-10-16 15:40:45');

-- --------------------------------------------------------

--
-- Table structure for table `employeelist`
--

CREATE TABLE `employeelist` (
  `Employeeid` int(10) NOT NULL,
  `Employeeemail` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Created_by` varchar(50) NOT NULL,
  `Created_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employeelist`
--

INSERT INTO `employeelist` (`Employeeid`, `Employeeemail`, `Password`, `Created_by`, `Created_date`) VALUES
(8, 'binayak@example.com', '$2a$12$PNFCvtI5w/YyKsPJCm99eeLExxwPGCZXyw7paddoa.fxuUB2D1fMC', 'admin', '2025-10-06 15:13:53'),
(14, 'admin@email.com', '$2a$12$4KE1odxumPAXZkx9k2/.NuT0pfdXQcgzRpR/fiODVKmuv3DDf/A9i', 'admin', '2025-10-06 15:13:53');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `employeedetails`
--
ALTER TABLE `employeedetails`
  ADD PRIMARY KEY (`EmployeedetailId`),
  ADD UNIQUE KEY `Emailed` (`Emailed`),
  ADD KEY `Employeeid` (`Employeeid`);

--
-- Indexes for table `employeelist`
--
ALTER TABLE `employeelist`
  ADD PRIMARY KEY (`Employeeid`),
  ADD UNIQUE KEY `UNIQUE` (`Employeeemail`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `employeedetails`
--
ALTER TABLE `employeedetails`
  MODIFY `EmployeedetailId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `employeelist`
--
ALTER TABLE `employeelist`
  MODIFY `Employeeid` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `employeedetails`
--
ALTER TABLE `employeedetails`
  ADD CONSTRAINT `employeedetails_ibfk_1` FOREIGN KEY (`Employeeid`) REFERENCES `employeelist` (`Employeeid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
