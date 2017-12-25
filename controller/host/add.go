package host

import (
	"github.com/astaxie/beego/logs"
	"rainbow/model"
	"fmt"
	//"net/http"
)

func (p *HostController) AddHost(){
	errorMsg := "success"
	
	result := make(map[string]interface{})
	
	result["success"] = "true"
	result["message"] = errorMsg

	hostModel := model.NewHostModel()
	var host model.Host
	var err error
	defer func(){
		if err != nil {
			result["success"] = "false"
			result["message"] = errorMsg
			p.Data["json"] =  result
			p.ServeJSON()  
		}
	}()

	//asset_sn := p.GetString("asset_sn")
	host_oobip := p.GetString("host_oobip")
	
	//下面的值必须有合法的值
	
	app_name  := p.GetString("app_name")
	if len(app_name ) == 0 {
		err =  fmt.Errorf("应用名不能为空")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}

	host_ip := p.GetString("host_ip")
	if len(host_ip) == 0 {
		err =  fmt.Errorf("IP地址不能为空")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}

	host_env := p.GetString("host_env")
	if len(host_env) == 0 {
		err =  fmt.Errorf("环境不能为空")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}
	hostname := p.GetString("hostname")
	if len(hostname) == 0 {
		err =  fmt.Errorf("主机名不能为空")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}

	os := p.GetString("os")
	if len(os) == 0 {
		err =  fmt.Errorf("操作系统不能为空")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}

	owner := p.GetString("owner")
	if len(owner) == 0 {
		err =  fmt.Errorf("负责人不能为空")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}
	status := p.GetString("status")
	if len(status) == 0 {
		err =  fmt.Errorf("状态不能为空")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}

	host.AppName = app_name
	host.Ip = host_ip
	host.Oobip = host_oobip
	host.Env = host_env
	host.AssetId = 11
	host.Hostname = hostname
	host.OsId = 11
	host.Owner = owner
	host.Status = status

	err = hostModel.CreateHost(&host)
	if err != nil {
		err = fmt.Errorf("添加服务器失败:%v", err)
		errorMsg = "添加服务器失败"  
	   	logs.Warn(err.Error())
	   	return
	}
	p.Data["json"] =  result
	p.ServeJSON()  
	
}