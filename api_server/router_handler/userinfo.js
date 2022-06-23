// 导入数据库操作模块
const db = require('../db/index');
// 导入处理密码的模块
const bcrypt = require('bcryptjs');

// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
    // 根据用户的 id，查询用户的基本信息
    // 注意：为了防止用户的密码泄露，需要排除 password 字段
    const sql = 'select id, username, nickname, email, user_pic from ev_users where id=?';
    // 注意：req 对象上的 user 属性，是 Token 解析成功，express-jwt 中间件帮我们挂载上去的
    db.query(sql, req.user.id, (err, results) => {
        if (err) return res.cc(err);
        // 执行 SQL 语句成功，但是查询的结果可能为空
        if (results.length !== 1) return res.cc('获取用户信息失败');
        res.send({
            status: 0,
            message: "获取用户信息成功！",
            data: results[0]
        })
    })
}

// 更新用户基本信息的处理函数
exports.updateUserInfo = (req, res) => {
    // 定义待执行的 SQL 语句
    const sql = `update ev_users set ? where id=?`;
    // 调用 db.query() 执行 SQL 语句并传递参数
    // 不需要提交id信息，不然当前用户可以修改其他用户的信息，直接用登录用户的req.user.id来判断用户即可
    db.query(sql, [req.body, req.user.id], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err);
        // 执行 SQL 语句成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.cc('更新用户的基本信息失败！');
        // 成功
        res.cc('更新用户信息成功！', 0);
    });
}

// 更新用户密码的处理函数
exports.updatePassword = (req, res) => {
    // 根据 id 查询用户的信息
    const sql = `select * from ev_users where id=?`;
    // 执行根据 id 查询用户的信息的 SQL 语句
    db.query(sql, req.user.id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err);
        // 判断结果是否存在
        if (results.length !== 1) return res.cc('用户不存在！');

        // TODO 判断用户密码是否正确
        // 在头部区域导入 bcryptjs 后，
        // 即可使用 bcrypt.compareSync(提交的密码，数据库中的密码) 方法验证密码是否正确
        // compareSync() 函数的返回值为布尔值，true 表示密码正确，false 表示密码错误
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password);
        if (!compareResult) return res.cc('旧密码错误！');

        // TODO 更新数据库中的密码
        const sql = 'update ev_users set password=? where id=?';
        // 对新密码进行 bcrypt 加密处理
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10);
        db.query(sql, [newPwd, req.user.id], (err, results) => {
            if (err) return res.cc(err);
            if (results.affectedRows !== 1) return res.cc('更新密码失败');
            res.cc('更新密码成功', 0);
        })
    })
}

// 更新用户头像的处理函数
exports.updateAvatar = (req, res) => {
    // 1. 定义更新头像的 SQL 语句
    const sql = `update ev_users set user_pic=? where id=?`;
    // 2. 调用 db.query() 执行 SQL 语句
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err);
        // 影响的行数是否等于 1
        if (results.affectedRows !== 1) return res.cc('更换头像失败！');
        // 成功
        res.cc('更换头像成功！', 0);
    });
}