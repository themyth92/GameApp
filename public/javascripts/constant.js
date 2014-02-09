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

			FILE_UPLOAD :{
				name : 'UPLOAD FILE',
				code : '003',
				PARTIAL :{
					UPLOAD_CHECKING :{
						code : '004',
						name : 'UPLOAD CHECKING'
					},
					UPLOAD_CHECKED : {
						code : '005',
						name : 'UPLOAD CHECKED',
						IMAGE : {
							code : '006'
						},
						QUESTION : {
							code :'007'
						}
					}
				},
				ERROR : {
					UPLOAD_SESSION_ERROR :{
						code    : '103',
						message : 'Your session has expired. Please reload browser and try uploading again'
					},
					UPLOAD_IMAGE_ERROR : {
						code    : '104',
						message : 'There are some errors from server. We can not proceed your image uploading.'
					},
					UPLOAD_QUESTION_ERROR:{
						code    : '105',
						message : 'There are errors from server. We can not proceed your question uploading'
					}
				},
				SUCCESS : {
					UPLOAD_SUCCESS :{
						code : '204',
						message : 'Your uploading is successful'
					}
				}
			},

			RETRIEVE_QUESTION_LIST :{
				name : 'RETRIEVE QUESTION LIST',
				code : '009',
				SUCCESS : {
					code    : '205',
					message : 'Retrieve question success'
				}
			},

			UPLOAD_QUESTION_LIST : {
				name : 'UPLOAD QUESTION LIST',
				code : '010',
				SUCCESS : {
					code : '206',
					message : 'Your change has been saved successfully'
				},
			},

			USER_LOGOUT : {
				name :'USER LOGOUT',
				code : '008'
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

	SOCKET :{
		sendQuestion 			    : 'send:question',
		receiveQuestionUploadResult : 'receive:question',
		sendLogout                  : 'send:logout'
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
			},
			QUESTION_LIST :{
				url : '/retrieve/questions'
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
			NAV_BAR_CTRL : 'nav bar controller',
			FILE_UPLOAD_CTRL : 'file upload controller',
			IMAGE_UPLOAD_CTRL : 'image upload controller',
			IMAGE_UPLOAD_DIRECTIVE : 'image upload directive',
			QUESTION_UPLOAD_DIRECTIVE : 'question upload directive',
			QUESTION_LIST_CTRL : 'question list controller'
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
		},

		TIMEOUT_SERVER : {
			time : 20000
		}
	},
}
/*
constant {
ConstantEnum = {
	ERROR1 : 1,
	ERROR2 : 2
}

ConstantSolution  = {
	ConstantEnum.ERROR1 : "FUKCDKFJKDSL:FJKDLJKL",
	ConstantEnum.ERROR2 : { 
		message : functioN(),
		resolve : functin()
	}
}
}

constant.define( "ERROR3" , messaage(), resolve())
*/