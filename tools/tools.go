package tools
import (
	"github.com/garyburd/redigo/redis"
)


var (
	RedisPool *redis.Pool
)



type Page struct {
    PageNo     int
    PageSize   int
    TotalPage  int
    TotalCount int
    FirstPage  bool
    LastPage   bool
    List       interface{}
}

func Init(redisPool *redis.Pool)(err error){
	RedisPool = redisPool
	return
}



func PageUtil(count int, pageNo int, pageSize int, list interface{}) Page {
	/*
	pageNo:当前页
	pageSize:每页的行数
	count: 总数据行数
	list: 总数据列表
	*/

	tp := count / pageSize
    if count % pageSize > 0 {
        tp = count / pageSize + 1
    }
    return Page{PageNo: pageNo, PageSize: pageSize, TotalPage: tp, TotalCount: count, FirstPage: pageNo == 1, LastPage: pageNo == tp, List: list}
}