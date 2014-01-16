var constant = {

	STATUS: {
	
		ERROR : {
			USER_REGISTERED : {
				code : '101',
				message : 'User name already registerd'
			},

			USER_LOGIN :{
				code : '102',
				message : 'User name login fail'
			},

			USER_CREDENTIAL_WRONG_FORMAT : {
				code : '501',
				message : 'There is something wrong with user format send to server' 
			},

			SERVER_ERROR : {
				code : '502',
				message : 'Server problem'
			}
		},

		SUCCESS : {
			
			USER_REGISTER_SUCCESS : {
				code : '201',
				message : 'User register successfully'
			},

			USER_LOGIN_SUCCESS : {
				code : '202',
				message : 'User login successfully'
			}
		},
	},

	DATABASE :{
		
		COLLECTION :{
			user : 'User'
		},

		ERROR : {

			USER_NAME_DATABASE_ERROR : {

				EXIST_MORE_THAN_ONE_USER_NAME : 'There exist more than one user name in the database'
			}
		},

		name : 'gameApp'
	},

	NUMBER : {
		NO_USER_EXIST : 0,
		USER_ALREADY_EXIST : 1,
	}
} 

exports.constant = constant;
