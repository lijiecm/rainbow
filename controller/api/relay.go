package api
import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"rainbow/model"
	"fmt"

)

type ApiRelayController struct {
	beego.Controller  
}


func (p *ApiRelayController) CreateOperaLog(){
	errorMsg := "success"
	
	result := make(map[string]interface{})
	
	result["success"] = "true"
	result["message"] = errorMsg

	var err error
	defer func(){
		if err != nil {
			result["success"] = "false"
			result["message"] = errorMsg
			p.Data["json"] =  result
			p.ServeJSON()  
		}
	}()

	hostType := p.GetString("hostType")
	ip:= p.GetString("ip")
	logType := p.GetString("logType")
	logInfo := p.GetString("logInfo")
	username := p.GetString("username")
	if len(hostType) != 0 {
		errorMsg = "主机类型hostType必须填写"  
		err = fmt.Errorf(errorMsg)
		logs.Warn(errorMsg)
		return
	} 
	if len(ip) != 0 {
		errorMsg = "主机ip必须填写"  
		err = fmt.Errorf(errorMsg)
		logs.Warn(errorMsg)
		return
	} 

	if len(logType) != 0 {
		errorMsg = "操作类型必须填写"  
		err = fmt.Errorf(errorMsg)
		logs.Warn(errorMsg)
		return
	} 
	if len(logInfo) != 0 {
		errorMsg = "操作日志必须填写"  
		err = fmt.Errorf(errorMsg)
		logs.Warn(errorMsg)
		return
	} 
	if len(username) != 0 {
		errorMsg = "用户名必须填写"  
		err = fmt.Errorf(errorMsg)
		logs.Warn(errorMsg)
		return
	} 

	newHostModel := model.NewHostModel()
	host,err := newHostModel.GetHostByIp(ip)
	if err != nil && len(host) == 0{
		errorMsg = "查不到对应的主机信息"  
		err = fmt.Errorf(errorMsg)
		logs.Warn(errorMsg)
		return
	}
	hostId := host[0].Id

	newRelayModel := model.NewRelayModel()
	var operaLog model.OperaLog
	operaLog.HostId = hostId
	operaLog.HostType = hostType
	operaLog.LogInfo = logInfo
	operaLog.LogType = logType
	operaLog.OperaUser = username
	err = newRelayModel.AddOperaLog(operaLog)
	if err != nil{
		errorMsg = "添加主机日志失败"  
		err = fmt.Errorf(errorMsg)
		logs.Warn(errorMsg)
		return
		}		

	result["message"] = "日志添加成功"
	p.Data["json"] =  result
	p.ServeJSON()  
	
}
