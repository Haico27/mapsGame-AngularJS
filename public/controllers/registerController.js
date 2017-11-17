controllers.controller("registerCtrl", function($scope, $location, $http) {
	$scope.registerUser = function() {
		$http({
			url: '/register',
			method: 'POST',
			data: angular.toJson($scope.reg)
		}).then(function(result) {
			if (result.status == 200) {
				console.log("Registered succesfully");
				$location.path('/login');
			}
			else
				console.log("Error while trying to register user");
		});
	};
});