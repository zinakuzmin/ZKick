var bcrypt = require('bcrypt');

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
                if (err)
                    message = "User registration has failed, sorry :(";
                else
                    message = "Your account has been created.";
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

    if(req.method == "POST"){
        var post  = req.body;
        var name= post.user_name;
        var pass= post.password;

        var sql="SELECT * FROM users WHERE username='" + name +"'";
        db.query(sql, function(err, results){
            if (err) throw err;
            if(results.length){
                console.log("user found " + results[0].username)
                bcrypt.compare(pass, results[0].password, function(err, result) {
                    if (err) throw err;
                    if (result){
                        req.session.userId = results[0].ID;
                        req.session.user = results[0];


                        var sessionExpiration = new Date();
                        sessionExpiration.setHours( sessionExpiration.getHours() + 1 );
                        req.session.cookie.expires = sessionExpiration;
                        console.log(results[0].ID);
                        res.redirect('/');
                    }
                    else{
                        message = 'Wrong Credentials'; //Password (Change me).';
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
    res.redirect('/dashboard');

};


//-----------------------------------------------dashboard page functionality----------------------------------------------

exports.dashboard = function(req, res, next){
    var projects = [];
    console.log(JSON.stringify(projects));

    var callback = function(projects) {
        console.log("from callback " + JSON.stringify(projects));
        res.send(projects);
    }

    var getAllProjectsSQL = "select projects.* , s.num_of_supporters, s.donated from projects LEFT OUTER JOIN\n" +
        " (select projectID, count(distinct(supporterID)) \n" +
        " as num_of_supporters, sum(moneyAmount) as donated from zkick.supporters group by projectID)\n" +
        " as s on projects.ID = s.projectID;"


    db.query(getAllProjectsSQL, function(err, projects, fields) {
        var pending = projects.length;
        var allProjects = projects;

        var i = 0
        for (prID in projects) {
            db.query("SELECT * FROM project_images where projectID = ?" , [projects[prID].ID], function(err, pr, fields) {
                if (err) throw err;

                console.log("From query project images " + projects[prID].ID + " "+ JSON.stringify(pr));
                if(pr != undefined && pr.length > 0 ){

                    var index = allProjects.map(function(e) { return e.ID; }).indexOf(pr[0].projectID);
                    if (index != -1)
                        allProjects[index]['images'] = pr;
                }
                if (0 === --pending) {
                    callback(allProjects);
                }
            });
        }
    });

};



//------------------------------------logout functionality----------------------------------------------
exports.logout=function(req,res){
    req.session.destroy(function(err) {
        res.redirect("/");
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
        res.render('profile.ejs',{data:result[0]});
    });
};


//--------------------------------render project details --------------------------------
exports.loadProject = function(req, res, next){
    var projectID = req.query.id;
    var getProjectsSQL = "select projects.* , s.num_of_supporters, s.donated from projects LEFT OUTER JOIN\n" +
        " (select projectID, count(distinct(supporterID)) \n" +
        " as num_of_supporters, sum(moneyAmount) as donated from zkick.supporters group by projectID)\n" +
        " as s on projects.ID = s.projectID where id = ?"
    var getImagesSQL = "select * from project_images where projectID = ?"

    var callback = function(project){
        console.log("from callback " + JSON.stringify(project));
        res.render("projectDetails.ejs", {project:project });
    }

    db.query(getProjectsSQL, [projectID], function(err, result){
        if (err) throw err;
        var pending = result.length;
        console.log("Fetched project " + projectID + " " + JSON.stringify(result[0]));
        // res.render("projectDetails.ejs", {project:result[0] });
        db.query(getImagesSQL, [projectID], function(err, images, fields) {
            if (err) throw err;
            console.log("Fetched project images" + projectID + " " + JSON.stringify(images));
            result[0]['images'] = images;
            if (0 === --pending) {
                callback(result[0]);
            }
        });
    });
};




//---------------------------------Get active projects -------------------
exports.getActiveProjectsStats = function(req, res){

  var sql = "select count(*) from projects where status = 'Active'";
    db.query(sql, function(err, result){
        // res.send({active_projects_number : result[0]['count(*)']});
        res.send({active_projects: result[0]['count(*)']});
    });
};



//---------------------------------Get user details -------------------
exports.getUserDetails = function(req, res){

    var userId = req.session.userId;
    if(userId == null){
        res.send({data: 'undefined'})
        return;
    }


    var sql = "select id, is_admin, firstName, lastName from users where id = ?";
    db.query(sql, [userId], function(err, result){
        res.send({data: result[0]});
    });
};



//---------------------------------Get project images -------------------
exports.getProjectImages = function(req, res){
    var projectID = req.query.projectID;

    var sql = "select * from project_images where projectID = ?";
    db.query(sql, [projectID], function(err, result){
        res.send({data: result});
    });
};




//---------------------------------Get project supporters -------------------
exports.getProjectSupporters = function(req, res){
    var projectID = req.query.projectID;

    var sql = "select ID, username, lastName, firstName from users where id in (select distinct(supporterID) from zkick.supporters where projectID = ?)";
    db.query(sql, [projectID], function(err, result){
        if (err) throw err;
        res.send({data: result});
    });
};

//---------------------------------Get closed projects -------------------
exports.getClosedProjectsStats = function(req, res){
    var sql = "select count(*) from projects where status = 'Closed'";
    db.query(sql, function(err, result){
        if (err) throw err;
        res.send({closed_projects: result[0]['count(*)']});
    });
};


//---------------------------------Get cancelled projects -------------------
exports.getCancelledProjectsStats = function(req, res){
    var sql = "select count(*) from projects where status = 'Cancelled'";
    db.query(sql, function(err, result){
        if (err) throw err;
        res.send({cancelled_projects: result[0]['count(*)']});
    });
};



//---------------------------------Render new project creation page -------------------
exports.create = function(req, res){

    var userId = req.session.userId;
    var url = res.originalUrl;
    if(userId == null){
        res.redirect("/login");
        return;
    }

    var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";
    db.query(sql, function(err, result){
        res.render('createProject.ejs',{message: ""});
    });
};



//---------------------------------Render new project creation page -------------------
exports.getProjectEditor = function(req, res){

    var userId = req.session.userId;
    if(userId == null){
        res.redirect("/login");
        return;
    }

    var projectID = req.query.projectID;


    var getProjectsSQL = "select projects.* , s.num_of_supporters, s.donated from projects LEFT OUTER JOIN\n" +
        " (select projectID, count(distinct(supporterID)) \n" +
        " as num_of_supporters, sum(moneyAmount) as donated from zkick.supporters group by projectID)\n" +
        " as s on projects.ID = s.projectID where id = ?"

    var getImagesSQL = "select * from project_images where projectID = ?"



    var callback = function(project){
        console.log("from callback " + JSON.stringify(project));
        res.render('projectEditor.ejs',{project:project });
    }

    db.query(getProjectsSQL, [projectID], function(err, result){
        if (err) throw err;
        var pending = result.length;
        console.log("Fetched project " + projectID + " " + JSON.stringify(result[0]));
        db.query(getImagesSQL, [projectID], function(err, images, fields) {
            if (err) throw err;
            console.log("Fetched project images" + projectID + " " + JSON.stringify(images));
            result[0]['images'] = images;
            if (0 === --pending) {
                callback(result[0]);
            }
        });
    });
};


//---------------------------------Cancel  project----------------------------------
exports.cancelProject=function(req,res) {
    var userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }


    message = '';
    if(req.method == "POST") {
        var post = req.body;
        var projectID = post.projectID;

        var sql = "update projects set status = 'Cancelled' where id = ?";
        db.query(sql, [projectID], function(err, result) {
            if (err) throw err;
            res.redirect("/");
        });
    }
}



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
        var description = post.project_description;
        var start_date= post.project_start_date;
        var end_date= post.project_end_date;
        var money_amount= post.money_amount;
        var video_link= formatUrl(post.video_link);
        var demo_link= post.demo_link;
        console.log("old link " + post.video_link);
        console.log("new link " + video_link);
        var location= post.location;
        var category= post.category;

        var ownerID = req.session.userId;
        var donatedAmountOfMoney = 0;
        var status = "Active";

        if (demo_link == "")
            demo_link = null;

        var shmulik = req.files;
        var files = [];
        if (Array.isArray(shmulik["files[]"])){
            files = shmulik["files[]"];
        }

        else{
            files.push(shmulik["files[]"]);
        }


        if (files.length < 1)
            return res.status(400).send('No files were uploaded.');



        var callback = function(files, projectID){
            for (var i = 0; i < files.length; i++){
                var file = files[i];
                console.log("Filename " + file.name.replace(/\s/g,''))
                var newFileName = Date.now() + '-' + file.name.replace(/\s/g,'')
                var is_project_cover = 0;
                if (i == 0)
                    is_project_cover = 1;
                var insert_img = "INSERT INTO project_images (projectID,img_name,is_project_cover) VALUES ('" + projectID + "','" + "/" + "images/uploads/" + newFileName + "','" + is_project_cover + "')";
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
                    });
                } else {
                    console.log("Incorrect file type " + file.mimetype)
                    message = "This format is not allowed , please upload file with '.png','.gif','.jpg'";
                    res.render('index.ejs',{message: message});
                }
            }
        }



        var createProjectSQL = "INSERT INTO projects (ownerID, name, description, status, startDate, endDate, requestedAmountOfMoney, donatedAmountOfMoney , category, video_link, demo_link, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        var query = db.query(createProjectSQL, [ownerID, project_name, description, status, start_date, end_date, money_amount, donatedAmountOfMoney, category, video_link, demo_link, location] , function(err, result) {
            if (err) throw err;
            callback(files, result.insertId);
        });


    } else {
        res.render('createProject.ejs', {message:message});
    }

    res.redirect('/');




    function formatUrl(url) {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = url.match(regExp);

        if (match && match[2].length == 11) {
            return "https://www.youtube.com/embed/" + match[2] + "?autoplay=0";
        } else {
            return 'error';
        }
    }

};



