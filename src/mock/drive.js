import ld from 'layout-dynamic-ui';
import tools from '@/mock/tools.js';
//引入mockjs
const Mock = require('mockjs')
// 获取 mock.Random 对象
const Random = Mock.Random;
//使用mockjs模拟数据
Mock.mock(new RegExp('/drive/getById.*'), 'get', (req, res) => { //当post或get请求到/api/data路由时Mock会拦截请求并返回上面的数据.
	let request = ld.util.urlToObj(req['url']);
	const names=['总园','分园'];
	let i=parseInt(request['clzssId']||1001)-1000;
	return {
		code: 0,
		data: {
			id:1000+i+'',
			names: names[Random.integer(0,1)], //随机生成一段中文文本。
			code:Random.uuid(),
			types:Random.integer(0,2)+'', //返回一个随机的整数
			clzssId:(Random.integer(0,2)%2==0?'':1000+Random.integer(0,30))+'',
			remake:Random.cparagraph(1, 3),
			schooldId:Random.integer(0,1)+''
		},
		msg: '保存成功！'
	}
})
//使用mockjs模拟数据
Mock.mock(new RegExp('/drive/getPage.*'), 'get', (req, res) => { //当post或get请求到/api/data路由时Mock会拦截请求并返回上面的数据.
	let list = [];
	const names=['总园','分园'];
	for (let i = 0; i < 30; i++) {
		let listObject = {
			id:1000+i+'',
			names: names[Random.integer(0,1)], //随机生成一段中文文本。
			code:Random.uuid(),
			types:Random.integer(0,2)+'', //返回一个随机的整数
			clzssId:(Random.integer(0,2)%2==0?'':1000+Random.integer(0,30))+'',
			remake:Random.cparagraph(1, 3),
			schooldId:Random.integer(0,1)+''
		}
		list.push(listObject);
	}
	return {
		data: list
	}
})


//使用mockjs模拟数据
Mock.mock('/drive/save', 'post', (req, res) => { //当post或get请求到/api/data路由时Mock会拦截请求并返回上面的数据.
	let request = JSON.parse(req.body);
	// let request = ld.util.urlToObj(req['url']);
	return {
		code: 0,
		msg: '保存成功！'
	}
})

