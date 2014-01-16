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
		
		function checkDataFromAuthentication(data){
		
			if(data){

				if(data.data){
					
					if(data.data._id && data.data.userName){

						var userName = data.data.userName;
						sessionService.changeLoginState(true, userName);

						return true;
					}
				}		
			}

			sessionService.changeLoginState(false);
			return false;		
		}

		sessionService.authenticateSession().then(function(data){
			checkDataFromAuthentication(data);
		}, function(){
			sessionService.changeLoginState(false);
		})
	}])

	return myApp; 
})
