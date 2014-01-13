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

		NavBarCtrl : function($scope){

			this.user = {
				isLogin : false,
				userName : '',
				password : ''
			};
			
			this.loginSubmit = function(){
				
				var userName = this.user.userName;
				var password = this.user.password;

				if(userName && password){
					//add in login service here
				} 
			};

			$scope.$on(Constant.NOTIFICATION.ACTION.USER_REGISTER.name, function(event, args){

				if(args.code && args.code == Constant.NOTIFICATION.ACTION.USER_REGISTER.SUCCESS.USER_REGISTER_SUCCESS.code){

					$scope.NavBarCtrl.user.isLogin  = true;
					$scope.NavBarCtrl.user.userName = 'Shit fuck';
				}
				else

					$scope.NavBarCtrl.user.isLogin  = false;
			})

			return $scope.NavBarCtrl = this;
		},
	}

	app.controller('HomePartialCtrl', ['$scope', 'StoreSessionService', Controller.HomePartialCtrl]);
	app.controller('NavBarCtrl', ['$scope', Controller.NavBarCtrl]);
}) 
