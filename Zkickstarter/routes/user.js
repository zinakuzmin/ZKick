var bcrypt = require('bcrypt');
// let multer  = require('multer');
// let express = require('express');
// let app     = express();
// let upload  = multer({ storage: multer.memoryStorage() });

// var Storage = multer.diskStorage({
//     destination: function (req, file, callback) {
//         callback(null, "./data/uploads");
//     },
//     filename: function (req, file, callback) {
//         callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
//     }
// });
//
// var upload = multer({ storage: Storage }).array("imgUploader", 3); //Field name and max count
//---------------------------------------------signup page call------------------------------------------------------
exports.signup = function(req, res){
   message = '';
   if(req.method == "POST"){
      var post  = req.body;
      var name= post.user_name;
      var pass= post.password;
      var fname= post.first_name;
      var lname= post.last_name;
      var age= post.age;
      var saltRounds = 10;

       bcrypt.hash(pass, saltRounds, function(err, hash) {
           if (err) throw err;
           console.log("Encrypted password "+ hash)
           var sql = "INSERT INTO users (username, lastname, firstname, password, age) VALUES ('" + name + "', '" + lname + "','" + fname + "','" + hash + "','" + age + "')";

           var query = db.query(sql, function(err, result) {

               message = "Succesfully! Your account has been created.";
               res.render('signup.ejs',{message: message});
           });
       });


   } else {
      res.render('signup');
   }
};

//-----------------------------------------------login page call------------------------------------------------------
exports.login = function(req, res){
   var message = '';
   var sess = req.session;

   if(req.method == "POST"){
      var post  = req.body;
      var name= post.user_name;
      var pass= post.password;

      var sql="SELECT * FROM users WHERE username='" + name +"'";
      // var sql="SELECT id, firstname, lastname, username FROM `users` WHERE `username`='"+name+"' and password = '"+pass+"'";
      db.query(sql, function(err, results){
         if (err) throw err;
         if(results.length){
            console.log("user found " + results[0].username)
             bcrypt.compare(pass, results[0].password, function(err, result) {
                 if (err) throw err;
                 if (result){
                     req.session.userId = results[0].ID;
                     req.session.user = results[0];
                     console.log(results[0].ID);
                     res.redirect('/home/dashboard');
                 }
                 else{
                     message = 'Wrong Password (Change me).';
                     res.render('index.ejs',{message: message});
                 }
             });

         }
         else{
            message = 'Wrong Credentials.';
            res.render('index.ejs',{message: message});
         }

      });
   } else {
      res.render('index.ejs',{message: message});
   }

};
//-----------------------------------------------dashboard page functionality----------------------------------------------

exports.dashboard = function(req, res, next){

   var user =  req.session.user,
   userId = req.session.userId;
   console.log('ddd='+userId);
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var getUserSQL="SELECT * FROM `users` WHERE `id`='"+userId+"'";
   var getProjectsSQL = "SELECT * from projects";
   var getProjectStatsSQL = "select count(distinct(supporterID)) as num_of_supporters, sum(moneyAmount) as already_donated_money from zkick.supporters where projectID = 1";

   db.query(getUserSQL, function(err, results){
       if (err) throw err;
        res.render('dashboard.ejs', {user:results});
       db.query(getProjectsSQL, function(err, projects){
           if (err) throw err;

       });
   });
};
//------------------------------------logout functionality----------------------------------------------
exports.logout=function(req,res){
   req.session.destroy(function(err) {
      res.redirect("/login");
   })
};
//--------------------------------render user details after login--------------------------------
exports.profile = function(req, res){

   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";
   db.query(sql, function(err, result){
      res.render('profile.ejs',{data:result});
   });
};
//---------------------------------edit users details after login----------------------------------
exports.editprofile=function(req,res){
   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";
   db.query(sql, function(err, results){
      res.render('edit_profile.ejs',{data:results});
   });
};

