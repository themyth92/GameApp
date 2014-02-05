var Constant = require('../Constant/constant');

function Socket(UserModel, UploadModel, socket, session){

	function insertQuestionInDB(userName, title ,answers, select){

		UploadModel.findOneAndUpdate({userName : userName}, {$push : {question : {title : title, answers : answers, select : select}}}, {upsert : true}, function(error, doc){

			if(!error && doc){
				
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

	function broadcastQuestionSuccessCallBack(){

		socket.broadcast.emit(Constant.constant.SOCKET.receiveQuestionUploadResult)
	}

	function serverErrorCallBack(eventName, err){

		if(err){
			throw(err);
		}

		var dataSendBack = {
							code : Constant.constant.ERROR.SERVER_ERROR.code, 
							message : Constant.constant.ERROR.SERVER_ERROR.message
						    };

		socket.emit(eventName, dataSendBack);
		//socket.broadcast.emit(eventName, dataSendBack);
	}

	this.sendQuestion = function(){
		
		socket.on(Constant.constant.SOCKET.sendQuestion, function(data){

			var userName = session.userName;
			
			for(var i = 0 ; i < data.length ; i++){
				if(data[i].title && data[i].answers && data[i].select){
					
					insertQuestionInDB(userName, data[i].title, data[i].answers, data[i].select);
				}
			}

			sendQuestionSuccessCallBack();
		})
	}
}

exports.socket = Socket;