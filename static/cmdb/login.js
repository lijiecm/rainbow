$(function(){
    $("#login_cmdb_button").click(function(){
        //$("#loading").show();
        var username = $("#username").val();
        var password = $("#password").val();
        console.log(username)
        $.post("/dologin", {username:username,password:password},
            function(data){
                console.log(data)
                if ( data.msg == "ok" ){
                    window.location.href="/asset/asset"; 
                }else{
                    alert(data.msg)
                }
            },
            "json"
        );
    })
});
