app.controller('distributionUsersCtrl', ['$scope', 'tools', 'changeAcceptOrderModule', 'deliveryUserModule', 'deliveryUserDataResolve',
	function($scope, tools, changeAcceptOrderModule, deliveryUserModule, deliveryUserDataResolve) {
		tools.setHeader($scope, '配送员管理');
		//临时
		$scope.stations = deliveryUserDataResolve.stations.addDefaultOption({'id': -1, 'name': '-- 请选择 --'});
		$scope.selectedStation = $scope.stations[0];
		$scope.stationChange = function() {
			if ($scope.selectedStation.id == -1) {
				delete $scope.searchData.stations_ids;
			} else {
				$scope.searchData.stations_ids = $scope.selectedStation.id + ',';
			}
		}
		$scope.searchData = {}
		$scope.dataList = deliveryUserDataResolve;

		$scope.gridOption = {
			fields:	[
				{field: "配送员姓名", width: '15%'},
				{field: "联系电话", width: '15%'},
				{field: "城市", width: '15%'},
				{field: "所属配送站", width: '20%'},
				{field: "正在配送订单", width: '10%'},
				{field: "配送员状态", width: '10%'},
				{field: "操作", width: '15%'}
			], 
			event: {
				initStationIds: function(item) {
					if (angular.isArray(item.station_list)) {
						item.stations_ids = item.station_list.map(function(v) {
							return v.id;
						}).join(',');
						item.stations_ids += ',';
					} else {
						item.stations_ids = '';
					}
				},
				formatStatus: function(item) {
					//配送订单大于0 并且 状态可以接单
					var accept_order = item.accept_order;
					if (item.delivery_count > 0 && accept_order) {
						return '正在配送';
					}
					return tools.basicData.statusObj[accept_order];
				},
				changeStatus: function(item) {
					var updateStatus = !item.accept_order;
					tools.bootbox.confirm('是否要将配送员 <b>' + item.name + '</b> 改为 【' + tools.basicData.statusObj[updateStatus] + '】')
					.then(function() {
						changeAcceptOrderModule.update({'id': item.id, 'accept_order': updateStatus}, function(d) {
							item.accept_order = updateStatus;
							tools.notification.success('操作成功');
						})
					})
				}
			}
		}
}])