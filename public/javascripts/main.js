requirejs.config({

});

require(['app',
		 'constant',
		 'services/UserService',
		 'controller/PartialCtrl',
		 'controller/UserCredentialCtrl',
		 'controller/FileUploadCtrl',
		 'directives/Directives'], 
	function(){
		angular.bootstrap(document, ['myApp']);
});
