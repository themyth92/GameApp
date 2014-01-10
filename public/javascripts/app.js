define([], function(){
	var myApp = angular.module('myApp', ['ngRoute', 'ngAnimate', 'ngResource']);

	myApp.config(['$routeProvider', '$controllerProvider', '$provide', 
		function($routeProvider, $controllerProvider, $provide){

			$routeProvider.
				when('/home', {
					templateUrl : 'partials/home.html',
					controller : 'UserRegisterCtrl'
				}).
				otherwise({
					redirectTo : '/home'
				})
	}])

	return myApp; 
})


function NavBarCtrl(){
	
}
