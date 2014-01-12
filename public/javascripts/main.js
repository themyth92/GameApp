requirejs.config({

});

require(['app',
		 'constant',
		 'services/UserService',
		 'controller/PartialCtrl',
		 'controller/UserCredentialCtrl',
		 'directives/Directives'], 
	function(){
		angular.bootstrap(document, ['myApp']);
});
