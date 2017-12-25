(function ($, window, angular) {
	"use strict";
	var getGlobalImgPath = '/static/plugins/metronic/img/';
	var tmpBasicDatas = null;
	try{
		tmpBasicDatas = window._global.basicDatas;
	} catch(e) {
		tmpBasicDatas = {}
	}
	angular.module("dh.server", [])
	.value("globalValue", {
		pageContentHeight: document.documentElement.clientHeight
	})
	//给指令和服务使用的常量
	.factory('commonApi', function() {
		return {
			NOT_DIRECT_ACCESS : {
				"/index/group/add/" : '/index/group/'
			},
			STATIC_TEMPLATE: '/static/html/',
			MOBILE_REG : /^(13[0-9]|15[012356789]|18[0-9]|14[57]|17[0-9])[0-9]{8}$/,
			EMAIL_REG : /^[\w\.-]+@[\w\.-]+\.\w{2,4}$/,
			NUMBER_REG :  /^-?\d+(.\d+)?$/,// /^\d+.?\d+$/,
			COLOR_REG : /^#[0-9a-fA-F]{6}$/,
			RESTAURANT_PHONE_REG: /^[0-9-]{10,13}$/,
			QINIU_URL: 'http://up.qiniu.com',
			WATERMARK_URL: '/static/img/shuiyin.png',
			CHROME_VERSION: 26,
			IS_SMALL_SCREEN: (screen.width <= 1024 || document.documentElement.clientWidth <= 1024),
			NAME: /^[\u4e00-\u9fa5]{2,15}$/,
			BANKCARD: /^\d{16}|\d{19}$/,
			getRandomVal : function(num) {
				num = isNaN(num) ? 2 : parseInt(num);
				return Math.random().toString().substr(num);
			}
		}
	})
	.factory('watermarkImg', ['commonApi', function(commonApi) {
		var img = new Image();
		img.src = commonApi.WATERMARK_URL;
		return img;
	}])
	.factory('setLocation', ['$rootScope', '$location', function($rootScope, $location) {
		return function(url, title, isLocation) {
			$rootScope.pageBreadcrumb.push( { url: url, title: title  } );
			$rootScope.header = title;
			if (isLocation) {
				$location.path(url);
			}
		}
	}])
	.factory('block', function() {
		return {
			blockUI: function (options) {	
            var options = $.extend({boxed: true, target: "#ngView" }, options);
            var html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') +
				'"><img src="' + getGlobalImgPath + 'loading-spinner-grey.gif" align=""><span>&nbsp;&nbsp;' + 
				(options.message ? options.message : 'LOADING...') + '</span></div>';
            if (options.target) { // element blocking
                var el = jQuery(options.target);
                if (el.height() <= ($(window).height())) {
                    options.cenrerY = true;
                }            
                el.block({
                    message: html,
                    baseZ: options.zIndex ? options.zIndex : 1000,
                    centerY: options.cenrerY != undefined ? options.cenrerY : false,
                    css: {
                        top: '10%',
                        border: '0',
                        padding: '0',
                        backgroundColor: 'none'
                    },
                    overlayCSS: {
                        backgroundColor: options.overlayColor ? options.overlayColor : '#000',
                        opacity: options.boxed ? 0.05 : 0.1, 
                        cursor: 'wait'
                    }
                });
            } else { // page blocking
                $.blockUI({
                    message: html,
                    baseZ: options.zIndex ? options.zIndex : 1000,
                    css: {
                        border: '0',
                        padding: '0',
                        backgroundColor: 'none'
                    },
                    overlayCSS: {
                        backgroundColor: options.overlayColor ? options.overlayColor : '#000',
                        opacity: options.boxed ? 0.05 : 0.1,
                        cursor: 'wait'
                    }
                });
            }            
        },
		unblockUI: function (target) {
				$('body').find('.blockUI').remove();
			}
		}
	})
	//alert confirm prompt
	.factory('bootbox', ['$q', function($q) {
		return {
			'alert': function(title) {
				var defined = $q.defer();
				bootbox.alert(title, function() {
					defined.resolve();
				});
				return defined.promise;
			},
			//custom: {cancel:{name: '', className: ''} ok:{} }
			'confirm': function(title , custom) {
				var defined = $q.defer();
				bootbox.confirm(title, function(result) {
					if (result) {
						defined.resolve();
					} else {
						defined.reject();
					}
				});
				return defined.promise;
			},
			'prompt': function(title, val, obj) {
				var defined = $q.defer();
				obj = obj || {};
				var html = '<input id="bootbox-prompt" value="' + (val || '') 
								+ '" class="bootbox-input bootbox-input-text form-control" {maxlength} autocomplete="off" type="text">';
				if (obj.isArea) {
					html = '<textarea id="bootbox-prompt" {maxlength} rows="5" class="bootbox-input bootbox-input-text form-control">'+ (val || '') + '</textarea>';
				}
				for(var item in obj) {
					if (obj[item]) {
						html = html.replace('{' + item + '}', item + '="' + obj[item] + '"');
					}
				}
				bootbox.dialog({
				  	message: html,
					title: title,
					buttons: {
						danger: {
							label: "取消",
							className: "btn-default",
							callback: function () {
								defined.reject();
							}
						},
						success: {
							label: "确认",
							className: "btn-primary",
							callback: function (e) {
								var val = $('#bootbox-prompt').val();
								val = val.trim();
								if (angular.isFunction(obj.isClose)) {
									if (obj.isClose(val) === false) {
										return false;
									} else {
										defined.resolve(val);
									}
								} else {
									defined.resolve(val);
								}
							}
						}
					}
				});
				return defined.promise;
			}
		}
	}])
	//提示
	.factory('notification', function () {
		var toastr = window.toastr || {};
		toastr.options = {
			"closeButton": true,
			"debug": false,
			"positionClass": "toast-top-center",
			"timeOut": 3000
			/*"onclick": null,
			"showDuration": "1000",
			"hideDuration": "1000",
			"extendedTimeOut": "1000",
			"showEasing": "swing",
			"hideEasing": "linear",
			"showMethod": "fadeIn",
			"hideMethod": "fadeOut"*/
		};
		var setTimout = function(timeout) {
			timeout = timeout || 3000;
			toastr.options.timeOut = timeout;
		}
		return {
			show: function (message, type, title) {
				type = type || 'success'; // success info warning error
				toastr[type] && toastr[type](message, title);
			},
			success: function(message, title, timeout) {
				setTimout(timeout);
				toastr.success(message, title);
			},
			info: function(message, title, timeout) {
				setTimout(timeout);
				toastr.info(message, title);
			},
			warning: function(message, title, timeout) {
				setTimout(timeout);
				toastr.warning(message, title);
			},
			error: function(message, title, timeout) {
				setTimout(timeout);
				toastr.error(message, title);
			}
		}
	})
	//弹出层
	.factory('$$stackedMap', function () {
		return {
			createNew: function () {
				var stack = [];
				return {
					add: function (key, value) {
						stack.push({
							key: key,
							value: value
						});
					},
					get: function (key) {
						for (var i = 0; i < stack.length; i++) {
							if (key == stack[i].key) {
								return stack[i];
							}
						}
					},
					keys: function () {
						var keys = [];
						for (var i = 0; i < stack.length; i++) {
							keys.push(stack[i].key);
						}
						return keys;
					},
					top: function () {
						return stack[stack.length - 1];
					},
					remove: function (key) {
						var idx = -1;
						for (var i = 0; i < stack.length; i++) {
							if (key == stack[i].key) {
								idx = i;
								break;
							}
						}
						return stack.splice(idx, 1)[0];
					},
					removeTop: function () {
						return stack.splice(stack.length - 1, 1)[0];
					},
					length: function () {
						return stack.length;
					}
				};
			}
		};
	})
	.directive('modalBackdrop', ['$modalStack', '$timeout',
		function ($modalStack, $timeout) {
			return {
				restrict: 'EA',
				replace: true,
				template: "<div class=\"modal-backdrop fade\" ng-class=\"{in: animate}\" ng-style=\"{'z-index': 10040 + index*10}\" ng-click=\"close($event)\"></div>",
				link: function (scope, element, attrs) {
					$timeout(function () {
						scope.animate = true;
					});
					scope.close = function (evt) {
						var modal = $modalStack.getTop();
						if (modal && modal.value.backdrop && modal.value.backdrop != 'static') {
							evt.preventDefault();
							evt.stopPropagation();
							$modalStack.dismiss(modal.key, 'backdrop click');
						}
					};
				}
			};
  	}])
	.directive('modalWindow', ['$timeout',
		function ($timeout) {
			return {
				restrict: 'EA',
				scope: {
					index: '@'
				},
				replace: true,
				transclude: true,
				template: "<div class=\"bootbox bootbox-alert modal fade {{ windowClass }}\" ng-class=\"{in: animate}\" ng-style=\"{'z-index': 10050 + index*10, 'visibility' : animate ? 'visible' : 'hidden'}\"><div id=\"modal{{10050 + index*10}}\"class=\"modal-dialog\" ng-class=\"{'modal-sm': size == 'sm', 'modal-lg': size == 'lg'}\"><div class=\"modal-content\" ng-transclude></div></div></div>",
				link: function (scope, element, attrs) {
					scope.size = attrs.size;
					scope.windowClass = attrs.windowClass || '';
					$timeout(function () {
						scope.animate = true;
					});
				}
			};
  	}])
	.factory('$modalStack', ['$document', '$compile', '$rootScope', '$$stackedMap',
    	function ($document, $compile, $rootScope, $$stackedMap) {
			var backdropjqLiteEl, backdropDomEl;
			var backdropScope = $rootScope.$new(true);
			var body = $document.find('body').eq(0);
			var openedWindows = $$stackedMap.createNew();
			var $modalStack = {};

			function backdropIndex() {
				var topBackdropIndex = -1;
				var opened = openedWindows.keys();
				for (var i = 0; i < opened.length; i++) {
					if (openedWindows.get(opened[i]).value.backdrop) {
						topBackdropIndex = i;
					}
				}
				return topBackdropIndex;
			}
			$rootScope.$watch(backdropIndex, function (newBackdropIndex) {
				backdropScope.index = newBackdropIndex;
			});
			function removeModalWindow(modalInstance) {
				var modalWindow = openedWindows.get(modalInstance).value;

				//clean up the stack
				openedWindows.remove(modalInstance);
				if (backdropDomEl && backdropIndex() == -1) {
					backdropDomEl && backdropDomEl.removeClass('in');
				}
				modalWindow.modalDomEl.removeClass('in');
				modalWindow.modalDomEl.on('webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd' , function () {
					//remove window DOM element
					modalWindow.modalDomEl.remove();

					//remove backdrop if no longer needed
					if (backdropDomEl && backdropIndex() == -1) {
						backdropDomEl.remove();
						backdropDomEl = undefined;
					}
				})

				//destroy scope
				modalWindow.modalScope.$destroy();
			}
			$modalStack.open = function (modalInstance, modal) {
				openedWindows.add(modalInstance, {
					deferred: modal.deferred,
					modalScope: modal.scope,
					backdrop: modal.backdrop,
					keyboard: modal.keyboard
				});
				var angularDomEl = angular.element('<div modal-window></div>');
				angularDomEl.attr({
					'window-class': modal.windowClass,
					'size': modal.size,
					'index': openedWindows.length() - 1
				});
				modal.scope.modalId = 'modal' + (10050 + (openedWindows.length() - 1) * 10);
				angularDomEl.html(modal.content);
				var modalDomEl = $compile(angularDomEl)(modal.scope);
				openedWindows.top().value.modalDomEl = modalDomEl;
				body.append(modalDomEl);

				if (backdropIndex() >= 0 && !backdropDomEl) {
					backdropjqLiteEl = angular.element('<div modal-backdrop></div>');
					backdropDomEl = $compile(backdropjqLiteEl)(backdropScope);
					body.append(backdropDomEl);
				}
			};
			$modalStack.close = function (modalInstance, result) {
				var modal = openedWindows.get(modalInstance);
				if (modal) {
					modal.value.deferred.resolve(result);
					removeModalWindow(modalInstance);
				}
			};
			$modalStack.dismiss = function (modalInstance, reason) {
				var modalWindow = openedWindows.get(modalInstance).value;
				if (modalWindow) {
					modalWindow.deferred.reject(reason);
					removeModalWindow(modalInstance);
				}
			};
			$modalStack.getTop = function () {
				return openedWindows.top();
			};
			return $modalStack;
    }])
	.provider('$modal', function () {
		var $modalProvider = {
			options: {
				backdrop: true, //can be also false or 'static'
				keyboard: true
			},
			$get: ['$injector', '$rootScope', '$q', '$http', '$templateCache', '$controller', '$modalStack', '$compile',
        		function ($injector, $rootScope, $q, $http, $templateCache, $controller, $modalStack, $compile) {
					var $modal = {};
					function getTemplatePromise(options) {
						return options.template ? $q.when(options.template) :
							$http.get(options.templateUrl, {
								cache: $templateCache
							}).then(function (result) {
								return result.data;
							});
					}
					function getResolvePromises(resolves) {
						var promisesArr = [];
						angular.forEach(resolves, function (value, key) {
							if (angular.isFunction(value) || angular.isArray(value)) {
								promisesArr.push($q.when($injector.invoke(value)));
							}
						});
						return promisesArr;
					}
					$modal.open = function (modalOptions) {
						var modalResultDeferred = $q.defer();
						var modalOpenedDeferred = $q.defer();
						//prepare an instance of a modal to be injected into controllers and returned to a caller
						var modalInstance = {
							result: modalResultDeferred.promise,
							opened: modalOpenedDeferred.promise,
							close: function (result) {
								$modalStack.close(modalInstance, result);
							},
							dismiss: function (reason) {
								$modalStack.dismiss(modalInstance, reason);
							}
						};
						//merge and clean up options
						modalOptions = angular.extend({}, $modalProvider.options, modalOptions);
						modalOptions.resolve = modalOptions.resolve || {};
						//verify options
						if (!modalOptions.template && !modalOptions.templateUrl) {
							throw new Error('One of template or templateUrl options is required.');
						}
						var templateAndResolvePromise =
							$q.all([getTemplatePromise(modalOptions)].concat(getResolvePromises(modalOptions.resolve)));
						templateAndResolvePromise.then(function resolveSuccess(tplAndVars) {
							var modalScope = (modalOptions.scope || $rootScope).$new();
							modalScope.$close = modalInstance.close;
							modalScope.$dismiss = modalInstance.dismiss;
							var ctrlInstance, ctrlLocals = {};
							var resolveIter = 1;
							//controllers
							if (modalOptions.controller) {
								ctrlLocals.$scope = modalScope;
								ctrlLocals.$modalInstance = modalInstance;
								angular.forEach(modalOptions.resolve, function (value, key) {
									ctrlLocals[key] = tplAndVars[resolveIter++];
								});
								ctrlInstance = $controller(modalOptions.controller, ctrlLocals);
							}
							tplAndVars = tplAndVars[0];
							$modalStack.open(modalInstance, {
								scope: modalScope,
								deferred: modalResultDeferred,
								content: tplAndVars,
								backdrop: modalOptions.backdrop,
								keyboard: modalOptions.keyboard,
								windowClass: modalOptions.windowClass,
								size: modalOptions.size
							});
						}, function resolveError(reason) {
							modalResultDeferred.reject(reason);
						});
						templateAndResolvePromise.then(function () {
							modalOpenedDeferred.resolve(true);
						}, function () {
							modalOpenedDeferred.reject(false);
						});
						return modalInstance;
					};
					return $modal;
        	}]
		};
		return $modalProvider;
	})
	.factory("scroll", function() {
		var $pageContent = $('#pageContent');
		function setObj(v) {
			if (v) {
				$pageContent = $("#" + v);
			}
		}
		return {
			top: function(v) {
				setObj(v);
				$pageContent.animate({scrollTop: 0}, 200)
			},
			bottom: function(v) {
				setObj(v);
				setTimeout(function() {
					$pageContent.scrollTop($pageContent[0].scrollHeight)
				}, 0)
			}
		}
	})
	.factory('comet', ['$rootScope','$location', '$cookies', 'url', 'bootbox', 'basicData',
			function($rootScope, $location, $cookies, url, bootbox, basicData) {
		function Comet() {
			this.url = url.webSocketUrl;
			//this.username = basicData && basicData.user && (basicData.user.username + '$$' + $cookies.socket_id);
			this.username = basicData.usermobile;
			this.ws = null;
			this.invokeObj = {};
			this.commonFunc = {};
			this.heartbeatTimeoutCount = 0; //心跳超时次数
			this.reconnectCount = 1; //重连次数
			this.reconnectTime = 5000;//重连时间
			this.checkPeriod = 30000; //心跳间隔
			this.isConnection = false; //是否成功连接
			this.connectionSuccessCallbackList = [];
			this.heartbeatInterVal = null; //心跳循环
			this.startReconnection = false; //是否开启重连
			this.hasComet = ($location.search().model == 'tab' || $rootScope.model == 'tab') ? false : true;
		}
		Comet.prototype.send = function(data) {
			if (!angular.isString(data)) {
				data = angular.toJson(data);
			}
			if (this.ws && this.ws.readyState == 1) {
				this.ws.send(data + '\n');
			} else {
				if (!this.startReconnection) {
					this.reconnection();
				}
			}
		}
		//回传数据
		Comet.prototype.ack = function(ack_id_list) {
			var message = ack_id_list.join(',');
	        var ackData = {type: "ack", username: this.username, message: message};
	        console.info('调用回传数据请求: ' + message);
			this.send(ackData)
		}
		Comet.prototype.successFunc = function(data) {
			console.group('websocket接受数据')
			console.info(data);
			try {
				var ack_id_list = [], path = $location.path();
				console.log(path);
				for (var i = 0, length = data.length; i < length; i++) {
					var curData = data[i];
					if (!(curData && curData.message)) {
						return;
					}
					var type = curData.message.type;
					if (type) {
						//调用全局方法
						if (angular.isFunction(this.commonFunc[type])) {
							console.info('调用全局回调方法 类型：' + type);
							this.commonFunc[type](curData.message.message);
						}
						//根据当前的url找到对应的调用方法
						var obj = this.invokeObj[path];
						//判断是否是方法
						if (angular.isObject(obj) && angular.isFunction(obj[type])) {
							console.info('调用当前页面回调方法 类型：' + type);
							obj[type](curData.message.message);
						} else {
							delete this.invokeObj[path];
						}
					}
					ack_id_list.push(curData.id);
				}
				//回传接收到的id
				this.ack(ack_id_list);
			} catch(e) {
				console.error(e)
			}
			console.groupEnd();
		}
		//心跳检测
		Comet.prototype.heartbeat = function() {
			if (!this.hasComet) {
				return;
			}
			var that = this;
			var headerbeatData = {type: "heartbeat", username: this.username, message: "ok"};
			function heartbeat() {
				//console.count('心跳包')
				that.send(headerbeatData);
			}
			this.heartbeatInterVal = setInterval(heartbeat, that.checkPeriod);
			return false;
				/*$http.post(urlsCache.heartbeatUrl).success(function(data, status) {
					that.heartbeatTimeoutCount = 0;
					if (data) {
						that.cometSuccessFunc(data);
					}
				}).error(function(d, status) {
					if (status && status == 403) {
						clearInterval(interval);
						bootbox.confirm('您的账号已在其他地方登录、或者已退出。是否需要回到登录页面？').then(function() {
							window.location.href = '/login/';
						})
					}
					that.heartbeatTimeoutCount += 1;
					if (that.heartbeatTimeoutCount >= 3) {
						//超时6次停止心跳检测
						clearInterval(interval);
						bootbox.confirm('连接异常是否需要刷新页面？').then(function() {
							window.location.reload();
						}, function() {
							//用户取消刷新页面，重新开启心跳
							interval = setInterval(heartbeat, that.checkPeriod);
						})  
					}
					console.error('心跳检测异常');
				})*/
		}
		//开启websocket
		Comet.prototype.connect = function() {
			if (!this.hasComet) {
				return;
			}
			var that = this;
			try {
				this.startReconnection = false;
				this.ws = new WebSocket(this.url + '&username=' + this.username);
			} catch(e) {
				if (!this.startReconnection) {
					this.reconnection();
				}
				return false;
			}
			console.info('连接字符串：' + this.url + '&username=' + this.username);
			this.ws.onopen = function() {
				that.reconnectCount = 1; //重连次数
				that.startReconnection = false; //初始化
				console.info('WebSocket连接成功');
				if (!that.isConnection) {
					if (angular.isArray(that.connectionSuccessCallbackList)) {
						that.connectionSuccessCallbackList.forEach(function(v) {
							if (angular.isFunction(v)) {
								v();
							}
						})
						that.connectSuccessCallbackList = [];
					}
					that.isConnection = true;
				}
                that.heartbeat();
			};
			this.ws.onclose = function() {
				console.warn("WebSocket断开连接");
				if (!that.startReconnection) {
					that.reconnection();
				}
				that.clearHeartbeatInterVal();
			}
			this.ws.onerror = function() {
				console.error('WebSocket错误');
			}
			this.ws.onmessage = function(e) {
				var list = e && e.data;
				if (list) { 
					list = angular.fromJson(list);
					var data = list.map(function(v) {
						try {
							v.message = angular.fromJson(v.message);
						} catch(e) {
							v.message = v.message;
						}
						return v
					})
					that.successFunc(data);
				}
			}
		}
		Comet.prototype.clearHeartbeatInterVal = function() {
			clearInterval(this.heartbeatInterVal); //停止心跳连接;
		}
		Comet.prototype.reconnection = function() {
			this.clearHeartbeatInterVal();
			console.info('间隔：' + this.reconnectTime + 'ms，次数：' + this.reconnectCount);
			var that = this;
			setTimeout(function() {
				that.connect();
			}, this.reconnectTime);
			this.reconnectCount += 1;
			this.startReconnection = true; //标记开启重连
		}
		Comet.prototype.onConnectionSuccessCallback = function(func) {
			this.connectionSuccessCallbackList.push(func);
		}
		Comet.prototype.on = function(key, func) {
			var path = $location.path();
			if (!angular.isObject(this.invokeObj[path])) {
				this.invokeObj[path] = {};
			}
			this.invokeObj[path][key] = func;
		}
		Comet.prototype.off = function(key) {
			var path = $location.path();
			delete this.invokeObj[path][key];
		}
		Comet.prototype.offPath = function(path) {
			delete this.invokeObj[path];
		}
		Comet.prototype.onCommon = function(key, func) {
			if (angular.isFunction(func)) {
				this.commonFunc[key] = func;
			}
		}
		Comet.prototype.offCommon = function(key) {
			delete this.commonFunc[key];
		}
		return Comet;
	}])
	//图片上传
	.factory('uploadRequest', ['$q', 'notification', 'commonApi', function($q, notification, commonApi) {
		return function (url, formData) {
			url = url || commonApi.QINIU_URL;
			if (formData) {
				var xhr = new XMLHttpRequest(),
					defered = $q.defer();
				xhr.responseType = 'json';
				xhr.timeout = 5000;
				xhr.ontimeout = function(){
					xhr.abort();
					notification.error("网络异常，上传超时");
				}
				xhr.onerror = function(){
					notification.error("未知错误，上传失败");
				}
				xhr.open('POST', url);
				xhr.onreadystatechange = function(){
					if(xhr.readyState == 4 && xhr.status == 200){
						defered.resolve(xhr.response);
					} else if (xhr.readyState == 4 && xhr.status != 200) {
						defered.reject(xhr.response);
					}
				}
				xhr.send(formData);
				return defered.promise;
			} else {
				throw new Error("formData 为空");
			}
		}	
	}])
	//存储
	.factory('storageBase', ['basicData', function(basicData) {
		function bulidkey(key, type) {
			if (type == 'user'){
				key = basicData.user ? basicData.user.username + '_' + key : key;
			}
			return key;
		}
		return {
			get: function(key, type) {
				key = bulidkey(key, type);
				return localStorage.getItem(key);
			},
			get2format: function(key, type) {
				key = bulidkey(key, type);
				var result = localStorage.getItem(key);
				try {
					if (result) {
						return angular.fromJson(result);
					} else {
						return {};
					}
				} catch(e) {
					return {};
				}
			},
			set: function(key, value, type) {
				key = bulidkey(key, type);
				if (angular.isObject(value) || angular.isArray(value)) {
					value = angular.toJson(value);
				}
				return localStorage.setItem(key, value);
			},
			remove: function(key, type) {
				key = bulidkey(key);
				return localStorage.removeItem(key);
			},
			clear : function() {
				return localStorage.clear();	
			}
		}
	}])
	.factory('browser', ['storageBase' , 'commonApi', 
		function(storageBase, commonApi) {
			if (!$.setUserConfig) {
				$.setUserConfig = function(str) {
					storageBase.set('config', str, 'user');
				}
			}
			var browser = $.browser;
			var isMobile = false;
			var userAgentInfo = navigator.userAgent;
			var agents = new Array("Android", "iPhone", "Windows Phone", "iPad", "iPod");
			agents.forEach(function(v) {
				if (userAgentInfo.indexOf(v) > -1) {
					isMobile = true;
				}
			})
			return {
				isChrome: function() {
					if (storageBase.get2format('config', 'user').notValidateBrowser) {
						return true;
					} else {
						if ((browser.chrome || browser.safari) && parseInt(browser.version) >= commonApi.CHROME_VERSION) {
							return true;
						} else {
							return false;
						}
					}
				},
				isMobile: function() {
					return isMobile;
				}
			}
	}])
	//工具server
	.factory('tools', ['$location', '$rootScope', '$modal', 'bootbox', 'notification', 'block', 'scroll', 'comet', '$route', '$routeParams', 'uploadRequest', 'commonApi', 'storageBase', 'basicData',
			function($location, $rootScope, $modal, bootbox, notification, block, scroll, comet, $route, $routeParams, uploadRequest, commonApi, storageBase, basicData) {
		var cometObj = new comet();
		var scope = {};
		var cacheData = {};
		return {
			modal : $modal,
			bootbox : bootbox,
			notification : notification,
			block : block,
			scroll : scroll,
			location : $location,
			rootScope: $rootScope,
			route: $route,
			routeParams: $routeParams,
			uploadRequest: uploadRequest,
			commonApi: commonApi,
			basicData: basicData,
			//添加ajax轮询方法
			comet: cometObj,
			topScope: scope,
			//页面缓存
			cacheData: cacheData,
			//格式化unix时间戳
			toTimestamp : function(date, hours, minutes, seconds) {
				var momentDate = moment(date);
				momentDate.hours(hours || 0);
				momentDate.minutes(minutes || 0);
				momentDate.seconds(seconds || 0);
				return momentDate.unix()
			},
			//unix时间戳格式化
			fromTimestamp : function(timestamp, format) {
				format = format || "YYYY-MM-DD";
				timestamp = parseInt(timestamp);
				return moment.unix(timestamp).format(format);
			},
			now: {
				unix: function() {
					return moment().unix();
				},
				format: function(format) {
					format = format || 'YYYY-MM-DD';
					return moment().format(format);
				}
			},
			pagerToggle: function($scope, status, height) {
				var height = height || 105;
				if (status) {
					$scope.tableHeight = {'height': 'calc(100% - ' + height + 'px)'}
				} else {
					$scope.tableHeight = {'height': 'calc(100% - ' + (height - 57) + 'px)'}
				}
			},
			clearDom: function() {
				$('.datetimepicker, .select2-hidden-accessible, #amap, .change-remove').remove();
			},
			//设定头部
			setHeader: function($scope, header, subHeader) {
				$scope.header = header || '';
				if (subHeader) {
					$scope.subHeader = subHeader;
				}
			},
			formatSelectData: function(obj, key) {
				var key = key || 'id';
				for (var oKey in obj) {
					var value = obj[oKey];
					if (value && value[key]) {
						if (value[key] == -1) {
							delete obj[oKey];
						} else {
							obj[oKey] = value[key]
						}
					}
				}
				return obj;
			},
			serverError: function(d, statusCode, a) {
				if (d) {
					if (d.status == 404) {
						notification.error("404: 页面没找到");
						return false;
					}
					var msg = d && (d.msg || d.err_msg || d.failed_msg);
					msg = msg || (d.data && (d.data.msg || d.data.err_msg || d.data.failed_msg) || '操作失败，服务器错误');
					notification.error(msg);
				}
			},
			clearEmptyProp: function(obj) {
				for (var key in obj) {
					if (!(obj[key] || obj[key] === 0)) {
						delete obj[key];
					}
				}
			},
			parseUrl : function(href) {
				var link = document.createElement('a');
				link.href = href;
				var parsed = link.search.substr(1).split('&'),
					query = {};
				parsed.forEach(function(elem, iter, arr) {
					var vals = arr[iter].split('=');
					query[vals[0]] = vals[1]
				});
				link.query = query;
				return link;
			}
		}
	}])
	//通过url获取route对应的页面
	.factory('getRouteData', ['$injector', '$rootScope', '$q', '$http', '$controller', '$compile', '$templateCache', 'tools',
				function ($injector, $rootScope, $q, $http, $controller, $compile, $templateCache, tools) {
		var stackedMap = {};
		function getTemplatePromise(options) {
			return options.template ? $q.when(options.template) :
				$http.get(options.templateUrl, {
					cache: $templateCache
				}).then(function (result) {
					return result.data;
				});
		}
		function getResolvePromises(resolves) {
			var promisesArr = [];
			angular.forEach(resolves, function (value, key) {
				if (angular.isFunction(value) || angular.isArray(value)) {
					promisesArr.push($q.when($injector.invoke(value)));
				}
			});
			return promisesArr;
		}

		function getRouteConfig(href) {
			try {
				var obj = {}, 
					oRoutes = tools.route.routes,
					parseObj = tools.parseUrl(href);
				href = parseObj.pathname;
				var query = parseObj.query;
				for (var key in oRoutes) {
					if (key.lastIndexOf('/') === key.length - 1) {
						var oRoute = oRoutes[key],
							execArr = oRoute.regexp.exec(href);
						if (!execArr) { continue;}
						for (var i = 0, len = oRoute.keys.length; i < len; i++) {
							//替换$route参数 
							var paramsName = oRoute.keys[i]['name'],
								paramsVal = execArr[i + 1];
							tools.route.current.params[paramsName] = paramsVal;
							tools.routeParams[paramsName] = paramsVal;
						}
						obj.controller = oRoute.controller || "";
						obj.templateUrl = oRoute.templateUrl || "";
						obj.resolve = oRoute.resolve || {};
						break;
					} else {
						continue;
					}
				}
				if (query) {
					for (var key in query) {
						tools.route.current.params[key] = query[key];
						tools.routeParams[key] = query[key];
					}
				}
				return obj;
			} catch(e) {
				return null;
			}
			
		}
		return function (href) {
			var defered = $q.defer(),
				options = getRouteConfig(href);
			options = angular.extend({}, options);
			options.resolve = options.resolve || {};

			if (!options.template && !options.templateUrl) {
				throw new Error('One of template or templateUrl options is required.');
			}
			//异步获取模板和resolve数据
			var templateAndResolvePromise =
				$q.all([getTemplatePromise(options)].concat(getResolvePromises(options.resolve)));
			templateAndResolvePromise.then(function resolveSuccess(tplAndVars) {
				/*
					tplAndVars[0] html
					tplAndVars[1] resolve
					tplAndVars[2] resolve
					...
				*/
				//新建scope
				var newScope = (options.scope || $rootScope).$new();

				var ctrlInstance, ctrlLocals = {}, resolveIter = 1;
				//新建controller
				if (options.controller) {
					ctrlLocals.$scope = newScope;
					angular.forEach(options.resolve, function (value, key) {
						ctrlLocals[key] = tplAndVars[resolveIter++];
					});
					ctrlInstance = $controller(options.controller, ctrlLocals);
				}
				tplAndVars = tplAndVars[0];

				//编译模板
				var domEl = $compile(tplAndVars)(ctrlLocals.$scope);

				defered.resolve({
					scope: newScope,
					content: domEl
				});
			}, function resolveError(reason) {
				defered.reject(reason);
			});
			return defered.promise;
		};
     }])
}) ($, window, angular);