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

    $(".relay_edit").click(function(){
        var relay_id = $(this).parent().parent().children("td:eq(0)").html();
        var username = $(this).parent().parent().children("td:eq(1)").html();
        var IP = $(this).parent().parent().children("td:eq(3)").html();
        var role = $(this).parent().parent().children("td:eq(4)").html();
    
        $("#get_relay_info").children("div:eq(0)").children("div").children("input").val(relay_id);
        $("#get_relay_info").children("div:eq(1)").children("div").children("input").val(IP);
        $("#get_relay_info").children("div:eq(2)").children("div").children("input").val(username);
        $("#get_relay_info").children("div:eq(4)").children("div").children("input").val(role);
    
        $('#change_relay_model').modal({ keyboard: false });
    });

    $("#update_role_button").click(function(){
        //$("#loading").show();
        var relay_id = $("#update_relay_id").val();
        var ip = $("#upate_ip").val();
        var role = $("#update_role").val();

        $.post("/relay/updaterole", {relay_id:relay_id,ip:ip,role:role},
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