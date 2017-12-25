app.controller('performanceCtrl', ['$scope','effectMangerModule','tools','$timeout',function ($scope,effectMangerModule,tools,$timeout) {
    $scope.submitted_start = null;
    $scope.submitted_end = null;
    $scope.treeOptions = {
        nodeChildren: "children",
        dirSelectable: true,
        injectClasses: {
            ul: "a1",
            li: "a2",
            liSelected: "a7",
            iExpanded: "a3",
            iCollapsed: "a4",
            iLeaf: "a5",
            label: "a6",
            labelSelected: "a8"
        }
    };

    $scope.pageChange = function(starTime,endTime){
        if(!starTime){
            tools.notification.info("请输入开始时间");
            return false
        }
        if(!endTime){
            tools.notification.info("请输入结束时间");
            return false
        }
        getData(starTime,endTime);
    };
    function getData(star,end){
        effectMangerModule.get({
            "begin":star,
            "end":end
        },function(data){
            var obj = {
                "city_name":"总体平均时间",
                "statistics":{
                    "occupy_dispatch":null,//分配用时
                    "occupy_confirm":null,//确认用时
                    "occupy_pickup":null,//取餐用时
                    "occupy_delivery":null,//配送用时
                    "occupy_total":null//总共
                }
            };
            $scope.dataForTheTree = data.cities;
            $scope.dataForTheTree.forEach(function(v,i){
                v.stations.forEach(function(k,u){
                    //配送站配送员平均时间
                    k.staffs.forEach(function(r,l){
                        for(name in r.statistics){
                            if(name != "order_success_count"){
                                if(r.statistics.order_success_count == 0){
                                    //防止订单数为0，算不出平均值（除以0为NaN）
                                    r.statistics.order_success_count = 1;
                                }
                                r.statistics[name] = r.statistics[name]/r.statistics.order_success_count;
                            }
                        }
                    });

                    //配送站平均时间循环
                    for(name in k.statistics){
                        if(name != "order_success_count"){
                            k.statistics[name] = (k.statistics[name])/ k.statistics.order_success_count;
                        }

                    }
                });


                //省级平均时间循环
                for(name in v.statistics){
                    if(name !=="order_success_count"){
                        v.statistics[name] = v.statistics[name]/v.statistics.order_success_count;
                    }

                }
            });

            for(name in obj.statistics){
                //算出平均用时
                if(name != "order_success_count"){
                    if(data.statistics.order_success_count == 0){
                        //防止订单数是0 计算出的平均值是NaN;
                        data.statistics.order_success_count = 1;
                    }
                    obj.statistics[name] = data.statistics[name]/data.statistics.order_success_count;
                }
            }


            //添加到数组
            $scope.dataForTheTree.unshift(obj);
            var str = JSON.stringify($scope.dataForTheTree);
            var str1 = str.replace(/stations|staffs/g, 'children');
            var str2 = str1.replace(/staff_name|station_name/g, 'city_name');
            $scope.dataForTheTree = JSON.parse(str2);

            //此处使用黑科技，绩效管理页面搜索之后，收起tree（待优化）
            $timeout(function(){
                $("treeitem .tree-branch-head.a3").each(function(){
                    $(this).click();
                });
                $("treecontrol>ul>li .tree-branch-head.a3").each(function(){
                    $(this).click();
                });
            })
        });
    }
    var day =  new Date();
    var month = ((day.getMonth()+1) % 100)>9?((day.getMonth()+1) % 100).toString():'0' + ((day.getMonth()+1) % 100);
    var Ydate= ((day.getDate()-1) % 100)>9?((day.getDate()-1) % 100).toString():'0' + ((day.getDate()-1) % 100);
    var Tdate = (day.getDate() % 100)>9?(day.getDate() % 100).toString():'0' + (day.getDate() % 100);
    var today = day.getFullYear()+'-'+month+'-'+Tdate;
    var Yesterday = day.getFullYear()+'-'+month+'-'+Ydate;
    //默认查询昨天到今天的数据
    getData(Yesterday,today);
}]);