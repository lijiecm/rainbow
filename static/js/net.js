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
