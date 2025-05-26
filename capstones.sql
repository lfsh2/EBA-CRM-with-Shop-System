-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 10, 2025 at 07:59 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `capstone`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_account`
--

CREATE TABLE `admin_account` (
  `ID` int(11) NOT NULL,
  `Image` varchar(255) NOT NULL,
  `Username` varchar(255) NOT NULL,
  `Role` varchar(255) NOT NULL,
  `Email_Address` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_account`
--

INSERT INTO `admin_account` (`ID`, `Image`, `Username`, `Role`, `Email_Address`, `Password`) VALUES
(1, 'logo.png', 'admin', 'Admin', 'admin@cvsu.edu.ph', '$2b$10$UgMbjFKc9X3Pm5SZhcHLyOON2qlw5PSp96WEh86BOdWilVHwo1OP.'),
(2, 'paulo.png', 'John Paulo Ramos', 'EBA', 'johnpaulo.ramos@cvsu.edu.ph', '$2b$10$2ga4BJrCwugur6B8Yz/GPu1NuN3WfQ5A9M5eO1oHwPTM1n6zSNI/m');

-- --------------------------------------------------------

--
-- Table structure for table `bulletin`
--

CREATE TABLE `bulletin` (
  `ID` int(11) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Details` varchar(255) NOT NULL,
  `Faculty` varchar(5) NOT NULL,
  `Faculty_Staff` varchar(100) NOT NULL,
  `announcementDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bulletin`
--

INSERT INTO `bulletin` (`ID`, `Title`, `Details`, `Faculty`, `Faculty_Staff`, `announcementDate`) VALUES
(4, 'Holidayu', 'Walng pasok basa panty ni oaulo ramos', 'Mx.', 'John Paula Nisperos', '2025-05-15 05:45:00'),
(5, 'Wlanag pask', 'tes6', 'Mr.', 'Paulo Wendil', '2025-05-11 05:57:44');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `Category_ID` int(11) NOT NULL,
  `Categories` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`Category_ID`, `Categories`) VALUES
(1, 'Student Uniform'),
(2, 'Faculty Uniform'),
(3, 'Department Shirt'),
(4, 'Organizational Shirt'),
(5, 'Module'),
(6, 'Capstone Manual');

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `ID` int(11) NOT NULL,
  `Image` varchar(255) NOT NULL,
  `Category` varchar(255) NOT NULL,
  `Item_Name` varchar(255) NOT NULL,
  `Variant` varchar(255) NOT NULL,
  `Size` varchar(255) NOT NULL,
  `Quantity` int(11) NOT NULL,
  `Price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`ID`, `Image`, `Category`, `Item_Name`, `Variant`, `Size`, `Quantity`, `Price`) VALUES
(1, 'Male_Uniform.png', 'Student Uniform', 'Student Uniform', 'Male', 'Medium', 20, 300),
(2, 'Male_Uniform.png', 'Student Uniform', 'Student Uniform', 'Male', 'Large', 20, 300),
(3, 'Male_Uniform.png', 'Student Uniform', 'Student Uniform', 'Male', 'Small', 5, 300),
(4, 'Male_Uniform.png', 'Student Uniform', 'Student Uniform', 'Male', 'Xtra Large', 20, 300),
(5, 'Female_Uniform.png', 'Student Uniform', 'Student Uniform', 'Female', 'Small', 3, 300),
(6, 'Female_Uniform.png', 'Student Uniform', 'Student Uniform', 'Female', 'Medium', 15, 300),
(7, 'Female_Uniform.png', 'Student Uniform', 'Student Uniform', 'Female', 'Large', 10, 300),
(8, 'Female_Uniform.png', 'Student Uniform', 'Student Uniform', 'Female', 'Xtra Large', 3, 300),
(9, 'DIT.png', 'Department Shirt', 'Department of Technology', 'Original', 'Small', 15, 300),
(10, 'DIT.png', 'Department Shirt', 'Department of Technology', 'Original', 'Medium', 5, 300),
(11, 'BSBA-MM.png', 'Department Shirt', 'Department of Management', 'Original', 'Medium', 4, 300),
(12, 'BSBA-MM.png', 'Department Shirt', 'Department of Management', 'Original', 'Large', 6, 300),
(13, 'Anglicist_Guild-White.png', 'Organizational Shirt', 'Anglicist Guild', 'White', 'Small', 6, 300),
(14, 'Anglicist_Guild-Blue.png', 'Organizational Shirt', 'Anglicist Guild', 'Blue', 'Large', 3, 300),
(15, 'ATLAS.png', 'Organizational Shirt', 'Alliance of Talented Leaders and Atheletic Students', 'Original', 'Medium', 10, 300),
(16, 'ATLAS.png', 'Organizational Shirt', 'Alliance of Talented Leaders and Atheletic Students', 'Original', 'Large', 6, 300),
(17, 'TIC-Black.png', 'Organizational Shirt', 'Torch Interfaith Club', 'Black', 'Small', 6, 300),
(18, 'TIC-White.png', 'Organizational Shirt', 'Torch Interfaith Club', 'White', 'Xtra Large', 5, 300),
(19, 'TIC.png', 'Organizational Shirt', 'Torch Interfaith Club', 'Original', 'Large', 5, 300),
(20, 'TTOPS.png', 'Organizational Shirt', 'Talentados Tanza of Phenomenal Students', 'Original', 'Small', 10, 300),
(21, 'Module.png', 'Module', 'Math', '', '', 20, 300),
(22, 'Module.png', 'Module', 'History', '', '', 10, 300),
(23, 'Module.png', 'Module', 'English', '', '', 10, 300),
(24, 'Capstone_Manual.png', 'Capstone Manual', 'Capstone Manual', '', '', 10, 300);

