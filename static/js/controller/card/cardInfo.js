app.controller('cardInfoCtrl', ['$scope','tools','downloadOrderModule','url',function ($scope,tools,downloadOrderModule,url) {
    $scope.submitted_start = null;
    $scope.submitted_end = null;
    //导出报表
    $scope.pageChange = function(starTime,endTime) {
        if(!starTime){
            tools.notification.info("请选择开始时间");
            return false;
        }
        if(!endTime){
            tools.notification.info("请选择结束时间");
            return false
        }

        var obj = {
            'begin':starTime,
            'end':endTime
        };
        var User = downloadOrderModule;
        User.get(obj,function(data){
            //请求成功之后下载
            var val = url.downloadOrder + '?'+$.param(obj);
            window.location.href = val;
        });
    };
}]);