package host


import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"rainbow/model"
	"fmt"
	//"net/http"
)

type HostController struct {
	beego.Controller  
}

func (p *HostController) Host(){

	logs.Debug("enter assetlist controller")
	
	p.TplName = "host/host.html"
	p.Layout = "layout/layout.html"
	errorMsg := "success"
	var err error
	defer func(){
		if err != nil {
			p.Data["error"] = errorMsg
			p.TplName = "layout/error.html"
		}
	}()
	
	hostModel := model.NewHostModel()
	hostList,err := hostModel.HostList()
	
	if err != nil {
		err =  fmt.Errorf("获取主机列表失败")
		errorMsg =  err.Error()
		logs.Warn("get host list failed, err:%v", err)
		return
	}


	logs.Info("%v", hostList)
	p.Data["host_list"] = hostList
	
	return
}
