import ld from 'layout-dynamic-ui'
const layout= {
	table:{
		forms: {},
		whereLayout:(isAdministrator)=>{
			let arr=[
				{prop:'type',label:'类型',type:'select',options:[{label:'学生卡',value:'0'},{label:'老师卡',value:'1'}],
					change:(val)=>{
						return {
							classId:{
								visabled:val=='0'
							},
							studentId:{
								visabled:val=='0'
							},
						}
					},
					value:'0'
				},
				{prop:'classId',label:'班级',type:'select',filterable:true,
					getOptions:{
						remotePath: '/clzss/getByOrganizationId', //请求方法
						remoteMethodType: "get",//请求类型
						remoteParam:{organizationId:''},//参数
						label:'${names}',//下拉框显示文字；比如有数据[{id:1,nickName:'张三',phone:'18888888888'}] => '张三(18888888888)'
						value:'${id}', //此处的'${id}'<=>'id' 下拉框选项值；比如有数据[{id:1,nickName:'张三',phone:'18888888888'}] => '1'
					},
					//联动事件
					change:(val)=>{
					  return {
					    //当班级改变时，联动调用远程加载数据，加载 studentId的数据
					    changeOptions:{
					      prop:'studentId'
					    },
							studentId:{
								value:''
							}
					  }
					}
				},
				{prop:'studentId',label:'持卡人',type:'select',filterable:true,
					getOptions:{
						remotePath: '/student/getByClassId', //请求方法
						remoteMethodType: "get",//请求类型
						remoteParam:{'${classId}':''},//参数
						label:'${names}',//下拉框显示文字；比如有数据[{id:1,nickName:'张三',phone:'18888888888'}] => '张三(18888888888)'
						value:'${id}', //此处的'${id}'<=>'id' 下拉框选项值；比如有数据[{id:1,nickName:'张三',phone:'18888888888'}] => '1'
					},
				},
				{prop:'cardId',label:'卡片编号',type:'text'},

			];
			if (isAdministrator) {
				arr.push({
					prop: 'organizationId',
					label: '园所',
					type: 'select',
					getOptions: {
						remotePath: '/organization/get', //请求方法
						remoteMethodType: "get", //请求类型
						remoteParam: {}, //参数
						label: '${names}', //下拉框显示文字；比如有数据[{id:1,nickName:'张三',phone:'18888888888'}] => '张三(18888888888)'
						value: '${id}', //此处的'${id}'<=>'id' 下拉框选项值；比如有数据[{id:1,nickName:'张三',phone:'18888888888'}] => '1'
					}
				});
			}
			return arr;
		},
		tableLayout:(isAdministrator)=>{
			let arr=[
				{prop:'cardId',label:'卡片编号',type:'text'},
				{prop:'cardNo',label:'卡内码',type:'text'},
				{prop:'studentName',label:'持卡人'},
				{prop:'parentName',label:'身份',
					html:(val)=>{
						if(!val){
							return `<div class="c-i">未绑定</div>`
						}
						const relatives={'0':'爸爸','1':'妈妈','2':'爷爷','3':'奶奶','4':'姑姑','5':'舅舅','6':'其他'};
						const color={'0':'c-s','1':'c-p','2':'c-w','3':'c-d','4':'c-i','5':'c-i','6':'c8'};
						return `<div class="${color[val]?color[val]:'c-s'}">${relatives[val]?relatives[val]:val}</div>`
					},
				},
				{prop:'classId',label:'班级',
				 replace:{
					 remotePath: '/clzss/getById',
					 remoteMethodType: "get",
					 label:'names',
					 value:'id'
				 },
				},
				{prop:'state',label:'状态',html: (val) => { return `<div class="${val==0?'c-d':'c-s'}">${ val==0? '挂失' :'正常'}</div>`}},
				{prop:'remake',label:'备注'},
			];
			if (isAdministrator) {
				arr.push({
					prop: 'organizationId',
					label: '园所',
					replace: {
						remotePath: '/organization/getById',
						remoteMethodType: "get",
						label: 'names',
						value: 'id'
					},
				})
			}
			return arr;
		} ,
		showPageHelper: true,
		autoLoadDataApi:{
			remotePath: '/card/getPage',
			remoteParam: {organizationId:'',type:'0',studentId:'',classId:'',cardId:''},
			remoteMethodType: "get",
			remoteTimeout: null,
		},
		elPagination:{
			pageSizes: [15, 20, 30, 40, 50, 80]
		},

		tableTools:(item)=>{
			if(item['state']=='1'){
				return [
					{label:'详情',method:'editor',type:'primary'},
					{label:'编辑',method:'editor',type:'warning'},
					{label:'绑定',method:'editor',type:'danger'},
				]
			}
			return [
				{label:'详情',method:'editor',type:'primary'},
				{label:'挂失',method:'editor',type:'warning'},
				{label:'解绑',method:'editor',type:'danger'},
			]
		},

		deleteApi:{
			remotePath: '/card/delete',
			remoteParam: {},
			remoteMethodType: "delete",
			remoteTimeout: null,
		}
	},
	editor:{
		layout:[
			{prop:'cardId',label:'卡片编号',type:'text',require:true},
			{prop:'cardNo',label:'卡内码	',type:'text',require:true},
		  {prop:'type',label:'绑定类型',type:'radio',options:[{label:'学生',value:'0'},{label:'老师',value:'1'}],value:'0',
		  	change:(val)=>{
		  		return {
		  			studentId:{
		  				visabled:val=='0'
		  			},
		  			teacherId:{
		  				visabled:val=='1'
		  			},
						clzssId:{
							visabled:val=='0'
						},
						relatives:{
							visabled:val=='0'
						}
		  		}
		  	}
		  },
			{prop:'classId',label:'学生班级',type:'select',
				getOptions:{
					remotePath: '/clzss/getByOrganizationId', //请求方法
					remoteMethodType: "get",//请求类型
					remoteParam:{organizationId:''},//参数
					label:'${names}(${id})',//下拉框显示文字；比如有数据[{id:1,nickName:'张三',phone:'18888888888'}] => '张三(18888888888)'
					value:'${id}', //此处的'${id}'<=>'id' 下拉框选项值；比如有数据[{id:1,nickName:'张三',phone:'18888888888'}] => '1'
				},
				change:(val)=>{
					return {
						changeOptions:{
							prop:'studentId'
						},
						studentId:{
							value:''
						}
					}
				}
			},
			{prop:'studentId',label:'学生',type:'select',
				getOptions:{
					remotePath: '/student/getByClassId', //请求方法
					remoteMethodType: "get",//请求类型
					remoteParam:{'${classId}':''},//参数
					label:'${names}',//下拉框显示文字；比如有数据[{id:1,nickName:'张三',phone:'18888888888'}] => '张三(18888888888)'
					value:'${id}', //此处的'${id}'<=>'id' 下拉框选项值；比如有数据[{id:1,nickName:'张三',phone:'18888888888'}] => '1'
				},
			},
			{prop:'teacherId',label:'老师',type:'select',require:true,
				getOptions:{
					remotePath: '/teacher/get', //请求方法
					remoteMethodType: "post",//请求类型
					remoteParam:{organizationId:''},//参数
					label:'${names}',//下拉框显示文字；比如有数据[{id:1,nickName:'张三',phone:'18888888888'}] => '张三(18888888888)'
					value:'${id}', //此处的'${id}'<=>'id' 下拉框选项值；比如有数据[{id:1,nickName:'张三',phone:'18888888888'}] => '1'
				},
			},
			{prop:'parentName',label:'身份',type:'select',require:true,
				options:((val)=>{
					const relatives={'0':'爸爸','1':'妈妈','2':'爷爷','3':'奶奶','4':'姑姑','5':'舅舅','6':'其他'};
					let arr=[];
					Object.keys(relatives).map(key=>{
						arr[arr.length]={label:relatives[key],value:key};
					})
					return arr;
				})(),
			},
			{prop:'state',label:"状态",type:'radio',options:[{label:'正常',value:'0'},{label:'挂失',value:'1'}],value:'0'}
		],
		cols:1,
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
	},
}
export default layout;
