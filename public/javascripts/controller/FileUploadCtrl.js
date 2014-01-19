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

			this.images = [];
			
			this.addImage = function(){
				this.images.push({title : '', select : uploadImageType.reward, wrongDimension : false, helper : '', isError : false});
				uploadService.files.push({file : '', title : '', select : ''});
			}

			this.onFileSelect = function($files, $index){

				if(checkFileDimension($files)){
					
					if(uploadService.files[$index]){
						uploadService.files.splice($index, 1, {file : $files[0].result, title : this.images[$index].title, select : this.images[$index].select});
					}
					
					else{
						uploadService.files.push({file : $files[0].result, title : this.images[$index].title, select : this.images[$index].select});
					}
				}
				else{

					this.images[$index].wrongDimension = true;

					if(uploadService.files[$index]){
						uploadService.files.splice($index, 1, {file : '', title : '', select : ''});
					}
					
					else{
						uploadService.files.push({file : '', title : '', select : ''});
					}
				}
				
			}

			this.changeImage = function($files, $index){
				
				if(uploadService.files[$index]){
					uploadService.files.splice($index, 1, {file : $files[0].result, title : this.images[$index].title, select : this.images[$index].select});
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
