; //引入mockjs
const Mock = require('mockjs')
// 获取 mock.Random 对象
const Random = Mock.Random;
//使用mockjs模拟数据
Mock.mock("/login/teacher", "post", (req, res) => { //当post或get请求到/api/data路由时Mock会拦截请求并返回上面的数据
	let json = JSON.parse(req.body);
	// if (json.phone == '18293115323' && json.password == '123456') {
		return {
			code: 0,
			data: {
				phone: '18293115323',
				name: '超级管理员',
				userType:'T',
				birthday:'1991-7-13',
				photo:Random.image()
			},
			msg: '登录成功！'
		}
	// }
	// return {
	// 	code: 1,
	// 	msg: '账户或密码错误！'
	// }
})

Mock.mock("/delete/byId", "post", (req, res) => { //当post或get请求到/api/data路由时Mock会拦截请求并返回上面的数据
	let param=JSON.parse(req.body);
	return typeof param['d']=='boolean'&&param['d']==false? {
		code: -1,
		msg: '权限不足不能删除！'
	}:{
		code: 0,
		msg: '删除成功！'
	}
})
