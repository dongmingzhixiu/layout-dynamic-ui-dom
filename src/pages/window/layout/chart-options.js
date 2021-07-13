import ld from 'layout-dynamic-ui'
let option1 = (isFirst) => {
  let colors = isFirst ? ['#91CC75'] : ['#EE6666'];
  return {
    color: colors,
    title: {
      text: (isFirst ? '幼儿' : '老师') + `今日(${ld.util.getDate()})出勤统计`
    },
    toolbox: {
      feature: {
        saveAsImage: {
          show: true
        }
      }
    },
    tooltip: {},
    xAxis: {
      data: isFirst ? ["小班", "中班", "大班"] : ['校长', '教师', '后勤']
    },
    yAxis: {},
    series: [{
      name: '出勤总人数',
      type: 'bar',
      label: {
        normal: {
          show: true,
          formatter: function(v) {
            var val = v.data;
            return val + '人';
          },
          color: '#fff'
        }
      },
      data: []
    }]
  }
};


const labelOption = {
  show: true,
  position: 'top',
  distance: 2,
  align: 'left',
  verticalAlign: 'middle',
  rotate: 90,
  formatter: function(params) {
    if (params.value > 0) {
      return ` ${params.seriesName}:${params.value}`
    }
    return ''
  },
  fontSize: 12,
  rich: {
    name: {

    }
  }
};

let option2 = (isFirst) => {
  let colors = isFirst ? ['#ffaa00','#55aa00', '#EE6666'] : [ '#55aaff','#e941ff','#00aa7f'];
  return {
    title: {
      text: (isFirst ? '幼儿' : '老师') + `${new Date().getMonth()+1}月打卡统计`
    },
    color: colors,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params) {
        let d = new Date();
        if (params.length <= 0) {
          return;
        }
        let day = params[0].axisValueLabel;
        let title = `${d.getFullYear()}-${d.getMonth()+1}-${day}出勤`;
        let info = "";
        info = params.map(item => {
          return `${item.marker}${item.seriesName}:${item.value}人`;
        });
        return title + '<br/>' + info.join('<br/>');
      }
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: false
        },
        saveAsImage: {
          show: true
        }
      }
    },
    legend: {
      data: ['小班', '中班', '大班']
    },
    xAxis: [{
      type: 'category',
      axisTick: {
        show: false
      },
      data: ['2021-6-1', '2021-6-2', '2021-6-3', '2021-6-4', '2021-6-5']
    }],
    yAxis: [{
      type: 'value',
      name: '出勤人数'
    }],
    dataZoom: [{
      type: 'inside'
    }, {
      type: 'slider'
    }],
    series: [{
        name: isFirst ? '小班' : '校长',
        type: 'bar',
        barGap: 0,
        label: labelOption,
        emphasis: {
          focus: 'series'
        },
        data: [320, 332, 301, 334, 390, 332, 301, 334, 390, 332, 301, 334, 390, 332, 301, 334, 390]
      },
      {
        name: isFirst ? '中班' : "教师",
        type: 'bar',
        label: labelOption,
        emphasis: {
          focus: 'series'
        },
        data: [220, 182, 191, 234, 290, 332, 301, 334, 390, 332, 301, 334, 390, 332, 301, 334, 390]
      },
      {
        name: isFirst ? '大班' : '后勤',
        type: 'bar',
        label: labelOption,
        emphasis: {
          focus: 'series'
        },
        data: [150, 232, 201, 154, 190, 332, 301, 334, 390, 332, 301, 334, 390, 332, 301, 334, 390]
      }
    ]
  }
}


const cardStyle = {
  0: {
    class: 'b-d',
    count: '120',
    text: 'studentCount',
    info: '学生总数',
  },
  1: {
    class: 'b-s',
    count: '0',
    text: 'studentCardCount',
    info: '今日学生出勤总数',
  },
  2: {
    class: 'b-w',
    count: '0',
    text: 'teacherCount',
    info: '老师总数',
  },
  3: {
    class: 'b-p',
    count: '0',
    text: 'teacherCardCount',
    info: '今日老师出勤总数',
  },
}


const options = {
  options1: option1,
  options2: option2,
  options3: option1,
  options4: option2,
  cardStyle: cardStyle,
}
export default options;
