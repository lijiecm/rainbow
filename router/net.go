package router
import (
	"github.com/astaxie/beego"
	"rainbow/controller/net"
)
func init(){
	beego.Router("/net/network", &net.NetController{}, "*:Network")   
	beego.Router("/net/ip", &net.NetController{}, "*:Ip") 
	beego.Router("/net/addnetwork", &net.NetController{}, "*:AddNetwork") 
}

