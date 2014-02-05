requirejs.config({

});

require(['app',
		 'constant',
		 'services/UserService',
		 'services/UploadService',
		 'services/SocketService',
		 'controller/PartialCtrl',
		 'controller/UserCredentialCtrl',
		 'controller/FileUploadCtrl',
		 'directives/Directives'], 
	function(){
		angular.bootstrap(document, ['myApp']);
});
