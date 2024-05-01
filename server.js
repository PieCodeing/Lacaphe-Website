const express = require('express');
const multer = require('multer');
const bcrypt = require('bcrypt');

// Images will be uploaded to ./PHOTOS/drinksPNGS
const upload = multer({ dest: './PHOTOS/drinksPNGS' });

//const jwt = require('jsonwebtoken');

const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;
const db = require('./DATABASE/database');
const path = require('path');
const config = require("./CONFIG/auth.config");
const cookieParser = require('cookie-parser');
const {verifyToken} = require('./MIDDLEWARE/authjwt.js');

  var jwt = require("jsonwebtoken");
// const cookieParser = require('cookie-parser');
const authJwt = require('./MIDDLEWARE/authjwt.js');

const verifyNewAcount = require('./MIDDLEWARE/verifyNewAcount.js');

app.use(express.static(path.join(__dirname, 'STYLES')))
app.use(express.static(path.join(__dirname, 'PHOTOS')))
app.use(express.static(path.join(__dirname, 'ICONS')))
app.use(express.static(path.join(__dirname, 'COMPONENTS')))
const session = require('express-session');

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/PAGES'));

app.use(cookieParser());



var corsOptions ={
  origin: 'http://localhost:3001'
};
//enable middleware
app.use(cors(corsOptions));


app.use(express.json());
app.use(cookieParser());
//test
// Serve static files from the 'public' directory
app.use(express.static('public'));
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: 'auto' } // 'auto' will use 'true' on HTTPS
}));
app.get('/', (req, res) => {

  res.render('index.ejs');

}); app.get('/about', (req, res) => {

  res.render('about.ejs');
});

app.get('/login', (req, res) => {

  res.render('login.ejs');
});
app.get('/review', authJwt.verifyUser, (req, res) => {
  
  res.render('review.ejs');
});

app.get('/userLogout', (req, res) => {
  
    res.render('userLogout.ejs');
  });

app.get('/get-latest', (req, res) => {
  const query = 'SELECT * FROM Drinks ORDER BY id DESC LIMIT 1';

  db.getCon().query(query, (error, results) => {
    if (error) throw error;
    res.json(results[0]);
  });
});

app.delete('/delete/:id', (req, res) => {
  // const { id } = req.params;
  const id = parseInt(req.params.id, 10);  // Parse the id to an integer
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  const query = 'DELETE FROM Drinks WHERE id = ?';

  db.getCon().query(query, [id], (error, results) => {
    // if (error) throw error;
    // res.send("Item deleted successfully");
    if (error) {
      console.error('Error deleting item:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  });
});

app.post('/add-drink', upload.single('add-new-item-image'), (req, res) => {
  const name = req.body['add-new-item-name'];
  const description = req.body['add-new-item-description'];
  const price = req.body['add-new-item-price'];
  const drinkType = req.body['add-new-item-type'];
  const url = req.body['add-new-item-url'];
  const SUCCESS_MSG = "Added menu item successfully";
  let image = null;
  if (req.file) {
    image = '/drinksPNGS/' + req.file.filename;
    const query = 'INSERT INTO Drinks (name, description, price, type, image, url) VALUES (?, ?, ?, ?, ?, ?)';
    db.getCon().query(query, [name, description, price, drinkType, image, url], (error, result) => {
      if (error) throw error;
      res.send(SUCCESS_MSG);
    });
  } else {
    const query = 'INSERT INTO Drinks (name, description, price, type, url) VALUES (?, ?, ?, ?, ?)'

    db.getCon().query(query, [name, description, price, drinkType, url], (error, result) => {
      if (error) throw error;
      res.send(SUCCESS_MSG);
    });
  }


})

app.put('/edit-drinks', upload.single('add-new-image'), (req, res) => {
  // console.log(req.body);
  // let newImgPath, query;
  const SUCCESS_MSG = "Item updated successfully";
  const { id, name, price, description, url } = req.body;

  function isValidPrice(price) {
    return /^\d+(\.\d{1,2})?$/.test(price);
  }

  console.log(id, name, price, description, req.body.type);

  if (!id || !isValidPrice(price) || !req.body.type) {
    return res.status(400).send("Invalid Input data");
  }

  if (req.file) {
    const newImgPath = '/drinksPNGS/' + req.file.filename;
    const query = 'UPDATE Drinks SET image = ? WHERE id = ?';
    db.getCon().query(query, [newImgPath, id], (error, result) => {
      if (error) throw error;
      console.log(SUCCESS_MSG);
    });
  }

  const query = 'UPDATE Drinks SET name = ?, price = ?, description = ?, type = ?, url = ? WHERE id = ?';

  db.getCon().query(query, [name, price, description, req.body.type, url, id], (error, result) => {
    if (error) throw error;
    // console.log("Item updated successfully");
    res.send(SUCCESS_MSG);
  });

  // console.log(req.file);
  // res.send('Form data received');
});

// TODO: Temporary page, change
app.get('/admin',[authJwt.verifyToken,authJwt.verifyAdmin],(req, res) => {
  res.render('admin.ejs');
});
const secretKey = config.access_secret;
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUserSql = "SELECT * FROM UserLogin WHERE email = ?";

    db.getCon().query(findUserSql, [email], async (err, users) => {
      if (err) {
        console.error('Error fetching user:', err);
        return res.status(500).send('Error during login'); // Use return here
      }

      if (users.length === 0) {
        return res.status(404).send('User not found'); // Use return here
      }

      const user = users[0];
  
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const accessToken = jwt.sign({  email: user.email ,role: user.role}, secretKey, { expiresIn: '1h' });
        res.cookie('token', accessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
        console.log("Match");
        return res.json({ accessToken }); // Use return here
      } else {
        return res.status(401).send('Password is incorrect'); // Use return here
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).send('Error during login'); // Use return here
  }
});

app.post('/createAcount',verifyNewAcount.checkDuplicateEmail, async (req, res) => {
  try {
    const { email, password } = req.body;
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = "user"

    const insertUserSql = "INSERT INTO UserLogin (uuid, email, password,role) VALUES (?,?,?,?)";

   
    
  
    db.getCon().query(insertUserSql, [userId , email, hashedPassword,role], (err, result) => {

      if (err) {
        console.error('Error inserting new user:', err);
        return res.status(500).send('Error during registration');
      }

      //res.send('User registered successfully');
    });

    //add token for loging in 
    //const accessToken = jwt.sign({  email: email ,role: role}, secretKey, { expiresIn: '1h' });
    //res.cookie('token', accessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    console.log("Match");
    return res.send('User registered successfully');
  } catch (error) {
    console.error('Error during registration:', error);
    //res.status(500).send('Error during registration');
  }


});

function authenticateToken(req, res, next) {
  const token = req.cookies['token']; // Access the token from the request cookies
  if (!token) return res.sendStatus(401); // No token found

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403); // Token validation failed

    req.user = user; // Token is valid, proceed
    next();
  });
}
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Error destroying session: ", err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    
    // Clear any authentication-related cookies
    res.clearCookie('connect.sid', { path: '/' }); // Adjust based on your session cookie's name
    res.clearCookie('token', { path: '/' }); // If you are using a 'token' cookie
    // Set 'jwt' cookie to expire immediately
    res.cookie('jwt', '', { maxAge: 1, path: '/' });

    // Send a JSON response indicating logout success
    res.json({ message: 'Logged out successfully' });
  });
});



