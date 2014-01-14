define(['app'], function(app){

	var Controller = {

		HomePartialCtrl : function($scope, sessionService){

			this.isLogin 	       = sessionService.state.isLogin;
			
			$scope.$on(Constant.NOTIFICATION.ACTION.USER_REGISTER.name, function(event, args){
				
				if (args.code && args.code == Constant.NOTIFICATION.ACTION.USER_REGISTER.SUCCESS.USER_REGISTER_SUCCESS.code){
					$scope.HomePartialCtrl.isLogin  = true;
					sessionService.changeLoginState(true);
				}
				else{
					$scope.HomePartialCtrl.isLogin  = false;
					sessionService.changeLoginState(true);
				}
			});

			return $scope.HomePartialCtrl = this;
		},

		NavBarCtrl : function($scope, loginService, broadCastService){

			function UserLoginSuccessHandle(data){
				
				data          = data || {};
				data.code     = data.code || Constant.ERROR.FAILED_RECEIVE_CORRECT_FORMAT_DATA_FROM_SERVER.code;

				var eventName = Constant.NOTIFICATION.ACTION.USER_LOGIN.name;
			
			}

			function UserLoginErrorHandle(){

				var eventName = Constant.NOTIFICATION.ACTION.USER_LOGIN.name;

				broadCastService.broadCastEvent(eventName, Constant.ERROR.FAILED_RECEIVE_DATA_FROM_SERVER);
				throw(Constant.DEBUG.ERROR.FAILED_RECEIVE_DATA_FROM_SERVER.message + ' in ' + Constant.DEBUG.LOCATION.NAV_BAR_CTRL);
			}

			this.user = {
				isLogin : false,
				userName : '',
				password : ''
			};
			
			this.loginSubmit  = function(){
				
				var userName  = this.user.userName;
				var password  = this.user.password;
				var eventName = Constant.NOTIFICATION.ACTION.USER_LOGIN.name;

				try{
					if(userName && password){
						//add in login service here
						loginService.loginUser({userName : userName, password : password}).then(function(data){

											   }, function(){

											   });
					}
				}
				catch(error){
					throw(error + ' in ' + Constant.DEBUG.LOCATION.NAV_BAR_CTRL);
				} 
			};

			return $scope.NavBarCtrl = this;
		},
	}

	app.controller('HomePartialCtrl', ['$scope', 'StoreSessionService', Controller.HomePartialCtrl]);
	app.controller('NavBarCtrl', ['$scope', 'UserLoginService', 'BroadCastService', Controller.NavBarCtrl]);
}) 
