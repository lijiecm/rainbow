package contract

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
)

type ContractController struct {
	beego.Controller  
}


func (p *ContractController) Contract(){

	logs.Debug("enter contractlist controller")
	p.Layout = "layout/layout.html"  
	m := make(map[string]interface{})
	m["code"] = 200
	m["message"] = "success"
	m["type"] = "contract"

	p.Data["netmanage"] = m
	p.TplName = "contract/contract.html"
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
	
