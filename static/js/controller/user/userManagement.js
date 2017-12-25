app.controller('userManagementCtrl', ['$scope', 'tools', 'userDataResolve', 'userManagementModule', 'userFrozenModule',
		function($scope, tools, userDataResolve, userManagementModule, userFrozenModule) {
	tools.setHeader($scope, '用户管理');
	$scope.userList = userDataResolve;
	
	var openModal = function(item) {
		var instance = tools.modal.open({
			templateUrl: 'userModal.html',
			size: 'lg',
			controller: userManagementActionCtrl,
			resolve: {
				item: function() {
					return item && angular.copy(item);
				}
			}
		})
		return instance;
	}

	$scope.gridOption = {
		fields:	[
			{field: "手机号", width: '15%'},
			{field: "邮箱", width: '20%'},
			{field: "姓名", width: '10%'},
			{field: "性别", width: '10%'},
			{field: "城市", width: '10%'},
			{field: "状态", width: '10%'},
			{field: "操作", width: '15%'}
		],
		event: {
			update: function(item, index) {
				openModal(item).result.then(function(data) {
					$scope.userList.staffs[index] = data;
				})
			},
			frozenAction: function(item, index) {
				var title = '<font color="red">冻结后该用户自动从所属配送站中删除</font>, 是否要冻结用户 <b>' + item.name + '</b>？';
				if (item.frozen) {
					title = '是否要解冻用户<b>' + item.name + '</b>？';
				}
				tools.bootbox.confirm(title).then(function() {
					userFrozenModule.update({'id': item.id, 'frozen': !item.frozen}, function() {
						tools.notification.success('操作成功');
						item.frozen = !item.frozen;
					})
				})	
			},
			remove: function(item, index) {
				tools.bootbox.confirm('<font color="red">删除后该用户自动从所属配送站中删除</font>, 是否要删除用户 <b>').then(function() {
					userManagementModule.remove({'id': item.id}, function() {
						tools.notification.success('操作成功');
						$scope.userList.staffs.splice(index, 1);
					})
				})
			}
		}
	}
	$scope.pageChange = function(page) {
		$scope.cur_page = page;
	}
	$scope.add = function() {
		openModal(null).result.then(function(data) {
			$scope.userList.staffs.push(data);
		})	
	}
	var userManagementActionCtrl = ['$scope', '$modalInstance', 'item', 'tools', 'userManagementModule', 'resetPwdModule',
			function($scope, $modalInstance, item, tools, userManagementModule, resetPwdModule) {
		var action = 'update',
			str = '更新用户成功';
		$scope.form = {};
		$scope.genderList = tools.basicData.genderList.addDefaultOption();
		$scope.citysList = tools.basicData.citysList.addDefaultOption();
		if (item) {
			$scope.userTitle = '更新用户';
			item.gender = $scope.genderList[item.gender];
			item.city = $scope.citysList[item.city_id];
			$scope.userData = item;
			$scope.isAdd = false;
		} else {
			$scope.userTitle = '添加用户';
			action = 'save';
			$scope.userData = {
				"mobile": "", 
				"email": "", 
				"name": "", 
				"gender": $scope.genderList[0], 
				"city": $scope.citysList[0],
				'is_admin' : false,
				'accept_order': false,
				'password': tools.basicData.defaultPassword
			}
			$scope.isAdd = true;
		}
		
		$scope.ok = function() {
			if ($scope.form.userForm.$valid) {
				tools.block.blockUI({target: '#' + $scope.modalId});
				var data = angular.copy($scope.userData);
				data.gender = data.gender.id;

				if (data.city && data.city.id) {
					data.city_id = data.city.id;
					delete data.city;
				}
				data.is_admin = data.is_admin;
				userManagementModule[action](data, function(d) {
					tools.notification.success(str);
					data.id = d.staff_id || item.id;
					$modalInstance.close(data)
				})
			} else {
				$scope.form.userForm.submit = true;
			}
		}
		$scope.resetPassword = function() {
			resetPwdModule['update']({'id': $scope.userData.id, 'new_password': tools.basicData.defaultPassword}, function(d) {
				tools.notification.success('重置密码成功');
			})
		}
		$scope.cancel = function() {
			$modalInstance.dismiss();
		}
	}]
}]);
//修改密码
app.directive('changeOwnPassword', ['tools', 'changePwdModule', 'includeUrl', function(tools, changePwdModule, includeUrl) {
	return function($scope, elem, attrs) {
		elem.on('click', function() {
			tools.modal.open({
				templateUrl: includeUrl + 'changeOwnPasswordTpl.html',
				controller: function($scope, $modalInstance) {
					$scope.form = {};
					$scope.userData = {};
					$scope.ok = function() {
						if ($scope.form.userForm.$valid) {
							if ($scope.userData.newpassword === $scope.userData.newpasswordagin) {
									var data = {
										'old_password': $scope.userData.password, 
										'new_password': $scope.userData.newpassword
									}
									changePwdModule.update(data, function() {
										tools.notification.success('更新成功');
										$modalInstance.close();
									})
							} else {
								tools.notification.error('2次输入的密码不一致');
							}
						} else {
							$scope.form.userForm.submit = true;
						}
					}
					$scope.cancel = function() {
						$modalInstance.dismiss();
					}
				}
			})
		})
	}	
}])