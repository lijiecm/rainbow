package model

import (
	"github.com/astaxie/beego/orm"
	"errors"
	"rainbow/tools"
)

func init() {
	orm.RegisterModel(new(Users))
}

// Save保存数据
// @param oSlice 为了方便事务中传入当前的事务句柄
func (this *Users) Save(oSlice ...*orm.Ormer) error {
	var o *orm.Ormer
	var err error

	if oSlice == nil {
		_temp := orm.NewOrm()
		o = &_temp
	} else {
		o = oSlice[0]
	}

	// 如果是刚刚初始化还没有保存数据库的
	if this.Id <= 0 {
		_, err := (*o).Insert(this)
		return err
	}

	// 如果用户改变了数据, 单纯的想保存一下
	_, err = (*o).Update(this)
	return err
}

// MatchPassword 检查密码是否正确
func (this *Users) MatchPassword(password string) bool {
	return tools.ValidPassword(this.Password, password)
}

// ChangePassword 修改密码, 写入数据库
func (this *Users) ChangePassword(password string) error {
	this.Password = tools.StrToMD5(password)
	err := this.Save()
	return err
}

// SetFrozen 冻结当前用户, 写入数据库
func (this *Users) SetFrozen(frozen bool) error {
	this.Frozen = frozen
	err := this.Save()
	return err
}

// GetUserByUsername 根据用户名获取帐号信息
func GetUserByUsername(username string) (*Users, error) {
	user := Users{Username: username}
	o := orm.NewOrm()
	err := o.Read(&user, "Username")
	if user.DeletedAt == "" {
		return &user, err
	} else {
		return nil, errors.New("user is deleted")
	}
}

// GetUserById 根据Id获取帐号信息
func GetUserById(id int) (*Users, error) {
	user := Users{Id: id}
	o := orm.NewOrm()
	err := o.Read(&user, "Id")
	if user.DeletedAt == "" {
		return &user, err
	} else {
		return nil, errors.New("user is deleted")
	}
}

