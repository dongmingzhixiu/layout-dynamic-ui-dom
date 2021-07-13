<template>
  <div class="box-b h">
    <div class="w h">
      <!-- 页面内容 -->
      <div class="f-b card-count">
        <el-card v-for="(item,i) in Object.keys(cardStyle)" :key="i" class="p10 m10 m-b2"
          :class="cardStyle[item]['class']" shadow="hover" style="flex-grow: 2;">
          <div class="count">{{cardStyle[item]['count']}}</div>
          <div class="info">{{cardStyle[item]['info']}}</div>
        </el-card>
      </div>

      <div class="f-b card-count w">
        <el-card class="p10 m10 p-b0 m-t2" style="width: calc(100% / 4 - 50px);height: 300px;">
          <ld-page-loading :loading="loading[`${pre}data1`]" class="w h">
            <div :id="`${pre}myChart`" class="w h">
            </div>
          </ld-page-loading>
        </el-card>
        <el-card class="p10 m10 p-b0 m-t2" style="width: calc(100% / 4 * 3);height: 300px;flex-grow: 2;">
          <ld-page-loading :loading="loading[`${pre}data2`]" class="w h">
            <div :id="`${pre}myChart2`" class=" w h">
            </div>
          </ld-page-loading>
        </el-card>
      </div>

      <div class="f-b card-count w">
        <el-card class="p10 m10 p-b0 m-t2" style="width: calc(100% / 4 * 3);height: 300px;flex-grow: 2;">
          <ld-page-loading :loading="loading[`${pre}data4`]" class="w h">
            <div :id="`${pre}myChart4`" class=" w h">
            </div>
          </ld-page-loading>
        </el-card>
        <el-card class="p10 m10 p-b0 m-t2" style="width: calc(100% / 4 - 50px);height: 300px;">
          <ld-page-loading :loading="loading[`${pre}data3`]" class=" w h">
            <div :id="`${pre}myChart3`" class=" w h">
            </div>
          </ld-page-loading>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
  /**
   * 引入图表
   */
  import res from '@/pages/window/layout/chart-options.js';
  let echarts = require('echarts')
  export default {
    name: 'chart-list',
    props: {},
    data() {
      return {
        cardStyle: res.cardStyle,
        options1: res.options1(true),
        options2: res.options2(true),
        options3: res.options3(false),
        options4: res.options4(false),
        pre: 'chart-' + this.$ld.util.randomChar(4),
        loading: {
          data1: true,
          data2: true,
          data3: true,
          data4: true,
        }
      };
    },
    mounted() {
      this.pre = 'chart-' + this.$ld.util.randomChar(4);
      setTimeout(() => {
        this.drawLine();
      }, 250);
    },
    methods: {
      getSelectInfoByDay() {
        this.$ld.request("/charts/selectInfoByDay", "get", {}, 10000).then(res => {
          if (res.code == 0) {
            let data = res.data;
            this.cardStyle[0]['count'] = data['s'];
            this.cardStyle[1]['count'] = data['sc'];
            this.cardStyle[2]['count'] = data['t'];
            this.cardStyle[3]['count'] = data['tc'];
          }
        });
      },

      drawLine() {
        let day = [];
        for (let i = 1; i <= new Date().getDate(); i++) {
          day.push(i < 10 ? '0' + i : i);
        }
        const getData = (data) => {
					debugger
          let arr1 = [],
            arr2 = [],
            arr3 = [];
          for (let i = 0; i < data.length; i++) {
            let d = data[i];
            arr1.push(d[0]);
            arr2.push(d[1]);
            arr3.push(d[2]);
          }
          return [arr1, arr2, arr3];
        }
        for (let i = 1; i <= 4; i++) {
          let key = `${this.pre}data${i}`;
          this.$set(this.loading, key, true);
        }

        this.getData('/charts/studentByDay', (data) => {
          this.$set(this.loading, `${this.pre}data1`, false);
          let myChart = echarts.init(document.getElementById(this.pre + 'myChart'))
          this.options1['series'][0]['data'] = data;
          let count = 0;
          // data.map(item => {
          //   count += parseInt(item);
          // })
          // this.cardStyle[1]['count'] = count;
          myChart.setOption(this.options1);
        });

        this.getData('/charts/teacherByDay', (data) => {
          this.$set(this.loading, `${this.pre}data3`, false);
          let myChart3 = echarts.init(document.getElementById(this.pre + 'myChart3'))
          this.options3['series'][0]['data'] = data;
          myChart3.setOption(this.options3);
        });



        this.getData('/charts/studentByMonth', (data) => {
          this.$set(this.loading, `${this.pre}data2`, false);
          let myChart2 = echarts.init(document.getElementById(this.pre + 'myChart2'))
          let arr = getData(data);
          this.options2['xAxis'][0]['data'] = day;
          this.options2['series'][0]['data'] = arr[0];
          this.options2['series'][1]['data'] = arr[1];
          this.options2['series'][2]['data'] = arr[2];
          myChart2.setOption(this.options2);
        });

        this.getData('/charts/teacherByMonth', (data) => {
          this.$set(this.loading, `${this.pre}data4`, false);
          let myChart4 = echarts.init(document.getElementById(this.pre + 'myChart4'))
          let arr = getData(data);
          this.options4['xAxis'][0]['data'] = day;
          this.options4['series'][0]['data'] = arr[0];
          this.options4['series'][1]['data'] = arr[1];
          this.options4['series'][2]['data'] = arr[2];

          myChart4.setOption(this.options4);
        });
      },
      /**
       * 获取信息
       */
      getData(key, fn) {
        let that = this;
        this.$ld.request(key, 'get', {}, 10000).then(_res => {

          if (!_res || !_res.data) {
            return;
          }
          let data = _res.data;
          if (typeof fn == 'function') {
            fn(data);
          }
        });
      }

    },
    created() {
      for (let i = 1; i <= 4; i++) {
        let key = `${this.pre}data${i}`;
        this.$set(this.loading, key, true);
      }
      this.getSelectInfoByDay();
    }
  }
</script>

<style>
  .card-count .count {
    font-size: 40px;
    color: white;
    font-weight: bold;
    text-align: center;
  }

  .card-count .info {
    margin-top: 5px;
    font-size: 18px;
    color: white;
    font-weight: bold;
    text-align: center;
  }
</style>
