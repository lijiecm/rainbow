package model
import (
	//"time"
)

// 账号表
type Users struct {
	/*
	数据库需要创建一个users的表，字段为以下字段，
	如果struct名字是UserName，则数据库就要创建一个user_name的表,
	如果是Username，则数据库就要创建一个username的表
	*/
	Id          int
	Username    string    `orm:"size(32);index;unique"`
	Password    string    `orm:"size(128)"`
	Name        string    `orm:"size(32)"`
	Email       string    `orm:"size(128)"`
	Gender      int       `orm:"default(0)"`  //性别
	CreatedAt   string    `orm:"size(128)"`
	LastLogin   string    `orm:"size(128)"`
	IsAdmin     bool      `orm:"default(false)"` // 超级管理员
	Frozen      bool      `orm:"default(false)"`   //冻结用户
	DeletedAt   string    `orm:"size(128)"` // 账户删除时间
}

//存机房的结构体
type Idc struct {
	Id int 
	Name string `orm:"size(128)"`
	Tag string `orm:"size(64)"`
	Location string `orm:"size(128)"`  //记录机房位置
	Floor string `orm:"size(32)"64"`
	RoomNum string `orm:"size(64)"`
	//MechineType string`db:"mechine_type"`
	MechineCount  int `orm:"default(0)"`
}

//存资产的结构体
type Asset struct {
	Id int 
	IdcId int `orm:"size(32)"`
	AssetType string `orm:"size(128)"`
	Model string `orm:"size(128)"`
	ConfId int `orm:"size(11)"`
	Sn string `orm:"size(64)"`
	ServiceCode string `orm:"size(64)"` 
	RackName string `orm:"size(128)"`
	Location string `orm:"size(64)"` //记录服务器U位
	BiosVersion string `orm:"size(64);"` 
	PowerState int `orm:"size(11)"`
	Site string `orm:"size(64)"`
	NetworkId int `orm:"size(64)"`
	ContractId  int `orm:"size(64)"`
}

type Host struct {
	Id int
	AppName string `orm:"size(128)"`
	MechineType string `orm:"size(64)"`
	Ip string `orm:"size(128)"`
	Oobip string `orm:"size(128)"`
	Env string `orm:"size(64)"`
	AssetId int  `orm:"default(0)"`
	Hostname string `orm:"size(64)"`
	OsId int  `orm:"default(0)"`
	Owner string `orm:"size(64)"`
	Status string `orm:"size(64)"`
}

type Os struct {
	MechineType string `orm:"size(128)"`
	Name string `orm:"size(64)"`
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
	Id int
	Name string `orm:"size(64)"`
	Cpu string `orm:"size(64)"`
	Memory string `orm:"size(64)"`
	Disk string `orm:"size(64)"`
	Raid string `orm:"size(64)"`
	Detail string `orm:"size(254)"`
}

type Network struct {
	Id int
	IdcId int `orm:"default(0)"`
	Env string `orm:"size(64)"`
	Team string `orm:"size(64)"`
	Vlan int `orm:"default(0)"`
	Mask string `orm:"size(64)"`
	Route string `orm:"size(64)"`
	Gateway string `orm:"size(64)"`
}

type Ip struct {
	Id int
	Addr string `orm:"size(64)"`
	IpType string `orm:"size(64)"`
	UseType string `orm:"size(64)"`
	HostId int `orm:"default(0)"`
	NetworkId int `orm:"default(0)"`
	Status int `orm:"default(0)"`  //是否使用
}

type Contract struct {
	Id int `db:"id"`
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


type OperaLog struct {
	OperaLogId int `db:"id"`
	HostType string `db:"host_type"`
	HostId int `db:"host_id"`
	LogType string `db:"log_type"`
	LogInfo string `db:"log_info"`
	OperaUser string `db:"opera_user"`
}




