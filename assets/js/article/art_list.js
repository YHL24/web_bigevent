$(function () {
	var layer = layui.layer
	var form = layui.form
	var laypage = layui.laypage

	// 定义模板引擎的过滤器来美化时间
	template.defaults.imports.dataFormat = function (date) {
		const dt = new Date(date)

		var y = dt.getFullYear()
		var m = padZero(dt.getMonth() + 1)
		var d = padZero(dt.getDate())

		var hh = padZero(dt.getHours())
		var mm = padZero(dt.getMinutes())
		var ss = padZero(dt.getSeconds())

		return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
	}

	// 定义补零的函数
	function padZero(n) {
		return n > 9 ? n : '0' + n
	}

	initTable()

	// 获取文章列表数据的方法
	function initTable() {
		$.ajax({
			method: 'GET',
			url: '/my/article/list',
			data: '',
			success: function (res) {
				if (res.status !== 0) {
					$('tbody').html('')
					return layer.msg(res.message)
				}
				// 使用模板引擎渲染页面的数据
				var htmlStr = template('tpl-table', res)
				$('tbody').html(htmlStr)
			}
		})
	}

	// 通过代理的形式，为删除按钮绑定点击事件处理函数
	$('tbody').on('click', '.btn-delete', function () {
		// 获取到文章的 id
		var id = $(this).attr('data-id')
		// 询问用户是否要删除数据
		layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
			$.ajax({
				method: 'GET',
				url: '/my/article/delete/' + id,
				success: function (res) {
					if (res.status !== 0) {
						return layer.msg(res.message)
					}
					layer.msg('删除文章成功！')
					initTable()
				}
			})
			layer.close(index)
		})
	})
})

// 监听编辑按钮的点击事件
$('tbody').on('click', '.btnEdit', function (e) {
	e.preventDefault()
	// 得到当前文章的id，跳转到新页面时，作为参数发送到服务器请求数据
	let id = $(this).attr('data-id')

	// localStorage.setItem('id', id)

	// 发起请求获取对应文章的数据
	$.ajax({
		method: 'GET',
		url: '/my/article/' + id,
		success: function (res) {
			if (res.status !== 0) {
				return layer.msg(res.message)
			}
			console.log(res)
			location.href = './art_pub.html'
			//!!! 跳转过去后怎么实现将数据渲染到页面上呢？？？
			// form.val('form-pub', res.data)
		}
	})
})
