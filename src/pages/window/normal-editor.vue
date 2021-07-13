<template>
  <ld-page-loading :loading="loading" :loading-text="loadingText">
    <div class="box-b p10 normal-editor h-vh" :class="`${this.query['parentProp']}_editor`">
      <el-card class="w h">
        <div v-if="backButton&&typeof backButton['show']=='boolean'?backButton['show']:true" class="m10 c8 fs22">
          <span class="el-icon-arrow-left fs-w-b" @click="clickMethod('cancel',null)"></span>
          <span class="c-p cur-p" @click="clickMethod('cancel',null)">{{query['parentLabel']}}</span>
          <span v-if=" backButton['showType']==true">|</span>
          <span v-if=" backButton['showType']==true" @click="clickMethod('cancel',null)">{{!query['editorId']?'添加':'编辑'}}</span>
        </div>
        <div class="w f-c editor-content" :style="{height:`calc(100% - ${(buttons&&buttons.length>0)||(buttonStyle&&(buttonStyle.indexOf('fixed')>0||buttonStyle.indexOf('absolute')>0))?'160px':'0px'})`}"
          :class="{'editor-content-over-a-y':editorLayout.filter(item=>item['type']=='slot').length<=0}">
          <!-- 1.经典布局，查询条件	 -->
          <ld-forms :ref="`${query['prop']}_form`" :auto-save-api="autoSaveApi" :editor-forms-init-api="editorFormsInitApis"
            v-if="editorLayout&&editorLayout.length>0" :form="forms" :layout="editorLayout" :save-forms-data-before="autoSaveBefore"
            :editor-forms-init-after="checkFormByInit" :cols="cols" class="m-b10" :style="{'width':maxWidth}">

            <template v-if="buttons&&buttons.length>0" v-slot:buttons="e">
              <div class="f-b w a-i-c m-t10" :style="buttonStyle">
                <el-checkbox v-model="close">保存后关闭该页面</el-checkbox>
                <div style="z-index: 999;">
                  <el-button :loading="item['method']=='save'&&loading" class="m-l10" v-for="(item,i) in buttons" :key="i"
                    :type="item['type']||''" :icon="item['icon']||''" @click="clickMethod(item['method'],null)">
                    {{item['label']}}
                  </el-button>
                </div>
              </div>
            </template>
            <template v-slot:page="e">
              <component :is="e.item['slotName']" @getslotdata="getSlot" :class="e.item['class']||{}" :style="e.item['style']||{}"
                :query="Object.assign({},e,{fres:fres,dres:dres},{editorId:query['editorId']})"></component>
            </template>

          </ld-forms>
        </div>
      </el-card>
    </div>
  </ld-page-loading>
</template>

