//const config = require("../CONFIG/auth.config.js");
var jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');

function createToken(email,role){
    secretKey = 'DemBoys-secret-key';
    const accessToken = jwt.sign({  email: email ,role: role}, secretKey, { expiresIn: '1h' });
    console.log("Match");
    return accessToken ; // Use return here
}

module.exports = createToken;