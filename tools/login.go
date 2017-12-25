package tools
import (
	"crypto/md5"
	"encoding/hex"
)
type ErrorCodeMsg struct {
	Code string `json:"code"`
	Msg  string `json:"msg"`
}

type DebugErrorCodeMsg struct {
	ErrorCodeMsg
	DebugMsg string `json:"debug_msg"`
}

// 配送站级别角色
const (
	RoleAdmin    = 1 << iota // 系统管理员
	RoleManager              // 角色管理员
	RoleAPP                 // app管理员
)

var (
	// 请求成功
	Success     = ErrorCodeMsg{"0000", "ok"}
	ServerError = ErrorCodeMsg{"0001", "服务器错误, 请稍后再试"}

	// 请求参数相关 1001~1100
	ParameterError      = ErrorCodeMsg{"1001", "请求参数错误"}
	UsernameError       = ErrorCodeMsg{"1002", "用户名或者密码错误"}
	PasswordError       = ErrorCodeMsg{"1003", "用户名或者密码错误"}
	PasswordUpdateError = ErrorCodeMsg{"1004", "密码更新失败"}
	UrlFormatError      = ErrorCodeMsg{"1005", "url格式错误"}
	
	// 登录与权限相关错误 1101~1200
	PermError          = ErrorCodeMsg{"1101", "权限不足"}
	LoginRequiredError = ErrorCodeMsg{"1102", "未登录无法完成请求"}
	LoginFrozenError   = ErrorCodeMsg{"1103", "该用户被冻结，无法登录"}
)

// ValidPassword 校验密码是否正确
func ValidPassword(encrypted_pwd, raw_pwd string) bool {
	raw_encoded_val := StrToMD5(raw_pwd)
	return encrypted_pwd == raw_encoded_val
}

// StrToMD5 生成字符串的 md5sum
func StrToMD5(s string) string {
	h := md5.New()
	h.Write([]byte(s))
	rs := hex.EncodeToString(h.Sum(nil))
	return rs
}
