<template>
	<div class="box-b p10 h" style="border-right: 1px solid #C0C4CC;">
		<!-- 页面内容 -->
		<ld-menu-tree v-if="tree&&tree.length>0" :unique-opened="true" :default-expand-all="false" class="w h" style="overflow: hidden auto;"
		 :tree="tree" @click="menuClick"></ld-menu-tree>
		<div v-else @click="initMenuTree" class="c8 h8 a-i-c f-c el-icon-re">数据获取失败,重新加载</div>
	</div>
</template>

<script>
	import res from '@/pages/window/layout/article-men-tree.js';
	export default {
		name: 'article-tree',
		data() {
			return {
				tree: [],
				reLoadCount: 0,
			};
		},
		methods: {
			menuClick(e) {
				this.$emit("leftcontrol", {
					key: 'autoLoadParam',
					value: {
						typeId: e['prop']
					},
					function: (that) => {
						that.clickMethod("search", null)
					}
				});
			},
			initMenuTree() {
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
						this.tree = arr;
					}).catch(err => {})
				}
			}
		},
		created() {
			this.initMenuTree();
			setTimeout(() => {
				if (!this.tree || this.tree.length <= 0) {
					this.initMenuTree();
				}
			}, 800);
		}

	}
</script>

<style>
</style>
