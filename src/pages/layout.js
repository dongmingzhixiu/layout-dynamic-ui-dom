const layout = {
  menuTree: [
		{
		  icon: 'el-icon-s-platform',
		  label: '工作台',
			prop:'work-list',
			page:'work-list',
			showClose:false,
		},
		// {
		// 	label:'Element-ui',
		// 	prop:'element-ui',
		// 	page:'https://element.eleme.cn/#/zh-CN/component/installation',
		// 	showClose:false,
		// },
		{
			icon:'el-icon-user-solid',
			label:'教师管理',
			prop:'teacher',
			page:'normal',
		},
		{
			icon:'el-icon-user',
			label:'学生管理',
			prop:'student',
			page:'normal',
		},
		{
			icon:'el-icon-s-help',
			label:'班级管理',
			prop:'class',
			page:'normal',
		},
		{
			icon:'el-icon-video-camera',
			label:'设备管理',
			prop:'drive',
			page:'normal',
		},
		{
			icon:'el-icon-tickets',
			label:'卡片管理',
			prop:'card',
			page:'normal',
		},
		{
			icon:'el-icon-reading',
			label:'食谱管理',
			prop:'eat',
			page:'normal',
		},
		{
			icon:'el-icon-notebook-2',
			label:'文章管理',
			prop:'article',
			page:'normal',
		},
		{	
			icon:'el-icon-s-data',
			label:'综合统计',
			prop:'chart',
			page:'normal',
		},
    {
      icon: 'el-icon-data-analysis',
      label: '一级菜单',
      children: [
				{ label:'二级菜单',prop:'card-scanner',page:'normal'},
        { label:'二级菜单',prop:'class-scanner',page:'normal'},
      ],
    },
  ],
}
export default layout;
