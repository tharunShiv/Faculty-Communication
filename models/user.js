var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

//though mongodb is schema less we use this because its a form
// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	},
	gender: {
		type: String
	},
	referralcode: {
		type: String
	},
	designation: {
        type: String
	},
	department: {
		type: String
	},
	foi: {
		type: String
	},
	phoneno: {
		type: String
	},
	mdesignation: {
		type: String
	},
	ei:{
		type: String
	}

});

var User = module.exports = mongoose.model('User', UserSchema);

//to encrypt password that is beign stored in the db
module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

//the following two mongoose methods are necessary
//to get the username for verification of authentication
module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}
//mongoose methods - findbyid , findone 
module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

//verifying identity during login
module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}
