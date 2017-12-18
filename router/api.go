package router
import (
	"github.com/astaxie/beego"
	"zuoye/cmdb/controller/api"
)
func init(){
	beego.Router("/api/getHostInfoBySn", &api.ApiHostController{}, "*:GetHostInfo")
	beego.Router("/api/updateIpStatus", &api.ApiNetController{}, "*:UpdateIpStatus")
	beego.Router("/api/getIpAddr", &api.ApiNetController{}, "*:GetIpAddr")
}