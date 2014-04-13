var Constant = require('../Constant/constant');
var ObjectId = require('mongoose').Types.ObjectId;

function Socket(UserModel, UploadModel, socket, session, SavedGameModel, PublishedGameModel, QuestionPollModel){

	function insertQuestionInDB(userName, title ,answers, select, hint){

		UploadModel.findOneAndUpdate({userName : userName}, {$push : {question : {title : title, hint : hint, answers : answers, select : select, comment : ''}}}, {upsert : true}, function(error, doc){

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
			socket.emit('addedYourNewQuestion', data);	
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
					
					if(dataElem.title && dataElem.answers && dataElem.select && dataElem.hint){
					
						insertQuestionInDB(userName, dataElem.title, dataElem.answers, dataElem.select, dataElem.hint);
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
									   		socket.broadcast.emit('teachHasCheckedOneQuestion' ,{data : question});
									   })
				}
			})

			socket.emit('teacherUpdateQuestionList');
		})
	}

	this.retrieveStudentQuestionList = function(){

		socket.once('retrieveStudentQuestionList', function(){
			
			var userName = session.userName;
			
			UploadModel.find({userName : userName}, 'question', function(err, docs){
				socket.emit('retrieveStudentQuestionList', {data : docs});
			})
		})
	}

	this.retrieveStudentQuestionAndImage = function(){

		socket.on('retrieveYourQuestionAndImage', function(){

			var userName = session.userName;

			UploadModel.find({userName : userName}, null, 

			    function(err, docs){
					socket.emit('retrieveYourQuestionAndImage', {data : docs});
			})
		})
	}

	this.sendChat = function(){
		socket.on('sendChat', function(data){
			socket.broadcast.emit('sendChat', {data : data});
		})
	}

	this.sendGlobalChat = function(){
		socket.on('sendGlobalChat', function(data){
			socket.broadcast.emit('sendGlobalChat', {data : data});
		})
	}


	function saveGame(data, userName){

		if(data){
					
			data.userName = userName;
			
			//convert to array
			if(data.enemy){

				data.enemy.map(function(enemy){
					if(enemy.endPts){
						var convert = [];
						
						for(var i in enemy.endPts[0]){
							convert[i] = enemy.endPts[0][i];
						}

						enemy.endPts = convert;
					}
				})
			}	

			//newly save game
			if(data.id == null){

				var savedGameModel = new SavedGameModel({userName : data.userName, screenShot : data.screenShot,
					title : data.title, player : data.player, enemy:data.enemy, obstacles : data.obstacles, screen : data.screen,
					scoreboard : data.scoreboard});

				savedGameModel.save(function(err, doc){

					if(!err && doc){
						socket.emit('gameSaved', {
							id : doc._id,
							userName :  userName
						})

						socket.broadcast.emit('youHaveNewSavedGame', {id : doc._id, screenShot : doc.screenShot, userName : userName, title : doc.title});
						socket.emit('youHaveNewSavedGame', {id : doc._id, screenshot : doc.screenShot, userName : userName, title : doc.title});
					}
				})
			}
			else{
				var id = data.id;

				SavedGameModel.findByIdAndUpdate(ObjectId(id), {$set : {screenShot : data.screenShot, 
					title : data.title, player : data.player , enemy: data.enemy, obstacles : data.obstacles,
					screen : data.screen, scoreboard : data.scoreboard}}, function(err, doc){

					if(!err && doc){

						socket.emit('gameSaved', {
							id : doc._id
						})
					}
				})
			}
		}
	}

	this.saveUserGame = function(){
		socket.on('saveUserGame', function(data){
			var userName = session.userName;
			saveGame(data, userName);
		})
	}

	this.saveUserStoryStage = function(){
		socket.on('saveUserStage', function(data){

			var userName = session.userName;
			UserModel.update({userName : userName}, {storyStage : data}, function(){

			})
		})
	}

	this.publishGame = function(){
		socket.on('publishGame', function(data){
			var userName = session.userName;

			//convert to array
			if(data.enemy){

				data.enemy.map(function(enemy){
					if(enemy.endPts){
						var convert = [];
						
						for(var i in enemy.endPts[0]){
							convert[i] = enemy.endPts[0][i];
						}

						enemy.endPts = convert;
					}
				})
			}	
			
			//newly published game, no need to remove in saved game
			if(data.id == null){
				var publishedGameModel = new PublishedGameModel({userName : userName, screenShot : data.screenShot,
					title : data.title, player : data.player, enemy:data.enemy, obstacles : data.obstacles, screen : data.screen,
					scoreboard : data.scoreboard});

				publishedGameModel.save(function(err, doc){
					console.log(err);
					if(!err && doc){
						socket.emit('gamePublished', {
							id : doc._id,
							userName :  userName,
							screenShot : doc.screenshot,
							title : doc.title
						})
					}
				})
			}
			else{
				var id = data.id;
				SavedGameModel.findByIdAndRemove(ObjectId(id), function(){
					var publishedGameModel = new PublishedGameModel({userName : data.userName, screenShot : data.screenShot,
						title : data.title, player : data.player, enemy:data.enemy, obstacles : data.obstacles, screen : data.screen,
						scoreboard : data.scoreboard});

					publishGameModel.save(function(err, doc){

						if(!err && doc){
							socket.emit('gamePublished', {
								id : doc._id,
								userName :  userName,
								screenShot : doc.screenShot,
								title : doc.title
							})
						}
					})
				})
			}
		})
	}

	this.updateQuestionPoll = function(){
		
		socket.on('updateQuestionPoll', function(data){

			var gameID 	 		= data.gameID;
			var questionIndex 	= data.questionIndex;
			var correct			= data.correct;
			PublishedGameModel.findById(ObjectId(gameID), 'userName title' , function(err, docs){

				if(!err && docs){
					var gameTitle = docs.title;
					var userName  = docs.userName;


					UploadModel.aggregate({$unwind : '$question'},
			                      		  {$match  : {'question.accept' : 1}},
			                              {$group  : {_id : '$_id', userName : {$addToSet : '$userName'}, question : {$addToSet : '$question'}}}, function(err, docs){
						
						if(!err && docs){

							var questionTitle = docs[0].question[questionIndex].title;

							var dataReturn    = {gameID : gameID, userName : userName, gameTitle : gameTitle, 
												 questionTitle: questionTitle, isCorrect : correct, questionIndex : questionIndex,
												 gameID: gameID};

							if(correct){
								QuestionPollModel.update({userName : userName, gameID : gameID, questionIndex : questionIndex,gameTitle : gameTitle, questionTitle : questionTitle
														}, {$inc : {rightAnswer : 1}}, {upsert : true}, function(){
															socket.emit('updateQuestionPoll', dataReturn);
														})	
							}
							else{

								QuestionPollModel.update({userName : userName, gameID : gameID, questionIndex : questionIndex,gameTitle : gameTitle, questionTitle : questionTitle
														}, {$inc : {wrongAnswer : 1}}, {upsert : true}, function(){

															socket.emit('updateQuestionPoll', dataReturn);
														})		
							}
						}
					})
				}
			});
		})
	}
}

exports.socket = Socket;