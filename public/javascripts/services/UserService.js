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
	
	app.factory('UserRegisterService', ['$http', '$q', UserRegisterService]);
}) 