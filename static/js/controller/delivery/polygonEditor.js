/******************************餐厅外送范围********************************************/
app.controller('deliveryPolygonEditorCtrl', ['$scope', 'tools', 'stationDataResolve', 'deliveryStationPolygonModule', '$timeout',
		function($scope, tools, stationDataResolve, deliveryStationPolygonModule, $timeout) {
	var tmpData = {};
	$scope.polygonEvent = {}

	/*stationDataResolve.station.polygon_wkt = "POLYGON (( 114.792023 30.032839, 114.797516 29.960884, 114.858627 29.959694, 114.87407685693358 30.034027674401568, 114.792023 30.032839, 114.792023 30.032839))"
	stationDataResolve.station.lat = 29.993002
	stationDataResolve.station.lng = 114.829102*/

	$scope.station = stationDataResolve.station;
	var cacheWkt = $scope.station.polygon_wkt;

	$scope.showSave = false;
	tools.setHeader($scope, $scope.station.name + '的配送范围');
	$scope.isShowRestaurant = false;
	$scope.showRestaurant = function() {
		if ($scope.isShowRestaurant) {
			$scope.polygonEvent.hideRestaurant();
			$scope.isShowRestaurant = false;
		} else {
			$scope.polygonEvent.showRestaurant();
			$scope.isShowRestaurant = true;
		}
	}
	//添加
	$scope.addPolygon = function() {
		tools.notification.success('开始添加外送范围，请在地图上点击开始绘制外送范围。');
		$scope.showSave = true;
		$scope.polygonEvent.add(function(wkt) {
			tmpData.wkt = wkt;
		});
	}
	$scope.clearPolygon = function() {
		tools.notification.success('开始添加外送范围，请在地图上点击开始绘制外送范围。');
		$scope.showSave = true;
		$scope.editable = false;
		$scope.polygonEvent.setPolygonData('');
		loadPolygonData();

		$scope.polygonEvent.add(function(wkt) {
			tmpData.wkt = wkt;
		});
	}
	//编辑
	$scope.editPolygon = function(index) {
		$scope.showSave = true;
		$scope.editable = true;
	}
	$scope.polygonEvent.edit = function(wkt) {
		tmpData.wkt = wkt;
	}
	//保存
	$scope.savePolygon = function() {

		if (!tmpData.wkt) {
			if ($scope.station.polygon_wkt) {
				$scope.cancelPolygon();
			} else {
				tools.notification.warning("外送范围不能为空。请检查您是否已结束外送范围绘制");
			}
			return false;
		}

		deliveryStationPolygonModule.update({id: $scope.station.id, 'polygon_wkt': tmpData.wkt}, function() {
			tools.notification.success('操作成功');
			$scope.showSave = false;
			$scope.editable = false;
			$scope.polygonEvent.setPolygonData(tmpData.wkt);
			$scope.station.polygon_wkt = tmpData.wkt;
			loadPolygonData();
		})
	}
	$scope.cancelPolygon = function() {
		$scope.polygonEvent.setPolygonData($scope.station.polygon_wkt);
		loadPolygonData();
		$scope.showSave = false;
		$scope.editable = false;
	}
	//删除
	$scope.removePolygon = function(index) {
		
	}
	//取消
	function loadPolygonData() {
		$scope.polygonEvent.map_init();
		if ($scope.isShowRestaurant) {
			$timeout(function() {
				$scope.polygonEvent.showRestaurant();
			}, 100);
		}
	}
	
}])