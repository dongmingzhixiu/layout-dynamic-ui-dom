import ld from 'layout-dynamic-ui';
import tools from '@/mock/tools.js';
//引入mockjs
const Mock = require('mockjs')
// 获取 mock.Random 对象
const Random = Mock.Random;
//使用mockjs模拟数据
Mock.mock(new RegExp('/inSchool/get[?].*'), 'get', (req, res) => { //当post或get请求到/api/data路由时Mock会拦截请求并返回上面的数据.
	let request = ld.util.urlToObj(req['url']);
	let list = [];
	let pageSize = parseInt(request['pageSize']) || 10;
	
	let year=['2014','2015','2016','2017','2018','2019','2020','2021'];
	
	for (let i = 0; i < pageSize; i++) {
		
		let month=Random.integer(1,12);
		let day=Random.integer(1,28);
		
		let listObject = {
			names: Random.cname(), //随机生成一段中文文本。
			id: 1000+i+'', //返回一个随机的整数。
			birthday: `${year[ Random.integer(0,year.length-1)]}-${month<10?'0'+month:month}-${day<10?'0'+day:day}`,
			createdTime: Random.date(),
			sex: Random.integer(0,1),
			idcard:`620226${year[ Random.integer(0,year.length-1)]}-${month<10?'0'+month:month}-${day<10?'0'+day:day}`,
			fphone:Random.integer(11111111111,19999999999),
			mphone:Random.integer(11111111111,19999999999),
			audio: Random.integer(0,2),
			remake:Random.cparagraph(1, 3),
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
Mock.mock('/inSchool/save', 'post', (req, res) => { //当post或get请求到/api/data路由时Mock会拦截请求并返回上面的数据.
	let request = JSON.parse(req.body);
	// let request = ld.util.urlToObj(req['url']);
	return {
		code: 0,
		msg: '保存成功！'
	}
})
//使用mockjs模拟数据
Mock.mock(new RegExp('/inSchool/getById.*'), 'get', (req, res) => { //当post或get请求到/api/data路由时Mock会拦截请求并返回上面的数据.
	let id = 1001
	try {
		id = ld.util.urlToObj(req['url'])['id'] || 1001;
	} catch (e) {
		//TODO handle the exception
	}
	let year=['2014','2015','2016','2017','2018','2019','2020','2021'];
	let month=Random.integer(1,12);
	let day=Random.integer(1,28);
	return {
		code: 0,
		data: {
			id: id, //返回一个随机的整数。
			//头像
			photo:'http://ki.orange-info.cn:81/fileUpload/0/6/226ceed0-3bd4-432f-a53d-88f6a0b07fef.png',
			//名称
			names: Random.cname(), 
			//出生日期
			birthday: Random.date(),
			//性别
			sex: Random.integer(0,1),
			//出生日期 
			idcard:`620226${year[ Random.integer(0,year.length-1)]}${month<10?'0'+month:month}${day<10?'0'+day:day}${Random.integer(1111,9999)}`,
			//是否体检
			toilet:Random.integer(0,1),
			//是否托班
			toban:Random.integer(0,1), 
			//学校
			school:['静宁一幼——西城区幼儿园（分园）','静宁一幼——西城区幼儿园（总园）'][Random.integer(0,1)],
			//户口性质
			census:['农村户口','城镇户口'][Random.integer(0,1)],
			//家庭住址
			address:Random.county(true),
			//父亲名称
			fname: Random.cname(), 
			//父亲身份证号
			fidcard:`620226${Random.integer(1970,2021)}${month<10?'0'+month:month}${day<10?'0'+day:day}${Random.integer(1111,9999)}`,
			//父亲手机号码
			fphone:Random.integer(11111111111,19999999999),
			//父亲工作单位
			funit:['无业',Random.cparagraph(1, 3)][Random.integer(0,1)],
			// 母亲姓名
			mname: Random.cname(),
			//母亲身份证号
			midcard:`620226${Random.integer(1970,2021)}${month<10?'0'+month:month}${day<10?'0'+day:day}${Random.integer(1111,9999)}`,
			//母亲电话
			mphone:Random.integer(11111111111,19999999999),
			//母亲工作单位
			munit:['无业',Random.cparagraph(1, 3)][Random.integer(0,1)],
			//体检图片
			medical:'http://ki.orange-info.cn:81/fileUpload/8/6/dfac5291-1fe6-446f-b1c1-6d7df1f3d7ab.png',
			//户主页
			h1:'http://ki.orange-info.cn:81/fileUpload/1/3/34c4f438-733b-4235-b6c7-8f0258bed1bc.png',
			h2:'http://ki.orange-info.cn:81/fileUpload/14/11/11def804-0ff3-4b43-9066-5768be9bb7e9.png',
			h3:'http://ki.orange-info.cn:81/fileUpload/2/3/187b9cf2-a03a-4a3e-8986-dbeb0c702e1c.png',
			h4:'http://ki.orange-info.cn:81/fileUpload/7/13/3d4551be-ba64-430b-a08b-5bccce017535.png',
			//儿童预防接种该报告
			yf:'http://ki.orange-info.cn:81/fileUpload/12/5/af3ffefb-5f4f-4481-af9d-79a61d8d49e2.png',
			tj:'http://ki.orange-info.cn:81/fileUpload/12/14/6000b7d1-e40a-4ea1-8222-83590f30c38d.png',
			//房产证 /0:房产证 1:购房合同 2:棚户安置证明
			ftype:Random.integer(0,2), 
			//房产证编码或购房合同编码
			fcode:Random.integer(1111111,999999), 
			img1:'http://ki.orange-info.cn:81/kin/static/img/chanquzheng.jpg',//房产证
			img2:'http://ki.orange-info.cn:81/kin/static/img/chanquzheng.jpg',//购房合同首页
			img3:'http://ki.orange-info.cn:81/kin/static/img/fwz2.png',//购房合同内容页面
			img4:'http://ki.orange-info.cn:81/kin/static/img/fwz2.png',//征收补偿协议 
			img5:'http://ki.orange-info.cn:81/kin/static/img/fwz2.png',//上传安置房便函 
			img6:'http://ki.orange-info.cn:81/kin/static/img/fwz2.png',//上传安置房购房合同 
			
			audio: Random.integer(0,2),
			remake:Random.cparagraph(1, 3),
		},
		msg: '保存成功！'
	}
})


//使用mockjs模拟数据
Mock.mock('/inSchool/audio', 'post', (req, res) => { //当post或get请求到/api/data路由时Mock会拦截请求并返回上面的数据.
	let request = JSON.parse(req.body);
	// let request = ld.util.urlToObj(req['url']);
	return {
		code: 0,
		msg: `${request['audio']=='1'?'设置审核通过':'设置审核不通过'}成功！`
	}
})