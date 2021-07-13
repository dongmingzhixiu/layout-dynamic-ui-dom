import ld from 'layout-dynamic-ui'
const layout= {
	table:{
		slot:{name:'centent',page:'chart'},
		forms: {},
		// whereLayout: [
		// 	{prop:'names',label:'文章名称',type:'text'},
		// ],	
		// //查询条件按钮
		// whereButton: [
		// 	{label: '搜索',icon: 'el-icon-search',method: 'search',type: 'primary'},
		// 	{label: '新增',icon: 'el-icon-plus',method: 'add',type: 'danger'},	
		// 	{label: '添加文章类目',icon: '',method: 'addTree',type: 'warning'},
		// ],
		// tableLayout: [
		// 	{prop:'names',label:'文章名称',width:'500px'},
		// 	{prop:'createdTime',label:'创建日期',format:(val)=>{return ld.util.getDate(val)}},
		// 	{prop:'state',label:'文章类型',html:(val)=>{	return val=='1'? `<div class="c-s">置顶</div>`:''	}},
		// 	{prop:'remake',label:'备注'},
		// ],
		// showPageHelper: true,
		// elPagination:{
		// 	pageSizes: [15, 20, 30, 40, 50, 80]
		// },
		
		// tableTools:(item)=>{
		// 	if(item['state']=='1'){
		// 		return [
		// 			{label:'取消置顶',method:'editor',type:'danger'},
		// 			{label:'编辑',method:'editor',type:'warning'},
		// 			{label:'删除',method:'delete',type:'primary'},
		// 		]	
		// 	}
		// 	return [
		// 		{label:'置顶',method:'editor',type:'danger'},
		// 		{label:'编辑',method:'editor',type:'warning'},
		// 		{label:'删除',method:'delete',type:'primary'},
		// 	]	
		// },
		
		autoLoadDataApi:{
			remotePath: '/article/getPage',
			remoteParam: {},
			remoteMethodType: "get",
			remoteTimeout: null,
		},
		
		deleteApi:{
			remotePath: '/delete/byId',
			remoteParam: {},
			remoteMethodType: "post",
			remoteTimeout: null,
		},

	},
	editor:{
		backButton:{show:false},
		layout:[			
			{prop:'page',type:'slot',slotName:'article-editor','style':{'width':'100%','height':'calc(100vh - 400px)'}},
		],
		cols:1,
		/**
		 * 编辑页面列数的宽度
		 */
		oneColsWidth: {
			1: 800,
			2: 800,
			3: 900,
		},
		autoSaveApi:{
			//请求路径
			remotePath: '/card/save',
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
			remotePath: '/card/getById',
			//请求参数
			remoteParam: {},
			//请求方法
			remoteMethodType: "get",
			//得到数据后对数据的预处理
			// getDataAfter: (data) => {
			// 	return data.data;
			// }
		},
		button:[],
	},
}
export default layout;