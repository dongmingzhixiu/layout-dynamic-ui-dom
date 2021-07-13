import ld from 'layout-dynamic-ui'
window.ld=ld;
const layout= {
	table:{
		forms: {},
		whereLayout:(isAdministrator)=>{
			let arr=[
				{prop:'types',label:'设备类型',type:'select',options:[{label:'班牌',value:'0'},{label:'打卡机',value:'1'},{label:'其他',value:'2'}]},
				{prop:'classId',label:'绑定班级',type:'select',filterable:true,
					getOptions:{
						remotePath: '/clzss/get', //请求方法
						remoteMethodType: "get",//请求类型
						remoteParam:{},//参数
						label:'${names}',//下拉框显示文字；比如有数据[{id:1,nickName:'张三',phone:'18888888888'}] => '张三(18888888888)'
						value:'${id}', //此处的'${id}'<=>'id' 下拉框选项值；比如有数据[{id:1,nickName:'张三',phone:'18888888888'}] => '1'
					},
				},
			]
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
				{prop:'schooldId',label:'设备位置',format:(val)=>{return !val?'未绑定': val=='0'?'总园':'分园'}},
				{prop:'code',label:'设备编码'},
				{prop:'types',label:'设备类型',html:(val)=>{return `<div class="${val=='0'?'c-s':val==1?'c-p':'c-d'}">${val=='0'?'班牌':val=='1'?'打卡机':'其他'}</div>`}},
				{prop:'classId',label:'绑定班级',
					replace:{
						 remotePath: '/clzss/getById',
						 remoteMethodType: "get",
						 label:'names',
						 value:'id'
					}
				},
				{prop:'remake',label:'备注'},
			]
			if (isAdministrator) {
				arr.push({prop: 'organizationId',label: '园所',replace: {remotePath: '/organization/getById',remoteMethodType: "get",label: 'names',value: 'id'}})
			}
			return arr;
		},
		showPageHelper: true,
		autoLoadDataApi:{
			remotePath: '/drive/getPage',
			remoteParam: {organizationId:'',types:'',classId:''},
			remoteMethodType: "get",
			remoteTimeout: null,
		},
		elPagination:{
			pageSizes: [15, 20, 30, 40, 50, 80]
		},

		tableTools:(item)=>{
      let reload={
        name:'reload',
        transfer:false, //当前组件使用，还是通过动态组件传入下一个函数
        fn:(e,that)=>{
          that.$ld.request('/wsDrive/reload','get',{'uid':e['code']}).then(res=>{
            if(res.code==0){
              that.$message.success("设备已刷新");
              return;
            }
             that.$message.error("设备已刷新"||"刷新失败，稍后再试！");
          })
        }
      }

			if(!item['classId']){
				return [
						{label:'绑定',method:'editor',type:'success'},
						{label:'编辑',method:'editor',type:'primary'},
						{label:'删除',method:'delete',type:'danger'},
					]
			}
			return [
				{
					label:'解绑',type:'danger',
					method:{
						name:'relieve',
						transfer:false, //当前组件使用，还是通过动态组件传入下一个函数
						fn:(e,that)=>{
							that.$confirm('确定接触绑定吗,接触后，需要重新绑定！', '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type:'warning'
							}).then(()=> {
								that.$ld.request('/drive/relieve','post',{id:e['id']}).then(res=>{
									if(res.code==0){
										that.$message.success(res.msg||"解绑成功！");
										that.refreshTabs();
										return;
									}
									that.$message.error(res.msg||"解绑失败，稍后再试！");
									that.refreshTabs();
								})
							}).catch(() => {
							});
						}
					}
				},
				{label:'编辑',method:'editor',type:'primary'},
				{label:'删除',method:'delete',type:'danger'},
        {label:'刷新设备',method:reload,type:'info'},
			]
		},

		deleteApi: {
			remotePath: '/drive/delete',
			remoteParam: {},
			remoteMethodType: "delete",
			remoteTimeout: null,
		}
	},
	editor:{
		forms:{names:'0'},
		layout:(isAdministrator)=>{
			let arr=[
				{prop:'code',label:'设备编码',type:'text',require:true,readonly:true,value:((val)=>{ return window.ld.util.uuid();	})(),},
				{prop:'types',label:'设备类型',type:'radio',require:true,options:[{label:'班牌',value:'0'},{label:'打卡机',value:'1'},{label:'其他',value:'2'}],
				value:'0',
					change:(val,e)=>{
						const type={0:'班牌',1:'打卡机',2:'设备'};
						let _text=(e['form']['names']||'').replace(/班牌$|打卡机$|设备$/g,type[e['form']['types']]);
						return {
							classId:{
								visabled:val=='0',
								value:val!='0'?'':e['form']['classId'],
							},
							names:{
								value:val!='0'?(type[e['form']['types']]||''):_text
							}
						}
					}
				},
				{prop: 'classId',label: '绑定班级',type: 'select',require: true,
					getOptions: {
						remotePath: '/clzss/getByOrganizationId', //请求方法
						remoteMethodType: "get", //请求类型
						remoteParam: {organizationId:''}, //参数
						label: '${names}(${id})', //下拉框显示文字；比如有数据[{id:1,nickName:'张三',phone:'18888888888'}] => '张三(18888888888)'
						value: '${id}', //此处的'${id}'<=>'id' 下拉框选项值；比如有数据[{id:1,nickName:'张三',phone:'18888888888'}] => '1'
					},
					change:(val,e,e3)=>{
						let selectOption=Array.isArray(e['selectOption'])? (e['selectOption'][0]||{}):e['selectOption'];
						let label=selectOption['label']||'';
						const type={0:'班牌',1:'打卡机',2:'设备'};
						let _text=`${label}${type[e['form']['types']]}`;
						return {
							names:{
								value:_text
							}
						}
					}
				},
				{prop:'names',label:'设备名称',type:'text'},
				{prop:'remake',label:'备注',type:'textarea',rows:9},
			];
			if (isAdministrator) {
				arr.unshift({prop: 'organizationId',label: '园所',	require:true,	type: 'select',
					getOptions: {remotePath: '/organization/get', remoteMethodType: "get", remoteParam: {},
						label: '${names}', //下拉框显示文字；比如有数据[{id:1,nickName:'张三',phone:'18888888888'}] => '张三(18888888888)'
						value: '${id}', //此处的'${id}'<=>'id' 下拉框选项值；比如有数据[{id:1,nickName:'张三',phone:'18888888888'}] => '1'
					}
				});
			}
			return arr;
		},
		cols:1,
		autoSaveApi:{
			//请求路径
			remotePath: '/drive/save',
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
			remotePath: '/drive/getById',
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
