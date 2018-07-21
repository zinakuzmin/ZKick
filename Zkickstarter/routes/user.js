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


//-----------------------------------------------get dashboard ---------------


exports.getdashboard = function(req, res, next) {

    var user = req.session.user,
        userId = req.session.userId;
    console.log('ddd=' + userId);
    if (userId == null) {
        res.redirect("/login");
        return;
    }

    res.render('dashboard.ejs');

};



//-----------------------------------------------get image ---------------


exports.getprojectimage = function(req, res, next) {

    var user = req.session.user,
        userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }

    var projectID = 28;

    var getProjectImagesSQL = "SELECT * from project_images where projectID = ?";

    db.query(getProjectImagesSQL, [projectID], function (err, result) {
        if (err) throw err;
        console.log("Project ID " + projectID + " images" + JSON.stringify(result))
        res.send(result);
        });

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

   //How many supporters and how many money donated for specific project - need to run in loop for each active project
   var getProjectStatsSQL = "select count(distinct(supporterID)) as num_of_supporters from supporters where projectID = ?";
   // var getProjectStatsSQL = "select count(distinct(supporterID)) as num_of_supporters, sum(moneyAmount) as already_donated_money from zkick.supporters where projectID = ?";

   var projects = [];
    // res.render('dashboard.ejs', {user:'aaa'});
   // projects = getAllProjectsID();
   // console.log(projects);

   // db.query(getProjectsSQL, function(err, results){
   //     if (err) throw err;
   //     projects = results;
   //     console.log(JSON.stringify(projects));
   //
   //
   //
   //     for (var key in projects) {
   //         if (projects.hasOwnProperty(key)) {
   //             console.log("Project : " + key + " " + projects[key].id);
   //
   //              getProject(projects[key].id);
   //              getProjectSupporters(projects[key].id);
   //              getProjectImages(projects[key].id);
   //
   //
   //         }
   //     }
   //     // res.render('dashboard.ejs', {user:results});
   //     // db.query(getProjectsSQL, function(err, projects){
   //     //     if (err) throw err;
   //     //
   //     // });
   // });

    console.log(JSON.stringify(projects));


    var callback = function(projects) {
        console.log("from callback " + JSON.stringify(projects));
        res.send(projects);
        // if (responceID == 0){
        //     console.log("from callback res 0" + JSON.stringify(projects));
        //     getProjectImages(projects)
        // }
        //
        // if (responceID == 1){
        //     console.log("from callback res 1" + JSON.stringify(projects));
        //     getProjectSupporters(projects)
        // }
        //
        //
        // if (responceID == 2){
        //     console.log("from callback res 2" + JSON.stringify(projects));
        //     res.send(projects);
        // }

    }

    var getAllProjectsSQL = "select projects.* , s.num_of_supporters, s.donated from projects LEFT OUTER JOIN\n" +
        " (select projectID, count(distinct(supporterID)) \n" +
        " as num_of_supporters, sum(moneyAmount) as donated from zkick.supporters group by projectID)\n" +
        " as s on projects.ID = s.projectID;"

    // db.query("SELECT id FROM projects", function(err, projects, fields) {
    db.query(getAllProjectsSQL, function(err, projects, fields) {
        var pending = projects.length;
        var allProjects = projects;

        for (prID in projects) {

            db.query("SELECT * FROM project_images where projectID = ?" , [projects[prID].ID], function(err, pr, fields) {
                if (err) throw err;
                // blog.tags = tags;
                console.log("From query project images " + projects[prID].ID + " "+ JSON.stringify(pr));
                allProjects[prID]['images'] = pr;
                if (0 === --pending) {
                    callback(allProjects);
                }
            });
        }
    });



    var getProjectSupporters = function(projects){
        var getProjectSupportersSQL = "select count(distinct(supporterID)) as num_of_supporters from supporters where projectID = ?";
        var pending = projects.length;
        var allProjects = [];

        for (project in projects){
            db.query(getProjectSupportersSQL, [projects[project].ID], function (err, result) {
                if (err) throw err;
                console.log("Project ID " + projects[project].ID + " supporters" + JSON.stringify(result))
                projects[project]['num_of_supporters'] = result.num_of_supporters;
                if (0 === --pending) {
                    callback(projects,2);
                }
            });
        }

    }

    var getProjectImages = function(projects){
        var getProjectImagesSQL = "SELECT * from project_images where projectID = ?";

        var pending = projects.length;
        var allProjects = [];
        var project = 0;
        for (project in projects){
            db.query(getProjectImagesSQL, [projects[project].ID], function (err, result) {
                if (err) throw err;
                console.log("Project ID " + projects[project].ID + " images" + JSON.stringify(result))
                projects[project]['images'] = result;
                if (0 === --pending) {
                    callback(projects, 1);
                }
            });
        }


    }





};


