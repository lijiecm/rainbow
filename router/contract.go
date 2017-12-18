package router
import (
	"github.com/astaxie/beego"
	"zuoye/cmdb/controller/contract"
)
func init(){
	beego.Router("/contract/contract", &contract.ContractController{}, "*:Contract")   
	beego.Router("/contract/order", &contract.ContractController{}, "*:Order")  
}

