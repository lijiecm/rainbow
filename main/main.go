package main

import (
	"github.com/astaxie/beego"
	 _ "rainbow/router"   //一定要导入这个，否则无法加载init模块
	 "fmt"
)



func main(){

	err := InitConfig()
	if err != nil {
		panic(fmt.Sprintf("init config failed, err:%v", err))
	}
	err = InitCmdb()
	if err != nil {
		panic(err)
		return
	}

	beego.Run()
}