package model

import (
	"github.com/astaxie/beego/logs"
	"fmt"
)

type AssetModel struct {
}

func NewAssetModel() *AssetModel {
	assetModel := &AssetModel {
	}
	return assetModel
}

func (p *AssetModel)GetIdcList()(list []*Idc, err error){
	sql := "select id, name, tag, location, floor, room_num, mechine_count from idc"
	err = Db.Select(&list, sql)
	if err != nil {
		logs.Warn("select asset from mysql failed, err:%v sql:%v", err, sql)
		return
	}
	return
}

func (p *AssetModel)DelIdc(idcId int)(err error){
	sql := "delete from idc where id=?"
	_, err = Db.Exec(sql, idcId)
	if err != nil {
		fmt.Println("del idc failed, err:%v", err)
		return
	}

	return
}

func (p *AssetModel)GetAssetList()(list []*Asset, err error){
	sql := "select id, idc_id, asset_type, model, conf_id, sn, service_code, rack_name, location, bios_version, power_state, site, network_id, contract_id from asset"
	err = Db.Select(&list, sql)
	if err != nil {
		logs.Warn("select asset from mysql failed, err:%v sql:%v", err, sql)
		return
	}
	return
}

func (p *AssetModel)GetConfList()(list []*AssetConf, err error){
	sql := "select id, name,  cpu, memory, disk, raid, detail from asset_conf"
	err = Db.Select(&list, sql)
	if err != nil {
		logs.Warn("select asset conf  from mysql failed, err:%v sql:%v", err, sql)
		return
	}
	return
}



func (p *AssetModel) AssetValid(assetId int)(valid bool ,err error){
	sql := "select id from asset where id = ?"
	var assetList []*Asset
	err = Db.Select(&assetList, sql, assetId)
	valid = false
	if err != nil {
		logs.Warn("select product failed, err:%v", err)
		return
	}
	if len(assetList) != 0 {
		err = fmt.Errorf("asset[%v] is not exists", assetId)
		return
	}

	valid = true

	return
}

func (p *AssetModel)CreateAsset(asset *Asset)(err error){
	//判断设备是否存在是否存在
	valid, err := p.AssetValid(asset.AssetId)
	if err != nil {
		logs.Error("asset exists failed, err:%v", err)
		return
	}

	if !valid {
		err = fmt.Errorf("asset id[%v] err:%v", asset.AssetId, err)
		logs.Error(err)
		return
	}

	//插入数据库中
	sql := "insert into asset(idc_id, asset_type, model, conf_id, sn, service_code, rack_name, location,  bios_version, power_state, site, network_id, contract_id) values (?,?,?,?,?,?,?,?,?,?,?,?,?)"
	_, err = Db.Exec(sql, asset.IdcId, asset.AssetType, asset.Model, asset.ConfId, asset.SN, asset.ServiceCode, asset.RackName, asset.Location, 
		asset.BiosVer, asset.PowerState, asset.Site, asset.NetworkId, asset.ContractId)
	if err != nil {
		logs.Warn("insert from mysql failed, err:%v sql:%v", err, sql)
		return
	}
	logs.Debug("insert asset into database succ")
	return
}


func (p *AssetModel) IdcValid(idcId int)(valid bool ,err error){
	sql := "select name from idc where id = ?"
	var idctList []*Idc
	err = Db.Select(&idctList, sql, idcId)
	valid = false
	if err != nil {
		logs.Warn("select product failed, err:%v", err)
		return
	}
	if len(idctList) != 0 {
		err = fmt.Errorf("idc[%v] is not exists", idcId)
		return
	}

	valid = true

	return
}

func (p *AssetModel)CreateIdc(idc *Idc)(err error){
	//判断IDC是否存在是否存在
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

	//插入数据库中
	sql := "insert into idc(name, tag, location, floor, room_num, mechine_count) values (?,?,?,?,?,?)"
	_, err = Db.Exec(sql, idc.Name, idc.Tag, idc.Location, idc.Floor, idc.RoomNum, idc.MechineCount)
	if err != nil {
		logs.Warn("insert from mysql failed, err:%v sql:%v", err, sql)
		return
	}
	logs.Debug("insert asset idc  into database succ")
	return
}


func (p *AssetModel)CreateAssetConf(assetconf *AssetConf)(err error){
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
	sql := "insert into asset_conf(name, cpu, memory, disk, raid, detail) values (?,?,?,?,?,?)"
	_, err = Db.Exec(sql, assetconf.Name,assetconf.Cpu, assetconf.Memory,assetconf.Disk,assetconf.Raid,assetconf.Detail)
	if err != nil {
		logs.Warn("insert from mysql failed, err:%v sql:%v", err, sql)
		return
	}
	logs.Debug("insert asset conf into database succ")
	return
}

