package contract

import (
	"github.com/astaxie/beego/logs"
	"rainbow/model"
	"fmt"
)


func (p *ContractController) DelContract(){
	
	errorMsg := "success"
	
	result := make(map[string]interface{})
	
	result["success"] = "true"
	result["message"] = errorMsg

	var err error
	defer func(){
		if err != nil {
			result["success"] = "false"
			result["message"] = errorMsg
			p.Data["json"] =  result
			p.ServeJSON()  
		}
	}()

	contract_id, err := p.GetInt("contract_id")
	if err != nil {
		err :=  fmt.Errorf("获取合同ID失败")
		errorMsg =  err.Error()
		logs.Warn("get contract id failed, err:%v",err)
		return
	}

	contractModel := model.NewContractModel()
	err = contractModel.DelContract(contract_id)
	if err != nil {
		err :=  fmt.Errorf("删除合同失败")
		errorMsg =  err.Error()
		logs.Warn("del contract id failed, err:%v",err)
		return
	}
	result["message"] = "del contract true"
	p.Data["json"] =  result
	
	p.ServeJSON()  	
}