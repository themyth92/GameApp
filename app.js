
/**
 * Module dependencies.
 */
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var MongoStore = require('connect-mongo')(express);
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser({keepExtensions: true})) ;
app.use(express.cookieParser());  
app.use(express.session({ secret: 'gameApp' , store : new MongoStore({
																	db : 'gameApp',
																	host :'127.0.0.1',
																	port : 27017
																	 }), cookie: {maxAge: 600*10000}}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/user/register', routes.registerUser);
app.post('/user/login', routes.loginUser);
app.get('/user/authenticate', routes.authenticateUser);
app.post('/user/logout', routes.logoutUser);
app.post('/upload/image', routes.uploadImage);
app.post('/upload/question', routes.uploadQuestion);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
