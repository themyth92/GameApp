requirejs.config({

});

require(['app',
		 'services/userRegisterService',
		 'controller/userRegisterCtrl'], function(){
	 angular.bootstrap(document, ['myApp']);
});
