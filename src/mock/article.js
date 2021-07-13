import ld from 'layout-dynamic-ui';
import tools from '@/mock/tools.js';
//引入mockjs
const Mock = require('mockjs')
// 获取 mock.Random 对象
const Random = Mock.Random;


//使用mockjs模拟数据
Mock.mock(new RegExp('/article/getById.*'), 'get', (req, res) => { //当post或get请求到/api/data路由时Mock会拦截请求并返回上面的数据.
	let request = ld.util.urlToObj(req['url']);
	return {
		code: 0,
		data: {
			id: 1000 + 1 + '',
			content: Random.cparagraph(1, 20),
			title: Random.cparagraph(1, 2), //随机生成一段中文文本。
			state: Random.integer(0, 2) + '', //返回一个随机的整数
			remake: Random.cparagraph(1, 3),
		},
		msg: '保存成功！'
	}
})
//使用mockjs模拟数据
Mock.mock(new RegExp('/article/getPage.*'), 'get', (req, res) => { //当post或get请求到/api/data路由时Mock会拦截请求并返回上面的数据.
	let list = [];
	for (let i = 0; i < 30; i++) {
		let listObject = {
			id: 1000 + i + '',
			title: Random.cparagraph(1, 2), //随机生成一段中文文本。
			state: Random.integer(0, 2) + '', //返回一个随机的整数
			remake: Random.cparagraph(1, 3),
			createdTime: Random.datetime()
		}
		list.push(listObject);
	}
	return {
		data: list
	}
})


//使用mockjs模拟数据
Mock.mock('/article/save', 'post', (req, res) => { //当post或get请求到/api/data路由时Mock会拦截请求并返回上面的数据.
	let request = JSON.parse(req.body);
	// let request = ld.util.urlToObj(req['url']);
	return {
		code: 0,
		msg: '保存成功！'
	}
})

