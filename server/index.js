const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const salt = 10;
const port = 3000;
const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "capstone",
});

// CHECK IF CONNECTED TO SERVER AND DATABASE
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
db.connect((err) => {
	if (err) throw err;
	console.log("Connected to MySQL Database");
});

// UPLOAD THE IMAGE TO THE PUBLICH FOLDER
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/UPLOADS')
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
	}
})
const upload = multer({
	storage: storage
})



// BULLETIN PAGE
// DISPLAY EVENT AND ANNOUNCEMENT
app.get("/bulletin", (req, res) => {
	db.query("SELECT * FROM bulletin", (err, results) => {
		if (err) return res.status(500).send(err);
		res.json(results);
	});
});


// EBA STORE
// CHECK AND LOGIN THE USER TO ACCESS EBA STORE
app.post('/userlogin', (req, res) => {
	const { email, password } = req.body;

	db.query('SELECT * FROM user_account WHERE Email_Address = ?', [email], (err, result) => {
		if (err) throw err;
		if (result.length === 0) return res.status(404).json({ message: "Email address doesn't exist" });

		const user = result[0];
		
		bcrypt.compare(password, user.Password, (err, isMatch) => {
			if (err) throw err;
			if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });
	  
			const token = jwt.sign({ id: user.ID, fullname: user.Full_Name, email: user.Email_Address }, 'secret_key', { expiresIn: '1h' });
			res.json({ token });
		})
	})
})
  

// EBA CART PAGE
function verifyToken(req, res, next) {
	const token = req.headers['authorization'];
  
	if (!token) return res.status(403).json({ message: 'Token required' });
  
	jwt.verify(token, 'secret_key', (err, decoded) => {
		if (err) return res.status(403).json({ message: 'Invalid or expired token' });
		req.userId = decoded.id; // Store user ID in the request
		next();
	});
}
// FETCH ALL DATA IN CART AND DISPLAY TO CART PAGE
app.get("/cartItem", verifyToken, (req, res) => {
	const userId = req.userId;

	db.query("SELECT * FROM item_cart WHERE User_ID = ?", [userId], (err, result) => {
		if (err) throw err;
		if (result.length === 0) return res.status(404).json({ message: 'No items in cart' });
		res.json({ cartItems: result.length ? result : [] });
	});
});


