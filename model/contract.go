package model

import (
	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
)

type ContractModel struct {
}

func NewContractModel() *ContractModel {
	contractModel := &ContractModel {
	}
	return contractModel
}

func init() {
	orm.RegisterModel(new(Contract))
	orm.RegisterModel(new(HardwareOrder))
}


func (p *ContractModel)GetContractList()(list []*Contract, err error){
	logs.Debug("select contract info")
	o := orm.NewOrm()

	qs := o.QueryTable("contract")
	_, err = qs.All(&list)
	if err != nil {
		logs.Warn("select contract from mysql failed, err:%v", err)
		return
	}
	return
}


func (p *ContractModel)CreateContract(contract Contract)(err error){

	o := orm.NewOrm()
	id, err := o.Insert(&contract)
	if err != nil {
		logs.Warn("insert from mysql failed, err:%v", err)
		return
	}
	logs.Debug("insert contract into database succ, id:[%d]", id)
	return
}


func (p *ContractModel)UpdateContract(contract Contract)(err error){

	o := orm.NewOrm()
	id, err := o.Update(&contract)
	if err != nil {
		logs.Error("update contract failed, err:%v", err)
		return
	}
	logs.Debug("update contract into database succ, id:[%d]", id)
	return
}

func (p *ContractModel)DelContract(contractId int)(err error){
	o := orm.NewOrm()
	num, err := o.Delete(&Contract{Id: contractId})
	if err !=nil {
		logs.Error("del contract failed, err:%v", err)
		return
	}
	logs.Debug("delete contract succ, id:[%d], num:[%d]", contractId, num)
	return
}


func (p *ContractModel)GetOrderList()(list []*HardwareOrder, err error){
	logs.Debug("select order info")
	o := orm.NewOrm()

	qs := o.QueryTable("hardware_order")
	_, err = qs.All(&list)
	if err != nil {
		logs.Warn("select order from mysql failed, err:%v", err)
		return
	}
	return
}

func (p *ContractModel)CreateOrder(hardwareOrder HardwareOrder)(err error){

	o := orm.NewOrm()
	id, err := o.Insert(&hardwareOrder)
	if err != nil {
		logs.Warn("insert from mysql failed, err:%v", err)
		return
	}
	logs.Debug("insert contract into database succ, id:[%d]", id)
	return
}


func (p *ContractModel)UpdateOrder(hardwareOrder HardwareOrder)(err error){

	o := orm.NewOrm()
	id, err := o.Update(&hardwareOrder)
	if err != nil {
		logs.Error("update order failed, err:%v", err)
		return
	}
	logs.Debug("update order into database succ, id:[%d]", id)
	return
}

func (p *ContractModel)DelOrder(orderId int)(err error){
	o := orm.NewOrm()
	num, err := o.Delete(&HardwareOrder{Id: orderId})
	if err !=nil {
		logs.Error("del order failed, err:%v", err)
		return
	}
	logs.Debug("delete order succ, id:[%d], num:[%d]", orderId, num)
	return
}