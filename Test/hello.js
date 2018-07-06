var fs = require('fs');
var mysql = require('mysql');

var shouldInitDB = true
var shouldInsertData = true


var createUsersTableSQL = "CREATE TABLE users " +
    "(ID int NOT NULL AUTO_INCREMENT,\n" +
    "    email varchar(255) NOT NULL UNIQUE,\n" +
    "    lastName varchar(255) NOT NULL,\n" +
    "    firstName varchar(255) NOT NULL,\n" +
    "    password varchar(255) NOT NULL,\n" +
    "    Age int,\n" +
    "    PRIMARY KEY (ID))";


var createProjectsTableSQL = "CREATE TABLE projects " +
    "(ID int NOT NULL AUTO_INCREMENT,\n" +
    "    ownerID int NOT NULL,\n" +
    "    name varchar(255) NOT NULL,\n" +
    "    status varchar(255) NOT NULL,\n" +
    "    startDate TIMESTAMP NOT NULL,\n" +
    "    endDate TIMESTAMP NOT NULL,\n" +
    "    amountOfMoney int NOT NULL,\n" +
    "    PRIMARY KEY (ID),\n" +
    "    FOREIGN KEY (ownerID) REFERENCES users(ID))";

var insertUser1SQL = "INSERT INTO users (email, lastname, firstname, password, age) VALUES ('user1@email.com', 'user1LastName', 'user1FirstName', 'password', 26);"
var insertUser2SQL = "INSERT INTO users (email, lastname, firstname, password, age) VALUES ('user2@email.com', 'user2LastName', 'user2FirstName', 'password', 27);"
var insertUser3SQL = "INSERT INTO users (email, lastname, firstname, password, age) VALUES ('user3@email.com', 'user3LastName', 'user3FirstName', 'password', 28);"

var insertProject1SQL = "INSERT INTO projects (ownerID, name, status, startDate, endDate, amountOfMoney) VALUES (1, 'project1', 'opened', '2014-12-01 00:00:00', '2014-12-02 00:00:00', 1000);"
var insertProject2SQL = "INSERT INTO projects (ownerID, name, status, startDate, endDate, amountOfMoney) VALUES (2, 'project2', 'closed', '2014-12-01 00:00:00', '2014-12-02 00:00:00', 1000);"
// var insertProject3SQL = "INSERT INTO projects (ownerID, name, status, startDate, endDate, amountOfMoney) VALUES (3, 'project3', 'rejected', STR_TO_DATE('12-01-2014 00:00:00','%m-%d-%Y %H:%i:%s', STR_TO_DATE('18-01-2014 00:00:00','%m-%d-%Y %H:%i:%s', 1000);"






var con = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "password",
    database: "test"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");

    if (shouldInitDB) {


        con.query("DROP TABLE IF EXISTS projects", function (err, result) {
            if (err) throw err;
            console.log("Table projects dropped");
        });

        con.query("DROP TABLE IF EXISTS users", function (err, result) {
            if (err) throw err;
            console.log("Table users dropped");
        });

        con.query(createUsersTableSQL, function (err, result) {
            if (err) throw err;
            console.log("Table users created");
        });

        con.query(createProjectsTableSQL, function (err, result) {
            if (err) throw err;
            console.log("Table projects created");
        });

    }


    if (shouldInsertData){
        con.query(insertUser1SQL, function (err, result) {
            if (err) throw err;
            console.log("created user1");
        });

        con.query(insertUser2SQL, function (err, result) {
            if (err) throw err;
            console.log("created user2");
        });

        con.query(insertProject1SQL, function (err, result) {
            if (err) throw err;
            console.log("created project1");
        });

        con.query(insertProject2SQL, function (err, result) {
            if (err) throw err;
            console.log("created project2");
        });

    }

});




