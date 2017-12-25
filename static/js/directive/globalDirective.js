
(function ($, window, angular) {
    "use strict";
    var $window = $(window),
		$body = $('body'),
		validateObj = {
			elemType : ['text', 'password', 'email', 'number', 'textarea', 'select'],
			formGroupExpression: '',
			validateAttrs : [ 'required', 'mobile', 'email','alipaycard', 'username', 'ng-minlength', 'ng-maxlength', 'number', 'rphone', 'maxval', 'minval', 'ng-pattern', 'requiredselect', 'interger', 'money'],
			defaultRules  : {
				required : "该项不能为空",
				number: '该项必须是数字',
				email : '邮箱格式不正确',
				mobile : '手机号码格式不正确',
				rphone: '餐厅联系方式不正确',
				username:'姓名应为等于或大于2位中文汉字',
				alipaycard:'账号为手机号或者邮箱',
				'ng-minlength': '该项不能小于{0}位数',
				'ng-maxlength': '该项不能大于{0}位数',
				'maxval': '该项数值不能大于{0}',
				'minval': '该项数值不能小于{0}',
				'ng-pattern': '该项不符合',
				'money': '该项不符合规范',
				'interger': '该项必须为整数',
				'requiredselect': '该项不能为空'
			},
			buildExpression : function (formName, inputName, itemName, elem) {
				if (itemName.indexOf('ng-') > -1) {
					itemName = itemName.substr(3);
				}
				var customCondition = elem.attr('custom-condition');
				var expression = formName + '.submit && ' + formName + '.' + inputName + '.$error.' + itemName;
				if (typeof customCondition !== 'undefined' && customCondition !== false) {
					expression += ' && ' + customCondition;
				}
				if (validateObj.formGroupExpression) {
					validateObj.formGroupExpression += ' || ' + formName + '.' + inputName + '.$error.' + itemName;
				} else {
					validateObj.formGroupExpression += formName + '.submit && ';
					if (typeof customCondition !== 'undefined' && customCondition !== false) {
						validateObj.formGroupExpression += customCondition + ' && ';
					}
					validateObj.formGroupExpression += '(' + formName + '.' + inputName + '.$error.' + itemName;
				}
				return expression;
			},
			buildErrorElement : function (expression, errorMsg) {
				return '<span ng-if="' + expression + '" class="help-block">' + errorMsg + '</span>';
			}
		},
		hasAttr = function(elem, attr) {
			var attr = elem.attr(attr)
			if (typeof attr !== 'undefined' && attr !== false) {
				return true;
			} else {
				return false;
			}
		};
    //uniform插件美化checkbox、radio
	angular.module("dh.directive", [])
	.value('includeUrl', '/static/html/')
	.directive("body", ['$rootScope', 'storageBase', 'getRouteData', 'tabNavMenuFactory', function ($rootScope, storageBase, getRouteData, tabNavMenuFactory) {
        return {
            restrict : 'E',
            link: function(scope, elem, attrs) {
            		
            	$rootScope.encodeURIComponent = function(name) {
            		return window.encodeURIComponent(name);
            	}
            	var tabToggle = function(key) {
            		var obj = $rootScope.tabCache[key];
            		if (obj) {
            			$rootScope.tabClick(obj);
            		}
            	}
            	var closeTab = function() {
            		for (var i = $rootScope.tabCache.length - 1; i >= 0; i--) {
            			if ($rootScope.tabCache[i].active) {
            				$rootScope.closeTab(i);
            				return false;
            			}
            			$rootScope.isLoading = false;
            		}
            	}
            	elem.on('keyup', function(e) {
            		if(e.altKey){
						switch(e.keyCode) {
							case 49 : tabToggle(0); break;
							case 50 : tabToggle(1); break;
							case 51 : tabToggle(2); break;
							case 52 : tabToggle(3); break;
							case 53 : tabToggle(4); break;
							case 54 : tabToggle(5); break;
							case 55 : tabToggle(6); break;
							case 56 : tabToggle(7); break;
							case 57 : tabToggle(8); break;
							case 87 : closeTab(); break;
						}
					}
					$rootScope.$apply();
            	}).on('click', function() {
            		$('#datetimepicker').hide();
            	})
            	//是否屏蔽右键菜单
            	if (!storageBase.get2format('config', 'user').openContextmenu) {
	            	elem.on('contextmenu', function() {
						return false;
					})
            	}
            	//是否提示刷新页面
            	//并非tab页，并非login页面，配置项不允许弹出
            	if (storageBase.get2format('config', 'user').notReloadConfirm != 1) {
            		if (location.pathname.indexOf("login") != -1 && location.pathname.indexOf("logout") != -1) {
						window.onbeforeunload = function() { return '';}
            		}
            	}
            	//根据URL 选择左侧菜单
				if (location.search.indexOf('model=tab') == -1) {
					var hormenuDropdown = $("#hormenuDropdown");
					$("#pageSidebarMenu").find('a[href="' + location.pathname + '"]').click();

					hormenuDropdown.on('click', 'li:not(.divider)', function() {
						var $this = $(this), 
							index = parseInt($this.parent().attr('data-index')),
							curTab = $rootScope.tabCache[index],
							i = 0,
							length = $rootScope.tabCache.length;
						switch($this.attr('type')) {
							case 'refresh':
								getRouteDataFunc(index);
								break;
							case 'close':
								tabNavMenuFactory.removeTab(index);
								break;
						}
						hormenuDropdown.hide();
					})

					$("#horMenu").on("contextmenu", '.classic-menu-dropdown.active', function(e) {
						var $this = $(this);
						hormenuDropdown.css({'top': e.pageY, left: e.pageX}).attr('data-index', $this.attr('data-index')).show();
						return false;
					})
				}
				function getRouteDataFunc(index) {
					var tabNavList = tabNavMenuFactory.getTabNavList();
					var i = 0, tabLen = tabNavList.length;
					$rootScope.isLoading = true;
					getRouteData(tabNavList[index].href).then(function(obj) {
						var $tab = $('<div class="tab-container"></div>'), tabObj;
						$tab.html(obj.content);
						
						for (var i = 0; i < tabLen; i++) {
							if (tabNavList[i].active) {
								var $content = $tab.children('.view-scroll-box');
								tabNavList[i].dom.replaceWith($tab);
								$content.css({'opacity': 0}).animate({'opacity': 1}, 300)

								tabNavList[i].dom = $tab;
								tabNavList[i].content = $content;
							}
						}
						
						$rootScope.isLoading = false;
					}, function(d) {
						//tools.serverError(d);
						$rootScope.isLoading = false;
					})
				};
				$('body').click(function() {
					$('body').find('#hormenuDropdown').hide();
				})
            }
        }
    }])
 	//侧边栏toggle
    .directive('pageSidebar', ["commonApi", function (commonApi) {
    	return {
    		restrict: 'C',
    		link: function (scope, elem, attrs) {
    			//计算页面高度
    			var height = $('.page-sidebar').height() + 20,
					headerHeight = $('.page-header').outerHeight(),
					footerHeight = $('.page-footer').outerHeight();
				if ($window.width() > 1024 && (height + headerHeight + footerHeight) < $window.height()) {
					height = $window.height() - headerHeight - footerHeight;
				}
				$('.page-content').attr('style', 'min-height:' + height + 'px');

    			elem.on('click', '.sidebar-toggler', function (e) {
    				var $sidebar = $('.page-sidebar');
    				var $sidebarMenu = $('.page-sidebar-menu');
    				$(".sidebar-search", $sidebar).removeClass("open");
    				if ($body.hasClass("page-sidebar-closed")) {
    					$body.removeClass("page-sidebar-closed");
    					$sidebarMenu.removeClass("page-sidebar-menu-closed");
    				} else {
    					$body.addClass("page-sidebar-closed");
    					$sidebarMenu.addClass("page-sidebar-menu-closed");
    					if ($body.hasClass("page-sidebar-fixed")) {
    						$sidebarMenu.trigger("mouseleave");
    					}
    				}
    			});
    			if (commonApi.IS_SMALL_SCREEN) {
    				elem.find('.sidebar-toggler').click();
    				$("#pageContent").css("overflow-y", 'auto');
    			}
    		}
    	}
    }])
    //侧边栏expend
    .directive('pageSidebarMenu', ['$timeout', '$rootScope', "tabNavMenuFactory",
    	function ($timeout, $rootScope, tabNavMenuFactory) {
    		return {
    			restrict: 'C',
    			link: function (scope, elem, attrs) {
    				var scrollTo = function (el, offeset) {
    						var pos = (el && el.size() > 0) ? el.offset().top : 0;
    						if (el) {
    							if ($('body').hasClass('page-header-fixed')) {
    								pos = pos - $('.page-header').height();
    							}
    							pos = pos + (offeset || -1 * el.height());
    						}
    						$('html,body').animate({
    						 	scrollTop: pos
    						}, 'slow');
    					},
    					sidebarAndContentHeight = function () {
    						var height = $('.page-sidebar').height() + 20,
    							headerHeight = $('.page-header').outerHeight(),
    							footerHeight = $('.page-footer').outerHeight();
    						if ($window.width() > 1024 && (height + headerHeight + footerHeight) < $window.height()) {
    							height = $window.height() - headerHeight - footerHeight;
    						}
    						$('.page-content').attr('style', 'min-height:' + height + 'px');
    					};
    				var $prevObj = null;
    				elem.on('click', 'li > a', function (e) {
    					var $this = $(this),
    						href = $this.attr('href'),
    						parent = $this.parent().parent(),
    						menuContainer = elem.parent().find('ul'),
    						sub = $this.next(),
    						autoScroll = attrs["autoScroll"] ? attrs["autoScroll"] : true,
    						slideSpeed = attrs["slideSpeed"] ? parseInt(attrs["slideSpeed"]) : 200,
    						slideOffeset = -200,
    						pageBreadcrumbDatas = [];
    					if ($this.hasClass('open')) {
    						return false;
    					}
    					parent.children('li.open').children('a').children('.arrow').removeClass('open');
    					parent.children('li.open').children('.sub-menu').slideUp(200);
    					parent.children('li.open').removeClass('open');

    					if (href.indexOf('javascript:') == -1) {
    						menuContainer.children('li.active').removeClass('active');
    						menuContainer.children('arrow.open').removeClass('open');
    						var url, title, href, $a;
    						if ($prevObj) {
    							$prevObj.removeClass('open active');
    							$prevObj.parents('li').each(function () {
    								$(this).removeClass('open active');
    							}) 
    						}
    						$this.parents('li').each(function () {
    							var $li = $(this);
    							$li.addClass('active').addClass('open').children('a > span.arrow').addClass('open');
    						});
    						
    						$this.parents('li').addClass('active');
    						elem.children('li.active').children('a').children('.selected').remove()
    							.end().children('.title').after('<span class="selected"></span>');
    						$prevObj = $this;

    						$timeout(function () {
    							var header = $this.find('.module-name').text().trim();
    							if (!header) {header = $this.find('.title').text().trim();}
    							$rootScope.header = header;
    						}, 500);
    						tabNavMenuFactory.hideAllTab && tabNavMenuFactory.hideAllTab();
    						//$rootScope.$apply();
    					} else {
    						if (sub.is(":visible")) {
    							$('.arrow', $this).removeClass("open");
    							$this.parent().removeClass("open");
    							sub.slideUp(slideSpeed, function () {
    								if (autoScroll == true && $body.hasClass('page-sidebar-closed') == false) {
    									scrollTo($this, slideOffeset);
    								}
    								sidebarAndContentHeight();
    							});
    						} else {
    							$('.arrow', $this).addClass("open");
    							$this.parent().addClass("open");
    							sub.slideDown(slideSpeed, function () {
    								if (autoScroll == true && $body.hasClass('page-sidebar-closed') == false) {
    									scrollTo($this, slideOffeset);
    								}
    								sidebarAndContentHeight();
    							});
    						}
    					}
    				})
    				return false;
    			}
    		}
    }])
	.factory('tabNavMenuFactory', function() {
		return { }
	})
	.directive('tabNavMenu', ['tabNavMenuFactory', function(tabNavMenuFactory) {
		return {
			replace: true,
			scope: {},
			template: ['<ul class="nav navbar-nav">',
							'<li class="classic-menu-dropdown" data-index="[[$index]]" ng-class="{active: item.active}" ng-repeat="item in tabNavList" >',
								'<a href="javascript:;" class="text-overflow tab-tag" ng-click="tabClick($index, null)">',
									'[[item.title || "标签 " + ($index + 1)]]',
								'</a>',
							'</li>',
						'</ul>'].join(''),
			link: function($scope, elem, attrs) {
				$scope.tabNavList = [];
				$scope.closeTab = function(index) {
					var tabNavList = $scope.tabNavList;
					if (index || index == 0) {
						close(index);
					} else {
						for (var i = tabNavList.length - 1; i >= 0; i--) {
							if (tabNavList[i].active) {
								close(i);
								break;
							}
						}
					}
					function close(index) {
						tabNavList[index].dom.remove();
						tabNavList[index].scope.$destroy();

						tabNavList.splice(index, 1);
						index = ( index - 1 ) < 0 ? 0 : index - 1;
						if (tabNavList[index]) {
							$scope.tabClick(index);
						}
					}
				}
				$scope.tabClick = function(index, isNew) {
					var tabNavList = $scope.tabNavList,
						item = $scope.tabNavList[index],
						show = function(tab) {
							tab.active = true;
							tab.dom.show().find(".view-scroll-box").scrollTop(0);
							tab.content.css({'opacity': 0}).show().animate({'opacity': 1}, 300);
						};
					//新建标签 隐藏所有 打开新建
					if (isNew) {
						init();
						return false;
					}
					//点击当前选中的tab 
					if (item.active && !isNew) {
						//并且是最后一个tab页 则关闭  last
						if (tabNavList.length - 1 == index) {
							$scope.closeTab(index);
						} else if (index == 0) { //是第一个就隐藏tab
							item.active = false;
							item.dom.hide();
						} else { //是中间就选取前一个tab
							item.active = false;
							item.dom.hide();
							show(tabNavList[index - 1]);
							//tabNavList[index - 1].active = true;
							//tabNavList[index - 1].dom.show();
						}
						return false;
					}
					init();
					function init() {
						for (var i = tabNavList.length - 1; i >= 0; i--) {
							var tab = tabNavList[i];
							if (tab.id == item.id) {
								//tab.active = true;
								//tab.dom.show();
								show(tab);
							} else {
								tab.active = false;
								tab.dom.hide();
							}
						}
					}
					return false;
				}
				$scope.hideAllTab = function() {
					var tabNavList = $scope.tabNavList;
					for (var i = tabNavList.length - 1; i >= 0; i--) {
						if (tabNavList[i].active) {
							tabNavList[i].active = false;
							tabNavList[i].dom.hide();
						}
					}
				}
				//绑定到service上
				tabNavMenuFactory.addTab = function(obj) {
					if (obj) {
						$scope.tabNavList.push(obj);
						$scope.tabClick($scope.tabNavList.length - 1, true);
					}
				};
				tabNavMenuFactory.removeTab = function(index) {
					if ($scope.tabNavList[index]) {
						$scope.closeTab(index);
					}
				};
				tabNavMenuFactory.selectedTab = function(index) {
					if ($scope.tabNavList[index]) {
						$scope.tabClick(index);
					}
				};
				tabNavMenuFactory.getTabNavList = function() {
					return $scope.tabNavList || [];
				};
				tabNavMenuFactory.hideAllTab = function() {
					$scope.hideAllTab();
				}
			}
		}
	}])
	//美化checkbox 和 radio
	.directive("input", function () {
        return {
            restrict : 'E',
            link : function (scope, elem, attrs) {
				if (elem.hasClass('not-render')) {
					return false;
				}
                var inputType = attrs['type'];
                if (inputType === 'checkbox') {
                    elem.wrapAll("<div class='checker'></div>").after("<span></span>");
                } else if (inputType == 'radio') {
					elem.wrapAll("<div class='radio'></div>").after("<span></span>");
				}
            }
        };
    })
	//点击选中
	.directive("clickSelected", function() {
		return function(scope, elem, attrs) {
			var className = attrs['className'] || 'active',
				children = elem.children(),
				selector = attrs['clickSelected'] || 'li'
			elem.on('click', selector, function(e) {
				 elem.children().removeClass(className);
				$(this).addClass(className);
				return false;
			})
		}
	})
	//标签
	.directive('tagsinput', ["$parse", function($parse) {
		return {
			restrict: 'EA',
			scope: {
				model: '=ngModel',
				data: '=data',
				disabled: '=disabled',
				change: '&'
			},
			template: '<input type="hidden" class="select2 form-control"/>',
			replace: true,
			link: function (scope, element, attrs) {
				var key = attrs['ngModel'];
				element.select2({
					multiple: true,
					query: function (query){
						var data = {results: []};
						$.each(scope.data, function(){
							if(query.term.length == 0 || this.text.toUpperCase().indexOf(query.term.toUpperCase()) >= 0 ){
								data.results.push({id: this.id, text: this.text });
							}
						});
						query.callback(data);
					}
				});
				
				var getter = $parse(key);
  				var setter = getter.assign;
				element.on("change", function(e) {
					//解决弹出框作用域问题
					/*try {
						setter(scope.$parent.$parent, element.select2('data'));
					} catch(e) {}*/
					if (angular.isFunction(scope.change)) {
						scope.change({'data': element.select2('data')});
					}
					scope.model = element.select2('data');
					scope.$apply();
				})
				if (!angular.isUndefined(scope.disabled)) {
					scope.watch('disabled', function(v) {
						element.select2("enable", v);
					})
				}
				element.select2('data', scope.model);
				scope.$watch('model', function(v) {
					element.select2("data", v);
				})
			}
		};
	}])
	//全局验证模板
    .directive("customValidate", function () {
        return {
            restrict : 'A',
            priority: 100,
            compile : function (elem, attrs) {
            	elem.attr('novalidate', true);
				var formName = elem.attr('name'),
					$inputs = elem.find("input,textarea,select"),
					hasError = false,
					customCondition = elem.attr('custom-condition');
				if (!formName) {
					return false;
				}
				for ( var i = 0, len = $inputs.length; i < len; i++ ){
					var $input = $($inputs[i]),
						inputType = $input.attr('type'),
						inputName = $input.attr("name"),
						nodeName = $input[0].nodeName;
						inputType = inputType ? inputType :  (nodeName == 'select' ? 'select' : (nodeName == 'textarea' ? 'textarea' : ''));
					if (validateObj.elemType.toString().indexOf(inputType) > -1){
						//查找验证属性
						var msg = '';
						for (var j = 0, vLen = validateObj.validateAttrs.length; j < vLen; j++) {
							var itemName = validateObj.validateAttrs[j];
							msg = $input.attr('error-' + itemName + '-msg') || $input.attr('error-msg');
							var attr = $input.attr(itemName);
							if (typeof attr !== 'undefined' && attr !== false) {
								var expression = validateObj.buildExpression(formName, inputName, itemName, $input);
								msg = msg || validateObj.defaultRules[itemName].replace('{0}', attr);
								addErrorText($input, expression, msg);
								//$input.after(validateObj.buildErrorElement(expression, ));
								hasError = true;
							}
						}
						//邮箱验证特别的 只要指定type
						if (inputType == 'email') {
							var itemName = inputType;
							var expression = validateObj.buildExpression(formName, inputName, itemName, $input);
							addErrorText($input, expression,  validateObj.defaultRules[itemName]);
							hasError = true;
						}
						//自定义错误信息
						var attr = $input.attr('bind-error');
						if (typeof attr !== 'undefined' && attr !== false) {
							addErrorText($input, attr, msg || '[[' + attr + ']]');
						 	validateObj.formGroupExpression += attr;
						 	addErrorClass($input, validateObj);
						}
						//对form-group 添加class
						if (hasError) {
							validateObj.formGroupExpression += ')';
							addErrorClass($input, validateObj);
						}
						validateObj.formGroupExpression = '';
						hasError = false;
					} 
					/*else if (typeof customCondition !== 'undefined' && customCondition !== false) {
						//只包含自定义错误
						var expression = validateObj.formGroupExpression = formName + '.submit && ' + customCondition;
						var attr = $input.attr('bind-error');
						if (typeof attr !== 'undefined' && attr !== false) {
							addErrorText($input, expression, '[[' + attr + ']]');
						 	addErrorClass($input, validateObj);
						}
					}*/
				}
				function addErrorText($input, expression, errorMsg) {
					var parent = $input.parent();
					var hasDatepicker = $input.attr('datepicker');
					if (typeof hasDatepicker !== typeof undefined && hasDatepicker !== false) {
						return;
					}
				 	if (parent.hasClass('input-group')) {
				 		parent.after(validateObj.buildErrorElement(expression, errorMsg));
				 	} else {
						$input.after(validateObj.buildErrorElement(expression, errorMsg));
				 	}
				}
				function addErrorClass($input, validateObj) {
					var parent = $input.parent();
				 	if (parent.hasClass('input-group')) {
				 		parent.parent().attr("ng-class","{'has-error':" + validateObj.formGroupExpression + "}");
				 	} else {
				 		parent.attr("ng-class","{'has-error':" + validateObj.formGroupExpression + "}");
				 	}
				}
            }
        };
    })
	//拖拽排序
	.directive('dragsort', function() {
		return  {
			restrict : 'A',
			scope : {
				change : '&',
				destroy: '='
			},
		    link: function(scope, elem, attrs) {
				var selector = attrs['dragsort'] || 'li',//'
					className = attrs['className'] || '',
					temp = '<' + selector + ' class="border-dash ' + className + '"></' + selector + '>';
				var templateId = attrs['dragTemplate'], html = $('#' + templateId).html();
				if (html) {
					temp = html;
				}

				function initSort() {
					elem.dragsort({ 
						dragSelector: selector + ':not(.not-dragsort)', 
						dragSelectorExclude: 'input, textarea, .not-dragsort-click', 
						itemSelector: selector + ':not(.not-dragsort)', 
						dragEnd: saveOrder, 
						dragBetween: true, 
						placeHolderTemplate:temp 
					});
					function saveOrder() {
						if (angular.isFunction(scope.change)) {
							var children = elem.children();
							var data = children.map(function() { 
								return $(this).attr('data-sid')
							}).get();
							var index = children.map(function() { 
								return $(this).attr('data-index')
							}).get();
							scope.change({'data': data, 'index': index});
						}
					};
				}
				scope.$watch('destroy', function(v) {
					if (v) {
						elem.dragsort("destroy");
					} else {
						initSort();
					}
				})
			}
		}
	})
	//拖拽
	.directive('nestable', function() {
		return {
			restrict : 'A',
			scope : {
				change : '&',
			},
			link : function(scope, elem, attrs) {
				var maxDepth = parseInt(attrs['maxDepth']) || 1,
					group = parseInt(attrs['group']) || 0,
					listName = attrs['listName'] || 'ol',
					itemName = attrs['itemName'] || 'li';
				elem.addClass('dd').children(listName).addClass('dd-list').children(itemName).addClass('dd-item');
				elem.nestable({
					'maxDepth' : maxDepth,
					'group' : group,
					'listNodeName' : listName,
					'itemNodeName' : itemName
				}).on('change', function(e) {
					var list   = e.length ? e : $(e.target);
					if (angular.isFunction(scope.change)) {
						scope.change({ data : list.nestable('serialize') });
					}	
				});
			}
		}
	})
	.directive("jstree", function() {
		return {
			restrict: 'A',
			scope: {
				'selectedItem': '=',
				'delay': '='
			},
			link: function(scope, elem, attrs) {
				if (!scope.delay) {
					initJstree();
				} else {
					scope.$watch('delay', function(v) {
						if (!v) {
							initJstree();
						}
					})
				}
				function initJstree () {
					setTimeout(function() {
						elem.jstree({
							"plugins" : ["checkbox","html_data" ],
						});
					}, 0);
					elem.on("changed.jstree", function (e, data) {
						scope.selectedItem = data.selected;
						scope.$apply();
					});
				}
			}
		}
	})
	.directive("jstreeSelected", function() {
		return {
			scope: {
				jstreeSelected: '='
			},
			link: function (scope, elem, attrs) {
				if (scope.jstreeSelected) {
					elem.attr("data-jstree", '{"selected": true}')
				}
			}
		}
	})
	.directive('dropdownHover', function() {
		return function(scope, elem, attrs) {
			elem.dropdownHover({ delay: 0});
		}
	})
	.directive('dropdownToggle', function() {
		return {
			restrict : 'C',
			link: function(scope, elem, attrs) {
				elem.dropdown();
			}
		}
	})
	.directive('select2', ["$parse", function($parse) {
		return {
			restrict : 'EA',
			template: '<input type="hidden" class="form-control"/>',
			replace: true,
			scope: {
				option: '=',
				ngModel: '=',
				change: '&'
			},
			link: function(scope, elem, attrs) {
				var model = attrs['ngModel'];
				var getter = $parse(model);
  				var setter = getter.assign;

				scope.$watch('option.data.length', function(v) {
					if (v) {
						elem.select2(scope.option || {}).on('change', function(e) {
							scope.ngModel = e.val;
							//解决弹出框的作用域问题
							try {
								setter(scope.$parent.$parent, e.val);
							} catch(e) {}
							if (angular.isFunction(scope.change)) {
								scope.change({data: e});
							}
							scope.$apply();
						})
					}
				})	
				scope.$watch('ngModel', function(v) {
					elem.select2("val", v);
				})
			}
		}
	}])
	//手机号验证
	.directive("mobile", ["commonApi", function (commonApi) {
		return {
			restrict: "A",
			require: 'ngModel',
			link: function (scope, elem, attrs, ctrl) {
				ctrl.$parsers.push(function (v) {
					if (commonApi.MOBILE_REG.test(v)) {
						ctrl.$setValidity('mobile', true);
						return v;
					} else {
						ctrl.$setValidity('mobile', false);
						return undefined;
					}
				})
			}
		}
    }])
    .directive("rgbcolor", ["commonApi", function (commonApi) {
		return {
			restrict: "A",
			require: 'ngModel',
			link: function (scope, elem, attrs, ctrl) {
				ctrl.$parsers.push(function (v) {
					if (commonApi.COLOR_REG.test(v)) {
						ctrl.$setValidity('rgbcolor', true);
						return v;
					} else {
						ctrl.$setValidity('rgbcolor', false);
						return undefined;
					}
				})
			}
		}
    }])
    .directive("requiredselect", ["commonApi", function (commonApi) {
		return {
			restrict: "A",
			scope: {
				ngModel: '=',
				requiredselect: '='
			},
			require: 'ngModel',
			link: function (scope, elem, attrs, ctrl) {
				if (elem[0].nodeName == 'SELECT') {
					var val = scope.requiredselect || -1;
					scope.$watch('ngModel', function(v) {
						if (angular.isObject(v) && v.id == val) {
							ctrl.$setValidity('requiredselect', false);
							return v;
						} else {
							ctrl.$setValidity('requiredselect', true);
							return v;
						}
					})
				}
			}
		}
    }])
    //餐厅联系方式验证
	.directive("rphone", ["commonApi", function (commonApi) {
		return {
			restrict: "A",
			require: 'ngModel',
			link: function (scope, elem, attrs, ctrl) {
				function vaildate(v) {
					if ( v == "" ){
						ctrl.$setValidity('rphone', true);
						return v;
					}
					if (commonApi.RESTAURANT_PHONE_REG.test(v)) {
						ctrl.$setValidity('rphone', true);
						return v;
					} else {
						ctrl.$setValidity('rphone', false);
						return undefined;
					}
				}
				ctrl.$parsers.push(vaildate);
				setTimeout(function() {vaildate(elem.val()) },0)
			}
		}
    }])
	//email验证
	.directive("email", ["commonApi", function (commonApi) {
		return {
			restrict: "A",
			require: 'ngModel',
			link: function (scope, elem, attrs, ctrl) {
				ctrl.$parsers.push(function (v) {
					if (commonApi.EMAIL_REG.test(v)) {
						ctrl.$setValidity('email', true);
						return v;
					} else {
						ctrl.$setValidity('email', false);
						return undefined;
					}
				})
			}
		}
    }])
	//数字验证
	.directive("number", ["commonApi", function (commonApi) {
		return {
			restrict: "A",
			require: 'ngModel',
			link: function (scope, elem, attrs, ctrl) {
				ctrl.$parsers.push(function (v) {
					if (commonApi.NUMBER_REG.test(v)) {
						ctrl.$setValidity('number', true);
						return v;
					} else {
						ctrl.$setValidity('number', false);
						return undefined;
					}
				})
			}
		}
    }])
    //整数
    .directive("interger", function () {
    	return {
    		restrict: "A",
    		require: 'ngModel',
    		link: function (scope, elem, attrs, ctrl) {
    			ctrl.$parsers.push(function (v) {
    				if(parseInt(v) == v){
    					ctrl.$setValidity('interger', true);
    					return parseInt(v);
    				} else {
    					ctrl.$setValidity('interger', false);
    					return undefined;
    				}
    			})
    		}
    	}
    })
    //姓名
    .directive("username", ["commonApi", function (commonApi){
    	return {
    		restrict: "A",
    		require: 'ngModel',
    		link: function (scope, elem, attrs, ctrl) {
    			ctrl.$parsers.push(function (v) {
    				if (commonApi.NAME.test(v)||!v) {
						ctrl.$setValidity('username', true);
						return v;
					} else {
						ctrl.$setValidity('username', false);
						return undefined;
					}
    			})
    		}
    	}
    }])
    //支付宝账号
    .directive("alipaycard", ["commonApi", function (commonApi){
    	return {
    		restrict: "A",
    		require: 'ngModel',
    		link: function (scope, elem, attrs, ctrl) {
    			ctrl.$parsers.push(function (v) {
    				if (commonApi.MOBILE_REG.test(v)||commonApi.EMAIL_REG.test(v)) {
						ctrl.$setValidity('alipaycard', true);
						return v;
					} else {
						ctrl.$setValidity('alipaycard', false);
						return undefined;
					}
    			})
    		}
    	}
    }])
    //最大值
	.directive("maxval", ["commonApi", function (commonApi) {
		return {
			restrict: "A",
			require: 'ngModel',
			link: function (scope, elem, attrs, ctrl) {
				//判断是否是数字
				var maxVal = attrs['maxval'];
				if (isNaN(maxVal)) {return false}
				ctrl.$parsers.push(function (v) {
					v = parseFloat(v);
					if (v <= maxVal) {
						ctrl.$setValidity('maxval', true);
						return v;
					} else {
						ctrl.$setValidity('maxval', isNaN(v));
						//ctrl.$setValidity('maxval', false);
						return undefined;
					}
				})
			}
		}
    }])
    .directive("minval", ["commonApi", function (commonApi) {
		return {
			restrict: "A",
			require: 'ngModel',
			link: function (scope, elem, attrs, ctrl) {
				//判断是否是数字
				var minVal = attrs['minval'];
				if (isNaN(minVal)) {return false}
				ctrl.$parsers.push(function (v) {
					v = parseFloat(v);
					if (v >= minVal) {
						ctrl.$setValidity('minval', true);
						return v;
					} else {
						ctrl.$setValidity('minval', isNaN(v));
						return undefined;
					}
				})
			}
		}
    }])
    .directive("money", ["commonApi", function (commonApi) {
		return {
			restrict: "A",
			require: 'ngModel',
			link: function (scope, elem, attrs, ctrl) {
				//判断是否是数字
				var val = attrs['money'];
				val = isNaN(val) ? 4 : val;
				val = val || 4;
				var reg = new RegExp('^-?\\d{1,' + val + '}(\\.\\d{0,2})?$');
				ctrl.$parsers.push(function (v) {
					if (reg.test(v)) {
						ctrl.$setValidity('money', true);
						return v;
					} else {
						ctrl.$setValidity('money', false);
						return undefined;
					}
				})
			}
		}
    }])
	//限制数字输入
	.directive("onlyNumber", function() {
		return function(scope, elem, attrs) {
			var num = parseInt(attrs['onlyNumber']);
			var maxVal = parseInt(attrs['maxVal']);
			var minVal = parseInt(attrs['minVal']);
			var decimal = 1;
			if (num || num == 0) {
				decimal = num;
			} else {
				decimal = 2;
			}
			var element = elem[0];
			var reg = new RegExp('^-?\\d{1,4}(\\.\\d{0,2})?$'),
				filterReg = new RegExp('^-?\\d{1,4}(\\.\\d{0,2})?');
			elem.on('keyup', function(){
			    if (!reg.test(element.value)) {
			    	var arr = filterReg.exec(element.value);
			    	element.value = arr ? arr[0] : '';
			    }
			    return false;
			})
		}
	})
	//文件上传
	.directive("fileUpload", ['uploadRequest', function(uploadRequest) {
		return {
			scope: {
				fileUpload: '&'
			},
			link: function(scope, elem, attr) {
				elem.on('change', function(e){
					var files = this.files;
					if (angular.isFunction(scope.fileUpload)) {
						if (!scope.fileUpload({'files': files})) {
							setTimeout(function() {elem.val('')}, 1000);
						}
					}
				})
			}
 		}
	}])
	//自定义滚动条
	.directive('slimscroll', ['globalValue', function(globalValue){
		return {
			scope: {
				event: '=',
				scroll: '&'
			},
			link: function(scope, element, attrs) {
				var height = attrs['slimscroll'] || '100%';
				element.slimScroll({height: height})
				element.slimScroll().bind('slimscroll', function(e, pos){
    				if (angular.isFunction(scope.scroll)) {
    					scope.scroll({'e': e, 'pos': pos})
    				}
				});
				if (scope.event) {
					scope.event = {
						scrollTo: function(to) {
							element.slimScroll({ height: height, scrollTo: to +'px' });
						}
					}
				}
			}
		}
	}])
	//滚动一定距离后更改为fixed
	.directive("scrollPositionFixed", function () {
		return function (scope, elem, attrs) {
			var top = parseInt(attrs['scrollPositionFixed']),
				className = "scroll-position-fixed";
			if (isNaN(top) || top < 0) {
				top = 0;
			}
			elem.closest(".view-scroll-box").on('scroll', function () {
				var scrollTop = $(this).scrollTop();
				if (scrollTop > top) {
					elem.css({
						'position': 'fixed',
						'top': 70
					}).addClass(className);
				} else {
					elem.css({
						'position': 'relative',
						'top': 0
					}).removeClass(className);
				}
			})
		}
	})
	//日期
	.directive("datepicker", ["commonApi", "$parse", function (commonApi, $parse) {
		return {
			restrict: "A",
			scope: {
				ngModel: '=',
				options: '=',
				changeDate: '&'
			},
			link: function (scope, elem, attrs) {
				/*daysOfWeekDisabled: '=', //'0,1,2,3,4,5,6' 一周中那天禁选
				startView: '=', //0:hour 1:day 2:month 3:year 4:decade
				minView : 
				maxView
				startDate: '=',
				endDate: '=',
				autoclose: '=',
				multidate: '='
				minuteStep: ''
				showMeridian: false //分隔
				*/
				var asyn = attrs['asyn'];
				var loadDatePicker = function() {
					var isFirst = true;
					var attr = attrs["ngModel"];
					scope.$watch("options.startDate", function(v) {
						!isFirst && elem.datetimepicker('setStartDate', v);
					});
					scope.$watch("options.endDate", function(v) {
						!isFirst && elem.datetimepicker('setEndDate', v);
					});
					//初始化
					var defaultOptions = {
						format: 'yyyy-mm-dd',
						language: 'zh-CN',
						keyboardNavigation: false,
						todayHighlight: true,
						autoclose : true,
						minView : 2 ,
						clearBtn: true
					};
					var options = defaultOptions;
					if (angular.isObject(options)) {
						for (var item in scope.options) {
							options[item] = scope.options[item];
						}
					}
					elem.datetimepicker(options);

					var getter = $parse(attr);
	  				var setter = getter.assign;

					elem.on('changeDate', function(e) {
						//var date = moment(e.date).format("YYYY-MM-DD");
						var date = elem.val();
						//防止弹出层
						try {
							setter(scope.$parent.$parent, date);
						} catch(e) {}
						if (angular.isFunction(scope.changeDate)) {
							setTimeout(function() {
								scope.changeDate({'value': date})
							});
						}
						scope.ngModel = date;
					});
					scope.$watch('ngModel', function(v) {
						//elem.val(v);
						//elem.datetimepicker('update');
						elem.datetimepicker("update", v);
					})
					isFirst = false;
				}
				if (asyn) {
					var time = isNaN(asyn) ? 1 : parseInt(time);
					setTimeout(function() {
						loadDatePicker();
					}, time);
				} else {
					loadDatePicker();
				}
			}
		}
    }])
	.directive("tooltips", function () {
		return {
			restrict: "AC",
			link: function (scope, elem, attrs) {
				if (!elem.hasClass('tooltips')) {
					elem.addClass('tooltips');
				}
				elem.tooltip({container: 'body'});
			}
		}
    })
	.directive("popover", function () {
		return {
			restrict: "AC",
			link: function (scope, elem, attrs) {
				elem.popover({
					placement : attrs['placement'] || 'bottom',
					title : attrs['title'] || '',
					content : attrs['content'] || '',
					container : 'body',
					trigger : attrs['trigger'] || 'hover'
				})
			}
		}
    })
	.directive("loadingBtn", function(){
		return {
			restrict: 'A',
			scope: {
				loadingBtn: '='
			},
			link: function(scope, elem, attrs) {
				var innerHtml = elem.html(), 
					timeVal = '', 
					loadingBtn = attrs['loadingBtn'] || '',
					loadingText = attrs['loadingText'] || 'Loading...',
					isWatch = false;
					if (loadingBtn !== '') {
						//判断是否双向绑定了 scope 没有绑定就计时
						isWatch = !angular.isNumber(loadingBtn);
					}
				if (isWatch) {
					scope.$watch("loadingBtn", function(v) {
						if (v) {
							elem.addClass('disabled').attr('disabled', true).text(loadingText);
						} else {
							elem.removeClass('disabled').removeAttr('disabled').html(innerHtml);
						}
					})
				} else {
					elem.on('click', function() {
						clearTimeout(timeVal);
						elem.addClass('disabled').attr('disabled', true).text(loadingText);
						timeVal = setTimeout(function() {
							elem.removeClass('disabled').removeAttr('disabled').html(innerHtml);
						}, scope.loadingBtn || 1000);
					})
				}
			}
		}
	})
	.directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        };
	})
	.directive("tab", function() {
		return {
			restrict: 'EA',
			compile: function(elem, attrs) {
				var selectIndex = attrs['selectedIndex'] || 0,
					className = attrs['tab'] || 'tabbable-custom',
					tabChange = attrs['tabChange'],
					$children = elem.children(),
					tabNav = '',
					curTitle = '',
					ngClick = '',
					tabContent = $('<div class="tab-content"></div>'),
					bulidTabNav = function() {
						for (var i = 0, len = $children.length; i < len; i++) {
							ngClick = '';
							curTitle = $($children[i]).addClass('tab-pane').attr('data-title');
							if (curTitle) {
								if (tabChange) {
									ngClick = 'ng-click="' + tabChange + '(\'' + curTitle + '\', ' + i + ')"';
								}
								tabNav += '<li><a href="javascript:;" ' + ngClick + '>' + curTitle + '</a></li>'
							}
						}
						tabNav = '<ul class="nav nav-tabs">' + tabNav + '</ul>';
					};
				
				bulidTabNav();
				tabContent.append($children);
				elem.addClass(className).append(tabNav).append(tabContent);
				$children = elem.children();
				var $nav = $($children[0]), $content = $($children[1]);
				$nav.children().eq(selectIndex).addClass('active');
				$content.children().eq(selectIndex).addClass('active');
				return {
          			pre: function (scope, iElement, iAttrs){
		  				iElement.on('click', '.nav-tabs>li', function(e) {
							var $this = $(this), $ul = $this.parent(), index = $ul.children().removeClass('active').index(this);
							$(this).addClass('active');
							$ul.next().children().removeClass('active').eq(index).addClass('active');
						})
		  			}
				}
			}
		}
	})
	.directive('accordion', ["commonApi", function(commonApi) {
		return {
			restrict: 'EA',
			compile: function(elem, attrs) {
				var selectIndex = parseInt(attrs['selectedIndex']) || 0,
					panelClass = attrs["panel-class"] || 'panel-default',
					$children = elem.children(),
					$curHead = null,
					$curBody = null;
				
				for (var i = 0, len = $children.length; i < len; i++) {
					var collapseClass = 'panel-collapse collapse',
						random = 'accordion_' + commonApi.getRandomVal(5),
						$curChild = $($children[i]),
						$curHead = $curChild.children().first(),
						$curBody = $curHead.next();
					$curHead.addClass("panel-heading").html('<h4 class="panel-title">' +
						  '<a class="accordion-toggle" data-toggle="collapse" href="#' + random + '"> ' + $curHead.html() + ' </a></h4>');
					if (selectIndex == i || selectIndex == -1) {
						collapseClass += ' in';
					}
					$curBody.attr("id", random).css('height', 'auto').addClass(collapseClass).html('<div class="panel-body">' + $curBody.html() + '</div>')
					$curChild.addClass("panel " + panelClass);
				}
				elem.addClass('panel-group accordion');
				elem.collapse();
			}
		}
	}])
	.directive('toggleSilde', function() {
		return function(scope, elem, attrs) {
			elem.on('click', function() {
				$(this).parent().next().slideToggle(200);
			})
		}
	})
	.directive('pager', function(){
        return{
            restrict: "E",
            replace: true,
            scope: {
            	pageChange: '&?',
            	toggle: '&?', //分页显示隐藏时调用
            	total : '=?',
            	ngModel: '=?'
            },
            template: '<ul class="pagination"></ul>',
            link: function(scope, elem, attrs){
                var num = parseInt(attrs['show']) || 2;
                if (scope.ngModel && isNaN(scope.ngModel)) {
                	scope.ngModel = parseInt(scope.ngModel)
            	} else {
            		scope.ngModel = 1;
            	}

                if (!angular.isFunction(scope.toggle)) {
                	scope.toggle = function() {};
                }
                function bulidPager(curPage, total, num) {
                	 if(scope.total <= 1){
	                    elem.hide();
	                    scope.toggle({'status': false});
	                    return false;
	                } else {
	                	elem.show();
	                	scope.toggle({'status': true});
	                }
	                var prevPage = true ,
                    	nextPage = true,
                	 	html = '',
            	 	 	page = 0 ;
            	 	 total = parseInt(total);
	                if(curPage <= 1){
	                    curPage = 1;
	                    prevPage = false;
	                }
	                if(curPage >= total){
	                    curPage = total;
	                    nextPage = false;
	                }
	                for(var i = num; i >= 1 ; i--){
	                    page = curPage - i;
	                    if(page < 1){
	                        continue;
	                    }
	                    else{
	                        html += '<li title="第' + page + '页"><a data-page="' + page + '" href="javascript:;">' + page + '</a></li>';
	                    }
	                }
	                html += '<li class="active"><a href="javascript:;">' + curPage + '</a></li>';
	                for(i = 1; i <= num; i++){
	                    page = i + curPage;
	                    if(page > total){
	                        break;
	                    }
	                    html += '<li title="第' + page + '页"><a data-page="' + page + '" href="javascript:;">' + page + '</a></li>';
	                }

	                if(prevPage){
						html = '<li class="first" title="上一页"><a data-page="' + (curPage - 1) + '" href="javascript:;"><i class="fa fa-angle-left"></i></a></li>' + html
	                }else{
	                    html = '<li class="first disabled" title="上一页"><a href="javascript:;"><i class="fa fa-angle-left"></i></a></li>' + html;
	                }

	                if(curPage == 1){
	                    html = '<li class="prev disabled" title="首页"><a href="javascript:;">« 首页</a></li>' + html;
	                }else{
	                    html = '<li class="prev" title="首页"><a data-page="1" href="javascript:;">« 首页</a></li>' + html;
	                }

	                if(nextPage){
						html = html + '<li class="next"  title="下一页"><a data-page="' + (curPage + 1) + '" href="javascript:;"><i class="fa fa-angle-right"></i></a></li>'
	                }else{
	                    html = html + '<li class="next disabled" title="下一页"><a href="javascript:;"><i class="fa fa-angle-right"></i></a></li>';
	                }

	                if(curPage == total){
	                    html = html + '<li class="last disabled" title="尾页"><a href="javascript:;">尾页 »</a></li>';
	                }else{
	                    html = html + '<li class="last" title="尾页"><a data-page="' + total + '" href="javascript:;">尾页 »</a></li>';
	                }
	                elem.html(html);
            	}
            	scope.$watch('total + ngModel', function(v) {
            		bulidPager(scope.ngModel, scope.total, num);
            	})
            	/*scope.$watch('ngModel', function(v) {
            		bulidPager(v, scope.total, num);
            	})*/
                elem.on('click', "a[data-page]", function() {
                	var $this = $(this), pageIndex = $this.attr('data-page');
                	pageIndex = isNaN(pageIndex) ? 1 : parseInt(pageIndex);
                	if (angular.isFunction(scope.pageChange)) {
                		scope.pageChange({'page': pageIndex});
                	}
                	scope.ngModel = pageIndex;
                	scope.$apply();
                })
            }
        }
    })
	.directive('sortHead', function() {
		return {
			restrict: 'A',
			scope: {
				sortHead: '&'
			},
			link: function(scope, elem, attrs) {
				var sortField = elem.find('th[field-name]');
				sortField.addClass('sort-field');
				elem.on('click', '[field-name]', function() {
					var $this = $(this), isAsc = $this.hasClass('sorting_asc'), isDesc = $this.hasClass('sorting_desc');
					var action = '', fieldName = $this.attr('field-name');
					if (!fieldName) {return false}
					sortField.removeClass('sorting_asc sorting_desc');
					if (isAsc) {
						$this.addClass('sorting_desc');
						action = 'desc';
					} else if (isDesc){
						$this.addClass('sorting_asc');
						action = 'asc';
					} else {
						$this.addClass('sorting_asc');
						action = 'asc';
					}
					if (angular.isFunction(scope.sortHead)) {
						var name = (action == 'asc' ? '' + fieldName : '-' + fieldName);
						scope.sortHead({'name': name, 'fieldName': fieldName, 'type': action});
					}
				})
			}
		}
	})
	.directive('openTabTag', ["$rootScope", "$compile", "tools", "storageBase", "commonApi", "getRouteData", "tabNavMenuFactory",
			function($rootScope, $compile, tools, storageBase, commonApi, getRouteData, tabNavMenuFactory) {
			return {
				restrict: 'A',
				link: function(scope, elem, attrs) {
					var href = attrs['href'], 
						triggleType = 'click', 
						title = attrs['openTabTag'],
						isReload = attrs['reload'] == '1' ? true : false,
						id = "modal_" + (Math.random() + '').slice(3),
						tempHref = href,
						tabNavList = tabNavMenuFactory.getTabNavList(),
						getRouteDataFunc = function() {
							var i = 0, tabLen = tabNavList.length;
							$rootScope.isLoading = true;
							getRouteData(tempHref).then(function(obj) {
								var $tab = $('<div class="tab-container"></div>'), tabObj;
								$tab.html(obj.content);
								if (isReload && tabLen > 0) {
									for (var i = 0; i < tabLen; i++) {
										if (tabNavList[i].active) {
											var $content = $tab.children('.view-scroll-box');
											tabNavList[i].dom.replaceWith($tab);
											$content.css({'opacity': 0}).animate({'opacity': 1}, 300)

											tabNavList[i].dom = $tab;
											tabNavList[i].content = $content;
											tabNavList[i].href = tempHref;
										}
									}
								} else {
									$("#viewScrollBox").append($tab);
									tabObj = { 'id': id, 'title': title, 'active': true, scope: obj.scope, href: tempHref, dom: $tab, content: $tab.children('.view-scroll-box') };
									tabNavMenuFactory.addTab(tabObj);
								}
								$rootScope.isLoading = false;
							}, function(d) {
								//tools.serverError(d);
								$rootScope.isLoading = false;
							})
						};
					if (href) {
						elem.on(triggleType, function() {
							//判断是否小屏幕 小屏幕直接跳转不走下面逻辑
							if (commonApi.IS_SMALL_SCREEN) {
								return true;
							}
							//是否有配置了新页面打开 配置了直接打开新页面
							if (storageBase.get2format('config', 'user').tabTagType == 'target') {
								['?model=tab', '&model=tab'].forEach(function(v) {
									href = href.replace(v, '');
								})
								href = href + (href.indexOf('?') != -1 ? '&' : '?') + 'model=tab';
								window.open(href, "_blank");
								return false;
							}
							//是否有reload属性 如有直接刷新本页面到指定url
							if (isReload) {
								//替换缓存的数据
								getRouteDataFunc();
								return false;
							}

							for (var i = tabNavList.length - 1; i >= 0; i--) {
								var tab = tabNavList[i];
								if (tab.id === id) { 
									$rootScope.$apply(function() {
										tabNavMenuFactory.selectedTab(i);
									});
									return false;
								}
							}
							if ((document.documentElement.clientWidth - 430 - tabNavList.length * 135 - 135) < 0) {
								tools.notification.warning('标签已超过您游览器宽度上限，请关闭一些标签后再打开。');
								return false;
							}
							getRouteDataFunc();
							return false;
							//打开tab页面
							try {
								var tabObj = {}, 
									cacheObj = null;
								//已存在调用缓存
								for (var i = root.tabCache.length - 1; i >= 0; i--) {
									if (tabContainer.children('#' + id)[0]) { 
										cacheObj = root.tabCache[i];
										break;
									}
								}
								if (cacheObj) {
									tabObj = cacheObj;
								} else {
									var index = root.tabCache.length;
									if ((document.documentElement.clientWidth - 430 - index * 135 - 135) < 0) {
										tools.notification.warning('标签已超过您游览器宽度上限，请关闭一些标签后再打开。');
										return false;
									}
									modal = $compile('<div class="bootbox bootbox-alert modal modal-mx" id="' + id + '">'+
											'<div>'+
												'<div class="modal-content">'+
													'<div class="modal-body ng-scope">'+
														'<iframe src="' + href + '" scrolling="no" frameborder="0"></iframe>'+
													'</div>'+
												'</div>'+
											'</div>'+
										'</div>')(scope);
									
									//tabContainer.append(modal);
									tabObj = { 'id': id, 'title': title, 'active': true, 'href': href, 'dom': tabContainer.find('#' + id) };
									root.tabCache.push(tabObj);
								}
								root.tabClick(tabObj, true);
								root.$apply();
								return false;
							} catch(e) {
								tools.notification.error('未知错误，请刷新页面后重试');
							}
						})
					}
				}
			}
	}])
	.directive('zoomIn', function() {
		return {
			compile: function(elem, attrs) {
				var cloneElem = elem.clone(),
					offset = parseInt(attrs['zoomOffset']) || 30,
					scalc = parseInt(attrs['zoomIn']) || 2;
				var calcOffset = (offset * scalc - offset) / 2;
				cloneElem.removeAttr('zoom-in');
				elem.after(cloneElem);
				cloneElem.css({'transition': 'all .3s ease', 
					'zIndex': 1000, 
					'position': 'absolute', 
					'marginLeft': (calcOffset + 10) + 'px',
					'marginTop':  (calcOffset / 2 ) + 'px',
					'visibility': 'hidden',
					'opacity': 0
				});
				return function(scope, elem, attrs) {
					var cloneElem = elem.next();
					elem.hover(function() {
						var obj = {'transform': 'scale(' + attrs['zoomIn'] + ')', 'zIndex' : 1001, 'opacity': 1, 'visibility': 'visible'}
						cloneElem.css(obj);
					}, function() {
						cloneElem.css({'transform': 'scale(1)', 'opacity': 0, 'zIndex' : 1000, 'visibility': 'visible'});
					})
				}
			}
		}
	})
	//向导管理
	.directive('wizard', ['includeUrl', function(includeUrl) {
		return {
			restrict: 'EA',
			transclude: true,
			replace: true,
			scope: {
				event: '=',
				config: '='
			},
			templateUrl: includeUrl + 'wizard.html',
			controller: function($scope, $element) {
				setTimeout( function() {
					var panels = $element.find('.tab-panel');
					$scope.$apply(function() {
						$scope.itemCount = $element.find('.tab-panel').length;
						$scope.progress = { 'width' : 100 / $scope.itemCount + '%'};
						$scope.contentStyle = {'width' : 100 * $scope.itemCount + '%'};
					})
					panels.css('width', 100 / $scope.itemCount + '%')
				})
				
				$scope.currentPosition = 0;

				$scope.stepList = []; //导航
				this.addItem = function(title) {
					$scope.stepList.push({text: title});
				}
				$scope.event = $scope.event || {}
				function change() {
					$scope.contentStyle.marginLeft = $scope.currentPosition * 100 * -1 + '%';
					$scope.progress = { 'width' : (100 / $scope.itemCount) * ($scope.currentPosition + 1) + '%'};
				}
				$scope.event.next = function() {
					$scope.currentPosition += 1;
					change();
				}
				$scope.event.prev = function() {
					$scope.currentPosition -= 1;
					change();
				}
			}
		}
		/*
			config: {
				hideHeader: 
				hideProgress:
			}
			event: {
				next()
				prev()
			}
			<wizard event="wizard.event" config="wizardConfig">
				<wizard-item title="第一步：设置活动">
				</wizard-item>
				<wizard-item title="第二步：完善活动信息">
				</wizard-item>
			</wizard>
		*/
	}])
	.directive('wizardItem', ['tools', function(tools) {
		return {
			restrict: 'E',
			require: '^?wizard',
			replace: true,
			transclude: true,
			template: '<div class="tab-panel" ng-transclude ng-style="itemStyle"></div>',
			link: function(scope, elem, attrs, wizardCtrl) {
				var itemTitle = attrs['title'];
				if (itemTitle) {
					wizardCtrl.addItem(attrs['title']);
				}
			}
		}
	}])
	.directive('asynGetInfo', ['tools', '$compile', function(tools, $compile) {
		return {
			scope: {
				asynGetInfo: '@',
				item: '=',
				getData: '&'
			},
			link: function($scope, elem, attrs) {
				elem
					.css('position', 'relative')
					.append('<div style="width:100px" class="ajax-loading left-triangle display-none asyn-get-info"></div>');
				var html = $('#' + attrs.asynGetInfo).html();
				var content = elem.children('.ajax-loading');
				elem.on('mouseenter', function() {
					$(".asyn-get-info").hide();
					content.show();
					if (!elem.attr('asyn-get-info')) {
						return false;
					} else {
						if (angular.isFunction($scope.getData)) {
							//$scope.detail = $scope.getData({'item': $scope.item});
							$scope.getData({'item': $scope.item}).then(function(d) {
								$scope.detail = d;
								elem.removeAttr('asyn-get-info');
								content
									.removeAttr('style')
									.removeClass('ajax-loading display-none')
									.append($compile(html)($scope));
							}, function(d) {
								tools.serverError(d);
							})
						}
					}
				})
				elem.parent().on("mouseleave", function() {
					content.hide();
				})
			}
		}
	}])
	//同意表格
	.directive('gridTable', ['tools', '$compile', 'basicData', 'includeUrl', 'browser', 'commonApi',
		function(tools, $compile, basicData, includeUrl, browser, commonApi) {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			templateUrl: includeUrl + 'tableTemplate.html',
			scope: {
				grid_options: '=gridOptions',
				grid_data: '=gridData',
				total: '=totalPage',
				page_change: '&pageChange',
				cur_page: '=page',
				order_by: '&orderBy',
				page_offset: '=pageOffset',
				repeat_class: '@repeatClass',
				checkbox: '=',
				checkbox_show: '@checkboxShow',
				repeat_init: '&repeatInit',
				search_data: '=filter',
				scroll: '@',
				allStatus:"="
			},
			compile: function(elem, attrs) {
				var dataListStr = attrs['gridData'],
					//animate = 'slide-down',
					animate='',
					templateHtml = $('#' + attrs['templateId']).html(),
					$table = elem.find('table'),
					repeatClass = attrs['repeatClass'] ? ('ng-class="' + attrs['repeatClass'] + '"') : '',
					hasCheckbox = attrs['checkbox'] || attrs['checkboxId'],
					checkboxShow = '';
				//calcGridHeight();
				bulidHtmlTemplate();
				slimscroll();
				function slimscroll() {
					if (attrs['scroll']) {
						elem.find('.table-responsive').attr('slimscroll', attrs['scroll']);
					}
				}
				function bulidHtmlTemplate() {
					if (!attrs['totalPage']) {
						elem.find('.grid-pager').remove();
					}
					checkboxShow = hasCheckbox ? bulidCheckboxHtml() : '';

					$table.html('<tbody><tr class="' + animate + ' bind-template" ' + repeatClass + buildRepeat() + '>'+ 
					templateHtml + '</tr></tbody>');
					elem.find('.alert').attr('ng-if', 'grid_data.length == 0');
				}
				function buildRepeat() {
					var repeatStr = '',
						initFunc = attrs['repeatInit'],
						filterStr = attrs['filter'];
					if (initFunc) {
						repeatStr = 'ng-init="repeatInit(item, $index)"';
					}
					if (filterStr) {
						repeatStr += ' ng-repeat="item in grid_data | filter:search_data"';
					} else {
						repeatStr += ' ng-repeat="item in grid_data"';
					}
					return repeatStr;
				}
				function bulidCheckboxHtml() {
					var strId = attrs['checkboxId'] ? ' data-id="[[item.id]]" ' : '',
						strIndex = attrs['checkbox'] ? ' data-index="[[$index]]" ' : '',
						show = attrs['checkboxShow'] ? ' ng-show="' + attrs['checkboxShow'] +  '"' : '';
					templateHtml = "<td" + show + "><input ng-change='checkboxChange()' ng-model='checkedbox[item.id]' type='checkbox' " + strId + strIndex + "'></td>" + templateHtml;
					return show;
				}
				return function(scope, elem, attrs) {
					init(scope);
					bulidThead(elem, scope);
					if (scope.grid_options && angular.isObject(scope.grid_options.broadcastData)) {
						for (var name in scope.grid_options.broadcastData) {
							scope[name] = scope.grid_options.broadcastData[name];
							/*if (!angular.isString(scope.grid_options.broadcastData[name])) {
								continue;
							}*/
							(function(name) {
								if (angular.isString(scope.$parent[name]) || angular.isString(scope.$parent[name]) || angular.isNumber(scope.$parent[name])) {
									scope.$watch('$parent.' + name, function(v) {
										scope[name] = v;
									})
								}
							})(name)
						}
					}
					if (hasCheckbox) {
						setTimeout(function() {
							scope.$apply(function() {
								checkboxInit(scope);
							});
						}, 200);
					}
					function checkboxInit(scope) {
						var filter = attrs['filter'];
						if (scope.grid_data) {
							scope.$watch('grid_data.length', function() {
								scope.checkedbox = {};
								scope.grid_data.forEach(function(v) {
									var id = v.id;
									if (scope.hasCheckedArray) {
										if (scope.tmpCheckbox.indexOf(id) == -1) {
											scope.checkedbox[id] = false;
										} else {
											scope.checkedbox[id] = true;
										}
									} else {
										scope.checkedbox[id] = false;
									}
								})
								scope.checkboxChange();
							})
						}
						scope.checkboxChange = function() {
							var item, checkedId = [], isAllChecked = true, index = 0;
							for (item in scope.checkedbox) {
								index += 1;
								if (scope.checkedbox[item]) {
									checkedId.push(Number(item));
								} else {
									isAllChecked = false;
								}
							}
							scope.checkbox = checkedId;
							if (index == 0) { scope.checkedboxAll = false; return false; }
							scope.checkedboxAll = isAllChecked;
						}
						scope.checkboxAllChange = function() {
							var item, isChecked = scope.checkedboxAll, index = 0;
							for (item in scope.checkedbox) {
								scope.checkedbox[item] = isChecked;
								index += 1;
							}
							if (index == 0) { return false; }
							scope.checkboxChange();
						}
					}
					function init(scope) {
						//所有checkbox对象
						var $tableBox = elem.find('.table-box');
						calcGridHeight(scope);
						scope.checkedbox = {};
						scope.hasCheckedArray = angular.isArray(scope.checkbox);
						scope.getVal = basicData;
						scope.tmpCheckbox = angular.copy(scope.checkbox);
						if (angular.isFunction(scope.order_by)) {
							scope.orderBy = function(name) {
								scope.order_by({name: name});
							}
						}
						if (angular.isFunction(scope.repeat_init)) {
							scope.repeatInit = function(item, index) {
								scope.repeat_init({'item': item, 'index': index});
							}
						}
						if (angular.isFunction(scope.page_change)) {
							scope.pageChange = function(page) {
								$tableBox.scrollTop(0);
								scope.page_change({page: page});
							}
						}

						scope.toggle = function(status) {
							if (commonApi.IS_SMALL_SCREEN) {
								scope.tableHeight = {'overflow': 'visible', 'height': 'initial'}
							} else {
								tools.pagerToggle(scope, status, 55);
							}
						}
						if (scope.grid_options && scope.grid_options.event) {
							scope.event = scope.grid_options.event;
						}
					}
					function calcGridHeight(scope) {
						if (!browser.isMobile() || commonApi.IS_SMALL_SCREEN) {
							var height = attrs['pageOffset'];
							if (isNaN(height)) {
								height = scope.page_offset;
							}
							height = (parseInt(height) ? parseInt(height) : 0);
							elem.css({'height': 'calc(100% - ' + (height) + 'px)'});
						}
					}
					function bulidThead(elem, scope) {
						var thead = '<thead{0}><tr>{1}</tr></thead>',
							colgroup = "",
							colHtml = "",
							html = "",
							isSort = false;
						if (!angular.isArray(scope.grid_options.fields)) {
							return false;
						}
						scope.grid_options.fields.forEach(function(v) {
							var sortStr = '';
							if (v.sort) {
								sortStr = ' field-name="' + v.sort + '"';
								isSort = true;
							}
							if (v.width) {
								colHtml += '<col width="' + v.width + '" />';
							}
							html += '<th' + sortStr + '>' + v.field + '</th>';
						});
						if (hasCheckbox) {
							html = '<th ' + checkboxShow + '><input ng-model="checkedboxAll" ng-change="checkboxAllChange()" type="checkbox"></th>' + html;
							colHtml =  '<col width="2%" ' + checkboxShow + ' />' + colHtml;
						}
						thead = thead.replace('{0}', isSort ? ' sort-head=orderBy(name)' : '');
						thead = thead.replace('{1}', html);
						if (colHtml) {
							colgroup = '<colgroup>' + colHtml + '</colgroup>';
							thead = colgroup + thead;
						}
						elem.find('.custom-table').prepend($compile(thead)(scope));
					}
				}
			}
		}
	}])
	/*
	$scope.gridOption = {
		data: 
		fields:	[
			{field: "账号名称"},
			{field: "累计积分", sort: 'total_point'},
			{field: "当前总积分", sort: 'current_point'},
			{field: "已兑换积分", sort: 'exchange_point'},
			{field: "已冻结积分"}
		],
		event: {
			aa : function(item, index) {
				console.log(item, index)
			}
		},
		broadcastData: {
			searchObj: $scope.searchObj
		}
	}

	
	<grid-table 
		grid-options="gridOption"
		grid-data="userPointData.userpoint_list" 
		template-id="userPointTemplate" 
		total-page='userPointData.total_page' 
		page-change="pageChange(page)" 
		page="searchObj.page"
		order-by="orderBy(name)"
		page-offset="52"
		repeat-class="{'restaurant-processing': item.audit_status == 30}"
		checkbox="checkIndex"
		checkboxShow="process==0"
		scroll="300px"
		filter=""
		>
	</grid-table>
						
	<template id="userPointTemplate">
		<td><a href="javascript:;" ng-click="event.aa(item, $index)">[[:: item.username]]</a></td>
		<td>[[:: item.total_point]]</td>
		<td>[[:: item.current_point]]</td>
		<td>[[:: item.exchange_point]]</td>
		<td>[[:: item.current_point]]</td>
	</template>
	*/
})(jQuery, window, angular);