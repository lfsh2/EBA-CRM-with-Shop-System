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


app.get("/api/sales-data", (req, res) => {
	const query = `
		SELECT 
			DATE_FORMAT(Date, '%M') AS month, 
			Item_Name as category, 
			SUM(Amount) AS total_sales 
		FROM transaction 
		GROUP BY month, Item_Name 
		ORDER BY MONTH(Date);
	`;
  
	db.query(query, (err, results) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}
	
		const formattedData = {
			labels: [...new Set(results.map((row) => row.month))], 
			datasets: [],
		};
	
		const categories = [...new Set(results.map((row) => row.category))];
	
		categories.forEach((category) => {
			formattedData.datasets.push({
			label: category,
			data: results
				.filter((row) => row.category === category)
				.map((row) => row.total_sales),
			});
		});
	
		res.json(formattedData);
	});
});
  
app.get("/api/orders-data", (req, res) => {
	const query = `
		SELECT 
			DATE_FORMAT(Date, '%M') AS month, 
			Item_Name as category, 
			COUNT(*) AS total_orders 
		FROM transaction 
		GROUP BY month, Item_Name 
		ORDER BY MONTH(Date);
	`;
	
	db.query(query, (err, results) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}
	
		const formattedData = {
			labels: [...new Set(results.map((row) => row.month))], 
			datasets: [],
		};
	
		const categories = [...new Set(results.map((row) => row.category))];
	
		categories.forEach((category) => {
			formattedData.datasets.push({
			label: category,
			data: results
			.filter((row) => row.category === category)
			.map((row) => row.total_orders),
			});
		});
	
		res.json(formattedData);
	});
});


app.get("/api/test/transaction", (req, res) => {
    db.query("DESCRIBE transaction", (err, result) => {
        if (err) {
            console.error("Error describing transaction table:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
});

app.get("/api/dashboard/total-sales", (req, res) => {
    const query = `
        SELECT COALESCE(SUM(Amount), 0) as total_sales 
        FROM transaction
        WHERE Status IS NULL OR Status != 'Cancelled'
    `;
    
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error in total sales query:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(result[0]);
    });
});

app.get("/api/dashboard/total-orders", (req, res) => {
    const query = `
        SELECT COUNT(*) as total_orders 
        FROM transaction
        WHERE Status IS NULL OR Status != 'Cancelled'
    `;
    
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error in total orders query:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(result[0]);
    });
});

app.get("/api/dashboard/low-stock", (req, res) => {
    const query = `
        SELECT COUNT(*) as low_stock 
        FROM inventory 
        WHERE Quantity < 10 AND Quantity > 0
    `;
    
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error in low stock query:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(result[0]);
    });
});

app.get("/api/dashboard/available-stocks", (req, res) => {
    const query = `
        SELECT COALESCE(SUM(Quantity), 0) as total_stocks 
        FROM inventory
        WHERE Quantity > 0
    `;
    
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error in available stocks query:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(result[0]);
    });
});

app.get("/api/dashboard/new-orders", (req, res) => {
    const query = `
        SELECT COUNT(*) as new_orders 
        FROM transaction 
        WHERE Date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        AND (Status IS NULL OR Status != 'Cancelled')
    `;
    
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error in new orders query:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(result[0]);
    });
});

app.get("/api/dashboard/fast-moving-items", (req, res) => {
    const query = `
        SELECT 
            Item_Name,
            COUNT(*) as order_count
        FROM transaction
        WHERE Status IS NULL OR Status != 'Cancelled'
        GROUP BY Item_Name
        ORDER BY order_count DESC
        LIMIT 5
    `;
    
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error in fast moving items query:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
});

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
		if (err) return res.status(403).json({ message: 'Login expired, please login again' });
		req.userId = decoded.id;
		next();
	});
}
// FETCH ALL DATA IN CART AND DISPLAY TO CART PAGE
app.get("/cartItem", verifyToken, (req, res) => {
    const userId = req.userId;

    db.query("SELECT * FROM item_cart WHERE User_ID = ?", [userId], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ cartItems: result.length ? result : [] });
    });
});



// EBA STORE PAGE
// NOTICED THE CUSTOMER THROUGH EMAIL AFTER THE ORDER HAS BEEN CONFIRMED

