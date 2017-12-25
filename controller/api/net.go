package api

import (
	"time"
	"sync"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"rainbow/model"
	"fmt"
	"math/rand"
)
type ApiNetController struct {
	beego.Controller  
}

type NetIpInfo struct {
	Addr string
	Count int  //控制当前并发数
	UpdateIpStatusLock sync.RWMutex   //更新IP地址的时候需要上锁
	FreeIpChan chan map[string]string
}

var (
	netIpInfo = &NetIpInfo{}
	ipInfoModel model.NetIpInfoModel
	MaxInstallOsCount int
)	

func (p *ApiNetController) GetIpAddr(){
	/*
	获取到IP信息
	*/
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

	gateway := p.GetString("gateway")
	//sn := p.GetString("sn")

	//用于做并发数限制，如果并发数大于配置项设置的最大时候，直接报错
	netIpInfo.Count += 1
	if netIpInfo.Count > MaxInstallOsCount {
		err :=  fmt.Errorf("当前操作并发数太多，请稍后在试")
		errorMsg =  err.Error()
		logs.Warn("get ip info failed, err:%v",err)
		return
	}

	var status int
	status = 0
	//获取到空闲IP地址
	logs.Debug("====>gateway:%s, status:%d, MaxInstallOsCount:%d",gateway, status, MaxInstallOsCount)
	ipList, err := ipInfoModel.GetFreeIp(gateway,status, MaxInstallOsCount)

	if err != nil {
		err :=  fmt.Errorf("无法获取到可用IP")
		errorMsg =  err.Error()
		logs.Warn("get ip failed, err:%v",err)
		return
	}
	if len(ipList) == 0 {
		err :=  fmt.Errorf("无法获取到可用IP")
		errorMsg =  err.Error()
		logs.Warn("get ip failed, err:%v",err)
		return
	}
	// 取一个10以内的随机值
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	index := r.Intn(MaxInstallOsCount - 1)
	
	logs.Debug("===============>%s, index:%d",ipList,index)
	ip := ipList[index]
	
	if len(ipList) == 0 {
		err :=  fmt.Errorf("无法拿到可用IP")
		errorMsg =  err.Error()
		logs.Warn("don't ip use, err:%v",errorMsg)
		return
	}

	netIpInfo.Count -= 1
	result["message"] = ip
	p.Data["json"] =  result
	
	p.ServeJSON()  	
}

func (p *ApiNetController) UpdateIpStatus(){
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

	addr := p.GetString("ip")
	
	if err != nil {
		err =  fmt.Errorf("更新IP地址状态失败")
		errorMsg =  err.Error()
		logs.Warn("update ip addr[%s] failed, err:%v",addr, err)
		return
	}
	//更新IP地址状态成功以后，将IP信息减去1
	if netIpInfo.Count > 0 {
		netIpInfo.Count -= 1
	}
	
	result["message"] = ""
	p.Data["json"] =  result
	p.ServeJSON()  
	
}


