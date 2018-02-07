package router
import (
	"github.com/astaxie/beego"
	"rainbow/controller/api"
)
func init(){
	beego.Router("/api/getHostInfoBySn", &api.ApiHostController{}, "*:GetHostInfo")
	beego.Router("/api/updateIpStatus", &api.ApiNetController{}, "*:UpdateIpStatus")
	beego.Router("/api/getIpAddr", &api.ApiNetController{}, "*:GetIpAddr")
	beego.Router("/api/addOperaLog", &api.ApiRelayController{}, "*:CreateOperaLog")
}