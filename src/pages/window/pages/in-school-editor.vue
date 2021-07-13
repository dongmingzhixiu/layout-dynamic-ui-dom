<template>
	<div class="box-b w h over-a-y in-school-editor">

		<ld-doc :doc="doc" :open-hash="true">
			<!-- 幼儿信息 -->
			<template v-slot:babyinfo="e">
				<el-card>
					<div class="f-b box-b">
						<div class="f-s-w">
							<div v-if="forms" class="p10 f-s w4 h-40 box-b a-i-c"
								v-for="(key,i) in Object.keys(babyObject)" :key="i" style="flex-grow: 2;">
								<div class="w-120 t-r p-r5 c8 f-n-c-w">{{babyObject[key]}}</div>
								<div class="fs-w-b">{{format(key,forms[key])}}</div>
							</div>
						</div>
						<div class="f-n-c-w" style="height:195px;width: 130px;">
							<el-image :preview-src-list="[getImagePath(forms['photo'])]" class="w h" :src="getImagePath(forms['photo'])">
							</el-image>
						</div>
					</div>
				</el-card>
			</template>


			<!-- 父亲信息 -->
			<template v-slot:fatherinfo="e">
				<el-card>
					<div class="f-s-w">
						<div v-if="forms" class="p10 f-s w4 h-40 box-b a-i-c"
							v-for="(key,i) in Object.keys(fatherObject)" :key="i" style="flex-grow: 2;">
							<div class="w-120 t-r p-r5 c8 f-n-c-w">{{fatherObject[key]}}</div>
							<div class="fs-w-b">{{format(key,forms[key])}}</div>
						</div>
					</div>
				</el-card>
			</template>


			<!-- 母亲信息 -->
			<template v-slot:matherinfo="e">
				<el-card>
					<div class="f-s-w">
						<div v-if="forms" class="p10 f-s w4 h-40 box-b a-i-c"
							v-for="(key,i) in Object.keys(matherObject)" :key="i" style="flex-grow: 2;">
							<div class="w-120 t-r p-r5 c8 f-n-c-w">{{matherObject[key]}}</div>
							<div class="fs-w-b">{{format(key,forms[key])}}</div>
						</div>
					</div>
				</el-card>
			</template>


			<!-- 幼儿出生医学证明 -->
			<template v-slot:medicalinfo="e">
				<el-card>
					<el-image :preview-src-list="[getImagePath(forms['medical'])]" class="w h" :src="getImagePath(forms['medical'])">
					</el-image>
				</el-card>
			</template>

			<!-- 幼儿家庭户口本信息 -->
			<template v-slot:hkbinfo="e">
				<div class="f-s-w w box-b">
					<el-card class="h box-b p-b10" style="width: calc(50% - 0px);height: 380px;" v-for="i in 4"
						:key="i">
						<el-image :preview-src-list="[getImagePath(forms[`h${i}`])]" class="h w" :src="getImagePath(forms[`h${i}`])"></el-image>
						<div class="t-c">{{keyObject[`h${i}`]}}</div>
					</el-card>
				</div>
			</template>

			<!-- 房产信息 -->
			<template v-slot:fcinfo="e">
				<el-card>
					<div class="f-b">
						<div class="p10 f-s w4 h-40 box-b a-i-c" style="flex-grow: 2;">
							<div class="w-140 t-r p-r5 c8 f-n-c-w">房产类型</div>
							<div class="fs-w-b">{{format('ftype',forms['ftype'])}}</div>
						</div>
						<div v-if="forms['ftype']!='2'" class="p10 f-s w4 h-40 box-b a-i-c" style="flex-grow: 2;">
							<div class="w-140 t-r p-r5 c8 f-n-c-w">{{forms['ftype']=='0'?'房产证编码':'购房合同编码'}}</div>
							<div class="fs-w-b">{{format('fcode',forms['fcode'])}}</div>
						</div>
					</div>
					<div class="f-b bor-ef m-b10">
						<div v-if="forms['ftype']=='0'" class="h box-b p-b10 w">
							<el-image :preview-src-list="[getImagePath(forms['img1'])]" class="h w" :src="getImagePath(forms['img1'])"></el-image>
							<div class="t-c">{{keyObject['img1']}}</div>
						</div>
						<div v-if="forms['ftype']=='1'" style="width: calc(50% - 0px);height: 600px" v-for="i in 2"
							:key="i">
							<el-image class="h w" :preview-src-list="[getImagePath(forms[`img${i+1}`])]" :src="getImagePath(forms[`img${i+1}`])">
							</el-image>
							<div class="t-c">{{keyObject[`img${i+1}`]}}</div>
						</div>
						<div v-if="forms['ftype']=='2'" style="width: calc(50% - 0px);height: 600px" v-for="i in 3"
							:key="i">
							<el-image :preview-src-list="[getImagePath(forms[`img${i+2}`])]" class="h w" :src="getImagePath(forms[`img${i+2}`])">
							</el-image>
							<div class="t-c">{{keyObject[`img${i+2}`]}}</div>
						</div>
					</div>

				</el-card>
			</template>

			<!-- 体检信息 -->
			<template v-slot:tjinfo="e">
				<el-card>
					<el-image :preview-src-list="[getImagePath(forms['tj'])]" class="w h" :src="getImagePath(forms['tj'])">
					</el-image>
				</el-card>
			</template>

			<!-- 预防接种 -->
			<template v-slot:yfjzinfo="e">
				<el-card>
					<el-image :preview-src-list="[getImagePath(forms['yf'])]" class="w h" :src="getImagePath(forms['yf'])">
					</el-image>
				</el-card>
			</template>

			<!-- 审核结果 -->
			<template v-slot:shyjinfo="e">
				<el-card>
					<ld-forms ref="editorForms" :form="editorForms" :layout="querys['fres']['slotPageLayoutForm']"
						:auto-save-api="autoSaveApi" :editor-forms-init-api="editorFormsInitApis">
						<template v-if="buttons&&buttons.length>0" v-slot:buttons="e">
							<div class="f-b w a-i-c p10 box-b" :style="buttonStyle">
								<el-checkbox v-model="close">保存后关闭该页面</el-checkbox>
								<div style="z-index: 999;">
									<el-button class="m-l10" v-for="(item,i) in buttons" :key="i"
										:type="item['type']||''" :icon="item['icon']||''"
										@click="clickMethod(item['method'],null)">
										{{item['label']}}
									</el-button>
								</div>
							</div>
						</template>
					</ld-forms>
				</el-card>
			</template>

		</ld-doc>




	</div>
