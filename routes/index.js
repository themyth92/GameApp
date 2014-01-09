
/*
 * GET home page.
 */
var mongoose   = require('mongoose');
var db         = mongoose.createConnection('localhost', 'gameApp');
var UserSchema = require('/models/UserSchema');
var User       = db.model('User', UserSchema); 

var api = {

	constant : {
		error : {
			USER_REGISTERED :{
				code : '101',
				message : 'User already register'
			},
			USER_REGISTRATION_ERROR : {
				code : '102',
				message : 'Registration can not be processed due to server error'
			},
		},

		success :{
			USER_REGISTER :{
				code : '201',
				message : 'User register successfully'
			}
		}
	},
	
	validate : {
		checkUserNameExist : function(){	

		},
		checkUserSession : function(){

		}	
	}

	userRegister : function(req, res){
		User.save(function(error, doc){
			if(error || !doc){

			}
			else{
				res.json(doc);
			}
		})
	}
}

exports.index = function(req, res){

};

exports.registerUser = function(req, res){

}