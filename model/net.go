package model

import (
	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
	"fmt"
)

type NetIpInfoModel struct {
}

type NetWorkModel struct {
}


func init() {
	orm.RegisterModel(new(Ip))
	orm.RegisterModel(new(Network))
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

func (p *NetWorkModel)GetNetWork()(list []*Network, err error){

	o := orm.NewOrm()

	qs := o.QueryTable("network")
	_, err = qs.All(&list)
	if err != nil {
		logs.Warn("select network from mysql failed, err:%v", err)
		return
	}
	return
}

func (p *NetWorkModel)CreateNetWork(network Network)(netWorkId int, err error){
	
	o := orm.NewOrm()
	id, err := o.Insert(&network)
	if err != nil {
		logs.Warn("insert from mysql failed, err:%v", err)
		return
	}
	netWorkId = int(id)
	logs.Debug("insert network into database succ, id:[%d]", netWorkId)
	return
}

func (p *NetIpInfoModel)CreateIp(ip Ip)(err error){

	o := orm.NewOrm()
	_, err = o.Insert(&ip)
	if err != nil {
		logs.Warn("insert from mysql failed, err:%v", err)
		return
	}

	logs.Debug("insert ip[%s] into database succ", ip)
	return
}

func (p *NetIpInfoModel)GetFreeIp(gateway string, status ,limitCount int)(ipList []string,err error){
	//一次返回20个IP，也就是说最大支持20个宿主机的并发安装，然后让在取一个随机值
	//sql := "select ip.addr from ip,network where network.gateway = ? and ip.status = ? and ip.network_id= network.id limit ?"
	/*
	var ipList []*Ip
	o := orm.NewOrm()
	qs := o.QueryTable("ip")
	qs.Filter("network__gateway",gateway,"ip__status",status,"ip__network_id","network__id").Limit(limitCount)
	if len(ipList) != 0 {
		logs.Error("select ip from mysql failed")
		return
	}
	ip = ipList[0].Addr
	*/

	var ips []Ip
	o := orm.NewOrm()
	num, err := o.Raw("select ip.addr from ip,network where network.gateway = ? and ip.status = ? and ip.network_id= network.id limit ?", gateway,status,limitCount).QueryRows(&ips)
	if num == 0 {
		logs.Error("获取不到地址哦")
		return
	}
	if err != nil {
		logs.Error("获取IP地址失败")
		return
	}
	fmt.Println(ips)
	for _, ip := range ips{
		ipList = append(ipList,ip.Addr)
	}
	fmt.Println(ipList)
	return
}

func (p *NetIpInfoModel)UpdateIpStatus(ip string, oldStatus,status int)(err error){
	
	/*
	更新主机带上状态去更新，在并发的前提下，如果前一个请求更新之后，则会更新失败，通知前端再次发出请求
	sql := "UPDATE ip SET status = 1 where addr=? and status = 0"
	*/
	
	o := orm.NewOrm()
	//批量更新
	logs.Debug("!!!!!!===>ip[%s], status[%d],oldStatus[%d]",ip,status,oldStatus)
	num, err := o.QueryTable("ip").Filter("addr",ip).Filter("status",oldStatus).Update(orm.Params{
		"status":status,
	})

	if err != nil {
		logs.Error("update ip failed, err:%v", err)
		return
	}

	updateNum := int(num)
	if updateNum == 0 {
		errMsg :=  fmt.Errorf("未找到需要更新的IP地址，请确定获取到的IP地址正确")
		logs.Warn("update ip status failed , ipnum is 0 , err:%v",errMsg)
		err = errMsg
		return
	}
	logs.Debug("update host into database succ")
	return
}

func (p *NetWorkModel)GetAllIp()(list []*Ip, err error){
	
	logs.Debug("select ip info")
	o := orm.NewOrm()

	qs := o.QueryTable("ip")
	_, err = qs.All(&list)
	if err != nil {
		logs.Error("select ip from mysql failed, err:%v", err)
		return
	}
	return
}
