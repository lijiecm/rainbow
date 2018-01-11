$(function(){

    $("#add_role_button").click(function(){
        //$("#loading").show();
        var host_id = $("#host_id").val();
        var username = $("#username").val();
        var role = $("#role").val();
        var days = $("#days").val();
        $.post("/relay/addrole", {username:username,role:role,days:days},
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