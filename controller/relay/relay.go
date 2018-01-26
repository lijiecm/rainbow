package relay

import (
	"github.com/astaxie/beego/logs"
	"rainbow/controller"
	"rainbow/model"
	"fmt"
)

type RelayController struct {
	controller.AuthViewController
}


func (p *RelayController) GetHostRoleByUser(){

	logs.Debug("enter get host role controller")
	p.Layout = "layout/layout.html"  
	p.TplName = "relay/relay.html"

	errorMsg := "success"

	var err error
	defer func(){
		if err != nil {
			p.Data["error"] = errorMsg
			p.TplName = "layout/error.html"
		}
	}()

	//username := p.GetString("username")
	//因为传入的是session中的是interface类型，所以需要转换为string
	username := p.Data["username"].(string)
	if len(username) == 0 {
		err =  fmt.Errorf("用户名不能为空")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}

	newRelayModel := model.NewRelayModel()
	hostRoleList, err:= newRelayModel.GetHostRoleByUser(username)
	logs.Info("=====>, %v", hostRoleList)
	
	if err != nil {
		err =  fmt.Errorf("获取全权限列表失败")
		errorMsg =  err.Error()
		logs.Warn("get relay list failed, err:%v", err)
		return
	}

	host_id := 7
	roleList, err := newRelayModel.GetRelayRoleByHostId(host_id)

	p.Data["host_role_list"] = hostRoleList
	p.Data["role_list"] = roleList
	return
}

func (p *RelayController) GetHostRole(){

	logs.Debug("enter get host role controller")
	p.Layout = "layout/layout.html"  
	p.TplName = "relay/role.html"

	errorMsg := "success"

	var err error
	defer func(){
		if err != nil {
			p.Data["error"] = errorMsg
			p.TplName = "layout/error.html"
		}
	}()
	newHostModel := model.NewHostModel()
	var host_id int
	host_addr := p.GetString("host_addr")
	if len(host_addr) == 0{
		// 当获取不传入host_addr的时候，设置host_id为0，这样就去数据库中取出所有的主机权限信息
		host_id = 0
	} else {
		host, err := newHostModel.GetHostByIp(host_addr)
		if err != nil {
			logs.Error("get host by ip failed, err:%v", err)
			return
		}
		host_id = host[0].Id
	}


	newRelayModel := model.NewRelayModel()
	roleList, err := newRelayModel.GetRelayRoleByHostId(host_id)
	if err != nil {
		logs.Error("get host role failed")
		return
	}

	p.Data["role_list"] = roleList
	p.Data["IsAdmin"] = true
	return
}
