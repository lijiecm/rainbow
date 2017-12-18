package api
import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"fmt"

)

type ApiHostController struct {
	beego.Controller  
}


func (p *ApiHostController) GetHostInfo(){
	errorMsg := "success"
	
	result := make(map[string]interface{})
	
	result["success"] = "true"
	result["message"] = errorMsg
	//hostInfoModel := model.HostInfoModel{}
	//var hostInfo model.HostInfo
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
	sn := p.GetString("sn")
	ip  := p.GetString("ip")
	oobip := p.GetString("oobip")
	hostInfo := make(map[string]string)
	if len(sn) != 0 {
		hostInfo, err = HostInfoByKey("sn",sn)
		if err != nil {
			err = fmt.Errorf("通过sn获取主机信息错误:%v", err)
			errorMsg = "通过sn获取主机信息错误"  
			logs.Warn(err.Error())
			return
		}
	} else if len(ip) != 0 {
		hostInfo, err = HostInfoByKey("ip",sn)
		if err != nil {
			err = fmt.Errorf("通过ip获取主机信息错误:%v", err)
			errorMsg = "通过ip获取主机信息错误"  
			logs.Warn(err.Error())
			return
		}
			
	} else if len(oobip) != 0 {
		hostInfo, err = HostInfoByKey("oobip",sn)
		if err != nil {
			err = fmt.Errorf("通过oobip获取主机信息错误:%v", err)
			errorMsg = "通过oobip获取主机信息错误"  
			logs.Warn(err.Error())
			return
		}
			
	} else {
		errorMsg = "请输入正确的参数，sn|ip|oobip"  
		err = fmt.Errorf(errorMsg)
		logs.Warn(errorMsg)
		return
	}

	result["message"] = hostInfo
	p.Data["json"] =  result
	p.ServeJSON()  
	
}