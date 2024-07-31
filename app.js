const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({storage: storage});

const connection = mysql.createConnection({
    // host: 'localhost',
    // user: 'root',
    // password: 'Republic_C207',
    // database: 'cubes'
    host: 'sql.freedb.tech',
    user: 'freedb_Ralph',
    password: 'hD9xZ6Btfd8?9DK',
    database: 'freedb_Database MiniProject'
}); // test

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({
    extended: false
}));
app.use(express.static('public'));


app.get('/', (req, res) => {
    const sql = 'SELECT * FROM cubeproducts3';
    connection.query( sql , (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error Retrieving products');
        }
      res.render('home', { products: results });
    });
});

app.get('/admin', (req, res) => {
    const sql = 'SELECT * FROM cubeproducts3';
    connection.query( sql , (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error Retrieving products');
        }
      res.render('admin', { products: results });
    });
});

app.get('/message', (req, res) => {
    const sql = 'SELECT * FROM messagelist';
    connection.query( sql , (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error Retrieving message');
        }
      res.render('message', { messages: results });
    });
});

app.get('/product/:id', (req, res) => {
    const cubeId = req.params.id;
    const sql = 'SELECT * FROM cubeproducts3 WHERE cubeId = ?';
    connection.query( sql , [cubeId], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error Retrieving products by ID');
        }
        if (results.length > 0) {
            res.render('product', { product: results[0]});
        } else {
            res.status(404).send('Product not found');
        }
    });
});

app.get('/productview/:id', (req, res) => {
    const cubeId = req.params.id;
    const sql = 'SELECT * FROM cubeproducts3 WHERE cubeId = ?';
    connection.query( sql , [cubeId], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error Retrieving products by ID');
        }
        if (results.length > 0) {
            res.render('productview', { product: results[0]});
        } else {
            res.status(404).send('Product not found');
        }
    });
});

app.get('/addNew', (req, res) => {
    res.render('addNew');
});

app.post('/addNew', upload.single('image'), (req, res) => {
    const {name, quantity, price} = req.body;
    let image;
    if (req.file) {
        image = req.file.filename;
    } else {
        image = null;
    }

    const sql = 'INSERT INTO cubeproducts3 (name, quantity, price, image) VALUES (?, ?, ?, ?)';
    connection.query( sql , [name, quantity, price, image], (error, results) => {
        if (error) {
            console.error("Error adding product:", error);
            res.status(500).send('Error adding product');
        } else {
            res.redirect('/admin');
        }
    });
}); 

// app.get('/products/:id/addProduct', (req, res) => {
//     res.render('addProduct');
// });

app.get('/addProduct/:id', (req,res) => {
    const cubeId = req.params.id;
    const sql = 'SELECT * FROM cubeproducts3 WHERE cubeId = ?';
    connection.query( sql, [cubeId], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving product by ID');
        }
        if (results.length > 0) {
            res.render('addProduct', {product: results[0] });
        } else {
            res.status(404).send('Product not found');
        }
    });
});

app.post('/addProduct/:id', upload.single('image'), (req, res) => {
    const {name, quantity, price} = req.body;
});

app.get('/editProduct/:id', (req,res) => {
    const cubeId = req.params.id;
    const sql = 'SELECT * FROM cubeproducts3 WHERE cubeId = ?';
    connection.query( sql, [cubeId], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving product by ID');
        }
        if (results.length > 0) {
            res.render('editProduct', {product: results[0] });
        } else {
            res.status(404).send('Product not found');
        }
    });
});

app.post('/editProduct/:id', upload.single('image'), (req, res) => {
    const cubeId = req.params.id;
    const { name, quantity, price } = req.body;
    // let image = req.body.currentImage;
    // if (req.file) {
    //     image = req.file.filename;
    // }

    const sql = 'UPDATE cubeproducts3 SET name = ?, quantity = ?, price = ? WHERE cubeId = ?';

    connection.query( sql, [name, quantity, price, cubeId], (error, results) => {
        if (error) {
            console.error("Error updating product:", error);
            res.status(500).send('Error updating product');
        } else {
            res.redirect('/admin');
        }
    });
});

app.get('/deleteProduct/:id', (req, res) => {
    const cubeId = req.params.id;
    const sql = 'DELETE FROM cubeproducts3 WHERE cubeId = ?';
    connection.query( sql, [cubeId], (error, results) => {
        if (error) {
            console.error("Error deleting product:", error);
            res.status(500).send('Error deleting product');
        } else {
            res.redirect('/admin');
        }
    });
});

app.get('/deleteMessage/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM messagelist WHERE id = ?';
    connection.query( sql, [id], (error, results) => {
        if (error) {
            console.error("Error deleting message:", error);
            res.status(500).send('Error deleting message');
        } else {
            res.redirect('/message');
        }
    });
});

app.get('/payment/:id', (req, res) => {
    const cubeId = req.params.id;
    const sql = 'SELECT * FROM cubeproducts3 WHERE cubeId = ?';
    connection.query( sql , [cubeId], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error Retrieving products by ID');
        }
        if (results.length > 0) {
            res.render('payment', { product: results[0]});
        } else {
            res.status(404).send('Product not found');
        }
    });
});

app.get('/order/:id', (req, res) => { 
    const cubeId = req.params.id;
    const sql = 'SELECT * FROM cubeproducts3 WHERE cubeId = ?';
    connection.query( sql , [cubeId], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error Retrieving products by ID');
        }
        if (results.length > 0) {
            res.render('order', { product: results[0]});
        } else {
            res.status(404).send('Product not found');
        }
    });
});

app.get('/aboutUs', (req, res) => {
    res.render('about');
});

app.get('/contactUs', (req, res) => {
    res.render('contact');
});

app.get('/messagesent', (req, res) => {
    res.render('messagesent');
});

app.post('/contactUs', upload.single('image'), (req, res) => {
    const {email, subject, message} = req.body;

    const sql = 'INSERT INTO messagelist (email, subject, message) VALUES (?, ?, ?)';
    connection.query( sql , [email, subject, message], (error, results) => {
        if (error) {
            console.error("Error adding product:", error);
            res.status(500).send('Error adding message');
        } else {
            res.redirect('/messagesent');
        }
    });
});

app.get('/login', (req, res) => {
    res.render('login');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
