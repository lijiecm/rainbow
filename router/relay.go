package router
import (
	"github.com/astaxie/beego"
	"rainbow/controller/relay"
)
func init(){
	beego.Router("/relay/host", &relay.RelayController{}, "*:GetHostRoleByUser")
	beego.Router("/relay/role", &relay.RelayController{}, "*:AddRelayAuth")
	beego.Router("/relay/addrole", &relay.RelayController{}, "*:AddHostRole")
}