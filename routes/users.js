var express = require('express');
//Express validator removed
var router = express.Router();
//body parser removed
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//passport for authentication
//local strategy is the strategy
//used by the passport to authenticate the user
//local strategy is used when we are dealing with locals such as express


var User = require('../models/user');
//router.use(expressValidator());

// Register route
router.get('/register', function (req, res) {
	res.render('register');
});

router.get('/home', ensureAuthenticated, function (req, res) {
	if(req.query.search){
		//global and ignore case
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		//var query = { 'name': key };
		User.find({name: regex},function(err,docs){
		   if(err) res.json(err);
		   else {
			var noMatch;
			if(docs.length<1){
				noMatch="No Names Matched that Query, please try again";
			}   
			res.render('searchresult' , { users : docs, noMatch:noMatch});
		}});
	}
	else{
		res.render('home');
	}
});

router.get('/chat', ensureAuthenticated, function (req, res) {
	res.render('chat');
});

router.get('/mail', ensureAuthenticated, function (req, res) {
	res.render('mail');
});

router.get('/profileu', ensureAuthenticated, function (req, res) {
	res.render('profileu');
});
router.get('/profilev', ensureAuthenticated, function (req, res) {
	var user = req.user.name;
	const regex = new RegExp(escapeRegex(user), 'gi');
	console.log(user);
	User.find({name: regex},function(err,docs){
		if(err) res.json(err);
		else {
		 var noMatch;
		 if(docs.length<1){
			 noMatch="No Names Matched that Query, please try again";
		 }   
		 res.render('profilev' , { users : docs, noMatch:noMatch});
	 }});
	//res.render('profilev');
});

router.post('/update', ensureAuthenticated, function (req, res) {
	var designation = req.body.designation;
	var mdesignation = req.body.mdesignation;
	var foi = req.body.foi;
	var phoneno = req.body.phoneno;
	var department = req.body.department;
	var ei = req.body.ei;

	var newUser = new User({
		designation: designation,
		mdesignation: mdesignation,
		foi: foi,
		phoneno: phoneno,
		department: department,
		ei: ei
	});

	User.findOneAndUpdate({ username: req.user.username }, { designation: designation, mdesignation: mdesignation,ei:ei ,foi: foi, department: department, phoneno: phoneno }).then(function () {
		console.log('Data Saved Succesfully');
	    res.redirect('home');
	});
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash('error_msg', 'You are not logged in');
		res.redirect('/users/index');
	}
}

router.get('/about', function (req, res) {
	res.render('about');
});

router.get('/index', function (req, res) {
	res.render('index');
});

router.get('/contactus', function (req, res) {
	res.render('contactus');
});

router.get('/update', function (req, res) {
	res.render('update');
});
//var urlencodedParser = bodyParser.urlencoded({ extended: false });
//router.post('/register',urlencodedParser, function (req, res)

router.post('/register', function (req, res) {

	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	var referralcode = req.body.referralcode;
	var gender = req.body.gender;

	//validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
	req.checkBody('referralcode', 'Referral Code is required').notEmpty();
	req.checkBody('gender', 'Faculty/Student field is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		res.render('register', {
			errors: errors
		});
	} else {
		var newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password,
			referralcode: referralcode,
			gender: gender
		});

		User.createUser(newUser, function (err, user) {
			if (err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');
		//redirecting
		res.redirect('/users/index');
	}

});

//Authenticaating User
passport.use(new LocalStrategy(

	function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			console.log('inside passport');
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));


/*
To serialize an object means to convert its state to a byte stream so way that the byte stream can be reverted back into a copy of the object.

In a typical web application, the credentials used to authenticate a user will only be transmitted during the login request. If authentication succeeds, a session will be established and maintained via a cookie set in the user's browser.

Each subsequent request will not contain credentials, but rather the unique cookie that identifies the session. In order to support login sessions, Passport will serialize and deserialize user instances to and from the session.
*/
//IMPORTANT
passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

router.post('/index',
	passport.authenticate('local', { successRedirect: '/users/home', failureRedirect: '/users/index', failureFlash: true }),
	function (req, res) {
		//res.redirect('/');
		var user = req.user;
		res.render('home', { user: user });
	});

router.get('/logout', function (req, res) {
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/index');
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
module.exports = router;