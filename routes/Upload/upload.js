var Constant = require('../Constant/constant');
var fs       = require('fs');

function Upload(UserModel, UploadModel){

	function retrieveUserID(userName){
		
		var query = UserModel.find({userName : userName}, '_id');
		return query.exec();
	}

	function getExtension(fileName){
		var ext;
		return (ext = fileName.split('.').pop()) ? (ext) : ('jpg');
	}

	function retrieveUserIDSuccessCallBack(doc){
		
		if(doc){

			switch(doc.length){
				
				case Constant.constant.NUMBER.NO_USER_EXIST : 
					return false;
				break;
				
				case Constant.constant.NUMBER.USER_ALREADY_EXIST:
					return doc[0]._id;	
				break;
				
				default:
					throw(Constant.constant.DATABASE.ERROR.USER_NAME_DATABASE_ERROR.EXIST_MORE_THAN_ONE_USER_NAME);
					return false;
				
				break;
			}
		}
		else
			return false;
	}

	function serverErrorCallBack(err){

		if(err){
			throw(err);
		}

		return {
				code : Constant.constant.ERROR.SERVER_ERROR.code, 
				message : Constant.constant.ERROR.SERVER_ERROR.message
			};
	}

	function storeImageErrorCallBack(){

		return {
				code : Constant.constant.ERROR.IMAGE_UPLOAD_ERROR.code, 
				message : Constant.constant.ERROR.IMAGE_UPLOAD_ERROR.message
			};
	}

	function writeImage(newPath, fileName, ext, res, data){

		fs.writeFile(newPath + '/' + fileName + '.' + ext, data, function(err){
					
			if(err){
				throw(err);
				res.json(storeImageErrorCallBack());
			}
			else{
				res.json({
							code    : Constant.constant.STATUS.SUCCESS.UPLOAD_SUCCESS.code,
						  	message : Constant.constant.STATUS.SUCCESS.UPLOAD_SUCCESS.message 
						  });
			}
		})
	}

	function storeImageInFD(res, userID, path, fileName, ext){

		fs.readFile(path, function(err, data){
			
			var newPath    = __dirname + "/../../uploads/" + userID + '/';
			var uploadPath = __dirname + "/../../uploads/"; 

			if(!err){

				fs.stat(uploadPath, function(error, stats){

					//if folder uploads no exist
					if(error){

						//create upload folder
						fs.mkdir(uploadPath, function(error){

							if(error){

								//throw error if creating got problem
								throw(error);
								res.json(serverErrorCallBack());
							}
							else{

								//check folder user exist
								fs.stat(newPath, function(error, stats){

									//folder user not exist
									if(error){

										//create folder for user
										fs.mkdir(newPath, function(error){

											//if can not create folder
											if(error){

												//throw error if creating got problem
												throw(error);
												res.json(serverErrorCallBack());
											}
											else{

												//create file
												writeImage(newPath, fileName, ext, res, data);
											}
										})
									}
									else{

										//folder user exist
										//create file
										writeImage(newPath, fileName, ext, res, data);
									}			
								})
							}
						})
					}
					else{

						//folder already exist
						//check folder user exist
						fs.stat(newPath, function(error, stats){

							//folder user not exist
							if(error){

								//create folder for user
								fs.mkdir(newPath, function(error){

									//if can not create folder
									if(error){

										//throw error if creating got problem
										throw(error);
										res.json(serverErrorCallBack());
									}
									else{

										//create file
										writeImage(newPath, fileName, ext, res, data);
									}
								})
							}
							else{

								//folder user exist
								//create file
								writeImage(newPath, fileName, ext, res, data);
							}			
						})
					}
				})
			}
			else{

				throw(err);
				res.json(storeImageErrorCallBack());
			}
		})
	}

	function insertImageInDB(res, userID, files, data){

		var ext   = (files.file.originalFileName ? getExtension(files.file.originalFileName) : getExtension(''));
		var title, choice;

		if(data.title && data.select && files){
			
			title  = data.title;
			choice = data.select;

			UploadModel.findOneAndUpdate({userID : userID}, {$push : {image : {title : title, choice : choice, ext : ext}}}, {upsert : true}, function(error, doc){

				if(!error && doc){

					var fileName = doc.image[doc.image.length - 1]._id || 'defaultname';
					var path     = files.file.path || '';
					
					storeImageInFD(res, userID, path, fileName, ext);
				}
				else{
					res.json(storeImageErrorCallBack(error));
				}
			})
		}
		else{
			res.json({
					  code : Constant.constant.STATUS.ERROR.USER_CREDENTIAL_WRONG_FORMAT.code,
					  message : Constant.constant.STATUS.ERROR.USER_CREDENTIAL_WRONG_FORMAT.message
					})
		} 
	}

	function insertQuestionInDB(res, userID, title, ans1, ans2, ans3){

		UploadModel.findOneAndUpdate({userID : userID}, {$push : {question : {title : title, ans1 : ans1, ans2 : ans2, ans3 : ans3}}}, {upsert : true}, function(error, doc){

			if(!error && doc){

				res.json({
							code    : Constant.constant.STATUS.SUCCESS.UPLOAD_SUCCESS.code,
						  	message : Constant.constant.STATUS.SUCCESS.UPLOAD_SUCCESS.message 
						  });
			}
			else{
				res.json(serverErrorCallBack(error));
			}
		})
	}

	this.uploadImage = function(req, res){

		var userName = req.session.userName;
		var files    = req.files;
		var data     = req.body;

		retrieveUserID(userName).

			then(function(doc){
				
				var id;
				
				if(!(id = retrieveUserIDSuccessCallBack(doc))){
					
					var dataSendBack = serverErrorCallBack();
					res.json(dataSendBack);
				}
				else{

					insertImageInDB(res, id, files, data);
				}

			}, function(err){

				res.json(serverErrorCallBack(err));
			})
	}

	this.uploadQuestion = function(req, res){

		var data 	 = req.body;
		var userName = req.session.userName;

		retrieveUserID(userName).

			then(function(doc){
				
				var id;
				
				if(!(id = retrieveUserIDSuccessCallBack(doc))){
					
					var dataSendBack = serverErrorCallBack();
					res.json(dataSendBack);
				}
				else{

					if(data.title && data.ans1 && data.ans2 && data.ans3){
						insertQuestionInDB(res, id, data.title, data.ans1, data.ans2, data.ans3);
					}
					else
						res.json({
								  code : Constant.constant.STATUS.ERROR.USER_CREDENTIAL_WRONG_FORMAT.code,
								  message : Constant.constant.STATUS.ERROR.USER_CREDENTIAL_WRONG_FORMAT.message
								})
				}

			}, function(err){

				res.json(serverErrorCallBack(err));
			})		
	}
}

exports.upload = Upload;