// EBA STORE PAGE
// NOTICED THE CUSTOMER THROUGH EMAIL AFTER THE ORDER HAS BEEN CONFIRMED
const sendEmail = (ItemName, Variant, CustomerName, EmailAddress, Amount, ID, formattedDate) => {
	function order() {
		const currentYear = new Date().getFullYear();
		const orderID = `${currentYear}0${ID}`;

		return orderID;
	}

	const transporter = nodemailer.createTransport({
		service: 'gmail', 
		auth: {
			user: 'cvsutanzaeba@gmail.com', 
			pass: 'thai euuc ller olga',
		},
	});

	const orderNumber = order();
	const variantDisplay = Variant ? (Variant.trim() ? Variant : "") : "";
	const mailOptions = {
		from: 'cvsutanzaeba@gmail.com',
		to: EmailAddress,
		subject: 'Order Details',
		html: `
			<header style='height: 150px; background: #c1ff72; display: flex; flex-direction: column; gap: 10px;'>
				<img src="http://localhost:3000/capstone/public/logo.png" style='width: 80px; height: 80px;'/>
				<h2>External Business and<br>Affairs</h2>
			</header>

			<br>

			<h3>Thank you for your order!</h3>
			<p>${CustomerName}</p>
			<p>Your order was received! We're working to get order processed and be ready to claim.</p>

			<br>

			<div style='display: flex; align-items: center;'>
				<div>
					<p style='margin-right: 30px;'>Order Number:</p>
					<span>#${orderNumber}<span>
				</div>
				<div>
					<p>Order Date:</p>
					<span>${formattedDate}</span>
				</div>
			</div>

			<br>
			
			<table style="border: 1px solid gray; border-collapse: collapse; width: 100%; text-align: left;">
				<tr>
					<th style="border: 1px solid gray; padding: 8px; text-align: center;">PRODUCT</th>
					<th style="border: 1px solid gray; padding: 8px; text-align: center;">PRICE</th>
				</tr>
				<tr>
					<td style="border: 1px solid gray; padding: 8px; text-align: center;">${ItemName} ${variantDisplay ? `- ${variantDisplay}` : ''}</td>
					<td style="border: 1px solid gray; padding: 8px; text-align: center;">${Amount}</td>
				</tr>
				<tr>
					<td style="border: 1px solid gray; padding: 8px; text-align: center;"></td>
					<td style="border: 1px solid gray; padding: 8px; text-align: center;">Total: P${Amount}</td>
				</tr>
			</table>

			<p>Thank you for your purchase!</p>
			<p>Cavite State University - Tanza Campus</p>
		`
	};

	return new Promise((resolve, reject) => {
		transporter.sendMail(mailOptions, (err, info) => {
			if (err) {
				console.error('Error sending email:', err);
				reject(err);
			}  	else {
				console.log('Email sent: ' + info.response);
				resolve(info);
			}
		});
	});
};
// ADD CUSTOMER'S ORDER TO THE CART
app.post("/addOrderUniform", upload.single('transaction'), (req, res) => {
	const { transaction, ItemName, Variant, Size, Quantity, Amount, PhoneNumber } = req.body;

	try {
		const insertQuery = "INSERT INTO item_cart (Image, Item_Name, Variant, Size, Quantity, Amount, Phone_Number) VALUES (?, ?, ?, ?, ?, ?, ?)";

		db.query(insertQuery, [transaction, ItemName, Variant, Size, Quantity, Amount, PhoneNumber], (err, result) => {
			if (err) {
				console.error("Error inserting data:", err);
				return res.status(500).json({ Message: "Error inserting data" });
			}
			
			return res.json({ Status: "Success" });
		});
	} catch (error) {
		console.error('Error processing form data:', error);
		res.status(500).send('Internal server error');
	}
});
app.post("/addOrderItem", upload.single('transaction'), (req, res) => {
	const { transaction, ItemName, Quantity, Amount, PhoneNumber } = req.body;

	try {
		const insertQuery = "INSERT INTO item_cart (Image, Item_Name, Quantity, Amount, Phone_Number) VALUES (?, ?, ?, ?, ?)";

		db.query(insertQuery, [transaction, ItemName, Quantity, Amount, PhoneNumber], async (err, result) => {
			if (err) {
				console.error("Error inserting data:", err);
				return res.status(500).json({ Message: "Error inserting data" });
			}
			return res.json({ Status: "Success" });
		});
	} catch (error) {
		console.error('Error processing form data:', error);
		res.status(500).send('Internal server error');
	}
});
app.post('/checkout', (err, res) => {
	db.beginTransaction((err) => {
		const combineQuery = `
			SELECT
				ic.Image,
				ic.Item_Name,
				ic.Variant,
				ic.Size,
				ic.Quantity,
				ic.Amount,
				ic.Phone_Number,
				ic.Date,
				ua.Full_Name,
				ua.Email_Address
			FROM 
				user_account ua
			LEFT JOIN
				item_cart ic
			ON
				ua.ID = ic.ID
			WHERE
				ua.ID = 1;
		`;
	
		db.query(combineQuery, (err, results) => {
			const Pending = 'Pending'

			if (err) console.log('error')
	
			const insertQuery = `INSERT INTO transaction (Image, Item_Name, Variant, Size, Quantity, Amount, Customer_Name, Email_Address, Phone_Number, Date, Status) VALUES ?`;
			const values = results.map(row => [
				row.Image, row.Item_Name, row.Variant, row.Size, row.Quantity, row.Amount, row.Full_Name, row.Email_Address, row.Phone_Number, row.Date, Pending
			])
	
			db.query(insertQuery, [values], async (err, insertResult) => {
				if (err) console.log(err)

				const orderID = insertResult.insertId;
				
				const currentDate = new Date();
				const year = currentDate.getFullYear().toString().slice(-2);
				const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
				const day = currentDate.getDate().toString().padStart(2, '0');
				const formattedDate = `${month}-${day}-${year}`;
	
				for (const row of results) {
					const {
						Item_Name,
						Variant,
						Full_Name,
						Email_Address,
						Amount
					} = row;
					
					try {
						await sendEmail(Item_Name, Variant, Full_Name, Email_Address, Amount, orderID, formattedDate);
						return res.json({ Status: "Success" });
					} catch (emailError) {
						console.error('Failed to send email:', emailError);
						res.status(500).send('Failed to send email.');
					}
				}
			})
		})
	})
})


