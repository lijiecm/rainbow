package router
import (
	"github.com/astaxie/beego"
	"rainbow/controller/relay"
)
func init(){
	beego.Router("/relay/host", &relay.RelayController{}, "*:GetHostRoleByUser")
	beego.Router("/relay/role", &relay.RelayController{}, "*:GetHostRole")
	beego.Router("/relay/addrole", &relay.RelayController{}, "*:AddRole")
	beego.Router("/relay/updaterole", &relay.RelayController{}, "*:UpdateRole")
	beego.Router("/relay/delrole", &relay.RelayController{}, "*:DelRole")
	beego.Router("/relay/addhostrole", &relay.RelayController{}, "*:AddHostRole")
	beego.Router("/relay/delhostrole", &relay.RelayController{}, "*:DelHostRole")
}