package model

import (
	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
	"fmt"
)

type HostModel struct {
}

func NewHostModel() *HostModel {
	hostModel := &HostModel {
	}
	return hostModel
}

func init() {
	orm.RegisterModel(new(Host))
}


func (p *HostModel)HostList()(list []*Host, err error){
	logs.Debug("select hostlist info")
	o := orm.NewOrm()

	qs := o.QueryTable("host")
	_, err = qs.All(&list)
	if err != nil {
		logs.Warn("select host from mysql failed, err:%v", err)
		return
	}
	return
}

func (p *HostModel)GetHostByIp(ip string)(host []*Host, err error){

	o := orm.NewOrm()
	qs := o.QueryTable("host")
	qs.Filter("ip",ip).All(&host)

	if len(host) == 0 {
		err =  fmt.Errorf("host_ip[%s] is not exists", ip)
		logs.Error("host_ip[%s] is not exists", ip)
		return
	}

	return
}

func (p *HostModel)CreateHost(host Host)(err error){

	o := orm.NewOrm()
	id, err := o.Insert(&host)
	if err != nil {
		logs.Warn("insert from mysql failed, err:%v", err)
		return
	}
	logs.Debug("insert host into database succ, id:[%d]", id)
	return
}

func (p *HostModel) UpdateHost(host Host)(err error){
	o := orm.NewOrm()
	id, err := o.Update(&host)
	if err != nil {
		logs.Warn("update host from mysql failed, err:%v", err)
		return
	}
	logs.Debug("update host into database succ, id:[%d]", id)
	return
}

func (p *HostModel)DelHost(hostId int)(err error){
	o := orm.NewOrm()
	num, err := o.Delete(&Host{Id: hostId})
	if err !=nil {
		logs.Error("del host failed, err:%v", err)
		return
	}
	logs.Debug("delete host succ, id:[%d], num:[%d]", hostId, num)
	return
}