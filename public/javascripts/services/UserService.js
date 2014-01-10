define(['app'], function(app){
	var Constant = {

		Url : {
			USER_REGISTER : '/user/register'
		},
		Broadcast :{
			USER_LOGIN : '101',
			USER_LOGOUT : '201'
		}
	}

	var UserRegisterService = function($http){
		
		var method = {
			register : function(data, successCallBack, errorCallBack){
				
				$http({
					method : 'POST',
					url : Constant.Url.USER_REGISTER,
					data : data
				}).
				success(successCallBack).
				error(errorCallBack);

			}
		}

		return method;
	};

	var	UserCredentialBroadcastService = function($rootScope){
		
		var method = {
			
			login : function(){
				$rootScope.$broadcast(Constant.Broadcast.USER_LOGIN);
			},

			logout : function(){
				$rootScope.$broadcast(Constant.Broadcast.USER_LOGOUT);
			}
		}

		return method;
	};
	
	app.factory('UserRegisterService', ['$http', UserRegisterService]);
	app.factory('UserCredentialBroadcastService', ['$rootScope', UserCredentialBroadcastService]);
}) 
