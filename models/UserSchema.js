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
	},

	isTeacher : {
		type     : Boolean,
		required : true
	},

	storyState : {
		type 	: Number,
		default : 0
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
	hint	: String,
	answers : [AnswerSchema],
	select  : String,
	accept  : {
		type    : Number,
		default : 3
		},
	comment : String
})

var UploadSchema     = new Schema({
	
	userName : {
		type     : String,
		required : true,
		unique   : true
	},

	image    : [ImageSchema],
	question : [QuestionSchema]
})

var EnemySchema = new Schema({
	pos			: Number,
	textureIndex: Number,
	type 		: Number,
	speed 		: Number
})

var ObstacleSchema = new Schema({
	pos 		: Number,
	textureIndex: Number,
	isUserDef 	: {
		type 	:Boolean,
		default :false
	},
	type		:Number,
	questionIndex : Number
})

var SavedGameSchema = new Schema({
	
	userName : {
		type     : String,
		required : true,
		unique   : true
	},
	title : String,
	hero : {
		pos 	: Number,
		gender 	: Number
	},
	enemy : [EnemySchema],
	obstacle : [ObstacleSchema],
	screen : {
		textureIndex : Number
	}
})


var PublishedGameSchema = new Schema({
	
	userName : {
		type     : String,
		required : true,
		unique   : true
	},
	title : String,
	hero : {
		pos 	: Number,
		gender 	: Number
	},
	enemy : [EnemySchema],
	obstacle : [ObstacleSchema],
	screen : {
		textureIndex : Number
	}
})

exports.UserSchema   		= UserSchema;
exports.UploadSchema 		= UploadSchema;
exports.SavedGameSchema 	= SavedGameSchema;
exports.PublishedGameSchema = PublishedGameSchema;