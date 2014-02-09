define(['app'], function(app){

	var Controller = {

		HomePartialCtrl : function($scope, sessionService){

			this.isLogin 	       = sessionService.state.isLogin;
			
			$scope.$on(Constant.NOTIFICATION.ACTION.USER_REGISTER.name, function(event, args){
				
				if (args.code && args.code == Constant.NOTIFICATION.ACTION.USER_REGISTER.SUCCESS.USER_REGISTER_SUCCESS.code){
					$scope.HomePartialCtrl.isLogin  = true;
				}
				else{
					$scope.HomePartialCtrl.isLogin  = false;
				}
			});

			$scope.$on(Constant.NOTIFICATION.ACTION.USER_LOGIN.name, function(event, args){
				
				if (args.code && args.code == Constant.NOTIFICATION.ACTION.USER_LOGIN.SUCCESS.USER_LOGIN_SUCCESS.code){
					$scope.HomePartialCtrl.isLogin  = true;
				}
				else{
					$scope.HomePartialCtrl.isLogin  = false;
				}
			});

			$scope.$on(Constant.NOTIFICATION.ACTION.USER_LOGOUT.name, function(){
				$scope.HomePartialCtrl.isLogin  = false;
			});

			return $scope.HomePartialCtrl = this;
		},

		NavBarCtrl : function($scope, $location, loginService, broadCastService, sessionService, userLogoutService, socketService){

			function UserLoginSuccessHandle(data){
				
				data          = data || {};
				data.code     = data.code || Constant.ERROR.FAILED_RECEIVE_CORRECT_FORMAT_DATA_FROM_SERVER.code;

				var eventName = Constant.NOTIFICATION.ACTION.USER_LOGIN.name;
				
				switch(data.code){
					
					case  Constant.ERROR.FAILED_RECEIVE_CORRECT_FORMAT_DATA_FROM_SERVER.code :
							
							broadCastService.broadCastEvent(eventName, data.code);
							sessionService.changeLoginState(false, '');
							setUserLogin(false);
							throw(Constant.DEBUG.ERROR.FAILED_RECEIVE_CORRECT_FORMAT_DATA_FROM_SERVER.message);
						    break;

					case Constant.NOTIFICATION.ACTION.USER_LOGIN.ERROR.USER_LOGIN_FAIL.code :
						   
						   sessionService.changeLoginState(false, '');
						   broadCastService.broadCastEvent(eventName, data.code);
						   setUserLogin(false);
						   break;

					case Constant.NOTIFICATION.ACTION.USER_LOGIN.SUCCESS.USER_LOGIN_SUCCESS.code :

						   //need add data here about user login credential
						   broadCastService.broadCastEvent(eventName, data.code);
						   sessionService.changeLoginState(true, $scope.NavBarCtrl.user.userName, data.data.isTeacher);
						   setUserLogin(true);
						   socketService.establishConnection();
						   break;
					
					default :

						   broadCastService.broadCastEvent(eventName, Constant.NOTIFICATION.COMMON.SERVER_ERROR.code);
						   sessionService.changeLoginState(false, '');
						   setUserLogin(false);
						   throw('Unhandle case in '  +  Constant.DEBUG.LOCATION.USER_REGISTER_CTRL);
						   break;
				}			
			}

			function UserLoginErrorHandle(){

				var eventName = Constant.NOTIFICATION.ACTION.USER_LOGIN.name;
				broadCastService.broadCastEvent(eventName, Constant.ERROR.FAILED_RECEIVE_DATA_FROM_SERVER.code);
				throw(Constant.DEBUG.ERROR.FAILED_RECEIVE_DATA_FROM_SERVER.message + ' in ' + Constant.DEBUG.LOCATION.NAV_BAR_CTRL);
			}

			function setUserLogin(isLogin){
				
				if(isLogin)
					$scope.NavBarCtrl.user.isLogin = true;
				else
					$scope.NavBarCtrl.user.isLogin = false;
			}

			this.user = {
				isLogin   : sessionService.state.isLogin,
				userName  : '',
				password  : '',
				isTeacher : sessionService.state.isTeacher
			};

			this.loginSubmit  = function(){

				var userName  = this.user.userName;
				var password  = this.user.password;
				var eventName = Constant.NOTIFICATION.ACTION.USER_LOGIN.name;

				try{
					if(userName && password){

						broadCastService.broadCastEvent(eventName, Constant.NOTIFICATION.ACTION.USER_LOGIN.code);
						loginService.loginUser({userName : userName, password : password}).then(function(data){
													UserLoginSuccessHandle(data);
											   }, function(){
											   		UserLoginErrorHandle();
											   });
					}
				}
				catch(error){
					throw(error + ' in ' + Constant.DEBUG.LOCATION.NAV_BAR_CTRL);
				} 
			};

			$scope.$on(Constant.NOTIFICATION.ACTION.USER_REGISTER.name, function(event, args){
  
         		if(args.code && 
         		   args.code == Constant.NOTIFICATION.ACTION.USER_REGISTER.SUCCESS.USER_REGISTER_SUCCESS.code &&
         		   args.data &&
         		   args.data.userName){
 					
		        	$scope.NavBarCtrl.user.isLogin   = true;
		        	$scope.NavBarCtrl.user.userName  = args.data.userName;
		        	$scope.NavBarCtrl.user.isTeacher = args.data.isTeacher; 
		        }
		        else{

		          $scope.NavBarCtrl.user.isLogin   = false;
		          $scope.NavBarCtrl.user.isTeacher = false;
		    	}
		    })

		    this.logoutSubmit = function(){

		    	var eventName = Constant.NOTIFICATION.ACTION.USER_LOGOUT.name;
		    	
		    	userLogoutService.logoutUser().then(function(data){

		    		broadCastService.broadCastEvent(eventName);
		    		sessionService.changeLoginState(false);
		    		$location.path('/home');
		    		socketService.closeConnection();	
		    	}, function(err){

		    		broadCastService.broadCastEvent(eventName);
		    		sessionService.changeLoginState(false);
		    		$location.path('/home');
		    		socketService.closeConnection();
		    		throw(err + ' in ' + Constant.DEBUG.LOCATION.NAV_BAR_CTRL);
		    	})
		    }

			$scope.$watch(function(){return sessionService.state.isLogin}, function(){
				$scope.NavBarCtrl.user.isLogin   = sessionService.state.isLogin; 
				$scope.NavBarCtrl.user.userName  = sessionService.state.userName;
				$scope.NavBarCtrl.user.isTeacher = sessionService.state.isTeacher;
			});

			return $scope.NavBarCtrl = this;
		},

		FileUploadCtrl : function($scope, broadCastService, uploadService, socketService){

			function isReadyToUpload(){

				if($scope.FileUploadCtrl.images.length == 0 && $scope.FileUploadCtrl.questions.length == 0){
					
					uploadService.isAbleToSubmit.image    = false;
					uploadService.isAbleToSubmit.question = false;
					return false;
				}

				if($scope.FileUploadCtrl.images.length == 0){
					uploadService.isAbleToSubmit.image = true;
				}

				if($scope.FileUploadCtrl.questions.length == 0){
					uploadService.isAbleToSubmit.question = true;
				}

				if(uploadService.isAbleToSubmit.image && uploadService.isAbleToSubmit.question)
					return true;
				else
					return false;
			}

			function uploadImageSuccessHandle(data, index){

				if(index == $scope.FileUploadCtrl.images.length - 1){
					
					if($scope.FileUploadCtrl.questions.length > 0){
						
						socketService.emit(Constant.SOCKET.sendQuestion, $scope.FileUploadCtrl.questions, uploadQuestionSuccessHandle);
					}
					else{
						
						data      	  = data || {};
						data.code 	  = data.code || Constant.ERROR.FAILED_RECEIVE_CORRECT_FORMAT_DATA_FROM_SERVER.code;
						var eventName = Constant.NOTIFICATION.ACTION.FILE_UPLOAD.name; 

						switch(data.code){

							case Constant.ERROR.FAILED_RECEIVE_CORRECT_FORMAT_DATA_FROM_SERVER.code:
								
								broadCastService.broadCastEvent(eventName, data.code);
								throw(Constant.DEBUG.ERROR.FAILED_RECEIVE_CORRECT_FORMAT_DATA_FROM_SERVER.message);
							break;
							
							case Constant.ERROR.FAILED_RECEIVE_DATA_FROM_SERVER.code:

								broadCastService.broadCastEvent(eventName, data.code);
							break;

							case Constant.NOTIFICATION.ACTION.FILE_UPLOAD.SUCCESS.UPLOAD_SUCCESS.code:

								broadCastService.broadCastEvent(Constant.NOTIFICATION.ACTION.FILE_UPLOAD.name, Constant.NOTIFICATION.ACTION.FILE_UPLOAD.SUCCESS.UPLOAD_SUCCESS.code);
							break;

							case Constant.NOTIFICATION.ACTION.FILE_UPLOAD.ERROR.UPLOAD_SESSION_ERROR.code:

								broadCastService.broadCastEvent(eventName, data.code);
							break;

							case Constant.NOTIFICATION.ACTION.FILE_UPLOAD.ERROR.UPLOAD_IMAGE_ERROR.code :
								
								broadCastService.broadCastEvent(eventName, data.code);
							break;
							default:

								broadCastService.broadCastEvent(eventName, Constant.NOTIFICATION.COMMON.SERVER_ERROR.code);
								throw('Unhandle error in '  +  Constant.DEBUG.LOCATION.FILE_UPLOAD_CTRL);
							break;
						}

						restartScreen();
					}
				}
				else{
					index++;
					
					data      	  = data || {};
					data.code 	  = data.code || Constant.ERROR.FAILED_RECEIVE_CORRECT_FORMAT_DATA_FROM_SERVER.code;
					var eventName = Constant.NOTIFICATION.ACTION.FILE_UPLOAD.name; 

					switch(data.code){

						case Constant.ERROR.FAILED_RECEIVE_CORRECT_FORMAT_DATA_FROM_SERVER.code:
							
							broadCastService.broadCastEvent(eventName, data.code);
							throw(Constant.DEBUG.ERROR.FAILED_RECEIVE_CORRECT_FORMAT_DATA_FROM_SERVER.message);
						break;
						
						case Constant.ERROR.FAILED_RECEIVE_DATA_FROM_SERVER.code:

							broadCastService.broadCastEvent(eventName, data.code);
						break;

						case Constant.NOTIFICATION.ACTION.FILE_UPLOAD.SUCCESS.UPLOAD_SUCCESS.code:

							uploadService.uploadImage($scope.FileUploadCtrl.images[index], uploadImageSuccessHandle, uploadErrorHandle, index);
						break;

						case Constant.NOTIFICATION.ACTION.FILE_UPLOAD.ERROR.UPLOAD_SESSION_ERROR.code:

							broadCastService.broadCastEvent(eventName, data.code);
						break;

						case Constant.Constant.NOTIFICATION.ACTION.FILE_UPOAD.ERROR.UPLOAD_IMAGE_ERROR.code :
							
							broadCastService.broadCastEvent(eventName, data.code);
						default:

							broadCastService.broadCastEvent(eventName, Constant.NOTIFICATION.COMMON.SERVER_ERROR.code);
							throw('Unhandle error in '  +  Constant.DEBUG.LOCATION.FILE_UPLOAD_CTRL);
						break;
					}
				}
			}

			function uploadQuestionSuccessHandle(datas){

				var eventName = Constant.NOTIFICATION.ACTION.FILE_UPLOAD.name; 
				broadCastService.broadCastEvent(Constant.NOTIFICATION.ACTION.FILE_UPLOAD.name, Constant.NOTIFICATION.ACTION.FILE_UPLOAD.SUCCESS.UPLOAD_SUCCESS.code);	
				restartScreen();
			}

			function uploadErrorHandle(){
				
				var eventName = Constant.NOTIFICATION.ACTION.FILE_UPLOAD.name;
				broadCastService.broadCastEvent(eventName, Constant.ERROR.FAILED_RECEIVE_DATA_FROM_SERVER);
				restartScreen();
				throw(Constant.DEBUG.ERROR.FAILED_RECEIVE_DATA_FROM_SERVER.message + ' in ' + Constant.DEBUG.LOCATION.FILE_UPLOAD_CTRL);
			}

			function restartScreen(){

				$scope.FileUploadCtrl.images    = [];
				$scope.FileUploadCtrl.questions = [];
			}

			this.images    = [];
			this.questions = [];

			this.submitFile = function(){

				var eventName = Constant.NOTIFICATION.ACTION.FILE_UPLOAD.name;

				$scope.$broadcast(Constant.NOTIFICATION.ACTION.FILE_UPLOAD.PARTIAL.UPLOAD_CHECKING.name);
			}

			$scope.$on(Constant.NOTIFICATION.ACTION.FILE_UPLOAD.PARTIAL.UPLOAD_CHECKED.name, function(event, args){

				if(args.code){
					
					if(args.code == Constant.NOTIFICATION.ACTION.FILE_UPLOAD.PARTIAL.UPLOAD_CHECKED.IMAGE.code){
						
						if(isReadyToUpload()){

							broadCastService.broadCastEvent(Constant.NOTIFICATION.ACTION.FILE_UPLOAD.name, Constant.NOTIFICATION.ACTION.FILE_UPLOAD.code);
							var index = 0;
							uploadService.uploadImage($scope.FileUploadCtrl.images[index], uploadImageSuccessHandle, uploadErrorHandle, index);			
						}
						else
							return false;
					}
					else
						if(args.code == Constant.NOTIFICATION.ACTION.FILE_UPLOAD.PARTIAL.UPLOAD_CHECKED.QUESTION.code){
							
							if(isReadyToUpload()){
								
								broadCastService.broadCastEvent(Constant.NOTIFICATION.ACTION.FILE_UPLOAD.name, Constant.NOTIFICATION.ACTION.FILE_UPLOAD.code);
								
								if($scope.FileUploadCtrl.images.length > 0){
									var index = 0;
									uploadService.uploadImage($scope.FileUploadCtrl.images[index], uploadImageSuccessHandle, uploadErrorHandle, index);			
								}
								else{

									socketService.emit(Constant.SOCKET.sendQuestion, $scope.FileUploadCtrl.questions, uploadQuestionSuccessHandle);	
								}
								
							}
							else
								return false;
						}
					else
						throw('Unhandle error in ' + Constant.DEBUG.LOCATION.FILE_UPLOAD_CTRL);
				}
				else
					throw('Unhandle error in ' + Constant.DEBUG.LOCATION.FILE_UPLOAD_CTRL);
			})
			
			socketService.on(Constant.SOCKET.receiveQuestionUploadResult, uploadQuestionSuccessHandle);

			return $scope.FileUploadCtrl = this;
		},

		QuestionListCtrl : function($scope, questionListRetrieveServive, broadCastService, uploadService){

			function retrieveListFromData(data){

				if(data.data){

					for(var i = 0 ; i < data.data.length ; i++){

						data.data[i].question = data.data[i].question || [];
						for(var j = 0 ; j < data.data[i].question.length; j++){

							var obj 	   = {};
							var partial    = data.data[i]               || {};
							obj.userName   = partial.userName 			|| 'None';
							obj._id        = partial._id      			|| 'None';
							obj.title      = partial.question[j].title  || 'None';
							obj.select     = partial.question[j].select || 'None';
							obj.answers    = partial.question[j].answers|| [];
							obj.questionID = partial.question[j]._id    || 'None';
							obj.correct    = false;

							$scope.QuestionListCtrl.questionList.push(obj);
						}	
					}
				}
			}

			function retrieveQuestionListSuccessHandle(data){
				
				data      	  = data || {};
				data.code 	  = data.code || Constant.ERROR.FAILED_RECEIVE_DATA_FROM_SERVER;
				
				var eventName = Constant.NOTIFICATION.ACTION.RETRIEVE_QUESTION_LIST.name
				broadCastService.broadCastEvent(eventName, data.code);
				retrieveListFromData(data);
			}

			function retrieveQuestionListErrorHandle(error){

				var eventName = Constant.NOTIFICATION.ACTION.RETRIEVE_QUESTION_LIST.name;
				broadCastService.broadCastEvent(eventName, Constant.ERROR.FAILED_RECEIVE_DATA_FROM_SERVER);
				throw(Constant.DEBUG.ERROR.FAILED_RECEIVE_DATA_FROM_SERVER.message + ' in ' + Constant.DEBUG.LOCATION.QUESTION_LIST_CTRL);
			}

			function retrieveQuestionList(){

				broadCastService.broadCastEvent(Constant.NOTIFICATION.ACTION.RETRIEVE_QUESTION_LIST.name, Constant.NOTIFICATION.ACTION.RETRIEVE_QUESTION_LIST.code);
				questionListRetrieveServive.retrieveList().then(function(data){
					retrieveQuestionListSuccessHandle(data);
				}, function(error){
					retrieveQuestionListErrorHandle(error);
				})
			}

			function processQuestionList(){
				
				var dataSendBack = [];
				
				angular.forEach($scope.QuestionListCtrl.questionList, function(question){

					if(question.correct && question.correct == true){

						var obj        = {};
						obj.id         = question._id || '';
						obj.questionID = question.questionID || '';
						dataSendBack.push(obj); 
					}	
				})
				
				return dataSendBack;
			}

			function saveQuestionListSuccessHandle(data){

				data      	  = data || {};
				data.code 	  = data.code || Constant.ERROR.FAILED_RECEIVE_DATA_FROM_SERVER;
				
				var eventName = Constant.NOTIFICATION.ACTION.UPLOAD_QUESTION_LIST.name
				broadCastService.broadCastEvent(eventName, data.code);
			}

			function saveQuestionListErrorHandle(){

				var eventName = Constant.NOTIFICATION.ACTION.RETRIEVE_QUESTION_LIST.name;
				broadCastService.broadCastEvent(eventName, Constant.ERROR.FAILED_RECEIVE_DATA_FROM_SERVER.code);
				throw(Constant.DEBUG.ERROR.FAILED_RECEIVE_DATA_FROM_SERVER.message + ' in ' + Constant.DEBUG.LOCATION.QUESTION_LIST_CTRL);
			}

			this.questionList = [];
			
			this.save = function(){
				
				var data = processQuestionList();
				if(data){
					var eventName = Constant.NOTIFICATION.ACTION.UPLOAD_QUESTION_LIST.name;
					broadCastService.broadCastEvent(eventName, Constant.NOTIFICATION.ACTION.UPLOAD_QUESTION_LIST.code);
					uploadService.uploadQuestionList(data).then(function(data){
						saveQuestionListSuccessHandle(data);
					}, function(error){
						saveQuestionListErrorHandle();
					})
				}
				else{
					return false;
				}
			}

			retrieveQuestionList();
			
			return $scope.QuestionListCtrl = this;
		},
	}

	app.controller('HomePartialCtrl', ['$scope', 'StoreSessionService', Controller.HomePartialCtrl]);
	app.controller('NavBarCtrl', ['$scope', '$location','UserLoginService', 'BroadCastService', 'StoreSessionService', 'UserLogoutService', 'SocketService', Controller.NavBarCtrl]);
	app.controller('FileUploadCtrl', ['$scope', 'BroadCastService', 'UploadService', 'SocketService', Controller.FileUploadCtrl]);
	app.controller('QuestionListCtrl', ['$scope', 'QuestionListRetrieveService' ,'BroadCastService', 'UploadService', Controller.QuestionListCtrl]);
}) 
