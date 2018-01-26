$(function(){

    $("#add_role_button").click(function(){
        //$("#loading").show();
        var host_id = $("#host_id").val();
        var username = $("#username").val();
        var role = $("#role").val();
        var days = $("#days").val();
        console.log(host_id)
        $.post("/relay/addrole", {host_id:host_id,username:username,role:role,days:days},
            function(data){
                if ( data.success == "true" ){
                    window.location.href="/relay/host"; 
                }else{
                    alert(data.message)
                }
            },
            "json"
        );
    })
});



$(function(){

    $("#add_host_role_button").click(function(){
        //$("#loading").show();
        var host_addr = $("#host_addr").val();
        var host_role = $("#host_role").val();

        $.post("/relay/addhostrole", {host_addr:host_addr,host_role:host_role},
            function(data){
                if ( data.success == "true" ){
                    window.location.href="/relay/role"; 
                }else{
                    alert(data.message)
                }
            },
            "json"
        );
    })
});



$(function(){

    $("#search_ip_button").click(function(){
        //$("#loading").show();
        var host_addr = $("#search_ip").val();
        var new_url = "/relay/role?"
        if (host_addr != "") {
            new_url = new_url + "host_addr=" + host_addr;
        }
        location.href = new_url;

    })
});