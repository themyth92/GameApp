
/**
 * Module dependencies.
 */
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var MongoStore = require('connect-mongo')(express);
var app = express();
var sessionStore = new MongoStore({
									db : 'gameApp',
									host :'127.0.0.1',
									port : 27017
									 });

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
app.use(express.session({ secret: 'gameApp' , store : sessionStore}));
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
app.get('/retrieve/questions', routes.retrieveQuestionList);
app.post('/upload/questionList', routes.uploadQuestionList);

var server = http.createServer(app);
var io     = require('socket.io').listen(server);
var cookie = require('cookie');

io.sockets.on('connection', function(socket){
	var cookieString = socket.handshake.headers['cookie'];
	var parseCookie  = cookie.parse(cookieString);
	var sessionID    = parseCookie['connect.sid'].substring(2, 26);
	
	if(sessionID){
			var session = sessionStore.get(sessionID, function(error, session){
			
			routes.socketConnect(socket, session);
		})	
	}
});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
