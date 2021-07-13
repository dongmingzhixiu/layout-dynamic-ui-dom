<template>
  <div ref="custom-article-editor-from " :class="`article-${hash}`" id="custom-article-editor-from" class="box-b w h "
    style="position:relative:min-width:720px;">
    {{`article-${hash}`}}
    <div style="position: absolute;top:0px;left:0px;z-index:10;width: auto;min-width: 720px;"
      :style="{'top':editorIsRow?'-5px':'0'}">
      <el-button class="m2" icon="el-icon-back" type="success" @click="backPage">返回上一页</el-button>
      <el-button class="m2" icon="el-icon-picture-outline-round" type="warning">
        <a href="javascript:window.open('http://bj.96weixin.com/')" style="text-decoration: none;" class="c-f">
          第三方图文编辑器
        </a>
      </el-button>
      <template v-if="editorIsRow">
        <el-button class="m2" icon="el-icon-s-release" type="primary" @click="reset">重置标题分类</el-button>
        <el-button class="m2" icon="el-icon-s-claim" type="danger" @click="saveArticle">保存文章信息</el-button>
      </template>
    </div>
    <div class="article-info w h f-c" :class="{'m-t10':editorIsRow,'p-t10':editorIsRow}"
      :style="{height:`calc(100% - ${editorIsRow?'40px':'0px'})`}">
      <div class="w h" style="width: 720px;" :class="{'m-t10':editorIsRow}">
        <ld-page-loading :loading="editorLoading" class="w h" background="rgba(255,255,255,.8)"
          loading-text="上传图片中,请稍后">
          <div id="vueEditor" class="w h" style="position: relative;">
            <div class="w info b-f m2" style="position: absolute;top: 73px;z-index: 2;width: calc(100% - 6px);">
              <div class="w f-s">
                <div style="flex-grow: 2;" class="box-b p2">
                  <el-input v-model="title" placeholder="文章标题:请输文章标题" class="title fs20 w fs-b-w bor0"></el-input>
                  <el-select class="w fs22" clearable v-model="types" filterable placeholder="文章分类:请选择或输入检索(可输入拼音首字母检索)"
                    style="flex-grow: 2;" :filter-method="getFilterSelect" @blur="typesBlur">
                    <el-option v-for="item in selectInfo" :key="item.value" :label="item.label" :value="item.value">
                      <div @click="clickThis(item)" class="f-b"
                        :class="{'m-l10':item['isParent']==false,'c8 cur-disabled':item['haveChildren']==true&&item['isParent']==true}"
                        :disabled="item['haveChildren']==true&&item['isParent']==true">
                        <span style="float: left">{{ item.label }}</span>
                        <span v-if="item['parentLabel']" class="c-i">{{ item['parentLabel'] }}</span>
                      </div>
                    </el-option>
                  </el-select>
                </div>
                <div class="f-n-c-w" style="position: relative;margin-top: -33px;margin-right: 2px;">
                  <ld-images class="image-conver" :limit="1" :value="image" @image="uploadCover"></ld-images>
                  <span v-if="!image" class="b-b3 r2 c-f p2"
                    style="position: absolute; bottom: 10px;left: 10px;z-index: 99;zoom: 0.8;pointer-events: none;">上传封面</span>
                </div>
              </div>
            </div>
            <vue-editor id="editor" class="w h" style="height: calc(100% - 100px);" useCustomImageHandler
              @imageAdded="handleImageAdded" :editor-toolbar="customToolbar" v-model="content">
            </vue-editor>
          </div>
        </ld-page-loading>
      </div>
    </div>
  </div>
</template>

