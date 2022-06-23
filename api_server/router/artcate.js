// 文章分类的路由模块
const express = require('express')
// 创建路由对象
const router = express.Router()

// 导入文章分类的路由处理函数模块
const artCate_handle = require('../router_handler/artcate')

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入文章分类的验证模块
const {
	add_cate_schema,
	delete_cate_schema,
	get_cate_schema,
	update_cate_schema
} = require('../schema/artcate')

// 获取文章分类列表
// XXX 客户端调用接口时用于文章类别功能中 渲染文章类别到页面中
router.get('/cates', artCate_handle.getArtCates)

// 新增文章分类
// XXX 客户端调用接口时用于文章类别功能中 添加类别
router.post('/addcates', expressJoi(add_cate_schema), artCate_handle.addArticleCates)

// 根据id删除文章分类的路由
// XXX 客户端调用接口时用于文章类别功能中 删除类别
router.get('/deletecate/:id', expressJoi(delete_cate_schema), artCate_handle.deleteCateById)

// 根据 Id 获取文章分类
// XXX 客户端调用接口时用于文章类别功能中 编辑类别时显示相对应的类别信息
router.get('/cates/:id', expressJoi(get_cate_schema), artCate_handle.getArtCateById)

// 根据 Id 更新文章分类
// XXX 客户端调用接口时用于文章类别功能中 更新类别后将类别信息保存在数据库后重新渲染类别到页面中
router.post('/updatecate', expressJoi(update_cate_schema), artCate_handle.updateCateById)

module.exports = router
