// 导入 express
const express = require('express')
// 创建路由对象
const router = express.Router()

// 导入用户信息的路由处理函数模块
const userinfo_handler = require('../router_handler/userinfo')

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
const {
	update_userinfo_schema,
	update_password_schema,
	update_avatar_schema
} = require('../schema/user')

// 获取用户基本信息的路由
// XXX 客户端调用接口时用于 渲染用户的基本信息
router.get('/userinfo', userinfo_handler.getUserInfo)

// 更新用户信息的路由
// XXX 客户端调用接口时用于个人中心功能中 修改用户信息后保存在数据库和重新渲染用户基本信息
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo)

// 更新密码的路由
// XXX 客户端调用接口时用于个人中心功能中 修改用户密码后保存在数据库
router.post('/updatepwd', expressJoi(update_password_schema), userinfo_handler.updatePassword)

// 更换头像的路由
// XXX 客户端调用接口时用于个人中心功能中 修改用户头像后保存在数据库和重新渲染用户头像
router.post('/update/avatar', expressJoi(update_avatar_schema), userinfo_handler.updateAvatar)

// 向外共享路由对象
module.exports = router
