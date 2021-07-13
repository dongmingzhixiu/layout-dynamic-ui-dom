import ld from 'layout-dynamic-ui';
import tools from '@/mock/tools.js';
//引入mockjs
const Mock = require('mockjs')
// 获取 mock.Random 对象
const Random = Mock.Random;
//使用mockjs模拟数据
Mock.mock(new RegExp('/scanner/getCardAll'), 'get', (req, res) => { //当post或get请求到/api/data路由时Mock会拦截请求并返回上面的数据.
		return {
			data:[
				'http://ki.orange-info.cn/fileUpload/130d4515-e7e7-11e9-952c-5254005bc89f/photo/2019-11-08/5/3/dac4ccf0-0422-4dd2-b0cd-227b8fa5009c.png',
				'http://ki.orange-info.cn/fileUpload/130d4515-e7e7-11e9-952c-5254005bc89f/photo/2019-11-08/2/2/f9a67ad5-9335-4256-ab2a-e5a02c227008.png',
				'http://ki.orange-info.cn/fileUpload/130d4515-e7e7-11e9-952c-5254005bc89f/photo/2019-11-08/13/2/3b1ac7ef-e8f0-44d2-8a69-1dba8993207e.png',
				'http://ki.orange-info.cn/fileUpload/130d4515-e7e7-11e9-952c-5254005bc89f/photo/2019-11-08/1/4/a88a772a-2a3e-4af0-8ebc-5d3f5c3d214c.png',
			]
		}
})

