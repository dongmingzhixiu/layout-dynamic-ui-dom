import ld from 'layout-dynamic-ui'
let _self;
const layout = {
	table: {
		slot: {
			name: 'centent',
			page: 'card-scanner',
			style: {
				width: '100%'
			}
		},
		forms: {},
		autoLoadDataApi: {
			remotePath: '/scanner/getPage',
			remoteParam: {
				classId: '',
				typeId: '1',
				no: '',
				organizationId: ''
			},
			remoteMethodType: "get",
			remoteTimeout: null,
		},
		// deleteApi:{
		// 	remotePath: '/scanner/delete',
		// 	remoteParam: {},
		// 	remoteMethodType: "delete",
		// 	remoteTimeout: null,
		// },
	},
	editor: {
		backButton: {
			show: true
		},
		layout: [{
				prop: 'tip',
				type: 'tip',
				tip: '选择轮播图图片'
			},
			{
				prop: 'image',
				type: 'image',
				limit: 20
			},
			{
				prop: 'data',
				type: 'slot'
			},
		],
		cols: 1,
		/**
		 * 编辑页面列数的宽度
		 */
		oneColsWidth: {
			1: 1000,
			2: 800,
			3: 900,
		},
		autoSaveApi: {
			//请求路径
			remotePath: '/scanner/save',
			//请求参数
			remoteParam: {},
			//请求方法
			remoteMethodType: "post",
			remoteTimeout:10000,
			//得到数据后对数据的预处理
			// getDataAfter: (data) => {
			// 	return data.data;
			// }
		},
		editorFormsInitApis: {
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
			let no = `${new Date().getFullYear()}${('0'+(new Date().getMonth()+1)).substr(-2)}${new Date().getDate()}`;
			form['no'] = form['no'] || no;
			form['classId'] = '';
			form['typeId'] = '1';
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
		
		buttonStyle:'position: fixed;bottom: 0px;padding-bottom:10px;width:1000px;background:white;z-index:9',
	},
}
export default layout;