<script>
  import res from '@/pages/window/layout/article-men-tree.js';
  import {
    VueEditor
  } from "vue2-editor";

  let el = null;
  export default {
    name: 'article-editor',
    components: {
      VueEditor
    },
    props: {
      query: {
        type: Object,
        default: () => {
          return {};
        }
      }
    },
    data() {
      return {
        isMax: !(this.$ld.headToolInfo.get()['full screen'] || true),
        menuTree: [],
        editorLoading: false,
        //文章类型
        types: '',
        //文章标题
        title: '',
        //封面
        image: '',

        content: '',
        selectList: [],
        selectInfo: [],
        typeError: false,
        customToolbar: res.customToolbar,
        reTry: 0,

        editorIsRow: false,

        imageReplaceMap: {},

        hash: this.$ld.util.randomChar(4),


      }
    },
    methods: {
      /**
       * 初始化获取数据
       */
      getEditorFormsInfo() {
        let form = this.query['form'];
        if (form) {
          this.image = form['image'] || '';
          this.title = form['title'] || '';
          this.types = form['typeId'] || '';
          this.content = form['content'] ? this.replaceImageToRemoteImage(form['content']) : "";
        }
      },

      replaceImageToRemoteImage(content) {
        return content.replace(/\r\n|\n/gm, '').replace(/<img[^<>]*([/]?>|><[/]img>)/gm, res => {
          return res.replace(/src\s?=\s?[\'"]?[^\'"]*[\'"]?/g, src => {
            return `src="${this.getImagePath(src.replace(/src=|src=|src\s?=\s?|"/g,''))}"`;
          });
        })
      },

      getImagePath(image) {
        return this.$ld.getImagePath(image);
      },

      /**
       * 重置
       */
      reset() {
        this.$confirm('重置后会清楚标题内容和类型，确定继续吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.title = "";
          this.types = "";
          this.content = "";
        })
      },
      /**
       * 保存
       */
      saveArticle() {
        const isNotNull = {
          title: '标题不能为空',
          types: '文章类型不能为空',
          content: '内容不能为空',
        };
        let flg = true;
        let msg = "";
        Object.keys(isNotNull).map(key => {
          if (!this[key]) {
            flg = false;
            msg = isNotNull[key];
            return;
          }
        });
        if (!flg) {
          this.$message.error(msg);
          return;
        }
        // 处理文章内容,将图片路径更改为服务器图片
        let content = this.content;
        Object.keys(this.imageReplaceMap).map(key => {
          content = content.replace(key, this.imageReplaceMap[key]);
        });

        let data = {
          id: this.query && this.query['from'] && this.query['form']['id'] ? this.query['form']['id'] : "",
          title: this.title,
          image: this.image.replace(new RegExp("^" + this.$ld.requestSetting.serverPath.get() + "/*"), '/'),
          content: content,
          typeId: this.types,
        };
        this.$ld.postRequest('/article/save', data).then(res => {
          this.$notify.closeAll();
          if (res.code == 0) {
            this.$notify({
              title: '提示',
              message: '保存成功!',
              type: 'success'
            });
            return;
          }
          this.$notify({
            title: '提示',
            message: res.msg || "保存失败！",
            type: 'error'
          });
        }).catch(err => {

        })
      },
      /**
       * 返回上一页
       */
      backPage() {
        this.$emit("getslotdata", {
          'function': (that) => {
            that.closeThisTab(true);
          }
        });
      },
      //上传图片和图片保存
      uploadImage(file, fileType, data, uploadFn, errFn) {
        data = data || {};
        this.editorLoading = true;
        this.$util.uploadImage(this, fileType, file, (res) => {
          this.editorLoading = false;
          if (res.code == 0) {
            let url = res.data['filePath']; // Get url from response
            let _url = this.$ld.getImagePath(url);
            this.imageReplaceMap[_url] = url;
            if (typeof uploadFn == 'function') {
              uploadFn({
                result: res,
                url: url,
                _url: _url
              });
            }
            //保存图片访问信息到数据库
            let _data = {
              path: url,
              type: data['fileType'] || fileType,
              ctype: data['types'] || this.types || '未分类',
              remake: data['remake'] || this.title || '编辑文件上传图片'
            };
            this.$ld.request('/images/save', 'post', _data).then(saveRes => {
              if (saveRes.code == 0) {
                this.$message.success("图片上传成功！");
                return;
              }
              this.$message.error(saveRes.msg || "图片上传失败！");
            });
            return;
          }
          if (typeof errFn == 'function') {
            errFn(res);
          }
        }, err => {
          this.editorLoading = false;
          if (typeof errFn == 'function') {
            errFn(err);
          }
        });
      },
      //上传封面图片
      uploadCover(e) {
        let file = e[0]['raw'];
        let _data = {
          remake: '文章封面'
        };
        this.uploadImage(file, 5, _data, (e) => {
          this.image = e['_url'];
        })
      },
      /**
       * 图片上传拦截
       */
      handleImageAdded(file, Editor, cursorLocation, resetUploader) {
        this.uploadImage(file, 5, null, (e) => {
          Editor.insertEmbed(cursorLocation, "image", e['_url']);
          el = el != null ? el : document.querySelector(`.article-${this.hash} [contenteditable="true"]`);
          let selection = window.getSelection();
          let range = document.createRange();
          range.setStart(el, cursorLocation + 1);
          range.setEnd(el, cursorLocation + 1);
          selection.addRange(range);
          resetUploader();
        })
        setTimeout(() => {
          this.editorLoading = false;
        }, 4000);
      },
      typesBlur() {
        // if (this.selectInfo.length <= 0) {
        // 	this.getFilterSelect(this.types);
        // }
      },
      getFilterSelect(key) {
        this.selectInfo = this.selectList.filter(item => item['label'].indexOf(key) >= 0 ||
          item['value'].indexOf(key.toLocaleLowerCase()) >= 0 ||
          item['pingKey'].indexOf(key.toLocaleLowerCase()) >= 0)
      },
      clickThis(item) {
        this.typeError = item['haveChildren'] && item['isParent'];
        if (this.typeError) {
          this.$message.error(`请选择【${item['label']}】下的子项，当前项不能被选中！`);
        }
        // this.getFilterSelect("");
      },
      getMenuSelect() {
        let trees = this.menuTree;
        let arr = [];
        this.menuTree.map(item => {
          this.getItemToArray(item, arr, 1);
        });
        this.selectList = arr;
        this.selectInfo = this.selectList;
      },
      getItemToArray(item, arr, parent) {
        let s = {
          label: item['label'],
          value: item['prop'],
          parent: parent,
          isParent: true,
          haveChildren: item.children && item.children.length > 0
        }
        arr[arr.length] = s;
        if (item.children && item.children.length > 0) {
          item.children.map(_item => {
            if (_item.children && _item.children.length > 0) {
              this.getItemToArray(_item, arr, parent + 1);
            } else {
              let _s = {
                label: _item['label'],
                value: _item['prop'],
                parent: parent,
                isParent: false,
              }
              arr[arr.length] = _s;
            }
          });
        }
      },
      initFullScreen() {
        this.$ld.headToolInfo['full screen'] = (val) => {
          this.isMax = !val;
        }
        this.isMax = false;
        let fs = this.$ld.headToolInfo.get()['full screen'];
        this.isMax = typeof fs == 'boolean' ? !fs : false;
      },
      initGetMenuTree() {
        let _tree = res.menuTree(this);
        if (_tree instanceof Promise) {
          _tree.then(res => {
            //整理数据
            let arr = res.filter(item => item['parentId'] == '0' || !item['parentId']);
            arr = arr.map(item => {
              let pid = item['id'];
              item['children'] = res.filter(item => item['parentId'] == pid);
              return item;
            })
            this.menuTree = arr;
            this.getMenuSelect();
          })
        }
      },
      initEditorButton() {
        this.reTry++;
        if (!document.querySelector(".ql-save-article") && this.reTry < 10) {
          setTimeout(() => {
            this.initEditorButton();
          }, 100);
        }
        setTimeout(() => {

          document.querySelector(`.article-${this.hash} .ql-save-article`).innerHTML =
            `<div class="ql-save-article-button" id="ql-save-article-${this.hash}">保存文章</div>`;
          document.querySelector(`.article-${this.hash} .ql-reset-article`).innerHTML =
            `<div class="ql-reset-article-button" id="ql-reset-article-${this.hash}">重置</div>`;
          document.querySelector(`.article-${this.hash} .ql-three-file-image-editor`).innerHTML =
            `<div id="ql-three-file-image-editor"><a href="javascript:window.open('http://bj.96weixin.com/')" style="text-decoration: none;" class="c-f">图文编辑</a></div>`;
          document.getElementById(`ql-save-article-${this.hash}`).onclick = () => {
            this.saveArticle();
          }
          document.getElementById(`ql-reset-article-${this.hash}`).onclick = () => {
            this.reset()
          }
        }, 250);
      },
      getPageWidth() {
        try {
          let el = this.$refs['custom-article-editor-from'] || document.getElementById("custom-article-editor-from");
          let width = el.clientWidth || el.offsetWidth;
          this.editorIsRow = width < 1380;
          document.querySelector(`.article-${this.hash} .ql-save-article`).style.display =
            document.querySelector(`.article-${this.hash} .ql-reset-article`).style.display =
            document.querySelector(`.article-${this.hash} .ql-three-file-image-editor`).style.display = this
            .editorIsRow ? "none" : 'block';
        } catch (e) {}
      }
    },
    mounted() {
      this.initEditorButton();
    },
    created() {
      this.initGetMenuTree();
      this.initFullScreen();
      this.getEditorFormsInfo();
      setTimeout(() => {
        this.getPageWidth();
        window.onresize = this.getPageWidth
      }, 250);
    }
  }
