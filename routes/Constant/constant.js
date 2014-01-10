function Constant(){
	var constant = {
		error : {
			USER_REGISTERED : {
				code : '101',
				message : 'User name already registerd'
			}
		},

		success : {
			USER_REGISTER : {
				code : '201',
				message : 'User register successfully'
			}
		}
	}

	this.sendStatus = function(action, isError){
		return isError ? constant.error[action] : constant.success[action];
	}
} 

exports.constant = Constant;
