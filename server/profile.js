exports.getUser = function(pool, req, res) {
	pool.query("SELECT firstname, lastname, age, admin FROM users WHERE username = ?", req.query.username, function(err, result) {
		res.send(result);
		res.status(200).end();
	});
};

exports.changePassword = function(pool, bcrypt, req, res) {
	pool.query("SELECT password FROM users WHERE username = ?", req.body.username, function(err, result) {
		if (result.length > 0) {
			bcrypt.compare(req.body.oldPassword, result[0].password, function(err, result2) {
				if (result2) {
					return bcrypt.genSalt(10).then(salt => {
						return bcrypt.hash(req.body.newPassword, salt);
					}).then(hash => {
						var data = [hash, req.body.username];
						pool.query("UPDATE users SET password = ? WHERE username = ?", data, function(err, result) {
							res.status(200).end();
						});
					});
				}
				else
					res.status(201).end();
			});
		}
		else
			res.status(202).end();
	});
};

exports.deleteProfile = function(pool, req, res) {
	pool.query("DELETE FROM users WHERE username = ?", req.query.username, function(err, result) {
		if (!err) {
			req.session.reset();
			req.rememberme.reset();
			res.status(200).end();
		}
		else
			console.log("Deletion failed");
	});
};