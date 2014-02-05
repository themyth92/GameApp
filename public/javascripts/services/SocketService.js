define(['app'], function(app){

	var SocketService = function($rootScope){
		
		var socket = io.connect();

		return {
			on : function(eventName, callBack){
				socket.on(eventName, function(){
					var args = arguments;
					$rootScope.$apply(function(){
						callBack.apply(socket, args);
					})
				})
			},

			emit : function(eventName, data, callBack){
				socket.emit(eventName, data, function(){
					var args = arguments;
					$rootScope.$apply(function(){
						if(callBack){
							callBack.apply(socket, args);
						}
					})
				})
			}
		}
	}

	app.factory('SocketService', ['$rootScope', SocketService]);
})