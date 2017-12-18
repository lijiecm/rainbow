package asset


import (
	"github.com/astaxie/beego/logs"
	"zuoye/cmdb/model"
	"fmt"
	//"net/http"
)

func (p *AssetController) AddAsset(){
	errorMsg := "success"

	result := make(map[string]interface{})
	
	result["success"] = "true"
	result["message"] = errorMsg

	assetModel := model.NewAssetModel()
	var asset model.Asset
	var err error
	defer func(){
		if err != nil {
			result["success"] = "false"
			result["message"] = errorMsg
			p.Data["json"] =  result
			p.ServeJSON()  
		}
	}()
	
	//下面的值均有默认值或者可以为空
    asset_type := p.GetString("asset_type")
	asset_code := p.GetString("asset_code")
	asset_bios := p.GetString("asset_bios")
	asset_power,_ := p.GetInt("asset_power")  //前端写死了0，1两种值，所以无需判断err
	asset_size := p.GetString("asset_size")
	
	//下面的值必须有合法的值
	idc_id, err := p.GetInt("add_idc_id")
	if err != nil {
		err = fmt.Errorf("获取idc id非法，err:%v", err)
		errorMsg = "获取idc id非法" 
		logs.Warn(err.Error())
	   	return
    }

	asset_model := p.GetString("asset_model")
	if len(asset_model) == 0 {
		err =  fmt.Errorf("设备型号不能为空")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}

	asset_conf_id, err := p.GetInt("asset_conf_id")
	if err != nil {
		err = fmt.Errorf("获取设备配置 id非法，err:%v", err)
		errorMsg = "获取设备配置 id非法"
	    logs.Warn(err.Error())
	    return
	}
	
	asset_sn := p.GetString("asset_sn")
	if len(asset_sn) == 0 {
		err =  fmt.Errorf("sn号不能为空，用于设备保修使用")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}

	asset_rack := p.GetString("asset_rack")
	if len(asset_rack) == 0 {
		err =  fmt.Errorf("机柜不能为空")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}

	asset_location := p.GetString("asset_location")
	if len(asset_location) == 0 {
		err =  fmt.Errorf("U位不能为空")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}


	asset_network_id, err := p.GetInt("asset_network_id")
	if err != nil {
		err = fmt.Errorf("获取网段 id非法，err:%v", err)
		errorMsg = "获取网段 id非法"  
	   logs.Warn(err.Error())
	   return
    }

    asset_contract_id, err := p.GetInt("asset_contract_id")
    if err != nil {
		err = fmt.Errorf("获取合同 id非法，err:%v", err)
		errorMsg = "获取合同 id非法" 
		logs.Warn(err.Error())
		return
	}


	asset.IdcId = idc_id
	asset.AssetType = asset_type
	asset.Model = asset_model
	asset.ConfId = asset_conf_id
	asset.SN = asset_sn
	asset.ServiceCode = asset_code
	asset.RackName = asset_rack
	asset.Location = asset_location
	asset.BiosVer = asset_bios
	asset.PowerState = asset_power
	asset.Site = asset_size
	asset.NetworkId = asset_network_id
	asset.ContractId = asset_contract_id

	err = assetModel.CreateAsset(&asset)
	if err != nil {
		err = fmt.Errorf("添加资产设备失败:%v", err)
		errorMsg = "添加资产设备失败"  
	   	logs.Warn(err.Error())
	   	return
	}
	p.Data["json"] =  result
	p.ServeJSON()  

}


func (p *AssetController) AddIdc(){
	errorMsg := "success"
	
	result := make(map[string]interface{})
	
	result["success"] = "true"
	result["message"] = errorMsg

	assetModel := model.NewAssetModel()
	var idc model.Idc
	var err error
	defer func(){
		if err != nil {
			result["success"] = "false"
			result["message"] = errorMsg
			p.Data["json"] =  result
			p.ServeJSON()  
		}
	}()
	
	//下面的值必须有合法的值
	
	idc_name := p.GetString("idc_name")
	if len(idc_name) == 0 {
		err =  fmt.Errorf("机房名称不能未空")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}

	idc_tag := p.GetString("idc_tag")
	if len(idc_tag) == 0 {
		err =  fmt.Errorf("机房标签不能未空")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}
	idc_location := p.GetString("idc_location")
	if len(idc_location) == 0 {
		err =  fmt.Errorf("机房地理位置不能为空")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}

	idc_floor := p.GetString("idc_floor")
	if len(idc_floor) == 0 {
		err =  fmt.Errorf("机房楼层不能为空")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}

	idc_room := p.GetString("idc_room")
	if len(idc_room) == 0 {
		err =  fmt.Errorf("机房房间号不能为空")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}

	idc_count, err := p.GetInt("idc_count")
	if err != nil {
		err = fmt.Errorf("机房总数输入非法，err:%v", err)
		errorMsg = "机房总数输入非法" 
		logs.Warn(err.Error())
			return
	}
	idc.Name = idc_name
	idc.Tag = idc_tag
	idc.Location = idc_location
	idc.Floor = idc_floor
	idc.RoomNum = idc_room
	idc.MechineCount = idc_count

	err = assetModel.CreateIdc(&idc)
	if err != nil {
		err = fmt.Errorf("添加IDC失败:%v", err)
		errorMsg = "添加IDC失败"  
	   	logs.Warn(err.Error())
	   	return
	}
	p.Data["json"] =  result
	p.ServeJSON()  
}


func (p *AssetController) AddConf(){
	errorMsg := "success"
	
	result := make(map[string]interface{})
	
	result["success"] = "true"
	result["message"] = errorMsg

	assetModel := model.NewAssetModel()
	var assetconf model.AssetConf
	var err error
	defer func(){
		if err != nil {
			result["success"] = "false"
			result["message"] = errorMsg
			p.Data["json"] =  result
			p.ServeJSON()  
		}
	}()
	
	//下面的值必须有合法的值
	
	asset_conf_name  := p.GetString("asset_conf_name")
	if len(asset_conf_name ) == 0 {
		err =  fmt.Errorf("资产配置不能未空")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}

	asset_conf_cpu := p.GetString("asset_conf_cpu")
	if len(asset_conf_cpu) == 0 {
		err =  fmt.Errorf("CPU不能未空")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}
	asset_conf_mem := p.GetString("asset_conf_mem")
	if len(asset_conf_mem) == 0 {
		err =  fmt.Errorf("内存不能为空")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}

	asset_conf_disk := p.GetString("asset_conf_disk")
	if len(asset_conf_disk) == 0 {
		err =  fmt.Errorf("硬盘不能为空")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}

	asset_conf_raid := p.GetString("asset_conf_raid")
	if len(asset_conf_raid) == 0 {
		err =  fmt.Errorf("阵列(raid)不能为空")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}

	asset_conf_detail := p.GetString("asset_conf_detail")



	assetconf.Name = asset_conf_name
	assetconf.Cpu = asset_conf_cpu
	assetconf.Memory = asset_conf_mem
	assetconf.Disk = asset_conf_disk
	assetconf.Raid = asset_conf_raid
	assetconf.Detail = asset_conf_detail

	err = assetModel.CreateAssetConf(&assetconf)
	if err != nil {
		err = fmt.Errorf("添加资产配置失败:%v", err)
		errorMsg = "添加资产配置失败"  
	   	logs.Warn(err.Error())
	   	return
	}
	p.Data["json"] =  result
	p.ServeJSON()  
	
}