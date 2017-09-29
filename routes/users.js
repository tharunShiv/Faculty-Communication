var express = require('express');
var router = express.Router();

// Register route
router.get('/register', function(req, res){
	res.render('register');
});

/*  //login route
router.get('/login',  function(req, res){
	res.render('login');
});  */ 

router.get('/about',  function(req, res){
	res.render('about');
});

router.get('/contactus',  function(req, res){
	res.render('contactus');
});
module.exports = router;