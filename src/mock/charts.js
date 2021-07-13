import ld from 'layout-dynamic-ui';
import tools from '@/mock/tools.js';
//引入mockjs
const Mock = require('mockjs')
// 获取 mock.Random 对象
const Random = Mock.Random;


//使用mockjs模拟数据
Mock.mock(new RegExp('/charts/studentByDay'), 'get', (req, res) => { //当post或get请求到/api/data路由时Mock会拦截请求并返回上面的数据.
	return {
		data: [Random.integer(400, 550), Random.integer(400, 550), Random.integer(400, 550)]
	}
})

//使用mockjs模拟数据
Mock.mock(new RegExp('/charts/studentByDay'), 'get', (req, res) => { //当post或get请求到/api/data路由时Mock会拦截请求并返回上面的数据.
	return {
		data: [Random.integer(400, 550), Random.integer(400, 550), Random.integer(400, 550)]
	}
})

Mock.mock(new RegExp('/charts/teacherByDay'), 'get', (req, res) => { //当post或get请求到/api/data路由时Mock会拦截请求并返回上面的数据.
	return {
		data: [Random.integer(1, 3), Random.integer(50, 90), Random.integer(20, 40)]
	}
})


Mock.mock(new RegExp('/charts/selectInfoByDay'), 'get', (req, res) => { //当post或get请求到/api/data路由时Mock会拦截请求并返回上面的数据.
	let d = new Date();
	let dayTotal = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
	return {
		code: 0,
		data: {
			s: Random.integer(400, 550),
			sc: Random.integer(300, 400),
			t: Random.integer(100, 120),
			tc: Random.integer(80, 100),
		}
	}
})


const getDayArr = (dayTotal) => {
	let ar = [];
	let d = new Date();
	let m = d.getMonth() + 1;
	m = (m + "").padStart(2, '0');

	for (let i = 1; i <= dayTotal; i++) {
		ar[i - 1] = `${m}${(i+"").padStart(2,'0')}` + ""
	}
	return ar;
}

const getRandomArr = (dayTotal, min, max) => {
	// let data = {};
	let data=[];
	let d = new Date();
	let _m=d.getMonth() + 1;
	let m = (d.getFullYear() + "").substr(-2) + (_m+ "").padStart(2, '0');
	for (let i = 1; i <= dayTotal; i++) {
		let key = `${m}${(i+"").padStart(2,'0')}` + "";
		data[i-1] = [Random.integer(min, max), Random.integer(min, max), Random.integer(min, max)];
	}
	return data;

}

Mock.mock(new RegExp('/charts/studentByMonth'), 'get', (req, res) => { //当post或get请求到/api/data路由时Mock会拦截请求并返回上面的数据.
	let d = new Date();
	let dayTotal = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
	return {
		code: 0,
		data: getRandomArr(dayTotal, 400, 500),
		// data: {
		// 	xAxisData: getDayArr(dayTotal),
		// 	seriesData1: getRandomArr(dayTotal, 400, 500),
		// 	seriesData2: getRandomArr(dayTotal, 400, 500),
		// }
	}
})

Mock.mock(new RegExp('/charts/teacherByMonth'), 'get', (req, res) => { //当post或get请求到/api/data路由时Mock会拦截请求并返回上面的数据.
	let d = new Date();
	let dayTotal = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
	return {
		code: 0,
		data: getRandomArr(dayTotal, 400, 500),
		// data: {
		// 	xAxisData: getDayArr(dayTotal),
		// 	seriesData1: getRandomArr(dayTotal, 90, 180),
		// 	seriesData2: getRandomArr(dayTotal, 90, 180),
		// }
	}
})
