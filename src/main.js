// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import app from './app'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import layoutDynamicUI from 'layout-dynamic-ui';
import 'layout-dynamic-ui/lib/index.css';

Vue.use(ElementUI);

Vue.use(layoutDynamicUI);

import pageImport from './page-import.js';

Vue.use(pageImport);

import util from '@/util/util.js';
Vue.prototype.$util=util;

import './mock-file.js';

/**
 * 富文本编辑器
 */
import Vue2Editor from "vue2-editor";
Vue.use(Vue2Editor);



Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	components: {
		app
	},
	template: '<app/>'
})
