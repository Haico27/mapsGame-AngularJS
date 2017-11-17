//This controller is parent of socketController and check whether the user needs to be redirected to the login page
controllers.controller("redirectCtrl", function($scope, $location, $http) {
	$scope.user;
	$scope.homeActive = true;
	$scope.profileActive = false;
	$scope.highscoresActive = false;
	$scope.currentlyActive = '';

	$scope.makeFalse = function (path) {
		if (path != '/') {
			$scope.homeActive = false;
		}
		if (path != '/profile') {
			$scope.profileActive = false;
		}
		if (path != '/highscores') {
			$scope.highscoresActive = false;
		}
	}

	$scope.checkRedirect = function() {
		if ($scope.user == null)
			$location.path('/login');
	};

	$scope.goto = function(path) {

		$location.path(path);

		switch(path) {
			case '/':
				$scope.homeActive = true;
				$scope.makeFalse(path);
				break;
			case '/profile':
				$scope.profileActive = true;
				$scope.makeFalse(path);
				break;
			case '/highscores':
				$scope.highscoresActive = true;
				$scope.makeFalse(path);
				break;
		}


	};
});
