exports.initialize = function(io) {
	var onlineUsers = [];
	
	io.on('connection', function(socket) {
		//Listen to user joining namespace
		socket.on('join', function(name) {
			var user = {id: socket.id, name: name};
			onlineUsers.push(user);
			io.emit('hi', name);
		});

		//Listen to incoming chat messages
		socket.on('chat message', function(messageObject) {
			io.to(messageObject.room).emit('chat message', messageObject);
		});

		//Listen to users disconnecting
		socket.on('dc', function(user) {
			socket.disconnect();
		});

		//Handle disconnections
		socket.on('disconnect', function() {
			var name;;
			for (var i = 0; i < onlineUsers.length; i++) {
				if (onlineUsers[i].id == socket.id) {
					name = onlineUsers[i].name;
					onlineUsers.splice(i, 1);
					break;
				}
			}
			io.emit('bye', name);
		});

		//Listen to room join requests
		socket.on('join-room', function(room) {
			socket.join(room);
		});

		//Listen to room leave requests
		socket.on('leave-room', function(room) {
			socket.leave(room);
		});

		socket.on('new-multi-room', function(multiRoom) {
			io.emit('new-multi-room', multiRoom);
		});

		socket.on('multi-room-gone', function(roomID) {
			io.emit('multi-room-gone', roomID);
		});

		socket.on('player-joined', function(playerName) {
			io.emit('player-joined', playerName);
		});

		socket.on('player-left', function(playerName) {
			socket.broadcast.emit('player-left', playerName);
		});

		socket.on('submittedAnswer', function(correct) {
			socket.broadcast.emit('submittedAnswer', correct);
		});
	});
}