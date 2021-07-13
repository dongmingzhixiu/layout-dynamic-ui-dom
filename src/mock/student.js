import ld from 'layout-dynamic-ui';
import tools from '@/mock/tools.js';
//引入mockjs
const Mock = require('mockjs')
// 获取 mock.Random 对象
const Random = Mock.Random;
//使用mockjs模拟数据
Mock.mock(new RegExp('/student/getPage[?].*'), 'get', (req, res) => { //当post或get请求到/api/data路由时Mock会拦截请求并返回上面的数据.
	let request = ld.util.urlToObj(req['url']);
	let list = [];
	let pageSize = parseInt(request['pageSize']) || 10;
	for (let i = 0; i < pageSize; i++) {
		let clzss=[`大${Random.integer(1, 10)}班`,`中${Random.integer(1, 10)}班`,`小${Random.integer(1, 10)}班`];
		let listObject = {
			names: Random.cname(), //随机生成一段中文文本。
			// clzssId:clzss[Random.integer(0, 2)] ,
			classId:Random.integer(1000, 1030)+"" ,
			clzssId:Random.integer(1000, 1030)+"" ,
			id:1000+i*pageSize, //返回一个随机的整数。
			birthday: Random.date(),
			sex:Random.integer(0, 2),
			updatedTime: Random.date(),
			createdTime: Random.date(),
			photo:Random.image(),
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
Mock.mock(new RegExp('/student/get[?].*'), 'get', (req, res) => { //当post或get请求到/api/data路由时Mock会拦截请求并返回上面的数据.
	let request = ld.util.urlToObj(req['url']);
	let list = [];
	let pageSize = parseInt(request['pageSize']) || 10;
	for (let i = 0; i < pageSize; i++) {
		let clzss=[`大${Random.integer(1, 10)}班`,`中${Random.integer(1, 10)}班`,`小${Random.integer(1, 10)}班`];
		let listObject = {
			names: Random.cname(), //随机生成一段中文文本。
			// clzssId:clzss[Random.integer(0, 2)] ,
			clzssId:Random.integer(1000, 1030)+"" ,
			id:1000+i*pageSize, //返回一个随机的整数。
			birthday: Random.date(),
			sex:Random.integer(0, 2),
			updatedTime: Random.date(),
			createdTime: Random.date(),
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
Mock.mock('/student/save', 'post', (req, res) => { //当post或get请求到/api/data路由时Mock会拦截请求并返回上面的数据.
	let request = JSON.parse(req.body);
	// let request = ld.util.urlToObj(req['url']);
	return {
		code: 0,
		msg: '保存成功！'
	}
})

//使用mockjs模拟数据
Mock.mock(new RegExp('/student/getByClassId[?].*s'), 'get', (req, res) => { //当post或get请求到/api/data路由时Mock会拦截请求并返回上面的数据.
	let id = 1001
	try {
		id = ld.util.urlToObj(req['url'])['id'] || 1001;
	} catch (e) {
		//TODO handle the exception
	}
	return {
		code: 0,
		data: {
			names: Random.cname(), //随机生成一段中文文本。
			classId:Random.integer(1000, 1030)+"" ,
			id: id, //返回一个随机的整数。
			birthday: Random.date(),
			updatedTime: Random.date(),
			createdTime: Random.date(),
		},
		msg: '保存成功！'
	}
})

//使用mockjs模拟数据
Mock.mock(new RegExp('/student/getById.*'), 'get', (req, res) => { //当post或get请求到/api/data路由时Mock会拦截请求并返回上面的数据.
	let id = 1001
	try {
		id = ld.util.urlToObj(req['url'])['id'] || 1001;
	} catch (e) {
		//TODO handle the exception
	}
	return {
		code: 0,
		data: {
			names: Random.cname(), //随机生成一段中文文本。
			classId:Random.integer(1000, 1030)+"" ,
			id: id, //返回一个随机的整数。
			birthday: Random.date(),
			updatedTime: Random.date(),
			createdTime: Random.date(),
		},
		msg: '保存成功！'
	}
})
