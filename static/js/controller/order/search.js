app.controller('orderSearchCtrl', ['$scope', 'formatRestaurantSearchType', 'tools', 'orderSearchModule',
	function($scope, formatRestaurantSearchType, tools, orderSearchModule) {
		tools.setHeader($scope, '投诉处理');

		$scope.dataList = {orders:[]};
		$scope.searchObj = {};

		var setStatus = function(item, d) {
			var keys = ['can_process', 'can_dispatch', 'can_fail', 'can_continue'];
			keys.forEach(function(v) {
				item[v] = d[v];
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
			],
			event: {
				dispatchFunc: function(item, index) {
					var $modalInstance = tools.modal.open({
						templateUrl: 'selectDeviler.html',
						resolve: {
							'userList': function(bulidPromise, getOrderDeliveryStaffModule) {
								return bulidPromise(getOrderDeliveryStaffModule, {id: item.order_id})
							},
							'item': function() {
								return item;
							}
						},
						controller:  orderForceSelectDevilerCtrl
					})
					$modalInstance.result.then(function(d) {
						changeStatus(item, d);
					})
				},
				failFunc: function(item, index) {
					var $modalInstance = tools.modal.open({
						templateUrl: 'processingRejectMessage.html',
						controller: orderRejectMessageCtrl,
						resolve: {
							item: function() {
								return item;
							}
						}
					})
					$modalInstance.result.then(function(d) {
						changeStatus(item, d);
					})
				}
			}
		}
		function changeStatus(item, d) {
			['can_force_dispatch', 'can_fail'].forEach(function(v) {
				item[v] = d[v];
			})
		}
		$scope.pageChange = function(page) {
			var obj = {};
			if ($scope.searchObj.keyword) {
				formatRestaurantSearchType(obj, $scope);
				obj.page = page;
				$scope.cur_page = page;
				orderSearchModule.query(obj, function(d) {
					$scope.dataList = d;
				})
			}
		}
}])
var orderForceSelectDevilerCtrl = ['$scope', '$modalInstance', 'item', 'tools', 'userList', 'orderProcessModule', 'getOrderDeliveryStaffModule',
		function($scope, $modalInstance, item, tools, userList, orderProcessModule, getOrderDeliveryStaffModule) {
	$scope.dataList = userList;
	$scope.selectedUser = {}
	$scope.gridOption = {
		fields:	[
			{field: '', width: '5%'},
			{field: "姓名", width: '15%'},
			{field: "配送员状态", width: '15%'},
			{field: "正在配送数", width: '15%'},
			{field: "最近未取订单距离", width: '15%'},
			{field: "最近未送订单距离", width: '15%'}
		],
		event: {
			getUserStatus: function(item) {
				return !item.accept_order ? '停止接单' : item.delivery_cnt > 0 ? '正在配送' : '空闲'
			}
		},
		broadcastData: {
			selectedUser: $scope.selectedUser
		}
	}
	$scope.ok = function() {
		if ($scope.selectedUser.value && $scope.selectedUser.value.id) {
			var obj = {'id': item.order_id, 'delivery_by_id': $scope.selectedUser.value.id, 'action': 'force_dispatch'}
			orderProcessModule.update(obj, function(d) {
				tools.notification.success('操作成功');
				$modalInstance.close(d);
			})
		} else {
			tools.notification.warning('请选择配一个送员');
		}
	}
	$scope.cancel = function(){
		$modalInstance.dismiss();
	}
}]

var orderRejectMessageCtrl = ["$scope", "$modalInstance", "item", "tools" ,'orderProcessModule', 
	function($scope, $modalInstance, item, tools, orderProcessModule) {
			$scope.messages = [
				'送餐地址无效;',
				'无法联系订餐者;',
				'无法联系到餐厅;',
				'菜品已售完;',
				'送餐时间过长取消订单;',
				'餐厅太忙;',
				'餐厅休息;',
				'用户取消订单;',
				'订单重复;',
				'重新下单;'
			];
			$scope.otherMessage = "";
			$scope.checkedIndex = -1;
			$scope.formObj = {};
			$scope.checkedMessage = function(index) {
				if ($scope.checkedIndex === index) {
					$scope.checkedIndex = -1;
					return false;
				}
				$scope.checkedIndex = index;
			}
			$scope.ok = function () {
				var message = $scope.checkedIndex === -1 ? "" : $scope.messages[$scope.checkedIndex];
				message = ($scope.formObj.otherMessage || message).trim();
				if (message) {
					var obj = {'id': item.order_id, 'failed_reason': message, 'action': 'fail'}
					orderProcessModule.update(obj, function(d) {
						tools.notification.success('操作成功');
						$modalInstance.close(d);
					})
				} else {
					tools.notification.warning("拒绝理由不能为空!");
				}
			};	
			$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
			};		
		}]