DROP DATABASE capstone;
CREATE DATABASE capstone;
USE capstone;

-- TABLE FOR USER AND ADMIN ACCOUNT
CREATE TABLE admin_account (
	ID INT AUTO_INCREMENT PRIMARY KEY,
	Image VARCHAR(255) NOT NULL,
	Username VARCHAR(255) NOT NULL,
	Role VARCHAR(255) NOT NULL,
	Email_Address VARCHAR(255) NOT NULL,
	Password VARCHAR(255) NOT NULL
);
CREATE TABLE user_account (
	ID INT AUTO_INCREMENT PRIMARY KEY,
	Full_Name VARCHAR(255) NOT NULL,
	Email_Address VARCHAR(255) NOT NULL,
	Password VARCHAR(255) NOT NULL
);

-- TABLE FOR BULLETIN PAGE
CREATE TABLE bulletin (
	ID INT AUTO_INCREMENT PRIMARY KEY,
	Title VARCHAR(255) NOT NULL,
	Details VARCHAR(255) NOT NULL,
	Faculty VARCHAR(5) NOT NULL,
	Faculty_Staff VARCHAR(100) NOT NULL,
  	announcementDate datetime DEFAULT NULL
);

-- TABLE FOR EBA STORE
CREATE TABLE exclusive (
	ID INT AUTO_INCREMENT PRIMARY KEY,
	Category VARCHAR(255) NOT NULL,
	Image VARCHAR(255) NOT NULL,
	Item_Name VARCHAR(255) NOT NULL
);
CREATE TABLE categories (
	ID INT AUTO_INCREMENT PRIMARY KEY,
	Category VARCHAR(255) NOT NULL,
	Image VARCHAR(255) NOT NULL,
	Item_Name VARCHAR(255) NOT NULL
);
CREATE TABLE store (
	ID INT AUTO_INCREMENT PRIMARY KEY,
	Category VARCHAR(255) NOT NULL,
	Image VARCHAR(255) NOT NULL,
	Item_Name VARCHAR(255) NOT NULL,
	Price INT(255)  NOT NULL
);
CREATE TABLE store_variant (
	ID INT AUTO_INCREMENT PRIMARY KEY,
	Store_ID INT(255) NOT NULL,
	Image VARCHAR(255) NOT NULL,
	Variant VARCHAR(255) NOT NULL
);


-- TABLE FOR CART PAGE
CREATE TABLE item_cart (
	ID INT AUTO_INCREMENT PRIMARY KEY,
	User_ID INT,
	Category VARCHAR(255) NOT NULL,
	Image VARCHAR(255) NOT NULL,
	Item_Name VARCHAR(255) NOT NULL,
	Variant VARCHAR(255) NOT NULL,
	Size VARCHAR(255) NOT NULL,
	Quantity INT NOT NULL,
	Amount INT NOT NULL,
	Phone_Number INT NOT NULL,
	Date DATE DEFAULT CURRENT_DATE NOT NULL,
	FOREIGN KEY (User_ID) REFERENCES user_account(ID)
);


