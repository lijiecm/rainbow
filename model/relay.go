package model

import (
	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
	//"fmt"
)

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