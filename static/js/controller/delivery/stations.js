app.controller('distributionStationsCtrl', ['$scope', 'tools', 'stationDataListResolve', 'getStationListModule', 'deliveryStationModule', 'changeAutoDispatchModule',
		function($scope, tools, stationDataListResolve, getStationListModule, deliveryStationModule, changeAutoDispatchModule) {
	tools.setHeader($scope, '配送站管理');
	var path = tools.location.path(),
		type = '';
	if (path.indexOf('dispatch') > -1) {
		type = 'dispatch';
	} else if (path.indexOf('manager') > -1) {
		type = 'manager';
	} else if (path.indexOf('admin') > -1){
		type = 'admin';
	}
	$scope.citysList = tools.basicData.citysList.addDefaultOption();
	$scope.searchData = {
		city: $scope.citysList[0],
	}
	$scope.dataList = stationDataListResolve || { stations: [] };
	
	var openModal = function(item) {
		var instance = tools.modal.open({
			templateUrl: 'addStations.html',
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
			{field: "配送站", width: '25%'},
			{field: "所属城市", width: '25%'},
			{field: "配送员数量", width: '25%'},
			{field: "操作", width: '25%'}
		],
		event: {
			updateStation: function(item, index) {
				actionStations(item).then(function(d) {
					$scope.dataList.stations[index] = d;
					$scope.dataList.stations[index].auto_dispatch = item.auto_dispatch;
				})
			},
			actionAutoDispatch: function(item) {
				var obj = {
					id: item.id,
					auto_dispatch: !item.auto_dispatch
				}
				tools.bootbox.confirm('是否要' + (obj.auto_dispatch ? '开启' : '关闭') + '自动配送').then(function() {
					changeAutoDispatchModule.update(obj, function(d) {
						tools.notification.success('操作成功');
						item.auto_dispatch = obj.auto_dispatch;
					})
				})
			},
			removeStation: function(item, index) {
				tools.bootbox.confirm('是否要删除配送站<b>' + item.name + '</b>？').then(function() {
					deliveryStationModule.remove({id: item.id}, function() {
						tools.notification.success('删除成功');
						$scope.dataList.stations.splice(index, 1);						
					})
				})
			}
		}
	}
	$scope.pageChange = function(page) {
		$scope.cur_page = page;
		var data = {
			//'page': page,
			'type': type,
			'city_id': $scope.searchData.city.id
		}
		if (data.city_id == -1) {
			delete data.city_id;
		}
		getStationListModule.query(data, function(d) {
			$scope.dataList = d;
		})
		
	}
	$scope.newStation = function() {
		actionStations(null).then(function(d) {
			$scope.dataList.stations.push(d);
		})
	}
	function actionStations(item) {
		var $modalInstance = tools.modal.open({
			templateUrl: 'actionStations.html',
			controller: actionStationsCtrl,
			resolve: {
				stationData: function(bulidPromise, deliveryStationModule) {
					if (item) {
						return bulidPromise(deliveryStationModule, {id: item.id});
					} else {
						return item;
					}
				}
			}
		})
		return $modalInstance.result;
	}
	var actionStationsCtrl = ['$scope', '$modalInstance', 'tools', 'stationData', 'staffActiveModule', 'deliveryStationModule',
			function($scope, $modalInstance, tools, stationData, staffActiveModule, deliveryStationModule) {
		var staffsData = [],
			method = 'save';
		$scope.input = {};
		$scope.title = '新建配送站';
		$scope.citysList = tools.basicData.citysList.addDefaultOption();
		$scope.form = {};

		if (stationData) {
			stationData = stationData.station;
			method = 'update';
			$scope.title = '更新配送站';
			$scope.data = angular.copy(stationData);
			$scope.data.city = $scope.citysList[$scope.data.city_id];
			$scope.isNew = false;		
		} else {
			$scope.data = {};
			$scope.data.city =  $scope.citysList[0];
			$scope.isNew = true;
		}
		getUserList();
		initUserName();
		//获取坐标
		$scope.getPosition = function() {
			if ($scope.data.city.id == -1) {
				tools.notification.error('请选择配送站所在的城市');
				return;
			}
			var modalInstance = tools.modal.open({
				templateUrl: 'getPosition.html',
				controller: getPositionCtrl,
				size: 'lg',
				resolve: {
					'position': function() {
						return $scope.data;
					},
					'selectedCity': function() {
						return $scope.data.city;
					}
				}
			})
			modalInstance.result.then(function(d) {
				$scope.data.lng = d.lng;
				$scope.data.lat = d.lat;
			})
		}
		$scope.ok = function() {
			if ($scope.form.stationForm.$valid) {
				if (method == 'update' && !($scope.input.delivery_staff_format.length > 0 && $scope.input.dispatch_staff_format.length > 0 && $scope.input.manager_staff_format.length > 0)) {
					$scope.form.stationForm.submit = true;
					return false;
				}
				var data = angular.copy($scope.data);
				if (data.city && data.city.id) {
					data.city_id = data.city.id;
				}
				//格式化选中的人
				data.delivery_role_ids = formatUpdateData($scope.input.delivery_staff_format);
				data.dispatch_role_ids = formatUpdateData($scope.input.dispatch_staff_format);
				data.manager_role_ids = formatUpdateData($scope.input.manager_staff_format);
				data.modalId = $scope.modalId;

				delete data.city;
				delete data.polygon_wkt;
				delete data.delivery_role_list;
				delete data.dispatch_role_list;
				delete data.manager_role_list;

				deliveryStationModule[method](data, function(d) {
					if (d.station_id) {
						data.id = d.station_id;
					}
					delete data.delivery_staff_ids;
					delete data.dispatch_staff_ids;
					data.delivery_staff_count = $scope.input.delivery_staff_format.length;

					data.delivery_role_list = unFormatSelectedUserName($scope.input.delivery_staff_format);
					data.dispatch_role_list = unFormatSelectedUserName($scope.input.dispatch_staff_format);
					data.manager_role_list = unFormatSelectedUserName($scope.input.manager_staff_format);

					tools.notification.success('操作成功');
					$modalInstance.close(data);
				})
			} else {
				$scope.form.stationForm.submit = true;
			}
		};
		$scope.cancel = function() {
			$modalInstance.dismiss();
		};
		$scope.cityChange = function() {
			getUserList();
		};
		function getUserList() {
			if ($scope.data.city_id == -1) {
				$scope.userList = [];
				staffsData = [];
				return false;
			}
			var deliveryUserList = tools.cacheData['userList' + $scope.data.city_id] || [];
			if (deliveryUserList.length == 0) {
				staffActiveModule.query({'city_id': $scope.data.city_id}, function(d) {
					if (d.staffs && d.staffs.length > 0) {
						staffsData = d.staffs;
						deliveryUserList = staffsData.map(function(v) {
							return {
								id: v.id,
								text: v.name
							}
						})
						$scope.deliveryUserList = deliveryUserList || [];
					} else {
						$scope.deliveryUserList = [];	
					}
				}, function() {
					$scope.deliveryUserList = [];
				})
			} else {
				$scope.deliveryUserList = deliveryUserList;
			}
		}
		//delivery_staff_format  配送员
		//dispatch_staff_format  调度员
		function initUserName() {
			$scope.input.delivery_staff_format = formatSelectedUserName($scope.data.delivery_role_list);
			$scope.input.dispatch_staff_format = formatSelectedUserName($scope.data.dispatch_role_list);
			$scope.input.manager_staff_format = formatSelectedUserName($scope.data.manager_role_list);
		}
		function formatSelectedUserName(selectedUser) {
			if (!angular.isArray(selectedUser)) {return []}
			return selectedUser.map(function(v) {
				return {
					id: v.id,
					text: v.name
				}
			})
		}
		function unFormatSelectedUserName(data) {
			return data.map(function(v) {
				return {
					id: v.id,
					name: v.text
				}
			})
		}
		function formatUpdateData(data) {
			if (angular.isArray(data) && data.length > 0) {
				return data.map(function(v) {
					return v.id;
				}).join(',');
			} else {
				return '';
			}
		}
	}]
	var getPositionCtrl = ['$scope', '$modalInstance', 'position', 'selectedCity', 'tools',
		function($scope, $modalInstance, position, selectedCity, tools) {
			$scope.position = position || {};
			$scope.selectedCity = selectedCity;
			$scope.ok = function() {
				if ($scope.position.lng && $scope.position.lat) {
					$modalInstance.close($scope.position);
				} else {
					$modalInstance.dismiss('cancel');	
				}
			}
			$scope.cancel = function() {
				$modalInstance.dismiss('cancel');
			}
		}
	]
}])