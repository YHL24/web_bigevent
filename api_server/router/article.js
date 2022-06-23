// 文章的路由模块
const express = require('express')
const router = express.Router()

// 导入解析 formdata 格式表单数据的包
const multer = require('multer')
// 导入处理路径的核心模块
const path = require('path')
// 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
const upload = multer({ dest: path.join(__dirname, '../uploads') })

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入文章分类的验证模块
const {
	add_article_schema,
	get_artlist_schema,
	delete_article_schema,
	get_article_schema,
	update_article_schema
} = require('../schema/article')

// 导入文章路由需要的处理函数模块
const article_handler = require('../router_handler/article')

// upload.single() 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
// 将文件类型的数据，解析并挂载到 req.file 属性中
// 将文本类型的数据，解析并挂载到 req.body 属性中
// 注意：在当前的路由中，先后使用了两个局部中间件：
//       先使用 multer 解析表单数据
//       再使用 expressJoi 对解析的表单数据进行验证
// 发布新文章的路由
// XXX 客户端调用接口时用于发布文章功能中 将用户发布新文章信息保存在数据库中
router.post(
	'/add',
	upload.single('cover_img'),
	expressJoi(add_article_schema),
	article_handler.addArticle
)

// 获取文章列表的路由
// XXX 客户端调用接口时用于文章列表功能中 渲染文章列表到页面中
router.get('/list', article_handler.getArtList)

// 根据id删除文章
// XXX 客户端调用接口时用于文章列表功能中 在文章列表中删除相对应的文章
router.get('/delete/:id', expressJoi(delete_article_schema), article_handler.deleteArticleById)

// 根据id获取文章
router.get('/:id', expressJoi(get_article_schema), article_handler.getArticleById)

// 根据id修改文章
router.post(
	'/edit',
	upload.single('cover_img'),
	expressJoi(update_article_schema),
	article_handler.updateArticleById
)

module.exports = router
