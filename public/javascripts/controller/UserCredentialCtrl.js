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

						   if(data.data && data.data.userName && data.data._id){

						   		broadCastService.broadCastEvent(eventName, data.code, data.data);
						   		sessionService.changeLoginState(true);
						   		setUserLogin(true);
						   }
						   else{
						   		data.code = Constant.ERROR.FAILED_RECEIVE_CORRECT_FORMAT_DATA_FROM_SERVER.code;
						   		broadCastEvent.broadCastEvent(eventName, data.code); 
						   		sessionService.changeLoginState(false);
						   		setUserLogin(false); 
						   } 

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

			$scope.$on(Constant.NOTIFICATION.ACTION.USER_LOGIN.name, function(event, args){
				
				if (args.code && args.code == Constant.NOTIFICATION.ACTION.USER_LOGIN.SUCCESS.USER_LOGIN_SUCCESS.code){
					$scope.UserRegisterCtrl.user.isLogin  = true;
				}
				else{
					$scope.UserRegisterCtrl.user.isLogin  = false;
				}
			});
			
			return $scope.UserRegisterCtrl = this;
		},
	}

	app.controller('UserRegisterCtrl', ['$rootScope', '$scope','UserRegisterService', 'BroadCastService' , 'StoreSessionService', Controller.UserRegisterCtrl]);
}) 
