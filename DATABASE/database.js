
var mysql = require('mysql2');
var con;
const config = require("../CONFIG/db.config.js");

function connectToDatabase() {
  con = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "DemBoys!!!!"

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
  var dropReviews = "DROP TABLE IF EXISTS Reviews"
  con.query(dropReviews, function (err) {
    if (err) throw err;
    console.log("User table dropped if it exits");
  })
  createDrinkTable();
  createUserLoginTable();
  createReviewTable();
}
function createDrinkTable(){
  // 's' = signature drinks, 'c' = coffee, 't' = tea, 'i' = ice blended
  var tablesql = "CREATE TABLE Drinks(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), image VARCHAR(255), price DECIMAL(5,2), type VARCHAR(2), description VARCHAR(255), url VARCHAR(255))"
  con.query(tablesql, function (err) {
    if (err) throw err;
    console.log("Drink table created");
  })
  populateDrinktable();
}
function createReviewTable(){

  var tablesql = "CREATE TABLE Reviews(id INT AUTO_INCREMENT PRIMARY KEY, review_text TEXT)";
  con.query(tablesql, function (err) {
    if (err) throw err;
    console.log("Review table created");
  })
 // populateReviewTable(); // You should define this function to populate the Reviews table with initial data
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

  // Format has to be /drinksPNGS/[image name here]
  // var insertsql = "INSERT INTO Drinks(name, image, price, type, description, url) VALUES('boba tea','/drinksPNGS/test1.jpg',2.50,'t', 'desc 1', 'https://www.google.com'),"
  //   + "('Eggspresso Hanoi','/drinksPNGS/newtest2.webp',6.95, 's', 'phin-dripped milk coffee with sweet egg cream', 'https://www.google.com'),"
  //   + "('Coco Freeze','/drinksPNGS/newtest3.webp',6.50, 's', 'coconut coffee blended with toasted coconut flakes', 'https://www.google.com'),"
  //   + "('Signature Saigon', '/drinksPNGS/newtest4.webp', 6.75, 's', 'our house blend coffee with cloud cream', 'https://www.google.com'),"
  //   + "('Peach', '/drinksPNGS/newtest5.webp', 6.75, 's', 'black tea infused with peach, orange, lemongrass', 'https://www.google.com'),"
  //   + "('Lotus', '/drinksPNGS/newtest6.webp', 6.50, 's', 'creamy lotus milk tea with crystal boba', 'https://www.google.com'),"
  //   + "('MUỐI', '/drinksPNGS/logo_white.png', 6.50, 'c', 'salted phin-dripped milk coffee, cloud cream', 'https://lacaphe.square.site/?item=6#2'),"
  //   + "('COCONUT', '', 6.50, 'c', '" 

  var insertsql = "INSERT INTO Drinks(name, image, price, type, description, url) VALUES"
    //+ "('boba tea', '/drinksPNGS/test1.jpg', 2.50, 't', 'desc 1', 'https://www.google.com'),"
    + "('Eggspresso Hanoi', '/drinksPNGS/newtest2.webp', 6.95, 's', 'phin-dripped milk coffee with sweet egg cream', 'https://lacaphe.square.site/?item=1#2'),"
    + "('Coco Freeze', '/drinksPNGS/newtest3.webp', 6.50, 's', 'coconut coffee blended with toasted coconut flakes', 'https://lacaphe.square.site/?item=3#2'),"
    + "('Signature Saigon', '/drinksPNGS/newtest4.webp', 6.75, 's', 'our house blend coffee with cloud cream', 'https://lacaphe.square.site/?item=19#2'),"
    + "('Peach', '/drinksPNGS/newtest5.webp', 6.75, 's', 'black tea infused with peach, orange, lemongrass', 'https://lacaphe.square.site/?item=5#2'),"
    + "('Lotus', '/drinksPNGS/newtest6.webp', 6.50, 's', 'creamy lotus milk tea with crystal boba', 'https://lacaphe.square.site/?item=10#2'),"
    + "('MUỐI', '/drinksPNGS/logo_white.png', 6.50, 'c', 'salted phin-dripped milk coffee, cloud cream', 'https://lacaphe.square.site/?location=11ee213d7e10ea94b2b23cecef6d5b2a&item=6#3'),"
    + "('COCONUT', '/drinksPNGS/logo_white.png', 6.50, 'c', 'phin-dripped coffee, coconut cream, grass jelly', 'https://lacaphe.square.site/?location=11ee213d7e10ea94b2b23cecef6d5b2a&item=15#3'),"
    + "('UBE', '/drinksPNGS/logo_white.png', 6.00, 'c', 'phin-dripped coffee, ube fresh milk', 'https://lacaphe.square.site/?location=11ee213d7e10ea94b2b23cecef6d5b2a&item=17#3'),"
    + "('NÂU', '/drinksPNGS/logo_white.png', 5.75, 'c', 'vietnamese coffee', 'https://lacaphe.square.site/?location=11ee213d7e10ea94b2b23cecef6d5b2a&item=14#3'),"
    + "('BẠC XỈU', '/drinksPNGS/logo_white.png', 5.75, 'c', 'lighter version of Nâu, less caffeinated', 'https://lacaphe.square.site/?location=11ee213d7e10ea94b2b23cecef6d5b2a&item=20#3'),"
    + "('LYCHEE', '/drinksPNGS/logo_white.png', 6.75, 't', 'premium lotus tea, fresh lychee pulps', 'https://lacaphe.square.site/?location=11ee213d7e10ea94b2b23cecef6d5b2a&item=16#4'),"
    + "('STRAWBERRY', '/drinksPNGS/logo_white.png', 6.50, 't', 'full-leaf oolong tea, homemade strawberries', 'https://lacaphe.square.site/?location=11ee213d7e10ea94b2b23cecef6d5b2a&item=13#4'),"
    + "('KUMQUAT CHIA', '/drinksPNGS/logo_white.png', 6.50, 't', 'kumquat lotus tea, chia seeds, aloe vera', 'https://lacaphe.square.site/?location=11ee213d7e10ea94b2b23cecef6d5b2a&item=8#4'),"
    + "('HOUSE MILK TEA', '/drinksPNGS/logo_white.png', 6.50, 't', 'oolong jasmine milk tea, oolong pearls', 'https://lacaphe.square.site/?location=11ee213d7e10ea94b2b23cecef6d5b2a&item=4#4'),"
    + "('GOLDEN LOTUS', '/drinksPNGS/logo_white.png', 6.50, 't', 'full-leaf oolong tea, lotus seeds, cloud cream', 'https://lacaphe.square.site/?location=11ee213d7e10ea94b2b23cecef6d5b2a&item=9#4'),"
    + "('KUMQUAT SALTED PLUM', '/drinksPNGS/logo_white.png', 6.75, 'i', 'kumquat juice blended with salted plum and mint', 'https://lacaphe.square.site/?location=11ee213d7e10ea94b2b23cecef6d5b2a&item=12#5'),"
    + "('COCOMANGO', '/drinksPNGS/logo_white.png', 6.75, 'i', 'coconut milk blended with fresh mango bits', 'https://lacaphe.square.site/?location=11ee213d7e10ea94b2b23cecef6d5b2a&item=11#5'),"
    + "('SAIGON FREEZE', '/drinksPNGS/logo_white.png', 6.50, 'i', 'Signature Saigon but blended', 'https://lacaphe.square.site/?location=11ee213d7e10ea94b2b23cecef6d5b2a&item=18#5');";

  // var insertsql = "INSERT INTO Drinks(name, image,price,type, description) VALUES('boba tea','/drinksPNGS/test1.jpg',2.50,'t', 'desc 1'),"
  //   + "('lychee Tea','/drinksPNGS/test2.jpg',3.75, 't', 'desc 2'),"
  //   + "('Test Coffee','/drinksPNGS/test3.webp',5.00, 'c', 'desc 3'),"
  //   + "('Some Signature Drink', '/drinksPNGS/test4.jpg', 5.00, 's', 'desc 4'),"
  //   + "('Ice Blended Drink', '/drinksPNGS/test5.jpg', 2.75, 'i', 'desc 5');"
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


