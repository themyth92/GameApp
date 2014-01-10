requirejs.config({

});

require(['app',
		 'services/UserService',
		 'controller/UserRegisterCtrl'], 
	function(){
		angular.bootstrap(document, ['myApp']);
});