app.get('/protected', authenticateToken, (req, res) => {
  // This route is now protected, and req.user contains the payload of the verified JWT
  res.send("welcome!!!")
});

app.get('/adminlogin', (req,res) =>{ //temporary page for admin login

  res.render('adminLogIn.ejs')
});

app.post('/adminLogin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userId = uuidv4();

    const hashedPassword = await bcrypt.hash(password, 10);
    const role ="admin"

    const insertUserSql = "INSERT INTO UserLogin (uuid, email, password,role) VALUES (?,?,?,?)";

  
    db.getCon().query(insertUserSql, [userId , email, hashedPassword,role], (err, result) => {
      if (err) {
        console.error('Error inserting new user:', err);
        res.status(500).send('Error during registration');
        return;
      }

      const accessToken = jwt.sign({  email: email ,role: role}, secretKey, { expiresIn: '1h' });
      res.cookie('token', accessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
      console.log("Match");
      res.json( accessToken ); // Use return here

      //res.send('User registered successfully');
    });

  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('Error during registration');
  }
});

app.get('/drinks', (req, res) => {

  res.render('drinks.ejs');
});

app.get('/drinks/all', (req, res) => {
  let query = 'SELECT * FROM Drinks'
  db.getCon().query(query, (error, result, fields) => {
    if (error) {
      res.status(500).send('Database Error :(');
      console.error(err);
      return;
    }
    res.json(result);
  });
});



app.get('/drinks/list', (req, res) => {
  let id = req.query.id;
  let type = req.query.type;
  let name = req.query.name;
  let query = '';
  let queryParams = [];

  if (type) {
    query = 'SELECT * FROM Drinks WHERE type = ?';
    queryParams = [type];
  } else if (name) {
    // Assuming the 'name' column in your database is the one to search by
    query = 'SELECT * FROM Drinks WHERE name LIKE ?';
    queryParams = [`%${name}%`]; // Use LIKE for partial matches
  } else if (id) {
    query = 'SELECT * FROM Drinks WHERE id = ?';
    queryParams = [id];
  } else { // TODO: ADD Something here
    res.status(400).send('Missing type or name query parameter');
    return;
  }

  db.getCon().query(query, queryParams, (err, result) => {
    if (err) {
      res.status(500).send('Database Error :(');
      console.error(err);
      return;
    }
    res.json(result);
  });
});
app.post('/submit-review', async (req, res) => {
  const reviewText = req.body.reviewText;
  const insertSql = 'INSERT INTO Reviews (review_text) VALUES (?)';
  
  db.getCon().query(insertSql, [reviewText], function(err, result) {
      if (err) {
          console.error('Error inserting review:', err);
          res.status(500).send('Error inserting review');
          return;
      }
      console.log('Review inserted successfully:', result.insertId);
      res.send('Review submitted successfully');
  });
});

module.exports = app;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Establish connection to the database
db.connectToDatabase(function (err) {
  if (err) {
    console.error("Failed to connect to database:", err);
    return;
  }

  // If connection is successful, proceed to set up the database
  db.setupDatabase(function (err) {
    if (err) {
      console.error("Failed to setup database:", err);
      return;
    }
  });
});

//test authorization
//now used to vreify a used in check wether or not to enable signout
app.post('/tokenTest',[authJwt.verifyToken],(req, res) => {
  res.json("testing authentiification")
})

app.get('/tokenTest',[authJwt.verifyToken],(req, res) => {
  res.json("authoriztion worked")
})

app.get('/reviews', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;
  const sql = "SELECT id, review_text FROM Reviews LIMIT ? OFFSET ?";
  db.getCon().query(sql, [pageSize, offset], (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

app.get('/get-reviews', (req, res) => {
  const sql = "SELECT * FROM Reviews";
  db.getCon().query(sql, (error, results) => {
    if (error) throw error;
    res.json(results);
  });

})
