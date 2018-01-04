package host

import (
	"github.com/astaxie/beego/logs"
	"rainbow/model"
	"fmt"
)

func (p *HostController) DelHost(){
	
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

	hostId, err := p.GetInt("host_id")
	if err != nil {
		err :=  fmt.Errorf("获取主机ID失败")
		errorMsg =  err.Error()
		logs.Warn("get host id failed, err:%v",err)
		return
	}

	hostModel := model.NewHostModel()
	err = hostModel.DelHost(hostId)
	if err != nil {
		err :=  fmt.Errorf("删除主机失败")
		errorMsg =  err.Error()
		logs.Warn("del host id failed, err:%v",err)
		return
	}
	result["message"] = "del host true"
	p.Data["json"] =  result
	
	p.ServeJSON()  	
}