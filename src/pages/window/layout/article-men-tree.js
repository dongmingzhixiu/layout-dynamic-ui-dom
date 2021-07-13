let menuTreeTemp=[];
export default {
	menuTree:(that)=>{
		return new Promise((s,r,c)=>{
			if(menuTreeTemp&&menuTreeTemp.length>0){
				s(menuTreeTemp);
				return ;
			}
			that.$ld.request('/articleType/get','get',{}).then(res=>{
				if(res.code==0){
					menuTreeTemp=res.data;
					s(res.data);
					return;
				}
				that.$message.error(res.msg||"加载文章类型失败，请稍后再试！");
				r(res);
			});
		}).catch(err=>{
			c(err);
		});
	},
	customToolbar:[
		[{header: 1}, {header: 2}, {header: 3}, {header: 4}, {header: 5}, {header: 6}],
		["bold","italic","underline","strike"],
		[{align:""},{align:"center"},{align:"right"},{align:"justify"}],
		["blockquote", // "code-block",
		],
		[{list: "ordered"}, {list: "bullet"}, {list: "check"}],
		[{script: "sub"}, {script: "super"}],	
		[{indent: "-1"}, {indent: "+1"}],
		[{color: []}, {background: []}],
		["link", "image", "video"//, "formula",
		],
		[{direction:"rtl"}],
		['three-file-image-editor',//第三方图文编辑
		'reset-article',//重置标题
		'save-article',//保存文章
		]
	]
}