//---------------------------------Render new project creation page -------------------
exports.create = function(req, res){

    var userId = req.session.userId;
    if(userId == null){
        res.redirect("/login");
        return;
    }

    var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";
    db.query(sql, function(err, result){
        res.render('createProject.ejs',{message: ""});
    });
};

//---------------------------------Render upload images to project page -------------------
exports.selectimages = function(req, res){

    var userId = req.session.userId;
    if(userId == null){
        res.redirect("/login");
        return;
    }
    var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";
    db.query(sql, function(err, result){
        res.render('selectImages.ejs',{message: ""});
    });
};


//---------------------------------Render upload images to project page -------------------
exports.uploadimages = function(req, res){

    var userId = req.session.userId;
    if(userId == null){
        res.redirect("/login");
        return;
    }

    if(req.method == "POST") {
        var post = req.body;
        //var project_id = post.session.project_id;

    }

    var sql = "INSERT INTO project_images (project_id, image_name, is_project_cover) VALUES (?,?,?)"

    var filename1 = req.file.filename
    var filename2 = req.files.filename
    var filename = req.files[0].filename

    upload(req, res, function (err) {
            if (err) {
                throw err;
                //return res.end("Something went wrong!");
            }
            return res.end("File uploaded sucessfully!.");
        });

    var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";
    db.query(sql, function(err, result){
        res.render('dashboard.ejs',{message: ""});
    });
};


//---------------------------------Create new project----------------------------------
exports.createproject=function(req,res){
    var userId = req.session.userId;
    if(userId == null){
        res.redirect("/login");
        return;
    }



    //=================
    message = '';
    if(req.method == "POST") {
        var post = req.body;
        var project_name = post.project_name;
        var desciption = post.project_description;
        var start_date= post.project_start_date;
        var end_date= post.project_end_date;
        var money_amount= post.money_amount;
        var video_link= post.video_link;
        var location= post.location;
        var category= post.category;

        var ownerID = req.session.userId;
        var donatedAmountOfMoney = 0;
        var status = "opened";

        if (!req.files)
            return res.status(400).send('No files were uploaded.');

        var shmulik = req.files;
        var files = shmulik["uploaded_images[]"];


        var created_project_id = 1;

        var createProjectSQL = "INSERT INTO projects (ownerID, name, status, startDate, endDate, requestedAmountOfMoney, donatedAmountOfMoney , category, video_link, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        var query = db.query(createProjectSQL, [ownerID, project_name, status, start_date, end_date, money_amount, donatedAmountOfMoney, category, video_link, location] , function(err, result) {
            if (err) throw err;
            created_project_id = result.insertId;
            //message = "Your project has been successfully created.";
            //res.render('selectImages.ejs',{message: result.insertId});
            // res.render('dashboard.ejs',{message: message});
        });

        var insertresult = 0;
        for (var i = 0; i < files.length; i++){
            var file = files[i];
            console.log("Filename " + file.name)
            var newFileName = Date.now() + '-' + file.name
            var is_project_cover = 0;
            if (i == 0)
                is_project_cover = 1;
            var insert_img = "INSERT INTO project_images (projectID,img_name,is_project_cover) VALUES ('" + created_project_id + "','" + newFileName + "','" + is_project_cover + "')";
            console.log(insert_img);


            if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
                file.mv('data/uploads/'+ newFileName, function(err) {
                    if (err) {
                        return res.status(500).send(err);
                    }
                });
                console.log("Filename before insert " + newFileName)
                var query = db.query(insert_img, function(err, result) {
                    if (err) throw err;
                    insertresult = result;
                    // res.redirect('profile/'+result.insertId);
                });
            } else {
                console.log("Incorrect file type " + file.mimetype)
                message = "This format is not allowed , please upload file with '.png','.gif','.jpg'";
                res.render('index.ejs',{message: message});
            }
        }


    } else {
        res.render('createProject.ejs', {message:message});
    }
    res.render('dashboard.ejs',{message: message});


//select count(distinct(supporterID)) as num_of_supporters, sum(moneyAmount) as already_donated_money from zkick.supporters where projectID = 1;

};