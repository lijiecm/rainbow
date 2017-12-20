package net

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"rainbow/model"
	"rainbow/tools"
	"fmt"
)

type NetController struct {
	beego.Controller  
}


func (p *NetController) Network(){

	logs.Debug("enter net manage controller")
	p.Layout = "layout/layout.html"  
	p.TplName = "net/net.html"

	errorMsg := "success"

	assetModel := model.NewAssetModel()
	idcList, err:= assetModel.GetIdcList()
	
	if err != nil {
		err =  fmt.Errorf("获取idc列表失败")
		errorMsg =  err.Error()
		logs.Warn("get idc list failed, err:%v", err)
		return
	}

	defer func(){
		if err != nil {
			p.Data["error"] = errorMsg
			p.TplName = "layout/error.html"
		}
	}()

	netWorkModel := model.NewNetWorkModel()
	netList, err := netWorkModel.GetNetWork()
	if err != nil {
		err =  fmt.Errorf("获取网络列表失败")
		errorMsg =  err.Error()
		logs.Warn("get network list failed, err:%v", err)
		
		return
	}

	p.Data["network_list"] = netList
	p.Data["idc_list"] = idcList
	
}

func (p *NetController) Ip(){
	
	logs.Debug("enter net manage controller")
	p.Layout = "layout/layout.html"  
	p.TplName = "net/ip.html"

	errorMsg := "success"
	pageNo, err := p.GetInt("page")
	if err != nil {
		pageNo = 1
	}

	pageSize, err := p.GetInt("page_size")
	if err != nil {
		pageSize = 10
	}
	
	netWorkModel := model.NewNetWorkModel()
	ipList, err := netWorkModel.GetAllIp()
	if err != nil {
		err =  fmt.Errorf("获取Ip列表失败")
		errorMsg =  err.Error()
		logs.Warn("get ip list failed, err:%v", err)
		
		return
	}

	count := len(ipList)

	star_currentt := (pageNo - 1) * pageSize
	end_current := pageNo * pageSize
	newList := ipList[star_currentt:end_current]

	page := tools.PageUtil(count, pageNo, pageSize, newList) 
	defer func(){
		if err != nil {
			p.Data["error"] = errorMsg
			p.TplName = "layout/error.html"
		}
	}()
	//logs.Debug("%v", page)
	p.Data["Page"] = page
	return
	}