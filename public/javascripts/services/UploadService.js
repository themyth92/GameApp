define(['app'], function(app){
	
	var UploadService = function($upload, $q, $http){

		UploadService = {};

		UploadService.files = [];

		UploadService.isAbleToSubmit = {
			image : false,
			question : false
		}

		UploadService.uploadImage = function(file){
				
			var deffered = $q.defer();
			
			$upload.upload({
				
				url   : 'upload/image',
				method: 'POST',
				file  : file.file,
				data  : {title : file.title}	
			}).
			success(function(data){
				deffered.resolve(data);
			}).
			error(function(error){
				deffered.reject();
			});

			return deffered.promise;
		}

		UploadService.uploadQuestion = function(question){

			var deffered = $q.defer();
			
			$http({
				url   : 'upload/question',
				method: 'POST',
				data  : question
			}).
			success(function(data){
				deffered.resolve(data);
			}).
			error(function(error){
				deffered.reject();
			});

			return deffered.promise;
		}

		return UploadService;
	};

	app.factory('UploadService', ['$upload','$q', '$http', UploadService]);
})