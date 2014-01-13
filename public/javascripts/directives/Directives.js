define(['app'], function(app){
	app.directive('AjaxLoading', function(){
		return {
			restrict : 'C',
			templateUrl : 'ajaxLoading.html',	
			
			controller : function($scope, AjaxNotificationService){

				function changeStateToLoading(element){
					
					element.addClass('active ajax-status-loading');
					element.children('div').addClass('ajax-status-loading');
					element.find('.reloader').addClass('ajax-status-loading');
				}

				function changeStateToSuccess(element){
					
					element.find('.reloader').removeClass('ajax-status-loading');
					element.children('div').addClass('ajax-status-success');
				}

				function changeStateToError(element){
					
					element.find('.reloader').removeClass('ajax-status-loading');
					element.children('div').addClass('ajax-status-error');
				}

				function changeStateToNormal(element){

					element.removeClass('active ajax-status-loading ajax-status-success ajax-status-error');
					element.children('div').removeClass('ajax-status-loading ajax-status-success ajax-status-error');
					element.find('.reloader').removeClass('ajax-status-loading');
				}

				function changeStatusMessage(code, element){
					
					if(code){
						if(code == Constant.NOTIFICATION.ACTION.USER_REGISTER.code){
							changeStateToLoading(element);
							$scope.api.status.message = Constant.COMMON.LOADING.message;
						}

						if(code == Constant.NOTIFICATION.ACTION.USER_REGISTER.ERROR.USER_ALREADY_REGISTER.code){
							changeStateToError(element);
							$scope.api.status.message = Constant.NOTIFICATION.ACTION.USER_REGISTER.ERROR.USER_ALREADY_REGISTER.message;
						}

						if(code == Constant.NOTIFICATION.ACTION.USER_REGISTER.SUCCESS.USER_REGISTER_SUCCESS.code){
							changeStateToSuccess(element);
							$scope.api.status.message = Constant.NOTIFICATION.ACTION.USER_REGISTER.SUCCESS.USER_REGISTER_SUCCESS.message;
						}

						return false;
					}
					else{

						this.status.message = '';
						return false;
					}
				}

				this.code = AjaxNotificationService.status.code;
				
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

				return $scope.api = this;

			},

			link : function(scope, element, attrs){

				scope.$watch('api.code', function(){
					scope.api.updateNotificationStatus(element, scope.api.code);
				});
			}
		}
	})
}) 
