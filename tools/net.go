package tools

import (
	"fmt"
	"strconv"
	"strings"
	"github.com/astaxie/beego/logs"
)

func GetIpByNet(network, mask string)(ipList []string, err error){

	var ipNet string
	var netWorkList []string
	maskNet := 0

	netList := strings.Split(network, ".") 
	maskList := strings.Split(mask, ".") 
	if len(maskList) != 4 && len(netList) != 4 {
		fmt.Println("enter ipNet or mask error")
		return
	}
	flag := true
	for n, maskPar := range maskList {
		//var newIp string	
		
		maskInt, errMask := strconv.Atoi(maskPar)
	
		if errMask != nil {
			err =  fmt.Errorf("输入掩码有误，请")
			logs.Warn(err)
			return
		}
		//fmt.Println(n)
		if n == len(maskList) - 1 && flag == true{
			/*
			当循环到掩码最后一个字段的时候，那么掩码的第四位必然可以找到对应的网段
			*/
			newDecima := hashToDecima(netList[n], maskPar)
			newDeInt , errDecima := strconv.Atoi(newDecima)
			if errDecima != nil {
				err =  fmt.Errorf("掩码二进制转换错误")
				logs.Warn(err)
				return
			}

			maskNet = 255 - maskInt
	
			for i :=newDeInt ; i < newDeInt + maskNet ; i++ {
				netIp := fmt.Sprintf("%v.%d",ipNet, i)
				ipList = append(ipList, netIp)
			}
			break
		}

		if maskInt != 255 && flag == true {
			maskNet = 255 - maskInt
			flag = false
		} 
		
		if n == 0 {
			ipNet = fmt.Sprintf("%v",netList[n] )
		} else {
			if maskNet !=0 {
				var netWork string

				newDecima := hashToDecima(netList[n], maskPar)
				newDeInt , Declima := strconv.Atoi(newDecima)
				if Declima != nil {
					err =  fmt.Errorf("网段二进制转换错误")
					logs.Warn(err)
					return
				}
				for i:=0 ;i <= maskNet; i++ {
					netWork = fmt.Sprintf("%v.%d",ipNet, i+newDeInt)
					netWorkList = append(netWorkList, netWork)
				}
				
				break
			}
			ipNet = fmt.Sprintf("%v.%v",ipNet,netList[n] )
		}
	}
	
	for x, network := range netWorkList {
		for n :=0 ; n < 255 ; n++ {
			if (x == 0 && n == 0)|| (x == (len(netWorkList) -1) && n == 254) {
				continue
			}
			ip := fmt.Sprintf("%v.%v",network,n )
			ipList = append(ipList, ip)
		}
	}
	//fmt.Println(ipList)
	//fmt.Println(netWorkList)
	//fmt.Println(ipNet)
	return
	

}
func binToDecima(num string) string {
	base, _ := strconv.ParseInt(num, 10, 10)
	binary := strconv.FormatInt(base, 2)
	var binAll string
	if len(binary) < 8 {
		bin0Num := 8 - len(binary)
		bin0All := strings.Repeat("0", bin0Num)
		binAll = fmt.Sprintf("%s%s",bin0All,binary)
	} else{
		binAll = binary
	}

    return  binAll
}


func decimaToBin(num string) string {
	base, _ := strconv.ParseInt(num, 2, 10)
	decima := strconv.FormatInt(base, 10)
	//fmt.Println(decima)
    return  decima
}


func hashToDecima(ipNet, mask string) string{
	var newNetDecima string

	ipDecima := binToDecima(ipNet)
	maskDecima := binToDecima(mask)
	ipDecima = string(ipDecima)
	maskDecima = string(maskDecima)
	for n, bi := range ipDecima{
		biStr :=string(bi)
		maskStr := string(maskDecima[n]) 
		//fmt.Println(string(bi),string(maskDecima[n]),"!!!s")
		if biStr == "1" && maskStr == "1" {
			newNetDecima = fmt.Sprintf("%s%d",newNetDecima,1)
		} else {
			newNetDecima = fmt.Sprintf("%s%d",newNetDecima,0)
		}
	}
	newDecima := decimaToBin(newNetDecima)
	//fmt.Println(newDecima,"@@@")
	return newDecima
}