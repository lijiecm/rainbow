package model

import (
	//"github.com/astaxie/beego/logs"
)

type HostInfoModel struct {
}

type NetInfoModel struct {
}

func NewNetInfoModel() *NetInfoModel {
	netInfoModel := &NetInfoModel {
	}
	return netInfoModel
}

func(p *NetInfoModel) GetNetIp(sn string)(err error){
	return
	
}


	


