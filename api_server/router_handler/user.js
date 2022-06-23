// 导入数据库操作模块
const db = require('../db/index')
// 导入bcrypt.js 对明文密码进行加密
const bcrypt = require('bcryptjs')
// 导入生成 Token 的包
const jwt = require('jsonwebtoken')
// 导入全局的配置文件
const config = require('../config')

// 注册新用户的处理函数
exports.regUser = (req, res) => {
	const userinfo = req.body
	// 对表单中的数据进行合法性校验
	// 使用验证规则对象对表单数据进行验证。
	// if (!userinfo.username || !userinfo.password) {
	//     return res.send({ status: 1, message: '用户名或密码不合法' });
	// }

	// 定义SQL语句，查询用户名是否被占用
	const sqlStr = 'select * from ev_users where username=?'
	db.query(sqlStr, userinfo.username, (err, results) => {
		// 执行SQL语句失败
		if (err) {
			// !!!res.cc 函数封装在了app.js 中，设置为全局中间件
			// return res.send({ status: 1, message: err.message });
			return res.cc(err)
		}
		// 判断用户名是否被占用
		if (results.length > 0) {
			// return res.send({ status: 1, message: '用户名被占用，请更换其他用户名！' });
			return res.cc('用户名被占用，请更换其他用户名！')
		}
		// 用户名未被占用
		// 调用bcrypt.hashSync() 对密码进行加密
		userinfo.password = bcrypt.hashSync(userinfo.password, 10)

		// 定义插入新用户的SQL语句
		const sql = 'insert into ev_users set ?'
		// 没有直接把userinfo当作第二个参数，因为用户可能提交了一些其他的信息，email等，我们只需要将username和password插入即可
		db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
			// 判断SQL语句是否执行成功
			// if (err) return res.send({ status: 1, message: err.message });
			if (err) return res.cc(err)
			// 判断影响函数是否为1
			// if (results.affectedRows !== 1) return res.send({ status: 1, message: '注册用户失败，请稍后再试！' });
			if (results.affectedRows !== 1) return res.cc('注册用户失败，请稍后再试！')
			// 注册用户成功
			// res.send({ status: 0, message: '注册成功！' });
			res.cc('注册成功！', 0)
		})
	})
	// res.send('reguser OK');
}

// 登录的处理函数
exports.login = (req, res) => {
	// 接收表单数据
	const userinfo = req.body
	// 定义SQL语句
	const sql = 'select * from ev_users where username=?'
	// 执行SQL语句，根据用户名查询用户的信息
	db.query(sql, userinfo.username, (err, results) => {
		// 执行SQL语句失败
		if (err) return res.cc(err)
		// 执行 SQL 语句成功，但是获取到的数据条数不等于 1
		if (results.length !== 1) return res.cc('登录失败！')

		// TODO：判断密码是否正确
		// 调用 bcrypt.compareSync(用户提交的密码, 数据库中的密码) 方法比较密码是否一致
		// 返回值是布尔值（true 一致、false 不一致）
		const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
		if (!compareResult) return res.cc('密码输入错误，登录失败！')

		// TODO：在服务器端生成 Token 的字符串
		// 用 password: '', user_pic: '' 覆盖...results[0]展开的用户信息
		// 剔除完毕之后，user 中只保留了用户的 id, username, nickname, email 这四个属性的值
		const user = { ...results[0], password: '', user_pic: '' }
		// 对用户的信息进行加密，生成 Token 字符串
		const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
		// 调用 res.send() 将 Token 响应给客户端
		res.send({
			status: 0,
			message: '登录成功！',
			// 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
			token: 'Bearer ' + tokenStr
		})
	})
}
