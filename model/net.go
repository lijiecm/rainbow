package model

import (
	"github.com/astaxie/beego/logs"
)

type NetIpInfoModel struct {
}

type NetWorkModel struct {
}

func NewNetWorkModel() *NetWorkModel {
	netWorkModel := &NetWorkModel {
	}
	return netWorkModel
}


func NewNetIpInfoModel() *NetIpInfoModel {
	netIpInfoModel := &NetIpInfoModel {
	}
	return netIpInfoModel
}

func (p *NetWorkModel)GetNetWork()(list []NetWork, err error){
	
	sql := "select id, idc_id, env, team, vlan, route, mask, gateway from network"
	err = Db.Select(&list, sql)
	if err != nil {
		logs.Warn("select network from mysql failed, err:%v sql:%v", err, sql)
		return
	}
	return
}

func (p *NetWorkModel)CreateNetWork(netWork *NetWork)(netWorkId int, err error){
	
	sql := "insert into network(idc_id,  env, team, vlan, route, mask, gateway) values (?,?,?,?,?,?,?)"
	v, err := Db.Exec(sql, netWork.IdcId, netWork.Env, netWork.Team, netWork.Vlan, netWork.Route, netWork.Mask, netWork.GateWay)
	
	//logs.Debug("Last:%d, Row:%d, netWorkId:%d",int(v.LastInsertId), int(v.RowsAffected), netWork.NetWorkId)
	if err != nil {
		logs.Warn("insert from mysql failed, err:%v sql:%v", err, sql)
		return
	}

	netId, err := v.LastInsertId()
	if err != nil{
		logs.Warn("insert network to mysql success, get netId failed, err: %s",err)
		netWorkId = 0  
		return
	}
	netWorkId = int(netId)
	logs.Debug("insert network into database succ")
	return
}


func (p *NetIpInfoModel)CreateIp(ip ,iptype string, netWorkId int)(err error){
	
	sql := "insert into ip(addr,  iptype, network_id, status) values (?,?,?,?)"
	_, err = Db.Exec(sql, ip, iptype, netWorkId, 0)
	if err != nil {
		logs.Warn("insert from mysql failed, err:%v sql:%v", err, sql)
		return
	}

	logs.Debug("insert ip[%s] into database succ", ip)
	return
}

func (p *NetIpInfoModel)GetFreeIp(gateway string, status ,limitCount int)(list []string,err error){
	//一次返回20个IP，也就是说最大支持20个宿主机的并发安装，然后让在取一个随机值
	sql := "select ip.addr from ip,network where network.gateway = ? and ip.status = ? and ip.network_id= network.id limit ?"
	err = Db.Select(&list, sql, gateway, status, limitCount)
	if err != nil {
		logs.Warn("select ip from mysql failed, err:%v sql:%v", err, sql)
		return
	}
	return
}


func (p *NetIpInfoModel)UpdateIpStatus(addr string)(updateNum int, err error){
	
	/*
	更新主机带上状态去更新，在并发的前提下，如果前一个请求更新之后，则会更新失败，通知前端再次发出请求
	*/
	sql := "UPDATE ip SET status = 1 where addr=? and status = 0"
	v, err := Db.Exec(sql, addr)
	if err != nil {
		logs.Warn("update from mysql failed, err:%v sql:%v", err, sql)
		return
	}
	ipNum, err := v.RowsAffected()
	if err != nil {
		logs.Warn("update from mysql failed, err:%v sql:%v", err, sql)
		return
	}
	updateNum = int(ipNum)
	logs.Debug("update host into database succ")
	return
}


func (p *NetWorkModel)GetAllIp()(list []Ip, err error){
	
	sql := "select id, addr, ip_type, use_type, host_id, network_id, status from ip"
	err = Db.Select(&list, sql)
	if err != nil {
		logs.Warn("select ip from mysql failed, err:%v sql:%v", err, sql)
		return
	}
	return
}
