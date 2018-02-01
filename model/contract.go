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
	logs.Debug("insert host into database succ, id:[%d]", id)
	return
}