</template>

<script>
	import res from '@/pages/window/layout/article-men-tree.js';
	import {
		VueEditor
	} from "vue2-editor";
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
		watch: {
			query(news) {
				this.getData(news);
			}
		},
		data() {
			return {
				editorSaveBefore: null,
				autoSaveApi: {},
				editorFormsInitApis: {},
				close: true,
				buttonStyle: {},
				buttons: [],
				editorForms: {},
				querys: {},
				forms: {},
				doc: [{
						title: '幼儿入园审核',
						h1: '幼儿基本信息',
						slot: 'babyinfo'
					},
					{
						h1: '父亲基本信息',
						slot: 'fatherinfo'
					},
					{
						h1: '母亲基本信息',
						slot: 'matherinfo'
					},
					{
						h1: '幼儿出生医学证明',
						slot: 'medicalinfo'
					},
					{
						h1: '幼儿家庭户口本信息',
						slot: 'hkbinfo'
					},
					{
						h1: '房产信息',
						slot: 'fcinfo'
					},
					{
						h1: '幼儿体检报告',
						slot: 'tjinfo'
					},
					{
						h1: '儿童预防接种情况审核报告',
						slot: 'yfjzinfo'
					},
					{
						h1: '审核意见',
						slot: 'shyjinfo'
					},


				],
				babyObject: {
					names: '姓名',
					sex: '性别',
					birthday: '出生日期',
					age: '年龄',
					idcard: '身份证号',
					toilet: '是否体检',
					toban: '是否托班',
					school: '所选园所',
					census: '户口性质',
					address: '家庭住址',
				},
				fatherObject: {
					fname: '父亲名称',
					fidcard: '父亲身份证号',
					fphone: '父亲手机号码',
					funit: '父亲工作单位',
				},
				matherObject: {
					mname: '母亲姓名',
					midcard: '母亲身份证号',
					mphone: '母亲电话',
					munit: '母亲工作单位',
				},

				keyObject: {
					h1: '户主页',
					h2: '父亲页',
					h3: '母亲页',
					h4: '幼儿页',
					yf: '儿童预防接种该报告',
					tj: '体检',
					ftype: '房产类型',
					fcode: '房产证或购房合同编码',
					img1: '房产证',
					img2: '购房合同首页',
					img3: '购房合同内容页面',
					img4: '征收补偿协议',
					img5: '安置房便函',
					img6: '安置房购房合同 ',
				},
				formatList: {
					sex: (val) => {
						return val == '1' ? '男' : '女'
					},
					toilet: (val) => {
						return val == '1' ? '是' : '否'
					},
					toban: (val) => {
						return val == '1' ? '托班' : '简班'
					},
					census: (val) => {
						return val == '1' ? '城镇户口' : '农村户口'
					},
					age: (val) => {
						if (!val) {
							return '未填写出生日期';
						}
						let month = this.$ld.util.getMonthDiff(new Date(), val);
						let _y = parseInt(month / 12);
						let _m = month % 12;
						return `${_y}岁${_m}${_m==0?'':'月'}`
					},
					ftype: (val) => {
						debugger
						val = val || 0;
						return {
							0: '房产证',
							1: '购房合同',
							2: '棚户安置证明'
						} [val];
					}
				}
			}
		},
		methods: {
			getImagePath(path){
				return this.$ld.getImagePath(path);
			},
			clickMethod(type, e) {
				switch (type) {
					case 'save':
						this.saveData();
						break;
					case 'reset':
						this.editorForms = {
							audio: '1'
						};
						this.$refs.editorForms.formReset();
						break;
					case 'cancel':
						this.$emit("getslotdata", {
							'function': (that) => {
								that.closeThisTab(true);
							},
						});
						break;
					default:
						console.error(type + '未定义')
						break;
				}
			},
			getData(news) {
				if (news && Object.keys(news).length > 0) {
					this.querys = news;
					this.forms = this.query['form'];
					this.forms['age'] = this.forms['birthday'];
					this.buttons = [].concat(this.querys['fres']['button'] || []).concat(this.querys['dres']['button']);
					this.forms['id'] = this.querys['form']['id'];
					this.buttonStyle = Object.assign({}, this.querys['fres']['buttonStyle'] || {}, this.querys['dres'][
						'buttonStyle'
					] || {});
					this.editorSaveBefore = this.querys['fres']['editorSaveBefore'] || this.querys['dres'][
						'editorSaveBefore'
					];
					this.autoSaveApi = this.querys['fres']['autoSaveApi'] || this.querys['dres']['autoSaveApi'];
					this.editorFormsInitApis = this.querys['fres']['editorFormsInitApis'] || this.querys['dres'][
						'editorFormsInitApis'
					];
				}
			},
			saveData() {
				if (typeof this.editorSaveBefore == 'function') {
					let flg = this.editorSaveBefore();
					if (typeof flg == 'boolean' && flg == false) {
						return;
					}
				}
				this.$refs.editorForms.formSave(res => {
					if (/^<!DOCTYPE html>/.test(res)) {
						this.$message.error('未知错误，请稍后再试！');
						return;
					}
					if (res.code == 0) {
						this.$message.success("保存成功！");
						//TODO 刷新
						if (this.close) {
							//关闭当前窗口，并且刷新父窗口
							this.$emit("getslotdata", {
								'function': (that) => {
									that.closeThisTab(false,true);
								},
							});
						}
						return;
					}
					this.$message.error(res.msg);
				}, checkError => {

				});
			},
			format(key, val) {
				if (Object.keys(this.formatList).includes(key)) {
					return this.formatList[key](val);
				}
				return val;
			},
		},
		created() {
			this.getData(this.query);
			try {
				this.$notify.closeAll()
				this.$notify({
					title: '提示',
					message: '单击可以预览图片，可以放大、缩小和旋转图片!',
					type: 'info',
					duration: 3000,
					offset:105,
				});
			} catch (e) {
				//TODO handle the exception
			}
		}
	}
</script>

<style>
	.in-school-editor .ld-doc .m-r10.over-a-y.h.p10.box-b.f-n-c-w {
		width: 300px !important;
	}

	.in-school-editor .ld-doc h1>a {
		display: block;
		background-color: rgba(64, 158, 255, 0.3);
		border-left: 10px solid rgba(64, 158, 255);
		box-sizing: border-box;
		font-size: 18px;
		padding: 10px;
		opacity: 0.8;
	}

	.in-school-editor h1 a[name^="title"] {
		width: 100%;
		font-size: 24px;
		text-align: center;
		display: block;
		color: rgba(0, 0, 0, 0.5);
		background-color: transparent;
		border: 0px;
	}
</style>
