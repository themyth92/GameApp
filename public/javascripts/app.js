define([], function(){
	var myApp = angular.module('myApp', ['ngRoute', 'ngAnimate', 'ngResource']);

	myApp.config(['$routeProvider', '$controllerProvider', '$provide', 
		function($routeProvider, $controllerProvider, $provide){

			$routeProvider.
				when('/home', {
					templateUrl : 'partials/home.html',
					controller : 'HomePartialCtrl'
				}).
				otherwise({
					redirectTo : '/home'
				})
	}])

	myApp.run(['StoreSessionService', function(sessionService){
		
		sessionService.authenticateSession().then(function(data){
			console.log(data);
		//	sessionService.changeLoginState(true, 'vcl');
		}, function(){
		//	sessionService.changeLoginState(false);
		})
	}])

	return myApp; 
})
