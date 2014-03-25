define(['app'], function(app){
	var Controller = {
		
		ImageUploadCtrl : function($scope){

			var uploadImageType = {
				reward : 'Rewards',
				obstacle : 'Obstacles'
			}

			var fileSize = 30000;

			function checkFileSize(file){

			//	if(file.size)
			//		return ((file.size < fileSize) ? true : false);
				return true;
			}

			var parent = $scope.$parent.FileUploadCtrl;

			this.checkErrorArray = function(){
				
				for(var i = 0 ; i < parent.images.length ; i++)
					if(parent.images[i].isError == true) 
						return false ;
				
				return true;
			}
			
			this.addImage = function(){
				parent.images.push({title : '', select : uploadImageType.reward, file : {}, wrongDimension : false, helper : '', isError : false});
			}

			this.onFileSelect = function($file, $index){
				
				if($file[0]){
					if(checkFileSize($file[0])){
						parent.images[$index].file = $file[0];
					}
					else{
						parent.images[$index].wrongDimension = true;
					}
				}	
			}

			this.removeImage = function($index){

				if(parent.images[$index]){
					parent.images[$index].file = {};
				}
				else{
					throw('Unhandle problem in ' + Constant.DEBUG.LOCATION.IMAGE_UPLOAD_CTRL);
				}
			}

			return $scope.ImageUploadCtrl = this;
		},

		QuestionUploadCtrl : function($scope){

			var parent = $scope.$parent.FileUploadCtrl;

			this.checkErrorArray = function(){
				
				for(var i = 0 ; i < parent.questions.length ; i++)
					if(parent.questions[i].isError == false) 
						return true;
				
				return false;
			}

			this.addQuestion = function(){
				parent.questions.push({title : '',hint : '', answers : [{answer : ''}], select : '', helper : '', isError : false});
			}

			return $scope.QuestionUploadCtrl = this;
		}
	}

	app.controller('ImageUploadCtrl', ['$scope', Controller.ImageUploadCtrl]);
	app.controller('QuestionUploadCtrl', ['$scope', Controller.QuestionUploadCtrl]);
}) 
