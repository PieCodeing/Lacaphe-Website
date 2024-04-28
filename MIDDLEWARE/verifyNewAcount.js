 const db = require('../DATABASE/database'); 

 checkDuplicateEmail = (req,res,next) =>{
    const findUserSql = "SELECT * FROM UserLogin WHERE email = ?";
     const email = req.body.email;
     try{
         db.getCon().query(findUserSql, [email], async (err, users) => {
            
          if (err) {
            return res.status(400).send({ message: "Error during verifing Email!" });
          }
          //if no users are found continue
          if (users.length === 0) {
            next();
            return;  
          }
          else{return res.status(400).send({message: "Email already in use!"});}
            
         });
     }
     catch(error){
        //console.error('Error during verifing Email:', error);
         return res.status(400).send({message: "Error during verifing Email!"});
    }
     
}

const verifyNewAcount ={
     checkDuplicateEmail: checkDuplicateEmail
}
module.exports = verifyNewAcount



/*
const db = require('../DATABASE/database');

const checkDuplicateEmail = (req, res, next) => {
  const findUserSql = "SELECT * FROM UserLogin WHERE email = ?";
  const email = req.body.email;

  db.getCon().query(findUserSql, [email], (err, users) => {
    if (err) {
      //console.error('Error during verifing Email:', err);
      return res.status(400).send({ message: "Error during verifing Email!" });
    }

    if (users.length === 0) {
      next();
      return;
    } else {
      return res.status(400).send({ message: "Email already in use!" });
    }
  });
}

module.exports = checkDuplicateEmail;
*/