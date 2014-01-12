
/*
 * GET home page.
 */
var mongoose   = require('mongoose');
var db         = mongoose.createConnection('localhost', 'gameApp');
var UserSchema = require('../models/UserSchema').UserSchema;
var UserModel  = db.model('User', UserSchema); 

var User       = require('./User/user.js').user(UserModel);
var Constant   = require('./Constant/constant.js').constant();

function Api(){
	//declare private attributes
	var attr = {
		User : User, 
	};
	//declare public methods
	this.registerUser = function(req, res){
		var user, password;
		(req.body.userName && req.body.password) ? (user = req.body.userName, password = req.body.password) :  
		attr.User.registerUser(user, password) ;
		res.send('Hello world');
	};
}

exports.index = function(req, res){
  res.render('index', { title: 'Realtime poll application' });
};

exports.registerUser = function(req, res){
	var sendBack = {
		message : 'what the fuck',
		code    : '201'
	}

	setTimeout(function(){
		res.json(sendBack);
	}, 10000)
}