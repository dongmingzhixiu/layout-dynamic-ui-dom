import ld from 'layout-dynamic-ui'
let _self;
const layout= {
	table:{
		forms: {},
		whereLayout:(isAdministrator)=>{
			let arr=[{prop:'names',label:'姓名',type:'text'},{prop:'phone',label:'手机号码',type:'text'}];
		  if(isAdministrator){
		  	arr.push({prop:'organizationId',label:'园所',type:'select',filterable:true,
					getOptions:{
						remotePath: '/organization/get', //请求方法
						remoteMethodType: "get",//请求类型
						remoteParam:{},//参数
						label:'${names}',//下拉框显示文字；比如有数据[{id:1,nickName:'张三',phone:'18888888888'}] => '张三(18888888888)'
						value:'${id}', //此处的'${id}'<=>'id' 下拉框选项值；比如有数据[{id:1,nickName:'张三',phone:'18888888888'}] => '1'
					}
				});
			}
			return arr;
		},
		tableLayout:(isAdministrator,_that)=>{
			let arr=[
				{prop:'names',label:'姓名'},
				{prop:'phone',label:'电话号码'},
				{prop:'sex',label:'性别',html: (val) => { return `<div class="${val==1?'c-d':'c-s'}">${val==1?'男':'女'}</div>`}},
				{prop:'birthday',label:'年龄',format: (val) => { return !val ? '' : ld.util.getYearDiff(new Date(),val)}},
				{prop:'birthday',label:'出生日期',format: (val) => { return !val ? '未填写' : ld.util.getDate(0, new Date(val));}},
				{prop:'code',label:'绑定码'},
        {prop:'photo',label:'头像',html:(val)=>{
          if(!val){
            return `<span class="c-i">未设置</span>`
          }
          let url=val.replace(/[?].*$/,'');
          let rotate=`transform: rotate(${val.replace(/.*[?]rotate=/,'')}deg);`
          return `<div class="f-c w"><div class="f-c a-i-c w-40 h-40 over-h" style='${rotate}'><img  class="w h r" src="${_that.$ld.getImagePath(url)}" style="background-size: cover;"></img></div></div>  `
        }}
			];
			if(isAdministrator){
				arr.push(
					{
						prop:'organizationId',label:'园所',
						replace:{
							 remotePath: '/organization/getById',
							 remoteMethodType: "get",
							 label:'names',
							 value:'id'
						},
					}
				)
			}
			return arr;
		},
		showPageHelper: true,
		autoLoadDataApi:{
			remotePath: '/teacher/getPage',
			remoteParam: {organizationId:'',phone:'',names:''},
			remoteMethodType: "get",
			remoteTimeout: null,
		},
		elPagination:{
			pageSizes: [15, 20, 30, 40, 50, 80]
		},

		tableTools:[
			{label:'编辑',method:'editor',type:'warning'},
			{label:'删除',method:'delete',type:'danger'},
		],
		//删除的api接口
		deleteApi: {
			remotePath: '/teacher/delete',
			remoteParam: {},
			remoteMethodType: "delete",
			remoteTimeout: null,
		},
	},
	editor:{
		layout:[
			{prop:'names',label:'姓名',type:'text',require:true},
			{prop:'code',label:'绑定码',type:'text',require:true,value: (val) => { return new Date().getFullYear()}},
			{prop:'phone',label:'手机号码',type:'text',regex:/^[1][0-9]{10}$/},
			{prop:'birthday',label:'出生日期',type:'date',dateType:'date',
				pickerOptions: {
					disabledDate(time) {
						return time.getTime() > Date.now();
					},
					shortcuts:(()=>{
						let arr=[];
						for(let i=15;i<=65;i+=5){
							arr.push({
								text:`${i}岁`,
								onClick:(picker) =>{
									const date = new Date(_self.$ld.util.getDateTime(-i*365));
									picker.$emit('pick', date);
								}
							})
						}
						return arr;
					})(),
				},
			},
      {prop:'photo',label:'头像',type:'image',showRotate: true,limit:1},
			{prop:'sex',label:'性别',type:'radio',options:[{label:'男',value:'1'},{label:'女',value:'0'}],value:'0'},
			{prop:'isTitle',label:'是否为校长',type:'radio',options:[{label:'校长',value:'1'},{label:'教师',value:'0'},{label:'后勤',value:'2'}],value:'0'},
			{prop:'teaching',label:'教学特点',type:'textarea',rows:10},
		],
		cols:1,
		autoSaveApi:{
			//请求路径
			remotePath: '/teacher/save',
			//请求参数
			remoteParam: {},
			//请求方法
			remoteMethodType: "post",
			//得到数据后对数据的预处理
			// getDataAfter: (data) => {
			// 	return data.data;
			// }
		},
    autoSaveBefore: (form) => {
    	let photo = form['photo'];
      if(Array.isArray(photo) && (!photo[0]['raw'] instanceof File||!photo[0]['raw'])){
        form['photo']=photo[0]['url'].replace(/[?].*/,"")+"?rotate="+photo[0]['rotate'];
        return form;
      }
    	if (!Array.isArray(photo) || !photo[0]['raw'] instanceof File) {
    		return form;
    	}
    	_self.loading = false;
    	return new Promise((s, r) => {
    		_self.loadingText = "正在上传图片，请稍后";
    		_self.loading = true;
    		_self.$util.uploadImage(_self,1, photo[0]['raw'], (res) => {
    			_self.loadingText = "正在保存中,请稍后";
    			if (res.code == 0) {
    				form['photo'] = res.data['filePath'];
    				s(form);
    			}
    			r(form);
    		}, err => {
    			_self.loading = false;
    			r(err);
    		});
    	});
    	setTimeout(()=>{
    		_self.loading=false;
    	},5000);
    },
		editorFormsInitApis:{
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
		//将页面this对象设置到当前js可使用
		setSelf(self){
			_self=self;
		}
	},
}
export default layout;
