define([], function(){
	var myApp = angular.module('myApp', ['ngRoute', 'ngAnimate', 'ngResource', 'angularFileUpload']);

	myApp.config(['$routeProvider', '$controllerProvider', '$provide', 
		function($routeProvider, $controllerProvider, $provide){

			$routeProvider.
				when('/home', {
					templateUrl : 'partials/home.html',
					controller : 'HomePartialCtrl'
				}).
				when('/upload',{
					templateUrl : 'partials/upload.html',
					controller : 'FileUploadCtrl'
				}).
				otherwise({
					redirectTo : '/home'
				})
	}])

	myApp.run(['StoreSessionService', '$rootScope', '$location', function(sessionService, $rootScope, $location){
		
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
			$location.path('/home');
			return false;		
		}

		sessionService.authenticateSession().then(function(data){
			checkDataFromAuthentication(data);
		}, function(){
			sessionService.changeLoginState(false);
		})

		$rootScope.$on('$routeChangeStart', function(event, next, current){
			
			if(!(sessionService.state.isLogin)){
				$location.path('/home');
			}
		})
	}])

	return myApp; 
})
