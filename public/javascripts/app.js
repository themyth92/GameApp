define([], function(){
	var myApp = angular.module('myApp', ['ngRoute', 'ngAnimate', 'ngResource', 'angularFileUpload']);

	myApp.config(['$routeProvider', '$controllerProvider', '$provide', 
		function($routeProvider, $controllerProvider, $provide){

			$routeProvider.
				when('/home', {
					templateUrl : 'partials/home.html',
					controller  : 'HomePartialCtrl',
					resolve : {
						resolveData : ['ControllerResolverService', 'DataService',function(ControllerResolverService, DataService){
							if(DataService.firstTimeLoadApp == true){
								ControllerResolverService.HomeResolver();	
							}
							
					}]}
				}).
				when('/upload',{
					templateUrl : 'partials/upload.html',
					controller  : 'FileUploadCtrl',
					resolve : ['ControllerResolverService', function(ControllerResolverService){
						ControllerResolverService.UploadResolver();
					}]
				}).
				when('/questionList',{
					templateUrl : 'partials/questionList.html',
					controller  : 'QuestionListCtrl',
					resolve : { 

						resolveData : ['ControllerResolverService', 'DataService', '$location', 'StoreSessionService', 

						function(ControllerResolverService, DataService, $location, SessionService){
						
							if(DataService.firstTimeLoadApp == true || SessionService.isLogin == false || SessionService.isTeacher == false){
								$location.path('/home');
							}
							else{
								if(DataService.firstTimeLoadQuestionListPage){
								
									ControllerResolverService.QuestionListResolver().then(function(data){
										DataService.processQuestionListData(data);
										DataService.firstTimeLoadQuestionListPage = false;
									}, function(){

									})	
								}
							}
					}]}
				}).
				otherwise({
					redirectTo : '/home'
				})
	}])

	return myApp; 
})
