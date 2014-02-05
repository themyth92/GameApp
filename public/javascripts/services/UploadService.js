define(['app'], function(app){
	
	var UploadService = function($upload, $q, $http){

		UploadService = {};

		UploadService.isAbleToSubmit = {
			image    : false,
			question : false
		}

		UploadService.uploadImage = function(file, successCallBack, errorCallBack, index){

			$upload.upload({
			
				url   : 'upload/image',
				method: 'POST',
				file  : file.file,
				data  : {title : file.title, select : file.select}	
			}).
			success(function(data){
				successCallBack(data, index);
			}).
			error(function(error){
				errorCallBack(error);
			});
		
		}

		UploadService.uploadQuestion = function(questions){

			var promises = [];

			angular.forEach(questions, function(question){
				var deffered  = $q.defer(); 
			
				$http({

					url   : 'upload/question',
					method: 'POST',
					data  : question
				}).
				success(function(data){
					deffered.resolve(data);
				}).
				error(function(error){
					deffered.reject(error);
				});

				promises.push(deffered.promise);
			});
				
			return $q.all(promises);
		}

		return UploadService;
	};

	app.factory('UploadService', ['$upload','$q', '$http', UploadService]);
})