define(['app'], function(app){

	app.factory('DataService', function(){
		return {
			firstTimeLoadApp : true,
			firstTimeLoadQuestionListPage : true,
			firstTimeLoadCheckStudentQuestionPage : true,

			questionList : [],
			eachStudentQuestionList : [],

			//use to retrieve data from flash
			yourQuestion : [],
			yourImage    : [],

			processQuestionListData : function(data){
				var self = this;
				if(data.data){

					for(var i = 0 ; i < data.data.length ; i++){

						data.data[i].question = data.data[i].question || [];
						for(var j = 0 ; j < data.data[i].question.length; j++){

							var obj 	   = {};
							var partial    = data.data[i]               || {};
							obj.userName   = partial.userName[0] 		|| 'None';
							obj._id        = partial._id      			|| 'None';
							obj.title      = partial.question[j].title  || 'None';
							obj.select     = partial.question[j].select || 'None';
							obj.answers    = partial.question[j].answers|| [];
							obj.questionID = partial.question[j]._id    || 'None';
							obj.correct    = partial.question[j].accept;
							obj.comment    = partial.question[j].comment || '';

							self.questionList.push(obj);
						}	
					}
				}
			},

			pushNewQuestion : function(data){
				var self = this;

				if( data && 
					data.userName && 
					data.id && 
					data.title && 
					data.select && 
					data.answers && 
					data.questionID){

					var obj 	   = {};        
					obj.userName   = data.userName	 		|| 'None';
					obj._id        = data.id      			|| 'None';
					obj.title      = data.title  			|| 'None';
					obj.select     = data.select 			|| 'None';
					obj.answers    = data.answers			|| [];
					obj.questionID = data.questionID    	|| 'None';
					obj.correct    = 3;
					obj.comment    = '';

					self.questionList.push(obj);	
				}			
			},

			processEachStudentQuestion : function(data){

				var self = this;

				if(data.data){

					for(var i = 0 ; i < data.data.length ; i++){

						data.data[i].question = data.data[i].question || [];
						for(var j = 0 ; j < data.data[i].question.length; j++){

							var obj 	   = {};
							var partial    = data.data[i]               || {};
							obj._id        = partial._id      			|| 'None';
							obj.title      = partial.question[j].title  || 'None';
							obj.select     = partial.question[j].select || 'None';
							obj.answers    = partial.question[j].answers|| [];
							obj.questionID = partial.question[j]._id    || 'None';
							obj.correct    = partial.question[j].accept;
							obj.comment    = partial.question[j].comment || '';

							self.eachStudentQuestionList.push(obj);
						}	
					}
				}
			},

			pushEachStudentQuestion : function(data){
				var self = this;

				if( data && 
					data.userName && 
					data.id && 
					data.title && 
					data.select && 
					data.answers && 
					data.questionID){

					var obj 	   = {};        
					obj._id        = data.id      			|| 'None';
					obj.title      = data.title  			|| 'None';
					obj.select     = data.select 			|| 'None';
					obj.answers    = data.answers			|| [];
					obj.questionID = data.questionID    	|| 'None';
					obj.correct    = data.accept;
					obj.comment    = '';

					self.eachStudentQuestionList.push(obj);	
				}	
			},

			checkedTeacherQuestionFitMyQuestion : function(data){

				var self = this;
				angular.forEach(self.eachStudentQuestionList, function(question){

					if(question.questionID == data.data.questionID){
						question.comment = data.data.comment;
						question.correct = data.data.correct;
					}
				})
			}
		}
	})
})