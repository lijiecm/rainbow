(function ($, window, angular) {
	"use strict"; 
	var $window = $(window), $body = $('body');
	angular.module("dh.menuOptionsDirective", [])
	//菜单编辑 DOM操作
	.directive("menuFocusBlur", ['tools', function (tools) {
		return {
			restrict: 'A',
			scope: {
				method: '&',
				nextAction: '&',
				menuFocusBlur: '='
			},
			link: function (scope, elem, attrs) {
				if (scope.menuFocusBlur) {
					var val = '', type = '', id = '', prop = '', index = 0, childIndex = 0;
					if (angular.isFunction(scope.method)) {
						elem.on("focus", 'input:text', function() {
							var $this = $(this),
								dataProp = $this.attr('name').split('.'),
								$parent = $this.parent().parent(),
								dataId = $parent.attr('data-sid'),
							 	dataIndex = ($parent.attr('data-item-index') || $parent.parent().attr('data-item-index')).split('-');
							if ($this.attr('data-val') == 'error') {
								val = '';
							} else {
								val = $this.val();
							}
							type = dataProp[0];
							prop = dataProp[1];
							id = dataId;
							index = dataIndex[0];
							childIndex = dataIndex[1];
							$this.parent().removeClass('has-error');
							if (angular.isFunction(scope.nextAction) && (type == 'menu' || type == 'option') && prop == 'name') {
								var $nextLi = $parent.next();
								if ($nextLi.length == 0) {
									scope.nextAction({index: index});
									scope.$apply();
								}
							}
						}).on("blur", 'input:text', function() {
							var $this = $(this), $parent = $this.parent(), nowVal = $this.val(), obj = null, timeVal = null, $next = null;
							if (prop == 'name' && nowVal.trim() == "") {
								tools.notification.error('名称不能为空');
								$this.parent().addClass('has-error');
								return false;
							}
							if (prop == 'price' && nowVal.trim() == "") {
								tools.notification.error('价格不能为空');
								$this.val(val).addClass('has-error');
								return false;
							}
							//数据改变
							if (val.trim() !== nowVal.trim()) {
								$parent.addClass('loading');
								obj = {
									'focusVal': val, 
									'blurVal': nowVal,
									'type': type,
									'id' : id,
									'index' : index,
									'childIndex' : childIndex,
									'prop': prop
								}
								var promise = scope.method({'obj': obj});
								if (promise) {
									promise.then(function() {
										$parent.removeClass('loading');
									}, function() {
										$parent.addClass('error');
									})
								}
							}
						})
					}
					elem.on("click",".request-loading", function() {
						$(this).prev().attr("data-val","error").focus().parent().removeClass('error loading');
						return false;
					})
				}	
			}
		}
	}])
	.directive('menuToggleSilde', function() {
		return  function(scope, elem, attrs) {
			var selector = attrs['menuToggleSilde'] || '';
			elem.on('click', selector, function(e) {
				if (e.target.nodeName == 'INPUT') {return false;}
				if (e.target.nodeName == 'SPAN' && e.target.className.indexOf('request-loading') != -1) {
					$(e.target).prev().attr("data-val","error").focus().parent().removeClass('error loading');
					return false;
				}
				$(this).toggleClass('expends').next().slideToggle(200);
			})
		}
	})
	.directive("menuSildeUp", function () {
		return function(scope, elem) {
			elem.on('click', function() {
				$("#itemBox").children().children('section').slideUp(200).prev().removeClass('expends');
			})
		}
	})
	.directive("menuSildeDown", function () {
		return function(scope, elem) {
			elem.on('click', function() {
				$("#itemBox").children().children('section').slideDown(200).prev().addClass('expends');
			})
		}
	})
	.directive("menuFilter", function() {
		var isFirst = true;
		return {
			restrict: 'A',
			scope: {
				menuFilter: '=',
				isEmpty: '='
			},
			link: function(scope, elem, attrs) {
				var $ol = elem.children();
				scope.$watch("menuFilter", function(v) {
					if (!isFirst) {
						var $li = $ol.children("li"), len = $li.length, oLi = null, keyWord = "" , showCount = 0;
						if (!v) {
							$li.show();
							scope.isEmpty = false;
							return false
						}
						for (var i = 0; i < len; i++) {
							oLi = $li[i];
							keyWord = oLi.getAttribute("data-key-word");
							if (keyWord.indexOf(v) >= 0) {
								oLi.style.display = 'block';
								showCount += 1;
							} else {
								oLi.style.display = 'none';
							}
						}
						scope.isEmpty = showCount == 0 ? true : false;
					}
				})
				isFirst = false;
			}
		}
	})
	.directive("filterImage", ['tools', 'commonApi', function(tools, commonApi) {
		return {
			restrict: 'E',
			template: [
				'<div class="clearfix">',
					'<div class="left">',
						'<div class="filter-img" id="filterBox"></div>',
					'</div>',
					'<div class="left pl20">',
						'<div class="upload-box">',
							'<div class="upload-btn">本地上传',
								'<input type="file" class="file" accept="image/*" id="uploadFile"></div>',
							'<p>网页上显示效果</p>',
							'<div class="photo" id="preview-pane">',
								'<canvas id="canvas"></canvas>',
							'</div>',
							//'<p>[[uploadWidth]] X [[uploadHeight]]</p>',
						'</div>',
					'</div>',
				'</div>'
			].join(''),
			replace: true,
			scope: {
				upload: '=',
				maxSize: '@',
				watermark: '@',
				uploadWidth: '@',
				uploadHeight: '@',
				updateLoadImgSize: '@'
			},
			link: function(scope, elem, attrs) {
				var uploadWidth = assignVal(scope.uploadWidth, 280);
				var uploadHeight = assignVal(scope.uploadHeight, 280);
				var updateLoadImgSize = assignVal(scope.updateLoadImgSize, 400);
				var watermark = scope.watermark || '';
				var catchImg = null;
				function assignVal(value, defaultVal) {
					var v = value || defaultVal;
					if (isNaN(v)) {
						return defaultVal;
					} else {
						return parseInt(v);
					}
				}
				var position = null , 
					imgObj = {}, 
					jcrop_api,
					_this = {},
					isFirst = true,
					canvas = elem.find("#canvas")[0],
					$filterImg = null,
					$filterBox = elem.find("#filterBox"),
					context = canvas.getContext("2d"),
					size = {
						width: uploadWidth,
						height: uploadHeight
					},
					imgOffset={
						"right":7,
						"bottom":0
					},
					isUpload = false,
					quality = 0.5; //图片质量 0~1

				scope.maxSize = isNaN(scope.maxSize) ? -1 : (parseInt(scope.maxSize) * 1024);
				context.backgroundAlpha = 0;
				canvas.width = size.width;
				canvas.height = size.height;


				$filterBox.css({'width': updateLoadImgSize, 'minHeight': updateLoadImgSize})
				var reloadCanvas = function() {
					context.clearRect(0, 0, canvas.width, canvas.height);
					context.drawImage(imgObj, calcW(position.x), calcH(position.y), calcW(position.w), calcH(position.h), 0, 0, size.width, size.height);
					buildWatermark();
				}
				var buildJsrop = function() {
					$filterImg.Jcrop({
						onChange: updatePreview,
						onSelect: updatePreview,
						aspectRatio: 1,
						addClass: 'jcrop-light'
					}, function() {
						this.animateTo([0, 0, size.width, size.height]);
						jcrop_api = this;
					});

					function updatePreview(c) {
						position = c;
						reloadCanvas();
					};
				}
				var vaildateImg = function(file) {
					if (!file) {
						return false;
					}
					if (file.type.indexOf("image") < 0) {
						tools.notification.error("不支持图片以外的格式");
						return false;
					}
					return true;
				}
				var caclImgSize = function(img) {
					var w = img.width,
						h = img.height;
					if (w < updateLoadImgSize && h < updateLoadImgSize) {
						$filterImg.attr({
							'width': 'auto',
							'height': 'auto'
						});
					} else {
						if (w >= h) {
							$filterImg.attr({
								'width': updateLoadImgSize,
								'height': h / (w / updateLoadImgSize)
							});
						} else {
							$filterImg.attr({
								'height': updateLoadImgSize,
								'width': w / (h / updateLoadImgSize)
							});
						}
					}
				}
				var loadImg = function(isLoad) {
					if (isLoad) {
						$filterBox.html('<img src="" width="' + updateLoadImgSize + '" id="filterImg">');
						$filterImg = $("#filterImg");
					}
					$filterImg.attr("src", this.result);
					$filterImg.next().find("img").attr("src", this.result);
					var img = new Image();
					img.src = this.result;
					img.onload = function(e) {
						imgObj = this;
						caclImgSize(this);
						buildJsrop(isFirst);
						isFirst = false;
					}
				}
				var bindEvent = function() {
					elem.find("#uploadFile").change(function() {
						var file = this.files[0],
							fileReader = new FileReader();
						if (!vaildateImg(file)) {
							return false;
						}
						fileReader.readAsDataURL(file);
						fileReader.onload = function(e) {
							var result = this.result;
							isUpload = true;
							loadImg.call({
								'result': result
							}, true);
						}
					})
					//上传方法
					scope.upload = angular.isObject(scope.upload) ? scope.upload : {};
					scope.upload.uploadStart = function(formData, callback) {
						if (isUpload && formData && canvas.toBlob) {
							canvas.toBlob(
								function(blob) {
									if (scope.maxSize > 0 && blob.size > maxSize) {
										callback('error', {
											error: "图片大小" + (blob.size / 1024).toFixed(2) + "KB , 不能大于" + (maxSize / 1024) + "KB"
										});
										return false;
									}
									if (!(formData instanceof FormData)) {
										callback('error', {
											error: '请传递FormData的实例给uploadStart函数'
										});
										return false;
									}
									formData.append('file', blob);

									var xhr = new XMLHttpRequest();
									xhr.responseType = 'json';
									xhr.timeout = 5000;
									xhr.ontimeout = function() {
										xhr.abort();
										callback('error', {
											error: "网络异常，上传超时"
										});
									}
									xhr.onerror = function() {
										callback('error', {
											error: "未知错误，上传失败"
										});
									}
									xhr.open('POST', tools.commonApi.QINIU_URL);
									xhr.onreadystatechange = function() {
										if (xhr.readyState == 4 && xhr.status == 200) {
											callback('success', {'url': URL.createObjectURL(blob), 'result': xhr.response });
										} else if (xhr.readyState == 4 && xhr.status != 200) {
											callback('error', xhr.response);
										}
									}
									xhr.send(formData);
								}, 'image/png', quality
							);
						} else {
							callback('error', {
								error: '请选择上传图片'
							});
						}
					}
				}
				var calcW = function(value) {
					var w = parseInt($filterImg.css("width"));
					return imgObj.width / (w / value);
				}
				var calcH = function(value) {
					var h = parseInt($filterImg.css("height"));
					return imgObj.height / (h / value);
				}
				var buildWatermark = function() {
					if (!watermark) {return false;}
					if (catchImg) {
						drawImg(catchImg);
						return false;
					}
					var img = new Image();
					img.src = commonApi.WATERMARK_URL;
					img.onload = function() {
						catchImg = img;
						drawImg(img);
					}
					function drawImg(img) {
						context.drawImage(img, canvas.width - img.width-imgOffset.right, canvas.height - img.height-imgOffset.bottom);
					}
				}
				bindEvent();
				
			}
		}
	}])
	.directive("restaurantInfo", function () {
		return function(scope, elem, attrs) {
			if (attrs['restaurantInfo'] == 'false') {
				setTimeout(function() {
					$('.form-delete').remove();
					$('input').attr('disabled', true);
					$('.form-enable').attr('disabled', false);
				})
			}
		}
	})
})(jQuery, window, angular);	
