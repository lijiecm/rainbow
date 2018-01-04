package router
import (
	"github.com/astaxie/beego"
	"rainbow/controller/host"
)
func init(){
	beego.Router("/host/host", &host.HostController{}, "*:Host")
	beego.Router("/host/addhost", &host.HostController{}, "*:AddHost")
	beego.Router("/host/delhost", &host.HostController{}, "*:DelHost")
	beego.Router("/host/updatehost", &host.HostController{}, "*:UpdateHost")
}