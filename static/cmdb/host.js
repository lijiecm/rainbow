$(function(){
    $("#add_host_button").click(function(){
        //$("#loading").show();
        var app_name = $("#app_name").val();
        var host_ip = $("#host_ip").val();
        var host_oobip = $("#host_oobip").val();
        var host_env = $("#host_env").val();
        var asset_sn = $("#asset_sn").val();
        var hostname = $("#hostname").val();
        var os = $("#os").val();
        var owner = $("#owner").val();
        var status = $("#status").val();
        $.post("/host/addhost", {app_name:app_name,host_ip:host_ip,host_oobip:host_oobip,host_env:host_env,
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
});
