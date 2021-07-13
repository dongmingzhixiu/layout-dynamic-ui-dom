import ld from 'layout-dynamic-ui';
import tools from '@/mock/tools.js';
//引入mockjs
const Mock = require('mockjs')
// 获取 mock.Random 对象
const Random = Mock.Random;

//使用mockjs模拟数据
Mock.mock(new RegExp('/eat/getPage[?].*'), 'get', (req, res) => { //当post或get请求到/api/data路由时Mock会拦截请求并返回上面的数据.
	let request = ld.util.urlToObj(req['url']);
	let list = [];
	let pageSize = parseInt(request['pageSize']) || 10;
	let zaoc = ['小花卷,鸡蛋羹', '牛肉萝卜包子,八宝粥', '油茶,蝴蝶卷,鹌鹑蛋'];
	let wuc = ['米饭,西红柿炒菜花,鱼香肉丝,蔬菜汤','饸饹面', '米饭,杏鲍菇炒牛柳,手撕包菜,萝卜虾米紫菜汤','牛肉特色烩面', '花卷,炖鸡块'];
	let wud = [];
	for (let i = 0; i < pageSize; i++) {
		let listObject = {
			title: 2021 + " 第 " + Random.integer(0, 30) + " 周",
			week: '周' + Random.integer(1, 7),
			zaoc: zaoc[Random.integer(0, zaoc.length - 1)],
			wuc: wuc[Random.integer(0, wuc.length - 1)],
			wud: wud[Random.integer(0, wud.length - 1)],
			createdTime:Random.date(),
			weekName:'星期'+((i%7)+1),
			remake: '',
		}
		list.push(listObject);
	}
	return request['isPageHelper'] + '' == 'true' ? {
		data: {
			list: tools.filterDataByRequest(request, list),
			currentPage: request['pageNum'],
			pageSize: pageSize,
			total: 100
		}
	} : {
		data: tools.filterDataByRequest(request, list)
	}
})
//使用mockjs模拟数据
Mock.mock(new RegExp('/eat/get[?].*'), 'get', (req, res) => { //当post或get请求到/api/data路由时Mock会拦截请求并返回上面的数据.
	debugger
	let request = ld.util.urlToObj(req['url']);
	let list = [];
	let pageSize = parseInt(request['pageSize']) || 10;
	let zaoc = ['小花卷,鸡蛋羹', '牛肉萝卜包子,八宝粥', '油茶,蝴蝶卷,鹌鹑蛋'];
	let wuc = ['米饭,西红柿炒菜花,鱼香肉丝,蔬菜汤','饸饹面', '米饭,杏鲍菇炒牛柳,手撕包菜,萝卜虾米紫菜汤','牛肉特色烩面', '花卷,炖鸡块'];
	let wud = [];
	for (let i = 0; i < pageSize; i++) {
		let listObject = {
			title: 2021 + " 第 " + Random.integer(0, 30) + " 周",
			week: '周' + Random.integer(1, 7),
			zaoc: zaoc[Random.integer(0, zaoc.length - 1)],
			wuc: wuc[Random.integer(0, wuc.length - 1)],
			wud: wud[Random.integer(0, wud.length - 1)],
			remake: '',
		}
		list.push(listObject);
	}
	return request['isPageHelper'] + '' == 'true' ? {
		data: {
			list: tools.filterDataByRequest(request, list),
			currentPage: request['pageNum'],
			pageSize: pageSize,
			total: 100
		}
	} : {
		data: tools.filterDataByRequest(request, list)
	}
})

//使用mockjs模拟数据
Mock.mock('/eat/save', 'post', (req, res) => { //当post或get请求到/api/data路由时Mock会拦截请求并返回上面的数据.
	let request = JSON.parse(req.body);
	// let request = ld.util.urlToObj(req['url']);
	return {
		code: 0,
		msg: '保存成功！'
	}
})
//使用mockjs模拟数据
Mock.mock(new RegExp('/eat/getById.*'), 'get', (req, res) => { //当post或get请求到/api/data路由时Mock会拦截请求并返回上面的数据.
	let id = 1001
	try {
		id = ld.util.urlToObj(req['url'])['id'] || 1001;
	} catch (e) {
		//TODO handle the exception
	}
	return {
		code: 0,
		data: {
			cardNo: 206022002 + Random.integer(0, 1000) + '',
			cardId: 200200000 + Random.integer(0, 1000) + '',
			studentId: 1000 + Random.integer(0, 30) + '',
			relatives: Random.integer(0, 5) + '',
			clzssId: 1000 + Random.integer(0, 30) + '',
			state: Random.integer(0, 1),
			remake: Random.cparagraph(1, 3),
		},
		msg: '保存成功！'
	}
})
