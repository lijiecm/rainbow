$(function(){
    $("#add_host_button").click(function(){
        //$("#loading").show();
        var app_name = $("#app_name").val();
        var mechine_type = $("#mechine_type").val();
        var host_ip = $("#host_ip").val();
        var host_oobip = $("#host_oobip").val();
        var host_env = $("#host_env").val();
        var asset_sn = $("#asset_sn").val();
        var hostname = $("#hostname").val();
        var os = $("#os").val();
        var owner = $("#owner").val();
        var status = $("#status").val();
        $.post("/host/addhost", {app_name:app_name,mechine_type:mechine_type,host_ip:host_ip,host_oobip:host_oobip,host_env:host_env,
            asset_sn:asset_sn, hostname:hostname,os:os,owner:owner,status:status},
            function(data){
                if ( data.success == "true" ){
                    window.location.href="/host/host"; 
                }else{
                    alert(data.message)
                }
            },
            "json"
        );
    })

    $(".relay").click(function(){
        var ip = $(this).parent().parent().children("td:eq(3)").html();
        var username = $(".username").text();
        console.log(ip)
        console.log(username)

    })

    $(".host_edit").click(function(){
        var host_id = $(this).parent().parent().children("td:eq(0)").html();
        var app_name = $(this).parent().parent().children("td:eq(1)").html();
        var mechine_type = $(this).parent().parent().children("td:eq(2)").html();
        var host_ip = $(this).parent().parent().children("td:eq(3)").html();
        var host_oobip = $(this).parent().parent().children("td:eq(4)").html();
        var host_env = $(this).parent().parent().children("td:eq(5)").html();
        var asset_id = $(this).parent().parent().children("td:eq(6)").html();
        var hostname = $(this).parent().parent().children("td:eq(7)").html();
        var os = $(this).parent().parent().children("td:eq(8)").html();
        var owner = $(this).parent().parent().children("td:eq(9)").html();
        var status = $(this).parent().parent().children("td:eq(10)").html();
        
        $("#get_host_info").children("div:eq(0)").children("div").children("input").val(host_id);
        $("#get_host_info").children("div:eq(1)").children("div").children("input").val(app_name);
        $("#get_host_info").children("div:eq(2)").children("div").children("input").val(mechine_type);
        $("#get_host_info").children("div:eq(3)").children("div").children("input").val(host_ip);
        $("#get_host_info").children("div:eq(4)").children("div").children("input").val(host_oobip);
        $("#get_host_info").children("div:eq(5)").children("div").children("input").val(host_env);
        $("#get_host_info").children("div:eq(6)").children("div").children("input").val(asset_id);
        $("#get_host_info").children("div:eq(7)").children("div").children("input").val(hostname);
        $("#get_host_info").children("div:eq(8)").children("div").children("input").val(os);
        $("#get_host_info").children("div:eq(9)").children("div").children("input").val(owner);
        $("#get_host_info").children("div:eq(10)").children("div").children("input").val(status);

        $('#change_host_model').modal({ keyboard: false });
    });

    $("#update_host_button").click(function(){
        //$("#loading").show();
        var host_id =  $("#update_host_id").val();
        var app_name = $("#update_app_name").val();
        var mechine_type = $("#update_mechine_type").val();
        var host_ip = $("#update_host_ip").val();
        var host_oobip = $("#update_host_oobip").val();
        var host_env = $("#update_host_env").val();
        var asset_sn = $("#update_asset_sn").val();
        var hostname = $("#update_hostname").val();
        var os = $("#update_os").val();
        var owner = $("#update_owner").val();
        var status = $("#update_status").val();
        $.post("/host/updatehost", {host_id:host_id,app_name:app_name,mechine_type:mechine_type,host_ip:host_ip,host_oobip:host_oobip,host_env:host_env,
            asset_sn:asset_sn, hostname:hostname,os:os,owner:owner,status:status},
            function(data){
                if ( data.success == "true" ){
                    window.location.href="/host/host"; 
                }else{
                    alert(data.message)
                }
            },
            "json"
        );
    });

    $(".host_delete").click(function(){
        //$("#loading").show();
        
        var del_idc=confirm("你确定要删除当前资产吗？");  
        if (del_idc == true) {
            var host_id = $(this).parent().parent().children("td:eq(0)").html();
            $.post("/host/delhost", {host_id:host_id},
                function(data){
                    if ( data.success == "true" ){
                        window.location.href="/host/host";  
                    }else{
                        alert(data.message)
                    }
                },
                "json"
            );
        } 
    });

});
