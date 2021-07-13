<template>
	<div class="box-b h eat-list-from">
		<div class="w h">
			<!-- 页面内容 -->

			<div class="f-s">
				<span class="a-i-c f-s"><span class="c-d">*</span>选择周</span>
				<el-date-picker v-model="times" type="week" format="yyyy 第 WW 周" placeholder="选择周" class="m-l10" style="flex-grow: 2;">
				</el-date-picker>
			</div>
			<table class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition w"
			 border="0" cellspacing="1" cellpadding="0">
				<tr class="el-table__row w h-60 b-i1 box-b" style="padding: 0px!important;">
					<td class="box-b" style="padding: 0px!important;width: 60px!important;">
						<div class="w position-relative  p0">
							<div class="w t-r">
								星期
							</div>
							<div class="bor-i o2" style="transform: rotate(35deg);width: 100px;position: absolute;left: -13px;"></div>
							<div class="w t-l">
								餐点
							</div>
						</div>
					</td>
					<td>星期一</td>
					<td>星期二</td>
					<td>星期三</td>
					<td>星期四</td>
					<td>星期五</td>
					<td>星期六</td>
					<td>星期日</td>
				</tr>
				<tr class="el-table__row w h-100" v-for="i in 4" :key="i" style="padding: 0px!important;">
					<td>{{columnTitle[i]}}</td>
					<td v-for="c in 7" :key="c" style="padding: 0px!important;">
						<el-input v-model="forms[c-1][column[i-1]]" type="textarea" class="w h" rows="4" />
					</td>
				</tr>
			</table>
			<div>
				<div class="f-b w a-i-c m-t10">
					<el-checkbox v-model="close">保存后关闭该页面</el-checkbox>
					<div style="z-index: 999;">
						<el-button :loading="item['method']=='save'&&loading" class="m-l10" v-for="(item,i) in buttons" :key="i" :type="item['type']||''"
						 :icon="item['icon']||''" @click="clickMethod(item['method'],null)">
							{{item['label']}}
						</el-button>
					</div>
				</div>

			</div>
		</div>
	</div>
</template>

<script>
	const weekName = ['一', '二', '三', '四', '五', '六', '天'];
	export default {
		name: 'eat-list',
		props: {
			query: {
				type: Object,
				default: () => {
					return {}
				},
			}
		},
		watch: {
			times(news) {
				if (news) {
					this.week = this.$ld.util.getYearWeek(news);
				}
			}
		},
		data() {
			return {
				loading: false,
				close: true,
				buttons: [],
				week: '',
				times: '',
				columnTitle: {
					1: '早餐',
					2: '午餐',
					3: '午点',
					4: '晚餐'
				},
				forms: [],
				column: ['zaoc', 'wuc', 'wud', 'wanc']
			};
		},
		methods: {
			clickMethod(type, e) {
				switch (type) {
					case 'save':
						this.saveEatListDetial();
						break;
					case 'reset':
						this.resetData();
						break;
					case 'cancel':
						this.closeThisTab();
						break;
					default:
						break;
				}
			},
			closeThisTab() {
				this.$emit("getslotdata", {
					'function': (that) => {
						that.closeThisTab(false, true);
					}
				});
			},
			//初始化数据
			initEatList() {
				this.buttons = this.query['dres'].button;
				weekName.map(item => {
					let _weekName = `星期${item}`;
					let _item = {
						weekName: _weekName,
						week: this.week,
						times: this.times,
						listId: '',
						zaoc: '',
						wuc: '',
						wud: '',
						wanc: '',
						id: ''
					};
					let _forms = this.query['form'];
					if (this.query['editorId']) {
						//编辑
						let li = _forms.filter(_li => _li['weekName'] == _weekName);
						if (li && li.length > 0) {
							let _li = li[0];
							['zaoc', 'wuc', 'wud', 'wanc', 'listId', 'week', 'weekName', 'id'].map(key => {
								_item[key] = _li[key];
							});
							this.week = _li['week'];
							this.times = _li['times'];
						}
					}
					this.$set(this.forms, this.forms.length, _item);
				});
			},

			resetData() {
				this.$confirm("重置后讲清楚所有已填数据，确定重置吗？", "提示", {
					type: 'warning'
				}).then(() => {
					this.initEatList();
				});
			},
			saveEatListDetial() {
				if (!this.week) {
					this.$message.error('时间不能为空！');
					return false;
				}
				let listId = this.$ld.util.randomChar(6);
				this.week = this.$ld.util.getYearWeek(this.times);
				let data = this.forms.map(item => {
					item['times'] = this.times;
					item['week'] = this.week;
					item['listId'] = item['listId'] || listId;
					return item;
				});
				this.$ld.request("/eat/save", 'post', data).then(res => {
					if (res.code == 0) {
						this.$message.success("保存详情成功！");
						if (this.close) {
							this.closeThisTab();
						}
						return;
					}
					this.$message.error(res.msg || "保存失败，请稍后再试！");
				})
				return true;
			},
		},
		created() {
			this.initEatList();
		}
	}
</script>

<style>
	.eat-list-from table tr th,
	.eat-list-from table tr td {
		width: calc(100% / 8);
		text-align: center !important;
	}

	table {}
</style>
