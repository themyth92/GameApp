define(['app'], function(app){
	app.controller('UserRegisterCtrl', ['$scope', function($scope){
		
		var api = {
			registerSubmit : function(){
				alert('success!');
			}
		}

		$scope.api = api;
	}])
}) 
