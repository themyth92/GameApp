define(['app'], function(app){
	
	app.factory('FlashComService', function(){
		
		function reformatQuestionAndImageList(data){
			
			data = data.data[0];
			var dataReturn = {image : [], question :[]};

			var userName   = data.userName;
			var address, choice, title;
			var title, answers, select;

			if(data.image){
				
				for(var i = 0 ; i < data.image.length ; i++){
					
					address  = userName + '/' + data.image[i]._id + '.' + data.image[i].ext;
					choice   = data.image[i].choice;
					title    = data.image[i].title;
					dataReturn.image.push([{address : address, type : choice, title : title}]);
				}
			}

			if(data.question){

				for(var i = 0  ; i < data.question.length ; i++){
					
					if(data.question[i].accept == '2'){
						title   = data.question[i].title;
						answers = data.question[i].answers;
						select  = data.question[i].select; 
						dataReturn.question.push([{title : title, answers : answers, select : select}]);
					}
				}
			}

			return dataReturn;
		}

		return{
			registerGlobalFunc : function(){

			},

			//return the question list and image
			//when user go to the game creation page
			listQuestionAndImageToFlash : function(data){
				return reformatQuestionAndImageList(data);
			}
		}
	})
})