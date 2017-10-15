var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var client = require('socket.io').listen(8080).sockets;

var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');



//connecting to the db
mongoose.connect('mongodb://localhost/Faculty-Communication');
var db = mongoose.connection;

//Create routes
//chat  -- DID NOT USE THE MONGO CLIENT CONNECT

//Chat
client.on('connection', function(socket){
	
	//colection
	var col= db.collection('messages'),
	sendStatus = function(s){
	    socket.emit('status', s);
	};

	//emit all messages- with limit
	col.find().limit(100).sort({_id: 1}).toArray(function(err,res){
			if(err) throw err;
			//emit to only one person one time
			socket.emit('output', res);
	});


	//wait for input
    socket.on('input', function(data){
		console.log(data);
		var name= data.name;
		var message = data.message;
		whitespacePattern = /^\s*$/;
		
		if(whitespacePattern.test(name) || whitespacePattern.test(message)){
			sendStatus('Message is required.');
			console.log('Invalid');
		}else{
		col.insert({name: name, message: message}, function(){
			 console.log('inserted');

			 //emit latest massages to all cliet
			 client.emit('output', [data]);

			 sendStatus({
				 message: "Message Sent Successfully",
				 clear:true
			 });
		});
	}

	});
});


var routes = require('./routes/index');


var users = require('./routes/users');

var app = express();

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, 'views'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));



app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}));

var User = require('./models/user');


// Passport init
app.use(passport.initialize());
app.use(passport.session());


app.use(expressValidator({
	errorFormatter: function (param, msg, value) {
		var namespace = param.split('.')
			, root = namespace.shift()
			, formParam = root;

		while (namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param: formParam,
			msg: msg,
			value: value
		};
	}
}));


//for the flash messages
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});



//setting up the view engine
//try commenting
/*
app.set('view engine' , 'ejs');
*/
//try
// View Engine
//try commenting 
/*
app.set('views', path.join(__dirname, 'views'));
*/

//end try

app.use('/', routes);
app.use('/users', users);
//setting up the body parser
// BodyParser Middleware  - just a module - just a set up code- configurations


// Set Static Folder


/*
EXPRESS SESSION- necessary for flash message
*/


// Express Validator - just from the gitHub






// Set Port with port number
//this line is commented to test  ->
app.set('port', (process.env.PORT || 3000));
console.log('Server started');
//just telling the user that server has started


app.listen(app.get('port'), function () {

	console.log('Server started on port ' + app.get('port'));
});


