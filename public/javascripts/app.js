define(['module/ctrlModule'], function(){
	var myApp = angular.module('myApp', ['ngRoute', 'ngAnimate', 'ctrlModule']);

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
})

