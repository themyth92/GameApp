define(['module/ctrlModule'], function(ctrlModule){
	ctrlModule.controller('UserRegisterCtrl', ['$scope', function($scope){
		
		var api = {
			userRegister : function(){
				alert('success!');
			}
		}

		$scope.api = api;

	}])
}) 
