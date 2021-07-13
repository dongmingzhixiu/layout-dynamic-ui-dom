import ld from 'layout-dynamic-ui'
const layout= {
	table:{
		forms: {},
		whereLayout: [
			{prop:'names',label:'姓名',type:'text',width:'180px'},
			{prop:'idcard',label:'身份证号',type:'text'},
			{prop:'sex',label:'性别',width:'140px',type:'select',options:[{label:'男',value:'1'},{label:'女',value:'0'}]},
			{prop:'audio',label:'审核状态',type:'select',options:[{label:'未审核',value:'0'},{label:'审核通过',value:'1'},{label:'审核不通过',value:'2'}],value:'0'},
			{prop:'age',label:'招收年龄',type:'select',
				options:[{label:'符合招收年龄',value:'0'},{label:'3岁以下',value:'1'},{label:'4岁以上',value:'2'}],
			},
		],
		//查询条件按钮
		whereButton: [{
				label: '搜索',
				icon: 'el-icon-search',
				method: 'search',
				type: 'primary'
			},
		],
		tableLayout: [
			{prop:'names',label:'幼儿姓名'},
			{prop:'sex',label:'性别',width:'40px',html: (val) => { return `<div class="${val==1?'c-d':'c-s'}">${val==1?'男':'女'}</div>`}},
			{prop:'birthday',label:'出生日期'},
			{prop:'birthday',label:'年龄',
				format: (val) =>{
					if(!val){
						return '未填写出生日期';
					}
					let month=ld.util.getMonthDiff(new Date(),val);
					let _y=parseInt(month/12);
					let _m=month%12;
					return `${_y}岁${_m}${_m==0?'':'月'}`
				}
			},
			{prop:'idcard',label:'幼儿身份证号'},
			{prop:'fphone',label:'父亲联系方式'},
			{prop:'mphone',label:'母亲联系方式'},
			{prop:'createdTime',label:'创建时间'},
			{prop:'audio',label:'审核状态',html:(val)=>{
				val=!val&&val!=0?0:val;
				let _audio=['未审核','审核通过','审核不通过'];
				let _color=['c-i','c-s','c-d'];
				return `<div class="${_color[val]}">${_audio[val]}</div>`
			}},
			{prop:'remake',label:'审核意见'},
		],
		showPageHelper: true,
		autoLoadDataApi:{
			remotePath: '/inSchool/getPage',
			remoteParam: {organizationId:'',names:'',idcard:'',sex:'',age:'',audio:'0'},
			remoteMethodType: "get",
			remoteTimeout: null,
		},
		elPagination:{
			pageSizes: [15, 20, 30, 40, 50, 80]
		},

		tableTools:(item)=>{
			let audio=item['audio']=item['audio']||0;
			let arr=[{label:'详情',method:'editor'}];
			let no={
				label:'不通过',type:'danger',
				method:{
					name:'audio',
					transfer:false, //当前组件使用，还是通过动态组件传入下一个函数
					fn:(e,that)=>{
						that.$prompt('确定设置为不通过吗？请输入原因', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							inputPattern: /.*/,
							inputValue:'资料审核不通过或年龄不达标',
							inputErrorMessage: '请设置不通过的原因',
							type:'error'
						}).then(({ value }) => {
							that.$ld.request('/inSchool/audio','post',{audio:2,id:e['id'],remake:value}).then(res=>{
								if(res.code==0){
									that.$message.success(res.msg||"设置成功！");
									that.refreshTabs();
									return;
								}
								that.$message.error(res.msg||"设置失败，稍后再试！");
								that.refreshTabs();
							})
						}).catch(() => {
						});
					}
				},
			};
			let yes={
				label:'通过',type:'success',
				method:{
					name:'audio',
					transfer:false,//当前组件使用，还是通过动态组件传入下一个函数
					fn:(e,that)=>{
						that.$prompt('确定设置为通过吗？请添加备注', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							inputPattern: /.*/,
							inputValue:'资料齐全且符合规范',
							inputErrorMessage: '请设置通过的备注',
							type:'success'
						}).then(({ value }) => {
							that.$ld.request('/inSchool/audio','post',{audio:'1',id:e['id'],remake:value}).then(res=>{
								if(res.code==0){
									that.$message.success(res.msg||"设置成功！");
									that.refreshTabs();
									return;
								}
								that.$message.error(res.msg||"设置失败，稍后再试！");
								that.refreshTabs();
							})
						}).catch(() => {

						});
					}
				}
			};
			if(audio=='2'){
				arr.unshift(yes);
			}else if(audio=='1'){
				arr.unshift(no);
			}else {
				arr.unshift(no);
				arr.unshift(yes);
			}
			return arr;
		},

		deleteApi:{
			remotePath: '/inSchool/byId',
			remoteParam: {},
			remoteMethodType: "post",
			remoteTimeout: null,
		},
		// editorOneFormTab:true,
	},
	editor:{
		backButton:{show:false,showType:false},
		layout:[
			{prop:'page',type:'slot',slotName:'in-school-editor','class':'in-school-editor-form','style':{'width':'100%','height':'calc(100vh - 210px)'}},
		],
		slotPageLayoutForm:[
			{prop:'audio',label:'审核状态',type:'radio',isButton:true,
				options:[
					{label:'审核通过',value:'1'},
					{label:'审核不通过',value:'2'},
					{label:'未审核',value:'0',disabled:true},
				],
				require:true,
				change:(val)=>{
					return {
						remake1:{
							visabled:val=='2',
						},
						remake:{
							value:val=='1'?'审核通过，资料齐全且符合规范！':'',
							rows:val=='1'?20:10,
						}
					}
				},
				value:'1',
			},
			{prop:'remake1',label:'可选备注',type:'checkbox',require:true, parseType:'split',splitChart:',',
				options:[
					{label:'幼儿1寸照片上传不合法',value:'幼儿1寸照片上传不合法'},
					{label:'幼儿医学证明上传不合法',value:'幼儿医学证明上传不合法'},
					{label:'户口本户主页上传不合法',value:'户口本户主页上传不合法'},
					{label:'户口本幼儿页上传不合法',value:'户口本幼儿页上传不合法'},
					{label:'户口本父亲页上传不合法',value:'户口本父亲页上传不合法'},
					{label:'户口本母亲页上传不合法',value:'户口本母亲页上传不合法'},
					{label:'房产证不合法,请重新上传',value:'房产证不合法'},
					{label:'传购房合同首页上传不合法',value:'传购房合同首页上传不合法'},
					{label:'购房合同内容页上传不合法',value:'购房合同内容页上传不合法'},
					{label:'征收补偿协议上传不合法',value:'征收补偿协议上传不合法'},
					{label:'安置房便函上传不合法',value:'安置房便函上传不合法'},
					{label:'安置房购房合同上传不合法',value:'安置房购房合同上传不合法'},
					{label:'幼儿体检报告上传不合法',value:'幼儿体检报告上传不合法'},
					{label:'父亲信息不全',value:'父亲信息不全'},
					{label:'母亲信息不全',value:'母亲信息不全'},
					{label:'父亲信息与户口本信息一致',value:'父亲信息与户口本信息一致'},
					{label:'母亲信息与户口本信息一致',value:'母亲信息与户口本信息一致'},
					{label:'儿童预防接种情况审核报告不合法',value:'儿童预防接种情况审核报告不合法'},
				],
				change:(val)=>{
					let _val="";
					try{
						_val=val.join('\r\n');
					}catch(e){}
					return {
						remake:{
							value:_val
						}
					}
				},
				value:'',
			},
			{prop:'remake',label:'其他备注',type:'textarea',rows:10,value:''},
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
			remotePath: '/inSchool/save',
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
			remotePath: '/inSchool/getById',
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
