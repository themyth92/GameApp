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

		NavBarCtrl : function($scope, loginService, broadCastService, sessionService, userLogoutService){

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
						   sessionService.changeLoginState(true, $scope.NavBarCtrl.user.userName);
						   setUserLogin(true);
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
				isLogin : sessionService.state.isLogin,
				userName : '',
				password : ''
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
 					
		        	$scope.NavBarCtrl.user.isLogin  = true;
		        	$scope.NavBarCtrl.user.userName = args.data.userName;
		        }
		        else{

		          $scope.NavBarCtrl.user.isLogin  = false;
		    	}
		    })

		    this.logoutSubmit = function(){

		    	var eventName = Constant.NOTIFICATION.ACTION.USER_LOGOUT.name;

		    	userLogoutService.logoutUser().then(function(data){

		    		broadCastService.broadCastEvent(eventName);
		    		sessionService.changeLoginState(false);

		    	}, function(err){

		    		broadCastService.broadCastEvent(eventName);
		    		sessionService.changeLoginState(false);
		    		throw(err + ' in ' + Constant.DEBUG.LOCATION.NAV_BAR_CTRL);
		    	})
		    }

			$scope.$watch(function(){return sessionService.state.isLogin}, function(){$scope.NavBarCtrl.user.isLogin = sessionService.state.isLogin; $scope.NavBarCtrl.user.userName = sessionService.state.userName});

			return $scope.NavBarCtrl = this;
		},

		FileUploadCtrl : function($scope, broadCastService, uploadService){

			this.submitFile = function(){

				var eventName = Constant.NOTIFICATION.ACTION.FILE_UPLOAD.name;
				broadCastService.broadCastEvent(eventName, Constant.NOTIFICATION.ACTION.FILE_UPLOAD.code);
				
				if(uploadService.isAbleToSubmit.image && uploadService.isAbleToSubmit.question){
					console.log('ready to submit');
				}
				else{
					return false;
				}
			}

			return $scope.FileUploadCtrl = this;
		}
	}

	app.controller('HomePartialCtrl', ['$scope', 'StoreSessionService', Controller.HomePartialCtrl]);
	app.controller('NavBarCtrl', ['$scope', 'UserLoginService', 'BroadCastService', 'StoreSessionService', 'UserLogoutService', Controller.NavBarCtrl]);
	app.controller('FileUploadCtrl', ['$scope', 'BroadCastService', 'UploadService', Controller.FileUploadCtrl]);
}) 
