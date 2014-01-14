var Constant = require('../Constant/constant');

function User(UserModel, bCrypt){
	
	//private varibles
	var attr = {
	}

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

	function hashPassword(password){

		return bCrypt.hashSync(password, 10);
	}

	function comparePassword(userPassword, hashPassword){

		return bCrypt.compareSync(userPassword, hashPassword);
	}

	function generateUserSession(req){

		req.session.regenerate(function(){
			req.session.user = req.body.userName;
		})
	}

	this.storeRegisterUser = function(req, res){
		
		var userName, password;

		userName = req.body.userName;
		password = req.body.password;
		
		if(userName && password){

			var hashedPassword = hashPassword(password);
				
			var user = new UserModel({userName : userName, password : hashedPassword});
			
			user.save(function(err, doc){

				if(!err && doc){
					
					generateUserSession(req);
					
					var dataSendBack  = returnMessageToClientOnRegister(false);
					dataSendBack.data = {
							userName : doc.userName,
							_id      : doc._id
					}
					
					res.json(dataSendBack);	
				}	
				else{

					res.json(checkUserExistErrorCallback(err));
				}
			});	
		}		
		else
			return false;
	}

	this.checkUserExistErrorCallback = function(err){

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
			return checkUserExistErrorCallback();
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
} 

exports.user = User;