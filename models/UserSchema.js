/*=========================================
	Create all the database schema
===========================================*/
var mongoose         = require('mongoose');
var Schema           = mongoose.Schema;
var UserSchema       = new Schema({
	
	userName : {
		type     : String, 
		required : true, 
		unique   : true
	},
	
	password : {
		type     : String,
		required : true
	}	
}) ;

var ImageSchema      = new Schema({
	title  : String,
	choice : String,
	ext    : String
})

var AnswerSchema     = new Schema({
	answer : String
})

var QuestionSchema   = new Schema({
	title   : String,
	answers : [AnswerSchema],
	select  : String
})

var UploadSchema     = new Schema({
	
	userID : {
		type     : String,
		required : true,
		unique   : true
	},

	image    : [ImageSchema],
	question : [QuestionSchema]
})

exports.UserSchema   = UserSchema;
exports.UploadSchema = UploadSchema;