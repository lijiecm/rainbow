package model

import (
	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
	//"fmt"
)

type RelayHost struct {
	Id int
	Username string 
	Hostname string 
	Ip string 
	Role string 
	StartTime string 
	EndTime string 
}

type RelayHostRole struct {
	Id int
	Hostname string 
	Ip string 
	Role string 
}


type RelayModel struct {
}

func init() {
	orm.RegisterModel(new(RelayRole))
	orm.RegisterModel(new(RelayAuth))
}

func NewRelayModel() *RelayModel {
	relayModel := &RelayModel {
	}
	return relayModel
}

/*
func (p *RelayModel)GetHostRoleByUser(username string)(relayList []*RelayAuth ,err error){

	o := orm.NewOrm()
	qs := o.QueryTable("relay_auth")
	qs.Filter("username",username).All(&relayList)
	if len(relayList) != 0 {
		logs.Error("username[%s] is not exists", username)
		return
	}

	return
}
*/

func (p *RelayModel)GetHostRoleByUser(username string)(relayList []*RelayHost,err error){

	o := orm.NewOrm()
	_, err = o.Raw("select ra.id,ra.username,h.hostname,h.ip,rr.role,ra.start_time,ra.end_time from host h, relay_auth ra, relay_role rr where h.id = rr.host_id and ra.role_id = rr.id and ra.username = ?;",username).QueryRows(&relayList)
	if err != nil {
		logs.Error("获取用户权限信息失败")
		return
	}
	return
}

func (p *RelayModel)GetRelayRoleByHostId(host_id int)(roleList []*RelayHostRole,err error){

	o := orm.NewOrm()
	if host_id == 0 {
		_, err = o.Raw("select rr.id,h.hostname,h.ip,rr.role from host h, relay_role rr where h.id = rr.host_id;").QueryRows(&roleList)
		} else {
		_, err = o.Raw("select rr.id,h.hostname,h.ip,rr.role from host h, relay_role rr where h.id = rr.host_id and rr.host_id = ?;",host_id).QueryRows(&roleList)

	
	}
	
	if len(roleList) == 0 {
		logs.Error("host_id[%d] is not exists", host_id)
		return
	}

	return
}

func (p *RelayModel)GetRoleIdByRoleAndIp(host_id int,role string)(relayRole []*RelayRole,err error){

	o := orm.NewOrm()
	qs := o.QueryTable("relay_role")
	qs.Filter("host_id",host_id).Filter("role",role).All(&relayRole)
	if len(relayRole) == 0 {
		logs.Error("host_id[%d] and role[%s] is not exists", host_id, role)
		return
	}
	return
}

func (p *RelayModel)AddRelayRole(relayRole RelayRole)(err error){

	o := orm.NewOrm()
	_, err = o.Insert(&relayRole)
	if err != nil {
		logs.Warn("insert from mysql failed, err:%v", err)
		return
	}

	logs.Debug("insert role[%s] into database succ", relayRole)
	return
}

func (p *RelayModel)AddRelayAuth(relayAuth RelayAuth)(err error){

	o := orm.NewOrm()
	_, err = o.Insert(&relayAuth)
	if err != nil {
		logs.Warn("insert from mysql failed, err:%v", err)
		return
	}

	logs.Debug("insert role[%s] into database succ", relayAuth)
	return
}