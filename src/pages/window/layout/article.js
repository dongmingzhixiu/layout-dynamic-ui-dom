import ld from 'layout-dynamic-ui'
window.getDateTime= ld.util.getDateTime;
const layout= {
	table:{
		slot:{name:'left',page:'article-tree',style:{width:'300px'}},
		forms: {},
		whereLayout: [
			{prop:'title',label:'文章名称',type:'text'},
		],
		//查询条件按钮
		whereButton: [
			{label: '搜索',icon: 'el-icon-search',method: 'search',type: 'primary'},
			{label: '新增',icon: 'el-icon-plus',method: 'add',type: 'danger'},
			// {label: '添加文章类目',icon: '',method: 'addTree',type: 'warning'},
		],
		tableLayout: [
			{prop:'title',label:'文章名称',width:'500px'},
			{prop:'createdTime',label:'创建日期',width:'180px',format:(val)=>{ return ld.util.getDateTime(0,new Date(val))}},
			{prop:'typeName',label:'文章类型',width:'100px'},
			{prop:'state',label:'状态',width:'80px',html:(val)=>{	return val=='2'? `<div class="c-s">置顶</div>`:''	}},
			{prop:'remake',label:'备注'},
		],
		showPageHelper: true,
		autoLoadDataApi:{
			remotePath: '/article/getPage',
			remoteParam: {organizationId:'',classId:'',classId:'',typeId:'',title:''},
			remoteMethodType: "get",
			remoteTimeout: null,
		},
		elPagination:{
			pageSizes: [15, 20, 30, 40, 50, 80]
		},

		tableTools:(item)=>{
			if(item['state']=='2'){
				return [
					{label:'取消置顶',type:'danger',
						method:{
							name:'noToTop',
							transfer:false, //当前组件使用，还是通过动态组件传入下一个函数
							fn:(e,that)=>{
								let data={id:e['id'],state:'1'};
								that.$ld.request('/article/save','post',data).then(res=>{
									if(res.code==0){
										that.$message.success(res.msg||"取消成功！");
										that.refreshTabs();
										return;
									}
									that.$message.error(res.msg||"取消失败，稍后再试！");
									that.refreshTabs();
								})
							}
						},
					},
					{label:'编辑',method:'editor',type:'warning'},
					{label:'删除',method:'delete',type:'primary'},
				]
			}
			return [
				{label:'置顶',type:'danger',
					method:{
						name:'toTop',
						transfer:false, //当前组件使用，还是通过动态组件传入下一个函数
						fn:(e,that)=>{
							let data={id:e['id'],state:'2'};
							that.$ld.request('/article/save','post',data).then(res=>{
								if(res.code==0){
									that.$message.success(res.msg||"置顶成功！");
									that.refreshTabs();
									return;
								}
								that.$message.error(res.msg||"置顶失败，稍后再试！");
								that.refreshTabs();
							})
						}
					},
				},
				{label:'编辑',method:'editor',type:'warning'},
				{label:'删除',method:'delete',type:'primary'},
			]
		},

		deleteApi:{
			remotePath: '/article/delete',
			remoteParam: {},
			remoteMethodType: "delete",
			remoteTimeout: null,
		},

	},
	editor:{
		backButton:{show:false},
		layout:[
			{prop:'page',type:'slot',slotName:'article-editor','style':{'width':'100%','height':'100%'}},
		],
		cols:1,
		/**
		 * 编辑页面列数的宽度
		 */
		oneColsWidth: {
			1: '100%',
			2: 800,
			3: 900,
		},
		autoSaveApi:{
			//请求路径
			remotePath: '/article/save',
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
			remotePath: '/article/getById',
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
