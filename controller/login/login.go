package login

import (
	"github.com/astaxie/beego/logs"
	"rainbow/model"
	"rainbow/tools"
	//"github.com/astaxie/beego"
	"net/http"
	"rainbow/controller"
)

// 登录页面
type LoginViewController struct {
	controller.BaseController
}

// 登录API
type LoginController struct {
	controller.BaseController
}

// 退出登录页面
type LogoutViewController struct {
	controller.BaseController
}

// 退出登录API
type LogoutController struct {
	controller.BaseController
}

func (this *LoginViewController) Get() {
	this.TplName = "login.html"
}

// DoLogin登录用户
func (this *LoginController) DoLogin() {
	username := this.GetString("username")
	password := this.GetString("password")
	//logs.Debug("======> username[%s], password[%s]",username,password)
	if username == "" || password == "" {
		this.ResponseErrorCode(tools.ParameterError, http.StatusBadRequest, "")
	}

	user, err := model.GetUserByUsername(username)
	if err != nil {
		logs.Debug("ivaid username,>>>")
		this.ResponseErrorCode(tools.UsernameError, http.StatusBadRequest, err.Error())
	}
	if user.Frozen {
		logs.Debug("username frozen,>>>")
		this.ResponseErrorCode(tools.LoginFrozenError, http.StatusBadRequest, "")
	}
	if !user.MatchPassword(password) {
		logs.Debug("ivaid password,>>>")
		this.ResponseErrorCode(tools.PasswordError, http.StatusBadRequest, "")
	}
	sess,_ := controller.GlobalSessions.SessionStart(this.Ctx.ResponseWriter, this.Ctx.Request)
	sess.Set("_user_id_", user.Id)
	this.ResponseOk()
}

func (this *LogoutViewController) Get() {
	this.DestroySession()
	this.TplName = "login.html"
}

// DoLogout 用于API退出登录的接口
func (this *LogoutController) DoLogout() {
	this.DestroySession()
	this.ResponseOk()
}
