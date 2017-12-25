app.controller('orderPorcessedCtrl', ['$scope', 'formatRestaurantSearchType', 'tools', 'orderPendedDataResolve', 'orderPendedModule',
	function($scope, formatRestaurantSearchType, tools, orderPendedDataResolve, orderPendedModule) {
		tools.setHeader($scope, '已处理订单');

		$scope.searchObj = {
			statusList: [
				/*{id: '-1', text: '全部', active: true},*/
				{id: '1', text: '需调度订单', active: true, isTimeout: false},
				{id: '2', text: '超时未接订单', isTimeout: true}
			],
			searchTypeList : [
				{id: 'order_number', text: '订单号'},
				{id: 'rest_name', text: '餐厅名称'},
				{id: 'cust_phone', text: '用户手机'},
				{id: 'delivery_name', text: '配送员姓名'},
				{id: 'delivery_mobile', text: '配送员手机'}
			]
		};

		$scope.dataList = orderPendedDataResolve;
		$scope.searchObj = {};

		
		var setStatus = function(item, d) {
			var keys = ['can_process', 'can_dispatch', 'can_fail', 'can_continue'];
			keys.forEach(function(v) {
				item[v] = d[v];
			})
		};
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
		};

		$scope.pageChange = function(page) {
			var obj = {};
			formatRestaurantSearchType(obj, $scope);
			obj.page = page;
			$scope.cur_page = page;
			orderPendedModule.query(obj, function(d) {
				$scope.dataList = d;
			})
		}
}]);
