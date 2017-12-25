package model

import (
	"github.com/astaxie/beego/logs"
	"github.com/garyburd/redigo/redis"
	"strconv"
	"github.com/astaxie/beego/orm"
	"fmt"
)

func GetIdcInfoById(id int)(idcList []Idc,err error){

	o := orm.NewOrm()
	qs := o.QueryTable("idc")
	qs.Filter("id",id).All(idcList)
	if len(idcList) != 0 {
		err = fmt.Errorf("idc[%d] is not exists", id)
		logs.Error(err)
		return
	}
	return
}

func GetHostInfoById(id int)(hostList []Host, err error) {
	o := orm.NewOrm()
	qs := o.QueryTable("idc")
	qs.Filter("id",id).All(hostList)
	if len(hostList) != 0 {
		err = fmt.Errorf("host[%d] is not exists", id)
		logs.Error(err)
		return
	}
	return
}

func GetOsInfoById(id int)(osList []Os, err error){
	o := orm.NewOrm()
	qs := o.QueryTable("os")
	qs.Filter("id",id).All(osList)
	if len(osList) != 0 {
		err = fmt.Errorf("os[%d] is not exists", id)
		logs.Error(err)
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

	o := orm.NewOrm()

	qs := o.QueryTable("asset")
	_, err = qs.All(&assetList)
	if err != nil {
		logs.Warn("select asset list from mysql failed, err:%v", err)
		return
	}

	for _, asset := range assetList {
		hostInfo.Model = asset.Model
		hostInfo.Sn = asset.Sn

		asset_id := asset.Id
		assetIdStr := strconv.Itoa(asset_id)
		snMap[asset.Sn] = assetIdStr

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
			hostName := hostList[0].Hostname
			ip := hostList[0].Ip
			hostInfo.AppName = hostList[0].AppName
			hostInfo.Ip = ip
			hostInfo.OobIp = hostList[0].Oobip
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