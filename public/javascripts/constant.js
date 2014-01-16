var Constant = Constant || {};

Constant = {
	
	NOTIFICATION : {
		
		ACTION : {
			
			USER_REGISTER : {
				name : 'USER REGISTER',
				code : '001',
				ERROR :{
					USER_ALREADY_REGISTER : {
						code    : '101',
						message : 'User name already registered' 
					},
				},
				SUCCESS : {
					USER_REGISTER_SUCCESS : {
						code : '201',
						message : 'User register successfully'
					}
				}
			},

			USER_LOGIN :{
				name  : 'USER LOGIN', 
				code : '002',
				ERROR :{
					USER_LOGIN_FAIL : {
						code    : '102',
						message : 'User name or password does not match' 
					},
				},
				SUCCESS : {
					USER_LOGIN_SUCCESS : {
						code : '202',
						message : 'User login successfully'
					}
				}
			},

			USER_LOGOUT : {
				name :'USER LOGOUT',
				code : '004'
			}
		},
		COMMON :{
			SERVER_ERROR :{
				code : '502',
				message : 'Server now is experiencing problem. Please try again later'
			},

			LOADING :{
				message : 'Loading. Please wait',
			}
		}
	},

	URL :{
		ACTION :{
			USER_REGISTER : {
				url : '/user/register'
			},
			USER_LOGIN : {
				url : '/user/login'
			},
			USER_AUTHENTICATE :{
				url : '/user/authenticate'
			},
			USER_LOGOUT : {
				url : '/user/logout'
			}
		}
	},

	ERROR :{

		FAILED_RECEIVE_CORRECT_FORMAT_DATA_FROM_SERVER : {
			code : '501',
			message : 'Server Error'
		},

		FAILED_RECEIVE_DATA_FROM_SERVER : {
			code : '502',
			message : 'Server Error'
		},
	},

	DEBUG :{
		LOCATION :{
			USER_REGISTER_CTRL : 'user register controller',
			AJAX_LOADING_DIRECTIVE   : 'ajax loading directive',
			NAV_BAR_CTRL : 'nav bar controller'
		},
		ERROR :{

			FAILED_RECEIVE_CORRECT_FORMAT_DATA_FROM_SERVER : {
				code : '501',
				message : 'Wrong format or no data send from server'
			},

			FAILED_RECEIVE_DATA_FROM_SERVER : {
				code : '502',
				message : 'Server internal error'
			}
		},
	},

	TIMEOUT : {
		MAXIMUM_TIME_MESSAGE_APPEAR : {
			time : 20000,
		}
	}
}