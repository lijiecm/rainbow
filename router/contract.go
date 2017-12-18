package router
import (
	"github.com/astaxie/beego"
	"rainbow/controller/contract"
)
func init(){
	beego.Router("/contract/contract", &contract.ContractController{}, "*:Contract")   
	beego.Router("/contract/order", &contract.ContractController{}, "*:Order")  
}

