$(function(){

    $("#add_net_button").click(function(){
        //$("#loading").show();
        var idc_id = $("#add_idc_id_select").val();
        var net_env = $("#net_env").val();
        var team = $("#team").val();
        var vlan = $("#vlan").val();
        var route = $("#route").val();
        var netmask = $("#netmask").val();
        var gateway = $("#gateway").val();
        var net_type = $("#net_type").val();
        $.post("/net/addnetwork", {idc_id:idc_id,net_env:net_env,team:team,vlan:vlan,route:route, netmask:netmask,gateway:gateway,net_type:net_type},
            function(data){
                if ( data.success == "true" ){
                    window.location.href="/net/network"; 
                }else{
                    alert(data.message)
                }
            },
            "json"
        );
    })
});



$('#pageLimit').bootstrapPaginator({
    currentPage: 1,//当前的请求页面。
    totalPages: 20,//一共多少页。
    size:"normal",//应该是页眉的大小。
    bootstrapMajorVersion: 3,//bootstrap的版本要求。
    alignment:"right",
    numberOfPages:5,//一页列出多少数据。
    itemTexts: function (type, page, current) {//如下的代码是将页眉显示的中文显示我们自定义的中文。
        switch (type) {
        case "first": return "首页";
        case "prev": return "上一页";
        case "next": return "下一页";
        case "last": return "末页";
        case "page": return page;
        }
    }
});
