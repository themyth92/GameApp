/*==================
  routing index
 ==================*/
var Constant      = require('./Constant/constant');
var mongoose      = require('mongoose');
var db            = mongoose.createConnection('localhost', Constant.constant.DATABASE.name);
var UserSchema    = require('../models/UserSchema').UserSchema;
var UploadSchema  = require('../models/UserSchema').UploadSchema;
var SavedGameSchema		= require('../models/UserSchema').SavedGameSchema;
var PublishedGameSchema	= require('../models/UserSchema').PublishedGameSchema;
var QuestionPollSchema  = require('../models/UserSchema').QuestionPollSchema;

var UploadModel   = db.model(Constant.constant.DATABASE.COLLECTION.upload, UploadSchema);
var UserModel     = db.model(Constant.constant.DATABASE.COLLECTION.user, UserSchema); 
var SavedGameModel		= db.model('SavedGame', SavedGameSchema);
var PublishedGameModel	= db.model('PublishedGame', PublishedGameSchema);
var QuestionPollModel	= db.model('QuestionPoll', QuestionPollSchema); 
var bCrypt        = require('bcrypt');
var User          = require('./User/user').user;
var Upload        = require('./Upload/upload').upload;
var Socket        = require('./Socket/socket').socket;
var QuestionList  = require('./User/questionList').questionList;
var ObjectId 	  = require('mongoose').Types.ObjectId;
function Api(){
	
	//declare private attributes
	var attr = {
		user   		 : new User(UserModel, bCrypt),
		upload 		 : new Upload(UserModel, UploadModel),
		questionList : new QuestionList(UserModel, UploadModel) 
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
							_id       : data._id,
							userName  : data.userName,
							isTeacher : data.isTeacher
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

	this.retrieveQuestionList = function(req, res){

		if(req.session.userName){
			attr.questionList.retrieveQuestionList(req, res);
		}
		else{
			res.json({
				code : Constant.constant.STATUS.ERROR.SESSION_NOT_EXIST.code,
				message : Constant.constant.STATUS.ERROR.SESSION_NOT_EXIST.message
			})	
		}
	}

	this.uploadQuestionList = function(req, res){
		
		if(req.session.userName && req.body){
			attr.questionList.uploadQuestionList(req, res);
		}
		else{
			res.json({
				code : Constant.constant.STATUS.ERROR.SESSION_NOT_EXIST.code,
				message : Constant.constant.STATUS.ERROR.SESSION_NOT_EXIST.message
			})	
		}
	}

	this.socketConnect = function(socket, session){
		var socketVar = new Socket(UserModel, UploadModel, socket, session, SavedGameModel, PublishedGameModel, QuestionPollModel);
		socketVar.sendQuestion();
		socketVar.retrieveQuestionList();
		socketVar.teacherUpdateQuestionList();
		socketVar.retrieveStudentQuestionList();
		socketVar.sendChat();
		socketVar.sendGlobalChat();
		socketVar.saveUserGame();
		socketVar.saveUserStoryStage();
		socketVar.publishGame();
		socketVar.updateQuestionPoll();
	}

	this.retrieveYourQuestionAndImage = function(req, res){

		var userName = req.session.userName;

		UploadModel.find({userName : userName}, null, 

		    function(err, docs){

		    	UserModel.find({userName : userName}, 'storyStage', function(err, data){

		    		res.json({data : docs, storyStage : data[0].storyStage});
		    	})
		})
	}

	this.retrieveYourGameList = function(req, res){

		var userName = req.session.userName;
		SavedGameModel.find({userName : userName}, 'screenShot _id title', function(err, doc){
			if(!err && doc){
				res.json({data : doc});
			}
		})
	}

	this.repairYourGame = function(req, res){

		var userName 	= req.session.userName;
		var id 			= req.params.id;

		SavedGameModel.findById(ObjectId(id), null, function(err, doc){
			if(!err && doc){
				
				UploadModel.find({userName : userName}, null, 

				    function(err, docs){

				   		var dataReturn = {data1 : doc, data : docs};
				   		res.json(dataReturn);
				})
			}
		})
	}

	this.gameGallery = function(req, res){

		PublishedGameModel.find({}, 'screenShot _id userName title', function(err, doc){

			if(!err && doc){
				res.json({data : doc});
			}
		})
	}

	this.retrievePublishedGame = function(req, res){
		var id 		 = req.params.id;
		var userName = req.session.userName;

		PublishedGameModel.findById(ObjectId(id), null, function(err, doc){
			if(!err && doc){
				
				UploadModel.find({userName : userName}, null, 

				    function(err, docs){

				   		var dataReturn = {data1 : doc, data : docs};
				   		res.json(dataReturn);
				})
			}
		})
	}

	this.questionPoll = function(req, res){
		
		QuestionPollModel.find({}, function(err, doc){
			if(!err && doc){
				res.json({data : doc});
			}
			else{
				res.json({err : err});
			}
		})
	}
};

exports.index = function(req, res){
  res.render('index', { title: 'Game Application' });
};

var Api   	                 = new Api();

exports.registerUser     	 = Api.registerUser;
exports.loginUser        	 = Api.loginUser;
exports.authenticateUser 	 = Api.authenticateUser;
exports.logoutUser       	 = Api.logoutUser;
exports.uploadImage      	 = Api.uploadImage;
exports.socketConnect    	 = Api.socketConnect;
exports.retrieveQuestionList = Api.retrieveQuestionList;
exports.retrieveYourQuestionAndImage = Api.retrieveYourQuestionAndImage;
exports.uploadQuestionList   = Api.uploadQuestionList;
exports.retrieveYourGameList = Api.retrieveYourGameList;
exports.repairYourGame       = Api.repairYourGame;
exports.gameGallery			 = Api.gameGallery;
exports.retrievePublishedGame= Api.retrievePublishedGame;
exports.questionPoll 		 = Api.questionPoll;