//must change before final build and fianal string must not be displayed on github for security reasons
require('dotenv').config();
module.exports= {
    access_secret: process.env.SECRETKEY
}