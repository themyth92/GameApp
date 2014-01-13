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
						if(code == Constant.NOTIFICATION.ACTION.USER_REGISTER.code){
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

						changeStateToError(element);
						$scope.AjaxLoadingDirective.status.message = Constant.NOTIFICATION.COMMON.SERVER_ERROR.message;
						
					}
					else{

						$scope.AjaxLoadingDirective.status.message = '';
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
							console.log(error + ' in ' + Constant.DEBUG.LOCATION.AJAX_LOADING_DIRECTIVE);
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

				scope.AjaxLoadingDirective.hideMessage = function(){
					$timeout.cancel(scope.AjaxLoadingDirective.promise);
					scope.AjaxLoadingDirective.changeStateToNormal(element);
				}
			}
		}
	}])
}) 
