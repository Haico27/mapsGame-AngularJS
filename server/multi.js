exports.getRooms = function(pool, req, res) {
	pool.query("SELECT * FROM multiplayer", function(err, result) {
		res.send(JSON.stringify(result));
		res.status(200).end();
	});
};

exports.createRoom = function(pool, req, res) {
	if (req.body.name === null)
		res.status(201).end();
	else {
		var data = [req.body.name, req.body.player1];
		pool.query("INSERT INTO multiplayer (name, player1) VALUES (?, ?)", data, function(err, result) {
			pool.query("SELECT id FROM multiplayer WHERE name = ?", req.body.name, function(err2, result2) {
				req.session.multi = result2[0].id;
				res.send(result2);
				res.status(200).end();
			});
		});
	}
};

exports.joinRoom = function(pool, req, res) {
	var data = [req.body.player, req.body.id];
	pool.query("SELECT player1, player2 FROM multiplayer WHERE id = ?", req.body.id, function(err, result) {
		if (result[0].player1 == null) {
			pool.query("UPDATE multiplayer SET player1 = ? WHERE id = ?", data, function(err2, result2) {
				req.session.multi = req.body.id;
				res.status(200).end();
			});
		}
		else if (result[0].player2 == null) {
			pool.query("UPDATE multiplayer SET player2 = ? WHERE id = ?", data, function(err2, result2) {
				req.session.multi = req.body.id;
				res.status(200).end();
			});
		}
		else {
			res.status(201).end();
		}
	});
};

exports.getRoom = function(pool, req, res) {
	if (req.session.multi)
		res.send(String(req.session.multi));
	res.status(200).end();
};

exports.closeRoom = function(pool, req, res) {
	pool.query("DELETE FROM multiplayer WHERE id = ?", req.query.id, function(err, result) {
		req.session.multi = undefined;
		res.status(200).end();
	});
};

exports.checkPlayers = function(pool, req, res) {
	pool.query("SELECT player1, player2 FROM multiplayer WHERE id = ?", req.query.roomID, function(err, result) {
		res.send(result);
		res.status(200).end();
	});
};