define(['app'], function(app){

	var UserRegisterService = function($http, $q){

		return {
			register : function(data){

				var deffered = $q.defer();
			
				$http({
					method : 'POST',
					url : Constant.URL.ACTION.USER_REGISTER.url,
					data : data
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
					data : data
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

	var StoreSessionService = function(){

		var sessionService = {};
		
		sessionService.state = {
			
			isLogin  : false
		}

		sessionService.changeLoginState = function(state){
			sessionService.state.isLogin = state;
		}

		return sessionService;
	}
	
	app.factory('UserRegisterService', ['$http', '$q', UserRegisterService]);
	app.factory('UserLoginService', ['$http', '$q', UserLoginService]);
	app.factory('BroadCastService', ['$rootScope', BroadCastService]);
	app.factory('StoreSessionService', StoreSessionService);
}) 