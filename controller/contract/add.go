package contract


import (
	"github.com/astaxie/beego/logs"
	"rainbow/model"
	"fmt"
	"time"
)

func (p *ContractController) AddContract(){
	errorMsg := "success"

	result := make(map[string]interface{})
	
	result["success"] = "true"
	result["message"] = errorMsg

	contractModel := model.NewContractModel()
	var contract model.Contract
	var err error
	defer func(){
		if err != nil {
			result["success"] = "false"
			result["message"] = errorMsg
			p.Data["json"] =  result
			p.ServeJSON()  
		}
	}()
	
	supplier_name := p.GetString("supplier_name")
	if len(supplier_name) == 0 {
		err =  fmt.Errorf("供应商不能为空")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}
	contract_name := p.GetString("contract_name")
	if len(contract_name) == 0 {
		err =  fmt.Errorf("合同名称不能为空")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}
	contract_number := p.GetString("contract_number")
	if len(contract_number) == 0 {
		err =  fmt.Errorf("合同编号不能为空")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}
	contract_type  := p.GetString("contract_type")  
	if len(contract_type) == 0 {
		err =  fmt.Errorf("合同类型不能为空")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}
	payment_style := p.GetString("payment_style")
	if len(payment_style) == 0 {
		err =  fmt.Errorf("付款方式不能为空")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}
	contract_server:= p.GetString("contract_server")  
	if len(payment_style) == 0 {
		err =  fmt.Errorf("服务类型不能为空")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}
	contract_sign_time := p.GetString("contract_sign_time")
	if len(payment_style) == 0 {
		err =  fmt.Errorf("合同起始时间不能为空")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}
	contract_expiration_time := p.GetString("contract_expiration_time")
	if len(payment_style) == 0 {
		err =  fmt.Errorf("合同到期时间不能为空")
		errorMsg =  err.Error()
		logs.Warn(errorMsg)
		return
	}
	contract_years, err := p.GetInt("contract_years")
	if err != nil {
		err = fmt.Errorf("获取年限失败，err:%v", err)
		errorMsg = "获取年限失败，年限必须要整数" 
		logs.Warn(err.Error())
	   	return
    }

	status, err := p.GetInt("status")
	if err != nil {
		err = fmt.Errorf("获取状态失败，err:%v", err)
		errorMsg = "获取状态失败" 
		logs.Warn(err.Error())
	   	return
	}

	nowTime := time.Now()
    create_time := nowTime.String()


	contract.SupplierName = supplier_name
	contract.ContractName = contract_name
	contract.ContractNumber = contract_number
	contract.ContractType = contract_type
	contract.ContractYears = contract_years
	contract.PaymentStyle = payment_style
	contract.ContractServer = contract_server
	contract.ContractSignTime = contract_sign_time
	contract.ContractExpirationTime = contract_expiration_time
	contract.Status = status
	contract.CreateTime = create_time


	err = contractModel.CreateContract(contract)
	if err != nil {
		err = fmt.Errorf("添加合同失败:%v", err)
		errorMsg = "添加合同失败"  
	   	logs.Warn(err.Error())
	   	return
	}
	p.Data["json"] =  result
	p.ServeJSON()  

}