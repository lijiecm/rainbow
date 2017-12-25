app.controller('orderStatusCtrl', ['$scope', 'tools','orderProcessModule','bulidPromise','orderAllModule','formatRestaurantSearchType','$rootScope',
	function($scope, tools,orderProcessModule,bulidPromise,orderAllModule,formatRestaurantSearchType,$rootScope) {
		var status = null;
		tools.setHeader($scope, '配送订单处理');
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
		$scope.optionList = {
			citysList: tools.basicData.citysList.addDefaultOption(),
			stationList: [].addDefaultOption(),
			statusList: angular.copy(tools.basicData.orderStatusList).addDefaultOption({id:-1, text: '全部', 'active': true})
		};
		//后台推送的订单和状态
		tools.comet.on('order', function(item) {
			if (item) {
				if (item.is_timeout) {
					tools.notification.warning('有一条超时的订单需要您处理');
				} else {
					tools.notification.info('有一条新订单需要您处理');
				}
				getNewOrderList(status);
			}
		});
		tools.comet.on('state', function(item) {
			if (item) {
				if (item.is_timeout) {
					tools.notification.warning('有一条超时的订单需要您处理');
				}
				getNewOrderList(status);
			}
		});
		$scope.allStatus = {
			allBoolen:true,
			orderNum:[0,0,0,0,0,0,0,0]
		};
		//获取最新接口数据
		function getNewOrderList(status){
			bulidPromise(orderAllModule).then(function(data){
				$scope.dataList = data;
				diffStatus($scope.dataList.orders);
				if(status){
					filterOrder(status);
				}
			});
		}

		//区分订单状态的数量
		function diffStatus(orders){
			$scope.allStatus.orderNum = [0,0,0,0,0,0,0,0];
			orders.forEach(function(v,k){
				if((v.status == 1 || v.status == 2) && (v.is_timeout == false)){
					$scope.allStatus.orderNum[1]++;
				}else if((v.status == 1 || v.status == 2) && (v.is_timeout == true)){
					$scope.allStatus.orderNum[2]++;
				}else if(v.status){
					$scope.allStatus.orderNum[v.status]++;
				}
			});
			$scope.allStatus.orderNum[0] = $scope.dataList.orders.length;
			updataOrderNum();
		}

		//页面初始化加载数据
		getNewOrderList();

		$scope.searchObj = {};
		var obj = {};
		$scope.pageChange = function(page) {
			formatRestaurantSearchType(obj, $scope);
			orderAllModule.query(obj, function(d) {
				$scope.dataList = d;
				diffStatus($scope.dataList.orders);
				if(status){
					filterOrder(status);
				}
			})
		};
		$scope.changeStatus = function(item, index) {
			status = item;
			//焦点按钮
			$scope.optionList.statusList.forEach(function(v, i) {
				if (i != index) {
					v.active = false;
				}
			});

			item.active = true;

			if(obj.order_id !== undefined || obj.rest_name !== undefined || obj.cust_phone !== undefined){
				$scope.pageChange();
			}else{
				//切换状态获取最新接口数据
				bulidPromise(orderAllModule).then(function(data){
					//赋值
					$scope.dataList = data;
					diffStatus($scope.dataList.orders);
					//全部状态 只显示查看详情
					filterOrder(item,index);
				});
			}

		};

		var setStatus = function(item, d) {
			var keys = ['can_process', 'can_dispatch', 'can_fail', 'can_continue'];
			keys.forEach(function(v) {
				item[v] = d[v];
			})
		};
		$scope.gridOption = {
			fields:	[
				{field:"编号",width:'4%'},
				{field: "订单信息", width: '15%'},
				{field: "餐厅信息", width: '15%'},
				{field: "用户信息", width: '12%'},
				{field: "应送达时间", width: '10%'},
				{field: "配送信息", width: '11%'},
				{field: "订单状态", width: '11%'},
				{field: "订单调度方式", width: '11%'},
				{field: "操作", width: '11%'}
			],
			event: {
				processFunc: function(item, index) {
					orderProcess('start', '开始处理订单', item,function(){
						item.status = 2;
					});

				},
				dispatchFunc: function(item, index) {
					//强制转单和配送员
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
						controller:orderSelectDevilerCtrl
					});
					$modalInstance.result.then(function(d) {
						getNewOrderList(status);
					})
				},
				suredispatch:function(item,index){
					//确认配送
					orderProcess('confirm','确认配送',item);
					getNewOrderList(status);

				},
				sureGetOrder:function(item,index){
					//已取餐
					orderProcess("pickup","确认取餐成功",item);
					getNewOrderList(status);

				},
				sureSendOrder:function(item,index){
					//已送达
					orderProcess("delivered","已送达",item);
					getNewOrderList(status);
				},
				failFunc: function(item, index) {
					//配送失败
					var $modalInstance = tools.modal.open({
						templateUrl: 'processingRejectMessage.html',
						controller: orderRejectMessageCtrl,
						resolve: {
							item: function() {
								return item;
							}
						}
					});
					$modalInstance.result.then(function(d) {
						getNewOrderList(status);
					})
				},
				continueFunc: function(item, index){
					//继续配送
					tools.bootbox.confirm('是否让配送员继续配送').then(function() {
						orderProcess('continue', '操作成功', item, function() {
							getNewOrderList(status);
						});
					})
				}
			}
		};
		function updataOrderNum(){
			//更新统计数
			$scope.optionList.statusList.forEach(function(v,j){
				v.num =  $scope.allStatus.orderNum[j];
			});
		}

		function removeOrder(order_id) {
			//删除订单
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
		function filterOrder(item,index){
			//过滤每个状态下的订单
			var arra = [];
			if (item.id == -1) {
				$scope.allStatus.allBoolen = true;
			}else{
				var orders = $scope.dataList.orders;
				$scope.allStatus.allBoolen = false;
				if(item.id == 1){
					//待调度
					var arra = [];
					orders.forEach(function(k,j){
						if( (false == k.is_timeout) && (k.status == 1 || k.status == 2)){
							arra.push(k);
						}
					});
					$scope.dataList.orders = arra;
				}else if(item.id == 2){
					//超时未接订单
					var arra = [];
					orders.forEach(function(k,j){
						if( (true == k.is_timeout)&&(k.status == 1 || k.status == 2 )){
							arra.push(k);
						}
					});
					$scope.dataList.orders = arra;
				}else{
					//其他状态
					var arra = [];
					orders.forEach(function(k,j){
						if(item.id == k.status){
							arra.push(k);
						}
					});
					$scope.dataList.orders = arra;
				}
			}
		}
}]);
var orderSelectDevilerCtrl = ['$scope', '$modalInstance', 'item', 'tools', 'userList', 'orderProcessModule', 'getOrderDeliveryStaffModule','$rootScope',
	function($scope, $modalInstance, item, tools, userList, orderProcessModule, getOrderDeliveryStaffModule,$rootScope) {
		$scope.dataList = userList;
		$scope.selectedUser = {};
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
		};
		$scope.ok = function() {
			if ($scope.selectedUser.value && $scope.selectedUser.value.id) {
				if(item.status == 1 || item.status == 2 || item.status == 3){
					//关联配送员
					var obj = {'id': item.order_id, 'delivery_by_id': $scope.selectedUser.value.id, 'action': 'dispatch'};
				}else{
					//强制转单
					var obj = {'id': item.order_id, 'delivery_by_id': $scope.selectedUser.value.id, 'action': 'force_dispatch'};
				}
				orderProcessModule.update(obj, function(d) {
					tools.notification.success('操作成功');
					console.log($scope.selectedUser);

					$rootScope.selectedUser = $scope.selectedUser;
					$modalInstance.close(d,$scope.selectedUser);
				})
			} else {
				tools.notification.warning('请选择配一个送员');
			}
		};
		$scope.cancel = function(){
			$modalInstance.dismiss();
		}
	}];
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
		};
		$scope.ok = function () {
			var message = $scope.checkedIndex === -1 ? "" : $scope.messages[$scope.checkedIndex];
			message = ($scope.formObj.otherMessage || message).trim();
			if (message) {
				var obj = {'id': item.order_id, 'failed_reason': message, 'action': 'fail'};
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
	}];