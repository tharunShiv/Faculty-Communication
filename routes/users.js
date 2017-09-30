var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;




var User = require('../models/user');

// Register route
router.get('/register', function(req, res){
	res.render('register');
});

router.get('/home', ensureAuthenticated, function(req, res){
	res.render('home');
});

router.get('/chat',ensureAuthenticated, function(req, res){
	res.render('chat');
});

router.get('/mail',ensureAuthenticated, function(req, res){
	res.render('mail');
});

router.get('/profileu',ensureAuthenticated, function(req, res){
	res.render('profileu');
});
router.get('/profilev',ensureAuthenticated, function(req, res){
	res.render('profilev');
});


function ensureAuthenticated(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}else{
		req.flash('error_msg','You are not logged in');
		res.redirect('/users/index');
	}
}
/*  //login route
router.get('/login',  function(req, res){
	res.render('login');
});  */ 

router.get('/about',  function(req, res){
	res.render('about');
});

router.get('/index',  function(req, res){
	res.render('index');
});

router.get('/contactus',  function(req, res){
	res.render('contactus');
});


router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
    
	//validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();
	
	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password
		});
	
	    User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');
         //redirecting
		res.redirect('/users/index');
	}
	
});

passport.use(new LocalStrategy(
	function(username, password, done) {
	 User.getUserByUsername(username, function(err, user){
		 if(err) throw err;
		 if(!user){
			 return done(null, false, {message: 'Unknown User'});
		 }
  
		 User.comparePassword(password, user.password, function(err, isMatch){
			 if(err) throw err;
			 if(isMatch){
				 return done(null, user);
			 } else {
				 return done(null, false, {message: 'Invalid password'});
			 }
		 });
	 });
	}));

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	  });
	  
	  passport.deserializeUser(function(id, done) {
		User.getUserById(id, function(err, user) {
		  done(err, user);
		});
	  });
  



router.post('/index',
passport.authenticate('local', {successRedirect:'/users/home', failureRedirect:'/users/index',failureFlash: true}),
function(req, res) {
  res.redirect('/');
});





router.get('/logout', function(req, res){
  req.logout();

  req.flash('success_msg', 'You are logged out');

  res.redirect('/users/index');
});

module.exports = router;