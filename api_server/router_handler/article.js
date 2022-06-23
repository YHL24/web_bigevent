// 文章的处理函数模块
const db = require('../db/index')
// 导入处理路径的 path 核心模块
const path = require('path')

// 发布新文章的处理函数
exports.addArticle = (req, res) => {
	// 手动判断是否上传了文章封面
	if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数！')

	// 整理要插入数据库的文章信息对象：
	const articleInfo = {
		// 标题、内容、状态、所属的分类Id
		...req.body,
		// 文章封面在服务器端的存放路径
		cover_img: path.join('/uploads', req.file.filename),
		// 文章发布时间
		pub_date: new Date(),
		// 文章作者的Id
		author_id: req.user.id
	}
	const sql = 'insert into ev_article set ?'
	// 执行 SQL 语句
	db.query(sql, articleInfo, (err, results) => {
		// 执行 SQL 语句失败
		if (err) return res.cc(err)
		// 执行 SQL 语句成功，但是影响行数不等于 1
		if (results.affectedRows !== 1) return res.cc('发布文章失败！')
		// 发布文章成功
		res.cc('发布文章成功', 0)
	})
}

// 获取文章列表的处理函数
exports.getArtList = (req, res) => {
	const sql =
		'select ats.id, title, pub_date, state, ac.name from ev_article ats left join ev_article_cate ac on (ats.cate_id=ac.id) where ats.is_delete=0 and author_id=?; '
	// const sql = 'select * from ev_article'
	db.query(sql, req.user.id, (err, results) => {
		// sql = '';
		if (err) return res.cc(err)
		if (results.length < 1) return res.cc('无文章列表')
		res.send({
			status: 0,
			message: '获取文章列表成功',
			data: results
		})
	})
}

// 根据id删除文章的处理函数
exports.deleteArticleById = (req, res) => {
	const sql = 'update ev_article set is_delete=1 where id=?'
	db.query(sql, req.params.id, (err, results) => {
		if (err) return res.cc(err)
		res.cc('删除文章成功', 0)
	})
}

// 根据id获取文章的处理函数
exports.getArticleById = (req, res) => {
	// 定义根据 ID 获取文章分类数据的 SQL 语句
	const sql = 'select * from ev_article where id=?'
	db.query(sql, req.params.id, (err, results) => {
		if (err) return res.cc(err)
		if (results.length !== 1) return res.cc('获取文章失败')
		res.send({
			status: 0,
			message: '获取文章成功',
			data: results[0]
		})
	})
}

// 根据id修改文章的处理函数
exports.updateArticleById = (req, res) => {
	if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数！')
	// 整理要插入数据库的文章信息对象：
	const updateArticleInfo = {
		// 标题、内容、状态、所属的分类Id, id
		...req.body,
		// 文章封面在服务器端的存放路径
		cover_img: path.join('/uploads', req.file.filename)
	}
	const sql = 'update ev_article set ? where id=?'
	db.query(sql, [updateArticleInfo, req.body.id], (err, results) => {
		if (err) return res.cc(err)
		if (results.affectedRows !== 1) return res.cc('修改文章错误')
		res.cc('修改文章成功', 0)
	})
}