<script>
  export default {
    name: 'editor',
    props: {
      query: {
        type: Object,
        default: () => {
          return {};
        }
      }
    },
    watch: {
      query: {
        immediate: true,
        deep: true,
        handler(news) {
          if (!news['editorId']) {
            this.editorFormsInitApis = {};
          }
          this.resetData();
        }
      }

    },
    data() {
      let _dres = require(`@/pages/window/layout/default.js`).default.editor;
      let _fres = null;
      try {
        _fres = require(`@/pages/window/layout/${this.query['parentProp']}.js`).default.editor;
      } catch (e) {
        _fres = _dres;
      }
      if (typeof _fres['setSelf'] == 'function') {
        _fres['setSelf'](this);
      }
      const cols = _fres.cols || _dres.cols || 1;
      const autoSaveApi = _fres.autoSaveApi || _dres.autoSaveApi;
      const editorFormsInitApis = _fres.editorFormsInitApis || _dres.editorFormsInitApis;
      if (this.query['editorId']) {
        autoSaveApi['remoteParam'] = {};
        autoSaveApi['remoteParam']['id'] = this.query['editorId'];
        editorFormsInitApis['remoteParam'] = {};
        editorFormsInitApis['remoteParam']['id'] = this.query['editorId'];
      }
      const columnWidth = (_fres.oneColsWidth || _dres.oneColsWidth)[cols > 2 ? 2 : cols];
      let editorLayout = _fres.layout || _dres.layout;
      let button = _fres.button || _dres.button;
      const isAdministrator = JSON.parse(this.$ld.util.cookie.get('user'))['organizationId'] == '000000';
      return {
        fres: _fres,
        dres: _dres,
        close: _fres.saveClose || _dres.saveClose || true,
        forms: _fres.forms || _dres.forms || {},
        editorLayout: typeof editorLayout == 'function' ? editorLayout(isAdministrator) : editorLayout,
        buttons: typeof button == 'function' ? button(isAdministrator) : button,
        cols: cols,
        maxWidth: typeof columnWidth == 'number' ? columnWidth + 'px' : columnWidth,
        autoSaveApi: autoSaveApi,
        editorFormsInitApis: editorFormsInitApis,
        slot: _fres.slot || _dres.slot,
        backButton: _fres['backButton'] || _dres['backButton'] || {},
        buttonStyle: _fres.buttonStyle || _dres.buttonStyle || '',
        editorStyle: _fres.editorStyle || _dres.editorStyle || '',
        autoSaveBefore: _fres.autoSaveBefore || _dres.autoSaveBefore || '',


        editorSaveBefore: null,
        loading: false,
        loadingText: '正在保存中,请稍后'
      };
    },
    methods: {
      getSlot(e) {

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
      saveData() {
        this.loading = true;
        if (typeof this.editorSaveBefore == 'function') {
          let flg = this.editorSaveBefore();
          if (typeof flg == 'boolean' && flg == false) {
            return;
          }
        }
        this.$refs[`${this.query['prop']}_form`].formSave(res => {
          this.loading = false;
          if (/^<!DOCTYPE html>/.test(res)) {
            this.$message.error('未知错误，请稍后再试！');
            return;
          }
          if (res.code == 0) {
            this.$message.success("保存成功！");
            //TODO 刷新
            if (this.close) {
              //关闭当前窗口，并且刷新父窗口
              this.closeThisTab(false, true);
            }
            return;
          }
          this.$message.error(res.msg || '保存失败!');
        }, checkError => {
          debugger
          this.loading = false;
        });
      },
      resetData() {
        try {
          if (!this.query['editorId'] && this.autoSaveApi['remoteParam']) {
            this.$set(this.autoSaveApi['remoteParam'], 'id', "");
          }
          this.forms = {};
          this.$refs[`${this.query['prop']}_form`].formReset();
        } catch (e) {
          //TODO handle the exception
        }
      },
      closeThisTab(isShowConfirm, isRefresh) {
        this.query['showConfirm'] = isShowConfirm;
        this.query['refresh'] = isRefresh;
        this.query['refreshProp'] = this.query['parentProp'];
        this.$emit("events", {
          eventMethod: 'closeTabs',
          eventParam: this.query
        });
      },
      clickMethod(type, e) {
        switch (type) {
          case 'save':
            this.saveData();
            break;
          case 'reset':
            this.resetData();
            break;
          case 'cancel':
            this.closeThisTab(true);
            break;
          default:
            break;
        }
      },
      checkFormByInit() {
        if (this.editorLayout.length == this.editorLayout.filter(item => item.type == 'slot').length) {
          return;
        }
        if (!this.query['editorId']) {
          this.editorFormsInitApis = {};
        }
        setTimeout(() => {
          if (!this.$refs[`${this.query['prop']}_form`]) {
            return;
          }
          this.$refs[`${this.query['prop']}_form`].checkForm();
          this.$refs[`${this.query['prop']}_form`].initSetChange();
        }, 100)
      }
    },
    created() {
      this.resetData();
      this.checkFormByInit();
    }
  }
</script>

<style>
  .normal-editor .el-card .el-card__body {
    height: calc(100% - 40px) !important;
    box-sizing: border-box;
  }

  .editor-content-over-a-y {
    overflow-y: auto !important;
  }
</style>
