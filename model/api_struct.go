package model

import (
	"sync"
)

type HostInfo struct {
	AppName string
	Ip string
	OobIp string
	Type string
	Env string
	HostName string
	Os string
	Owner string
	Status string
	Model string
	IdcName string
	IdcTag string
	Sn string
}


type NetIpInfo struct {
	Ip string
	IpType string
	Status int
	HostInfo string
	Env string
	//业务环境是值属于哪个团队，比如苍井空团队、武藤兰团队
	ProduceEnv string
}

type Net struct {
	UpdateIpStatusLock sync.RWMutex
}