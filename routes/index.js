/*
 * GET home page.
 */
var Constant   = require('./Constant/constant.js');
var mongoose   = require('mongoose');
var db         = mongoose.createConnection('localhost', Constant.constant.DATABASE.name);
var UserSchema = require('../models/UserSchema').UserSchema;
var UserModel  = db.model(Constant.constant.DATABASE.COLLECTION.user, UserSchema); 
var bCrypt     = require('bcrypt');

var User       = require('./User/user.js').user;

function Api(){
	
	//declare private attributes
	var attr = {
		user : new User(UserModel, bCrypt), 
	};

	//declare public methods
	this.registerUser = function(req, res){

		var promise, dataSendBack = {};
		
		promise = attr.user.registerUser(req);
		
		if(promise){

			promise.then(function(doc){
				
				dataSendBack = attr.user.checkUserExistSuccessCallback(doc);
						
				if(dataSendBack.code == Constant.constant.STATUS.SUCCESS.USER_REGISTER_SUCCESS.code){
						
					attr.user.storeRegisterUser(req, res);
				}
				else{
					res.json(dataSendBack);	 	
						
				}
			}, function(err){

				dataSendBack = attr.user.serverErrorCallBack(err);
				res.json(dataSendBack);
			})	
		}
		else{

			dataSendBack = {
							code : Constant.constant.STATUS.ERROR.USER_CREDENTIAL_WRONG_FORMAT.code,
							message : Constant.constant.STATUS.ERROR.USER_CREDENTIAL_WRONG_FORMAT.message}; 
			
			res.json(dataSendBack);
		}
		
	};

	this.loginUser = function(req, res){

		var user, password, promise, dataSendBack;

		promise = attr.user.loginUser(req);

		if(promise){
			
			promise.then(function(doc){
				
				dataSendBack = attr.user.loginUserSuccessCallBack(doc, req);
				res.json(dataSendBack);

			}, function(err){

				dataSendBack = attr.user.serverErrorCallBack(err);
				res.json(dataSendBack);

			})
		}
		else{

			dataSendBack = {
							code : Constant.constant.STATUS.ERROR.USER_CREDENTIAL_WRONG_FORMAT.code,
							message : Constant.constant.STATUS.ERROR.USER_CREDENTIAL_WRONG_FORMAT.message}; 
			
			res.json(dataSendBack);	
		}
	}	
};

exports.index = function(req, res){
  res.render('index', { title: 'Game Application' });
};

var Api = new Api();
exports.registerUser = Api.registerUser;
exports.loginUser    = Api.loginUser;
exports.authenticateUser = function(req, res){
	res.json({
		code : '203',
		message : 'session exist'
	})
}