function getAllProjectsID(){
    var getAllProjectsSQL = "select id from projects";
    db.query(getAllProjectsSQL,  function (err, result) {
        if (err) throw err;
        console.log("Projects ID " + result)
        return result;
    });
}

function getProject(projectID){
    var getProjectSQL = "select * from projects where id = ?";
    db.query(getProjectSQL, [projectID], function (err, result) {
        if (err) throw err;
        console.log("Project ID " + projectID + " details" + result)
        return result;
    });
}

// function getProjectSupporters(projects){
//     var getProjectSupportersSQL = "select count(distinct(supporterID)) as num_of_supporters from supporters where projectID = ?";
//     var pending = projects.length;
//     var allProjects = [];
//
//     for (project in projects){
//         db.query(getProjectSupportersSQL, [projects[project].ID], function (err, result) {
//             if (err) throw err;
//             console.log("Project ID " + projects[project].ID + " supporters" + result)
//             projects[project]['num_of_supporters'] = result.num_of_supporters;
//             if (0 === --pending) {
//                 callback(projects,2);
//             }
//         });
//     }
//
// }

// function getProjectImages(projects){
//     var getProjectImagesSQL = "SELECT * from project_images where projectID = ?";
//
//     var pending = projects.length;
//     var allProjects = [];
//
//     for (project in projects){
//         db.query(getProjectImagesSQL, [projects[project].ID], function (err, result) {
//             if (err) throw err;
//             console.log("Project ID " + projects[project].ID + " images" + result)
//             projects[project]['images'] = result;
//             if (0 === --pending) {
//                 callback(projects, 1);
//             }
//         });
//     }
//
//
// }


//------------------------------------logout functionality----------------------------------------------
exports.logout=function(req,res){
   req.session.destroy(function(err) {
      res.redirect("/login");
   })
};


//---------------------------Test ------------

exports.test=function(req,res){
    // req.session.destroy(function(err) {
    //     res.redirect("/login");
    // })
    console.log("Im in test");
    res.send({data:'zina'});
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

        var callback = function(files, projectID){
            for (var i = 0; i < files.length; i++){
                var file = files[i];
                console.log("Filename " + file.name)
                var newFileName = Date.now() + '-' + file.name
                var is_project_cover = 0;
                if (i == 0)
                    is_project_cover = 1;
                var insert_img = "INSERT INTO project_images (projectID,img_name,is_project_cover) VALUES ('" + projectID + "','" + newFileName + "','" + is_project_cover + "')";
                console.log(insert_img);


                if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
                    file.mv('public/images/uploads/'+ newFileName, function(err) {
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
        }



        var createProjectSQL = "INSERT INTO projects (ownerID, name, status, startDate, endDate, requestedAmountOfMoney, donatedAmountOfMoney , category, video_link, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        var query = db.query(createProjectSQL, [ownerID, project_name, status, start_date, end_date, money_amount, donatedAmountOfMoney, category, video_link, location] , function(err, result) {
            if (err) throw err;
            callback(files, result.insertId);
        });


    } else {
        res.render('createProject.ejs', {message:message});
    }

    res.redirect('/home/dashboard');

};