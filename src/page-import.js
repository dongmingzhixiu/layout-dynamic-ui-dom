import foot from '@/components/foot.vue'
import showImage from '@/components/show-image.vue'
import workList from '@/pages/work/work-list.vue'
import normal from '@/pages/window/normal.vue'
import normalEditor from '@/pages/window/normal-editor.vue'
import articleTree from '@/pages/window/pages/article-tree.vue'
import articleEditor from '@/pages/window/pages/article-editor.vue'
import eatList from '@/pages/window/pages/eat-list.vue'
import chart from '@/pages/window/pages/chart.vue'
import cardScanner from '@/pages/window/pages/card-scanner.vue'
import classScanner from '@/pages/window/pages/class-scanner.vue'
import inSchoolEditor from '@/pages/window/pages/in-school-editor.vue'






const install = (Vue, opts = {}) => {

	Vue.component('foot', foot);
	Vue.component('show-image', showImage);
	Vue.component('work-list', workList);
	Vue.component('normal', normal);
	Vue.component('normal-editor', normalEditor);
	Vue.component('article-tree', articleTree);
	Vue.component('article-editor', articleEditor);
	Vue.component('eat-list', eatList);
	Vue.component('chart', chart);
	Vue.component('card-scanner', cardScanner);
	Vue.component('class-scanner', classScanner);
	Vue.component('in-school-editor', inSchoolEditor);



}
export default {
	install
}
