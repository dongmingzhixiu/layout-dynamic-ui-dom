import ld from 'layout-dynamic-ui'
const layout = {
  table: {
    forms: {},
    whereLayout: [{
        prop: 'names',
        label: '名称',
        type: 'text'
      },
      {
        prop: 'headId',
        label: '班主任名称',
        type: 'select',
        filterable:true,
        getOptions: {
          remotePath: '/teacher/get', //请求方法
          remoteMethodType: "post", //请求类型
          remoteParam: {
            type: '1'
          }, //参数
          label: '${names}', //下拉框显示文字；比如有数据[{id:1,nickName:'张三',phone:'18888888888'}] => '张三(18888888888)'
          value: '${id}', //此处的'${id}'<=>'id' 下拉框选项值；比如有数据[{id:1,nickName:'张三',phone:'18888888888'}] => '1'
          remoteTimeout: 5000
        },
      },
      {
        prop: 'gradeId',
        label: '年级',
        type: 'select',
        options: [{
          label: '小班',
          value: '0'
        }, {
          label: '中班',
          value: '1'
        }, {
          label: '大班',
          value: '2'
        }, {
          label: '毕业班',
          value: '3'
        }]
      },
    ],
    tableLayout: [{
        prop: 'names',
        label: '班级名称'
      },
      // {prop:'teacherId',label:'性别',html: (val) => { return `<div class="${val==1?'c-d':'c-s'}">${val==1?'男':'女'}</div>`}},
      {
        prop: 'type',
        label: '类型',
        format: (val) => {
          return val == '1' ? '拖班' : '简版'
        }
      },
      {
        prop: 'gradeId',
        label: '年级',
        format: (val) => {
          return val == 0 ? '小班' : val == 1 ? '中班' : val == 2 ? '大班' : '毕业班'
        }
      },
      {
        prop: 'headId',
        label: '班主任',
        replace: {
          remotePath: '/teacher/getById',
          remoteMethodType: "get",
          label: 'names',
          value: 'id'
        },
      },
      {
        prop: 'teachersId',
        label: '任教老师',
        replace: {
          remotePath: '/teacher/getByIds',
          remoteMethodType: "get",
          label: 'names',
          value: 'ids'
        },
      },
    ],
    showPageHelper: true,
    autoLoadDataApi: {
      remotePath: '/clzss/getPage',
      remoteParam: {
        organizationId: '',
        gradeId:'',
        headId:'',
        names:''
      },
      remoteMethodType: "get",
      remoteTimeout: null,
    },
    elPagination: {
      pageSizes: [15, 20, 30, 40, 50, 80]
    },

    tableTools: [{
        label: '编辑',
        method: 'editor',
        type: 'warning'
      },
      {
        label: '删除',
        method: 'delete',
        type: 'danger'
      },
    ]
  },
  editor: {
    layout: [{
        prop: 'names',
        label: '班级名称',
        type: 'text',
        require: true
      },
      {
        prop: 'gradeId',
        label: '所在年级',
        type: 'select',
        require: true,
        options: [{
          label: '小班',
          value: '0'
        }, {
          label: '中班',
          value: '1'
        }, {
          label: '大班',
          value: '2'
        }, {
          label: '毕业班',
          value: '3'
        }]
      },
      {
        prop: 'headId',
        label: '班主任',
        type: 'select',
        require: true,
        filterable: true,
        getOptions: {
          remotePath: '/teacher/get', //请求方法
          remoteMethodType: "post", //请求类型
          remoteParam: {
            type: '1'
          }, //参数
          label: '${names}', //下拉框显示文字；比如有数据[{id:1,nickName:'张三',phone:'18888888888'}] => '张三(18888888888)'
          value: '${id}', //此处的'${id}'<=>'id' 下拉框选项值；比如有数据[{id:1,nickName:'张三',phone:'18888888888'}] => '1'
        }
      },
      {
        prop: 'teachersId',
        label: '任教老师',
        type: 'select',
        multiple: true,
        filterable: true,
        collapseTags: false,
        getOptions: {
          remotePath: '/teacher/get', //请求方法
          remoteMethodType: "post", //请求类型
          remoteParam: {
            type: '1'
          }, //参数
          label: '${names}', //下拉框显示文字；比如有数据[{id:1,nickName:'张三',phone:'18888888888'}] => '张三(18888888888)'
          value: '${id}', //此处的'${id}'<=>'id' 下拉框选项值；比如有数据[{id:1,nickName:'张三',phone:'18888888888'}] => '1'
        },
        parseType: 'split',
        splitChart: ','
      },
      {
        prop: 'remake',
        label: '备注',
        type: 'textarea',
        rows: 6
      },
    ],
    cols: 1,
    autoSaveApi: {
      //请求路径
      remotePath: '/clzss/save',
      //请求参数
      remoteParam: {},
      //请求方法
      remoteMethodType: "post",
      //得到数据后对数据的预处理
      // getDataAfter: (data) => {
      // 	return data.data;
      // }
    },
    editorFormsInitApis: {
      //请求路径
      remotePath: '/clzss/getById',
      //请求参数
      remoteParam: {},
      //请求方法
      remoteMethodType: "get",
      //得到数据后对数据的预处理
      getDataAfter: (data) => {
        //将字符串分割成数组 23,53=>[23,43]
        if (data['teachersId']) {
          data['teachersId'] = data['teachersId'].split(',');
        }
        return data;
      }
    },
    editorStyle: "",
    // buttonStyle:'position: fixed;bottom: 0px;padding-bottom:10px;width:800px;background:white;z-index:9',
    autoSaveBefore: (form) => {
      if (Array.isArray(form['teachersId'])) {
        let ar = form['teachersId'].filter(item => item);
        form['teachersId'] = ar.join(',');
      }
      return form;
    }
  },
}
export default layout;
