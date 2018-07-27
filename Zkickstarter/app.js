/**
* Module dependencies.
*/
// var express = require('express')
//   , routes = require('./routes')
//   , user = require('./routes/user')
//   , http = require('http')
//   , path = require('path');

var express = require('express')
    , routes = require('./routes')
    , user = require('./routes/user')
    , http = require('http')
    , path = require('path')
    , busboy = require("then-busboy")
    , fileUpload = require('express-fileupload')
    , app = express()
    , mysql      = require('mysql')
    , bodyParser=require("body-parser")
    , bcrypt = require('bcrypt');


//var methodOverride = require('method-override');
var session = require('express-session');
var app = express();
var mysql      = require('mysql');
var bodyParser=require("body-parser");


var connection = mysql.createConnection({
              host     : 'localhost',
              user     : 'admin',
              password : 'password',
              database : 'zkick'
            });
 
connection.connect();
 
global.db = connection;
 
// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('data', __dirname + '/data');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, 'data')));
// var publicDir = require('path').join(__dirname,'/public');
// app.use(express.static(publicDir));
app.use(fileUpload());
app.use(session({
              secret: 'keyboard cat',
              resave: false,
              saveUninitialized: true,
              cookie: { maxAge: 60000 }
            }))
 
// development only


app.get('/', routes.index);//call for main index page
// app.get('/', user.getdashboard);//call for main index page
app.get('/signup', user.signup);//call for signup page
app.post('/signup', user.signup);//call for signup post 
app.get('/login', routes.login);//call for login page
// app.get('/login', routes.index);//call for login page
app.post('/login', user.login);//call for login post
app.get('/dashboard', user.getdashboard);//call for dashboard page after login
app.get('/projects', user.dashboard);//call for dashboard page after login
// app.get('/home/projects', user.dashboard);//call for dashboard page after login
app.get('/getActiveProjectsStats', user.getActiveProjectsStats);//call for dashboard page after login
app.get('/getClosedProjectsStats', user.getClosedProjectsStats);//call for dashboard page after login
app.get('/getCancelledProjectsStats', user.getCancelledProjectsStats);//call for dashboard page after login
app.get('/loadProject', user.loadProject);//call for dashboard page after login
// app.get('/home/projectDetails', user.projectDetails);//call for dashboard page after login
app.get('/logout', user.logout);//call for logout
app.get('/profile',user.profile);//to render users profile
app.get('/createProject',user.create);//to render create project page
app.get('/getProjectEditor',user.getProjectEditor);//to render create project page
app.get('/getUserDetails',user.getUserDetails);//to render create project page
// app.get('/home/selectImages',user.selectimages);//to render upload images project page
app.post('/createProject',user.createproject);//to create project
app.post('/registerDonations',user.registerDonations);
app.post('/deleteProject',user.deleteProject);
app.post('/cancelProject',user.cancelProject);
app.post('/updateProject',user.updateProject);
// app.post('/home/uploadImages',user.uploadimages);//to upload images to project
app.get('/item.tpl.html', function(req, res){
    res.sendfile('C:\\oldLaptop2018\\afeka\\Internet\\Kickstarter\\ZKick\\Zkickstarter\\views\\item.tpl.html');
});
app.get('/home/twitter.tpl.html', function(req, res){
    res.sendfile('C:\\oldLaptop2018\\afeka\\Internet\\Kickstarter\\ZKick\\Zkickstarter\\views\\twitter.tpl.html');
});
//Middleware
app.listen(3000)
