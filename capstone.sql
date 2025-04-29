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
	Faculty_Staff VARCHAR(100) NOT NULL
);

-- TABLE FOR CART PAGE
CREATE TABLE item_cart (
	ID INT AUTO_INCREMENT PRIMARY KEY,
	User_ID INT,
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

CREATE TABLE categories (
	Category_ID INT AUTO_INCREMENT PRIMARY KEY,
	Categories VARCHAR(255) NOT NULL
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


-- USER AND ADMIN ACCOUNTS
INSERT INTO user_account (Full_Name, Email_Address, Password) 
VALUES 
	('user', 'user@cvsu.edu.ph', '$2b$10$oD3/4NfcwFtUwipIy3nN1OtZmHCWZG0sBEzw2OiGPdVXhO7KM81Zq'),
	('admin', 'marcandrei.nisperos@cvsu.edu.ph', '$2b$10$UgMbjFKc9X3Pm5SZhcHLyOON2qlw5PSp96WEh86BOdWilVHwo1OP.')
;
INSERT INTO admin_account (Image, Username, Role, Email_Address, Password) 
VALUES 
	('logo.png', 'admin', 'Admin', 'admin@cvsu.edu.ph', '$2b$10$UgMbjFKc9X3Pm5SZhcHLyOON2qlw5PSp96WEh86BOdWilVHwo1OP.'),
	('admin_1742923666280.png', 'John Paulo Ramos', 'EBA', 'johnpaulo.ramos@cvsu.edu.ph', '$2b$10$2ga4BJrCwugur6B8Yz/GPu1NuN3WfQ5A9M5eO1oHwPTM1n6zSNI/m')
;

-- BULLETIN PAGE
INSERT INTO bulletin (Title, Details, Faculty, Faculty_Staff)
VALUES (
	'Sample Title', 'Sample Details', 'Ms.', 'Sample Faculty_Staff'
);

-- ADMIN PAGE
INSERT INTO categories (Categories) 
VALUES 
	('Student Uniform'),
	('Faculty Uniform'),
	('Department Shirt'),
	('Module'),
	('Capstone Manual')
;
INSERT INTO inventory (Image, Category, Item_Name, Variant, Size, Quantity, Price)
VALUES 
	('MaleUniform.png', 'Student Uniform', 'Student Uniform', 'Male', 'Small', 5, 300)
;