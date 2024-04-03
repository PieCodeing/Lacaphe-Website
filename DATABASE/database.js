
var mysql = require('mysql2');
var con;
const config = require("../CONFIG/db.config.js");

function connectToDatabase() {
  con = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "DemBoys"
  });
  con.connect(err => {
    setupDatabase(err);
  });
}

function setupDatabase(err) {
  if (err) throw err;
  console.log("Connected to local mysql server!");

  con.query("CREATE DATABASE IF NOT EXISTS lacaphedb")
  if (err) throw err;
  console.log("Database created");
  con.query("use lacaphedb")
  if (err) throw err;

  var dropsql = "DROP TABLE IF EXISTS Drinks"
  con.query(dropsql, function (err) {
    if (err) throw err;
    console.log("Drink table dropped if it exits");
  })
  var dropUserSql = "DROP TABLE IF EXISTS UserLogin"
  con.query(dropUserSql, function (err) {
    if (err) throw err;
    console.log("User table dropped if it exits");
  })
  createDrinkTable();
  createUserLoginTable();
}
function createDrinkTable(){
  // 's' = signature drinks, 'c' = coffee, 't' = tea, 'i' = ice blended
  var tablesql = "CREATE TABLE Drinks(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), image VARCHAR(255), price DECIMAL(5,2), type VARCHAR(2), description VARCHAR(255))"
  con.query(tablesql, function (err) {
    if (err) throw err;
    console.log("Drink table created");
  })
  populateDrinktable();
}
function createUserLoginTable(){


  const userLoginTable = `
  CREATE TABLE UserLogin (
    uuid VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255)
  )`;
  con.query(userLoginTable, function (err) {
    if (err) throw err;
    console.log("User table created");
  })

}

function populateDrinktable(){
  var insertsql = "INSERT INTO Drinks(name, image,price,type, description) VALUES('boba tea','https://www.unionsquareawards.org/wp-content/uploads/2019/09/images3904-5d882e0c1594c.jpg',2.50,'t', 'desc 1'),"
    + "('lychee Tea','https://s3-media0.fl.yelpcdn.com/bphoto/Z0nZF9zYTaMVT5nbbGuxDA/o.jpg',3.75, 't', 'desc 2'),"
    + "('Test Coffee','https://images.immediate.co.uk/production/volatile/sites/30/2020/08/flat-white-3402c4f.jpg?quality=90&webp=true&resize=500,454',5.00, 'c', 'desc 3'),"
    + "('Some Signature Drink', 'http://1.bp.blogspot.com/-JFw1MGN5OoM/UD-BpCdlxzI/AAAAAAAAEMQ/brNZEjdhZWU/s1600/Lychee%2BMartini%2B3fc.jpg', 5.00, 's', 'desc 4'),"
    + "('Ice Blended Drink', 'https://www.gfbfood.com.my/wp-content/uploads/2020/03/Untitled-design-1.jpg', 2.75, 'i', 'desc 5');"
  con.query(insertsql, function (err) {
    if (err) throw err;
    console.log("Test table filled");
  })
  selectFromDrinkTable();
}
function selectFromDrinkTable(){
  var getsql = "SELECT * from Drinks"
  con.query(getsql, function (err, result) {
    if (err) console.log(err);
    else {
      const data = JSON.stringify(result)
      console.log(data)
    }
  })

}

/**
 * Function that gets the connection instance
 * 
 * @returns The connection instance (Don't reference object directly)
 */
function getCon() {
  if (!con) {
    connectToDatabase();
  }
  return con;
}

module.exports = {
  connectToDatabase, setupDatabase, getCon
}


