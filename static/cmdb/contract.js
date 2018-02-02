
$(function(){

    $("#add_contract_button").click(function(){
        //$("#loading").show();
        var supplier_name = $("#supplier_name").val();
        var contract_name = $("#contract_name").val();
        var contract_number = $("#contract_number").val();
        var contract_type = $("#contract_type").val();
        var contract_server = $("#contract_server").val();
        var payment_style = $("#payment_style").val();
        var contract_years = $("#contract_years").val();
        var status = $("#status").val();
        var contract_sign_time = $("#contract_sign_time").val();
        var contract_expiration_time = $("#contract_expiration_time").val();

        $.post("/contract/addcontract", {supplier_name:supplier_name,contract_name:contract_name,contract_number:contract_number,contract_type:contract_type,contract_server:contract_server,
            payment_style:payment_style, contract_years:contract_years,status:status,contract_sign_time:contract_sign_time,contract_expiration_time:contract_expiration_time},
            function(data){
                if ( data.success == "true" ){
                    window.location.href="/contract/contract"; 
                }else{
                    alert(data.message)
                }
            },
            "json"
        );
    })

    $(".contract_edit").click(function(){
        var contract_id = $(this).parent().parent().children("td:eq(0)").html();
        var supplier_name = $(this).parent().parent().children("td:eq(1)").html();
        var contract_name = $(this).parent().parent().children("td:eq(2)").html();
        var contract_number = $(this).parent().parent().children("td:eq(3)").html();
        var contract_type = $(this).parent().parent().children("td:eq(4)").html();
        var contract_server = $(this).parent().parent().children("td:eq(5)").html();
        var payment_style = $(this).parent().parent().children("td:eq(6)").html();
        var contract_years = $(this).parent().parent().children("td:eq(7)").html();
        var contract_sign_time = $(this).parent().parent().children("td:eq(8)").html();
        var contract_expiration_time = $(this).parent().parent().children("td:eq(9)").html();
        var status = $(this).parent().parent().children("td:eq(10)").html();
        console.log(contract_expiration_time)

        $("#get_contract_info").children("div:eq(0)").children("div").children("input").val(contract_id);
        $("#get_contract_info").children("div:eq(1)").children("div").children("input").val(supplier_name);
        $("#get_contract_info").children("div:eq(2)").children("div").children("input").val(contract_name);
        $("#get_contract_info").children("div:eq(3)").children("div").children("input").val(contract_number);
        $("#get_contract_info").children("div:eq(4)").children("div").children("input").val(contract_type);
        $("#get_contract_info").children("div:eq(5)").children("div").children("input").val(contract_server);
        $("#get_contract_info").children("div:eq(6)").children("div").children("input").val(payment_style);
        $("#get_contract_info").children("div:eq(7)").children("div").children("input").val(contract_years);
        $("#get_contract_info").children("div:eq(8)").children("div").children("input").val(status);
        $("#get_contract_info").children("div:eq(9)").children("div").children("input").val(contract_sign_time);
        $("#get_contract_info").children("div:eq(10)").children("div").children("input").val(contract_expiration_time);
        $("#get_contract_info").children("div:eq(11)").children("div").children("input").val(contract_sign_time);

        $('#change_contract_model').modal({ keyboard: false });
    });

    $("#update_contract_button").click(function(){
        //$("#loading").show();
        var contract_id = $("#update_contract_id").val();
        var supplier_name = $("#update_supplier_name").val();
        var contract_name = $("#update_contract_name").val();
        var contract_number = $("#update_contract_number").val();
        var contract_type = $("#update_contract_type").val();
        var contract_server = $("#update_contract_server").val();
        var payment_style = $("#update_payment_style").val();
        var contract_years = $("#update_contract_years").val();
        var status = $("#update_status").val();
        var contract_sign_time = $("#update_contract_sign_time").val();
        var contract_expiration_time = $("#update_contract_expiration_time").val();


        $.post("/contract/updatecontract", {contract_id:contract_id, supplier_name:supplier_name,contract_name:contract_name,contract_number:contract_number,contract_type:contract_type,contract_server:contract_server,
            payment_style:payment_style, contract_years:contract_years,status:status,contract_sign_time:contract_sign_time,contract_expiration_time:contract_expiration_time},
            function(data){
                if ( data.success == "true" ){
                    window.location.href="/contract/contract"; 
                }else{
                    alert(data.message)
                }
            },
            "json"
        );
    });

    $(".delete_contract").click(function(){
        //$("#loading").show();
        
        var del_contract=confirm("你确定要删除当前资产吗？");  
        if (del_contract == true) {
            var contract_id = $(this).parent().parent().children("td:eq(0)").html();
            $.post("/contract/delcontract", {contract_id:contract_id},
                function(data){
                    if ( data.success == "true" ){
                        window.location.href="/contract/contract";  
                    }else{
                        alert(data.message)
                    }
                },
                "json"
            );
        } 
    });

});
