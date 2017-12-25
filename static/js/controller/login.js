
app.config(['$httpProvider',		
		 function ($httpProvider) {
		$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
		$httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
		var param = function(obj) {
			var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
			for(name in obj) {
				value = obj[name];
				if(value instanceof Array) {
					for(i=0; i < value.length; ++i) {
						subValue = value[i];
						fullSubName = name + '[' + i + ']';
						innerObj = {};
						innerObj[fullSubName] = subValue;
						query += param(innerObj) + '&';
					}
				} else if(value instanceof Object) {
					for(subName in value) {
						subValue = value[subName];
						fullSubName = name + '[' + subName + ']';
						innerObj = {};
						innerObj[fullSubName] = subValue;
						query += param(innerObj) + '&';
					}
				} else if(value !== undefined && value !== null)
					query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
			}
			return query.length ? query.substr(0, query.length - 1) : query;
		}
		$httpProvider.defaults.transformRequest = [function(data) {
			return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
		}];
}])
app.controller("loginCtrl", ['$scope', '$http', 'browser', 'commonApi', 'url', function (scope, $http, browser, commonApi, url) {
	scope.chromeVersion = commonApi.CHROME_VERSION;
	if (!browser.isChrome()) {
		scope.isNotChrome = true;
		return false;
	}
	scope.enter = function(e) {
		if (e.keyCode == 13) {
			scope.submitLogin();
		}
	}
	scope.submitLogin = function () {
		if (scope.loginForm.$valid) {
			$http.post('/dologin/', {username: scope.username, password: scope.password}).success(function(d) {
				window.location.href = '/asset/asset';
			}).error(function(d) {
				scope.loginErrorMsg = d.msg;
			})
		} else {
			scope.loginForm.submit = true;
		}
	}
}]);
angular.bootstrap(document, ['app']);