define(['app'], function(app){
	app.
		factory('UserRegisterService', ['$resource', function($resource){
		return $resource('/user/register');
	}])
}) 
