import ld from 'layout-dynamic-ui'
let _self;
const layout= {
	table:{
		whereLayout: [
			{prop:'type',type:'select',label:'宣传类型',options:[{label:'自定义图片',value:'0'},{label:'班级学生作品',value:'1'}],value:'0',
				change:(val)=>{
					return {
						classId:{
							visabled:val=='1'	
						},
					}
				}
			},
			{
				prop: 'classId',
				label: '班级',
				type: 'select',
				getOptions: {
					remotePath: '/clzss/getByOrganizationId', //请求方法
					remoteMethodType: "get", //请求类型
					remoteParam: {
						'organizationId': ''
					}, //参数
					label: '${names}', //下拉框显示文字；比如有数据[{id:1,nickName:'张三',phone:'18888888888'}] => '张三(18888888888)'
					value: '${id}', //此处的'${id}'<=>'id' 下拉框选项值；比如有数据[{id:1,nickName:'张三',phone:'18888888888'}] => '1'
				},
			},
		],
		slot:{name:'centent',page:'class-scanner',style:{width:'100%'}},
		forms: {},
		autoLoadDataApi:{
			remotePath: '/scanner/getPage',
			remoteParam: {classId:'',typeId:'2',no:'',organizationId:''},
			remoteMethodType: "get",
			remoteTimeout: null,
		},
		deleteApi:{
			remotePath: '/scanner/delete',
			remoteParam: {},
			remoteMethodType: "delete",
			remoteTimeout: null,
		},
	},
	editor:{
		backButton:{show:true},
		layout:[	
			{prop:'tip1',type:'tip',label:'说明',tip:'<span class="c-d">注：</span>当选择为自定义图片时，所有班牌在空闲时间都会使用该图片！'},
			{prop:'tip2',type:'tip',label:'说明',tip:'<span class="c-d">注：</span>当使用班级学生优秀作品时，会在空闲时间显示班级学生作品！',tipClass:'tip-p b-p1'},
			{prop:'type',type:'radio',label:'宣传类型',options:[{label:'自定义图片',value:'0'},{label:'班级学生作品',value:'1'}],value:'0',require:true,
				change:(val)=>{
					return {
						image:{
							visabled:val=='0'	
						},
						classId:{
							visabled:val=='1'	
						},
						tip1:{
							visabled:val=='0'	
						},
						tip2:{
							visabled:val=='1'	
						}
					}
				}
			},
			{prop:'classId',label:'班级',type:'select',require:true,
				getOptions:{
					remotePath: '/clzss/getByOrganizationId', //请求方法
					remoteMethodType: "get",//请求类型
					remoteParam:{'organizationId': ''},//参数
					label:'${names}',//下拉框显示文字；比如有数据[{id:1,nickName:'张三',phone:'18888888888'}] => '张三(18888888888)'
					value:'${id}', //此处的'${id}'<=>'id' 下拉框选项值；比如有数据[{id:1,nickName:'张三',phone:'18888888888'}] => '1'
				},
			},
			{prop:'image',type:'image',limit:20,label:'宣传图片'},
			
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
			remotePath: '/scanner/save',
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
			remotePath: '/scanner/getByImagesIdWidthNo',
			//请求参数
			remoteParam: {},
			//请求方法
			remoteMethodType: "get",
			//得到数据后对数据的预处理
			// getDataAfter: (data) => {
			// 	return data.data;
			// }
		},
		autoSaveBefore: (form) => {
			let no = `${new Date().getFullYear()}${('0'+(new Date().getMonth()+1)).substr(-2)}${new Date().getDate()}${form['type']=='1'?'_'+new Date().getTime():''}`;
			form['no'] = form['no'] || no;
			form['classId'] = form['classId']||'';
			form['typeId'] = '2';
			if(form['type']=='1'){
				form['no'] = form['no'] || no;
				return form;
			}
			if (!Array.isArray(form['image'])) {
				return form;
			}
			return new Promise((s, r, c) => {
				let _uploadImage = form['image'].filter(item => typeof item != 'string' && !Array.isArray(item) && Object.keys(
					item).includes('raw'));
				let _noUploadImaged = form['image'].filter(item => !(typeof item != 'string' && !Array.isArray(item) && Object.keys(
					item).includes('raw')));
				let count = _uploadImage.length;
				let waitTime = 3000 * count;
				let _uploadImagePath = [];
				let _count=0;
				const seInt = setInterval(() => {
					_count++;
					if (_uploadImagePath.length >= _uploadImage.length) {
						let _noUploadImaged2= _noUploadImaged.map(item=>{
							return item['url'].replace(_self.$ld.requestSetting.serverPath.get(),'')||item;
						});
						let imagePath = _uploadImagePath.concat(_noUploadImaged2);
						form['image'] = imagePath.join(',');
						clearInterval(seInt);
						s(form);
						return;
					}
					if(_count>20){
						_self.$message.error('上传失败，请稍后再试！');
						clearInterval(seInt);
						return;
					}
				}, 1000);
				for (let i = 0; i < _uploadImage.length; i++) {
					let item = _uploadImage[i];
					_self.$util.uploadImage(_self, 8, item['raw'], (res) => {
						if (res.code == 0) {
							_uploadImagePath[_uploadImagePath.length] = res.data['filePath'];
						}
					})
				}
			});
		},
		//将页面this对象设置到当前js可使用
		setSelf(self) {
			_self = self;
		},
		// buttonStyle:'position: fixed;bottom: 60px;width:1000px'
	},
}
export default layout;