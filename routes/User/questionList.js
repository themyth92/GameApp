var Constant = require('../Constant/constant');

function QuestionList(UserModel, UploadModel){

	function checkUserTeacher(userName){

		var query = UserModel.findOne({userName : userName, isTeacher : true});
		return query.exec();
	}

	function serverErrorCallBack(err){

		if(err){
			throw(err);
		}

		return {
				code    : Constant.constant.ERROR.SERVER_ERROR.code, 
				message : Constant.constant.ERROR.SERVER_ERROR.message
			};
	}

	function retrieveList(){

		var query = UploadModel.find({'question.accept' : false}, 'userName question');
		return query.exec();
	}

	function retrieveListSuccessCallBack(doc, res){

		var dataSendBack = {
			code    : Constant.constant.STATUS.SUCCESS.RETRIEVE_QUESTION_SUCCESS.code,
			message : Constant.constant.STATUS.SUCCESS.RETRIEVE_QUESTION_SUCCESS.message 
		}
		
		if(doc){
			dataSendBack.data = doc;
		}

		return dataSendBack;
	}

	this.retrieveQuestionList = function(req, res){

		var userName = req.session.userName;
		
		checkUserTeacher(userName).then(function(doc){
			
			if(doc){

				//ok user is teacher
				retrieveList().then(function(doc){
					res.json(retrieveListSuccessCallBack(doc));
				}, function(error){
					res.json(serverErrorCallBack(error));
				})
			}
			else{

				var dataSendBack = {
						code    : Constant.constant.STATUS.ERROR.SESSION_NOT_EXIST.code,
						message : Constant.constant.STATUS.ERROR.SESSION_NOT_EXIST.message	
					}

				res.json(dataSendBack);
			}
		}, function(error){
			serverErrorCallBack(error);
		})
	}	
}

exports.questionList = QuestionList;