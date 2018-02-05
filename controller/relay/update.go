package relay

import (
	"strconv"
	"github.com/astaxie/beego/logs"
	"rainbow/model"
	"fmt"
)

func (p *RelayController) UpdateRole(){
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


	relay_id, err := p.GetInt("relay_id")
	if err != nil {
		err = fmt.Errorf("获取授权ID失败，请输入正确的RelayId:%v", err)
		errorMsg = "获取授权ID失败，请输入正确的RelayId"
		logs.Warn(err.Error())
		return
	}

	role := p.GetString("role")
	if len(role) == 0 {
		err =  fmt.Errorf("主机角色不能为空")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}

	ip := p.GetString("ip")
	if len(ip) == 0 {
		err = fmt.Errorf("获取主机ID失败，请输入正确的HostId:%v", err)
		errorMsg = "获取主机ID失败，请输入正确的HostId"
		logs.Warn(err.Error())
		return
	}
	
	var relayAuth model.RelayAuth
	relayAuthList, err := newRelayModel.GetRelayAuthById(relay_id)
	if err != nil {
		err = fmt.Errorf("获取授权角色ID失败:err:%v", err)
		errorMsg = "获取授权角色ID失败"  
	   	logs.Warn(err.Error())
	   	return
	}
	
	roleIdMap , err := newRelayModel.GetRoleIdByHostAndId(ip, role)
	if err != nil{
		err = fmt.Errorf("获取授权角色ID失败,请先确定主机存在这个用户:err:%v", err)
		errorMsg = "获取授权角色ID失败,请先确定主机存在这个用户" 
	   	logs.Warn(err.Error())
	   	return
	}

	roleId := roleIdMap[0]["id"]
	relayAuth.Id = relay_id
	strRoleId := roleId.(string)
	rId,_ := strconv.Atoi(strRoleId)
	relayAuth.RoleId = rId
	relayAuth.Username = relayAuthList[0].Username
	relayAuth.StartTime = relayAuthList[0].StartTime
	relayAuth.EndTime = relayAuthList[0].EndTime
	err = newRelayModel.UpdatelayRole(relayAuth)
	if err != nil {
		err = fmt.Errorf("用户授权失败:err:%v", err)
		errorMsg = "用户授权失败"  
	   	logs.Warn(err.Error())
	   	return
	}
	p.Data["json"] =  result
	p.ServeJSON()  
}