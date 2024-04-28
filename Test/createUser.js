const { v4: uuidv4 } = require('uuid');
//onst bcrypt = require('bcrypt');
const db = require('../DATABASE/database.js');

createAcount = async (req, res) => {
    try {
      const { email, password } = req.body;
      const userId = uuidv4();
      //var hashedPassword
      const role = "user"
  
      const insertUserSql = "INSERT INTO UserLogin (uuid, email, password,role) VALUES (?,?,?,?)";
    
      db.getCon().query(insertUserSql, [userId , email, password,role], (err, result) => {
  
        if (err) {
          //console.error('Error inserting new user:', err);
          return res.status(500).send('Error during registration');
        }
        //res.send('User registered successfully');
      });
      console.log("Match");
      return res.status(200).send({message: 'User registered successfully'});
    } catch (error) {
      console.error('Error during registration:', error);
      //res.status(500).send('Error during registration');
    }
  
  
};

module.exports = createAcount;