// ADD CUSTOMER'S ORDER TO THE CART
app.post("/addOrderUniform", upload.single('transaction'), (req, res) => {
	const {
		UserID,
		transaction,
		ItemName,
		Variant = '',
		Size = '',
		Quantity,
		Amount,
		PhoneNumber
	} = req.body;

	try {
		let checkQuery = `
			SELECT * FROM item_cart 
			WHERE User_ID = ? AND Item_Name = ? AND Variant = ? AND Size = ?
		`;

		let checkParams = [UserID, ItemName, Variant, Size];

		db.query(checkQuery, checkParams, (err, results) => {
			if (err) {
				console.error("Error checking item:", err);
				return res.status(500).json({ Message: "Database error" });
			}

			if (results.length > 0) {
				let existingItem = results[0];
				let newQuantity = existingItem.Quantity + parseInt(Quantity);

				let updateQuery = `
					UPDATE item_cart 
					SET Quantity = ? 
					WHERE User_ID = ? AND Item_Name = ? AND Variant = ? AND Size = ?
				`;

				let updateParams = [newQuantity, UserID, ItemName, Variant, Size];

				db.query(updateQuery, updateParams, (err, result) => {
					if (err) {
						console.error("Error updating quantity:", err);
						return res.status(500).json({ Message: "Failed to update cart" });
					}

					return res.json({ Status: "Updated", UpdatedQuantity: newQuantity });
				});
			} else {
				let insertQuery = `
					INSERT INTO item_cart 
					(User_ID, Image, Item_Name, Variant, Size, Quantity, Amount, Phone_Number) 
					VALUES (?, ?, ?, ?, ?, ?, ?, ?)
				`;

				let values = [
					UserID,
					transaction,
					ItemName,
					Variant || '',
					Size || '',
					Quantity,
					Amount,
					PhoneNumber
				];

				db.query(insertQuery, values, (err, result) => {
					if (err) {
						console.error("Error inserting new item:", err);
						return res.status(500).json({ Message: "Error inserting data" });
					}

					return res.json({ Status: "Inserted" });
				});
			}
		});
	} catch (error) {
		console.error('Error processing form data:', error);
		res.status(500).send('Internal server error');
	}
});