//---------------------------------------------register donation------------------------------------------------------
exports.registerDonations = function(req, res){
    //Check if logged in
    var userId = req.session.userId;
    if(userId == null){
        res.redirect("/login");
        return;
    }

    message = '';
    if(req.method == "POST"){
        var post  = req.body;
        var projectID= post.projectID;
        var amountDonated= post.amount;
        var userID= req.session.userId;


        var sql = "INSERT INTO supporters (projectID, supporterID, moneyAmount) VALUES (?,?,?)";


        db.query(sql, [projectID, userID, amountDonated] , function(err, result) {
            if (err) throw err;
            res.redirect("/loadProject?id=" + projectID);
        });


    } else {
        res.render('dashboard');
    }
};




//---------------------------------------------delete project------------------------------------------------------
exports.deleteProject = function(req, res) {
    //Check if logged in
    var userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }

    message = '';
    if (req.method == "POST") {
        var post = req.body;
        var projectID = post.projectID;
        var lname = req.session.userID;

        var sql = "delete from projects where id = ?";
        console.log(sql);

        db.query(sql, [projectID], function (err, result) {
            if (err) throw err;
            res.redirect("/")
        });

    }
    ;



}





//---------------------------------Update project----------------------------------
exports.updateProject=function(req,res){
    var userId = req.session.userId;
    if(userId == null){
        res.redirect("/login");
        return;
    }



    //=================
    message = '';
    if(req.method == "POST") {
        var post = req.body;
        var projectID = post.projectID;
        var project_name = post.project_name;
        var description = post.project_description;
        var start_date= post.project_start_date;
        var end_date= post.project_end_date;
        var money_amount= post.money_amount;
        var video_link= formatUrl(post.video_link);
        var demo_link= post.demo_link;
        console.log("Project id " + projectID);
        console.log("old link "  + post.video_link);
        console.log("new link " + video_link);
        var location= post.location;
        var category= post.category;

        var ownerID = req.session.userId;
        var donatedAmountOfMoney = 0;
        var status = post.status;


        if (demo_link == "")
            demo_link = null;

        var shmulik = req.files;
        var files = [];
        if (shmulik != null && JSON.stringify(shmulik) !== '{}'){
            if (Array.isArray(shmulik["files[]"])){
                files = shmulik["files[]"];
            }
            else{
                files.push(shmulik["files[]"]);
            }
        }




        // if (files.length < 1)
        //     return res.status(400).send('No files were uploaded.');


        var callback = function(files){
            for (var i = 0; i < files.length; i++){
                var file = files[i];
                console.log("Filename " + file.name.replace(/\s/g,''))
                var newFileName = Date.now() + '-' + file.name.replace(/\s/g,'')
                var is_project_cover = 0;
                if (i == 0)
                    is_project_cover = 1;
                var insert_img = "INSERT INTO project_images (projectID,img_name,is_project_cover) VALUES ('" + projectID + "','" + "/" + "images/uploads/" + newFileName + "','" + is_project_cover + "')";
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



        var createProjectSQL = "Update projects set ownerID = ?, name = ?, description = ?, status = ?, startDate = ?, endDate = ?, requestedAmountOfMoney = ?, donatedAmountOfMoney = ? , category = ?, video_link = ?, demo_link = ?, location = ? where id = ?";
        var query = db.query(createProjectSQL, [ownerID, project_name, description, status, start_date, end_date, money_amount, donatedAmountOfMoney, category, video_link, demo_link, location, projectID] , function(err, result) {
            if (err) throw err;
            callback(files);
        });


    } else {
        res.render('createProject.ejs', {message:message});
    }

    res.redirect('/');




    function formatUrl(url) {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = url.match(regExp);

        if (match && match[2].length == 11) {
            return "https://www.youtube.com/embed/" + match[2] + "?autoplay=0";
        } else {
            return 'error';
        }
    }

};
