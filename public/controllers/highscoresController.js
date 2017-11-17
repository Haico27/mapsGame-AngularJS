controllers.controller("highscoresCtrl", function($scope, $location, $http) {
	$scope.loadHighScores = function () {
		$http.get('/highscores').then(function(response) {
			$scope.users = response.data;
			$scope.users.sort(function(a,b) {
				return (b.highscore > a.highscore) ? 1 : ((a.highscore > b.highscore) ? -1 : 0) });
		});
	};

	$scope.loadHighScores();

	$scope.gotoHome = function() {
		$location.path('/');
	};
});
