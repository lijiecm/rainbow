package model

import (
	"github.com/jmoiron/sqlx"
	"github.com/astaxie/beego/logs"
	"github.com/garyburd/redigo/redis"
	"strconv"

)
var (
	Db *sqlx.DB


)

func Init(db *sqlx.DB)(err error){
	Db = db
	return
}


func GetIdcInfoById(id int)(idcList []Idc,err error){
	idc_sql := "select name from idc where id=?"
	err = Db.Select(&idcList, idc_sql, id)
	if err != nil{
		logs.Warn("select idc from %d failed, DB.Exec error:%v", id, err)
		return
	}
	return
}

func GetHostInfoById(id int)(hostList []Host, err error) {
	host_sql := "select app_name, ip, oobip, env, hostname, owner, status from host where asset_id=?"
	err = Db.Select(&hostList, host_sql, id)
	if err != nil{
		logs.Warn("select host from  %d failed, DB.Exec error:%v", id, err)
		return
	}
	return
}

func GetOsInfoById(id int)(osList []Os, err error){
	os_sql := "select mechine_type, name from os where id=?"
	err = Db.Select(&osList, os_sql, id)
	if err != nil{
		logs.Warn("select os from  %d failed, DB.Exec error:%v", id, err)
		return
	}
	return
}

//func InfoToRedis(redisPool *redis.Pool)(hostInfoList []HostInfo, err error){
func InfoToRedis(redisPool *redis.Pool)(snMap,hostNameMap,ipMap map[string]string, hostInfoMap map[string]interface{}, err error){
	var hostInfo HostInfo
	var assetList []*Asset

	snMap = make(map[string]string)
	hostNameMap = make(map[string]string)
	ipMap = make(map[string]string)
	hostInfoMap = make(map[string]interface{})

	asset_sql := "select id, idc_id, model, sn from asset"
	err = Db.Select(&assetList, asset_sql)
	if err != nil || len(assetList) == 0{
		logs.Warn("select asset from  failed, DB.Exec error:%v", err)
		return
	}
	for _, asset := range assetList {
		hostInfo.Model = asset.Model
		hostInfo.Sn = asset.SN

		asset_id := asset.AssetId
		assetIdStr := strconv.Itoa(asset_id)
		snMap[asset.SN] = assetIdStr

		idc_id := asset.IdcId
		idcList, errIdc := GetIdcInfoById(idc_id)
		if errIdc != nil {
			logs.Error("select idcinfo from idc failed")
			err = errIdc
			return
		}
		hostInfo.IdcName = idcList[0].Name
		hostInfo.IdcTag = idcList[0].Tag

		
		hostList, errHost :=GetHostInfoById(asset_id)
		if errHost != nil {
			logs.Error("select hostinfo from host failed, DB.Exec error:%v, asset_id:%d", err, asset_id)
			err = errHost
			return
		}

		if len(hostList) != 0 {
			hostName := hostList[0].HostName
			ip := hostList[0].IP
			hostInfo.AppName = hostList[0].AppName
			hostInfo.Ip = ip
			hostInfo.OobIp = hostList[0].OobIp
			hostInfo.Env = hostList[0].Env
			hostInfo.Owner = hostList[0].Owner
			hostInfo.Status = hostList[0].Status
			hostInfo.HostName = hostName
			hostNameMap[hostName] = assetIdStr
			ipMap[ip] = assetIdStr
			
			os_id := hostList[0].OsId
			osList, errOs := GetOsInfoById(os_id)
			if errOs != nil {
				logs.Error("select osinfo from os failed, DB.Exec error:%v, os_id:%d", err, os_id)
				err = errOs
				return
			}

			if len(osList) != 0 {
				hostInfo.Os = osList[0].Name	
			}
			
		}

		hostInfoMap[assetIdStr] = hostInfo

		
	}
	
	return
}