// ADMINPANEL
// CHECK AND LOGIN THE ADMIN TO ACCESS ADMIN PANEL
app.post('/adminlogin', (req, res) => {
	const { email, password } = req.body;

	db.query('SELECT * FROM admin_account WHERE Email_Address = ?', [email], (err, result) => {
		if (err) throw err;
		if (result.length === 0) return res.status(404).json({ message: "Email address doesn't exist" });

		const user = result[0];
		
		bcrypt.compare(password, user.Password, (err, isMatch) => {
			if (err) throw err;
			if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });
	  
			const token = jwt.sign({ id: user.ID, role: user.Role, image: user.Image, username: user.Username }, 'secret_key', { expiresIn: '1h' });
			res.json({ token });
		})
	})
})


// DASHBOARD PAGE


// TRANSACTION PAGE
// FETCH AND DISPLAY THE DATA
app.get("/transaction", (req, res) => {
	db.query("SELECT * FROM transaction", (err, results) => {
		if (err) return res.status(500).send(err);
		res.json(results);
	});
});
// EDIT TRANSACTIOn
app.put("/transaction/:id", (req, res) => {
	const { id } = req.params;
	const { itemName, variant, size, quantity, name, email, phone, payment, amount } = req.body;

	db.query("UPDATE transaction SET Item_Name = ?, Variant = ?, Size = ?, Quantity = ?, Customer_Name = ?, Email_Address = ?, Phone_Number = ?, Payment_Method = ?, Amount = ? WHERE ID = ?",
		[itemName, variant, size, quantity, name, email, phone, payment, amount, id], (err, results) => {
			if (err) return res.status(500).send(err);
			res.json({ message: 'Transaction updated successfully.' });
		}
	);
});
// DELETE TRANSACTION
app.delete("/transaction/:id", (req, res) => {
	const { id } = req.params;
	db.query("DELETE FROM transaction WHERE ID = ?", [id], (err, result) => {
		if (err) return res.status(500).send(err);
		res.json({ message: 'Transaction deleted successfully.' });
	});
});


// EVENTS & ANNOUNCEMENT PAGE
// ADD EVENT/ANNOUNCEMENT
app.post("/announcement", (req, res) => {
	const { Title, Details, Faculty, FacultyName } = req.body;

	const insertQuery = "INSERT INTO bulletin (Title, Details, Faculty, Faculty_Staff) VALUES (?, ?, ?, ?)";
	db.query(insertQuery, [Title, Details, Faculty, FacultyName ], (err, result) => {
		if (err) {
			console.error("Error inserting data:", err);
			return res.status(500).json({ Message: "Error inserting data" });
		}

		return res.json({ Status: "Success" });
	});
});
// EDIT EVENT/ANNOUNCEMENT
app.put("/announcement/:id", (req, res) => {
	const { id } = req.params;
	const { title, details, faculty, facultyName } = req.body;

	db.query("UPDATE bulletin SET Title = ?, Details = ?, Faculty = ?, Faculty_Staff = ? WHERE ID = ?",
		[title, details, faculty, facultyName, id], (err, results) => {
			if (err) return res.status(500).send(err);
			res.json({ message: 'Announcement updated successfully.' });
		}
	);
});
// DELETE EVENT/ANNOUNCEMENT
app.delete("/announcement/:id", (req, res) => {
	const { id } = req.params;
	db.query("DELETE FROM bulletin WHERE ID = ?", [id], (err, result) => {
		if (err) return res.status(500).send(err);
		res.json({ message: 'Announcement deleted successfully.' });
	});
});


// INVENTORY PAGE
// FETCH AND DISPLAY THE DATA
app.get("/category", (req, res) => {
	db.query("SELECT * FROM categories", (err, results) => {
		if (err) return res.status(500).send(err);
		res.json(results);
	});
});
app.get("/inventory", (req, res) => {
	db.query("SELECT * FROM inventory", (err, results) => {
		if (err) return res.status(500).send(err);
		res.json(results);
	});
});
// ADD INVENTORY
app.post("/inventory", upload.single('inventory'), (req, res) => {
	const image = req.file.filename;
	const { Category, ItemName, Variant, Size, Quantity, Price } = req.body;
	const insertQuery = "INSERT INTO inventory (Image, Category, Item_Name, Variant, Size, Quantity, Price) VALUES ( ?, ?, ?, ?, ?, ?, ?)";

	db.query(insertQuery, [image, Category, ItemName, Variant, Size, Quantity, Price], (err, result) => {
		if (err) {
			console.error("Error inserting data:", err);
			return res.status(500).json({ Message: "Error inserting data" });
		}

		return res.json({ Status: "Success" });
	});
});
// EDIT INVENTORY
app.put("/inventory/:id", upload.single('inventory'), (req, res) => {
	const { id } = req.params;

	let image = null;
	if (req.file) {
		image = req.file.filename;
	}	
	const { category, itemName, variant, size, quantity, price } = req.body;

	if (image) {
		db.query("UPDATE inventory SET Image = ?, Category = ?, Item_Name = ?, Variant = ?, Size = ?, Quantity = ?, Price = ? WHERE ID = ?",
			[image, category, itemName, variant, size, quantity, price, id], (err, results) => {
				if (err) return res.status(500).send(err);
				res.json({ message: 'Inventory updated successfully.' });
			}
		);
	} else {
		db.query("UPDATE inventory SET Category = ?, Item_Name = ?, Variant = ?, Size = ?, Quantity = ?, Price = ? WHERE ID = ?",
			[category, itemName, variant, size, quantity, price, id], (err, results) => {
				if (err) return res.status(500).send(err);
				res.json({ message: 'Inventory updated successfully.' });
			}
		);
	}
});
// DELETE INVENTORY
app.delete("/inventory/:id", (req, res) => {
	const { id } = req.params;
	db.query("DELETE FROM inventory WHERE ID = ?", [id], (err, result) => {
		if (err) return res.status(500).send(err);
		res.json({ message: 'Inventory deleted successfully.' });
	});
});

