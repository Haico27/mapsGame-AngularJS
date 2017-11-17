controllers.controller("socketCtrl", function($scope, $location, $http, socket, $timeout) {
	$scope.allChatMessages = new Object();
	$scope.currentRoomMessages = [];
	$scope.chatRooms = [];
	$scope.showNavbar = false;


	//This contains the username of the currently logged in user and can be retrieved from any controller by using $scope.$parent.user
	$scope.user = undefined;

	//This function connects the user to chat. This is only called when someone is actually logged in
	$scope.connect = function() {
		$scope.online = true;
		$scope.showNavbar = true;
		console.log("Connecting to chat...");
		socket.emit('join', $scope.user);
		console.log("Connected to chat");

		//Listen to users joining
		socket.on('hi', function(user) {
			console.log(user, "connected to chat");
		});

		//Listen to users leaving
		socket.on('bye', function(user) {
			console.log(user, "disconnected from chat");
		});

		//Listen to incoming chat messages
		socket.on('chat message', function(messageObject) {
			$scope.allChatMessages[messageObject.room].push(messageObject);
		});

		$scope.joinRoom("general");
		$scope.joinRoom("random");
		$scope.room = "general";
		$scope.chatRooms[0].active = true;
		$scope.updateRooms();
	};

	//This function sends a message to every other user in the currently selected chatroom
	//Chat message and room retrieved from index.ejs
	$scope.sendMessage = function() {
		var msg = $scope.chatMessage;
		$scope.chatMessage = "";
		if (msg != "") {
			messageObject = {user: $scope.user, message: msg, room: $scope.room};
			socket.emit('chat message', messageObject);
		}
	};

	//This function lets the user join a specified chatroom.
	//This can be called from every other controller using $scope.$parent.joinRoom("roomname")
	$scope.joinRoom = function(room) {
		socket.emit('join-room', room);
		if (!$scope.allChatMessages.hasOwnProperty(room))
			$scope.allChatMessages[room] = [];



			for (var i = 0; i < $scope.chatRooms.length; i++) {
				if ($scope.chatRooms[i].name == room) {
					return
				}
			}
			$scope.chatRooms.push({
				name: room,
				active: false
			})







		console.log("Joined room", room);
		console.log($scope.chatRooms)
	};

	//This function changes the currently selected room.
	//Parameter room retrieved from index.ejs
	$scope.changeRoom = function(room) {
		for (var i = 0; i < $scope.chatRooms.length; i++) {
			if ($scope.chatRooms[i].name == room) {
				$scope.chatRooms[i].active = true;
			}
			if ( $scope.chatRooms[i].name == $scope.room) {
				$scope.chatRooms[i].active = false;
			}
		}
		$scope.room = room;
		$scope.updateRooms();
		console.log($scope.chatRooms)
	};

	//This function changes the display of the active chatroom
	// $scope.isActive = function(room) {
	// 	var active = ( room === )
	// 	return active;
	// };

	//This function lets the user leave a specified chat room.
	//Calling it works similar to the joinRoom function
	$scope.leaveRoom = function(room) {
		socket.emit('leave-room', room);
		var index = $scope.chatRooms.indexOf(room);
		if (index >= 0) {
			$timeout(function() {
				$scope.chatRooms.splice($scope.chatRooms.indexOf(room), 1);
			});
		}
	};

	//This function updates the chatroom and should always be called when changing rooms
	$scope.updateRooms = function() {
		$scope.currentRoomMessages = $scope.allChatMessages[$scope.room];
	};

	//This function disconnects the user from chat. Will be called when logging out (homeController.js)
	$scope.disconnect = function() {
		socket.emit('dc', $scope.user);
		$scope.online = false;
		$scope.showNavbar = false;
		$scope.user = undefined;
		$scope.$parent.user = undefined;
	};

	//This function is called when this script file is loaded and checks if someone is logged in and connects them to chat if so
	checkSession($http, function(user) {
		if (user != null) {
			$scope.user = user;
			$scope.$parent.user = user;
			$scope.connect();
		}
		else
			console.log("Log in to use chat");
		$scope.$parent.checkRedirect();
	});


	$scope.logout = function() {
		//Disconnect from chat
		$scope.disconnect();
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

});
