package router
import (
	"github.com/astaxie/beego"
	"rainbow/controller/asset"
)
func init(){
	beego.Router("/", &asset.AssetController{}, "*:Asset")
	beego.Router("/asset/asset", &asset.AssetController{}, "*:Asset")
	beego.Router("/asset/addasset", &asset.AssetController{}, "*:AddAsset")
	beego.Router("/asset/idc", &asset.AssetController{}, "*:Idc")
	beego.Router("/asset/addidc", &asset.AssetController{}, "*:AddIdc")
	beego.Router("/asset/delidc", &asset.AssetController{}, "*:DelIdc")
	beego.Router("/asset/updateidc", &asset.AssetController{}, "*:UpdateIdc")
	beego.Router("/asset/conf", &asset.AssetController{}, "*:Conf")  
	beego.Router("/asset/addconf", &asset.AssetController{}, "*:AddConf") 
	beego.Router("/asset/approval", &asset.AssetController{}, "*:Approval")
}

