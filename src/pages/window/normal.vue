<template>
  <!-- 使用一个页面，完成系统经典布局，常用的增删改查等。 -->
  <!-- 系统统一模板 -->
  <div class="box-b p10 h" :class="`${this.query['prop']}_page`">
    <el-card class="doc w h">
      <!-- 页面内容 -->
      <div v-if="slot&&slot['name']=='centent'" class="h" :style="slot['style']||{}">
        <component v-if="slot['page']" :events="events" :query="Object.assign({},this.query,{fres:fres,dres:dres})"
          :is="slot['page']" @pagecontrol="getLeft" class="h">
        </component>
      </div>
      <div v-else class="f-s h">
        <div v-if="slot&&slot['name']=='left'" class="h" :style="slot['style']||{}">
          <component v-if="slot['page']" :events="events" :query="Object.assign({},this.query,{fres:fres,dres:dres})"
            :is="slot['page']" @leftcontrol="getLeft" class="h"></component>
        </div>
        <div class="h" style="flex-grow: 2;">
          <!-- 1.经典布局，查询条件	 -->
          <ld-forms v-if="whereLayout&&whereLayout.length>0" :form="forms" :layout="whereLayout" :is-row="true"
            class="m-b10">

            <template v-slot:buttons="e">
              <el-button class="m-l10" v-for="(item,i) in whereButton" :key="i" :type="item['type']||''"
                :icon="item['icon']||''" @click="clickMethod(item['method'],null,e)">
                {{item['label']}}
              </el-button>
            </template>

          </ld-forms>
          <!-- 2.经典布局，查询数据table	 -->
          <ld-table v-if="tableLayout&&tableLayout.length>0" :ref="`${query['prop']}_table`"
            :auto-load-data-api="autoLoadDataApi" :layout="tableLayout" :show-page-helper="showPageHelper"
            :el-pagination="elPagination" :page-size="elPaginationPageSize||elPagination['pageSizes'][0]||15"
            style="height: calc(100% - 30px);" @pageHelperSizeChange="pageHelperSizeChange">

            <template v-slot:toolsHeader="e">
              <div class="w t-c">操作</div>
            </template>
            <template v-slot:tools="e">
              <div class="f-c p-l10 p-r10">
                <el-button type="text" class="m-l2 m-r2" v-for="(item,i) in getTableTools(e['item'])" :key="i"
                  :class="textButtonClass[item['type']]" :icon="item['icon']||''"
                  @click="clickMethod(item['method'],e['item'])">
                  {{item['label']}}
                </el-button>
              </div>
            </template>

          </ld-table>

          <template v-if="(!tableLayout||tableLayout.length<=0)&&(!whereLayout||whereLayout.length<=0)">
            <div class="c8 w h f-c a-i-c">
              还没有配置相关信息，请设置！
            </div>
          </template>
        </div>
        <div v-if="slot&&slot['name']=='right'" class="h" :style="slot['style']||{}">
          <component v-if="slot['page']" :events="events" :query="Object.assign({},this.query,{fres:fres,dres:dres})"
            :is="slot['page']" @events="getEvents">
          </component>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'teacher',
    props: {
      query: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    watch: {
      //监听左侧插槽值改变事件
      left(news) {
        //
      }
    },
    data() {
      let _dres = require(`@/pages/window/layout/default.js`).default.table;
      let _fres = null;
      try {
        _fres = require(`@/pages/window/layout/${this.query['prop']}.js`).default.table;
      } catch (e) {
        console.log("加载资源出错：", `@/pages/window/layout/${this.query['prop']}.js`);
        _fres = _dres;
      }
      let whereLayout = _fres.whereLayout || _dres.whereLayout;
      let tableLayout = _fres.tableLayout || _dres.tableLayout;
      let whereButton = _fres.whereButton || _dres.whereButton;
      let tableTools = _fres.tableTools || _dres.tableTools;
      let autoLoadApi = _fres.autoLoadDataApi || _dres.autoLoadDataApi;
      let param = autoLoadApi['remoteParam'] || {};
      const isAdministrator = JSON.parse(this.$ld.util.cookie.get('user'))['organizationId'] == '000000';

      return {
        /**
         * 获取布局信息
         */
        fres: _fres,
        dres: _dres,
        forms: _fres.forms || _dres.forms,
        whereLayout: typeof whereLayout == 'function' ? whereLayout(isAdministrator, this) : whereLayout,
        tableLayout: typeof tableLayout == 'function' ? tableLayout(isAdministrator, this) : tableLayout,
        autoLoadDataApiParam: param,
        autoLoadDataApi: autoLoadApi,
        showPageHelper: _fres.showPageHelper || _dres.showPageHelper || true,
        elPagination: _fres.elPagination || _dres.elPagination,
        whereButton: typeof whereButton == 'function' ? whereButton(isAdministrator, this) : whereButton,
        tableTools: tableTools,
        deleteApi: _fres.deleteApi || _dres.deleteApi,
        slot: _fres.slot || _dres.slot,
        editorOneFormTab: _fres.editorOneFormTab || _dres.editorOneFormTab || false,
        searchBefore: _fres.searchBefore || _dres.searchBefore,
        elPaginationPageSize: 15,

        textButtonClass: {
          'danger': 'c-d',
          'primary': 'c-p',
          'warning': 'c-w',
          'info': 'c-i',
          'success': 'c-s',
        },
        /**
         *
         */
        left: {},

        //文章类型
        autoLoadParam: {},

        //处理特殊事件
        events: {}
      };
    },
    methods: {
      /**
       * 根据条件获取layout
       */
      getLayout(layout) {
        if (typeof layout != 'function') {
          return layout;
        }
        return layout();
      },
      /**
       * 记录用户个性化设置
       * 当每页条数发送改变后，记录值，下次直接使用用户设置的个性化数据
       * @param {Object} val
       */
      pageHelperSizeChange(val) {
        //因为多个页面，所以需要根据key进行区分
        let key = `${this.query['prop']}_pageSize`;
        localStorage.setItem(key, val);
      },

      getPageHelperSize() {
        this.elPaginationPageSize = this.elPagination['pageSizes'][0]||15;
        let key = `${this.query['prop']}_pageSize`;
        let size = localStorage.getItem(key);
        if (!size) {
          return;
        }
        this.elPaginationPageSize = size;
      },

      /**
       * 获取事件
       * @param {Object}
       */
      getLeft(e) {
        try {
          if (e['key']) {
            let key = e['key'];
            let val = e['value'];
            this[key] = val;
          }
        } catch (e) {}
        try {
          if (typeof e['function'] == 'function') {
            e['function'](this);
          }
        } catch (e) {}
      },

      getTableTools(item) {
        if (typeof this.tableTools == 'function') {
          return this.tableTools(item);
        }
        return this.tableTools;
      },

      appendParam(item) {
        // if (!item || Object.keys(item).length <= 0) {
        // 	return;
        // }
        Object.keys(item).map(key => {
          this.$set(this.autoLoadDataApi['remoteParam'], key, item[key]);
        });
      },

      clickMethod(type, e) {
        this.events = {};
        if (typeof type == 'object') {
          if (!type['transfer']) {
            type['fn'](e, this);
            return;
          }
          this.events = type;
          return;
        }
        switch (type) {
          case 'search':
            if (this.slot && this.slot['name'] == 'centent') {
              return;
            }
            //将所搜框的数据插入到条件中
            this.autoLoadDataApi['remoteParam'] = this.autoLoadDataApiParam;
            this.appendParam(this.autoLoadParam);
            let _form = this.searchBefore(this.forms, this);
            this.appendParam(_form);
            try {
              this.$refs[this.query['prop'] + `_table`].getPageData();
            } catch (e) {}
            break;

          case 'add':
            this.openTabs({
              page: 'normal-editor',
              label: `${this.query['label']}_新增`,
              prop: `${this.query['prop']}_add`,
              parentProp: this.query['prop'],
              parentLabel: this.query['label'],
              icon: 'el-icon-plus',
              editorId: '',
            });
            break;

          case 'editor':
            this.openTabs({
              page: 'normal-editor',
              label: `${this.query['label']}_编辑`,
              prop: this.editorOneFormTab ? `${this.query['prop']}_editor` :
                `${this.query['prop']}_editor_${e['id']}`,
              parentProp: this.query['prop'],
              parentLabel: this.query['label'],
              icon: 'el-icon-edit',
              editorId: e['id'],
            });
            break;
          case 'delete':
            // this.$confirm(`确定删除该数据吗，删除后不能恢复？`, '提示', {
            // 	confirmButtonText: '确定',
            // 	cancelButtonText: '取消',
            // 	type: 'warning'
            // }).then(() => {
            this.deleteByItem(e);
            // }).catch(() => {});
            break;
          default:
            break;
        }
      },

      deleteByItem(item) {
        let param = this.deleteApi['remoteParam'] || {};
        param['id'] = item['id'];
        this.$ld.request(this.deleteApi['remotePath'], this.deleteApi['remoteMethodType'], param).then(res => {
          if (!Object.keys(res).includes("code")) {
            res = res['data'];
          }
          if (res.code == 0) {
            this.$message.success("删除成功！");
            this.refreshTabs();
            return;
          }
          this.$message.error(res.msg || "删除失败，请稍后再试！");
        });
      },
      refreshTabs() {
        this.$emit("events", {
          eventMethod: 'refreshTabs',
          eventParam: {
            prop: this.query['prop']
          }
        });
      },
      openTabs(e) {
        this.$emit('events', {
          eventMethod: 'openTabs',
          eventParam: e
        });
      },
      closeTabs(e) {
        this.$emit("events", {
          eventMethod: 'closeTabs',
          eventParam: this.query
        });
      }
    },
    created() {
      this.getPageHelperSize();
      setTimeout(() => {
        this.clickMethod('search', null);
      }, 250)
    }
  }
</script>

<style>
</style>
