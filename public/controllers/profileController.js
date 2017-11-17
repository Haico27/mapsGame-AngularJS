controllers.controller("profileCtrl", function($scope, $location, $http) {
	$scope.user = $scope.$parent.user;
	$http({
		url: '/profile/getuser',
		method: 'GET',
		params: {username: $scope.user}
	}).then(function(result) {
		if (result.status == 200) {
			$scope.name = result.data[0].firstname + " " + result.data[0].lastname;
			$scope.age = result.data[0].age;

			if (result.data[0].admin)
				$scope.adminSection = true;
		}
	});

	$scope.gotoHome = function() {
		$location.path('/');
	};

	$scope.showDelete = function() {
		$scope.deleteSection = true;
	};

	$scope.showChangePassword = function() {
		$scope.changePasswordSection = true;
	};

	$scope.deleteAcc = function() {
		//Check if the entered password is correct
		$http({
			url: '/profile/checkpassword',
			method: 'POST',
			data: {username: $scope.user, password: $scope.delete.password}
		}).then(function(result) {
			if (result.status == 200) {
				//If the password is correct, delete the user's account
				if (result.data.length > 0) {
					$http({
						url: '/profile/delete',
						method: 'DELETE',
						params: {username: $scope.user}
					}).then(function(result) {
						if (result.status == 200) {
							console.log("Success");
							$location.path('/login');
						}
					});
				}
			}
		});
	};

	$scope.changePassword = function() {
		if ($scope.change.newPassword != $scope.change.newPasswordConfirm) {
			console.log("New password does not equal confirmation password");
			return;
		}

		$http({
			url: '/profile/changepassword',
			method: 'PUT',
			data: {username: $scope.user, oldPassword: $scope.change.currentPassword, newPassword: $scope.change.newPassword}
		}).then(function(response) {
			switch(response.status) {
				case 200:
					console.log("Password changed succesfully");
					$scope.changePasswordSection = false;
					break;
				case 201:
					console.log("That is not your current password!");
					break;
				case 202:
					console.log("User not found - als je dit te zien krijg dan heb je alles kapot gemaakt");
					break;
			}
		});
	}

});
