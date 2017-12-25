app.controller('orderUserCtrl', ['$scope', 'formatRestaurantSearchType', 'tools', 'userOrderDataResolve', 'userStatisticsDataResolve', 'userOrderModule','commitMoneyModule','setPaidModule','setReceivedModule',
	function($scope, formatRestaurantSearchType, tools, userOrderDataResolve, userStatisticsDataResolve, userOrderModule,commitMoneyModule,setPaidModule,setReceivedModule) {
		$scope.dataList = userOrderDataResolve;
		$scope.dataObj = userStatisticsDataResolve;
		tools.setHeader($scope, $scope.dataList.staff_name + '订单详情');
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

		//将<全部>这一条数据模拟到orders数据里面去
		var totalObj = {
			"cbd_text":"全部",
			"allUp":true,
			"timeShow":true
		};

		function addObj(){
			//方便设置实付和实收的时候 刷新dom数据
			['delivery_fee', 'commission', 'remit_amount', 'rest_total', 'order_total', 'paid', 'received'].forEach(function(v) {
				totalObj[v] = 0;
				$scope.dataList.orders.forEach(function(k,j){
					totalObj[v] += Number(k[v]);
				})
			});
		}
		//当接口返回数据条数有的时候才计算<全部>
		if($scope.dataList.orders.length >= 1){
			addObj();
			$scope.dataList.orders.unshift(totalObj);
		}

		$scope.pageChange = function(page) {
			var obj = {};
			['submitted_start', 'submitted_end'].forEach(function(v) {
				var val = $scope.searchObj[v];
				if (val) {
					obj[v] = tools.basicData.toTimestamp(val);
				}
			});

			//此操作是因为需求更改：原先查找某一段时间数据.现在改为查找某一天数据.
			obj.submitted_end = obj.submitted_start;
			if (obj.submitted_end) {
				obj.submitted_end += 86400;
			}
			obj.id = userId;

			formatRestaurantSearchType(obj, $scope);

			userOrderModule.query(obj, function(d) {
				if(d.orders.length == 0){
					tools.notification.warning("此配送员暂无订单");
				}
				$scope.dataList = d;
				//当接口返回数据条数有的时候才计算<全部>
				if($scope.dataList.orders.length >= 1){
					addObj();
					$scope.dataList.orders.unshift(totalObj);
				}
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
				{field: "上缴金额", width: '5%'},
				{field: "操作", width: '5%'}
			],
			event: {
				formatDiffTime: function(item) {
					var delivered = moment.unix(item.delivered_at),
						expected = moment.unix(item.expected_at);
					var diffVal = item.delivered_at - item.expected_at;
					if ( diffVal > 0) {
						return delivered.subtract(expected).format('HH:mm:ss');
					} else {
						return '——';
					}

				},
				commitMoney:function(item,index){
					var boolen = null;
					if(!item){
						//上缴全部
						var obj = {
							json: true,
							ids:[]
						};
						$scope.dataList.orders.forEach(function(v,j){
							if(!(v.status == 6 || v.status == 7) && v.status != undefined){
								boolen = true;
							}
							if(v.collected == false && (v.status == 6 || v.status == 7)){
								obj.ids.push(v.order_id);
							}
						});
						if(boolen == true){
							tools.notification.warning("还有订单处于配送中，无法使用全部上缴");
							return false;
						}
						tools.bootbox.confirm("全被确认上缴后将无法修改价格和上缴状态").then(function(){
						if(obj.ids.length == 0){
							tools.notification.warning("无可上缴订单");
							return false;
						}
						commitMoneyModule.save(obj,function(data){
							$scope.dataList.orders.forEach(function(v,j){
								if(v.collected == false){
									v.collected = true;
								}
							});
							tools.notification.success("全部上缴成功");
						})
						});
					}else{
						//单个上缴
						var obj = {
							json: true,
							ids:[item.order_id]
						};
						tools.bootbox.confirm("确认上缴后将无法修改价格和上缴状态").then(function(){
							commitMoneyModule.save(obj,function(data){
								item.collected = true;
								tools.notification.success("上缴成功");
							})
						});
					}
				},
				editPaid:function(item,index){
					//设置实付
					tools.bootbox.prompt("设置实付", item.paid, {isClose: function(data) {
						if (isNaN(data)) {
							tools.notification.error("请输入数字");
							return false;
						}
						if(Number(data)<0){
							tools.notification.error("金额不能小于0");
							return false;
						}
					}}).then(function(data){
						item.paid = Number(data).toFixed(2);
						addObj();
						setPaidModule.save({'id':item.order_id,'amount':item.paid},function(data){
							tools.notification.success("设置实付成功");
						})
					})
				},
				editReceived:function(item,index){
					//设置实收
					tools.bootbox.prompt("设置实收", item.received, {
						isClose: function(data) {
							//输入判断
							if (isNaN(data)) {
								tools.notification.error("请输入数字");
								return false;
							}
							if(Number(data)<0){
								tools.notification.error("金额不能小于0");
								return false;
							}
						}}).then(function(data){
							item.received = Number(data).toFixed(2);
							addObj();
							setReceivedModule.save({'id':item.order_id,'amount':item.received},function(data){
								tools.notification.success("设置实收成功");
							})
						})
				}
			}
		}
}])