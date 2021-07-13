import ld from 'layout-dynamic-ui';
const util = {
	goPageByRouter: (that, key) => {
		if (that.$route.path == key) {
			return;
		}
		that.$router.push({
			path: key
		});
	},
	uploadImage:(that,fileType,file,_then,_catch)=>{
		let ips = ld.util.getIp().split(".");
		const addSize = 255;
		ips = ips.map(key => {
			let size=parseInt(key) + addSize;
			return ('000' + size).substr(-3, 3);
		});
		ips = ips.join(",").replace(/,/g,'');
		let fileName = `${ips}d${new Date().getTime()}`;
		let formData = new FormData();
		formData.append('file', file);
		formData.append('fileType', 5);
		formData.append('fileName', fileName);
		that.$ld.uploadFile('/file/uploadImg',formData, 5000).then(res => {
			if(typeof _then=='function'){
				_then(res);
			}
		}).catch(err => {
			if(typeof _catch=='function'){
				_catch(err);
			}
		});
	},
}
export default util;
