package model

import (
	"github.com/astaxie/beego/logs"
)

type HostModel struct {
}

func NewHostModel() *HostModel {
	hostModel := &HostModel {
	}
	return hostModel
}


func (p *HostModel)HostList()(list []*Host, err error){
	sql := "select id, app_name, mechine_type, ip, oobip, env, asset_id, hostname, os_id, owner, status from host"
	err = Db.Select(&list, sql)
	if err != nil {
		logs.Warn("select host from mysql failed, err:%v sql:%v", err, sql)
		return
	}
	return
}


func (p *HostModel)CreateHost(host *Host)(err error){
	
	sql := "insert into host(app_name,  ip, oobip, env, asset_id, hostname, os_id, owner, status) values (?,?,?,?,?,?,?,?,?)"
	_, err = Db.Exec(sql, host.AppName, host.IP, host.OobIp, host.Env, host.AssetId, host.HostName, host.OsId,host.Owner, host.Status)
	if err != nil {
		logs.Warn("insert from mysql failed, err:%v sql:%v", err, sql)
		return
	}
	logs.Debug("insert host into database succ")
	return
}

