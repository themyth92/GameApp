define(['app'], function(app){
	var Controller = {
		
		ImageUploadCtrl : function($scope){

			this.images = [{title : '', selection : {name : 'hello', select : ''}}];

			this.images[0].selection.select = 'Rewards';
			
			this.addImage = function(){
				this.images.push({text : ''});
			}

			return $scope.ImageUploadCtrl = this;
		},

		QuestionUploadCtrl : function($scope){

		}
	}

	app.controller('ImageUploadCtrl', ['$scope', Controller.ImageUploadCtrl]);
	app.controller('QuestionUploadCtrl', ['$scope', Controller.QuestionUploadCtrl]);
}) 
