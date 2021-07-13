import ld from 'layout-dynamic-ui';
import tools from '@/mock/tools.js';
//引入mockjs
const Mock = require('mockjs')
// 获取 mock.Random 对象
const Random = Mock.Random;
//使用mockjs模拟数据
Mock.mock(new RegExp('/clzss/getById.*'), 'get', (req, res) => { //当post或get请求到/api/data路由时Mock会拦截请求并返回上面的数据.
	let request = ld.util.urlToObj(req['url']);
	let i=parseInt(request['clzssId']||1001)-1000;
	return {
		code: 0,
		data: {
			names: (i / 10 < 1 ? '小' : i / 10 < 2 && i / 10 >= 1 ? '中' : '大') + ((i % 20 >= 0 ? i % 20 : i %
				10 >= 0 ? i % 10 : i) + 1) + '班', //随机生成一段中文文本。
			id: 1000 + i+"", //返回一个随机的整数。
		},
		msg: '保存成功！'
	}
})
//使用mockjs模拟数据
Mock.mock(new RegExp('/clzss/getByOrganizationId'), 'get', (req, res) => { //当post或get请求到/api/data路由时Mock会拦截请求并返回上面的数据.
	let list = [];
	for (let i = 0; i < 30; i++) {
		let listObject = {
			names: (i / 10 < 1 ? '小' : i / 10 < 2 && i / 10 >= 1 ? '中' : '大') + ((i % 20 >= 0 ? i % 20 : i %
				10 >= 0 ? i % 10 : i) + 1) + '班', //随机生成一段中文文本。
			id: 1000 + i, //返回一个随机的整数。
		}
		list.push(listObject);
	}
	return {
		data: list
	}
})
//使用mockjs模拟数据
Mock.mock(new RegExp('/clzss/get$'), 'get', (req, res) => { //当post或get请求到/api/data路由时Mock会拦截请求并返回上面的数据.
	let list = [];
	for (let i = 0; i < 30; i++) {
		let listObject = {
			names: (i / 10 < 1 ? '小' : i / 10 < 2 && i / 10 >= 1 ? '中' : '大') + ((i % 20 >= 0 ? i % 20 : i %
				10 >= 0 ? i % 10 : i) + 1) + '班', //随机生成一段中文文本。
			id: 1000 + i, //返回一个随机的整数。
		}
		list.push(listObject);
	}
	return {
		data: list
	}
})
//使用mockjs模拟数据
Mock.mock(new RegExp('/clzss/getPage.*'), 'get', (req, res) => { //当post或get请求到/api/data路由时Mock会拦截请求并返回上面的数据.
	let list = [];
	for (let i = 0; i < 30; i++) {
		let listObject = {
			names: (i / 10 < 1 ? '小' : i / 10 < 2 && i / 10 >= 1 ? '中' : '大') + ((i % 20 >= 0 ? i % 20 : i %
				10 >= 0 ? i % 10 : i) + 1) + '班', //随机生成一段中文文本。
			id: 1000 + i, //返回一个随机的整数
			gradeId:i,
			headId:1000+Random.integer(0,30),
			teachersId:`${Random.cname()},${Random.cname()},${Random.cname()}`
		}
		list.push(listObject);
	}
	return {
		data: list
	}
})


//使用mockjs模拟数据
Mock.mock('/clzss/save', 'post', (req, res) => { //当post或get请求到/api/data路由时Mock会拦截请求并返回上面的数据.
	let request = JSON.parse(req.body);
	// let request = ld.util.urlToObj(req['url']);
	return {
		code: 0,
		msg: '保存成功！'
	}
})

