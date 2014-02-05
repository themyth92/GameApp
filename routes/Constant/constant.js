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
			},

			IMAGE_UPLOAD_ERROR : {
				code : '104',
				message : 'Image upload error'
			},

			SESSION_NOT_EXIST :{
				code : '103',
				message : 'Session not exist'
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
			},

			SESSION_EXIST : {
				code : '203',
				message : 'Session exist'
			},

			UPLOAD_SUCCESS : {
				code : '204',
				message : 'Upload success'
			},

			RETRIEVE_QUESTION_SUCCESS :{
				code : '205',
				message : 'Retrieve question success'
			}
		},
	},

	SOCKET : {
		sendQuestion                : 'send:question',
		receiveQuestionUploadResult : 'receive:question'
	},

	DATABASE :{
		
		COLLECTION :{
			user : 'User',
			upload : 'Upload'
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
