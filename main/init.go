package main
import (
	_ "github.com/go-sql-driver/mysql"
	"github.com/astaxie/beego/logs"
	"encoding/json"
	//"github.com/jmoiron/sqlx"
	"fmt"
	"rainbow/model"
	"rainbow/tools"
	"github.com/garyburd/redigo/redis"
	"time"
	"github.com/astaxie/beego/orm"
	"github.com/astaxie/beego/session"
)

var (
	//Db *sqlx.DB
	redisPool *redis.Pool
	globalSessions *session.Manager

)

func convertLogLevel(level string) int {
	switch (level) {
	case "debug":
		return logs.LevelDebug
	case "warn":
		return logs.LevelWarn
	case "info":
		return logs.LevelInfo
	case "trace":
		return logs.LevelTrace
	}
	return logs.LevelDebug
}

func initLogs()(err error){
	config := make(map[string]interface{})
	config["filename"] = CmdbConf.LogPath
	config["level"] = convertLogLevel(CmdbConf.LogLevel)

	configStr, err := json.Marshal(config)
	if err != nil {
		logs.Error("marshal failed,err:", err)
		return
	}
	logs.SetLogger(logs.AdapterFile, string(configStr))
	return
}

func initRedis()(err error){
	redisPool = &redis.Pool{
		MaxIdle: CmdbConf.redisConfig.RedisMaxIdle,
		MaxActive: CmdbConf.redisConfig.RedisMaxIdle,
		IdleTimeout: time.Duration(CmdbConf.redisConfig.RedisTimeout) * time.Second,  //必须转为时间，并且单位是为秒(duration单位是纳秒)，这是300 * 秒
		Dial: func() (redis.Conn, error){
			return redis.Dial("tcp",CmdbConf.redisConfig.RedisAddr)
		},
	}
	conn := redisPool.Get()
	defer conn.Close()
	_, err = conn.Do("ping")  //验证redis连接是否正常
	if err != nil {
		logs.Error("ping redis failed, err:%v", err)
		return
	}
	tools.Init(redisPool)
	
	return
}

func initDb()(err error){

	orm.RegisterDriver("mysql", orm.DRMySQL)

	dns := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8", CmdbConf.mysqlConfig.UserName, CmdbConf.mysqlConfig.Passwd,
	CmdbConf.mysqlConfig.Host, CmdbConf.mysqlConfig.Port,CmdbConf.mysqlConfig.DataBase)
	orm.RegisterDataBase("default", "mysql", dns)
	
	if err != nil {
		logs.Error("open mysql failed, err:%v", err)
		return
	}
	logs.Debug("connect to mysql succ")
	return
}

func initSession() {
	sessionConfig := &session.ManagerConfig{
		CookieName:"gosessionid", 
		EnableSetCookie: true, 
		Gclifetime:3600,
		Maxlifetime: 3600, 
		Secure: false,
		CookieLifeTime: 3600,
		ProviderConfig: "./tmp",
		}
		globalSessions, _ = session.NewManager("memory",sessionConfig)
		go globalSessions.GC()
	}

func initInfoToRedis()(err error){
	/*
	程序运行之前，将数据库中的数据导入到redis中，方便后续查找
	*/
	snMap, hostNameMap, ipMap, hostInfoMap, err := model.InfoToRedis(redisPool)
	conn := redisPool.Get()
	defer conn.Close()

	sn, _ := json.Marshal(snMap)
	_, err = conn.Do("Set", "sn",sn)  
	if err != nil {
		fmt.Println(err)
		return
	}

	hostname, _ := json.Marshal(hostNameMap)
	_, err = conn.Do("Set", "hostname",hostname)  
	if err != nil {
		logs.Error(err)
		return
	}

	ip, _ := json.Marshal(ipMap)
	_, err = conn.Do("Set", "ip",ip)  
	if err != nil {
		logs.Error(err)
		return
	}

	hostinfo, _ := json.Marshal(hostInfoMap)
	_, err = conn.Do("Set", "hostinfo",hostinfo)  
	if err != nil {
		logs.Error(err)
		return
	}


	return
}

/*
func  GetFreeIpList()(netIpInfo map[string][]string){
	var tmp map[string][]string = make(map[string][]string,1024)  
	for _, v :=  range netIpInfo {
		tmp = append(tmp,v)
	}

	net.UpdateIpStatusLock.Lock()
	go UpdateIpStatus(tmp)
	net.UpdateIpStatusLock.Unlock()

	return
}
*/
func InitCmdb() (err error) {
	
	err = initLogs()
	if err != nil {
		panic(fmt.Sprintf("init logs level failed, err:%v", err))
	}
	
	err = initDb()
	if err != nil {
		logs.Warn("init DB failed, err:%v", err)
		return
	}

	err = initRedis()
	if err != nil {
		logs.Warn("init redis failed, err:%v", err)
		return
	}
	/*
	
	err = model.Init(Db)
	if err != nil {
		logs.Warn("init model failed, err:%v", err)
		return
	}

	err = initInfoToRedis()
	if err != nil {
		logs.Warn("init info to redis failed, err:%v", err)
		return
	}
	*/

	return
}
