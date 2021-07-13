let _self;
const layout = {
	/**
	 * 展示模板所用参数
	 */
	table: {
		//展示布局查询条件表单，可以设置查询条件默认值
		forms: {},
		//查询条件布局
		whereLayout: [],
		//显示表格布局
		tableLayout: [],
		//是否显示分页
		showPageHelper: true,
		//自动加载表格数据的 api接口
		autoLoadDataApi: {
			remotePath: '/test/getUserInfo',
			remoteParam: {},
			remoteMethodType: "get",
			remoteTimeout: null,
		},
		//设置可选择的分页条数
		elPagination: {
			pageSizes: [15, 20, 30, 40, 50, 80]
		},
		//查询条件按钮
		whereButton: [{
				label: '搜索',
				icon: 'el-icon-search',
				method: 'search',
				type: 'primary'
			},
			{
				label: '新增',
				icon: 'el-icon-plus',
				method: 'add',
				type: 'danger'
			},
		],
		//删除的api接口
		deleteApi: {
			remotePath: '/delete/byId',
			remoteParam: {
				d: false
			},
			remoteMethodType: "post",
			remoteTimeout: null,
		},
		//编辑界面只显示一个tab
		editorOneFormTab:false,
		//调用搜索之前会执行的方法
		searchBefore:(form,that)=>{
			return form;
		},
	},
	/**
	 * 编辑模板所用参数
	 */
	editor: {
		/**
		 * 返回菜单按钮
		 */
		backButton:{show:true,showType:true},
		
		/**
		 * 编辑布局
		 */
		layout: [],
		/**
		 * 编辑按钮
		 */
		button: [{
				label: '保存',
				icon: 'el-icon-s-order',
				method: 'save',
				type: 'danger'
			},
			{
				label: '重置',
				icon: 'el-icon-s-release',
				method: 'reset',
				type: 'warning'
			},
			{
				label: '关闭',
				method: 'cancel'
			},
		],
		buttonStyle:"",
    editorStyle:"",
		/**
		 * 编辑布局列数
		 */
		cols: 1,
		/**
		 * 编辑页面列数的宽度
		 */
		oneColsWidth: {
			1: 600,
			2: 800,
			3: 900,
			4: 1200
		},
		/**
		 * 是否保存后关闭该页面
		 */
		saveClose: true,
		/**
		 * 自动保存api
		 */
		autoSaveApi: {
			//请求路径
			remotePath: 'test/getUserById',
			//请求参数
			remoteParam: {
				//id: 3 //形如id
			},
			//请求方法
			remoteMethodType: "post",
			//得到数据后对数据的预处理
			// getDataAfter: (data) => {
			// 	return data.data;
			// }
		},
		//在修改数据时，默认拉去修改数据的api接口
		editorFormsInitApis: {
			//请求路径
			remotePath: '/teacher/getById',
			//请求参数
			remoteParam: {},
			//请求方法
			remoteMethodType: "get",
			//得到数据后对数据的预处理
			// getDataAfter: (data) => {
			// 	return data.data;
			// }
		},
		/**
		 * 保存之前数据整理的修饰方法
		 */
		autoSaveBefore:(e)=>{
			return e;
		},
		//将页面this对象设置到当前js可使用
		setSelf(self){
			_self=self;
		},
		
	},
}
export default layout;
