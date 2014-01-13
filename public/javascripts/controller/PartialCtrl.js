define(['app'], function(app){

	var Controller = {

		HomePartialCtrl : function($scope, AjaxNotiService){

			$scope.isLogin 	       = false;
			
			$scope.api = {
				code     : AjaxNotiService.status.code
			}

			$scope.$watch('api.code', function(){

				if($scope.api.code == Constant.NOTIFICATION.ACTION.USER_REGISTER.SUCCESS.code){

					$scope.isLogin  = true;
				}
			});
		},

		NavBarCtrl : function($scope, AjaxNotiService){

			this.user = {
				isLogin : false,
				userName : '',
				password : ''
			};

			this.api = {
				code : AjaxNotiService.status.code
			}
			
			this.loginSubmit = function(){
				
				var userName = this.user.userName;
				var password = this.user.password;

				if(userName && password){
					//add in login service here
				} 
			};

			$scope.$watch('api.code', function(){

				if($scope.NavBarCtrl.api.code == Constant.NOTIFICATION.ACTION.USER_REGISTER.SUCCESS.code){

					$scope.NavBarCtrl.isLogin  = true;
				}
			})

			return $scope.NavBarCtrl = this;
		},
	}

	app.controller('HomePartialCtrl', ['$scope', 'AjaxNotificationService', Controller.HomePartialCtrl]);
	app.controller('NavBarCtrl', ['$scope', 'AjaxNotificationService', Controller.NavBarCtrl]);
}) 
