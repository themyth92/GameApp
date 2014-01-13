define(['app'], function(app){

	var Controller = {

		UserRegisterCtrl : function($rootScope, $scope, $q, registerService, ajaxNotiService){

			function UserRegisterSuccessHandle(data){

				data.code    = data.code || Constant.FAILED_RECEIVE_CORRECT_FORMAT_DATA_FROM_SERVER.code;
				data.message = data.message || '';

				switch(data.code){
					
					case  Constant.ERROR.FAILED_RECEIVE_CORRECT_FORMAT_DATA_FROM_SERVER.code :
							
							ajaxNotiService.setNotification(Constant.NOTIFICATION.COMMON.SERVER_ERROR.code);
							setUserLogin(false);
							console.log(Constant.DEBUG.ERROR.FAILED_RECEIVE_CORRECT_FORMAT_DATA_FROM_SERVER.message);
						   
						    break;

					case Constant.NOTIFICATION.ACTION.USER_REGISTER.ERROR.USER_ALREADY_REGISTER.code :

						   ajaxNotiService.setNotification(Constant.ACTION.USER_REGISTER.ERROR.USER_ALREADY_REGISTER.code);
						   setUserLogin(false);
						   break;

					case Constant.NOTIFICATION.ACTION.USER_REGISTER.SUCCESS.USER_REGISTER_SUCCESS.code :

						   ajaxNotiService.setNotification(Constant.NOTIFICATION.ACTION.USER_REGISTER.SUCCESS.USER_REGISTER_SUCCESS.code);
						   setUserLogin(true);
						   break;
					
					default :
							setUserLogin(false);
							console.log('Unhandle case in '  +  Constant.DEBUG.LOCATION.USER_REGISTER_CTRL);

				}			
			}

			function UserRegisterErrorHandle(){

				ajaxNotiService.setNotification(Constant.ERROR.FAILED_RECEIVE_DATA_FROM_SERVER);
				console.log(Constant.DEBUG.ERROR.FAILED_RECEIVE_DATA_FROM_SERVER + 'from' + Constant.DEBUG.LOCATION.USER_REGISTER_CTRL);
			}

			function setUserLogin(isLogin){
				
				if(isLogin)
					$scope.UserRegisterCtrl.user.isLogin = true;
				else
					$scope.UserRegisterCtrl.user.isLogin = false;
			}

			this.user = {
				isLogin : false,
				userName : '',
				password : ''
			};

			this.registerSubmit = function(){

				var userName = this.user.userName;
				var password = this.user.password;

				try{
					if(userName && password){
						ajaxNotiService.setNotification(Constant.NOTIFICATION.ACTION.USER_REGISTER.code);
						registerService.register().then(function(data){
														UserRegisterSuccessHandle(data);
												   },  function(){
												   		UserRegisterErrorHandle();
												   });				
					}
				}
				catch(error){
					console.log(error + ' happens in ' + Constant.DEBUG.LOCATION.USER_REGISTER_CTRL);
				}		
			};

			return $scope.UserRegisterCtrl = this;
		},
	}

	app.controller('UserRegisterCtrl', ['$rootScope', '$scope','$q','UserRegisterService' , Controller.UserRegisterCtrl]);
}) 
