define(['app'], function(app){

	var Controller = {

		UserRegisterCtrl : function($rootScope, $scope, registerService, broadCastService, sessionService){

			function UserRegisterSuccessHandle(data){
				
				data          = data || {};
				data.code     = data.code || Constant.ERROR.FAILED_RECEIVE_CORRECT_FORMAT_DATA_FROM_SERVER.code;

				var eventName = Constant.NOTIFICATION.ACTION.USER_REGISTER.name;

				switch(data.code){
					
					case  Constant.ERROR.FAILED_RECEIVE_CORRECT_FORMAT_DATA_FROM_SERVER.code :
							
							broadCastService.broadCastEvent(eventName, data.code);
							setUserLogin(false);
							sessionService.changeLoginState(false);
							throw(Constant.DEBUG.ERROR.FAILED_RECEIVE_CORRECT_FORMAT_DATA_FROM_SERVER.message);
						   
						    break;

					case Constant.NOTIFICATION.ACTION.USER_REGISTER.ERROR.USER_ALREADY_REGISTER.code :

						   broadCastService.broadCastEvent(eventName, data.code);
						   sessionService.changeLoginState(false);
						   setUserLogin(false);
						   break;

					case Constant.NOTIFICATION.ACTION.USER_REGISTER.SUCCESS.USER_REGISTER_SUCCESS.code :

						   //need add data here about user login credential
						   (data.data && data.data.userName && data.data._id) ? data.code = data.code : data.code = Constant.ERROR.FAILED_RECEIVE_CORRECT_FORMAT_DATA_FROM_SERVER.code;
						   broadCastService.broadCastEvent(eventName, data.code, data.data);
						   sessionService.changeLoginState(true);
						   setUserLogin(true);
						   break;
					
					default :

							broadCastService.broadCastEvent(eventName, Constant.NOTIFICATION.COMMON.SERVER_ERROR.code);
							sessionService.changeLoginState(false);
							setUserLogin(false);
							throw('Unhandle case in '  +  Constant.DEBUG.LOCATION.USER_REGISTER_CTRL);

				}			
			}

			function UserRegisterErrorHandle(){

				var eventName = Constant.NOTIFICATION.ACTION.USER_REGISTER.name;

				broadCastService.broadCastEvent(eventName, Constant.ERROR.FAILED_RECEIVE_DATA_FROM_SERVER);
				throw(Constant.DEBUG.ERROR.FAILED_RECEIVE_DATA_FROM_SERVER.message + ' in ' + Constant.DEBUG.LOCATION.USER_REGISTER_CTRL);
			}

			function setUserLogin(isLogin){
				
				if(isLogin)
					$scope.UserRegisterCtrl.user.isLogin = true;
				else
					$scope.UserRegisterCtrl.user.isLogin = false;
			}
			
			this.user = {
				isLogin : sessionService.state.isLogin,
				userName : '',
				password : ''
			};

			this.registerSubmit = function(){

				var userName = this.user.userName;
				var password = this.user.password;
				var eventName = Constant.NOTIFICATION.ACTION.USER_REGISTER.name;

				try{
					if(userName && password){

						broadCastService.broadCastEvent(eventName, Constant.NOTIFICATION.ACTION.USER_REGISTER.code);
						registerService.register({userName : userName, password : password}).then(function(data){
														UserRegisterSuccessHandle(data);
												   },  function(){
												   		UserRegisterErrorHandle();
												   });				
					}
				}
				catch(error){
					throw(error + ' in ' + Constant.DEBUG.LOCATION.USER_REGISTER_CTRL);
				}		
			};

			return $scope.UserRegisterCtrl = this;
		},
	}

	app.controller('UserRegisterCtrl', ['$rootScope', '$scope','UserRegisterService', 'BroadCastService' , 'StoreSessionService', Controller.UserRegisterCtrl]);
}) 
