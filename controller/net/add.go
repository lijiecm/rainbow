package net

import (
	"fmt"
	"github.com/astaxie/beego/logs"
	"rainbow/model"
	"rainbow/tools"
)

func (p *NetController) AddNetwork(){
	errorMsg := "success"
	
	result := make(map[string]interface{})
	
	result["success"] = "true"
	result["message"] = errorMsg
	
	networkModel := model.NewNetWorkModel()
	var network model.NetWork
	
	var err error
	defer func(){
		if err != nil {
			result["success"] = "false"
			result["message"] = errorMsg
			p.Data["json"] =  result
			p.ServeJSON()  
		}
	}()
	
	team := p.GetString("team")
	//下面的值必须有合法的值
	
	idc_id, err := p.GetInt("idc_id")
	if err != nil {
		err = fmt.Errorf("机房ID获取失败，err:%v", err)
		errorMsg = "机房ID获取失败，err" 
		logs.Warn(err.Error())
		return
	}

	net_env := p.GetString("net_env")
	if len(net_env) == 0 {
		err =  fmt.Errorf("环境不能为空")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}

	vlan, err := p.GetInt("vlan")
	if err != nil {
		err = fmt.Errorf("vlan获取失败，请输入正确的VlanId:%v", err)
		errorMsg = "vlan获取失败，请输入正确的VlanId，err" 
		logs.Warn(err.Error())
			return
	}

	route := p.GetString("route")
	if len(route) == 0 {
		err =  fmt.Errorf("网段获取失败，请输入正确的网段地址")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}

	netmask := p.GetString("netmask")
	if len(netmask) == 0 {
		err =  fmt.Errorf("掩码地址获取失败，请输入正确的掩码地址")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}

	gateway := p.GetString("gateway")
	if len(gateway) == 0 {
		err =  fmt.Errorf("网关获取失败，请输入正确的网关地址")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}

	net_type := p.GetString("net_type")
	if len(net_type) == 0 {
		err =  fmt.Errorf("获取网段类型失败")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}

	network.IdcId = idc_id
	network.Env = net_env
	network.Team = team
	network.Vlan = vlan
	network.Route = route
	network.Mask = netmask
	network.GateWay = gateway	
	netWorkId, err := networkModel.CreateNetWork(&network)
	if err != nil {
		err = fmt.Errorf("添加网段失败:%v", err)
		errorMsg = "添加网段失败"  
	   	logs.Warn(err.Error())
	   	return
	}

	ipList, err := tools.GetIpByNet(route, netmask)
	if err != nil{
		err = fmt.Errorf("网段添加成功，获取对应IP失败. err :%v", err)
		errorMsg = "获取网络IP失败"  
	   	logs.Warn(err.Error())
	   	return
	}
	// 添加IP的时候，去掉网段地址
	ipList = tools.DeleteStr(ipList,  gateway)
	ipModel := model.NetIpInfoModel{}
	for _, ip := range ipList{
		err = ipModel.CreateIp(ip, net_type,netWorkId)
		if err != nil {
			logs.Error("insert ip[%s] failed, networkid[%d], err:[%v]", ip, netWorkId, err)
		}
		
	}

	logs.Debug("netWorkId:%d", netWorkId)
	p.Data["json"] =  result
	p.ServeJSON()  
}
