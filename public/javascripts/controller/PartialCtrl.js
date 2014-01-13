define(['app'], function(app){

	var Controller = {

		HomePartialCtrl : function($scope){

			this.isLogin 	       = false;
			
			$scope.$on(Constant.NOTIFICATION.ACTION.USER_REGISTER.SUCCESS.USER_REGISTER_SUCCESS.code, function(){
				
				$scope.HomePartialCtrl.isLogin  = true;
			});

			return $scope.HomePartialCtrl = this;
		},

		NavBarCtrl : function($scope, AjaxNotiService){

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

			$scope.$on(Constant.NOTIFICATION.ACTION.USER_REGISTER.SUCCESS.code, function(){

					$scope.NavBarCtrl.isLogin  = true;
			})

			return $scope.NavBarCtrl = this;
		},
	}

	app.controller('HomePartialCtrl', ['$scope', Controller.HomePartialCtrl]);
	app.controller('NavBarCtrl', ['$scope', Controller.NavBarCtrl]);
}) 
