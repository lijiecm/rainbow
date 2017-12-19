$(function(){
    $("#add_asset_button").click(function(){
        //$("#loading").show();
        var add_idc_id = $("#add_idc_id_select").val();
        var asset_type = $("#asset_type").val();
        var asset_model = $("#asset_model").val();
        var asset_conf_id = $("#asset_conf_id").val();
        var asset_sn = $("#asset_sn").val();
        var asset_code = $("#asset_code").val();
        var asset_rack = $("#asset_rack").val();
        var asset_env = $("#asset_env").val();
        var asset_location = $("#asset_location").val();
        var asset_bios = $("#asset_bios").val();
        var asset_owner = $("#asset_owner").val();
        var asset_power = $("#asset_power").val();
        var asset_size = $("#asset_size").val();
        var asset_network_id = $("#asset_network_id").val();
        var asset_contract_id = $("#asset_contract_id").val();
        console.log(asset_sn)
        $.post("/asset/addasset", {add_idc_id:add_idc_id, asset_type:asset_type, asset_model:asset_model, asset_conf_id:asset_conf_id, asset_sn:asset_sn, asset_code:asset_code, 
            asset_rack:asset_rack, asset_env:asset_env, asset_location:asset_location, asset_bios:asset_bios, asset_owner:asset_owner, asset_power:asset_power, 
            asset_size:asset_size, asset_network_id:asset_network_id, asset_contract_id:asset_contract_id},
            function(data){
                if ( data.success == "true" ){
                    window.location.href="/asset/asset"; 
                }else{
                    alert(data.message)
                }
            },
            "json"
        );
    })

    $("#add_idc_button").click(function(){
        //$("#loading").show();
        var idc_name = $("#idc_name").val();
        var idc_tag = $("#idc_tag").val();
        var idc_location = $("#idc_location").val();
        var idc_floor = $("#idc_floor").val();
        var idc_room = $("#idc_room").val();
        var idc_count = $("#idc_count").val();
        $.post("/asset/addidc", {idc_name:idc_name,idc_tag:idc_tag,idc_location:idc_location,idc_floor:idc_floor,idc_room:idc_room,idc_count:idc_count},
            function(data){
                if ( data.success == "true" ){
                    window.location.href="/asset/idc"; 
                }else{
                    alert(data.message)
                }
            },
            "json"
        );
    })


    $("#add_asset_conf_button").click(function(){
        //$("#loading").show();
        var asset_conf_name = $("#asset_conf_name").val();
        var asset_conf_cpu = $("#asset_conf_cpu").val();
        var asset_conf_mem = $("#asset_conf_mem").val();
        var asset_conf_disk = $("#asset_conf_disk").val();
        var asset_conf_raid = $("#asset_conf_raid").val();
        var asset_conf_detail = $("#asset_conf_detail").val();
        $.post("/asset/addconf", {asset_conf_name:asset_conf_name,asset_conf_cpu:asset_conf_cpu,
            asset_conf_mem:asset_conf_mem,asset_conf_disk:asset_conf_disk,asset_conf_raid:asset_conf_raid,
            asset_conf_detail:asset_conf_detail},
            function(data){
                if ( data.success == "true" ){
                    window.location.href="/asset/conf"; 
                }else{
                    alert(data.message)
                }
            },
            "json"
        );
    })

    $(".show_chanage_idc").click(function(){
        var idc_id = $(this).parent().parent().children("td:eq(0)").html();
        var idc_name = $(this).parent().parent().children("td:eq(1)").html();
        var idc_tag = $(this).parent().parent().children("td:eq(2)").html();
        var idc_location = $(this).parent().parent().children("td:eq(3)").html();
        var idc_floor = $(this).parent().parent().children("td:eq(4)").html();
        var idc_room = $(this).parent().parent().children("td:eq(5)").html();
        var idc_count = $(this).parent().parent().children("td:eq(6)").html();
        
        $("#get_idc_info").children("div:eq(0)").children("div").children("input").val(idc_id);
        $("#get_idc_info").children("div:eq(1)").children("div").children("input").val(idc_name);
        $("#get_idc_info").children("div:eq(2)").children("div").children("input").val(idc_tag);
        $("#get_idc_info").children("div:eq(3)").children("div").children("input").val(idc_location);
        $("#get_idc_info").children("div:eq(4)").children("div").children("input").val(idc_floor);
        $("#get_idc_info").children("div:eq(5)").children("div").children("input").val(idc_room);
        $("#get_idc_info").children("div:eq(6)").children("div").children("input").val(idc_count);

        $('#change_idc_modal').modal({ keyboard: false });
    });


    $("#update_idc_button").click(function(){
        //$("#loading").show();
        var idc_id =  $("#update_idc_id").val();
        var idc_name = $("#update_idc_name").val();
        var idc_tag = $("#update_idc_tag").val();
        var idc_location = $("#update_idc_location").val();
        var idc_floor = $("#update_idc_floor").val();
        var idc_room = $("#update_idc_room").val();
        var idc_count = $("#update_idc_count").val();
        $.post("/asset/updateidc", {idc_id:idc_id, idc_name:idc_name,idc_tag:idc_tag,idc_location:idc_location,idc_floor:idc_floor,idc_room:idc_room,idc_count:idc_count},
            function(data){
                if ( data.success == "true" ){
                    window.location.href="/asset/idc"; 
                }else{
                    alert(data.message)
                }
            },
            "json"
        );
    });


    $(".show_del_idc").click(function(){
        //$("#loading").show();
        
        var del_idc=confirm("你确定要删除当前机房吗？");  
        if (del_idc == true) {
            var idc_id = $(this).parent().parent().children("td:eq(0)").html();
            $.post("/asset/delidc", {idc_id:idc_id},
                function(data){
                    if ( data.success == "true" ){
                        window.location.href="/asset/idc";  
                    }else{
                        alert(data.message)
                    }
                },
                "json"
            );
        } 
    });

});
