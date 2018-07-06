var mysql = require('mysql');

var values = [
    ['user1@email.com', 'user1LastName', 'user1FirstName', 'password', 26]
];

var email = "user1@email.com"


var dbConnection = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "password",
    database: "zkick"
});

dbConnection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

var insertUserSQL = "INSERT INTO users (email, lastname, firstname, password, age) VALUES ?"
var getUserByEmailSQL = "SELECT * from users where email = ? "
var getProjectByStatusSQL = "SELECT * from projects where status = ?"
var getProjectByOwnerSQL = "SELECT * from projects where ownerID = ?"
var getProjectByIDSQL = "SELECT * from projects where ID = ?"




function getUserDetails(email) {
    dbConnection.query(getUserByEmailSQL, email, function (err, result, fields) {
        if (err) throw err;
        console.log("User found " + result[0].email);
        return result[0].password
    });
}





// dbConnection.query(insertUserSQL, [values], function (err, result) {
//     if (err) throw err;
//     console.log("Number of records inserted: " + result.affectedRows);
// });