app.controller('orderEditedCtrl', ['$scope', 'formatRestaurantSearchType', 'tools','editedOrderDataResolve','editedOrderModule',
	function($scope, formatRestaurantSearchType, tools,editedOrderDataResolve,editedOrderModule) {
		$scope.dataList = editedOrderDataResolve;
		[]
		tools.setHeader($scope, '修改过的订单');
		var userId = tools.routeParams.id;
		$scope.getVal = tools.basicData;
		var startDate = new Date(),
			endDate = new Date();
		startDate.setDate(startDate.getDate() - 88);
		$scope.dateOptions = {
			'maxView': 3,
			'startDate' : startDate,
			'endDate' : endDate
		};
		
		$scope.searchObj = {};
		$scope.search_type = [
			{id: 'order_id', text: '订单号'},
			{id: 'rest_name', text: '餐厅名称'},
			{id: 'cust_phone', text: '用户手机号'}
		];

		$scope.pageChange = function(page) {
			var obj = {};
			formatRestaurantSearchType(obj, $scope);
			['submitted_start', 'submitted_end'].forEach(function(v) {
				var val = $scope.searchObj[v];
				if (val) {
					obj[v] = tools.basicData.toTimestamp(val);
				}
			});

			if (obj.submitted_end) {
				obj.submitted_end += 86400;
			}
			obj.id = userId;
			editedOrderModule.query(obj,function(data){
				$scope.dataList = data;
			})
		};

		$scope.gridOption = {
			fields:	[
				{field: "订单信息", width: '7%'},
				{field: "餐厅信息", width: '7%'},
				{field: "用户信息", width: '7%'},
				{field: "配送信息", width: '5%'},
				{field: "订单状态", width: '5%'},
				{field: "配送费", width: '5%'},
				{field: "抽佣金额", width: '5%'},
				{field: "活动金额", width: '5%'},
				{field: "应付", width: '5%'},
				{field: "应收", width: '5%'},
				{field: "实付", width: '5%'},
				{field: "实收", width: '5%'},
				{field: "用户端报损金额", width: '7%'},
				{field: "餐厅端报损金额", width: '7%'},
				{field: "上缴金额", width: '5%'}
			]
		}
}])