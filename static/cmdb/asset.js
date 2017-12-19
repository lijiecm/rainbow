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

    $("#show_chanage_idc_button").click(function(){
        $('#chanage_idc_modal').modal({ keyboard: false });
    });


    $("#update_idc_button").click(function(){
        //$("#loading").show();
        var idc_id = $(this).parent().parent().children("td:eq(0)").html();
        $.post("/asset/getIdc", {idc_id:idc_id},
            function(data){
                if ( data.success == "true" ){
                    console.log(data); 
                }else{
                    alert(data.message)
                }
            },
            "json"
        );
    });


    $("#del_idc").click(function(){
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
