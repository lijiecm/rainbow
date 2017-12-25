(function ($, window, angular) {
	"use strict"; 
	angular.module("dh.orderDirective", [])
	.value('orderCommon', {
		supportName: '',
		init: function($scope) {
		}
	})
	.directive('asyncGetOrderInfo', ['orderDetailModule', '$compile', "tools", function(orderDetailModule, $compile, tools) {
		return  function(scope, elem, attrs) {
			var order_id = attrs['asyncGetOrderInfo'];
			var $tableBox = elem.closest('.table-box');
			order_id = !isNaN(order_id) && parseInt(order_id);
			var cache = {};
			var isRequest = false;
			var html = 
                '<div class="cart-body">'+
                    '<div class="cart-item clearfix" ng-repeat="item in menuData.menu_items_data">'+
                        '<div class="goods-name ellipsis" title="[[:: item.name]]">[[:: item.name]]</div>'+
                        '<div class="goods-count ellipsis">[[:: item.quantity]]</div>'+
                        '<div class="goods-price">￥[[:: item.price|number:2]]</div>'+
                        '<div class="goods-subtotal">￥[[:: item.sub_total|number:2]]</div>'+
                        '<div class="accessory-item"></div>'+
                        '<div class="accessory-item" ng-repeat="subItem in item.options">'+
                            '<div class="cart-item clearfix">'+
                                '<div class="goods-name ellipsis">[[:: subItem.name]]</div>'+
                                '<div class="goods-count ellipsis">[[:: item.quantity]]</div>'+
                                '<div class="goods-price">￥[[:: subItem.price|number:2]]</div>'+
                                '<div class="goods-subtotal">￥[[:: subItem.sub_total|number:2]]</div>'+
                            '</div>'+
                    	'</div>'+
                    '</div>'+
                    '<div style="border-top:1px solid #cccccc" ng-if="menuData.total_additions.length > 0">'+
	                    '<div class="cart-item clearfix" ng-repeat="item in menuData.total_additions">'+
	                        '<div class="goods-name ellipsis" title="[[:: item.name]]">[[:: item.name]]</div>'+
	                        '<div class="goods-count ellipsis">[[:: item.quantity]]</div>'+
	                        '<div class="goods-price">￥[[:: item.price|number:2]]</div>'+
	                        '<div class="goods-subtotal">￥[[:: item.total_price|number:2]]</div>'+
	                    '</div>'+
                    '</div>'+
                    '<div style="border-top:1px solid #cccccc;" ng-if="menuData.activities.length > 0">'+
	                    '<div class="cart-item clearfix" ng-repeat="item in menuData.activities">'+
	                        '<div class="goods-name ellipsis" title="[[:: item.activity_name]]">[[:: item.activity_name]]</div>'+
	                        '<div class="goods-count ellipsis">[[:: item.num]]</div>'+
	                        '<div class="goods-price">￥-[[:: item.remit_amount|number:2]]</div>'+
	                        '<div class="goods-subtotal link">￥-[[:: item.remit_amount|number:2]]</div>'+
	                    '</div>'+
                	'</div>'+
                '</div>'+
                '<div class="total">'+
                    '<p>配送费：￥[[:: menuData.delivery_fee|number:2]]</p>'+
                    '<p class="link" ng-if="menuData.red_packet_id" >红包：￥-[[:: menuData.red_packet_amount|number:2]]</p>'+
                    '<p class="order-total">实付金额：￥[[:: menuData.order_total|number:2]]</p>'+
                    '<p ng-if="menuData.restaurant_total" class="order-total" style="color: red">实得金额：￥[[:: menuData.restaurant_total|number:2]]</p>'+
                '</div>'+
                '<div class="user-info">'+
                	"<div ng-if='menuData.preorder_for'>" +
						"<span style='color:red'>预定订单：</span>" +
						"[[:: menuData.preorder_for]]" +
					"</div>" +
					"<div ng-if='!menuData.preorder_for'>"+
						"<span>即时订单：</span>" +
						"[[:: menuData.submitted_at]]" +
					"</div>" + 
                    '<div>送餐电话：[[:: menuData.customer_phone]]</div>'+
                    '<div>送餐地址：[[:: menuData.address_text]]</div>'+
                    '<div>备注：[[:: menuData.comment]]</div>'+
                '</div>',
            $next = elem.next(),
            $loading = $next.find('.ajax-loading');
            elem.parent().css('position','relative');
            function calcHeight() {
            	var boxHeight = $tableBox.height();
        		var boxScrollHeight = $tableBox[0].scrollTop + boxHeight;
				var targetHeight = elem[0].offsetTop + elem[0].offsetParent.offsetTop + elem[0].offsetParent.offsetParent.offsetTop;
				var infoHeight = elem.next().height();
    			if (infoHeight + targetHeight > boxScrollHeight) {
    				if (boxHeight - (boxHeight - targetHeight) - infoHeight - 10 < 0) {
    					return false;
    				} else {
    					elem.next().addClass('reverse').css({'top': ( elem.offset().top) - 40 - infoHeight - 15 });
    				}
    			} else {
    				elem.next().removeClass('reverse').css({'top':  elem.offset().top - 28 });
    			}
            }
        	elem.on('mouseover', function() {
        		if (isRequest) {
        			calcHeight();
        			return false;
        		}
	        	if (!elem.attr('async-get-order-info')) {
	        		calcHeight();
	        		return false;
	        	} else {
	        		isRequest = true;
	        		orderDetailModule.query({'order_id': order_id, 'noBlock': 1}, function(d) {
	        			scope.menuData = d;
	        			scope.menuData.submitted_at = tools.fromTimestamp(parseInt(scope.menuData.submitted_at), 'YYYY-MM-DD HH:mm:ss');
	        			scope.menuData.preorder_for = scope.menuData.preorder_for && tools.fromTimestamp(parseInt(scope.menuData.preorder_for), 'YYYY-MM-DD HH:mm:ss');
	        			isRequest = false;
	        			$loading.parent().append($compile(html)(scope));
	        			$loading.remove();
	        			setTimeout(function(){ calcHeight()}, 0)
	        			elem.removeAttr('async-get-order-info');
	        		}, function(d) {
	        			isRequest = false;
	        			tools.serverError(d);
	        			return false;
	        		})
	        	}
        	})
		}
	}])
	.directive('hasCheck', function() {
		return {
			scope: {
				hasCheck: '=',
				checked: '='
			},
			link: function(scope, elem, attrs) {
				var $checkAll = $('#checkAll');
				 $checkAll.on('click', function() {
				 	scope.checked = true;
					elem.find('input:checkbox').attr('checked', this.checked);
					getId();
				})
				elem.on('click', 'input:checkbox', function() {
					getId();
				})
				scope.$watch('checked', function(v) {
					$checkAll.attr('checked', v);
				})
				function getId() {
					var checkedArr = [];
					elem.find('input:checked').each(function() {
						checkedArr.push( parseInt(this.getAttribute('data-index')));
					})
					if (checkedArr.length == 0) {
						$checkAll.attr('checked', false);
					}
					scope.hasCheck = checkedArr;
					scope.$apply();
				}
			}
		}
	})
	.directive('orderSearchType', function() {//form-group
		var html = '<div class="col-md-2"><div class="row"><label class="control-label col-md-5">搜索类型：</label>'+
		'<div class="col-md-7"><div class=""><select ng-model="ngModel" ng-options="item.text for item in orderSearchType" class="form-control pr0"></select></div></div></div></div></div>';
		return {
			template: html,
			scope: {
				searchList: '=',
				ngModel: '='
			},
			replace: true,
			link: function(scope, elem) {
				if (scope.searchList) {
					scope.orderSearchType = scope.searchList;
				} else {
					scope.orderSearchType = [
						{id: 'order_id', text: '订单号'},
						{id: 'rest_name', text: '餐厅名称'},
						{id: 'cust_phone', text: '用户手机号'}
					]
				}
				scope.ngModel = scope.orderSearchType[0];
			}
		}
	})
	.directive('orderInfoMap', function() {
		return {
			scope: {
				orderInfo: '='
			},
			link: function($scope, elem, attrs) {
				var map,
					directionsService,
				    directions_routes,
					start_marker,
					end_marker,
					step_line,
					route_lines = [],
					obj;
				function init() {
					obj = $scope.orderInfo;
				    directionsService = new qq.maps.DrivingService({
				        complete : function(response){
				            var start = response.detail.start,
				                end = response.detail.end;
				            var anchor = new qq.maps.Point(6, 6),
				                size = new qq.maps.Size(24, 36),
				                start_icon = new qq.maps.MarkerImage(
				                    '/static/img/busmarker.png', 
				                    size, 
				                    new qq.maps.Point(0, 0),
				                    anchor
				                ),
				                end_icon = new qq.maps.MarkerImage(
				                    '/static/img/busmarker.png', 
				                    size, 
				                    new qq.maps.Point(24, 0),
				                    anchor
				                    
				                );
				            start_marker && start_marker.setMap(null); 
				            end_marker && end_marker.setMap(null);
				            start_marker = new qq.maps.Marker({
				                  icon: start_icon,
				                  position: start.latLng,
				                  map: map,
				                  zIndex:1
				            });
				            end_marker = new qq.maps.Marker({
				                  icon: end_icon,
				                  position: end.latLng,
				                  map: map,
				                  zIndex:1
				            });
				           directions_routes = response.detail.routes;
				           var routes_desc=[];
				           //所有可选路线方案
				           for(var i = 0;i < directions_routes.length; i++){
				                var route = directions_routes[i],
				                    legs = route; 
				                //调整地图窗口显示所有路线    
				                var steps = legs.steps;
				                var route_steps = steps;
				                var polyline = new qq.maps.Polyline({
				                    path: route.path,
				                    strokeColor: '#3893F9',
				                    strokeWeight: 4,
				                    map: map
				                })  
				                route_lines.push(polyline);
				           }
				           setTimeout(function() {
				           	map.fitBounds(response.detail.bounds);
				           }, 500)
				        }
				    });
				    map = new qq.maps.Map(elem[0], {
				        center: new qq.maps.LatLng(obj.restaurant_lat, obj.restaurant_lng),
				        scaleControl: false,
				        zoomControl: false,
				        panControl: false,
				        mapTypeControl: false
				    });
				    calcRoute();
				}
				function calcRoute() {
				    directionsService.setPolicy(qq.maps.DrivingPolicy['LEAST_DISTANCE']);
				    directionsService.search(new qq.maps.LatLng(obj.restaurant_lat,  obj.restaurant_lng), 
				        new qq.maps.LatLng(obj.customer_lat, obj.customer_lng));
				}
				init();
			}
		}
	})
	.factory('refundFactory', ['tools', 'onlinePayInterface', function(tools, onlinePayInterface) {
		//创建修改退款订单
		var createRefundCtrl = ['$scope', '$modalInstance', 'tools', 'order', 'formData',
				function($scope, $modalInstance, tools, order, formData) {
			var orderTotal = order && order.order_total || 0,
				notification = '创建退款申请成功',
				module = 'orderCreateRefundModule',
				method = 'save';  //创建
			$scope.order = order;
			$scope.validate = {};
			$scope.isModify = false;
			$scope.orderTotal = orderTotal + '';
			$scope.optionList = {
				refundType: [
					{id: '-1', text: '请选择退款类型'},
					{id: 'all', text: '全额退款'},
					{id: 'custom', text: '手动输入退款金额'}
				],
				refundReasonType: [
					{id: '-1', text: '下拉选择理由'},
					{id: '1', text: '餐厅少送了'},
					{id: '2', text: '食品变质或过期了'},
					{id: '3', text: '订单取消'},
					{id: '0', text: '其他'}
				]
			}
			if (formData) {
				$scope.title = "修改退款申请";
				notification = '修改退款申请成功';
				$scope.formData = formData;
				$scope.formData.selectMoney = $scope.optionList.refundType[1];
				$scope.formData.selectRefundReason = $scope.optionList.refundReasonType[3];
				$scope.isModify = true;
				module = 'orderRefundSpecificModule';
				method = 'update';
			} else {
				$scope.title = '创建退款申请';
				$scope.formData = {
					money: '',
					refund_reason: '',
					order_id: order.id,
					image_key: '',
					customer_phone: order.customer_phone || '',
					selectMoney : $scope.optionList.refundType[0],
					selectRefundReason : $scope.optionList.refundReasonType[0]
				}
			}
			
			$scope.cancel = function() {
				$modalInstance.dismiss();
			}
			$scope.ok = function() {
				if ($scope.validate.form1.$valid) {
					var data = angular.copy($scope.formData);
					data.refund_id = data.id;
					if (data.selectMoney.id == 'all') {
						data.money = $scope.orderTotal;//全部金额 字段没定
					}
					if (data.selectRefundReason.id !=  '0') {
						data.refund_reason = data.selectRefundReason.text;
					}
					delete data.selectMoney;
					delete data.selectRefundReason;
					tools.block.blockUI({target: '#' + $scope.modalId});
					onlinePayInterface[module][method](data, function() {
						tools.notification.success(notification);
						$modalInstance.close();
					}, function(d) {
						tools.serverError(d)
						tools.block.unblockUI();
					})
				} else {
					$scope.validate.form1.submit = true
				}
			}
			$scope.removeImgKey = function() {
				$scope.formData.imgUrl = '';
				$scope.formData.image_key = '';
			}
			$scope.fileUpload = function(files) {
				var file = files[0],
					formdata = new FormData();
				if (!order.refund_image_token) {
					tools.notification.error('token不能为空');
					return false;
				}
				if (file.size > 10 * 1024 * 1024) {
					tools.notification.error('凭证图片不能大于10MB');
					return false;
				}
				formdata.append('token', order.refund_image_token);
				formdata.append('file', file);
				tools.uploadRequest(tools.commonApi.QINIU_URL, formdata).then(function(d) {
					$scope.formData.imgUrl = window.URL.createObjectURL(file);
					$scope.formData.image_key = d.key;
					tools.notification.success('上传图片成功');
				}, function(d) {
					tools.serverError(d);
				})
			}
		}]
		//查看退款订单详情
		var orderRefundHandleShowInfoModalCtrl = ['$scope', '$modalInstance', 'item', 'tools', 'orderRefundDetailModuleResolve', 'basicData', 
				function($scope, $modalInstance, item, tools, orderRefundDetailModuleResolve, basicData) {
			$scope.style = {
				'background': item.status == 'succeed' ? 'lightgreen' : 'lightcoral',
				'padding': '10px',
				'marginBottom': '10px'
			}		
			$scope.item = item;
			$scope.getVal = basicData;
			$scope.refund_detail = orderRefundDetailModuleResolve;
			$scope.cancel = function() {
				$modalInstance.dismiss();
			}
		}];
		return {
			action: function(order, refundId) {
				var config = {
					templateUrl: '/static/html/createRefund.html',
					controller: createRefundCtrl,
					resolve : {
						order: function() {
							return order;
						},
						formData: function(bulidPromise, onlinePayInterface) {
							if (refundId) {
								return bulidPromise(onlinePayInterface.orderRefundSpecificModule, {'refund_id': refundId});
							} else {
								return null;
							}
						}
					}
				}
				var modalInstance = tools.modal.open(config);
				return modalInstance.result;
			},
			history: function(item) {
				if (!item.refund_id) {
					tools.notification.error('退款申请ID不明，无法获取详情');
					return false;
				}
				var modalInstance = tools.modal.open({
					templateUrl: '/static/html/refundRecordTemplate.html',
					controller: orderRefundHandleShowInfoModalCtrl,
					resolve: {
						item: function() {
							return item;
						},
						"orderRefundDetailModuleResolve": function(bulidPromise, onlinePayInterface) {
							return bulidPromise(onlinePayInterface.orderRefundDetailModule, {'refund_id': item.refund_id});
						}
					}
				})
				return modalInstance.result;
			}
		}
	}])
	.factory('formatRestaurantSearchType', function() {
		return function(obj, $scope) {
			if ($scope.searchObj.search_type && $scope.searchObj.search_type.id) {
				var typeId = $scope.searchObj.search_type.id,
					keyword = $scope.searchObj.keyword;
				if (typeId == 'order_id' && keyword) {
					var arr = keyword.match(/[1-9][0-9]+/g);
					if (arr && arr[0]) {
						obj[typeId] = arr[0];
					}
				} else {
					obj[typeId] = keyword;
				}
			} 
		}
	})
})(jQuery, window, angular);
	
