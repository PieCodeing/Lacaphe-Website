const db = require('../DATABASE/database'); 

checkDuplicateEmail = (req,res,next) =>{
    const findUserSql = "SELECT * FROM UserLogin WHERE email = ?";
    const email = req.body.email;
    try{
        db.getCon().query(findUserSql, [email], async (err, users) => {
            //if no users are found continue
            if (users.length === 0) {
                next();
                return;  
            }
            else{return res.status(400).send({message: "Email already in use!"});}
            
        });
    }
    catch(error){
        console.error('Error during verifing Email:', error);
        return res.status(400).send({message: "Error during verifing Email!"});
    }
     
}

const verifyNewAcount ={
    checkDuplicateEmail: checkDuplicateEmail
}
module.exports = verifyNewAcount