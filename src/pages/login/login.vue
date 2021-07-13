<template>
	<ld-page-loading :loading="loginLoading" loading-text="登陆中,请稍后" background="rgba(255,255,255,.8)">
		<div class="w h over-h"
			:style="{'background-image':`url(./../static/bg_img.png)`}">
			<div class="p2 box-b b-t r5 box-shadow f-c a-i-c h">
				<div class="w h b-f r5 p2 box-b box-shadow" style="width: 400px;height:400px">
					<div class="w h b-d2 r5 p10 box-b">
						<div class="f-c a-i-c bor-ef bor-ltr0">
							<img class="w-60 h-60" src="./../../assets/logo.jpg" />
							<div class="fs40 c8 t-c p-b5 m-b10 m-t10 wc-d" style=" text-shadow: -2px 1px black;">幼育宝管理系统
							</div>
						</div>
						<ld-forms ref="login" class="m10" :form="forms" :layout="layout">
							<template v-slot:buttons="e">
								<div class="w f-s m-t10">
									<el-button type="danger" :loading="loginLoading" style="flex-grow: 2;"
										@click="login">登录
									</el-button>
									<el-button>取消</el-button>
								</div>
							</template>
						</ld-forms>
						<div class="c6 t-r">本系统推荐使用<span class="c-p cur-p"><a
									href="http://ki.orange-info.cn:80/download/apk/ChromeStandaloneSetup64.exe">Google
									Chrome</a></span>浏览器</div>
					</div>
				</div>
			</div>
		</div>
	</ld-page-loading>
</template>

<script>
	export default {
		name: 'login',
		data() {
			return {
				loginLoading: false,
				forms: {},
				layout: [{
						prop: 'phone',
						label: '',
						type: 'text',
						prepend: '<i class="el-icon-user"></i>',
						regex: /^1[0-9]{10}$/,
						placeholder: '请输入手机号码',
						require: true,
						msg: '以1开头的11为数字'
					},
					{
						prop: 'password',
						label: '',
						type: 'text',
						password: true,
						prepend: '<i class="el-icon-s-goods"></i>',
						regex: /^[^!@#$%&*\(\)'".,/]{6,12}$/,
						placeholder: '请输入账户密码！',
						require: true,
						msg: '无特殊符号的6-12位'
					}
				]
			}
		},
		methods: {
			login() {
				let res = this.$refs.login.checkForm();
				if (res['error'] === true) {
					this.$message.error(res['msg']);
					return;
				}
				this.loginLoading = true;
				this.$ld.postRequest("/login/teacher", this.forms).then(res => {
					this.loginLoading = false;
					if (res.code == -1) {
						this.$message.error(res.msg || "登陆失败，请稍后再试！");
						return;
					}
					console.log(res.data);
					this.$ld.util.cookie.set('user', JSON.stringify(res.data), 1);
					this.$message.success("登陆成功");
					this.$router.push({
						path: '/home'
					});
				})
			},
			loginCheck() {
				let user = this.$ld.util.cookie.get('user') || null;
				if (user) {
					this.$util.goPageByRouter(this, '/home');
					return;
				}
			},
		},
		created() {
			this.loginCheck();
			// this.$ld.requestSetting.serverPath.set('http://localhost:18085/yyb');
		}
	}
</script>

<style>
  /* .error-bor-d { */
    /* border:1px solid red; */
  /* } */
</style>
