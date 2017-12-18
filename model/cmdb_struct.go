package model

import (
	//"github.com/astaxie/beego/logs"
)

//存机房的结构体
type Idc struct {
	IdcID int `db:"id"`
	Name string `db:"name"`
	Tag string `db:"tag"`
	Location string `db:"location"`  //记录机房位置
	Floor string `db:"floor"`
	RoomNum string `db:"room_num"`
	//MechineType string`db:"mechine_type"`
	MechineCount  int `db:"mechine_count"`
}

//存资产的结构体
type Asset struct {
	AssetId int `db:"id"`
	IdcId int `db:"idc_id"`
	AssetType string `db:"asset_type"`
	Model string `db:"model"`
	ConfId int `db:"conf_id"`
	SN string `db:"sn"`
	ServiceCode string `db:"service_code"` 
	RackName string `db:"rack_name"`
	Location string `db:"location"`  //记录服务器U位
	BiosVer string `db:"bios_version"` 
	PowerState int `db:"power_state"`
	Site string `db:"site"`
	NetworkId int `db:"network_id"`
	ContractId  int `db:"contract_id"`
}

type Host struct {
	HostId int `db:"id"`
	AppName string `db:"app_name"`
	MechineType string `db:"mechine_type"`
	IP string `db:"ip"`
	OobIp string `db:"oobip"`
	Env string `db:"env"`
	AssetId int `db:"asset_id"`
	HostName string `db:"hostname"`
	OsId int `db:"os_id"`
	Owner string `db:"owner"`
	Status string `db:"status"`
}

type Os struct {
	MechineType string `db:"mechine_type"`
	Name string `db:"name"`
}

type Part struct {
	PartId int `db:"id"`
	//mem,disk,cpu
	Type int `db:"type"`  
	HostId int `db:"host_id"`
	Name string `db:"name"`
	SN string `db:"sn"`
	Valume string `db:"valume"`
	ContractId int `db:"contract_id"`
}


type AssetConf struct {
	ConfId int `db:"id"`
	Name string `db:"name"` 
	Cpu string `db:"cpu"`
	Memory string `db:"memory"`
	Disk string `db:"disk"`
	Raid string `db:"raid"`
	Detail string `db:"detail"`
}

type NetWork struct {
	NetWorkId int `db:"id"`
	IdcId int `db:"idc_id"`
	Env string `db:"env"`
	Team string `db:"team"`
	Vlan int `db:"vlan"`
	Mask string `db:"mask"`
	Route string `db:"route"`
	GateWay string `db:"gateway"`
}

type Ip struct {
	IpId int `db:"id"`
	Addr string `db:"addr"`
	IpType string `db:"ip_type"`
	UseType string `db:"use_type"`
	HostId int `db:"host_id"`
	NetworkId int `db:"network_id"`
	Status int `db:"status"`  //是否使用
}

type Contract struct {
	ContractId int `db:"id"`
	SupplierName string `db:"supplier_name"`
	ContractName string `db:"contract_name"`
	ContractNumber string `db:"contract_number"`
	ContractType string `db:"contract_type"`
	Epo string `db:"epo"`
	ContractYears int `db:"contract_years"`
	PaymentStyle string `db:"payment_style"`
	ContractServer string `db:"contract_server"`
	ContractSignTime string `db:"contract_sign_time"`
	ContractExpirationTime string `db:"contract_expiration_time"`
}

type Order struct {
	OrderId int `db:"id"`
	EpoSignNumber string `db:"epo_sign_number"`
	EpoNum string `db:"epo_num"`
	CreateUser string `db:"create_user"`
	OrderState string `db:"order_state"`
	HostCount int `db:"host_count"`
	AlreadyHostCount int `db:"already_host_count"`
	OrderCreateTime string `db:"order_create_time"`
	OrderArriveTime string `db:"order_arrive_time"`
}

type OperaLog struct {
	OperaLogId int `db:"id"`
	HostType string `db:"host_type"`
	HostId int `db:"host_id"`
	LogType string `db:"log_type"`
	LogInfo string `db:"log_info"`
	OperaUser string `db:"opera_user"`
}




