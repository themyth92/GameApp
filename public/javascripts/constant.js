var Constant = Constant || {};

Constant = {
	NOTIFICATION : {
		ACTION : {
			USER_REGISTER : {
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
			AJAX_LOADING_DIRECTIVE   : 'ajax loading directive'
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
	}
}