-- --------------------------------------------------------

--
-- Table structure for table `item_cart`
--

CREATE TABLE `item_cart` (
  `ID` int(11) NOT NULL,
  `User_ID` int(11) DEFAULT NULL,
  `Image` varchar(255) NOT NULL,
  `Item_Name` varchar(255) NOT NULL,
  `Variant` varchar(255) NOT NULL,
  `Size` varchar(255) NOT NULL,
  `Quantity` int(11) NOT NULL,
  `Amount` int(11) NOT NULL,
  `Phone_Number` int(11) NOT NULL,
  `Date` date NOT NULL DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transaction`
--

CREATE TABLE `transaction` (
  `ID` int(11) NOT NULL,
  `Image` varchar(255) NOT NULL,
  `Item_Name` varchar(255) NOT NULL,
  `Variant` varchar(255) NOT NULL,
  `Size` varchar(255) NOT NULL,
  `Quantity` int(11) NOT NULL,
  `Amount` int(11) NOT NULL,
  `Customer_Name` varchar(255) NOT NULL,
  `Email_Address` varchar(255) NOT NULL,
  `Phone_Number` int(11) NOT NULL,
  `Date` date NOT NULL DEFAULT curdate(),
  `Status` varchar(255) DEFAULT NULL,
  `created_At` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaction`
--

INSERT INTO `transaction` (`ID`, `Image`, `Item_Name`, `Variant`, `Size`, `Quantity`, `Amount`, `Customer_Name`, `Email_Address`, `Phone_Number`, `Date`, `Status`, `created_At`) VALUES
(1, '/ITEMS/STUDENT_UNIFORM/Female_Student_Uniform.png', 'Student Uniform', 'Female', 'M', 2, 600, 'user', 'user@cvsu.edu.ph', 2147483647, '2025-05-10', 'Pending', '2025-05-10 04:53:17'),
(2, '/ITEMS/MODULE/Module.png', 'Modules', '', '', 5, 1500, 'user', 'user@cvsu.edu.ph', 2147483647, '2025-05-10', 'Pending', '2025-05-10 04:53:17');

-- --------------------------------------------------------

--
-- Table structure for table `user_account`
--

CREATE TABLE `user_account` (
  `ID` int(11) NOT NULL,
  `Full_Name` varchar(255) NOT NULL,
  `Email_Address` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_account`
--

INSERT INTO `user_account` (`ID`, `Full_Name`, `Email_Address`, `Password`) VALUES
(1, 'user', 'user@cvsu.edu.ph', '$2b$10$oD3/4NfcwFtUwipIy3nN1OtZmHCWZG0sBEzw2OiGPdVXhO7KM81Zq'),
(2, 'admin', 'marcandrei.nisperos@cvsu.edu.ph', '$2b$10$UgMbjFKc9X3Pm5SZhcHLyOON2qlw5PSp96WEh86BOdWilVHwo1OP.');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_account`
--
ALTER TABLE `admin_account`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `bulletin`
--
ALTER TABLE `bulletin`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`Category_ID`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `item_cart`
--
ALTER TABLE `item_cart`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `User_ID` (`User_ID`);

--
-- Indexes for table `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `user_account`
--
ALTER TABLE `user_account`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_account`
--
ALTER TABLE `admin_account`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `bulletin`
--
ALTER TABLE `bulletin`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `Category_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `item_cart`
--
ALTER TABLE `item_cart`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_account`
--
ALTER TABLE `user_account`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `item_cart`
--
ALTER TABLE `item_cart`
  ADD CONSTRAINT `item_cart_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `user_account` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
