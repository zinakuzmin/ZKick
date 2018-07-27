/*
* GET home page.
*/
 
exports.index = function(req, res){
    var message = '';
  // res.redirect('/home/dashboard');
  // res.render('dashboard',{message: message});
  res.render('dashboard',{message: message});
  // res.render('index',{message: message});

};

exports.login = function(req, res){
    var message = '';
    var originalUrl = '';
    // res.redirect('/home/dashboard');
    // res.render('dashboard',{message: message});
    res.render('login',{message: message});
    // res.render('index',{message: message});

};
