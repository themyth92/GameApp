var Constant = require('../Constant/constant');

function User(UserModel, bCrypt){
	
	//private varibles

	function returnMessageToClientOnRegister(isExist){
		
		if(isExist)
			return {
				code : Constant.constant.STATUS.ERROR.USER_REGISTERED.code, 
				message : Constant.constant.STATUS.ERROR.USER_REGISTERED.message
			}
		else
			return {
				code : Constant.constant.STATUS.SUCCESS.USER_REGISTER_SUCCESS.code,
				message : Constant.constant.STATUS.SUCCESS.USER_REGISTER_SUCCESS.message
			}
	}

	function returnMessageToClienOnLogin(isSuccess, isTeacher){

		if(isSuccess)
			
			return {

				code    : Constant.constant.STATUS.SUCCESS.USER_LOGIN_SUCCESS.code,
				message : Constant.constant.STATUS.SUCCESS.USER_LOGIN_SUCCESS.message,
				data    : {isTeacher : isTeacher}
			}
		else
			
			return {

				code : Constant.constant.STATUS.ERROR.USER_LOGIN.code,
				message : Constant.constant.STATUS.ERROR.USER_LOGIN.message
			}
	}

	function hashPassword(password){

		return bCrypt.hashSync(password, 10);
	}

	function comparePassword(userPassword, hashPassword){

		return bCrypt.compareSync(userPassword, hashPassword);
	}

	function generateUserSession(req){

		req.session.userName = req.body.userName;
	}

	this.storeRegisterUser = function(req, res){
		
		var userName, password, isTeacher;

		userName  = req.body.userName;
		password  = req.body.password;
		isTeacher = req.body.isTeacher; 
		
		if(userName && password){

			var hashedPassword = hashPassword(password);
				
			var user = new UserModel({userName : userName, password : hashedPassword, isTeacher : isTeacher});
			
			user.save(function(err, doc){

				if(!err && doc){
					
					generateUserSession(req);
					
					var dataSendBack  = returnMessageToClientOnRegister(false);
					dataSendBack.data = {
							userName : doc.userName,
							_id      : doc._id,
							isTeacher: doc.isTeacher
					}
					
					res.json(dataSendBack);	
				}	
				else{

					res.json(serverErrorCallBack(err));
				}
			});	
		}		
		else
			return false;
	}

	function serverErrorCallBack(err){
		
		if(err){
			throw(err);
		}

		return {
				code : Constant.constant.ERROR.SERVER_ERROR.code, 
				message : Constant.constant.ERROR.SERVER_ERROR.message
		};		
	}

	this.serverErrorCallBack = function(err){

		if(err){
			throw(err);
		}

		return {
				code : Constant.constant.ERROR.SERVER_ERROR.code, 
				message : Constant.constant.ERROR.SERVER_ERROR.message
			};
	}	

	this.checkUserExistSuccessCallback = function(doc){
		
		if(doc){
			switch(doc.length){

				case Constant.constant.NUMBER.NO_USER_EXIST : 
					return returnMessageToClientOnRegister(false);
				break;
				
				case Constant.constant.NUMBER.USER_ALREADY_EXIST:
					return returnMessageToClientOnRegister(true);
				break;
				
				default:
					throw(Constant.constant.DATABASE.ERROR.USER_NAME_DATABASE_ERROR.EXIST_MORE_THAN_ONE_USER_NAME);
					return returnMessageToClientOnRegister(true);
				break;
			}
		}
		else
			return serverErrorCallBack();
	}

	//public methods
	this.registerUser = function(req){

		var userName, password; 

		if(req.body.userName && req.body.password)
			userName = req.body.userName, password = req.body.password;
		else
			return false;  

		var query    = UserModel.find({userName : userName});
		return query.exec();
	}

	this.loginUser = function(req){

		var userName, password;

		if(req.body.userName && req.body.password)	
			userName = req.body.userName, password = req.body.password;
		else 
			return false;

		var query = UserModel.find({userName : userName}, 'password isTeacher');
		return query.exec();
	}

	this.loginUserSuccessCallBack = function(doc, req){

		if(doc){
			
			switch(doc.length){

				case Constant.constant.NUMBER.NO_USER_EXIST : 
					return returnMessageToClienOnLogin(false);
				break;
				
				case Constant.constant.NUMBER.USER_ALREADY_EXIST:

					var hashedPassword = doc[0].password;
					var password       = req.body.password;
					var isTeacher      = doc[0].isTeacher;
					
					if(comparePassword(password, hashedPassword)){
						
						generateUserSession(req);
						return returnMessageToClienOnLogin(true, isTeacher);
					}
					else
						return returnMessageToClienOnLogin(false);

				break;
				
				default:

					throw(Constant.constant.DATABASE.ERROR.USER_NAME_DATABASE_ERROR.EXIST_MORE_THAN_ONE_USER_NAME);
					return returnMessageToClienOnLogin(false);
				break;
			}
		}
		else{
			return serverErrorCallBack();
		}
	}

	this.authenticateUser = function(req){
	
		if(req.session.userName){
				
			var userName = req.session.userName;

			var query = UserModel.find({userName : userName} , '_id userName isTeacher');

			return query.exec();
		}
		else
			return false;
	}

	this.authenticateUserSuccessCallBack = function(doc){
	
		if(doc){

			switch(doc.length){

				case Constant.constant.NUMBER.NO_USER_EXIST : 
					return false
				break;
				
				case Constant.constant.NUMBER.USER_ALREADY_EXIST:

					if(doc[0]._id && doc[0].userName){
						return {_id : doc[0]._id, userName : doc[0].userName, isTeacher : doc[0].isTeacher};
					}
					else
						return false;
				break;
				
				default:
					throw(Constant.constant.DATABASE.ERROR.USER_NAME_DATABASE_ERROR.EXIST_MORE_THAN_ONE_USER_NAME);
					return false
				break;
			}

		}
		else
			return false;
	}

	this.destroySession = function(req){

		delete req.session.userName;
	}
} 

exports.user = User;