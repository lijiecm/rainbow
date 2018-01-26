package router
import (
	"github.com/astaxie/beego"
	"rainbow/controller/relay"
)
func init(){
	beego.Router("/relay/host", &relay.RelayController{}, "*:GetHostRoleByUser")
	beego.Router("/relay/role", &relay.RelayController{}, "*:GetHostRole")
	beego.Router("/relay/addrole", &relay.RelayController{}, "*:AddRole")
	beego.Router("/relay/addhostrole", &relay.RelayController{}, "*:AddHostRole")
}