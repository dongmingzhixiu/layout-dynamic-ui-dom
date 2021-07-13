const noIncludes = ['pageNum', 'pageSize', 'isPageHelper', 'action'];

const mockTools = {
	/**
	 * 过滤模拟数据
	 */
	filterDataByRequest: (request, data) => {
		let d = data || [];
		Object.keys(request).map(key => {
			if (!noIncludes.includes(key)) {
				let v = decodeURI(request[key]);
				try {
					d = d.filter(item => item[key].indexOf(v) >= 0)
				} catch (e) {
					//TODO handle the exception
				}
			}
		})
		return d;
	},
}
export default mockTools;
