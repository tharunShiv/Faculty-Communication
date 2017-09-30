var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/Faculty-Communication');
var db = mongoose.connection;



//chat start /*

/*

var client = require('socket.io').listen(3000).sockets;
mongoose.connect('mongodb://localhost/Faculty-Communication',function(err,db){
  if(err) throw err;
    
  //This statement was just added to test 
  var db = mongoose.connection;

    client.on('connection',function(socket){
       //var col= db.collection('messages');

       sendStatus = function(s){
         //we are passing string here
         socket.emit('status', s);
       }

      //wait for input
      socket.on('input',function(data){
        var name = data.name,
          message = data.message,
          whitespacePattern = /^\s*$/;

          if(whitespacePattern.test(name) || whitespacePattern.test(message)){
            sendStatus('Name and message is required.');
          }else{
            col.insert({name: name , message:message} , function(){
              console.log('inserted');
            });
          }
      });
});
});

//chat ends
//Chat modules starts here
//var mongo = require('mongodb').MongoClient,


//chat require modules end here - 

//mongoose.connect('mongodb://localhost/Faculty-Communication');

//var db = mongoose.connection;
*/




//Create routes
var routes = require('./routes/index');
var users = require('./routes/users');

//init app
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware  - just a module - just a set up code- configurations
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator - just from the gitHub
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));
  
  // Connect Flash
  app.use(flash());

  // Global Vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
  });

//middleware for routes 
  app.use('/', routes);
  app.use('/users', users);
  

  // Set Port with port number
   //this line is commented to test  ->
    app.set('port', (process.env.PORT || 3000));
  console.log('Server started');
//just telling the user that server has started

//this whole pragraph has been commented
   app.listen(app.get('port'), function(){
  
	console.log('Server started on port '+app.get('port'));
  });





