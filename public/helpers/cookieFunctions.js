//CURRENTLY UNUSED CODE - FUNCTIONS MIGHT BE USEFUL IN FUTURE USE
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function deleteCookie(cname) {
	var name = cname + "=;";
	document.cookie = name + " expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
//END UNUSED CODE

//This function checks:
// - if someone is currently logged in
// - if someone should be logged in automatically due to 'remember me'
//Called from: socketController.js
function checkSession($http, _callback) {
	$http({
		url: '/session/login',
		method: 'GET'
	}).then(function(response) {
		if (response.data.id) {
			_callback(response.data.username);
		}
		else {
			//Check if remember me cookie
			$http({
				url: '/session/rememberme',
				method: 'GET'
			}).then(function(response) {
				if (response.data.length > 0) {
					_callback(response.data[0].username);
				}
				else
					_callback(null);
			});
		}
	});
}