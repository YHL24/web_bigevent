const db = require('../db/index')

// 获取文章分类列表的处理函数
exports.getArtCates = (req, res) => {
	const sql = 'select * from ev_article_cate where is_delete=0 order by id asc'
	db.query(sql, (err, results) => {
		if (err) return res.cc(err)
		if (results.length < 1) res.cc('无文章列表')
		res.send({
			status: 0,
			message: '获取文章列表成功',
			data: results
		})
	})
}

// 新增文章分类的处理函数
exports.addArticleCates = (req, res) => {
	// 1. 定义查重的 SQL 语句
	const sql = `select * from ev_article_cate where name=? or alias=?`
	// 2. 执行查重的 SQL 语句
	db.query(sql, [req.body.name, req.body.alias], (err, results) => {
		// 3. 判断是否执行 SQL 语句失败
		if (err) return res.cc(err)

		// 4.1 判断数据的 length，文章名字和别名不是在同一个id中被占用
		if (results.length === 2) return res.cc('分类名称与分类别名被占用，请更换后重试！')
		// 4.2 length 等于 1 的三种情况
		// 文章名字和别名在同一个id中被占用
		if (
			results.length === 1 &&
			results[0].name === req.body.name &&
			results[0].alias === req.body.alias
		)
			return res.cc('分类名称与分类别名被占用，请更换后重试！')
		// 只有名称被占用
		if (results.length === 1 && results[0].name === req.body.name)
			return res.cc('分类名称被占用，请更换后重试！')
		// 只有别名被占用
		if (results.length === 1 && results[0].alias === req.body.alias)
			return res.cc('分类别名被占用，请更换后重试！')

		// 定义插入文章分类的 SQL 语句
		const sql = `insert into ev_article_cate set ?`
		// 执行插入文章分类的 SQL 语句
		db.query(sql, req.body, (err, results) => {
			if (err) return res.cc(err)
			if (results.affectedRows !== 1) return res.cc('新增文章分类失败！')
			res.cc('新增文章分类成功！', 0)
		})
	})
}

// 根据 Id 删除文章分类的处理函数
exports.deleteCateById = (req, res) => {
	// 定义标记删除的 SQL 语句
	const sql = 'update ev_article_cate set is_delete=1 where id=?'
	// 调用 db.query() 执行 SQL 语句
	db.query(sql, req.params.id, (err, results) => {
		if (err) return res.cc(err)
		if (results.affectedRows !== 1) return res.cc('删除文章类别失败')
		res.cc('删除文章类别成功', 0)
	})
}

// 根据 Id 获取文章分类的处理函数
exports.getArtCateById = (req, res) => {
	// 定义根据 ID 获取文章分类数据的 SQL 语句
	const sql = 'select * from ev_article_cate where id=?'
	db.query(sql, req.params.id, (err, results) => {
		if (err) return res.cc(err)
		if (results.length !== 1) return res.cc('获取文章分类失败')
		res.send({
			status: 0,
			message: '获取文章分类成功',
			// 如果是 results 则data是一个数组，里面只有一个对象， 如果是results[0]，则data是一个对象
			data: results[0]
		})
	})
}

// 根据 Id 更新文章分类的处理函数
exports.updateCateById = (req, res) => {
	// 1. 定义查重的 SQL 语句
	// 必须得加上 id!=? ,因为如果不排除自身id的name和alias的话，那就没办法单独对其中的某一个值进行修改，只能一次性修改两个值。
	// 因为如果不排除自身，只修改一个值的话，另一个值必定被查重
	const sql = `select * from ev_article_cate where id!=? and(name=? or alias=?)`
	// 2. 执行查重的 SQL 语句
	db.query(sql, [req.body.id, req.body.name, req.body.alias], (err, results) => {
		// 3. 判断是否执行 SQL 语句失败
		if (err) return res.cc(err)

		// 4.1 判断数据的 length，文章名字和别名不是在同一个id中被占用
		if (results.length === 2) return res.cc('分类名称与分类别名被占用，请更换后重试！')
		// 4.2 length 等于 1 的三种情况
		// 文章名字和别名在同一个id中被占用
		if (
			results.length === 1 &&
			results[0].name === req.body.name &&
			results[0].alias === req.body.alias
		)
			return res.cc('分类名称与分类别名被占用，请更换后重试！')
		// 只有名称被占用
		if (results.length === 1 && results[0].name === req.body.name)
			return res.cc('分类名称被占用，请更换后重试！')
		// 只有别名被占用
		if (results.length === 1 && results[0].alias === req.body.alias)
			return res.cc('分类别名被占用，请更换后重试！')

		// 定义更新文章分类的 SQL 语句
		const sql = `update ev_article_cate set ? where id=?`
		// 执行更新文章分类的 SQL 语句
		db.query(sql, [req.body, req.body.id], (err, results) => {
			if (err) return res.cc(err)
			if (results.affectedRows !== 1) return res.cc('更新文章分类失败！')
			res.cc('更新文章分类成功！', 0)
		})
	})
}
