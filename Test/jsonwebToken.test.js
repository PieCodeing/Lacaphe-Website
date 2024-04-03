//const authjwt = require('./MIDDLEWARE/authjwt.js');
const createToken = require('./UNIT_FUNCTIONS/createToken');

test('creation of json webtoken',()=>{
    expect(createToken('test@gmail.com','user')).not.toBeNull();
});