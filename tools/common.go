package tools


func DeleteStr(List []string, str string) (NewList []string) {
	
	index := 0
	for i := range List {
		if List[i] == str {
			index = i
			break
		}
	}

	NewList = List[0:0]
	NewList = append(NewList, List[:index]...)
	NewList = append(NewList, List[index+1:]...)
	return
}


func FindStr(List []string, str string) (index, status int) {
	/*
	status 为0 的的时候，表示找不到字符串，status为1的时候，表示可以找到，切返回index值
	*/
	status = 0
	for i := range List {
		if List[i] == str {
			index = i
			status = 1
			break 
		}
		
	}
	return

}
