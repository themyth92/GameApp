var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var UserSchema  = new Schema({
	
	userName : {
		type : String, 
		required : true, 
		unique : true
	},
	
	password : {
		type : String,
		required : true
	}	
}) ;

var ImageSchema      = new Schema({
	title  : String,
	choice : String,
	ext    : String
})

var QuestionSchema   = new Schema({
	title : String,
	ans1  : String,
	ans2  : String,
	ans3  : String
})

var UploadSchema     = new Schema({
	
	userID : {
		type : String,
		required : true,
		unique : true
	},

	image : [ImageSchema],
	question : [QuestionSchema]
})

exports.UserSchema   = UserSchema;
exports.UploadSchema = UploadSchema;