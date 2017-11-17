controllers.controller("multiCtrl", function($scope, $location, $http, socket) {
	$scope.allMultiRooms = new Object();
	$scope.user = $scope.$parent.user;

	function getAllRooms() {
		$http({
			url: '/multi/getrooms',
			method: 'GET',
		}).then(function(result) {
			if (result.status == 200) {
				for (var i = 0; i < result.data.length; i++)
					$scope.allMultiRooms[result.data[i].id] = result.data[i];
			}
		});
	}

	$scope.createRoom = function() {
		if ($scope.roomName == undefined) {
			console.log("Please enter a room name before submitting!");
			return;
		}
		console.log("roomname:", $scope.roomName);
		var roomObject = {
			name: $scope.roomName,
			player1: $scope.user
		};

		$scope.roomName = undefined;

		$http({
			url: '/multi/createroom',
			method: 'POST',
			data: angular.toJson(roomObject)
		}).then(function(result) {
			roomObject.id = result.data[0].id;
			socket.emit('new-multi-room', roomObject);
			$location.path('/multimaps');
		});
	};

	socket.on('new-multi-room', function(multiRoom) {
		$scope.allMultiRooms[multiRoom.id] = (multiRoom);
	});

	socket.on('multi-room-gone', function(roomID) {
		delete $scope.allMultiRooms[roomID];
	});

	$scope.joinRoom = function(id) {
		var data = {id: id, player: $scope.user};
		$http({
			url: '/multi/joinroom',
			method: 'PUT',
			data: angular.toJson(data)
		}).then(function(result) {
			if (result.status == 200) {
				socket.emit('player-joined', $scope.user);
				$location.path('/multimaps');
			}
			else if (result.status == 201) {
				console.log("Room already full!");
			}
		});
	};

	getAllRooms();

	$scope.gotoHome = function() {
		$location.path('/');
	};

	$scope.$parent.showNavbar = true;
});
