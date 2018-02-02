package router
import (
	"github.com/astaxie/beego"
	"rainbow/controller/contract"
)
func init(){
	beego.Router("/contract/contract", &contract.ContractController{}, "*:Contract")   
	beego.Router("/contract/addcontract", &contract.ContractController{}, "*:AddContract")  
	beego.Router("/contract/updatecontract", &contract.ContractController{}, "*:UpdateContract")
	beego.Router("/contract/delcontract", &contract.ContractController{}, "*:DelContract")
	beego.Router("/contract/order", &contract.ContractController{}, "*:Order")  
}

