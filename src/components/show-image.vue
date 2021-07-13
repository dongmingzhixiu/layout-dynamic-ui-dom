<template>
  <div class="w h b-t f-c">
    <el-image :preview-src-list="previewSrcLists" :fit="fit" :class="classes" :style="styles"
      :src="getImagePaths(srcs)">
      <div slot="error" :class="errorClasses" :style="errorStyles">
        <i class="el-icon-picture-outline fs30"></i>
      </div>
    </el-image>
  </div>
</template>

<script>
  export default {
    name: 'show-image',
    props: {
      showPreview: {
        type: Boolean,
        default: false
      },
      previewSrcList: {
        type: Array,
        default: () => {
          return []
        }
      },
      'mClass': {
        type: String,
        default: "w h"
      },
      'mStyle': {
        type: String,
        default: ""
      },
      eClass: {
        type: String,
        default: "w h"
      },
      eStyle: {
        type: String,
        default: ""
      },
      src: {
        type: [String, Number],
        default: ""
      },
      fit: {
        type: String,
        default: ""
      },
      getImagePath: {
        type: Function,
        default: null
      }
    },
    watch: {
      showPreview(news) {
        this.showPreviews = news;
        this.getImageInfo(this.src);
        this.previewSrcLists = this.previewSrcLists || [this.src];
      },
      previewSrcList(news) {
        this.previewSrcLists = news;
      },
      'mClass': (news) => {
        this.classes = news;
      },
      'mStyle': (news) => {
        this.styles = news;
      },
      src(news) {
        this.getImageInfo(news)
      },
      fit(news) {
        this.fits = news;
      },
      eClass(news) {
        this.errorClasses = news;
      },
      eStyle(news) {
        this.errorStyles = news;
      },
    },
    data() {
      return {
        rotate: '0',
        srcs: '',
        fits: this.fit,
        styles: this.mStyle,
        classes: this.mClass,
        errorStyles: this.eStyle,
        errorClasses: this.eClass,
        showPreviews: this.showPreview,
        previewSrcLists: this.previewSrcList
      };
    },
    methods: {
      getImageInfo(src) {
        if (!src) {
          return;
        }
        src=src+"";
        if (src.indexOf("?") > 0) {
          let temp = src.split('?');
          this.srcs = temp[0];
          this.rotate = temp[1].replace(/rotate=/g, '');
        } else {
          this.srcs = src;
          this.rotate = '0';
        }
        if (typeof this.styles == undefined) {
          this.styles = `transform: rotate(${this.rotate}deg);`
        }
        if (typeof this.styles == 'string') {
          this.styles += `;transform: rotate(${this.rotate}deg);`
        }
        if (typeof this.styles == 'object' && !Array.isArray(this.styles)) {
          this.styles['transform'] = `rotate(${this.rotate}deg)`
        }
      },
      getImagePaths(image) {
        if (typeof this.getImagePath == 'function') {
          return this.getImagePath(image);
        }
        if (typeof this.$ld.getImagePath == 'function') {
          return this.$ld.getImagePath(image);
        }
        throw new Error('没有传入`getImagePath`方法，也没有配置全局的`this.$ld.getImagePath`方法');
      }
    },
    created() {
      this.getImageInfo(this.src);
    }
  }
</script>

<style>
</style>
