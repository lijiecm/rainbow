package relay

import (
	"github.com/astaxie/beego/logs"
	"rainbow/model"
	"fmt"
)

func (p *RelayController) DelRole(){
	
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

	relay_id, err := p.GetInt("relay_id")
	if err != nil {
		err :=  fmt.Errorf("获取主机ID失败")
		errorMsg =  err.Error()
		logs.Warn("get host id failed, err:%v",err)
		return
	}

	relayModel := model.NewRelayModel()
	err = relayModel.DelRelay(relay_id)
	if err != nil {
		err :=  fmt.Errorf("删除权限失败")
		errorMsg =  err.Error()
		logs.Warn("del relay id failed, err:%v",err)
		return
	}
	result["message"] = "del relay true"
	p.Data["json"] =  result
	
	p.ServeJSON()  	
}



func (p *RelayController) DelHostRole(){
	
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

	role_id, err := p.GetInt("role_id")
	if err != nil {
		err :=  fmt.Errorf("获取主机角色ID失败")
		errorMsg =  err.Error()
		logs.Warn("get role id failed, err:%v",err)
		return
	}

	relayModel := model.NewRelayModel()
	err = relayModel.DelHostRole(role_id)
	if err != nil {
		err :=  fmt.Errorf("删除主机角色失败")
		errorMsg =  err.Error()
		logs.Warn("del role id failed, err:%v",err)
		return
	}
	result["message"] = "del relay role true"
	p.Data["json"] =  result
	
	p.ServeJSON()  	
}