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

		NavBarCtrl : function($scope, $location, loginService, broadCastService, sessionService, userLogoutService, socketService, DataService){

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

			$scope.$watch(function(){return DataService.firstTimeLoadQuestionListPage},function(){
				
				if(DataService.firstTimeLoadQuestionListPage == false){
					
					socketService.on('send:newQuestion', function(data){
						DataService.pushNewQuestion(data);
						broadCastService.broadCastEvent('newQuestionAdded');
					})	
				}
				
			});

			$scope.$watch(function(){return DataService.firstTimeLoadCheckStudentQuestionPage}, function(){

				if(DataService.firstTimeLoadCheckStudentQuestionPage == false){

					socketService.on('addedYourNewQuestion', function(data){
						DataService.pushEachStudentQuestion(data);
						broadCastService.broadCastEvent('yourQuestionAdded');
					})

					socketService.on('teachHasCheckedOneQuestion', function(data){
						DataService.checkedTeacherQuestionFitMyQuestion(data);
						broadCastService.broadCastEvent('teacherHasCheckedQuestion');
					})
				}
			})

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

		QuestionListCtrl : function($scope, DataService, $q, SocketService, broadCastService){

			var self = this;

			function processQuestionList(){

				var dataSendBack = [];

				angular.forEach(self.questionList, function(question){

					if(question.correct == '1' || question.correct == '2'){

						var obj        = {};
						obj.id         = question._id || '';
						obj.questionID = question.questionID || '';
						obj.comment    = question.comment || '';
						obj.correct    = question.correct;
						dataSendBack.push(obj); 
					}	
				})

				return dataSendBack;
			}

			function removeAnsweredQuestion(){
				
				var obj = [];
				
				angular.forEach(self.questionList, function(question){

					if(question.correct == '3'){
						obj.push(question);
					}
				})

				self.questionList = obj;
				DataService.questionList = obj;
			}

			function uploadToServer(data){

				var deffered = $q.defer();

				SocketService.emit('teacherUpdateQuestionList', data);
				SocketService.once('teacherUpdateQuestionList', function(){
					deffered.resolve();
				})

				return deffered.promise;
			}

			self.questionList = DataService.questionList;


			$scope.$on('newQuestionAdded', function(){
				self.questionList = DataService.questionList;
			})

			self.save = function(){

				var data = processQuestionList();
				
				if(data.length > 0){
				
					var eventName = Constant.NOTIFICATION.ACTION.UPLOAD_QUESTION_LIST.name;
					broadCastService.broadCastEvent(eventName, Constant.NOTIFICATION.ACTION.UPLOAD_QUESTION_LIST.code);
					
					uploadToServer(data).then(function(){
						
						var eventName = Constant.NOTIFICATION.ACTION.UPLOAD_QUESTION_LIST.name;
						broadCastService.broadCastEvent(eventName, '206');
						removeAnsweredQuestion();
					})
				}
				else{
					return false;
				}
			}
			
			return $scope.QuestionListCtrl = this;
		},

		StudentQuestionCheckCtrl : function($scope, DataService){

			var self = this;
			self.QuestionList = DataService.eachStudentQuestionList;

			$scope.$on('yourQuestionAdded', function(){
				self.QuestionList = DataService.eachStudentQuestionList;
			})

			$scope.$on('teacherHasCheckedQuestion', function(){
				self.QuestionList = DataService.eachStudentQuestionList;	
			})
			return $scope.StudentQuestionCheckCtrl = this;
		},

		CreateFlashGameCtrl : function($scope, resolveData, DataService, $window, FlashComService){

			$window.returnUserQuestionListAndImage = function(){

				return FlashComService.listQuestionAndImageToFlash(resolveData);
			}
		},

		GameGalleryCtrl : function($scope){

		},

		QuestionPollCtrl : function($scope){

		},

		StudentChatCtrl : function($scope, sessionService, socketService){


			var self 			= 	this;	
			var onSocket		= 	false;

			function processChatData(data){

				if(data && data.data.isTeacher && data.data.message && data.data.userName && data.data.toStudent){
					if(data.data.isTeacher == true && data.data.toStudent == self.user.userName){
						self.chats.push({userName : data.data.userName, message:data.data.message});
					}
				}
			}

			self.user 			= 	{}
			self.chats 		 	= 	[];
			self.isCollapsed 	= 	true;
			self.userMessage	= 	'';
			self.user.isLogin	=	sessionService.state.isLogin;
			self.user.userName  = 	sessionService.state.userName;
			self.user.isTeacher =   sessionService.state.isTeacher;
			
			$scope.$watch(function(){return sessionService.state.isLogin}, function(){
				self.user.isLogin	=	sessionService.state.isLogin;
				self.user.isTeacher = 	sessionService.state.isTeacher;
				self.user.userName 	= 	sessionService.state.userName;

				if(self.user.isLogin == true && onSocket == false){
					socketService.on('sendChat', function(data){
						processChatData(data);
					})

					onSocket = true;
				}
			});

			self.toggleChatBox = function(){
				self.isCollapsed = !self.isCollapsed;
			}

			self.submitChat = function(){
				self.chats.push({userName : self.user.userName, message : self.userMessage});
				socketService.emit('sendChat', {userName : self.user.userName, message : self.userMessage, isStudent : true});
				self.userMessage	=	'';
			}

			return $scope.StudentChatCtrl = this;
		},

		TeacherChatCtrl : function($scope, sessionService, socketService){

			var self 			= 	this;
			
			function processChatData(data){

				if(data && data.data.userName && data.data.message && data.data.isStudent){
					

					for(var i = 0 ; i < self.chatWindows.length; i++){
						
						//restore chat session
						if(self.chatWindows[i].studentName == data.data.userName){
							self.chatWindows[i].userMessage.push({message : data.data.message, userName : data.data.userName});
							return true;
						}
					}

					//create new session
					self.chatWindows.push({studentName : data.data.userName, userMessage : [], curChatMsg : '', isCollapsed : false});
					self.chatWindows[self.chatWindows.length - 1].userMessage.push({message : data.data.message, userName : data.data.userName});

					return true;					
				}
			}

	
			var onSocket		= 	false;

			self.user 			= 	{}
			self.chatWindows 	= 	[];
			self.userMessage	= 	'';
			self.user.isLogin	=	sessionService.state.isLogin;
			self.user.userName  = 	sessionService.state.userName;
			self.user.isTeacher =   sessionService.state.isTeacher;
			
			$scope.$watch(function(){return sessionService.state.isLogin}, function(){
				self.user.isLogin	=	sessionService.state.isLogin;
				self.user.isTeacher = 	sessionService.state.isTeacher;
				self.user.userName 	= 	sessionService.state.userName;

				if(self.user.isLogin == true && onSocket == false){
					
					socketService.on('sendChat', function(data){
						processChatData(data);
					});

					onSocket = true;
				}
			});

			self.submitChat = function($index){

				self.chatWindows[$index].userMessage.push({message : self.chatWindows[$index].curChatMsg, userName : self.user.userName});
				socketService.emit('sendChat', {isTeacher : true, message : self.chatWindows[$index].curChatMsg, userName : self.user.userName, toStudent : self.chatWindows[$index].studentName});
				self.chatWindows[$index].curChatMsg = '';
				$('#teacher-box-' + $index).scrollTop = $('#teacher-box-' + $index).scrollHeight;
			}

			self.toggleChatBox = function($index){
				self.chatWindows[$index].isCollapsed = !self.chatWindows[$index].isCollapsed;
			}

			self.closeChatBox = function($index){
				self.chatWindows.splice($index, 1);
			}

			return $scope.TeacherChatCtrl = this;
		}	
	}

	app.controller('HomePartialCtrl', ['$scope', 'StoreSessionService', Controller.HomePartialCtrl]);
	app.controller('NavBarCtrl', ['$scope', '$location','UserLoginService', 'BroadCastService', 'StoreSessionService', 'UserLogoutService', 'SocketService', 'DataService', Controller.NavBarCtrl]);
	app.controller('FileUploadCtrl', ['$scope', 'BroadCastService', 'UploadService', 'SocketService', Controller.FileUploadCtrl]);
	app.controller('QuestionListCtrl', ['$scope','DataService', '$q', 'SocketService', 'BroadCastService',Controller.QuestionListCtrl]);
	app.controller('StudentQuestionCheckCtrl', ['$scope', 'DataService', Controller.StudentQuestionCheckCtrl]);
	app.controller('CreateFlashGameCtrl', ['$scope', 'resolveData', 'DataService', '$window', 'FlashComService', Controller.CreateFlashGameCtrl]);
	app.controller('GameGalleryCtrl' ,['$scope', Controller.GameGalleryCtrl]);
	app.controller('QuestionPollCtrl' ,['$scope', Controller.QuestionPollCtrl]);
	app.controller('StudentChatCtrl', ['$scope', 'StoreSessionService', 'SocketService',Controller.StudentChatCtrl]);
	app.controller('TeacherChatCtrl' , ['$scope', 'StoreSessionService', 'SocketService', 'DataService', Controller.TeacherChatCtrl]);
}) 
