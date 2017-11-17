var mapsApp = angular.module("mapsApp", [
	"ngRoute",
	"controllers"
	]);

mapsApp.factory("socket", function($rootScope) {
	var socket = io.connect();
	return {
		on: function(eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		},
		emit: function(eventName, data, callback) {
			socket.emit(eventName, data, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					if (callback)
						callback.apply(socket, args);
				});
			});
		},
		removeAllListeners: function(eventName, callback) {
			socket.removeAllListeners(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		}
	};
});

mapsApp.config(function($routeProvider, $locationProvider) {
	$routeProvider.when('/', {
		templateUrl: "/views/home.ejs",
		controller: "homeCtrl"
	}).when('/login', {
		templateUrl: "/views/login.ejs",
		controller: "loginCtrl"
	}).when("/maps", {
		templateUrl: "/views/maps.ejs",
		controller: "mapsCtrl"
	}).when("/register", {
		templateUrl: "/views/register.ejs",
		controller: "registerCtrl"
	}).when("/profile", {
		templateUrl: "/views/profile.ejs",
		controller: "profileCtrl"
	}).when('/highscores', {
		templateUrl: "/views/highscores.ejs",
		controller: "highscoresCtrl"
	}).when('/multi', {
		templateUrl: "/views/multi.ejs",
		controller: "multiCtrl"
	}).when('/multimaps', {
		templateUrl: "/views/multi-maps.ejs",
		controller: "multiroomCtrl"
	});
	$locationProvider.html5Mode(false).hashPrefix('!');
});

var controllers = angular.module("controllers", []);