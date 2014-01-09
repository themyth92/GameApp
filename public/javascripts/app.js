define([], function(){
	var myApp = angular.module('myApp', ['ngRoute', 'ngAnimate']);

	myApp.config(['$routeProvider', function($routeProvider){

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

