package asset


import (
	"github.com/astaxie/beego/logs"
	"rainbow/model"
	"fmt"
)


func (p *AssetController) UpdateIdc(){
	errorMsg := "success"
	
	result := make(map[string]interface{})
	
	result["success"] = "true"
	result["message"] = errorMsg

	assetModel := model.NewAssetModel()
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

	idc_id, err := p.GetInt("idc_id")
	if err != nil {
		err = fmt.Errorf("获取机房id非法，err:%v", err)
		errorMsg = "获取机房id非法" 
		logs.Warn(err.Error())
			return
	}
	
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


	err = assetModel.UpdateIdc(idc_name,idc_tag,idc_location,idc_floor,idc_room,idc_count,idc_id )
	if err != nil {
		err = fmt.Errorf("更新IDC失败:%v", err)
		errorMsg = "更新IDC失败"  
	   	logs.Warn(err.Error())
	   	return
	}
	p.Data["json"] =  result
	p.ServeJSON()  
}
