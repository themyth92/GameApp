define(['app'], function(app){

	var UserRegisterService = function($http, $q){

		return {
			register : function(data){

				var deffered = $q.defer();
			
				$http({
					method : 'POST',
					url : Constant.URL.ACTION.USER_REGISTER.url,
					data : data,
					timeout: Constant.TIMEOUT.TIMEOUT_SERVER.time
				}).
				success(function(data, status, header, config){
					deffered.resolve(data);
				}).
				error(function(){
					deffered.reject();
				});

				return deffered.promise;		
			}
		}
	};

	var UserLoginService = function($http, $q){

		return {
			loginUser : function(data){

				var deffered = $q.defer();

				$http({
					method : 'POST',
					url : Constant.URL.ACTION.USER_LOGIN.url,
					data : data,
					timeout: Constant.TIMEOUT.TIMEOUT_SERVER.time
				}).
				success(function(data, status, header, config){
					deffered.resolve(data);
				}).
				error(function(){
					deffered.reject();
				});

				return deffered.promise;	
			}
		}
	};

	var UserLogoutService = function($http, $q){

		return {
			logoutUser : function(){

				var deffered = $q.defer();

				$http({
					method: 'POST',
					url : Constant.URL.ACTION.USER_LOGOUT.url,
				}).
				success(function(data){
					deffered.resolve(data);
				}).
				error(function(){
					deffered.reject();
				});

				return deffered.promise;
			}
		}
	}

	var BroadCastService = function($rootScope){
		
		return {
			broadCastEvent : function(eventName, code, data){

				if(code){
					if(data){
						$rootScope.$broadcast(eventName, {code : code, data : data});
						console.log('Broadcast event ' + eventName + ' with code = ' + code);	
					}
					else{
						$rootScope.$broadcast(eventName, {code : code});
						console.log('Broadcast event ' + eventName + ' with code = ' + code);
					}
				}
				else{
					$rootScope.$broadcast(eventName);
					console.log('Broadcast event ' + eventName);
				}
			}
		}
	};

	var StoreSessionService = function($http, $q){

		var sessionService = {};
		
		sessionService.state = {
			
			isLogin  : false,
			userName : ''
		}

		sessionService.changeLoginState = function(state, userName){
			sessionService.state.isLogin = state;
			sessionService.state.userName = userName;
		}

		sessionService.authenticateSession = function(){

			var deffered = $q.defer();

			$http({
					method : 'GET',
					url : Constant.URL.ACTION.USER_AUTHENTICATE.url
				}).
				success(function(data, status, header, config){
					deffered.resolve(data);
				}).
				error(function(){
					deffered.reject();
				});

			return deffered.promise;
		}

		return sessionService;
	}
	
	app.factory('UserRegisterService', ['$http', '$q', UserRegisterService]);
	app.factory('UserLoginService', ['$http', '$q', UserLoginService]);
	app.factory('BroadCastService', ['$rootScope', BroadCastService]);
	app.factory('StoreSessionService',['$http', '$q', StoreSessionService]);
	app.factory('UserLogoutService', ['$http', '$q', UserLogoutService]);
}) 