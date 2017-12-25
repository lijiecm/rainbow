package model

import (
	"github.com/astaxie/beego/logs"
	"fmt"
	"github.com/astaxie/beego/orm"
)

type AssetModel struct {
}

func NewAssetModel() *AssetModel {
	assetModel := &AssetModel {
	}
	return assetModel
}


func init() {
	orm.RegisterModel(new(Idc))
	orm.RegisterModel(new(Asset))
	orm.RegisterModel(new(AssetConf))
}

func (p *AssetModel)GetIdcList()(list []*Idc, err error){

	logs.Debug("select idc list info")
	o := orm.NewOrm()

	qs := o.QueryTable("idc")
	_, err = qs.All(&list)
	if err != nil {
		logs.Warn("select idc list from mysql failed, err:%v", err)
		return
	}
	return
}

func (p *AssetModel)GetAssetList()(list []*Asset, err error){
	logs.Debug("select asset list info")
	o := orm.NewOrm()
	qs := o.QueryTable("asset")
	_, err = qs.All(&list)
	if err != nil {
		logs.Warn("select idc list from mysql failed, err:%v", err)
		return
	}
	return
}

func (p *AssetModel)GetConfList()(list []*AssetConf, err error){
	logs.Debug("select conf list info")
	o := orm.NewOrm()
	qs := o.QueryTable("asset_conf")

	_, err = qs.All(&list)
	if err != nil {
		logs.Warn("select asset conf list from mysql failed, err:%v", err)
		return
	}
	return
}

func (p *AssetModel) AssetValid(assetId int)(valid bool ,err error){

	var assetList []*Asset
	o := orm.NewOrm()
	qs := o.QueryTable("asset")
	qs.Filter("id",assetId).All(&assetList)
	if len(assetList) != 0 {
		logs.Error("asset[%d] is not exists", assetId)
		return
	}

	valid = true
	return
}

func (p *AssetModel)CreateAsset(asset Asset)(err error){
	//判断设备是否存在是否存在
	valid, err := p.AssetValid(asset.Id)
	if err != nil {
		logs.Error("asset exists failed, err:%v", err)
		return
	}

	if !valid {
		err = fmt.Errorf("asset id[%v] err:%v", asset.Id, err)
		logs.Error(err)
		return
	}

	//插入数据库中
	o := orm.NewOrm()
	id, err := o.Insert(&asset)
	if err != nil {
		logs.Warn("insert asset from mysql failed, err:%v", err)
		return
	}
	logs.Debug("insert asset into database succ, id:[%d]", id)
	return
}


func (p *AssetModel) UpdateAsset(asset Asset)(err error){

	o := orm.NewOrm()
	id, err := o.Update(&asset)
	if err != nil {
		logs.Error("update asset failed, err:%v", err)
		return
	}
	logs.Debug("update asset into database succ, id:[%d]", id)
	return
}

func (p *AssetModel)DelAsset(assetId int)(err error){
	o := orm.NewOrm()
	num, err := o.Delete(&Asset{Id: assetId})
	if err !=nil {
		logs.Error("del asset failed, err:%v", err)
		return
	}
	logs.Debug("update asset into database succ, id:[%d], num:[%d]", assetId, num)
	return
}

func (p *AssetModel) IdcValid(idcId int)(valid bool ,err error){

	var idctList []*Idc
	o := orm.NewOrm()
	qs := o.QueryTable("idc")
	qs.Filter("id",idcId).All(&idctList)
	if len(idctList) != 0 {
		logs.Error("idc[%d] is not exists", idcId)
		return
	}

	valid = true
	return
}

func (p *AssetModel)CreateIdc(idc Idc)(err error){
	//判断IDC是否存在是否存在
	valid, err := p.IdcValid(idc.Id)
	if err != nil {
		logs.Error("asset exists failed, err:%v", err)
		return
	}

	if !valid {
		err = fmt.Errorf("asset id[%v] err:%v", idc.Id, err)
		logs.Error(err)
		return
	}

	//插入数据库中

	o := orm.NewOrm()
	id, err := o.Insert(&idc)
	if err != nil {
		logs.Warn("insert idc from mysql failed, err:%v", err)
		return
	}
	logs.Debug("insert idc into database succ, id:[%d]", id)
	return
}


func (p *AssetModel)DelIdc(idcId int)(err error){
	o := orm.NewOrm()
	num, err := o.Delete(&Idc{Id: idcId})
	if err !=nil {
		logs.Error("del idc failed, err:%v", err)
		return
	}
	logs.Debug("update idc into database succ, id:[%d], num:[%d]", idcId, num)
	return
}

func (p *AssetModel)UpdateIdc(idc Idc)(err error){
	o := orm.NewOrm()
	id, err := o.Update(&idc)
	if err != nil {
		logs.Error("update asset failed, err:%v", err)
		return
	}
	logs.Debug("update asset into database succ, id:[%d]", id)
	return
}

func (p *AssetModel)CreateAssetConf(assetconf AssetConf)(err error){
	//判断IDC是否存在是否存在
	/*
	valid, err := p.IdcValid(idc.IdcID)
	if err != nil {
		logs.Error("asset exists failed, err:%v", err)
		return
	}

	if !valid {
		err = fmt.Errorf("asset id[%v] err:%v", idc.IdcID, err)
		logs.Error(err)
		return
	}
	*/

	//插入数据库中
	o := orm.NewOrm()
	id, err := o.Insert(&assetconf)
	if err != nil {
		logs.Warn("insert asset conf from mysql failed, err:%v", err)
		return
	}
	logs.Debug("insert asset conf  into database succ, id:[%d]", id)
	return

}