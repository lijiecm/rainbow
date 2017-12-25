(function ($, window, angular) {
	"use strict"; 
	angular.module("dh.restaurantDirective", [])
	.directive('qMap', ['$window', 'getRestaurantPointerModule', function($window, getRestaurantPointerModule) {
		return {
			restrict: 'E',
			template: '<div id="iCenter" class="height-100p" style="border:1px solid #cccccc;width:100%"></div>',
			replace:  true,
			scope: {
				polygonEvent: '=event',
				data: '=data',
				lat: '=lat',
				lng: '=lng',
				cityId: '=',
				editable: '='
			},
			link: function(scope, elem, attrs) {
				var mapObj, drawingManager, polygonList = [], opacity = 0.4,
					polygonConfig = { fillColor: '#ff6955', strokeColor : '#c90e0e' },
					cacheData = [];
				scope.polygonEvent = scope.polygonEvent || {};

				scope.polygonData = scope.data ? formatPolygonPath(scope.data) : [];
				if (scope.polygonData) {
					setTimeout(function() {
						map_init();
					}, 0)
				}

		    	var center = new qq.maps.LatLng(scope.lat, scope.lng);
			    function map_init() {
			    	elem.html('');
			    	polygonList = [];
			        mapObj = new qq.maps.Map(elem[0] , {
				        center: center,
				        disableDefaultUI: true,
				        zoomLevel: 14,
				        minZoom: 10
				    });
				    var marker = new qq.maps.Marker({
				        position: center,
				        map: mapObj,
				        icon: new qq.maps.MarkerImage('/static/img/coordinate.png')
				    });

				    var latlngBounds = new qq.maps.LatLngBounds();
				    latlngBounds.extend(center);
					drawPolygon(latlngBounds);
					mapObj.fitBounds(latlngBounds);
			    }
			    function drawPolygon(latlngBounds){
			    	var polygonData = scope.polygonData;
	                var polygonArr = [];
	                for (var j = 0; j < polygonData.length; j++ ) {
	                	var latlng = new qq.maps.LatLng(polygonData[j][1], polygonData[j][0]);
	                    polygonArr.push(latlng);
	                    latlngBounds.extend(latlng);
	                }
	                var polygon = new qq.maps.Polygon({
	                	zIndex: 20,
	                    map: mapObj,
	                    path: polygonArr,         //设置多边形边界路径
	                    strokeColor: qq.maps.Color.fromHex(polygonConfig.strokeColor, opacity),     //线颜色
	                    strokeWeight: 2,            //线宽
	                    fillColor: qq.maps.Color.fromHex(polygonConfig.fillColor, opacity)      //填充色
	                });
	                polygonList.push(polygon);
		        }
		        function addDrawing(callback) {
		        	drawingManager = new qq.maps.drawing.DrawingManager({
				        drawingMode:qq.maps.drawing.OverlayType.POLYGON,
				        drawingControl: false,
				        drawingControlOptions: {
				            position: qq.maps.ControlPosition.TOP_CENTER,
				            drawingModes: [
				                qq.maps.drawing.OverlayType.POLYGON
				            ]
				        },
				        polygonOptions: {
				            fillColor: qq.maps.Color.fromHex(polygonConfig.fillColor, opacity),
				            strokeColor: qq.maps.Color.fromHex(polygonConfig.strokeColor, opacity),
				            strokeWeight: 2
				        }
				    });
				    drawingManager.setMap(mapObj);
				    qq.maps.event.addListener(drawingManager, 'polygoncomplete', function(result, e) {
				    	if (angular.isFunction(callback)) {
				    		callback(buildPath(result.path.elems))
				    	}
				    	drawingManager.setMap(null);
				    })
		        }
		        scope.$watch('editable', function(v) {
		        	if (v) {
		        		editPolygon();
		        	} else {
		        		closePolygon();
		        	}
		        })
		        function editPolygon(v) {
		        	var polygon = polygonList[0];

		        	if (!polygon) {return false;}
		        	polygon.setOptions({editable: true})

		        	var oldPathStr = polygon.getPath().elems.toString();
			    	qq.maps.event.addListener(polygon, 'mouseup', function(e) {
			    		var newPath = e.path.elems,
			    			newPathStr = newPath.toString();
			    		if (oldPathStr != newPathStr && angular.isFunction(scope.polygonEvent.edit)) {
			    			var polygonPath = [];
			    			polygon.path.elems.forEach(function(v) {
			    				polygonPath.push({lat: v.lat, lng: v.lng});
			    			})
			    			var lastItem = polygon.path.elems[0];
			    			polygonPath.push({lat: lastItem.lat, lng: lastItem.lng});
			    			var wkt = buildPath(polygonPath);
		    				scope.polygonEvent.edit(wkt)
			    		}
			    	})
		        }
		        function closePolygon(index) {
		        	var polygon = polygonList[0];
		        	if (!polygon) {return false;}
		        	polygon.setOptions({editable: false})
		        	qq.maps.event.clearListeners(polygon, 'mousedown');
		        	qq.maps.event.clearListeners(polygon, 'mouseup');
		        }
		        function buildPath(arr) {
		        	var path = [];
		        	if (angular.isArray(arr)) {
		        		arr.forEach(function(v) {
							path.push([v.lng, v.lat]);
						})
		        	}
		        	path = bulidPolygonStr(path)
		        	return path;
		        }

		        function formatPolygonPath(path) {
		        	if (typeof path == 'string') {
						path = formatPolygon(path);
					}
					return path;
		        }

	        	//格式化外送范围obj->字符串
	        	function bulidPolygonStr(path) {
	        		var wkt = '';
	        		if (angular.isArray(path) && path.length > 0) {
	        			wkt = 'POLYGON (( ';
	                    path.forEach(function(point, i){
	                        wkt += point[0] + ' ' + point[1] + ', '
	                    })
	                    //wkt += path[0][0] + ' ' + path[0][1] + '))';
	        			wkt = wkt.slice(0, wkt.lastIndexOf(','));
	                    wkt += '))';
	        		}
	        		return wkt;
	        	}
	        	//格式化外送范围字符串->obj
	        	function formatPolygon(pathStr) {
	        		if (!pathStr) {return []}
	        		var reg = /POLYGON\s*\(\(\s*(.*)\s*\)\)/,
	        			filterPath = pathStr.match(reg),
	        			pathArr = [],
	        			i = 0;

	        		if (filterPath && !filterPath[1]) {
	        			throw new Error('解析Polygon失败：' + pathStr);
	        		}
	        		pathStr = filterPath[1];
	        		pathArr = pathStr.split(',');
	        		var len = pathArr.length;
	        		for (i = 0; i < len; i++){
	        			pathArr[i] = pathArr[i].trim().split(' ');
	        		}
	        		for (i = 0; i < len; i++){
	        			for (var j = 0; j < 2; j++) {
	        				pathArr[i][j] = Number(pathArr[i][j]);
	        			}
	        		}
	        		return pathArr;
	        	}
	        	 
	        	var infowWinList = [];
	        	/*显示餐厅坐标*/
	        	function showRestaurntPointer() {
	        		var latlngBounds = new qq.maps.LatLngBounds();
				    
	        		if (infowWinList.length == 0) {
	        			var obj = {'city_id': scope.cityId, 'lng': scope.lng, 'lat': scope.lat}
		        		getRestaurantPointerModule.query(obj, function(d) {
		        			//回调成功后
		        			latlngBounds.extend(center);
		        			if (d && angular.isArray(d.restaurants)) {
		        				d.restaurants.forEach(function(v) {
		        					buildInfoWin(v, latlngBounds)
		        				})
		        			}
		        			mapObj.fitBounds(latlngBounds);
		        		})
	        		} else {
	        			infowWinList.forEach(function(v) {
	        				v.setMap(mapObj);
	        				latlngBounds.extend(v.getPosition());
	        			})
	        			mapObj.fitBounds(latlngBounds);
	        		}
	        	}
	        	function hideRestaurantPointer() {
	        		var latlngBounds = new qq.maps.LatLngBounds();
				    latlngBounds.extend(center);
	        		clearInfoWin();
	        		mapObj.fitBounds(latlngBounds);
	        	}
	        	function buildInfoWin(obj, latlngBounds) {
		        	var position = new qq.maps.LatLng(obj.lat, obj.lng),
		        		infoWin = new qq.maps.InfoWindow({
					        map: mapObj
					    });
				    infoWin.open();
				    infoWin.setContent(obj.name);
				    infoWin.setPosition(position);
				    infowWinList.push(infoWin);
				    
				    latlngBounds.extend(position);
		        }
		        function clearInfoWin() {
		        	if (infowWinList.length > 0) {
						infowWinList.forEach(function(v) {
							v.setMap(null);
						})
					}
		        }
		        //drawingManager.setDrawingMode(null)
    			scope.polygonEvent['map_init'] = map_init;
    			scope.polygonEvent['showRestaurant'] = showRestaurntPointer;
    			scope.polygonEvent['hideRestaurant'] = hideRestaurantPointer;
    			scope.polygonEvent['setPolygonData'] = function(data) {
    				scope.polygonData = formatPolygonPath(data);
    			}
    			scope.polygonEvent['add'] = addDrawing;
			}
		}
	}])
	.directive('qqPosition', ['$window', 'tools', function($window, tools) {
		return {
			restrict: 'E',
			scope: {
				position: '=',
				selectedCity: '='
			},
			template: 
			'<div style="margin-top:-15px;position:relative;">'+
				'<div class="row" style="margin-bottom:5px;">'+
					'<div class="col-md-4 col-xs-5">'+
						'<label class="control-label col-md-3 col-xs-3">城市</label>'+
						'<div class="col-md-9 col-xs-9"><select ng-disabled="selectedCity" class="form-control" ng-model="searchObj.city" ng-options="item.text for item in cityList"></select></div>'+
						'</div><div class="col-md-4 col-xs-4"><input class="form-control" placeholder="请输入搜索地址" type="text" ng-model="searchObj.keyword"></div><div class="col-md-2"><button class="btn btn-success">搜索</button></div>'+
				'</div>'+
				'<div style="height: 18px;position: absolute;top: 40px;z-index: 999999;width: 100%;" id="latLng">'+
					'<span style="display: inline-block;background: #ffffff;"></span>'+
					'<span class="pull-right" style="color:red;display: inline-block;background: #ffffff;"></span>'+
				'</div>'+
				'<div style="width:100%;height:450px" id="container"></div>'+
			'</div>',
			replace: true,
			link: function(scope, elem, attr){
				scope.position = scope.position || {};
				scope.cityList = tools.basicData.citysList.addDefaultOption();
				scope.searchObj = {
					city: scope.cityList[0]
				}
				if (scope.selectedCity) {
					var selectedOption = null;
					scope.cityList.forEach(function(v) {
						if (v.text == scope.selectedCity.text) {
							selectedOption = v;
							return;
						}
					})
					scope.searchObj.city = selectedOption;
				}
				var oSpans = elem.find('#latLng span'),
					container = elem.find('#container')[0],
					$btn = elem.find('button'),
					hasLatLng = false,
					searchService,
					marker = null,
					markers = [],
					lat = scope.position.lat,
					lng = scope.position.lng;
				if (lat && lng) {
					hasLatLng = true;
				} else {
					lat = 34.161818;
					lng = 107.534180 
				}
				var center = new qq.maps.LatLng(lat, lng);
				var map = new qq.maps.Map(container , {
			        center: center,
			        disableDefaultUI: true
			    });
			    if (hasLatLng) { 
			    	map.zoomTo(12);
			    	addMarker(center);
			    }
			    else {
			    	map.zoomTo(4); 
			    }
			    qq.maps.event.addListener(map, 'mousemove',function(event) {
			        var latLng = event.latLng,
			            lat = latLng.getLat().toFixed(6),
			            lng = latLng.getLng().toFixed(6);
			        oSpans[0].innerHTML = lat + ' , ' + lng;
			    });
			    qq.maps.event.addListener(map, 'click', function(event) {
			    	var latLng = event.latLng;
			    	infoWin.close();
			    	setMarker(latLng);
			    });
			    function setMarker(latLng) {
			    	if (marker) {
			    		marker.setMap(null);
			    	}
			        var lat = latLng.getLat().toFixed(6), 
			        	lng = latLng.getLng().toFixed(6);
			        addMarker(new qq.maps.LatLng(lat, lng));
			        oSpans[1].innerHTML = lat + ' , ' + lng;
	        	scope.position.lng = lng;
		        	scope.position.lat = lat;
			        scope.$apply();
			    }
			    searchService = new qq.maps.SearchService({
			        //map: map,
			    	complete: setComplete
			    });
			    var resultLatlngBounds = new qq.maps.LatLngBounds();
			    var infoWin = new qq.maps.InfoWindow({
			        map: map
			    });
			    function setComplete(results){
			    	markers.forEach(function(v) {
			    		v.setMap(null);
			    	})
		            var pois = results.detail.pois;
		            for(var i = 0,l = pois.length;i < l; i++){
		                var poi = pois[i];
		                resultLatlngBounds.extend(poi.latLng);  
		                var marker = new qq.maps.Marker({
		                    map:map,
		                    position: poi.latLng
		                });
		                marker.setTitle( i + 1);
		                markers.push(marker);
		                (function(poi, qq) {
		                	qq.maps.event.addListener(marker, 'click', function() {
				                infoWin.open();
				                infoWin.setContent('<div style="font-style:normal;font-variant:normal;font-weight:normal;font-size:14px;color:#333333;line-height:20px;font-family:Tahoma 宋体 Arial;border:0 none;width:200px"><div><span style="color:#0059B3">' + 
				                	poi.name + '</span></div><div style="margin-top:5px;color:#666666;font-size: 12px;"><div><span>地址:</span><span>' + 
				                	poi.address + '</span></div><div><span>电话:</span><span>' + poi.phone + '</span></div></div></div>');
				                infoWin.setPosition(poi.latLng);
				                setMarker(poi.latLng);
				            });	
		                })(poi, qq)
		                
		            }
		            map.fitBounds(resultLatlngBounds);
		        }
			    $btn.on('click', searchAddress);
			    elem.find('input').on('keyup', function(e) {
			    	if (e.keyCode == 13) {
			    		searchAddress();
			    	}
			    })
			    function searchAddress() {
			    	var keyword = scope.searchObj.keyword;
				    var region = scope.searchObj.city.text;
				    searchService.setLocation(region);
				    searchService.search(keyword);
			    }
			    function addMarker(center) {
			    	marker = new qq.maps.Marker({
				        position: center,
				        map: map,
				        icon: new qq.maps.MarkerImage('/static/img/coordinate.png')
				    });
			    }
			}
		}
	}])
})(jQuery, window, angular);