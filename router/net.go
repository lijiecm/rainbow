package router
import (
	"github.com/astaxie/beego"
	"zuoye/cmdb/controller/net"
)
func init(){
	beego.Router("/net/network", &net.NetController{}, "*:Network")   
	beego.Router("/net/ip", &net.NetController{}, "*:Ip") 
	beego.Router("/net/addnetwork", &net.NetController{}, "*:AddNetwork") 
}

