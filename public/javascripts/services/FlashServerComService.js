define(['app'], function(app){
	
	app.factory('FlashComService', function(){
		
		function reformatQuestionAndImageList(data, pageID){

			var storyStage = data.storyStage;
			
			var dataReturn = {image : [], question :[]};
			
			if(data.data && data.data.length > 0){
				data = data.data[0];
				var address, choice, title;
				var title, answers, select;
				var userName   = data.userName;
				
				if(data.image){
					
					for(var i = 0 ; i < data.image.length ; i++){
						
						address  = userName + '/' + data.image[i]._id + '_resize.' + data.image[i].ext;
						choice   = data.image[i].choice;
						title    = data.image[i].title;
						dataReturn.image.push({address : address, type : choice, title : title});
					}
				}

				if(data.question){

					for(var i = 0  ; i < data.question.length ; i++){
						
						if(data.question[i].accept == '1'){
							title   = data.question[i].title;
							answers = data.question[i].answers;
							select  = data.question[i].select; 
							hint	= data.question[i].hint;
							dataReturn.question.push({title : title, answers : answers, select : select, hint : hint});
						}
					}
				}
			}
			

			dataReturn.pageID 	  = pageID;
			dataReturn.storyStage = storyStage;

			return dataReturn;
		}

		return{
			registerGlobalFunc : function(){

			},

			//return the question list and image
			//when user go to the game creation page
			listQuestionAndImageToFlash : function(data, pageID){
				return reformatQuestionAndImageList(data, pageID);
			}
		}
	})
})