const createAcount = require('./createUser.js');
const db = require('../DATABASE/database.js');
jest.mock('../DATABASE/database');

describe('Create Acount', () =>{
    afterEach(() => {
        jest.clearAllMocks();
    });

    

    
    it('should sucesfully add username and password to the database', async () =>{
        const req = { body: { email: 'new@example.com' ,passwor:'password'} };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        const next = jest.fn()

        db.getCon = jest.fn().mockReturnValue({
            query: jest.fn((sql, params, callback) => {
              callback(null, []);
            }),
          });
        await createAcount(req,res);
        //console.log(res.status);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({ message: 'User registered successfully' });
    });
    
});