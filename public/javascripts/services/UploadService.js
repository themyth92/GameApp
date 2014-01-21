define(['app'], function(app){
	
	var UploadService = function($upload, $q, $http){

		UploadService = {};

		UploadService.isAbleToSubmit = {
			image : false,
			question : false
		}

		UploadService.uploadImage = function(files){

			var promises = [];
			
			for(var i = 0 ; i < files.length ; i ++){

				var deffered = $q.defer();
				var file     = files[i];

				$upload.upload({
				
					url   : 'upload/image',
					method: 'POST',
					file  : file.file,
					data  : {title : file.title, select : file.select}	
				}).
				success(function(data){
					deffered.resolve(data);
				}).
				error(function(error){
					deffered.reject();
				});

				promises.push(deffered.promise);
			}

			return $q.all(promises);
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