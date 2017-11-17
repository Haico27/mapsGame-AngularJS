function initializeMap($scope) {
	var mapOptions = {
		zoom: 4,
		center: new google.maps.LatLng(50,18),
		mapTypeId: google.maps.MapTypeId.TERRAIN,
		mapTypeControlOptions: {
			mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'styled']
		},
		disableDefaultUI: true
	};

	$scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
	$scope.geocoder = new google.maps.Geocoder;

	$scope.map.addListener('click', function(mouseProperties) {
		if ($scope.currentMarker == undefined) {
			$scope.currentMarker = new google.maps.Marker({
				position: mouseProperties.latLng,
				map: $scope.map
			});
		}
		else
			$scope.currentMarker.setPosition(mouseProperties.latLng);
		$scope.foundCity = geocode($scope, mouseProperties.latLng)
	});

	var hideLabelsStyle = new google.maps.StyledMapType(
	[{
		"featureType": "all",
		"elementType": "labels",
		"stylers": [{
			"visibility": "off"
		}]
	}],
	{name: 'Styled Map'});
	$scope.map.mapTypes.set('styled', hideLabelsStyle);

	//Just for easy map position and zoom lookup
	$scope.map.addListener('rightclick', function(mouseProperties) {
		console.log("Map position:", $scope.map.getCenter().lat(), ",", $scope.map.getCenter().lng());
		console.log("Map zoom:", $scope.map.getZoom());
	});
}

function loadQuestions($scope, $http) {
	$http({
		url: '/questions',
		method: 'GET',
	}).then(function(response) {
		$scope.questions = response.data;
		$scope.nextQuestion();
		$scope.hideStartbutton = true;
	});
}

function changeMapStyle($scope, type) {
	var latlng = new google.maps.LatLng($scope.question.map_pos_lat, $scope.question.map_pos_lng);
	var options = {
		center: latlng,
		zoom: $scope.question.map_zoom
	};
	$scope.map.setOptions(options);

	switch (type) {
		case 'estimate':
			$scope.map.setMapTypeId('styled');
			$scope.hideGeocode = true;
			break;
		case 'exact':
			$scope.map.setMapTypeId('terrain');
			$scope.hideGeocode = false;
			break;
		case 'distance':
			$scope.map.setMapTypeId('terrain');
			$scope.questionMarker = new google.maps.Marker({
				position: latlng,
				map: $scope.map
			});
			$scope.hideGeocode = false;
			break;
	}
}

function submitExactAnswer($scope, _callback) {
	if ($scope.foundCity == $scope.question.answer) {
		$scope.score += $scope.question.score;
		console.log("Answer correct");
	}
	else
		console.log("Wrong answer");
	$scope.foundCity = '';
	_callback();
}

function submitEstimateAnswer($scope, $http, answer, _callback) {
	$http({
		url: '/getEstimateAnswer',
		method: 'GET',
		params: {id: $scope.question.id}
	}).then(function(response) {
		var data = response.data[0];
		var correctAnswer = new google.maps.LatLng(data.answer_lat, data.answer_lng);
		var distance = Math.floor(google.maps.geometry.spherical.computeDistanceBetween(answer, correctAnswer));
		var correctFraction = 1 - (distance / data.max_distance);
		if (correctFraction <= 0)
			//Max_distance or more away from the correct answer yields no score
			_callback();
		else if (correctFraction >= data.margin) {
			//Within margin yields maximum score
			$scope.score += $scope.question.score;
			_callback();
		}
		else {
			//Between those two extremes the score depends on the distance between the given answer and the correct answer
			$scope.score += Math.floor($scope.question.score * correctFraction);
			console.log("Distance:", distance);
			console.log("correctFraction:", correctFraction);
			console.log("score:", $scope.score);
		}
		_callback();
	});
}

function submitDistanceAnswer($scope, $http, answer, _callback) {
	$http({
		url: '/getDistanceAnswer',
		method: 'GET',
		params: {id: $scope.question.id}
	}).then(function(response) {
		var data = response.data[0];
		var questionMarker = new google.maps.LatLng(data.marker_pos_lat, data.marker_pos_lng);
		var distance = Math.floor(google.maps.geometry.spherical.computeDistanceBetween(answer, questionMarker));
		console.log("Distance:", distance);
		if (distance > data.distance)
			distance = (2 * data.distance) - distance;
		var correctFraction = distance / data.distance;

		//200 km or more away from marker yields no points
		if (correctFraction > 0) {
			$scope.score += Math.floor($scope.question.score * correctFraction);
			console.log("Distance:", distance);
			console.log("correctFraction:", correctFraction);
			console.log("score:", $scope.score);
		}
		_callback();
	});	
}

function geocode($scope, latLng, _callback) {
	console.log("Lat:", latLng.lat());
	console.log("Lng:", latLng.lng());
	$scope.geocoder.geocode({"location": latLng}, function(results, status) {
		if (status == 'OK')
			for (var i = 0; i < results.length; i++)
				for (var j = 0; j < results[i].types.length; j++)
					if (results[i].types[j] == "locality") {
						$scope.foundCity = results[i].address_components[j].long_name;
						$scope.$apply();
					}
	});
}

function zoomWorld($scope, latitude, longitude) {
	$scope.map.setCenter({lat: latitude, lng: longitude });
	$scope.map.setZoom(1);
}

function zoomContinent($scope, latitude, longitude) {
	$scope.map.setCenter({ lat: latitude, lng: longitude });
	$scope.map.setZoom(3);
}

function reloadMap($scope) {
	google.maps.event.trigger($scope.map, 'resize');
}

function resetMap($scope) {
	delete $scope.map;
	$scope.currentMarker = undefined;
	initializeMap($scope);
	changeMapStyle($scope, $scope.question.type);
}