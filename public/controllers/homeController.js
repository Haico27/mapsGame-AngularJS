controllers.controller("homeCtrl", function($scope, $location, $http) {
	$scope.goto = function(path) {
		$location.path(path);
	};

	$scope.logout = function() {
		//Disconnect from chat
		$scope.$parent.disconnect();
		//Remove session cookies (both current session login and remember me cookie)
		$http({
			url: '/session/removesession',
			method: 'POST'
		}).then(function(response) {
			//Redirect to login page
			$location.path('/login');
			window.location.reload();
		});
	};

	$scope.$parent.showNavbar = true;
});
