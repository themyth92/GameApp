requirejs.config({

});

require(['app',
		 'constant',
		 'services/DataService',
		 'services/UserService',
		 'services/UploadService',
		 'services/SocketService',
		 'services/RouteResolverService',
		 'services/FlashServerComService',
		 'controller/PartialCtrl',
		 'controller/UserCredentialCtrl',
		 'controller/FileUploadCtrl',
		 'directives/Directives'], 
	function(){
		angular.bootstrap(document, ['myApp']);
});
