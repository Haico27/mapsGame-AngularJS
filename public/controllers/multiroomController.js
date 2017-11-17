controllers.controller("multiroomCtrl", function($scope, $location, $http, socket, $timeout) {
	var roomID, chatroomName;
	$scope.user = $scope.$parent.user;
	$scope.gamestart = false;
	$scope.gameover = false;
	$scope.youAnswered = false;
	$scope.opponentAnswered = false;
	$scope.opponentPresent = false;
	$scope.score = 0;
	$scope.opponentScore = 0;
	$scope.count = 0;
	parent = $scope.$parent;
	$scope.goNextQuestion = true;

	socket.removeAllListeners('player-left');

	function initializeRoom() {
		$http({
			url: '/multi/getroom',
			method: 'GET'
		}).then(function(response) {;
			roomID = Number(response.data);
			chatroomName = "multi_" + roomID;
			$scope.user = $scope.user;

			if (!$scope.initialized) {
				parent.joinRoom(chatroomName);

				//Close room if opponent disconnects or leaves
				socket.on('bye', function(playerName) {
					if (playerName == $scope.opponent) {
						$scope.closeRoom();
						console.log("Your opponent disconnected!");
					}
				});

				socket.on('player-left', function(playerName) {
					if ($scope.opponentPresent) {
						console.log("Your opponent left the room!");
						$scope.closeRoom();
					}
					$scope.opponentPresent = false;
				});
			}

			//Check if two players in the room
			$http({
				url: '/multi/checkplayers',
				method: 'GET',
				params: {roomID: roomID}
			}).then(function(result) {
				if (result.status == 200) {
					if (result.data[0].player1 == null || result.data[0].player2 == null) {
						//No second player
						$scope.opponent = "No-one yet...";
						console.log("Waiting for second player...");
						socket.on('player-joined', function(playerName) {
							console.log(playerName, "joined the game!");
							$scope.opponent = playerName;
							$scope.gamestart = true;
							$scope.startGame();
						});
					}
					else {
						//Two players in the room
						console.log("The game can start!");
						if (result.data[0].player1 == $scope.user)
							$scope.opponent = result.data[0].player2;
						else
							$scope.opponent = result.data[0].player1;
						$scope.gamestart = true;
						$scope.startGame();
					}
				}
			});
			$scope.initialized = true;
		});
	};

	$scope.startGame = function() {
		$scope.opponentPresent = true;
		initializeMap($scope);
		loadQuestions($scope, $http);
		socket.on('submittedAnswer', function(score) {
			$scope.opponentScore = score;
			console.log("Opponent score:", $scope.opponentScore);
			$scope.opponentAnswered = true;
			$scope.checkIfNextQuestion();
		});
	};

	$scope.checkIfNextQuestion = function() {
		if ($scope.youAnswered && !$scope.opponentAnswered)
			$scope.question.question = "Waiting for opponent to answer question";
		if ($scope.youAnswered && $scope.opponentAnswered) {
			$scope.youAnswered = false;
			$scope.opponentAnswered = false;
			$scope.goNextQuestion = true;
			$scope.nextQuestion();
		}
	}

	$scope.nextQuestion = function() {
		console.log("questions:", $scope.questions);
		if ($scope.questions.length == 0) {
			$scope.endGame();
		}
		else if ($scope.goNextQuestion) {
			$scope.question = $scope.questions[0];
			$scope.questions.splice(0, 1);
			$scope.count++;
			$scope.goNextQuestion = false;
		}
		changeMapStyle($scope, $scope.question.type);
	};

	$scope.submitAnswer = function() {
		if ($scope.youAnswered)
			return;
		var oldScore = $scope.score;
		var correct;
		switch ($scope.question.type) {
			case 'exact':
				submitExactAnswer($scope, $scope.endQuestion);
				break;
			case 'estimate':
				submitEstimateAnswer($scope, $http, $scope.currentMarker.getPosition(), $scope.endQuestion);
				break;
			case 'distance':
				submitDistanceAnswer($scope, $http, $scope.currentMarker.getPosition(), $scope.endQuestion);
				break;
		}
	};

	$scope.endQuestion = function() {
		socket.emit('submittedAnswer', $scope.score);
		$scope.youAnswered = true;
		$scope.checkIfNextQuestion();
	}

	$scope.endGame = function() {
		$scope.gameover = true;
		if ($scope.score > $scope.opponentScore)
			$scope.winner = $scope.user;
		else if ($scope.opponentScore > $scope.score)
			$scope.winner = $scope.opponent;
		else
			$scope.winner = $scope.user + " and " + $scope.opponent;

		$scope.youAnswered = true;
		$scope.opponentAnswered = true;
		console.log("The game ended!");
	};

	$scope.closeRoom = function() {
		$http({
			url: '/multi/closeroom',
			method: 'DELETE',
			params: {id: roomID}
		}).then(function(result) {
			parent.leaveRoom(chatroomName);
			socket.emit('multi-room-gone', roomID);
			$location.path("/multi");
		});
	};

	$scope.goBack = function() {
		socket.emit('player-left', $scope.user);
		parent.leaveRoom(chatroomName);
		$location.path("/multi");
	};

	$scope.zoomWorld = function(latitude, longitude) { zoomWorld($scope, latitude, longitude) };
	$scope.zoomContinent = function(latitude, longitude) { zoomContinent($scope, latitude, longitude) };
	$scope.reloadMap = function() { reloadMap($scope) ;};
	$scope.resetMap = function() { resetMap($scope); };

	initializeRoom();

	$scope.$parent.showNavbar = false
});
