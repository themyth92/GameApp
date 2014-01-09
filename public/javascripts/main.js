requirejs.config({

});

require(['app',
	     'module/servicesModule',
		 'services/userRegisterService',
		 'module/ctrlModule',
		 'controller/userRegisterCtrl'], function(){
	 angular.bootstrap(document, ['myApp']);
});