-- TABLE FOR EBA STORE
CREATE TABLE transaction (
	ID INT AUTO_INCREMENT PRIMARY KEY,
	Image VARCHAR(255) NOT NULL,
	Item_Name VARCHAR(255) NOT NULL,
	Variant VARCHAR(255) NOT NULL,
	Size VARCHAR(255) NOT NULL,
	Quantity INT NOT NULL,
	Amount INT NOT NULL,
	Customer_Name VARCHAR(255) NOT NULL,
	Email_Address VARCHAR(255) NOT NULL,
	Phone_Number INT NOT NULL,
	Date DATE DEFAULT CURRENT_DATE NOT NULL,
	Status VARCHAR(255),
	created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventory (
	ID INT AUTO_INCREMENT PRIMARY KEY,
	Image VARCHAR(255) NOT NULL,
	Category VARCHAR(255) NOT NULL,
	Item_Name VARCHAR(255) NOT NULL,
	Variant VARCHAR(255) NOT NULL,
	Size VARCHAR(255) NOT NULL,
	Quantity INT NOT NULL,
	Price INT NOT NULL
);	


-- BULLETIN PAGE
INSERT INTO bulletin (Title, Details, Faculty, Faculty_Staff)
VALUES
	('Class Suspension', 'Holiday', 'Ms.', 'DEAN')
;

-- USER AND ADMIN ACCOUNTS
INSERT INTO user_account (Full_Name, Email_Address, Password) 
VALUES 
	('user', 'user@cvsu.edu.ph', '$2b$10$oD3/4NfcwFtUwipIy3nN1OtZmHCWZG0sBEzw2OiGPdVXhO7KM81Zq'),
	('admin', 'marcandrei.nisperos@cvsu.edu.ph', '$2b$10$UgMbjFKc9X3Pm5SZhcHLyOON2qlw5PSp96WEh86BOdWilVHwo1OP.')
;
INSERT INTO admin_account (Image, Username, Role, Email_Address, Password) 
VALUES 
	('logo.png', 'admin', 'Admin', 'admin@cvsu.edu.ph', '$2b$10$UgMbjFKc9X3Pm5SZhcHLyOON2qlw5PSp96WEh86BOdWilVHwo1OP.'),
	('paulo.png', 'John Paulo Ramos', 'EBA', 'johnpaulo.ramos@cvsu.edu.ph', '$2b$10$2ga4BJrCwugur6B8Yz/GPu1NuN3WfQ5A9M5eO1oHwPTM1n6zSNI/m')
;

-- EBA STORE
INSERT INTO exclusive (Category, Image, Item_Name)
VALUES
  ('Student Uniform', 'Student_Uniform-Male.png', 'Student Uniform'),
  ('Department Shirt', 'DIT.png', 'Department of Information Technology'),
  ('Organizational Shirt', 'Anglicist_Guild-White.png', 'Anglicist Guild'),
  ('Capstone Manual', 'Capstone_Manual.png', 'Capstone Manual'),
  ('Module', 'Module.png', 'Mathematics Module')
;
INSERT INTO categories (Category, Image, Item_Name)
VALUES
  ('Student Uniform', 'Student_Uniform-Male.png', 'Student Uniform'),
  ('Department Shirt', 'DIT.png', 'Department of Information Technology'),
  ('Organizational Shirt', 'Anglicist_Guild-White.png', 'Anglicist Guild'),
  ('Capstone Manual', 'Capstone_Manual.png', 'Capstone Manual'),
  ('Module', 'Module.png', 'Mathematics Module')
;
INSERT INTO `store` (`Image`, `Category`, `Item_Name`, `Price`) 
VALUES
  ('Student_Uniform-Male.png', 'Student Uniform', 'Student Uniform', 300),
  ('DIT.png', 'Department Shirt', 'Department of Information Technology', 300),
  ('BSBA-MM.png', 'Department Shirt', 'Department of Management', 300),
  ('Anglicist_Guild-White.png', 'Organizational Shirt', 'Anglicist Guild', 300),
  ('ATLAS.png', 'Organizational Shirt', 'Alliance of Talented Leaders and Atheletic Students', 300),
  ('TIC-White.png', 'Organizational Shirt', 'Torch Interfaith Club', 300),
  ('Oracle.png', 'Organizational Shirt', 'The Oracle Publications', 300),
  ('ABEES.png', 'Organizational Shirt', 'Alliance of Bachelor of Elementary Education Students', 300),
  ('TTOPS.png', 'Organizational Shirt', 'Talentados Tanza of Phenomenal Students', 300),
  ('Module.png', 'Module', 'Mathematics Module', 300),
  ('Capstone_Manual.png', 'Capstone Manual', 'Capstone Manual', 300)
;
INSERT INTO store_variant (Store_ID, Image, Variant)
VALUES
  (1, 'Student_Uniform-Male.png', 'Male'),
  (1, 'Student_Uniform-Female.png', 'Female'),
  (2, 'DIT.png', 'White'),
  (3, 'BSBA-MM.png', 'Orange'),
  (4, 'Anglicist_Guild-White.png', 'White'),
  (4, 'Anglicist_Guild-Blue	.png', 'Blue'),
  (5, 'ATLAS.png', 'White'),
  (6, 'TIC-White.png', 'White'),
  (6, 'TIC-Black.png', 'Black'),
  (7, 'Oracle.png', 'Green'),
  (8, 'ABEES.png', 'Blue'),
  (9, 'TTOPS.png', 'Black')
;

-- ADMIN PAGE
INSERT INTO inventory (Image, Category, Item_Name, Variant, Size, Quantity, Price)
VALUES 
	('Student_Uniform-Male.png', 'Student Uniform', 'Student Uniform', 'Male', 'Medium', 20, 300),
	('Student_Uniform-Male.png', 'Student Uniform', 'Student Uniform', 'Male', 'Large', 20, 300),
	('Student_Uniform-Male.png', 'Student Uniform', 'Student Uniform', 'Male', 'Small', 5, 300),
	('Student_Uniform-Male.png', 'Student Uniform', 'Student Uniform', 'Male', 'Xtra Large', 20, 300),
	('Student_Uniform-Female.png', 'Student Uniform', 'Student Uniform', 'Female', 'Small', 3, 300),
	('Student_Uniform-Female.png', 'Student Uniform', 'Student Uniform', 'Female', 'Medium', 15, 300),
	('Student_Uniform-Female.png', 'Student Uniform', 'Student Uniform', 'Female', 'Large', 10, 300),
	('Student_Uniform-Female.png', 'Student Uniform', 'Student Uniform', 'Female', 'Xtra Large', 3, 300),
	('DIT.png', 'Department Shirt', 'Department of Technology', 'Original', 'Small', 15, 300),
	('DIT.png', 'Department Shirt', 'Department of Technology', 'Original', 'Medium', 5, 300),
	('BSBA-MM.png', 'Department Shirt', 'Department of Management', 'Original', 'Medium', 4, 300),
	('BSBA-MM.png', 'Department Shirt', 'Department of Management', 'Original', 'Large', 6, 300),
	('Anglicist_Guild-White.png', 'Organizational Shirt', 'Anglicist Guild', 'White', 'Small', 6, 300),
	('Anglicist_Guild-Blue.png', 'Organizational Shirt', 'Anglicist Guild', 'Blue', 'Large', 3, 300),
	('ATLAS.png', 'Organizational Shirt', 'Alliance of Talented Leaders and Atheletic Students', 'Original', 'Medium', 10, 300),
	('ATLAS.png', 'Organizational Shirt', 'Alliance of Talented Leaders and Atheletic Students', 'Original', 'Large', 6, 300),
	('TIC-Black.png', 'Organizational Shirt', 'Torch Interfaith Club', 'Black', 'Small', 6, 300),
	('TIC-White.png', 'Organizational Shirt', 'Torch Interfaith Club', 'White', 'Xtra Large', 5, 300),
	('TTOPS.png', 'Organizational Shirt', 'Talentados Tanza of Phenomenal Students', 'Original', 'Small', 10, 300),
	('Module.png', 'Module', 'Math', '', '', 20, 300),
	('Module.png', 'Module', 'History', '', '', 10, 300),
	('Module.png', 'Module', 'English', '', '', 10, 300),
	('Capstone_Manual.png', 'Capstone Manual', 'Capstone Manual', '', '', 10, 300)
;
INSERT INTO transaction (Image, Item_Name, Variant, Size, Quantity, Amount, Customer_Name, Email_Address, Phone_Number, Date, Status, created_At)
VALUES 
	('Student_Uniform-Male.png', 'Student Uniform', 'Male', 'Medium', 20, 300, 'Paulo', 'paulo@paulo.com', 1, NOW(), 'Pending', NOW())
;