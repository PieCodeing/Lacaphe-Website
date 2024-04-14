const  verifyAuth0Token = require('./UNIT_FUNCTIONS/verifyToken');
const jwt = require("jsonwebtoken") ; 

describe("Auth Test", () => {

  test("should verify the token", async () => {
    secretKey ='DemBoys-secret-key'
    const user ={
        email :'test@gmail.com',
        role :'user'
    }
    const token = jwt.sign({  email: user.email ,role: user.role}, secretKey, { expiresIn: '1h' });
  
    const data = await verifyAuth0Token(token);
  
    expect(data).toMatchObject({  email: user.email ,role: user.role});
  });

  test("Test Incorect names", async () => {
    secretKey ='DemBoys-secret-key'
    const user ={
        email :'test@gmail.com',
        role :'user'
    }
    const token = jwt.sign({  email: user.email ,role: user.role}, secretKey, { expiresIn: '1h' });
  
    const data = await verifyAuth0Token(token);
  
    expect(data).not.toMatchObject({  email: 'incorectemail@gmail.com' ,role: "admin"});
  });

  test("Test incorect Key", async () => {
    secretKey ='Incorect Key'
    const user ={
        email :'test@gmail.com',
        role :'user'
    }
    const token = jwt.sign({  email: user.email ,role: user.role}, secretKey, { expiresIn: '1h' });
  
    const data = await verifyAuth0Token(token);
  
    expect(data).not.toMatchObject({  email: user.email ,role: user.role});
  });
});