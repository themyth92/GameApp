var Constant = require('../Constant/constant');
var ObjectId = require('mongoose').Types.ObjectId;

function Socket(UserModel, UploadModel, socket, session){

	function insertQuestionInDB(userName, title ,answers, select){

		UploadModel.findOneAndUpdate({userName : userName}, {$push : {question : {title : title, answers : answers, select : select, comment : ''}}}, {upsert : true}, function(error, doc){

			if(!error && doc){
				
				var obj      		= {};
				var questionLength  = doc.question.length - 1;
				obj.id       		= doc._id;
				obj.userName 		= doc.userName;
				obj.title    		= doc.question[questionLength].title;
				obj.answers  		= doc.question[questionLength].answers;
				obj.select   		= doc.question[questionLength].select;
				obj.questionID 		= doc.question[questionLength]._id; 

				broadcastQuestionSuccessCallBack(obj);	
			}
			else{
				res.json(serverErrorCallBack(error));
			}
		})
	}

	function sendQuestionSuccessCallBack(){
		
		var dataSendBack = {
							code    : Constant.constant.STATUS.SUCCESS.UPLOAD_SUCCESS.code,
						  	message : Constant.constant.STATUS.SUCCESS.UPLOAD_SUCCESS.message
						   }
		socket.emit(Constant.constant.SOCKET.receiveQuestionUploadResult, dataSendBack);
	}

	function broadcastQuestionSuccessCallBack(data){

		if(data){
			socket.broadcast.emit(Constant.constant.SOCKET.sendNewQuestion, data);	
		}
	}

	function serverErrorCallBack(eventName, err){

		if(err){
			throw(err);
		}

		var dataSendBack = {
							code : Constant.constant.STATUS.ERROR.SERVER_ERROR.code, 
							message : Constant.constant.STATUS.ERROR.SERVER_ERROR.message
						    };

		socket.emit(eventName, dataSendBack);
	}

	this.sendQuestion = function(){
		
		socket.on(Constant.constant.SOCKET.sendQuestion, function(data){

			var userName = session.userName;

			if(userName){

				data.map(function(dataElem){
					
					if(dataElem.title && dataElem.answers && dataElem.select){
					
						insertQuestionInDB(userName, dataElem.title, dataElem.answers, dataElem.select);
					}	
				})

				sendQuestionSuccessCallBack();
			}
			else{
				serverErrorCallBack(Constant.constant.SOCKET.receiveQuestionUploadResult);
			}
			
		})
	}

	this.retrieveQuestionList = function(){

		socket.once('retrieveQuestionList', function(){
			var userName = session.userName;
			UploadModel.aggregate({$unwind : '$question'},
			                      {$match  : {'question.accept' : 3}},
			                      {$group  : {_id : '$_id', userName : {$addToSet : '$userName'}, question : {$addToSet : '$question'}}}, function(err, doc){

			                      	socket.emit('retrieveQuestionList', {data : doc});
			                      });
		})
	}

	this.teacherUpdateQuestionList = function(){

		socket.on('teacherUpdateQuestionList', function(data){
			
			data.map(function(question){

				question = question || {};

				if(question.id && question.questionID){
					
					var comment = question.comment;
					var accept  = question.correct;

					UploadModel.update({_id : ObjectId(question.id) , 'question._id' : ObjectId(question.questionID)},
									   {$set : {'question.$.accept' : accept, 'question.$.comment' : comment}}, function(){
									   		socket.emit('teacherUpdateQuestionList');
									   })
				}
			})
		})
	}
}

exports.socket = Socket;