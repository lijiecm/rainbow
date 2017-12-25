(function ($, window, angular) {
	"use strict";
	var paramObj = {'id': '@id'},
		methodObj = {'update': {method: 'PUT'}, 'query': {method: 'GET', isArray: false} };
	angular.module('dh.module', ['dh.server'])
	//********************************************用户管理start****************************************************************//
	.factory('bulidPromise', ['$q', 'tools', function($q, tools) {
		return function(resource, data) {
			var defered = $q.defer(), data = data || {};
            resource['query'](data, function (d) {
                defered.resolve(d);
            });
            return defered.promise;
		}
	}])
	//********************************************用户管理****************************************************************//
	.factory('userManagementModule', ['$resource', 'url', function($resource, url) {
		return $resource(url.userManagementUrl, paramObj, methodObj );
	}])
	.factory('userFrozenModule', ['$resource', 'url', function($resource, url) {
		return $resource(url.userFrozenUrl, paramObj, methodObj );
	}])
	.factory('resetPwdModule', ['$resource', 'url', function($resource, url) {
		return $resource(url.resetPasswordUrl, paramObj, methodObj );
	}])
	.factory('changePwdModule', ['$resource', 'url', function($resource, url) {
		return $resource(url.changePwdUrl, null, {'update': {method: 'PUT'}});
	}])
	.factory('changeAcceptOrderModule', ['$resource', 'url', function($resource, url) {
		return $resource(url.changeAcceptOrderUrl, paramObj, {'update': {method: 'PUT'}});
	}])
	.factory('userOrderModule', ['$resource', 'url', function($resource, url) {
		return $resource(url.getUserOrdersUrl, paramObj, methodObj);
	}])
	.factory('getUserStatisticsModule', ['$resource', 'url', function($resource, url) {
		return $resource(url.getUserStatisticsUrl, paramObj, methodObj);
	}])
	
	.factory('staffActiveModule', ['$resource', 'url', function($resource, url) {
		return $resource(url.staffActiveUrl, paramObj, methodObj);
	}])
	//********************************************配送管理****************************************************************//
	.factory('getStationListModule', ['$resource', 'url', function($resource, url) {
		return $resource(url.getStationListUrl, {type: ':type'}, methodObj );
	}])
	//配送站 操作
	.factory('deliveryStationModule', ['$resource', 'url', function($resource, url) {
		return $resource(url.stationUrl, paramObj, methodObj );
	}])
	.factory('changeAutoDispatchModule', ['$resource', 'url', function($resource, url) {
		return $resource(url.changeAutoDispatchUrl, paramObj, methodObj );
	}])
	//外送范围编辑
	.factory('deliveryStationPolygonModule', ['$resource', 'url', function($resource, url) {
		return $resource(url.stationPolygonUrl, paramObj, methodObj );
	}])
	.factory('getRestaurantPointerModule', ['$resource', 'url', function($resource, url) {
		return $resource(url.getRestaurantPointerUrl, null, methodObj );
	}])
	//配送员
	.factory('deliveryUserModule', ['$resource', 'url', function($resource, url) {
		return $resource(url.manageUrl, null, methodObj );
	}])
	//********************************************订单管理****************************************************************//
	//获取未处理订单
	.factory('orderPendingModule', ['$resource', 'url', function($resource, url) {
		return $resource(url.orderPendingUrl, null, methodObj );
	}])
	//获取已处理订单
	.factory('orderPendedModule', ['$resource', 'url', function($resource, url) {
		return $resource(url.orderPendedUrl, null, methodObj );
	}])
	//订单投诉
	.factory('orderSearchModule', ['$resource', 'url', function($resource, url) {
		return $resource(url.orderSearchUrl, null, methodObj );
	}])
	//订单管理
	.factory('orderMangerModule', ['$resource', 'url', function($resource, url) {
		return $resource(url.orderFilterUrl, null, methodObj );
	}])
	//获取所有订单
	.factory('orderAllModule', ['$resource', 'url', function($resource, url) {
		return $resource(url.orderAllUrl, null, methodObj );
	}])
	//处理订单接口
	.factory('orderProcessModule', ['$resource', 'url', function($resource, url) {
		return $resource(url.orderProcessUrl, paramObj, methodObj );
	}])
	//获取配送员列表
	.factory('getOrderDeliveryStaffModule', ['$resource', 'url', function($resource, url) {
		return $resource(url.getOrderDeliveryStaffUrl, null, methodObj );
	}])
	//订单详情
	.factory('orderDetailModule', ['$resource', 'url', function($resource, url) {
		return $resource(url.orderDetailUrl, {'order_id': '@order_id'}, methodObj );
	}])
	//订单详情提交文本
	.factory('orderDetailNoteModule', ['$resource', 'url', function($resource, url) {
		return $resource(url.orderDetailNoteUrl, {'order_id': '@order_id'}, methodObj );
	}])
	//上缴金额
	.factory('commitMoneyModule', ['$resource', 'url', function($resource, url) {
		return $resource(url.commitMoneyUrl, {'order_id': '@order_id'}, methodObj );
	}])
	//设置实付
	.factory('setPaidModule', ['$resource', 'url', function($resource, url) {
		return $resource(url.setPaidUrl,paramObj, methodObj );
	}])
	//设置实收
	.factory('setReceivedModule', ['$resource', 'url', function($resource, url) {
		return $resource(url.setReceivedUrl, paramObj, methodObj );
	}])
	//修改过的订单
	.factory('editedOrderModule', ['$resource', 'url', function($resource, url) {
		return $resource(url.editedOrder, null, methodObj );
	}])
	//下载订单数据
	.factory('downloadOrderModule', ['$resource', 'url', function($resource, url) {
		return $resource(url.downloadOrder, paramObj, methodObj );
	}])
	.factory('effectMangerModule', ['$resource', 'url', function($resource, url) {
		return $resource(url.effectManger, null, methodObj );
	}])
	






























	//********************************************权限管理start****************************************************************//
	//group module
	.factory('groupModule', ['$resource', function($resource) {	
		return $resource(urlsCache.groupUrl +':team_slug/', {team_slug: '@team_slug'}, 
					 	{
							'query': {method: 'GET', isArray: false},
						 	'update': {method: 'PUT'}
						}
					);
	}])
	.factory('multipartGroup', ['groupModule', '$q', 'tools', function(groupModule, $q, tools) {
		var defered = $q.defer();
		groupModule.query(function (successData) {
			defered.resolve(successData);
		}, function (errorData) {
			tools.serverError(errorData);
			defered.reject(errorData);
		});
		return defered.promise;
	}])
	//更新组里用户拥有的权限
	.factory('userPermsModule', ['$resource', function($resource) {
		return $resource(urlsCache.userPermsUrl, {team_slug: '@team_slug', username: '@username'}, {'update': {method: 'PUT'}});
	}])
	//获取当前用户是组管理员的 权限组  ######去除缓存写法  需要修改route.js
	.factory('multipartUserGroupModule', ['$resource', '$q', 'tools', function($resource, $q, tools) {
		return function () {
			var userGroupModule = $resource(urlsCache.getGroupByUserUrl, null, {'query': {method: 'GET', isArray: false}});
			var defered = $q.defer();
			userGroupModule.query(function (successData) {
				defered.resolve(successData);
			}, function (errorData) {
				tools.serverError(errorData);
				defered.reject(errorData);
			});
			return defered.promise;
		}
	}])
	//获取当前组的人员
	.factory('groupUserModule', ['$resource', function($resource) {
		return $resource(urlsCache.getUserByGroupUrl, {team_slug: '@team_slug'}, {'update': {method: 'PUT'}} );
	}])
	//更新组的权限
	.factory('teamsPermsModule', ['$resource', function($resource) {
		return $resource(urlsCache.teamsPermsUrl, {team_slug: '@team_slug', username: '@username'}, {'update': {method: 'PUT'}});
	}])
	//删除组中的用户
	.factory('teamUserModule', ['$resource', function($resource) {
		return $resource(urlsCache.teamUserUrl, {team_slug: '@team_slug', username: '@username'}, {'update': {method: 'PUT'}});
	}])

	//********************************************权限管理end****************************************************************//


	.factory('menuModule', ['$resource', function($resource) {	
		return $resource(urlsCache.menuUrl, {'restaurant_id': '@restaurant_id', 'section_id': '@section_id', 'item_id': '@item_id'}, 
					 	{'update': {method: 'PUT'} });
	}])
	

})($, window, angular);