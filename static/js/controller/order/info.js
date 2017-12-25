/******************************订单详情********************************************/
app.controller('orderInfoCtrl', ["$rootScope", "$scope", "tools", "OrderDetailDataResolve", 'orderDetailNoteModule', 'basicData',
		function ($rootScope, $scope, tools, OrderDetailDataResolve, orderDetailNoteModule, basicData) {
			tools.setHeader($scope, '订单详情');
			var order_id = tools.routeParams.order_id;
			$scope.getVal = basicData;
			$scope.menuData = OrderDetailDataResolve;
			$scope.mapData = $scope.menuData.map;
			$scope.noteVal = '';
			$scope.saveNote = function() {
				if ($scope.noteVal.trim() !== '') {
					orderDetailNoteModule.save({
						'note': $scope.noteVal,
						'order_id': order_id,
						'json' : 1
					}, function(d) {
						tools.notification.success('添加成功');
						
						$scope.menuData.order_notes.push({
							"note": $scope.noteVal,
							"created_by": basicData.usermobile,
							"created_at": moment().unix()
						});
						$scope.noteVal = '';
					}, function(d) {
						tools.serverError(d);
					})
				} else {
					tools.notification.warning('内容不能为空');
				}
			}
			$scope.keyup = function(event) {
				if (event.ctrlKey && event.keyCode == 13) {
					$scope.saveNote();
				}
			}
}]);