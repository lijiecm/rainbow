package relay

import (
	"github.com/astaxie/beego/logs"
	"rainbow/model"
	"fmt"
)

func (p *RelayController) AddHostRole(){
	errorMsg := "success"
	
	result := make(map[string]interface{})
	
	result["success"] = "true"
	result["message"] = errorMsg
	
	newRelayModel := model.NewRelayModel()
	var relayRole model.RelayRole
	
	var err error
	defer func(){
		if err != nil {
			result["success"] = "false"
			result["message"] = errorMsg
			p.Data["json"] =  result
			p.ServeJSON()  
		}
	}()

	role := p.GetString("role")
	if len(role) == 0 {
		err =  fmt.Errorf("主机角色不能为空")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}

	host_id, err := p.GetInt("host_id")
	if err != nil {
		err = fmt.Errorf("获取主机ID失败，请输入正确的HostId:%v", err)
		errorMsg = "获取主机ID失败，请输入正确的HostId"
		logs.Warn(err.Error())
		return
	}

	relayRole.Role = role
	relayRole.HostId = host_id
	
	err = newRelayModel.AddRelayRole(relayRole)
	if err != nil {
		err = fmt.Errorf("添加主机权限失败:err:%v", err)
		errorMsg = "添加主机权限失败"  
	   	logs.Warn(err.Error())
	   	return
	}

	p.Data["json"] =  result
	p.ServeJSON()  
}


func (p *RelayController) AddRelayAuth(){
	errorMsg := "success"
	
	result := make(map[string]interface{})
	
	result["success"] = "true"
	result["message"] = errorMsg
	
	newRelayModel := model.NewRelayModel()
	var relayAuth model.RelayAuth
	
	var err error
	defer func(){
		if err != nil {
			result["success"] = "false"
			result["message"] = errorMsg
			p.Data["json"] =  result
			p.ServeJSON()  
		}
	}()

	username := p.GetString("username")
	if len(username) == 0 {
		err =  fmt.Errorf("获取用户名失败")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}

	role_id, err := p.GetInt("role_id")
	if err != nil {
		err = fmt.Errorf("获取角色ID失败，请输入正确的RoleId:%v", err)
		errorMsg = "获取角色ID失败，请输入正确的RoleId"
		logs.Warn(err.Error())
		return
	}

	//days需要创建一个start_time为当前时间，并且将当前时间加上days为授权结束时间
	days, err := p.GetInt("days")
	if err != nil { 
		//如果传入的授权时间为空，则默认为1天权限
		days = 1
		return
	}
	logs.Debug("%d",days)

	//days需要创建一个start_time为当前时间，并且将当前时间加上days为授权结束时间
	start_time := "aaa"
	end_time := "bbb"

	relayAuth.Username = username
	relayAuth.RoleId = role_id
	relayAuth.StartTime = start_time
	relayAuth.EndTime = end_time
	
	err = newRelayModel.AddRelayAuth(relayAuth)
	if err != nil {
		err = fmt.Errorf("授权失败:err:%v", err)
		errorMsg = "授权失败"  
	   	logs.Warn(err.Error())
	   	return
	}

	p.Data["json"] =  result
	p.ServeJSON()  
}


