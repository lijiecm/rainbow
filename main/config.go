package main

import (
	//"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego"
	"fmt"
	"zuoye/cmdb/controller/api"
	//"github.com/garyburd/redigo/redis"
)

var (
	CmdbConf Config
)

type MysqlConfig struct {
	UserName string
	Passwd string
	Port int
	DataBase string
	Host string
}


type RedisConfig struct {
	RedisAddr string
	RedisMaxIdle int
	RedisActive int
	RedisTimeout int
}

type Config struct {
	LogPath string
	LogLevel string
	MaxInstallOs int

	mysqlConfig MysqlConfig
	redisConfig RedisConfig

	
}

func InitConfig()(err error){
	//加载日志配置
	CmdbConf.LogPath = beego.AppConfig.String("logs_path")
	if len(CmdbConf.LogPath) == 0 {
		CmdbConf.LogPath = "./logs/cmdb.log"
	}

	CmdbConf.LogLevel = beego.AppConfig.String("logs_level")
	if len(CmdbConf.LogLevel) == 0 {
		CmdbConf.LogLevel = "info"
	}

	//加载配置文件
	CmdbConf.mysqlConfig.UserName = beego.AppConfig.String("mysql_user_name")
	if len(CmdbConf.mysqlConfig.UserName) == 0 {
		err = fmt.Errorf("load config mysql_user_name failed, is null")
		return
	}
	CmdbConf.mysqlConfig.Passwd = beego.AppConfig.String("mysql_passwd")
	if len(CmdbConf.mysqlConfig.UserName) == 0 {
		err = fmt.Errorf("load config mysql_passwd failed, is null")
		return
	}
	CmdbConf.mysqlConfig.Host = beego.AppConfig.String("mysql_host")
	if len(CmdbConf.mysqlConfig.UserName) == 0 {
		err = fmt.Errorf("load config mysql_host failed, is null")
		return
	}
	CmdbConf.mysqlConfig.DataBase = beego.AppConfig.String("mysql_database")
	if len(CmdbConf.mysqlConfig.UserName) == 0 {

		err = fmt.Errorf("load config mysql_database failed, is null")
		return
	}
	CmdbConf.mysqlConfig.Port, err = beego.AppConfig.Int("mysql_port")
	if err != nil {
		err = fmt.Errorf("load config mysql_port failed, is null error:%v", err)
		return
	}

	//加载redis配置
	CmdbConf.redisConfig.RedisAddr = beego.AppConfig.String("redis_addr")
	if len(CmdbConf.redisConfig.RedisAddr ) == 0 {
		err = fmt.Errorf("load config redis_addr failed, is null")
		return
	}

	CmdbConf.redisConfig.RedisMaxIdle, err = beego.AppConfig.Int("redis_idle")
	if err != nil {
		err = fmt.Errorf("load config redis_idle failed, is null error:%v", err)
		return
	}

	CmdbConf.redisConfig.RedisActive, err = beego.AppConfig.Int("redis_active")
	if err != nil {
		err = fmt.Errorf("load config redis_active failed, is null error:%v", err)
		return
	}

	CmdbConf.redisConfig.RedisTimeout, err = beego.AppConfig.Int("redis_timeout")
	if err != nil {
		err = fmt.Errorf("load config redis_timeout failed, is null error:%v", err)
		return
	}


	CmdbConf.MaxInstallOs, err = beego.AppConfig.Int("max_install_os")
	if err != nil {
		// 设置默认值为20
		CmdbConf.MaxInstallOs = 20
	}

	api.MaxInstallOsCount = CmdbConf.MaxInstallOs 
	return
}