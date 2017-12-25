package asset

import (
	//"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"rainbow/model"
	"fmt"
	"rainbow/controller"
	//"net/http"
)

type AssetController struct {
	controller.AuthViewController  
	//beego.Controller
}

func (p *AssetController) Asset(){

	logs.Debug("enter assetlist controller")
	
	p.TplName = "asset/asset.html"
	p.Layout = "layout/layout.html"
	errorMsg := "success"
	var err error
	defer func(){
		if err != nil {
			p.Data["error"] = errorMsg
			p.TplName = "layout/error.html"
		}
	}()
	
	assetModel := model.NewAssetModel()
	assetList,err := assetModel.GetAssetList()
	
	if err != nil {
		err =  fmt.Errorf("获取主机列表失败")
		errorMsg =  err.Error()
		logs.Warn("get asset list failed, err:%v", err)
		return
	}

	idcList, err:= assetModel.GetIdcList()
	
	if err != nil {
		err =  fmt.Errorf("获取idc列表失败")
		errorMsg =  err.Error()
		logs.Warn("get idc list failed, err:%v", err)
		return
	}
	logs.Info("%v", assetList)
	p.Data["asset_list"] = assetList
	p.Data["idc_list"] = idcList
	
	return
}

func (p *AssetController) Idc(){

	logs.Debug("enter idclist controller")
	
	p.TplName = "asset/idc.html"
	p.Layout = "layout/layout.html"
	errorMsg := "success"
	var err error
	defer func(){
		if err != nil {
			p.Data["error"] = errorMsg
			p.TplName = "layout/error.html"
		}
	}()
	
	assetModel := model.NewAssetModel()
	idcList,err := assetModel.GetIdcList()

	if err != nil {
		err =  fmt.Errorf("获取IDC机房列表失败")
		errorMsg =  err.Error()
		logs.Warn("add idc faile, err:%v", err)
		return
	}
	p.Data["idc_list"] = idcList
	
	return
}


func (p *AssetController) Conf(){
	
	logs.Debug("enter confmanage controller")
	p.TplName = "asset/conf.html"
	p.Layout = "layout/layout.html"
	errorMsg := "success"
	var err error
	defer func(){
		if err != nil {
			p.Data["error"] = errorMsg
			p.TplName = "layout/error.html"
		}
	}()
	
	assetModel := model.NewAssetModel()
	confList,err := assetModel.GetConfList()

	if err != nil {
		err =  fmt.Errorf("获取资产配置列表失败")
		errorMsg =  err.Error()
		logs.Warn("add conf faile, err:%v", err)
		return
	}
	p.Data["confList"] = confList
	
	return
}

func (p *AssetController) Approval(){
	
	logs.Debug("enter Approval controller")
	p.Layout = "layout/layout.html"  
	m := make(map[string]interface{})
	m["code"] = 200
	m["message"] = "success"
	m["type"] = "approval"

	p.Data["confmanage"] = m
	p.TplName = "asset/approval.html"
}