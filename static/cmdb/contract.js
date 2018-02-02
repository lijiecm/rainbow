
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
        
        var del_contract=confirm("你确定要删除当前合同吗？");  
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

    $("#add_order_button").click(function(){
        //$("#loading").show();
        var contract_id = $("#contract_id").val();
        var hardware_type = $("#hardware_type").val();
        var count = $("#count").val();
        var arrival_count = $("#arrival_count").val();
        var model = $("#model").val();
        var asset_conf_id = $("#asset_conf_id").val();
        var site_name = $("#site_name").val();
        var order_sign_time = $("#order_sign_time").val();

        $.post("/contract/addorder", {contract_id:contract_id,hardware_type:hardware_type,count:count,arrival_count:arrival_count,
            model:model,asset_conf_id:asset_conf_id,site_name:site_name,order_sign_time:order_sign_time},
            function(data){
                if ( data.success == "true" ){
                    window.location.href="/contract/order"; 
                }else{
                    alert(data.message)
                }
            },
            "json"
        );
    })

    $(".order_edit").click(function(){
        var order_id = $(this).parent().parent().children("td:eq(0)").html();
        var contract_id = $(this).parent().parent().children("td:eq(1)").html();
        var hardware_type = $(this).parent().parent().children("td:eq(2)").html();
        var count = $(this).parent().parent().children("td:eq(3)").html();
        var arrival_count = $(this).parent().parent().children("td:eq(4)").html();
        var model = $(this).parent().parent().children("td:eq(5)").html();
        var asset_conf_id = $(this).parent().parent().children("td:eq(6)").html();
        var site_name = $(this).parent().parent().children("td:eq(7)").html();
        var order_sign_time = $(this).parent().parent().children("td:eq(8)").html();


        $("#get_order_info").children("div:eq(0)").children("div").children("input").val(order_id);
        $("#get_order_info").children("div:eq(1)").children("div").children("input").val(contract_id);
        $("#get_order_info").children("div:eq(2)").children("div").children("input").val(hardware_type);
        $("#get_order_info").children("div:eq(3)").children("div").children("input").val(count);
        $("#get_order_info").children("div:eq(4)").children("div").children("input").val(arrival_count);
        $("#get_order_info").children("div:eq(5)").children("div").children("input").val(model);
        $("#get_order_info").children("div:eq(6)").children("div").children("input").val(asset_conf_id);
        $("#get_order_info").children("div:eq(7)").children("div").children("input").val(site_name);
        $("#get_order_info").children("div:eq(8)").children("div").children("input").val(order_sign_time);

        $('#change_order_model').modal({ keyboard: false });
    });

    $("#update_order_button").click(function(){
        //$("#loading").show();
        var order_id = $("#order_id").val();
        var contract_id = $("#update_contract_id").val();
        var hardware_type = $("#update_hardware_type").val();
        var count = $("#update_count").val();
        var arrival_count = $("#update_arrival_count").val();
        var model = $("#update_model").val();
        var asset_conf_id = $("#update_asset_conf_id").val();
        var site_name = $("#update_site_name").val();
        var order_sign_time = $("#update_order_sign_time").val();


        $.post("/contract/updateorder", {order_id:order_id, contract_id:contract_id,hardware_type:hardware_type,count:count,arrival_count:arrival_count,
            model:model,asset_conf_id:asset_conf_id,site_name:site_name,order_sign_time:order_sign_time},
            function(data){
                if ( data.success == "true" ){
                    window.location.href="/contract/order"; 
                }else{
                    alert(data.message)
                }
            },
            "json"
        );
    });

    $(".delete_order").click(function(){
        //$("#loading").show();
        
        var del_order=confirm("你确定要删除当前订单吗？");  
        if (del_order == true) {
            var order_id = $(this).parent().parent().children("td:eq(0)").html();
            $.post("/contract/delorder", {order_id:order_id},
                function(data){
                    if ( data.success == "true" ){
                        window.location.href="/contract/order";  
                    }else{
                        alert(data.message)
                    }
                },
                "json"
            );
        } 
    });

});
