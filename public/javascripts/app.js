define([], function(){
	var myApp = angular.module('myApp', ['ngRoute', 'ngAnimate', 'ngResource', 'angularFileUpload']);

	myApp.config(['$routeProvider', '$controllerProvider', '$provide', 
		function($routeProvider, $controllerProvider, $provide){

			$routeProvider.
				when('/home', {
					templateUrl : 'partials/home.html',
					controller  : 'HomePartialCtrl'
				}).
				when('/upload',{
					templateUrl : 'partials/upload.html',
					controller  : 'FileUploadCtrl'
				}).
				when('/questionList',{
					templateUrl : 'partials/questionList.html',
					controller  : 'QuestionListCtrl'
				}).
				otherwise({
					redirectTo : '/home'
				})
	}])

	myApp.run(['StoreSessionService', '$rootScope', '$location','$route', function(sessionService, $rootScope, $location, $route){
		
		function registerRouteChage(){

			$rootScope.$on('$routeChangeStart', function(event, next, current){

				if(!(sessionService.state.isLogin)){
					$location.path('/home');
				}
				else{
					if(sessionService.state.isTeacher){
						if($location.path() == '/uploads'){
							$location.path('/home');			
						}
					}
					else{
						if($location.path() == '/questionList'){
							$location.path('/home');
						}
					}
				}
			})
		}

		function checkDataFromAuthentication(data){
		
			if(data){

				if(data.data){
					
					if(data.data._id && data.data.userName){

						var userName  = data.data.userName;
						var isTeacher = data.data.isTeacher;
						sessionService.changeLoginState(true, userName, isTeacher);
						registerRouteChage();
						return true;
					}
				}		
			}

			$location.path('/home');
			sessionService.changeLoginState(false);
			registerRouteChage();
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
