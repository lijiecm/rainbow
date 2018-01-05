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
	UpdateIpStatusLock *sync.RWMutex   //更新IP地址的时候需要上锁
	//FreeIpChan chan map[string]string
	FreeIpChan chan string
}

var (
	netIpInfo = &NetIpInfo{}
	ipInfoModel model.NetIpInfoModel
	MaxInstallOsCount int
)	


/*
暂时不需要这两个函数
*/
func setIpToChan(ip string)(err error){
	logs.Debug("Start function setIpToChan")
	oldStatus := 0
	status := 2

	netIpInfo.UpdateIpStatusLock = new(sync.RWMutex)
	netIpInfo.UpdateIpStatusLock.Lock()
	// status 状态为2的时候，说明该地址已经被标记待使用，等确定分配以后在把状态改为1
	errUpIp := ipInfoModel.UpdateIpStatus(ip,oldStatus, status)
	netIpInfo.UpdateIpStatusLock.Unlock()
	if errUpIp != nil {
		errMsg :=  fmt.Errorf("更新IP地址状态失败")
		logs.Warn("update ip[%s] status failed, err:%v, errUpIp:%v",ip,errMsg,errUpIp)
		err = errUpIp
		return
	}

	netIpInfo.FreeIpChan = make(chan string, 100)
	
	netIpInfo.FreeIpChan <- ip
	return
}


func getIpFromChan()(ip string, err error){
	logs.Debug("Start function getIpFromChan")
	ticker := time.NewTicker(time.Second * 10)
	select {
		case <- ticker.C:   //如果用户超过10秒，则本次超时
			//code = 1000
			err = fmt.Errorf("request timeout")
			return
		case ipChan := <- netIpInfo.FreeIpChan:
			//此处有bug，当不通网段的地址来申请IP的时候，有可能拿到其他网段的IP地址，后续考虑根据网段来获取channel信息
			netIpInfo.UpdateIpStatusLock = new(sync.RWMutex)
			//拿到IP以后，把IP地址改为已使用状态1
			oldStatus := 2
			status := 1
			netIpInfo.UpdateIpStatusLock.Lock()
			errUpIp := ipInfoModel.UpdateIpStatus(ipChan,oldStatus,status)
			netIpInfo.UpdateIpStatusLock.Unlock()
			logs.Debug("===============>end Lock")
			if errUpIp != nil {
				errMsg :=  fmt.Errorf("更新IP地址状态失败")
				logs.Warn("update ip status failed, err:%v",errMsg)
				err = errUpIp
				return
			}

			ip = ipChan
			//一个IP配置成功以后，则表示这个并发结束，所以需要减去1
			netIpInfo.Count -= 1
			return
	}	
}



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
		err :=  fmt.Errorf("获取空闲IP失败")
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
	var index int
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	if MaxInstallOsCount < len(ipList) {
		index = len(ipList) - 1
	} else{
		index = r.Intn(MaxInstallOsCount - 1)
	}
	
	logs.Debug("===============>%s, index:%d",ipList,index)
	ip := ipList[index]
	
	// 把获取到的IP地址放到管道里面
	errIp :=  setIpToChan(string(ip))
	if errIp != nil {
		err :=  fmt.Errorf("无法拿到可用IP")
		errorMsg =  err.Error()
		logs.Warn("cann't send ip[%s] to chan, err:%v",ip,errIp)
		return
	}

	//从管道里面读取IP，无需传入参数，管道是先进先出，即使是第二个请求写入搞到里面的IP，也可以当未使用IP分配下去
	newIp, err := getIpFromChan()
	if err != nil {
		logs.Warn("cann't get ip[%s] from chan, err:%v",ip,err)
		return
	}
	result["message"] = newIp
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


