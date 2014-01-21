define(['app'], function(app){
	app.directive('AjaxLoading', ['$timeout', function($timeout){
		return {
			restrict : 'C',
			templateUrl : 'ajaxLoading.html',	
			
			controller : function($scope, $timeout){

				function changeStateToLoading(element){
					
					element.addClass('active ajax-status-loading');
					element.children('div').addClass('ajax-status-loading');
					element.find('.reloader').addClass('ajax-status-loading');
					element.find('.remove-status').addClass('ajax-status-loading');
				}

				function changeStateToSuccess(element){
					
					element.removeClass('ajax-status-loading');
					element.find('.reloader').removeClass('ajax-status-loading');
					element.children('div').addClass('ajax-status-success');
					element.find('.remove-status').removeClass('ajax-status-loading');
				}

				function changeStateToError(element){
					
					element.removeClass('ajax-status-loading');
					element.find('.reloader').removeClass('ajax-status-loading');
					element.children('div').addClass('ajax-status-error');
					element.find('.remove-status').removeClass('ajax-status-loading');	
				}

				function hideMessageTimeout(element){
					
					var promise = $timeout(function(){
						$scope.AjaxLoadingDirective.changeStateToNormal(element);
					}, Constant.TIMEOUT.MAXIMUM_TIME_MESSAGE_APPEAR.time);

					$scope.AjaxLoadingDirective.promise = promise;
				}

				function changeStatusMessage(code, element){
					
					if(code){

						if(code == Constant.NOTIFICATION.ACTION.USER_REGISTER.code ||
						   code == Constant.NOTIFICATION.ACTION.USER_LOGIN.code){

							$scope.AjaxLoadingDirective.changeStateToNormal(element);
							changeStateToLoading(element);
							$scope.AjaxLoadingDirective.status.message = Constant.NOTIFICATION.COMMON.LOADING.message;
							return false;
						}

						if(code == Constant.NOTIFICATION.ACTION.USER_REGISTER.ERROR.USER_ALREADY_REGISTER.code){
							
							changeStateToError(element);
							$scope.AjaxLoadingDirective.status.message = Constant.NOTIFICATION.ACTION.USER_REGISTER.ERROR.USER_ALREADY_REGISTER.message;
							hideMessageTimeout(element);	
							return false;
						}

						if(code == Constant.NOTIFICATION.ACTION.USER_REGISTER.SUCCESS.USER_REGISTER_SUCCESS.code){
							
							changeStateToSuccess(element);
							hideMessageTimeout(element);	
							$scope.AjaxLoadingDirective.status.message = Constant.NOTIFICATION.ACTION.USER_REGISTER.SUCCESS.USER_REGISTER_SUCCESS.message;
							return false;
						}

						if(code == Constant.NOTIFICATION.ACTION.USER_LOGIN.ERROR.USER_LOGIN_FAIL.code){

							changeStateToError(element);
							$scope.AjaxLoadingDirective.status.message = Constant.NOTIFICATION.ACTION.USER_LOGIN.ERROR.USER_LOGIN_FAIL.message;
							hideMessageTimeout(element);	
							return false;
						}

						if(code == Constant.NOTIFICATION.ACTION.USER_LOGIN.SUCCESS.USER_LOGIN_SUCCESS.code){

							changeStateToSuccess(element);
							$scope.AjaxLoadingDirective.status.message = Constant.NOTIFICATION.ACTION.USER_LOGIN.SUCCESS.USER_LOGIN_SUCCESS.message;
							hideMessageTimeout(element);	
							return false;
						}

						changeStateToError(element);
						$scope.AjaxLoadingDirective.status.message = Constant.NOTIFICATION.COMMON.SERVER_ERROR.message;
						return false;
					}
					else{

						$scope.AjaxLoadingDirective.status.message = '';
						$scope.AjaxLoadingDirective.changeStateToNormal(element);
						return false;
					}
				}

				this.status = {
					message : ''
				}

				this.promise = null;

				this.changeStateToNormal = function(element){

					element.removeClass('active ajax-status-loading ajax-status-success ajax-status-error');
					element.children('div').removeClass('ajax-status-loading ajax-status-success ajax-status-error');
					element.find('.reloader').removeClass('ajax-status-loading');
					element.find('.remove-status').removeClass('ajax-status-loading');
				}

				this.updateNotificationStatus = function(element, code){
					
					if(code){

						try{
							changeStatusMessage(code, element);
						}
						catch(error){
							throw(error + ' in ' + Constant.DEBUG.LOCATION.AJAX_LOADING_DIRECTIVE);
						}
					}
					else
						return;
				}

				return $scope.AjaxLoadingDirective = this;
			},

			link : function(scope, element, attrs){

				scope.$on(Constant.NOTIFICATION.ACTION.USER_REGISTER.name, function(event, args){
					
					if(args.code){
						
						scope.AjaxLoadingDirective.updateNotificationStatus(element, args.code);
					}
				})

				scope.$on(Constant.NOTIFICATION.ACTION.USER_LOGIN.name, function(event, args){

					if(args.code){

						scope.AjaxLoadingDirective.updateNotificationStatus(element, args.code);
					}
				})

				scope.AjaxLoadingDirective.hideMessage = function(){
					$timeout.cancel(scope.AjaxLoadingDirective.promise);
					scope.AjaxLoadingDirective.changeStateToNormal(element);
				}
			}
		}
	}]);

	app.directive('ImageUpload',['UploadService', function(uploadService){

		return {
			restrict : 'C',
			templateUrl : 'image.html',
			controller : 'ImageUploadCtrl',

			link : function(scope, element, attrs){	
				

				var helper = {
					noTitle : 'Please insert your image title',
					noImage : 'Please insert your image',
					both    : 'Please insert your image and image title',
					wrongDimension : 'Your image is not in correct dimension'
				} 

				function checkImageArray(ctrl){

					if(ctrl){
						if(ctrl.wrongDimension){
							ctrl.helper = helper.wrongDimension;
							ctrl.isError = false;
							return false;
						}
						else
							if(ctrl.title.trim() == '' && JSON.stringify(ctrl.file) == '{}'){
								ctrl.helper = helper.both;
								ctrl.isError = true;
								return false;
							}
						else
							if(ctrl.title.trim() == ''){
								ctrl.helper = helper.noTitle;
								ctrl.isError = true;
								return false;
							}
						else
							if(JSON.stringify(ctrl.file) == '{}'){
								ctrl.helper = helper.noImage;
								ctrl.isError = true;
								return false;
							}
						else{
							ctrl.isError = false;
							return true;
						}
					}

					ctrl.isError = true;
					throw('Unhandle error in ' + Constant.DEBUG.LOCATION.IMAGE_UPLOAD_DIRECTIVE);
					return false;
				}

				function addHelperClass(element){
					element.find('.uploadImageHelper').removeClass('hidden').addClass('text-danger');
				}

				function removeHelperClass(element){
					element.find('.uploadImageHelper').removeClass('text-danger').addClass('hidden');
				}

				var parent = scope.$parent.$parent.FileUploadCtrl;

				scope.ImageUploadDirective = {
					
					removeImageBox : function(index){

						parent.images.splice(index, 1);
					},
				}

				scope.$on(Constant.NOTIFICATION.ACTION.FILE_UPLOAD.PARTIAL.UPLOAD_CHECKING.name, function(event, args){

					var index = attrs.index;

					if(parent.images[index]){

						removeHelperClass(element);

						if(!checkImageArray(parent.images[index])){
							addHelperClass(element);
						}

						if(index == parent.images.length - 1){
						
							if(scope.ImageUploadCtrl.checkErrorArray()){
								uploadService.isAbleToSubmit.image = true;
							}
							else
								uploadService.isAbleToSubmit.image = false;

							scope.$emit(Constant.NOTIFICATION.ACTION.FILE_UPLOAD.PARTIAL.UPLOAD_CHECKED.name, {code : Constant.NOTIFICATION.ACTION.FILE_UPLOAD.PARTIAL.UPLOAD_CHECKED.IMAGE.code});
						}
					}
				})
			}
		}
	}])

	app.directive('QuestionUpload', ['UploadService', function(uploadService){
		return {
			restrict : 'C',
			templateUrl : 'question.html',
			controller : 'QuestionUploadCtrl',
			
			link : function(scope, element, attrs){

				var helper = {
					noTitle : 'Please specify your question title',
					noAns   : 'Please specify 3 choices of your answer'
				}

				function addHelperClass(element){
					element.find('.uploadQuestionHelper').removeClass('hidden').addClass('text-danger');
				}

				function removeHelperClass(element){
					element.find('.uploadQuestionHelper').removeClass('text-danger').addClass('hidden');
				}

				function checkQuestionArray(ctrl){

					if(ctrl){

						if(ctrl.title.trim() == ''){
							ctrl.helper = helper.noTitle;
							ctrl.isError = true;
							return false;
						}
						else
							if(ctrl.ans1.trim() == '' || ctrl.ans2.trim() == '' || ctrl.ans3.trim() == ''){
								ctrl.helper = helper.noAns;
								ctrl.isError = true;
								return false;
							}
						else
							ctrl.isError = false;
							return true;
					}

					ctrl.isError = true;
					throw('Unhandle error in ' + Constant.DEBUG.LOCATION.QUESTION_UPLOAD_DIRECTIVE);
					return false;	
				}

				var parent = scope.$parent.$parent.FileUploadCtrl;

				scope.QuestionUploadDirective = {
					removeQuestionBox : function(index){
						parent.questions.splice(index, 1);
					}
				}

				scope.$on(Constant.NOTIFICATION.ACTION.FILE_UPLOAD.PARTIAL.UPLOAD_CHECKING.name, function(event, args){

					var index = attrs.index;
					removeHelperClass(element);

					if(!checkQuestionArray(parent.questions[index]))
						addHelperClass(element);

					if(index == parent.questions.length - 1){
						
						if(scope.QuestionUploadCtrl.checkErrorArray()){
							uploadService.isAbleToSubmit.question = true;
						}
						else
							uploadService.isAbleToSubmit.question = false;

						scope.$emit(Constant.NOTIFICATION.ACTION.FILE_UPLOAD.PARTIAL.UPLOAD_CHECKED.name, {code : Constant.NOTIFICATION.ACTION.FILE_UPLOAD.PARTIAL.UPLOAD_CHECKED.QUESTION.code});
					}
				})
			}
		}
	}])	
}) 
