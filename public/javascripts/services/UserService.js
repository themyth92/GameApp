define(['app'], function(app){

	var UserRegisterService = function($http, $q){

		var registerService = {};
		var deffered = $q.defer();

		registerService.register = function(data){
			
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

		return registerService;
	};

	var BroadCastService = function($rootScope){
		
		return {
			broadCastEvent : function(eventName, code, data){

				if(data){
					$rootScope.$broadcast(eventName, {code : code, data : data});
					console.log('Broadcast event ' + eventName + ' with code = ' + code);	
				}
				else{
					$rootScope.$broadcast(eventName, {code : code});
					console.log('Broadcast event ' + eventName + ' with code = ' + code);
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
	app.factory('BroadCastService', ['$rootScope', BroadCastService]);
	app.factory('StoreSessionService', StoreSessionService);
}) 