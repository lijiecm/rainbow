package asset


import (
	"github.com/astaxie/beego/logs"
	"rainbow/model"
	"fmt"
)

func (p *AssetController) DelIdc(){
	
	errorMsg := "success"
	
	result := make(map[string]interface{})
	
	result["success"] = "true"
	result["message"] = errorMsg

	var err error
	defer func(){
		if err != nil {
			result["success"] = "false"
			result["message"] = errorMsg
			p.Data["json"] =  result
			p.ServeJSON()  
		}
	}()

	idcId, err := p.GetInt("idc_id")
	if err != nil {
		err :=  fmt.Errorf("获取机房ID失败")
		errorMsg =  err.Error()
		logs.Warn("get idc id failed, err:%v",err)
		return
	}

	assetModel := model.NewAssetModel()
	err = assetModel.DelIdc(idcId)
	if err != nil {
		err :=  fmt.Errorf("删除机房失败")
		errorMsg =  err.Error()
		logs.Warn("del idc id failed, err:%v",err)
		return
	}
	result["message"] = "del idc true"
	p.Data["json"] =  result
	
	p.ServeJSON()  	
}