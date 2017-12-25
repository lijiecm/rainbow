package router
import (
	"github.com/astaxie/beego"
	//"rainbow/controller/asset"
	"rainbow/controller/login"
)
func init(){
	beego.Router("/", &login.LoginViewController{})
	beego.Router("/login", &login.LoginViewController{})
	beego.Router("/dologin", &login.LoginController{}, "*:DoLogin")
	beego.Router("/logout", &login.LogoutViewController{})
}