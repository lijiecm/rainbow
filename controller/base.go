package controller

import (
	//"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego"
	"rainbow/tools"
	"net/http"
	"rainbow/model"
	"io/ioutil"
	"errors"
	"github.com/astaxie/beego/session"  

)

//（2）建立一个全局session mananger对象  
var GlobalSessions *session.Manager  
  
//（3）在初始化“全局session mananger对象”  
func init() {  
	sessionConfig := &session.ManagerConfig{
		CookieName:"gosessionid", 
		EnableSetCookie: true, 
		Gclifetime:3600,
		Maxlifetime: 3600, 
		Secure: false,
		CookieLifeTime: 3600,
		ProviderConfig: "./tmp",
		}
    GlobalSessions, _ = session.NewManager("memory",sessionConfig)  
    go GlobalSessions.GC()  
}  

// 基础 Controller 如果需要用到错误返回请继承该Controller
type BaseController struct {
	beego.Controller
}


// 如果是view页面, 同时需要登录, 使用该Controller
// 如果没有权限访问, 会自动跳转到登录页面
type AuthViewController struct {
	BaseController
}

// 返回一个 {code: "0000", msg: "ok", debug_msg: ""}给用户
func (this *BaseController) ResponseOk() {
	this.Data["json"] = &tools.DebugErrorCodeMsg{tools.Success, ""}
	this.ServeJSON()
	this.StopRun()
}

// ResponseErrorCode返回错误给前端
func (this *BaseController) ResponseErrorCode(e tools.ErrorCodeMsg, httpStatus int, debug_msg string) {
	beego.Error("Returning Error:" + debug_msg)
	this.Ctx.Output.Header("Content-Type", "application/json;charset=UTF-8")
	this.Ctx.ResponseWriter.WriteHeader(httpStatus)
	this.Data["json"] = &tools.DebugErrorCodeMsg{e, debug_msg}
	this.ServeJSON()
	this.StopRun()
}

// user 获取当前登录的用户
func (this *AuthViewController) Users() *model.Users {
	if this.Data["_user_"] != nil {
		return this.Data["_user_"].(*model.Users)
	} else {
		return nil
	}
}

// Prepare检查用户登录和用户权限, 并且添加用户数据到 this.Data["_user_"]
func (this *AuthViewController) Prepare() {
	if !this.canProceedRequest() {
		this.Redirect("/login", http.StatusFound)
	}
}

func (this *AuthViewController) setBodyData() {
	body, err := ioutil.ReadAll(this.Ctx.Request.Body)
	if err != nil {
		beego.Info("setBodyData failed. error: ", err.Error())
	}
	this.Data["_body_"] = &body
}

// setUserData向Controller.Data里面添加 _user_ : *Usertaff的用户数据
// 如果用户没有登录的话, 会返回一个错误
func (this *AuthViewController) setUserData() error {
	sess,_ := GlobalSessions.SessionStart(this.Ctx.ResponseWriter, this.Ctx.Request) 
	user_id := sess.Get("_user_id_")

	if user_id == nil {
		return errors.New("_user_id_ not exist in session")
	}
	
	user, err := model.GetUserById(user_id.(int))
	
	if err != nil {
		return errors.New("get user by id failed")
	} else {
		this.Data["username"] = user.Username
		this.Data["_user_"] = user
		return nil
	}
}

// canProceedRequest 判断当前访问是否被被授权
func (this *AuthViewController) canProceedRequest() (canProceed bool) {
	
	// 将用户请求的body部分放在this.Data里面
	// 如果是form的表单, 这个函数无法读取到相关数据, 所以body虽然不是空的, 但是设置的值是空的
	this.setBodyData()

	// 检测当前用户是否登录, 如果登录, 设置用户数据
	err := this.setUserData()
	if err != nil {
		return false
	}
	defer func() {
		if err != nil {
			beego.Error("canProcessdRequest error: ", err)
			canProceed = false
		}
	}()

	return true
}