var Constant = require('../Constant/constant');
var fs       = require('fs');
var im       = require('imagemagick');

function Upload(UserModel, UploadModel){

	function getExtension(fileName){
		var ext;

		//return the extension of the image, 
		//if no extension specified, jpg will be used instead
		return (ext = fileName.split('.').pop() ? ext : 'jpg');
	}

	function serverErrorCallBack(err){

		if(err){
			throw(err);
		}

		return {
				code : Constant.constant.STATUS.ERROR.SERVER_ERROR.code, 
				message : Constant.constant.STATUS.ERROR.SERVER_ERROR.message
			};
	}

	function storeImageErrorCallBack(){

		return {
				code : Constant.constant.STATUS.ERROR.IMAGE_UPLOAD_ERROR.code, 
				message : Constant.constant.STATUS.ERROR.IMAGE_UPLOAD_ERROR.message
			};
	}

	/*
		write image file into server
	*/
	function writeImage(newPath, fileName, ext, res, data, choice){

		var path = newPath + '/' + fileName;

		fs.writeFile(path + '.' + ext, data, function(err){
					
			if(err){
				throw(err);
				res.json(storeImageErrorCallBack());
			}
			else{
				
				if(choice == 'Screen'){
					im.resize({
						srcPath : path + '.' + ext,
						dstPath : path + '_resize.' + ext,
						width   : 800
					}, function(err){
						if(err)
							throw(err);
					})
				}
				else{
					im.resize({
						srcPath : path + '.' + ext,
						dstPath : path + '_resize.' + ext,
						height  : 40,
						width   : 40
					}, function(err){
						if(err)
							throw(err);
					})
				}

				res.json({
							code    : Constant.constant.STATUS.SUCCESS.UPLOAD_SUCCESS.code,
						  	message : Constant.constant.STATUS.SUCCESS.UPLOAD_SUCCESS.message 
						  });
			}
		})
	}

	function storeImageInFD(res, userName, path, fileName, ext, choice){

		fs.readFile(path, function(err, data){
			
			var newPath    = __dirname + "/../../public/uploads/" + userName + '/';
			var uploadPath = __dirname + "/../../public/uploads/"; 

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
												writeImage(newPath, fileName, ext, res, data, choice);
											}
										})
									}
									else{

										//folder user exist
										//create file
										writeImage(newPath, fileName, ext, res, data, choice);
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
										writeImage(newPath, fileName, ext, res, data, choice);
									}
								})
							}
							else{

								//folder user exist
								//create file
								writeImage(newPath, fileName, ext, res, data, choice);
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

	function insertImageInDB(res, userName, files, data){

		var ext   = (files.file.originalFileName ? getExtension(files.file.originalFileName) : getExtension(''));
		var title, choice;

		//the data needed is : title, select, extension, userID
		if(data.title && data.select && files){
			
			title  = data.title;
			choice = data.select;
			
			//push the data of image into the database
			UploadModel.findOneAndUpdate({userName : userName}, {$push : {image : {title : title, choice : choice, ext : ext}}}, {upsert : true}, function(error, doc){

				if(!error && doc){

					//get the last data from the doc call back to get the id of the image
					//the id is a ramdom string generated by the database
					var fileName = doc.image[doc.image.length - 1]._id || 'defaultname';
					var path     = files.file.path || '';
					
					//store that image in server 
					storeImageInFD(res, userName, path, fileName, ext, choice);
				}
				else{
					res.json(storeImageErrorCallBack(error));
				}
			})
		}
		else{
			res.json({
					  code    : Constant.constant.STATUS.ERROR.USER_CREDENTIAL_WRONG_FORMAT.code,
					  message : Constant.constant.STATUS.ERROR.USER_CREDENTIAL_WRONG_FORMAT.message
					})
		} 
	}

	this.uploadImage = function(req, res){

		var userName = req.session.userName;
		var files    = req.files;
		var data     = req.body;
		
		insertImageInDB(res, userName, files, data);
	}
}

exports.upload = Upload;