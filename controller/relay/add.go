package relay

import (
	"github.com/astaxie/beego/logs"
	"rainbow/model"
	"fmt"
	"time"
)

func (p *RelayController) AddRole(){
	errorMsg := "success"
	
	result := make(map[string]interface{})
	
	result["success"] = "true"
	result["message"] = errorMsg
	
	newRelayModel := model.NewRelayModel()
	
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

	username := p.GetString("username")
	if len(username) == 0 {
		err =  fmt.Errorf("用户不可为空")
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
	
	days, err := p.GetInt("days")
	if err != nil {
		err = fmt.Errorf("获取授权时间失败，请输入正确的days:%v", err)
		errorMsg = "获取授权时间失败，请输入正确的days"
		logs.Warn(err.Error())
		return
	}

	relayRole, err := newRelayModel.GetRoleIdByRoleAndIp(host_id,role)
	if err != nil {
		err = fmt.Errorf("添加主机权限失败:err:%v", err)
		errorMsg = "添加主机权限失败"  
	   	logs.Warn(err.Error())
	   	return
	}
	relay_id := relayRole[0].Id
	var relayAuth model.RelayAuth
	relayAuth.RoleId = relay_id
	relayAuth.Username = username
	nowTime := time.Now()
    t := nowTime.String()
	start_time := t[:19]
	dt := nowTime.AddDate(0,0,days)
	end_time := dt.String()[:19]

	relayAuth.StartTime = start_time
	relayAuth.EndTime = end_time

	/* 导入  */
	err = newRelayModel.AddRelayAuth(relayAuth)
	if err != nil {
		err = fmt.Errorf("用户授权失败:err:%v", err)
		errorMsg = "用户授权失败"  
	   	logs.Warn(err.Error())
	   	return
	}
	p.Data["json"] =  result
	p.ServeJSON()  
}


func (p *RelayController) AddHostRole(){
	errorMsg := "success"
	
	result := make(map[string]interface{})
	
	result["success"] = "true"
	result["message"] = errorMsg
	
	newRelayModel := model.NewRelayModel()
	newHostModel := model.NewHostModel()
	
	var err error
	defer func(){
		if err != nil {
			result["success"] = "false"
			result["message"] = errorMsg
			p.Data["json"] =  result
			p.ServeJSON()  
		}
	}()

	host_role := p.GetString("host_role")
	if len(host_role) == 0 {
		err =  fmt.Errorf("主机角色不能为空")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}

	host_addr := p.GetString("host_addr")
	if len(host_addr) == 0 {
		err =  fmt.Errorf("用户不可为空")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}

	host, err:= newHostModel.GetHostByIp(host_addr)
	if err != nil {
		logs.Error("get hostId from Ip failed:")
		return
	}
	host_id := host[0].Id

	var relayRole model.RelayRole
	relayRole.Role = host_role
	relayRole.HostId = host_id
	
	err = newRelayModel.AddRelayRole(relayRole)
	if err != nil {
		err = fmt.Errorf("主机增加权限失败:err:%v", err)
		errorMsg = "主机增加权限失败"  
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
	nowTime := time.Now()
    t := nowTime.String()
	start_time := t[:19]
	dt := nowTime.AddDate(0,0,days)
	end_time := dt.String()[:19]

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


