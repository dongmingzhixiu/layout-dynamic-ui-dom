<template>
  <ld-page-loading :loading="loading">
    <ld-frame ref="frame" class="h-vh w frame" :menu-tree="menuTree" :left-head-info="leftHeadInfo" @openTabs="open"
      @closeTabs="close" @refreshTabs="refresh" :pass-event-up="false" @toolClick="toolClick"
      :headTool="['slot_user','full screen','exit']">
      <template v-slot:logo="e">
        <div class="logo f-c a-i-c b-i2" style="height: 60px;">
          <img class="w-40 h-40 b-t m4 m-l0" :src="leftHeadInfo.image"
            :title="`${leftHeadInfo.label} \r\n ${leftHeadInfo.text}`"></img>
          <div v-if="e.item.collapse">
            <div class="fs14 c-f fs-w-b c-f" style="text-shadow: 1px 1px #f3f3f373;color: #fefefe;">
              {{leftHeadInfo.label}}
            </div>
            <div class="fs f-s a-i-c c-f m-t2">{{leftHeadInfo.text}}</div>
          </div>
        </div>
      </template>
      <template v-slot:slot_user="{ item }">
        <div v-if="user" class="f-c a-i-c m-r6">
          <div class="w">
            <div class="f-c a-i-c">
              <div class="f-c a-i-c" :class="{'w-40 h-40':item.fullScreen,'w-30 h-30':!item.fullScreen}">
                <show-image fit="cover" m-class="r w h" :e-class="item.fullScreen?`w-40 h-40 b-i1`:`w-30 h-30 b-i1`" :src="getUserImage()"></show-image>
                <!-- <el-image fit="cover" class="r w h" :src="getUserImage()">
                  <div slot="error" class="b-i1" :class="{'w-40 h-40':item.fullScreen,'w-30 h-30':!item.fullScreen}">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image> -->
              </div>
            </div>
            <div class="fs c8" v-if="item.fullScreen">{{user.names}}</div>
          </div>
        </div>
      </template>
    </ld-frame>
  </ld-page-loading>
</template>

<script>
  import layout from './pages/layout.js';
  export default {
    name: 'home',
    data() {
      return {
        leftHeadInfo: {
           image: require('@/assets/logo.jpg'),
          label: 'xxx管理系统',
          text: '安全放心的服务'
        },
        menuTree: layout.menuTree,
        loading: true,
        user: null,
      }
    },

    methods: {
      /**
       * 获取用户头像
       */
      getUserImage() {
        if (!this.user) {
          this.user = this.$ld.util.cookie.get('user') || null;
          if (!this.user) {
            this.loginCheck();
          }
        }
        return this.user.photo ? this.$ld.getImagePath(this.user.photo) : '';
      },
      /**
       * 打开tab
       * @param {Object} e
       */
      open(e) {
        this.$refs.frame.menuClick(e);
      },
      /**
       * 关闭tab
       * @param {Object} e
       */
      close(item) {
        if (typeof item['refresh'] === 'boolean' && item['refresh'] == true) {
          this.refresh({
            prop: item['refreshProp']
          });
        }
        if (typeof item['showConfirm'] === 'boolean' && item['showConfirm'] == false) {
          this.$refs.frame.closeTabPageByProp(item['prop']);
          return;
        }
        this.$confirm(`确定关闭【${item['label']}】窗口吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$refs.frame.closeTabPageByProp(item['prop']);
        }).catch(() => {});
        return;
      },
      /**
       * 刷新页面
       * @param {Object} item
       */
      refresh(item) {
        this.$refs.frame.refreshTabByProp(item['prop']);
      },
      loginCheck() {
        let user = this.$ld.util.cookie.get('user') || null;
        if (!user) {
          setTimeout(() => {
            this.loading = false;
          }, 1000);
          this.$util.goPageByRouter(this, '/login');
          return false;
        }
        this.user = typeof user == 'string' ? JSON.parse(user) : user;
        this.user = typeof user == 'string' ? JSON.parse(user) : user;
        this.loading = false;
        return true;
      },
      /**
       * tool按钮事件
       */
      toolClick(e) {
        if (e['key'] == 'exit') {
          this.$confirm('确定退出系统吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$ld.util.cookie.remove('user');
            this.$util.goPageByRouter(this, "/login");
            this.$ld.request('/login/teacherLoginOut', 'post').then(res => {})
          }).catch(() => {});
        }
      }
    },
    created() {
      this.loginCheck();
    }
  }
</script>

<style lang="scss">
  .doc {
    box-sizing: border-box;
    padding: 20px;
    background: white;

    h1 {
      color: #1f2f3d;
      font-size: 28px;
      font-weight: 400;
      line-height: 40px;
    }

    h2 {
      font-weight: 400;
      font-size: 22px;
      color: #1f2f3d;
      line-height: 30px;
    }

    h3 {
      font-weight: 400;
      font-size: 20px;
      color: #1f2f3d;
    }

    p {
      font-size: 14px;
      color: #5e6d82;
      line-height: 1.5em;
    }

    .code[lang=shell] {
      background: rgba(255, 253, 248, 1.0);
      padding: 10px;
      margin-top: 5px;
      line-height: 40px;
      border: 1px solid #ececec;
    }

    .el-card__body {
      padding: 0 !important;
      height: 100%;
    }
  }

  .m-r10.box-shadow.over-a-y.h.p10.box-b {
    max-width: 300px !important;
    min-width: 300px !important;
  }

  .frame .w-30 {
    width: 30px;
  }

  .frame .h-30 {
    height: 30px;
  }


</style>

