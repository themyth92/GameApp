define([], function(){
	var myApp = angular.module('myApp', ['ngRoute', 'ngAnimate', 'ngResource', 'angularFileUpload', 'luegg.directives']);

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
				when('/checkYourQuestion', {
					templateUrl : 'partials/yourQuestions.html',
					controller  : 'StudentQuestionCheckCtrl',
					resolve     : {

						resolveData2 : ['ControllerResolverService', 'DataService', '$location', 'StoreSessionService', 

							function(ControllerResolverService, DataService, $location, SessionService){
							
								if(DataService.firstTimeLoadApp == true || SessionService.isLogin == false){
									$location.path('/home');
								}
								else{
									if(DataService.firstTimeLoadCheckStudentQuestionPage){
										
										ControllerResolverService.StudentQuestionCheckResolver().then(function(data){
											DataService.processEachStudentQuestion(data);
											DataService.firstTimeLoadCheckStudentQuestionPage = false;
										})
									}
									
							}
					}]}
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
				when('/createYourGame', {
					templateUrl : 'partials/createYourGame.html',
					controller  : 'CreateFlashGameCtrl',
					resolve : {
						resolveData : ['ControllerResolverService', 'DataService', '$location', 'StoreSessionService',

						function(ControllerResolverService, DataService, $location, SessionService){
							if(DataService.firstTimeLoadApp == true || SessionService.isLogin == false){
								$location.path('/home');
							}
							else{
								return ControllerResolverService.CreateGameResolver().then(function(data){
									return data;
								});
							}
						}]
					}
				}).
				when('/gallery', {
					templateUrl : 'partials/gallery.html',
					controller  : 'GameGalleryCtrl',
				}).
				when('/questionPoll', {
					templateUrl : 'partials/questionPoll.html',
					controller  : 'QuestionPollCtrl',
				}).
				otherwise({
					redirectTo : '/home'
				})
	}])

	return myApp; 
})
