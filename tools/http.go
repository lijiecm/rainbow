
package tools 

import (
	"net/http"
	"strings"
	"io/ioutil"
	"fmt"
	"encoding/json"
	"github.com/astaxie/beego/logs"
)

func httpGetData(url, get_data string)(result map[string]interface{}, err error) {
	//get_data = "id=1&username=lijie"
	
	// 确保key是以?结尾的
	if strings.HasPrefix(url, "?") == false {
		url = url + "?"
	}

	get_url := fmt.Sprintf("%s%s",url, get_data)
    resp, err := http.Get(get_url)
    if err != nil {
        err = fmt.Errorf("请求url[%s] failed，err:%v", url, err)
		logs.Error(err.Error())
		return
    }
 
    defer resp.Body.Close()
    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        err = fmt.Errorf("获取Body数据 failed，err:%v", err)
		logs.Error(err.Error())
		return
    }
 
	data := string(body)
	err = json.Unmarshal([]byte(data), &result)
	if err != nil {
		err = fmt.Errorf("解析Json失败，err:%v", err)
		logs.Error(err.Error())
		return
	}
	return
}

func getPostData(url, post_data string)(result map[string]interface{}, err error){
	
	//post_data := fmt.Sprintf("username=%s&site_name=xxxx&key=xxx",username)
	resp, err := http.Post(url,"application/x-www-form-urlencoded",strings.NewReader(post_data))
	if err != nil {
		err = fmt.Errorf("请求url[%s] failed，err:%v", url, err)
		logs.Error(err.Error())
		return
	}

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		err = fmt.Errorf("获取Body数据 failed，err:%v", err)
		logs.Error(err.Error())
		return
	}

	data := string(body)
	err = json.Unmarshal([]byte(data), &result)
	if err != nil {
		err = fmt.Errorf("解析Json失败，err:%v", err)
		logs.Error(err.Error())
		return
	}
	return
}