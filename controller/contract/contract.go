package contract

import (
	//"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"rainbow/controller"
	"rainbow/model"
	"fmt"
)

type ContractController struct {
	controller.AuthViewController 
}


func (p *ContractController) Contract(){

	logs.Debug("enter contractlist controller")
	p.TplName = "contract/contract.html"
	p.Layout = "layout/layout.html"  
	errorMsg := "success"
	var err error
	defer func(){
		if err != nil {
			p.Data["error"] = errorMsg
			p.TplName = "layout/error.html"
		}
	}()

	contractModel := model.NewContractModel()
	contractList,err := contractModel.GetContractList()

	if err != nil {
		err =  fmt.Errorf("获取主机列表失败")
		errorMsg =  err.Error()
		logs.Warn("get asset list failed, err:%v", err)
		return
	}

	logs.Info("%v", contractList)
	p.Data["contract_list"] = contractList
	
	return
	
}


func (p *ContractController) Order(){
	
		logs.Debug("enter contractlist controller")
		p.Layout = "layout/layout.html"  
		m := make(map[string]interface{})
		m["code"] = 200
		m["message"] = "success"
		m["type"] = "order"
	
		p.Data["netmanage"] = m
		p.TplName = "contract/order.html"
	}
	
