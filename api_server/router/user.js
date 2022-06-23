const express = require('express')
// 创建路由对象
const router = express.Router()

// 导入用户路由处理函数对应的模块
const user_handler = require('../router_handler/user')

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
// !!!进行结构赋值，正常情况下得到的是mudule.exports 对象，但我们需要的只是对象中的reg_login_schema属性
const { reg_login_schema } = require('../schema/user')

// 注册新用户
// XXX 客户端调用接口时用于 注册功能中将新用户的信息保存在数据库中
router.post('/reguser', expressJoi(reg_login_schema), user_handler.regUser)

// 登录
// XXX 客户端调用接口时用于 登录功能中判断用户输入的账号和密码是否正确，正确后进入主页
router.post('/login', expressJoi(reg_login_schema), user_handler.login)

// 将路由对象共享出去
module.exports = router
