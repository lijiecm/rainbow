app.controller('orderManagerCtrl', ['$scope', 'tools', 'formatRestaurantSearchType', 'orderManagerDataResolve', 'stationListDataResolve', 'orderMangerModule',
	function($scope, tools, formatRestaurantSearchType, orderManagerDataResolve, stationListDataResolve, orderMangerModule) {
		tools.setHeader($scope, '配送订单管理');
		$scope.dataList = orderManagerDataResolve;
		//格式化配送站
		var cityStation = {};
		if (stationListDataResolve && angular.isArray(stationListDataResolve.stations)) {
			stationListDataResolve.stations.forEach(function(v) {
				var cityId = v.city_id;
				if (!(cityId && angular.isArray(cityStation[v.city_id]))) {
					cityStation[v.city_id] = [];
				}
				cityStation[v.city_id].push({id: v.id, text: v.name});
			})
		}
		//日期
		var startDate = new Date(),
			endDate = new Date();
		startDate.setDate(startDate.getDate() - 88);
		$scope.dateOptions = {
			'maxView': 3,
			'startDate' : startDate,
			'endDate' : endDate
		}

		$scope.optionList = {
			citysList: tools.basicData.citysList.addDefaultOption(),
			stationList: [].addDefaultOption(),
			statusList: angular.copy(tools.basicData.orderStatusList).addDefaultOption({id:-1, text: '全部', 'active': true})
		}

		$scope.searchObj = {
			city: $scope.optionList.citysList[0],
			station: $scope.optionList.stationList[0]
		}
		$scope.changeStatus = function(item, index) {
			$scope.optionList.statusList.forEach(function(v, i) {
				if (i != index) {
					v.active = false;
				}
			})
			item.active = true;
			$scope.searchObj.status = item;
			if (item.id == -1) {
				delete $scope.searchObj.status;
			}
			$scope.pageChange(1,index)
		}
		$scope.cityChnage = function() {
			var city = $scope.searchObj.city,
				cityId = city && city.id;
			if (angular.isArray(cityStation[cityId])) {
				$scope.optionList.stationList = cityStation[cityId].addDefaultOption();
				$scope.searchObj.station = $scope.optionList.stationList[0]
			} else {
				$scope.optionList.stationList = [].addDefaultOption();
				$scope.searchObj.station = $scope.optionList.stationList[0]
			}
		}
		$scope.pageChange = function(page,index) {
			var cityId = $scope.searchObj.city.id,
				stationId = $scope.searchObj.station.id,
				obj = {};
			['submitted_start', 'submitted_end'].forEach(function(v) {
				var val = $scope.searchObj[v];
				if (val) {
					obj[v] = tools.basicData.toTimestamp(val);
				}
			})
			//结束时间默认加一天
			if (obj.submitted_end) {
				obj.submitted_end += 86400;
			}
			formatRestaurantSearchType(obj, $scope);
			if ($scope.searchObj.status) {
				obj.status = $scope.searchObj.status.id;
			}
			//选择了city
			if (cityId != -1) {
				//选择了 配送站
				if (stationId != -1) {
					obj.station_id = stationId;
				} else {
					if (angular.isArray(cityStation[cityId]) && cityStation[cityId].length > 0) {
						obj.station_id = cityStation[cityId].map(function(v) {
							return v.id;
						}).join(',')
					} else {
						obj.station_id = -1;
					}
				}
			}
			obj.page = page;
			$scope.cur_page = page;
			orderMangerModule.query(obj, function(d) {
				if(index == 1){
					var attr = [];
					d.orders.forEach(function(v,i){
						if(v.is_timeout == false){
							attr.push(v);
						}
					});
					$scope.dataList.orders = attr;
					return false;
				}
				if(index == 2){
					var attr = [];
					d.orders.forEach(function(v,i){
						if(v.is_timeout == true){
							attr.push(v);
						}
					});
					$scope.dataList.orders = attr;
					return false;
				}

				$scope.dataList = d;
			})
		}
		
		$scope.gridOption = {
			fields:	[
				{field: "订单信息", width: '15%'},
				{field: "餐厅信息", width: '15%'},
				{field: "用户信息", width: '12%'},
				{field: "应送达时间", width: '10%'},
				{field: "配送信息", width: '12%'},
				{field: "订单状态", width: '12%'},
				{field: "订单调度方式", width: '12%'},
				{field: "操作", width: '12%'}
			]
		}
}])
