package api

import (
	"encoding/json"
	"github.com/garyburd/redigo/redis"
	"github.com/astaxie/beego/logs"
	"rainbow/tools"
)
 
func HostInfoByHostId(Id string)(hostInfo map[string]string, err error){
	conn := tools.RedisPool.Get()
	defer conn.Close()

	hostInfoMap, err := redis.Bytes(conn.Do("Get", "hostinfo"))
	if err != nil {
		logs.Error("from redis use [%s] get hostinfo faild, err:%v", Id, err)
		return
	}
	var hostInfoSn map[string]map[string]string
	err = json.Unmarshal(hostInfoMap, &hostInfoSn)
	if err != nil {
		logs.Error("Unmarshal snMap[%v] faild", hostInfoMap)
		return
	}

	hostInfo = hostInfoSn[Id]
	return 
}

func HostInfoByKey(keyType, sn string)(hostInfo map[string]string, err error){

	conn := tools.RedisPool.Get()
	defer conn.Close()
	// json数据在go中是[]byte类型，所以此处用redis.Bytes转换 
	snMap, err := redis.Bytes(conn.Do("Get",keyType))
	if err != nil {
		logs.Error("from redis use sn[%s] get hostinfo faild, error:%v", sn, err)
		return
	}
	var snInfo map[string]string
	err = json.Unmarshal(snMap, &snInfo)
	if err != nil {
		logs.Error("Unmarshal snMap[%v] faild", snMap)
		return
	}
	hostId := snInfo[sn]
	hostInfo, err = HostInfoByHostId(hostId)
	if err != nil {
		logs.Error("get hostInfo faild")
		return
	}
	
	logs.Info("get HostInfoBySn success ")

	return

}



