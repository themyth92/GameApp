define(['app'], function(app){
	var Controller = {
		
		ImageUploadCtrl : function($scope, $upload, uploadService){

			var uploadImageType = {
				reward : 'Rewards',
				obstacle : 'Obstacles'
			}

			var imageSize = {
				width : 160,
				height : 160
			}

			function checkFileDimension($file){
				
				if($file.result){
					var img = new Image();
					img.src = $file.result;
					
					if(img.width > imageSize.width || img.height > imageSize.height)
						return false;
					else
						return true;
				}
				else
					return false;
			}

			this.error = {
				fileDimensionError : false 
			}

			this.images = [{title : '', selection : {select : 'Rewards'}}];
			
			this.addImage = function(){

				this.images.push({title : '', selection : {select : uploadImageType.reward}});
				uploadService.files.push({file : '', title : '', select : ''});
			}

			this.onFileSelect = function($files, $index){

				if(checkFileDimension($files)){
					
					this.error.fileDimensionError = false;
					
					if(uploadService.files[$index]){
						uploadService.files.splice($index, 1, {file : $files[0].result, title : this.images[$index].title, select : this.images[$index].selection.select});
					}
					
					else{
						uploadService.files.push({file : $files[0].result, title : this.images[$index].title, select : this.images[$index].selection.select});
					}
				}
				else{

					this.error.fileDimensionError = true;
				}
				
			}

			this.changeImage = function($files, $index){
				
				if(uploadService.files[$index]){
					uploadService.files.splice($index, 1, {file : $files[0].result, title : this.images[$index].title, select : this.images[$index].selection.select});
				}
				else{
					throw('Unhandle problem in ' + Constant.DEBUG.LOCATION.IMAGE_UPLOAD_CTRL);
				}
			}

			this.removeImage = function($files, $index){

				if(uploadService.files[$index]){
					uploadService.files.splice($index, 1, {file : '', title : '', select : ''});
				}
				else{
					throw('Unhandle problem in ' + Constant.DEBUG.LOCATION.IMAGE_UPLOAD_CTRL);
				}
			}

			return $scope.ImageUploadCtrl = this;
		},

		QuestionUploadCtrl : function($scope){

		}
	}

	app.controller('ImageUploadCtrl', ['$scope', '$upload', 'UploadService', Controller.ImageUploadCtrl]);
	app.controller('QuestionUploadCtrl', ['$scope', Controller.QuestionUploadCtrl]);
}) 
