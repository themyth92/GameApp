define(['module/servicesModule'], function(service){
	service.factory('UserRegisterService', ['$resource', function($resource){
		return $resource('/user/register');
	}])
}) 
