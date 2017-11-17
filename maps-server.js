//DEPENDENCIES
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var session = require('client-sessions');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bcrypt = require('bcrypt');

//ADDITIONAL SERVER FILES
var multi = require('./server/multi');
var socket = require('./server/socket');
var password = require('./server/db-pass.js');
var profile = require('./server/profile.js');
var sessionQuery = require('./server/session.js');

//ESTABLISH DATABASE CONNECTION
var pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: password.getPassword(),
	database: 'map_data'
});

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

//SET APP
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/views');
app.set('view engine', 'ejs');
socket.initialize(io);
http.listen(process.env.PORT || 5000);

//HOME PAGE
app.get('/', function(req, res) {
	res.render('index');
});

//CREATE COOKIES
app.use(session({
	cookieName: 'session',
	secret: 'Marsepeinpepernoten',
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000,
	cookie: {
		ephemeral: true,
		httpOnly: true
	}
}));

app.use(session({
	cookieName: 'rememberme',
	secret: 'Speculaaseieren',
	duration: 31 * 24 * 60 * 60 * 1000,
	cookie: {
		httpOnly: true
	}
}));

//DATABASE QUERIES
app.get('/cities', function(req, res) {
	pool.query("SELECT * FROM map_data", function(err, rows, fields) {
		if (!err)
			res.send(JSON.stringify(rows));
		else
			console.log("Error while performing query");
	});
});

app.post('/city', function(req, res) {
	var newCity = {name: req.body.name, lat: req.body.lat, lng: req.body.lng};
	pool.query("INSERT INTO map_data SET ?", newCity, function(err, result) {
		res.status(200).end();
	});
});

app.post('/givenanswer', function(req, res) {
	var answerData = [req.body.questionId, req.body.givenAnswer];

	console.log("variabele answerData from server: ", answerData);
	pool.query("SELECT * FROM questions WHERE id = ? AND answer = ?", answerData, function(err, result) {
		console.log("result of givenAnswer post function: ", result);
		res.send(result);
		res.status(200).end();
	});
});

app.get('/getEstimateAnswer', function(req, res) {
	pool.query("SELECT * FROM estimateQuestions WHERE id = ?", req.query.id, function(err, result) {
		res.send(result);
		res.status(200).end();
	});
});

app.get('/getDistanceAnswer', function(req, res) {
	pool.query("SELECT * FROM distanceQuestions WHERE id = ?", req.query.id, function(err, result) {
		res.send(result);
		res.status(200).end();
	});
});

app.post('/login', function(req, res) {
	pool.query("SELECT id, username, password FROM users WHERE username = ?", req.body.username, function(err, result) {
		if (result.length > 0) {
			bcrypt.compare(req.body.password, result[0].password, function(err, result2) {
				if (result2) {
					//Save user in session cookie
					req.session.user = result[0];
					if (req.body.rememberLogin) {
						var authenticator = Math.floor((Math.random() * 10000000) + 1);
						req.rememberme.id = result[0].id;
						req.rememberme.auth = authenticator;
						var data = [result[0].id, authenticator];
						pool.query("INSERT INTO remember (user_id, authenticator) VALUES (?, ?)", data, function(err, result) { });
					}
					delete result[0].password;
					res.send(result);
					res.status(200).end();
				}
				else
					res.status(200).end();
			});
		}
		else
			res.status(200).end();
	});
});

app.post('/register', function(req, res) {
	return bcrypt.genSalt(10).then(salt => {
		return bcrypt.hash(req.body.password, salt);
	}).then(hash => {
		req.body.password = hash;
		console.log("Password hash:", req.body.password);
		pool.query("INSERT INTO users SET ?", req.body, function(err, result) {
			console.log("Error:", err);
			res.status(200).end();
		});
	});
});

app.get('/questions', function(req, res) {
	pool.query("SELECT * FROM questions", function(err, rows, fields) {
		if (!err)
			res.send(JSON.stringify(rows))
		else {
			console.log('Error while retrieving questions')
		}
	});
});

app.get('/highscore', function(req, res) {
	var currentUser = req.query.userName;
	pool.query("SELECT highscore FROM users WHERE username = ?", currentUser, function(err, result) {
		if (!err)
			res.send(result);
			res.status(200).end();
	});
});

app.put('/user/updatescore', function(req, res) {
	var data = [ req.body.finalScore, req.body.userName ]
	pool.query("UPDATE users SET highscore = ? WHERE username = ?", data, function(err, result) {
		console.log(result)
		res.status(200).end();
	});
});

app.get('/highscores', function(req, res) {
	pool.query("SELECT firstname, highscore FROM users WHERE highscore != 'NULL'", function(err, result) {
		if (!err) {
			res.send(result)
			res.status(200).end();
		}
	});
});
app.get('/session/login', function(req, res) { sessionQuery.login(req, res); });
app.get('/session/rememberme', function(req, res) { sessionQuery.rememberMe(pool, req, res); });
app.post('/session/removesession', function(req, res) { sessionQuery.removeSession(pool, req, res); });

app.get('/profile/getuser', function(req, res) { profile.getUser(pool, req, res); });
app.delete('/profile/delete', function(req, res) { profile.deleteProfile(pool, req, res); });
app.put('/profile/changepassword', function(req, res) { profile.changePassword(pool, bcrypt, req, res); });

app.get('/multi/getrooms', function(req, res) { multi.getRooms(pool, req, res); });
app.post('/multi/createroom', function(req, res) { multi.createRoom(pool, req, res); });
app.put('/multi/joinroom', function(req, res) { multi.joinRoom(pool, req, res); });
app.get('/multi/getroom', function(req, res) { multi.getRoom(pool, req, res); });
app.delete('/multi/closeroom', function(req, res) { multi.closeRoom(pool, req, res); });
app.get('/multi/checkplayers', function(req, res) { multi.checkPlayers(pool, req, res); });
