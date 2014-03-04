define(['app'], function(app){
	app.factory('ControllerResolverService', ['StoreSessionService', 'DataService', 'SocketService','$q', '$location', function(SessionService, DataService, SocketService, $q, $location){
		
		function checkDataFromAuthentication(data){
		
			if(data){

				if(data.data){
					
					if(data.data._id && data.data.userName){

						var userName  = data.data.userName;
						var isTeacher = data.data.isTeacher;
						SessionService.changeLoginState(true, userName, isTeacher);
						SocketService.establishConnection();
						DataService.firstTimeLoadApp = false;
						return true;
					}
				}		
			}

			DataService.firstTimeLoadApp = false;
			return false;		
		}

		return {
	
			HomeResolver : function(){	

				if(DataService.firstTimeLoadApp == true){
					SessionService.authenticateSession().then(function(data){
						checkDataFromAuthentication(data);
					})
				}
				else
					return;
			},

			QuestionListResolver : function(){
				
				var deffered = $q.defer();
				SocketService.emit('retrieveQuestionList');
				SocketService.once('retrieveQuestionList', function(data){
					if(data)
						deffered.resolve(data);
					else
						deffered.reject(data);	
				})

				return deffered.promise;
			},

			UploadResolver : function(){
				if(DataService.firstTimeLoadApp == true || SessionService.isLogin == false){
					$location.path('/home');
				}
				else
					return;
			}
		}
	}])
})