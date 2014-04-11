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

	storyStage : {
		type 	: Number,
		default : 1
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
	type 		: String,
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
	qnsIndex : Number
})

var SavedGameSchema = new Schema({
	
	userName : {
		type     : String,
		required : true
	},
	title : String,
	player : {
		pos 	: Number,
		gender 	: String
	},
	enemy : [EnemySchema],
	obstacles : [ObstacleSchema],
	screen : Number,
	scoreboard :{
		maxCoin : Number,
		maxLife : Number,
		minStart: Number,
		secStart: Number
	},
	screenShot : String
})


var PublishedGameSchema = new Schema({
	
	userName : {
		type     : String,
		required : true
	},
	title : String,
	player : {
		pos 	: Number,
		gender 	: String
	},
	enemy : [EnemySchema],
	obstacles : [ObstacleSchema],
	screen : Number,
	scoreboard :{
		maxCoin : Number,
		maxLife : Number,
		minStart: Number,
		secStart: Number
	},
	screenShot : String
})

exports.UserSchema   		= UserSchema;
exports.UploadSchema 		= UploadSchema;
exports.SavedGameSchema 	= SavedGameSchema;
exports.PublishedGameSchema = PublishedGameSchema;