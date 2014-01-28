/*==================
  routing index
 ==================*/
var Constant      = require('./Constant/constant.js');
var mongoose      = require('mongoose');
var db            = mongoose.createConnection('localhost', Constant.constant.DATABASE.name);
var UserSchema    = require('../models/UserSchema').UserSchema;
var UploadSchema  = require('../models/UserSchema').UploadSchema;

var UploadModel   = db.model(Constant.constant.DATABASE.COLLECTION.upload, UploadSchema);
var UserModel     = db.model(Constant.constant.DATABASE.COLLECTION.user, UserSchema); 
var bCrypt        = require('bcrypt');
var User          = require('./User/user.js').user;
var Upload        = require('./Upload/upload.js').upload;

function Api(){
	
	//declare private attributes
	var attr = {
		user : new User(UserModel, bCrypt),
		upload : new Upload(UserModel, UploadModel) 
	};

	//declare public methods
	this.registerUser = function(req, res){

		var promise, dataSendBack = {};
		
		//create a promise for checking user already registered in database
		promise = attr.user.registerUser(req);
		
		if(promise){

			//excecute the callback for the promise
			promise.then(function(doc){
				
				//check the data from the callback data doc
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
							code    : Constant.constant.STATUS.ERROR.USER_CREDENTIAL_WRONG_FORMAT.code,
							message : Constant.constant.STATUS.ERROR.USER_CREDENTIAL_WRONG_FORMAT.message}; 
			
			res.json(dataSendBack);
		}
	};

	this.loginUser = function(req, res){

		var user, password, promise, dataSendBack;

		//check the user inside database success callback
		promise = attr.user.loginUser(req);

		if(promise){
			
			promise.then(function(doc){
				
				//check data sendback from the database and return result to user
				dataSendBack = attr.user.loginUserSuccessCallBack(doc, req);
				res.json(dataSendBack);

			}, function(err){

				dataSendBack = attr.user.serverErrorCallBack(err);
				res.json(dataSendBack);

			})
		}
		else{

			dataSendBack = {
							code    : Constant.constant.STATUS.ERROR.USER_CREDENTIAL_WRONG_FORMAT.code,
							message : Constant.constant.STATUS.ERROR.USER_CREDENTIAL_WRONG_FORMAT.message}; 
			
			res.json(dataSendBack);	
		}
	}

	/*
		check if the session already exist for user
	*/
	this.authenticateUser = function(req, res){
		
		var dataSendBack, promise;

		var promise = attr.user.authenticateUser(req);

		if(promise){

			promise.then(function(doc){

				var data;

				if(data = attr.user.authenticateUserSuccessCallBack(doc)){

					dataSendBack = {
						code    : Constant.constant.STATUS.SUCCESS.SESSION_EXIST.code,
						message : Constant.constant.STATUS.SUCCESS.SESSION_EXIST.message,
						data    : {
							_id      : data._id,
							userName : data.userName
						}
					}
				}
				else
					dataSendBack = {
						code    : Constant.constant.STATUS.ERROR.SESSION_NOT_EXIST.code,
						message : Constant.constant.STATUS.ERROR.SESSION_NOT_EXIST.message	
					}

				res.json(dataSendBack);

			}, function(err){

				dataSendBack = {
					code    : Constant.constant.STATUS.ERROR.SESSION_NOT_EXIST.code,
					message : Constant.constant.STATUS.ERROR.SESSION_NOT_EXIST.message	
				}

				res.json(dataSendBack);
			})
		}
		else{
			dataSendBack = {
				code    : Constant.constant.STATUS.ERROR.SESSION_NOT_EXIST.code,
				message : Constant.constant.STATUS.ERROR.SESSION_NOT_EXIST.message
			}

			res.json(dataSendBack);
		}
	}	

	/*
		lazy stuff, dont check if the session is destroyed or not
	*/
	this.logoutUser = function(req, res){
		
		attr.user.destroySession(req);

		res.json({
			code    : '204',
			message : 'Logout success'
		})
	}
	
	this.uploadImage = function(req, res){

		if(req.session.userName){
			attr.upload.uploadImage(req, res);
		}
		else{
			res.json({
				code : Constant.constant.STATUS.ERROR.SESSION_NOT_EXIST.code,
				message : Constant.constant.STATUS.ERROR.SESSION_NOT_EXIST.message
			})
		}
	}

	this.uploadQuestion = function(req, res){

		if(req.session.userName){
			attr.upload.uploadQuestion(req, res);
		}
		else{
			res.json({
				code : Constant.constant.STATUS.ERROR.SESSION_NOT_EXIST.code,
				message : Constant.constant.STATUS.ERROR.SESSION_NOT_EXIST.message
			})
		}
	}
};

exports.index = function(req, res){
  res.render('index', { title: 'Game Application' });
};

var Api                  = new Api();

exports.registerUser     = Api.registerUser;
exports.loginUser        = Api.loginUser;
exports.authenticateUser = Api.authenticateUser;
exports.logoutUser       = Api.logoutUser;
exports.uploadImage      = Api.uploadImage;
exports.uploadQuestion   = Api.uploadQuestion;
