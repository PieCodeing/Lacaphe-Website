var jwt = require("jsonwebtoken");
//const {verifyToken} = require('./MIDDLEWARE/authjwt.js');

const verifyAuth0Token = async (token) => {
    verifyToken = "DemBoys-secret-key";
    return new Promise((resolve, reject) => {
      jwt.verify(token, verifyToken, (err, decoded) => {
        if (err) {
          reject(err);
          return;
        }
  
        resolve(decoded);
      });
    });
  };

module.exports = verifyAuth0Token;