</script>

<style>
  @import "vue2-editor/dist/vue2-editor.css";
  @import 'quill/dist/quill.core.css';
  @import 'quill/dist/quill.bubble.css';
  @import 'quill/dist/quill.snow.css';

  .ql-snow .ql-picker.ql-header .ql-picker-label::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item::before {
    content: '正文' !important;
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    content: '标题1' !important;
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    content: '标题2' !important;
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    content: '标题3' !important;
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    content: '标题4' !important;
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    content: '标题5' !important;
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    content: '标题6' !important;
  }

  .ql-tooltip.ql-editing {
    left: 0 !important;
  }

  .ql-snow .ql-tooltip[data-mode=link]::before {
    content: "输入链接:" !important;
  }

  .ql-snow .ql-tooltip[data-mode=formula]::before {
    content: "输入公式:" !important;
  }

  .ql-snow .ql-tooltip[data-mode=video]::before {
    content: "输入视频:" !important;
  }

  .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
    border-right: 0px;
    content: '确定' !important;
    padding-right: 0px;
  }

  button.ql-header[value="3"]::before {
    content: "H3";
    font-size: 18px;
    font-weight: bold;
    color: #6e6b6b;
  }

  button.ql-header[value="4"]::before {
    content: "H4";
    font-size: 18px;
    font-weight: bold;
    color: #6e6b6b;
  }

  button.ql-header[value="5"]::before {
    content: "H5";
    font-size: 18px;
    font-weight: bold;
    color: #6e6b6b;
  }


  button.ql-header[value="6"]::before {
    content: "H6";
    font-size: 18px;
    font-weight: bold;
    color: #6e6b6b;
  }


  button.ql-header[value="3"],
  button.ql-header[value="4"],
  button.ql-header[value="5"],
  button.ql-header[value="6"] {
    margin-top: 2px;
  }

  #vueEditor {
    /* margin-top: -155px; */
    width: 100%;
    /* height: calc(100vh - 160px); */
  }

  .article-info .title input {
    font-weight: bold;
  }

  .article-info .el-input--suffix .el-input__inner {
    border: 0px !important;
  }

  .article-info .el-input__inner {
    border: 0px !important;
  }

  .ql-editor {
    z-index: 1;
    padding-top: 80px !important;
  }

  .article-form .ld-image .item-hover {
    zoom: 1.2;
  }

  .article-info .image-conver-div {
    margin-top: -30px;
  }

  .article-info .image-conver {
    z-index: 2;
    position: sticky;
    zoom: 0.75;
  }


  .ql-save-article,
  .ql-reset-article,
  .ql-three-file-image-editor {
    width: auto !important;
  }

  .ql-save-article-button,
  .ql-reset-article-button,
  #ql-three-file-image-editor {
    padding: 8px 15px;
    border-radius: 2px;
    font-family: element-icons !important;
    margin-top: -8px;
  }

  .ql-save-article-button {
    background: #F56C6C;
    color: white;
    width: 100px;
  }

  .ql-save-article-button:hover {
    background: #f78989;
  }

  .ql-save-article-button::before {
    content: '\E7AD';
    font-family: element-icons !important;
  }

  .ql-reset-article-button {
    background: #409EFF;
    border: 1px solid #409EFF;
    color: #fff;
  }

  .ql-reset-article-button:hover {
    color: #fff;
    background: #3a8ee6;
    border-color: #3a8ee6;
  }

  .ql-reset-article-button::before {
    content: "\E7B8";
    font-family: element-icons !important;
  }

  #ql-three-file-image-editor {
    background: #E6A23C;
    border: 1px solid #E6A23C;
    color: #fff;
  }

  #ql-three-file-image-editor a {
    color: white
  }

  #ql-three-file-image-editor:hover {
    background: #cf9236;
  }

  #ql-three-file-image-editor::before {
    content: "\E75F";
    font-family: element-icons !important;
  }

  .article_editor .layout-dynamic-form,
  .article_editor .el-form>.a-i-c,
  .article_editor .el-form-item.position-relative.cols_1,
  .article_editor .el-form-item.position-relative.cols_1>div,
  .article_editor .el-form-item.position-relative.cols_1>div>div.item,
  .article_editor .el-form-item.position-relative.cols_1>div>div.item>.box-b.over-h.el-input--suffix {
    height: 100%;
    margin-bottom: 0px !important;
    padding-bottom: 0px !important;
  }

  .editor-content {
    overflow-y: hidden;
  }

  .ql-picker-options {
    z-index: 3 !important;
  }


  .ql-editor img {
    width: 100%;
  }
</style>