// ADMIN ACCOUNT PAGE
// FETCH AND DISPLAY THE DATA
app.get("/admin", (req, res) => {
	db.query("SELECT * FROM admin_account", (err, results) => {
		if (err) return res.status(500).send(err);
		res.json(results);
	});
});
// ADD NEW ADMIN
app.post("/addnewadmin", upload.single('admin'), (req, res) => {
	const image = req.file.filename;
	const { Username, Role, Email, Password } = req.body;
	const checkQuery = "SELECT * FROM admin_account WHERE Username = ? OR Email_Address = ?";

	db.query(checkQuery, [Username, Email], (err, result) => {
		if (err) {
			console.error("Error checking existing users:", err);
			res.status(500).send("Server error");
			return;
		}

		if (result.length > 0) {
			return res.json({ Status: "Username or Email already exists" });
		}

		const insertQuery = "INSERT INTO admin_account (Image, Username, Role, Email_Address, Password) VALUES (?, ?, ?, ?, ?)";
		bcrypt.hash(Password.toString(), salt, (err, hash) => {
			if (err) return res.json("Error");

			db.query(insertQuery, [image, Username, Role, Email, hash], (err, result) => {
				if (err) {
					console.error("Error inserting data:", err);
					return res.status(500).json({ Message: "Error inserting data" });
				}
	
				return res.json({ Status: "Success" });
			});
		})
	});
});
// EDIT ADMIN
app.put("/addnewadmin/:id", upload.single('admin'), (req, res) => {
	const { id } = req.params;
	const { Username, Role, Email, Password } = req.body;

	let image = null;
	if (req.file) {
		image = req.file.filename;
	}

	db.query('SELECT * FROM admin_account WHERE ID = ?', [id], (err, result) => {
		const currentPassword = result[0].Password;

		if (currentPassword === Password) {
			if (image) {
				db.query("UPDATE admin_account SET Image = ?, Username = ?, Role = ?, Email_Address = ? WHERE ID = ?", [image, Username, Role, Email, id], (err, result) => {
					if (err) {
						console.error("Error inserting data:", err);
						return res.status(500).json({ Message: "Error inserting data" });
					}
		
					return res.json({ Status: "Success" });
				});
			} else {
				db.query("UPDATE admin_account SET Username = ?, Role = ?, Email_Address = ? WHERE ID = ?", [Username, Role, Email, id], (err, result) => {
					if (err) {
						console.error("Error inserting data:", err);
						return res.status(500).json({ Message: "Error inserting data" });
					}
		
					return res.json({ Status: "Success" });
				});
			}
		} else {
			bcrypt.hash(Password.toString(), salt, (err, hash) => {
				if (err) return res.json("Error");
		
				db.query("UPDATE admin_account SET Image = ?, Username = ?, Role = ?, Email_Address = ?, Password = ? WHERE ID = ?", [image, Username, Role, Email, hash, id], (err, result) => {
					if (err) {
						console.error("Error inserting data:", err);
						return res.status(500).json({ Message: "Error inserting data" });
					}
		
					return res.json({ Status: "Success" });
				});
			})
		}
	})
});
// DELETE ADMIN
app.delete("/addnewadmin/:id", (req, res) => {
	const { id } = req.params;
	
	db.query("DELETE FROM admin_account WHERE ID = ?", [id], (err, result) => {
		if (err) return res.status(500).send(err);
		res.json({ message: 'Admin deleted successfully.' });
	});
});