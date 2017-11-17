controllers.controller("loginCtrl", function($scope, $location, $http) {
	$scope.login = function() {
		$http({
			url: '/login',
			method: 'POST',
			data: angular.toJson($scope.loginField)
		}).then(function(result) {
			if (result.data.length > 0) {
				console.log("Logged in");
				window.location.href = '/';
			}
			else
				console.log("Login attempt failed");
		});
	};

	$scope.register = function() {
		$location.path("/register");
	};
});