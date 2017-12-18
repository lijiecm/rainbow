package tools
import (
	"github.com/garyburd/redigo/redis"
)


var (
	RedisPool *redis.Pool
)

func Init(redisPool *redis.Pool)(err error){
	RedisPool = redisPool
	return
}