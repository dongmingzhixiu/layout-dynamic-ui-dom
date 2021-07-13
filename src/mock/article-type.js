import ld from 'layout-dynamic-ui';
import tools from '@/mock/tools.js';
//引入mockjs
const Mock = require('mockjs')
// 获取 mock.Random 对象
const Random = Mock.Random;

//使用mockjs模拟数据
Mock.mock('/articleType/get$', 'get', (req, res) => { //当post或get请求到/api/data路由时Mock会拦截请求并返回上面的数据.
debugger
	// let request = ld.util.urlToObj(req['url']);
	let data = [{
		id: 0,
		label: '园所概况',
		parentId: '',
		children: [{
			id: 1,
			label: '招生通知',
			parentId: '0',
			prop:'招生通知'
		},{
			id: 12,
			label: '历史沿革',
			parentId: '0',
			prop:'历史沿革'
		},{
			id: 13,
			label: '幼儿园大事记',
			parentId: '0',
			prop:'幼儿园大事记'
		},{
			id: 14,
			label: '历任园长',
			parentId: '0',
			prop:'历任园长'
		},{
			id: 15,
			label: '园所文化',
			parentId: '0',
			prop:'园所文化'
		},{
			id: 11,
			label: '园所简介',
			parentId: '0',
			prop:'园所简介'
		}]
	}]
	return {
		code: 0,
		data: data,
		msg: '保存成功！'
	}
})
