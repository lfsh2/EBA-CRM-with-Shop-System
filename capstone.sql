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
	('paulo.png', 'John Paulo Ramos', 'EBA', 'johnpaulo.ramos@cvsu.edu.ph', '$2b$10$2ga4BJrCwugur6B8Yz/GPu1NuN3WfQ5A9M5eO1oHwPTM1n6zSNI/m')
;

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
	('STUDENT_UNIFORM/Male_Student_Uniform.png', 'Student Uniform', 'Student Uniform', 'Male', 'Medium', 20, 300),
	('STUDENT_UNIFORM/Male_Student_Uniform.png', 'Student Uniform', 'Student Uniform', 'Male', 'Large', 20, 300),
	('STUDENT_UNIFORM/Male_Student_Uniform.png', 'Student Uniform', 'Student Uniform', 'Male', 'Small', 5, 300),
	('STUDENT_UNIFORM/Male_Student_Uniform.png', 'Student Uniform', 'Student Uniform', 'Male', 'Xtra Large', 20, 300),
	('STUDENT_UNIFORM/Female_Student_Uniform.png', 'Student Uniform', 'Student Uniform', 'Female', 'Small', 3, 300),
	('STUDENT_UNIFORM/Female_Student_Uniform.png', 'Student Uniform', 'Student Uniform', 'Female', 'Medium', 15, 300),
	('STUDENT_UNIFORM/Female_Student_Uniform.png', 'Student Uniform', 'Student Uniform', 'Female', 'Large', 10, 300),
	('STUDENT_UNIFORM/Female_Student_Uniform.png', 'Student Uniform', 'Student Uniform', 'Female', 'Xtra Large', 3, 300),
	('FACULTY_UNIFORM/Faculty_Uniform.png', 'Faculty Uniform', 'Faculty Uniform', 'Male', 'Small', 3, 300),
	('FACULTY_UNIFORM/Faculty_Uniform.png', 'Faculty Uniform', 'Faculty Uniform', 'Male', 'Medium', 5, 300),
	('FACULTY_UNIFORM/Faculty_Uniform.png', 'Faculty Uniform', 'Faculty Uniform', 'Male', 'Large', 5, 300),
	('FACULTY_UNIFORM/Faculty_Uniform.png', 'Faculty Uniform', 'Faculty Uniform', 'Male', 'Xtra Large', 1, 300),
	('FACULTY_UNIFORM/Faculty_Uniform.png', 'Faculty Uniform', 'Faculty Uniform', 'Female', 'Small', 5, 300),
	('FACULTY_UNIFORM/Faculty_Uniform.png', 'Faculty Uniform', 'Faculty Uniform', 'Female', 'Medium', 15, 300),
	('FACULTY_UNIFORM/Faculty_Uniform.png', 'Faculty Uniform', 'Faculty Uniform', 'Female', 'Large', 15, 300),
	('FACULTY_UNIFORM/Faculty_Uniform.png', 'Faculty Uniform', 'Faculty Uniform', 'Female', 'Xtra Large', 8, 300),
	('DEPARTMENT_SHIRT/Department_Shirt_BSIT.png', 'Department Shirt', 'BEED', 'Female', 'Small', 15, 300),
	('DEPARTMENT_SHIRT/Department_Shirt_BSIT.png', 'Department Shirt', 'BSIT', 'Male', 'Medium', 5, 300),
	('DEPARTMENT_SHIRT/Department_Shirt_BSIT.png', 'Department Shirt', 'BSHM', 'Male', 'Medium', 4, 300),
	('DEPARTMENT_SHIRT/Department_Shirt_BSIT.png', 'Department Shirt', 'BSTM', 'Female', 'Large', 6, 300),
	('DEPARTMENT_SHIRT/Department_Shirt_BSIT.png', 'Department Shirt', 'BSBM', 'Female', 'Medium', 20, 300),
	('DEPARTMENT_SHIRT/Department_Shirt_BSIT.png', 'Department Shirt', 'BSEE', 'Male', 'Large', 5, 300),
	('MODULE/Module.png', 'Module', 'Math', '', '', 20, 300),
	('MODULE/Module.png', 'Module', 'History', '', '', 10, 300),
	('MODULE/Module.png', 'Module', 'English', '', '', 10, 300),
	('CAPSTONE_MANUAL/Capstone_Manual.png', 'Capstone Manual', 'Capstone Manual', '', '', 10, 300)
;