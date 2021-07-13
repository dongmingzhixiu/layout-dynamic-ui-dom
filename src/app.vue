<template>
	<div id="app" class="w h-vh box-b">
		<ld-page-loading :loading="loading">
			<router-view class="wh box-b over-a-y" />
		</ld-page-loading>
	</div>
</template>

<script>
	export default {
		name: 'app',
		data() {
			return {
				loading: true,
			}
		},
		beforeCreate() {



			// 开发阶段设置成 mockjs模式,如果为后端换进，则设为false或者注释，并设置下方的请求地址
			this.$ld.requestSetting.config.isMock = true;


			//请求地址，在this.$ld.requestSetting.config.isMock = false;时生效
			const SERVER_PATH = this.$ld.requestSetting.config.isMock ? '' : process.env.NODE_ENV == 'development' ?
				'http://localhost:8855/yyb' : '.';
			this.$ld.requestSetting.serverPath.set(SERVER_PATH);

			//配置全局参数
			this.$ld.component.loadingPage = {
				loadingType: 'line-scale'
			}
			this.$ld.requestSetting.init = (axios) => {
				axios.defaults.withCredentials = true;
				return axios;
			}

			this.$ld.requestSetting.config.timeout = 10000;
			let that = this;
			const excludePath = [
				`${SERVER_PATH}/login/teacher`,
			]


			//重写请求拦截器
			this.$ld.requestSetting.interceptor = {
				/**
				 * 请求前拦截
				 */
				before: (event) => {
					if (excludePath.includes(event.options.url)) {
						return true;
					}
					//获取用户信息，判断用户是否登陆
					if (!that.loginCheck(false)) {
						return false;
					}
					if (event.options.params && Object.keys(event.options.params).includes('isPageHelper')) {
						delete event.options.params['isPageHelper']
					}

					/**
					 * 这里使用 Promise.resolve 返回结果，结果为 true或false
					 * 如： Promise.resolve(true);  //继续执行请求方法
					 *      Promise.resolve(false); //不在执行请求方法
					 */
					if (['get'].includes(event.options.method.toLocaleLowerCase())) {
						return true;
					}
					if (event.options.method.toLocaleLowerCase() == 'post') {
						let key =
						'data'; // event.options.method.toLocaleLowerCase() == 'post' ? 'data' : 'params';
						try {
							let user = that.$ld.util.cookie.get("user");
							user = typeof user == "string" ? JSON.parse(user) : user;
							event.options[key] = event.options[key] || {};
							event.options[key]['organizationId'] = event.options[key]['organizationId'] || user[
								'organizationId'];
							event.options[key]['createdBy'] = event.options[key]['createdBy'] || user['id'];
							event.options[key]['createdTime'] = new Date(event.options[key]['createdTime'] || that
								.$ld.util
								.getDateTime());
							event.options[key]['updatedBy'] = user['id'];
							event.options[key]['updatedTime'] = new Date(that.$ld.util.getDateTime());
						} catch (e) {}
						return true;
					}
					if (event.options.method.toLocaleLowerCase() == 'delete') {
						event.options['params'] = event.options['params'] || event.options['data'];
						let msg = event.options.method.toLocaleLowerCase() == 'delete' ? '确定删除数据吗，删除后不可恢复' :
							'确定保存数据吗';
						return that.$confirm(msg, '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: event.options.method.toLocaleLowerCase() == 'delete' ? 'error' :
								'warning'
						}).then(() => {
							//使用 true 和false ,控制是否继续执行请求方法
							return Promise.resolve(true);
						}).catch(() => {
							//使用 true 和false ,控制是否继续执行请求方法
							return Promise.resolve(false);
						});
					}
				},
				/**
				 * 请求后拦截装饰
				 */
				after: (event) => {
					if (event.data.code == -1 && event.data['data'] && event.data['data'] == 'noLogin') {
						that.removeUserCookie();
						that.$util.goPageByRouter(that, '/login');
						return;
					}
					return event.data;
					/**
					 * 这里使用 Promise.resolve 返回结果，结果为装饰后的数据
					 * 如： Promise.resolve(event);  //为程序返回最终装饰后的数据
					 */
					// return Promise.resolve(event.data);
				},
				timeout: (error) => {
					that.$message.error("服务器忙碌，请稍后再试！")

				},
				error: (err, options) => {
					if (err.response.status == 401) {
						that.removeUserCookie();
						that.$util.goPageByRouter(that, '/login');
						return;
					}
					console.log(err.message);
					if (err.message == "Network Error") {
						try {
							that.$message.closeAll();
							that.$message({
								showClose: true,
								message: '服务器断开链接，请求失败，稍后再试...',
								type: 'error',
								duration: 5000,
							});
						} catch (e) {
							console.log(e);
						}
					}

				}
			}

			//设置图片地址
			this.$ld.getImagePath = (image) => {
				if (!image) return image;
				if (image.indexOf("http://") == 0 || image.indexOf("https://") == 0 ||
					image.indexOf("/static/") == 0 || image.indexOf("static/") == 0
				) {
					return image;
				}
				let src = this.$ld.requestSetting.serverPath.get() + "/" + image;
				src = src.replace(/^[.][/][/]/, './');
				return src;
			}
		},
		methods: {
			removeUserCookie() {
				let value = "";
				let expiredays = -1;
				let c_name = 'user';
				var exdate = new Date()
				exdate.setDate(exdate.getDate() + expiredays)
				document.cookie = c_name + "=" + (value ? escape(value) : '') +
					((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
			},
			loginCheck(toHome) {
				this.loading = false;
				toHome = typeof toHome == 'undefined' ? true : toHome;
				let user = this.$ld.util.cookie.get('user') || null;
				if (!user) {
					this.$ld.login = false;
					this.$util.goPageByRouter(this, '/login');
					return false;
				}
				if (toHome) {
					this.$util.goPageByRouter(this, '/home');
				}
				return true;
			},
		},
		created() {
			this.loginCheck(true);
		}
	}
</script>

<style>

</style>
