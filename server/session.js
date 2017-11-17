exports.login = function(req, res) {
	if (req.session.user)
		res.send(req.session.user);
	res.status(200).end();
};

exports.rememberMe = function(pool, req, res) {
	if (req.rememberme) {
		var data = [req.rememberme.id, req.rememberme.auth];
		pool.query("SELECT id FROM remember WHERE user_id = ? AND authenticator = ?", data, function(err, result) {
			if (result.length > 0)
				pool.query("SELECT id, username FROM users WHERE id = ?", req.rememberme.id, function(err2, result2) {
					req.session.user = result2[0];
					res.send(result2);
					res.status(200).end();
				});
			else
				res.status(200).end();
		});
	}
};

exports.removeSession = function(pool, req, res) {
	var userID = req.session.id;
	req.session.reset();
	req.rememberme.reset();
	pool.query("DELETE FROM remember WHERE user_id = ?", userID, function(err, result) {
		res.status(200).end();
	});
};