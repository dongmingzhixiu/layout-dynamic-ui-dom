<template>
	<div class="box-b h">
		<div class="w h">
			<!-- 页面内容 -->
			<h1>二级菜单页面</h1>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'class-scnnner',
		props:{
			query:{
				type:Object,
				default:()=>{
					return {};
				}
			}
		},
		data() {
			return {
				/**
				 * 获取布局信息
				 */
				forms: this.query["fres"].forms || this.query["dres"].forms,
				whereLayout: this.query["fres"].whereLayout || this.query["dres"].whereLayout,
				list: [],
				autoLoadDataApi: {},
			};
		},
		methods: {
			getImagePath(url) {
				return this.$ld.getImagePath(url);
			},
			init() {
				let autoLoadApi = this.query['fres'].autoLoadDataApi || this.query['dres'].autoLoadDataApi;
				this.autoLoadDataApi = autoLoadApi;
			},
			getScnnerList() {
				this.$ld.request(this.autoLoadDataApi['remotePath'], this.autoLoadDataApi['remoteMethodType'], this.autoLoadDataApi[
					'remoteParam']).then(
					res => {
						if (res.code == 0) {
							this.list = res.data;
						}
					})
			},

			reflush() {
				this.$emit("pagecontrol", {
					'function': (that) => {
						that.refreshTabs();
					}
				});
			},

			editor(type) {
				this.$emit("pagecontrol", {
					'function': (that) => {
						that.clickMethod(type?'editor':'add', {
							id: type?this.list[0]['id']:''
						});
					}
				});
			},

		},
		created() {
			this.init();
			this.getScnnerList();
		}
	}
</script>

<style>
</style>
