define(['app'], function(app){

	var Controller = {

		UserRegisterCtrl : function($scope, registerService, credentialBroadcastService){

			$scope.user = {
				isLogin : false,
				userName : '',
				password : ''
			};

			$scope.registerSubmit = function(){
				var userName = $scope.user.userName;
				var password = $scope.user.password;
				console.log($scope);
			};
		},

		UserLoginCtrl : function(){

		},

		NavBarCtrl : function($scope, credentialBroadcastService){

			$scope.user = {
				isLogin : false,
				userName : '',
				password : ''
			};
			
			$scope.loginSubmit = function(){

			};
		}
	}

	app.controller('NavBarCtrl', ['$scope', 'UserCredentialBroadcastService', Controller.NavBarCtrl]);
	app.controller('UserRegisterCtrl', ['$scope', 'UserRegisterService', 'UserCredentialBroadcastService' , Controller.UserRegisterCtrl]);
	
}) 