app.delete("/cart/:id", (req, res) => {
	const { id } = req.params;
	
	db.query("DELETE FROM item_cart WHERE ID = ?", [id], (err, result) => {
		if (err) return res.status(500).send(err);
		res.json({ message: 'Cart deleted successfully.' });
	});
});
const transporter = nodemailer.createTransport({
	service: 'gmail', 
	auth: {
		user: 'cvsutanzaeba@gmail.com', 
		pass: 'thai euuc ller olga',
	},
});
app.post('/checkout', (req, res) => {
    const { userId } = req.body;

    db.beginTransaction((err) => {
        if (err) {
            console.error("Transaction Error:", err);
            return res.status(500).json({ error: "Transaction failed" });
        }

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
                ua.ID = ic.User_ID
            WHERE
                ua.ID = ?;
        `;

        db.query(combineQuery, [userId], (err, results) => {
            if (err) {
                console.error("Query Error:", err);
                return db.rollback(() => res.status(500).json({ error: "Query failed" }));
            }

            const cartItems = results.filter(row => row.Item_Name !== null);

			if (cartItems.length === 0) {
				console.log("Your cart is empty");
				return db.rollback(() => res.status(400).json({ error: "Your cart is empty" }));
			}

            const Pending = 'Pending';

            const insertQuery = `
                INSERT INTO transaction 
                (Image, Item_Name, Variant, Size, Quantity, Amount, Customer_Name, Email_Address, Phone_Number, Date, Status) 
                VALUES ?
            `;

            const values = cartItems.map(row => [
				row.Image, row.Item_Name, row.Variant, row.Size, row.Quantity,
				row.Amount * row.Quantity, row.Full_Name, row.Email_Address, row.Phone_Number,
				row.Date, Pending
			]);

            db.query(insertQuery, [values], async (err, insertResult) => {
                if (err) {
                    console.error("Insert Error:", err);
                    return db.rollback(() => res.status(500).json({ error: "Insert failed" }));
                }

                const orderID = insertResult.insertId;
                const currentDate = new Date();
                const year = currentDate.getFullYear().toString().slice(-2);
                const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
                const day = currentDate.getDate().toString().padStart(2, '0');
                const formattedDate = `${month}-${day}-${year}`;

                try {
					const itemRowsHTML = cartItems.map(row => {
						const variantDisplay = row.Variant?.trim() ? row.Variant : '';
						const sizeDisplay = row.Size?.trim() ? row.Size : '';
						const productDisplay = [row.Item_Name, variantDisplay, sizeDisplay]
							.filter(part => part) 
							.join(' - ');
					
						return `
							<tr>
								<td style="border: 1px solid gray; padding: 8px; text-align: center;">${productDisplay}</td>
								<td style="border: 1px solid gray; padding: 8px; text-align: center;">₱${row.Amount} x ${row.Quantity} = ₱${row.Amount * row.Quantity}</td>
							</tr>
						`;
					}).join('');
					

					const totalAmount = cartItems.reduce((sum, row) => sum + (row.Amount * row.Quantity), 0);
					const user = cartItems[0];

					const orderID = `${new Date().getFullYear()}0${insertResult.insertId}`;

					const mailOptions = {
						from: 'cvsutanzaeba@gmail.com',
						to: user.Email_Address,
						subject: 'Order Details',
						html: `
							<header style='height: 150px; background: #c1ff72; display: flex; flex-direction: column; gap: 10px;'>
								<img src="https://res.cloudinary.com/dfmnlcvbe/image/upload/v1744102780/logo_qy0g8a.png" style='width: 80px; height: 80px;'/>
								<h2>External Business and<br>Affairs</h2>
							</header>

							<br>

							<h3>Thank you for your order!</h3>
							<p>${user.Full_Name}</p>
							<p>Your order was received! We're working to get it processed and ready to claim.</p>

							<br>

							<div style='display: flex; align-items: center;'>
								<div style="margin-right: 30px;">
									<p>Order Number:</p>
									<span>#${orderID}</span>
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
								${itemRowsHTML}
								<tr>
									<td style="border: 1px solid gray; padding: 8px; text-align: center;"></td>
									<td style="border: 1px solid gray; padding: 8px; text-align: center;"><strong>Total: P${totalAmount}</strong></td>
								</tr>
							</table>

							<p>Thank you for your purchase!</p>
							<p>Cavite State University - Tanza Campus</p>
						`
					};

					await transporter.sendMail(mailOptions);

                    db.query("DELETE FROM item_cart WHERE User_ID = ?", [userId], (err) => {
                        if (err) {
                            console.error("Cart Clear Error:", err);
                            return db.rollback(() => res.status(500).json({ error: "Failed to clear cart" }));
                        }

                        db.commit((err) => {
                            if (err) {
                                console.error("Commit Error:", err);
                                return db.rollback(() => res.status(500).json({ error: "Transaction commit failed" }));
                            }

                            res.json({ Status: "Success" });
                        });
                    });
                } catch (emailError) {
                    console.error("Email Error:", emailError);
                    return db.rollback(() => res.status(500).json({ error: "Email sending failed" }));
                }
            });
        });
    });
});



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

app.post('/adminchangepass', async (req, res) => {
	const { id, password } = req.body;

	if (!id || !password) {
		return res.status(400).json({ message: 'Missing ID or password' });
	}

	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		const query = "UPDATE admin_account SET Password = ? WHERE ID = ?";

		db.query(query, [hashedPassword, id], (err, result) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: 'Error updating password' });
			}
			return res.status(200).json({ message: 'Password updated' });
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server error' });
	}
});


// DASHBOARD PAGE


// TRANSACTION PAGE
// FETCH AND DISPLAY THE DATA
app.get("/transaction", (req, res) => {
	const order = req.query.order === 'ASC' ? 'ASC' : 'DESC';
	db.query(`SELECT * FROM transaction ORDER BY created_At ${order}`, (err, results) => {
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

app.get("/api/dashboard/all", (req, res) => {
    const queries = {
        totalSales: `
            SELECT COALESCE(SUM(Amount), 0) as total_sales 
            FROM transaction
            WHERE Status IS NULL OR Status != 'Cancelled'
        `,
        totalOrders: `
            SELECT COUNT(*) as total_orders 
            FROM transaction
            WHERE Status IS NULL OR Status != 'Cancelled'
        `,
        lowStock: `
            SELECT COUNT(*) as low_stock 
            FROM inventory 
            WHERE Quantity < 10 AND Quantity > 0
        `,
        availableStocks: `
            SELECT COALESCE(SUM(Quantity), 0) as total_stocks 
            FROM inventory
            WHERE Quantity > 0
        `,
        newOrders: `
            SELECT COUNT(*) as new_orders 
            FROM transaction 
            WHERE Date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            AND (Status IS NULL OR Status != 'Cancelled')
        `,
        fastMovingItems: `
            SELECT 
                Item_Name,
                COUNT(*) as order_count
            FROM transaction
            WHERE Status IS NULL OR Status != 'Cancelled'
            GROUP BY Item_Name
            ORDER BY order_count DESC
            LIMIT 5
        `,
        salesData: `
            SELECT 
                DATE_FORMAT(Date, '%M') AS month, 
                Item_Name as category, 
                SUM(Amount) AS total_sales 
            FROM transaction 
            WHERE Status IS NULL OR Status != 'Cancelled'
            GROUP BY month, Item_Name 
            ORDER BY MONTH(Date)
        `,
        ordersData: `
            SELECT 
                DATE_FORMAT(Date, '%M') AS month, 
                Item_Name as category, 
                COUNT(*) AS total_orders 
            FROM transaction 
            WHERE Status IS NULL OR Status != 'Cancelled'
            GROUP BY month, Item_Name 
            ORDER BY MONTH(Date)
        `
    };

    const results = {};
    let completedQueries = 0;
    const totalQueries = Object.keys(queries).length;

    Object.entries(queries).forEach(([key, query]) => {
        db.query(query, (err, result) => {
            if (err) {
                console.error(`Error in ${key} query:`, err);
                return res.status(500).json({ error: err.message });
            }

            if (key === 'salesData' || key === 'ordersData') {
                const formattedData = {
                    labels: [...new Set(result.map((row) => row.month))],
                    datasets: []
                };

                const categories = [...new Set(result.map((row) => row.category))];

                categories.forEach((category) => {
                    formattedData.datasets.push({
                        label: category,
                        data: result
                            .filter((row) => row.category === category)
                            .map((row) => key === 'salesData' ? row.total_sales : row.total_orders)
                    });
                });

                results[key] = formattedData;
            } else {
                results[key] = result[0];
            }

            completedQueries++;
            if (completedQueries === totalQueries) {
                res.json(results);
            }
        });
    });
});
