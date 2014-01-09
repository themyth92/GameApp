var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var UserSchema  = new Schema({
	userName : String,
	password : String	
}) ;

export.UserSchema = UserSchema;