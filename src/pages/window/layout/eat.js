import ld from 'layout-dynamic-ui'
const layout= {
	table:{
		forms: {},
		whereLayout: [
			{prop:'times',label:'时间',type:'date',dateType:"week"},
			{prop:'weekName',label:'周名称',type:'select',
				options:(()=>{
					let week=['一','二','三','四','五','六','天'];
					let arr=[];
					for(let i=0;i<week.length;i++){
						arr.push({label:`周${week[i]}`,value:`星期${week[i]}`});
					}
					return arr;
				})(),
			},
		],
		//查询条件按钮
		whereButton: [
			{label: '搜索',icon: 'el-icon-search',method: 'search',type: 'primary'},
			{label: '新增食谱',icon: 'el-icon-plus',method: 'add',type: 'danger'},
		],
		searchBefore:(form,that)=>{
			return {
				week:form['times']?that.$ld.util.getYearWeek(form['times']):"",
				weekName:form['weekName']
			};
		},
		tableLayout: [
			{prop:'week',label:'标题'},
			{prop:'weekName',label:'时间'},
			{
				label:'配餐信息',
				children:[
					{prop:'zaoc',label:'早餐',width:280,format:(val)=>{return val?val.replace(/\r\n|\n/g,"，"):'-'}},
					{prop:'wuc',label:'午餐',width:280,format:(val)=>{return val?val.replace(/\r\n|\n/g,"，"):'-'}},
					{prop:'wud',label:'午点',width:280,format:(val)=>{return val?val.replace(/\r\n|\n/g,"，"):'-'}},
				],
				width:'600'
			},
			{prop:'remake',label:'备注'},
		],
		showPageHelper: true,
		autoLoadDataApi:{
			remotePath: '/eat/getPage',
			remoteParam: {organizationId:'',week:'',weekName:''},
			remoteMethodType: "get",
			remoteTimeout: null,
		},
		elPagination:{
			pageSizes: [15, 20, 30, 40, 50, 80]
		},

		tableTools:[{label:'编辑',method:'editor',type:'danger'}]	,

		deleteApi:{
			remotePath: '/eat/delete',
			remoteParam: {},
			remoteMethodType: "delete",
			remoteTimeout: null,
		},

	},
	editor:{
		// slot:{name:'editor',page:'eat-list',style:{width:'100%',height:'100%'}},
		layout:[
			{prop:'page',type:'slot',slotName:'eat-list','class':'w h'},
		],
		cols:1,
		/**
		 * 编辑页面列数的宽度
		 */
		oneColsWidth: {
			1: 1000,
			2: 800,
			3: 900,
		},
		autoSaveApi:{
			//请求路径
			remotePath: '/eat/save',
			//请求参数
			remoteParam: {},
			//请求方法
			remoteMethodType: "post",
			//得到数据后对数据的预处理
			// getDataAfter: (data) => {
			// 	return data.data;
			// }
		},
		editorFormsInitApis:{
			//请求路径
			remotePath: '/eat/getByIdWidthWeek',
			//请求参数
			remoteParam: {},
			//请求方法
			remoteMethodType: "get",
			//得到数据后对数据的预处理
			// getDataAfter: (data) => {
			// 	return data.data;
			// }
		},
		button:[]
	},
}
export default layout;
