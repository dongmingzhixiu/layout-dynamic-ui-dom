<template>
	<div class="box-b h">
		<div class="w h">
			<!-- 页面内容 -->
			二级菜单页面

		</div>
	</div>
</template>

<script>
	export default {
		name: 'scnnner',
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
				autoLoadDataApi: {},
				list: [],
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
						that.clickMethod(!type?'add':'editor', {
							id: type ? this.list[0]['id'] : ''
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
