app.controller('orderPorcessingCtrl', ['$scope', 'tools', 'orderPendingDataResolve', 'orderProcessModule',
	function($scope, tools, orderPendingDataResolve, orderProcessModule) {
		tools.setHeader($scope, '需处理订单');

		$scope.searchObj = {
			statusList: [
				/*{id: '-1', text: '全部', active: true},*/
				{id: '1', text: '需调度订单', active: true, isTimeout: false},
				{id: '2', text: '超时未接订单', isTimeout: true, timeout_cnt: 0}
			],
			searchTypeList : [
				{id: 'order_number', text: '订单号'},
				{id: 'rest_name', text: '餐厅名称'},
				{id: 'cust_phone', text: '用户手机'},
				{id: 'delivery_by_name', text: '配送员姓名'},
				{id: 'delivery_by_mobile', text: '配送员手机'}
			]
		}
		tools.comet.on('order', function(item) {
			if (item) {
				if (item.is_timeout) {
					tools.notification.warning('有一条超时的订单需要您处理');
					setTimeoutCnt('add');
				} else {
					tools.notification.info('有一条新订单需要您处理');
				}
				$scope.$apply(function() {
					$scope.dataList.orders.push(item);
				});
			}
		})
		$scope.dataList = orderPendingDataResolve;
		/*$scope.dataList.orders.push({id:1, is_timeout: true, dispatch_cnt: 1, can_dispatch: true, can_fail: true, can_continue: true})*/
		$scope.selectedSearchType = $scope.searchObj.searchTypeList[0];

		$scope.searchData = {is_timeout: false}
		
		setTimeoutCnt('init');
		$scope.changeStatus = function(item, index) {
			var othenIndex = (index == 0) ?  1 : 0;
			$scope.searchObj.statusList[othenIndex].active = false;
			item.active = true;

			$scope.searchData = {is_timeout: item.isTimeout}
			$scope.searchData[$scope.selectedSearchType.id] = $scope.keyword;
		}

		$scope.selecteChange = function() {
			var is_timeout = $scope.searchData.is_timeout;
			$scope.searchData = {
				'is_timeout': is_timeout
			}
			$scope.searchData[$scope.selectedSearchType.id] = $scope.keyword;
		}
		var setStatus = function(item, d) {
			var keys = ['can_process', 'can_dispatch', 'can_fail', 'can_continue'];
			keys.forEach(function(v) {
				item[v] = d[v];
			})
		}
		$scope.gridOption = {
			fields:	[
				{field: '配送单号', width: '8%'},
				{field: "订单信息", width: '13%'},
				{field: "餐厅信息", width: '13%'},
				{field: "用户信息", width: '12%'},
				{field: "应送达时间", width: '10%'},
				{field: "配送信息", width: '12%'},
				{field: "订单状态", width: '10%'},
				{field: "订单调度方式", width: '10%'},
				{field: "操作", width: '12%'}
			],
			event: {
				processFunc: function(item, index) {
					orderProcess('start', '开始处理订单', item);
				},
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
						controller:  orderSelectDevilerCtrl
					})
					$modalInstance.result.then(function(d) {
						setTimeoutCnt('sub', item);
						removeOrder(item.order_id);
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
						setTimeoutCnt('sub', item);
						removeOrder(item.order_id)
					})
				},
				continueFunc: function(item, index){
					tools.bootbox.confirm('是否让配送员继续配送').then(function() {
						orderProcess('continue', '操作成功', item, function() {
							setTimeoutCnt('sub', item);
							removeOrder(item.order_id);
						});
					})
				}
			} 
		}
		function removeOrder(order_id) {
			for (var i = 0, len = $scope.dataList.orders.length; i < len; i++) {
				if ($scope.dataList.orders[i].order_id == order_id) {
					$scope.dataList.orders.splice(i, 1);
					break;
				} 
			}
		}
		function orderProcess(action, message, item, callback) {
			var obj = {'action': action, 'id': item.order_id};
			orderProcessModule.update(obj, function(d) {
				setStatus(item, d);
				tools.notification.info(message);
				if (angular.isFunction(callback)) {
					callback();
				}
			})
		}
		function setTimeoutCnt(action, item) {
			var obj = $scope.searchObj.statusList[1],
				cnt = 0;
			if (item && !item.is_timeout) { return false; }
			switch(action) {
				case 'add': 
					obj.timeout_cnt += 1;
				break;
				case 'init':
					$scope.dataList.orders.filter(function(v) {
						if (v.is_timeout) {
							cnt++;
						}
					})
					obj.timeout_cnt = cnt;
					break;
				case 'sub': 
					obj.timeout_cnt -= 1;
					break;
			}	
		}
}])
var orderSelectDevilerCtrl = ['$scope', '$modalInstance', 'item', 'tools', 'userList', 'orderProcessModule', 'getOrderDeliveryStaffModule',
		function($scope, $modalInstance, item, tools, userList, orderProcessModule, getOrderDeliveryStaffModule) {
	$scope.dataList = userList;
	$scope.selectedUser = {}
	$scope.gridOption = {
		fields:	[
			{field: '', width: '5%'},
			{field: "姓名", width: '15%'},
			{field: "配送员状态", width: '15%'},
			{field: "正在配送数", width: '15%'},
			{field: "未取订单最短距离", width: '15%'},
			{field: "未送订单最短距离", width: '15%'}
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
			var obj = {'id': item.order_id, 'delivery_by_id': $scope.selectedUser.value.id, 'action': 'dispatch'}
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