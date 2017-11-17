controllers.controller("mapsCtrl", function($scope, $location, $http, socket, $timeout) {
	$scope.user = $scope.$parent.user;
	$scope.markers = [];
	$scope.showGame = false;

	$scope.score = 0;
	//sets the questioncount when displaying questions
	$scope.count = 0;
	$scope.hideSavebutton = true;
	$scope.hideFinalScore = true;
	$scope.showFinalMessage = false;
	$scope.highscoreMessage;

	$scope.load = function() {
		$scope.showGame = true;
		initializeMap($scope);
		loadQuestions($scope, $http);
	};

	//function that displays questions from database in random order
	$scope.nextQuestion = function() {
		if ($scope.questions.length == 0) {
			$scope.finishMessage = 'You answered all questions!';
			$scope.hideQuestion = true;
			$scope.hideSavebutton = false;
			return;
		}
		$scope.map.setZoom(4);
		$scope.question = $scope.questions[Math.floor(Math.random() * $scope.questions.length)];
		$scope.questionId = $scope.question.id;

		var index = $scope.questions.indexOf($scope.question);
		if ( index > -1 ) {
			$scope.questions.splice(index, 1);
			$scope.count++;
		}
		changeMapStyle($scope, $scope.question.type);
	};

	//function that sends the answer the user clicks to the database to be checked
	$scope.givenAnswer = function() {
		switch ($scope.question.type) {
			case 'exact':
				submitExactAnswer($scope, $scope.nextQuestion);				
				break;
			case 'estimate':
				submitEstimateAnswer($scope, $http, $scope.currentMarker.getPosition(), $scope.nextQuestion);
				break;
			case 'distance':
				submitDistanceAnswer($scope, $http, $scope.currentMarker.getPosition(), $scope.nextQuestion);
				break;
		}
	};

	$scope.saveScore = function () {
		$scope.finalScore = $scope.score;
		$scope.showFinalMessage = true;
		var data = { userName: $scope.user, finalScore: $scope.finalScore};
		$http({
			url: '/highscore',
			method: 'GET',
			params: data
		}).then(function(result) {
			if ( $scope.finalScore > result.data[0].highscore ) {
				$http.put('/user/updatescore', angular.toJson(data))
					.then( function() {
						console.log("highscore updated in database");
						$scope.highscoreMessage = "NEW PERSONAL HIGHSCORE! You scored " + $scope.finalScore + " points";
					});
			}
			else
				console.log("Score not updated, highscore in database is higher than the finalScore of this quiz");
				$scope.highscoreMessage = "You scored " + $scope.finalScore + " points. No highscore.";
				console.log($scope.highscoreMessage)
		});

		$scope.hideSavebutton = true;
		$scope.hideFinalScore = false;
	};

	$scope.zoomWorld = function(latitude, longitude) { zoomWorld($scope, latitude, longitude) };
	$scope.zoomContinent = function (latitude, longitude) { zoomContinent($scope, latitude, longitude) };

	$scope.gotoHome = function() {
		$location.path('/');
	};

	$scope.reloadMap = function() { reloadMap($scope); };
	$scope.resetMap = function() { resetMap($scope); };

	$scope.$parent.showNavbar = false;
});
