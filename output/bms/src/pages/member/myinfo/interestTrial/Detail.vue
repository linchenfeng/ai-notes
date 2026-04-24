<!--
 * @Author       : MingChun.Cheng
 * @Date         : 2023-09-07 14:20:29
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-03-04 15:54:34
 * @Description  : 预期利息预缴试算详情 /member/myinfo/interestTrial/detail/:refcode
-->
<template>
  <NavBar :show-icon="true" @on-click-right="doSendOverDueInfo" />
  <!-- 预期利息预缴试算详情-->
  <view class="interest-trial-detail detail-cell-group">
    <ty-info-card title="基本信息">
      <u-cell-group>
        <view class="container">
          <view class="item-title">
            <u-cell title="融资企业名称" :value="vm.self.orgname" :border="false" />
          </view>
          <view class="item-title">
            <u-cell title="业务产品" :value="getValueByKey(vm.self.bussType, 'businessProductType')" :border="false" />
          </view>
          <view class="item-title">
            <u-cell title="币种" :value="vm.self.ccyid === 'RMB' ? '人民币' : getValueByKey(vm.self.ccyid, 'ccyid')" :border="false" />
          </view>
          <view class="item-title">
            <u-cell title="融资笔数" :value="`${vm.self.financingNum}笔`" :border="false" />
          </view>
          <view class="item-title">
            <u-cell title="融资总金额(元)" :value="moneyFormat(vm.self.totalLoanAmt)" :border="false" />
          </view>
          <view class="item-title">
            <u-cell title="融资总余额(元)" :value="moneyFormat(vm.self.totalOtstAmt)" :border="false" />
          </view>
          <view class="item-title">
            <u-cell title="截至当日应付逾期利息总额(元)" :value="moneyFormat(vm.self.totalOverdueAmt)" :border="false" />
          </view>
          <view class="item-title">
            <u-cell title="截至当日尚欠逾期利息总额(元)" :value="moneyFormat(vm.self.totalOwePrepaidAmt)" :border="false" />
          </view>
          <view class="item-title">
            <u-cell title="已预缴逾期利息总额(元)" :value="moneyFormat(vm.self.totalPrepaidAmt)" :border="false" />
          </view>
        </view>
      </u-cell-group>
    </ty-info-card>
    <ty-info-card title="预缴信息" class="prepayment-info">
      <u-cell-group :border="false">
        <view class="trial-calculate-container">
          <view class="subsection-box">
            <u-subsection :list="list" :current="active" mode="subsection" active-color="#138bec" @change="sectionChange"></u-subsection>
          </view>

          <u-form label-width="45%">
            <view v-if="active === 0" class="trial-box">
              <u-form-item :label="`逾期利息试算天数`">
                <InputNumber
                  key="countDays"
                  v-model:number="vm.countDays"
                  :format-flag="false"
                  :point="0"
                  placeholder="请输入试算天数"
                  maxlength="16"
                ></InputNumber>
                <!-- <u-input v-model="vm.countDays" type="digit" placeholder="请输入逾期利息试算天数"></u-input> -->
                <template #right>
                  <u-button type="primary" :loading="loading" @click="doOverdueCount('3')">
                    <text class="iconfont icon-shisuanbaofei"></text>
                    <text class="button-text">试算</text>
                  </u-button>
                </template>
              </u-form-item>
            </view>
            <view v-else class="trial-box">
              <u-form-item :label="`请输入预缴金额`">
                <InputNumber key="adPrepaidAmt" v-model:number="vm.adPrepaidAmt" placeholder="请输入预缴金额" maxlength="16"></InputNumber>
                <template #right>
                  <u-button type="primary" @click="doOverdueCount('4')">
                    <text class="iconfont icon-shisuanbaofei"></text>
                    <text class="button-text">试算</text>
                  </u-button>
                </template>
              </u-form-item>
            </view>
            <view class="item-title orange-color">
              <u-cell title="到截止日需预缴逾期利息" :value="moneyFormat(vm.totalRequirePerAmt)" />
            </view>
          </u-form>
        </view>
      </u-cell-group>
    </ty-info-card>
    <ty-info-card title="融资信息" class="financing-info">
      <u-cell-group>
        <u-collapse v-model="activeNames">
          <view v-for="(item, index) in vm.self.fadlLoaInfoMVoList" :key="item.duebillnum">
            <u-collapse-item :title="`融资申请编号:${item.duebillnum}`" :name="`${index + 1}`" :border="false">
              <view class="container">
                <view class="item-title">
                  <u-cell title="融资到期日" :value="dateFormat(item.loanDueDate)" :border="false" />
                </view>
                <view class="item-title">
                  <u-cell title="融资余额(元)" :value="moneyFormat(item.otstAmt)" :border="false" />
                </view>
                <view class="item-title">
                  <u-cell title="已预缴逾期利息(元)" :value="moneyFormat(item.prepaidAmt)" :border="false" />
                </view>
                <view class="item-title">
                  <u-cell title="已预缴逾期利息截止日" :value="dateFormat(item.prepaidDate)" :border="false" />
                </view>
                <view class="item-title">
                  <u-cell title="逾期利息计算截止日" :value="dateFormat(item.prepaidDueDate)" value-class="red-color" :border="false" />
                </view>
                <view class="item-title">
                  <u-cell title="到截止日应付逾期利息(元)" :value="moneyFormat(item.dueDatePrepaidAmt)" value-class="red-color" :border="false" />
                </view>
                <view class="item-title">
                  <u-cell title="到截止日需预缴逾期利息(元)" :value="moneyFormat(item.requirePerAmt)" value-class="red-color" :border="false" />
                </view>
              </view>
            </u-collapse-item>
            <view class="cut-line" :class="vm.self.fadlLoaInfoMVoList.length === index + 1 ? 'hiden' : ''"></view>
          </view>
        </u-collapse>
      </u-cell-group>
    </ty-info-card>
  </view>
</template>
<script lang="ts">
export default {
  name: 'MyinfoInterestTrialDetail',
  options: {
    styleIsolation: 'shared' // 解除样式隔离
  }
}
</script>
<script lang="ts" setup>
import NavBar from '@/layout/NavBar.vue'
import { showToast } from '@/utils/uniapp/toast'
import InputNumber from '@/plugins/InputNumber.vue'
import { decodeBase64 } from '@/utils/crypto'
import { getValueByKey } from '@/utils/constant'
import { moneyFormat, dateFormat } from '@/utils/format'
import { InterestTrialDetail } from '@/interfaces/member/myinfo/interestTrial'
import apiInterestTrial from '@/api/member/api.interestTrial'
import { useRoute } from '@/uni-simple-router'
import { isEmpty } from '@/utils/validate'
const Detail: InterestTrialDetail = {
  orgname: '',
  bussType: '',
  ccyid: '',
  financingNum: 0,
  totalLoanAmt: 0,
  totalOtstAmt: 0,
  totalPrepaidAmt: 0,
  totalOverdueAmt: 0,
  totalrequirePerAmt: 0,
  totalOwePrepaidAmt: 0,
  fadlLoaInfoMVoList: []
}
const list = ['按天数', '按金额']
const active = ref(0)
const loading = ref(false)
// 控制融资信息展开收起
const activeNames = ref(['1'])

// 获取列表页面通过路由传过来的refcode
let route = useRoute()
let refcode = Number(decodeBase64(String(route.value.params.refcode)))

// 定义数据
let vm = reactive({
  // 详情数据
  self: Detail,
  // 逾期利息试算天数
  countDays: 0,
  // 预缴逾期利息金额
  adPrepaidAmt: 0,
  // 到截止日需预缴逾期利息总和
  totalRequirePerAmt: 0
})
onMounted(() => {
  getOverDueInfo()
})

/**
 * @Author: MingChun.Cheng
 * @Date: 2023-09-07 09:44:36
 * @param {*} void
 * @return {*}
 * @description: 获取详情数据
 */
const getOverDueInfo = (): void => {
  apiInterestTrial.getOverDueInfo({ refcode: refcode }).then(res => {
    if (res.data) {
      vm.self = res.data.fadlCusLoaMVo
    }
  })
}

/**
 * @Author: MingChun.Cheng
 * @Date: 2023-09-07 09:44:36
 * @param {*} void
 * @return {*}
 * @description: 试算方法
 */
const doOverdueCount = (interfaceFlag: string): void => {
  if (interfaceFlag === '3' && isEmpty(vm.countDays)) {
    showToast('请输入逾期利息试算天数')
    return
  }
  if (interfaceFlag === '3' && vm.countDays <= 0) {
    showToast('逾期利息试算天数需大于0')
    return
  }
  if (interfaceFlag === '3' && vm.countDays > 180) {
    showToast('逾期利息试算天数需小于等于180天')
    return
  }
  if (interfaceFlag === '4' && isEmpty(vm.adPrepaidAmt)) {
    showToast('请输入预缴逾期利息金额')
    return
  }
  if (interfaceFlag === '4' && vm.adPrepaidAmt <= 0) {
    showToast('预缴金额需大于0')
    return
  }
  let data = {
    interfaceFlag: interfaceFlag,
    countDays: vm.countDays,
    adPrepaidAmt: vm.adPrepaidAmt,
    fadlLoaInfoMVoList: vm.self.fadlLoaInfoMVoList
  }
  loading.value = true
  apiInterestTrial
    .doOverdueCount(data)
    .then(res => {
      loading.value = false
      if (res.data && res.data.loanList && res.data.loanList.length > 0) {
        // 试算成功回显数据
        vm.self.fadlLoaInfoMVoList.forEach(item => {
          let tmpItem = res.data.loanList.find(newItem => item.loanNo === newItem.loanNo)
          if (tmpItem) {
            item.prepaidDueDate = tmpItem.prepaidDueDate
            item.requirePerAmt = tmpItem.requirePerAmt
            item.dueDatePrepaidAmt = tmpItem.dueDatePrepaidAmt
          }
        })
        vm.totalRequirePerAmt = res.data.totalRequirePerAmt
      }
    })
    .catch(() => {
      loading.value = false
    })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-10-31 13:28:05
 * @param {*} index
 * @return {*}
 * @description: 分段器更改选择
 */
const sectionChange = (index: number) => {
  active.value = index
}
/**
 * @Author: MingChun.Cheng
 * @Date: 2023-09-07 09:44:36
 * @param {*} void
 * @return {*}
 * @description: 逾期利息预缴试算发送客户
 */
const doSendOverDueInfo = (): void => {
  let checkDateFlag = false
  vm.self.fadlLoaInfoMVoList.forEach(item => {
    if (!item.prepaidDueDate) {
      checkDateFlag = true
    }
  })
  if (checkDateFlag) {
    showToast('请先获取试算结果')
    return
  }
  let data = {
    orgname: vm.self.orgname,
    totalRequirePerAmt: vm.totalRequirePerAmt,
    bussType: vm.self.bussType,
    loanList: vm.self.fadlLoaInfoMVoList
  }
  apiInterestTrial.doSendOverDueInfo(data).then(res => {
    showToast('发送客户成功')
  })
}
</script>
<style lang="scss" scoped>
:deep(.u-cell__title) {
  color: #333 !important;
  font-weight: normal !important;
}
:deep(.u-cell__title-text) {
  color: #666 !important;
}
.detail-cell-group {
  :deep(.u-collapse-item__content__text) {
    padding: 0;
  }
  :deep(.u-cell__left-icon-wrap) {
    margin-right: 0;
  }
  :deep(.u-cell-group) {
    padding-top: 0;
    margin: 0;
    .u-cell__body {
      align-items: self-start;
    }
  }
}
:deep(.u-cell-group .u-cell-group__wrapper) {
  padding: 0;
}
.interest-trial-detail {
  margin-top: -20rpx;
  padding-bottom: 30rpx;
  .prepayment-info {
    .trial-calculate-container {
      margin: 0 0 30rpx 0;
      padding: 20rpx 0;
      border-radius: 5rpx;
      box-shadow: 0rpx 0rpx 5rpx #ccc;
      .subsection-box {
        margin: 40rpx 0;
        padding: 0 160rpx;
        :deep(.u-subsection) {
          height: 72rpx;
          background: #f6f6f6;
          border-radius: 36rpx;
          .u-subsection__bar {
            border-radius: 36rpx;
          }
          .u-subsection__item {
            border: none !important;
            .u-subsection__item__text {
              font-size: 28rpx !important;
              font-weight: normal !important;
            }
          }
        }
      }

      :deep(.u-form-item) {
        margin-top: 18rpx;
      }
      :deep(.u-cell) {
        margin: 0 14rpx;
      }
      :deep(.u-button--primary) {
        // margin-top: -10rpx;
        height: 60rpx;
        .icon-shisuanbaofei {
          font-size: 24rpx;
          margin-right: 10rpx;
        }
        .button-text {
          font-size: 28rpx;
        }
      }
      .trial-box {
        :deep(.u-form-item__body) {
          padding: 0;
        }
        padding: 0 12rpx;
      }
      :deep(.orange-color .u-cell .u-cell__body .u-cell__value) {
        color: $money;
      }
    }
  }
  .financing-info {
    :deep(.u-cell-group) {
      .u-cell-group__title {
        margin-bottom: 0;
      }
      .u-cell-group__wrapper {
        padding: 0;
      }
    }
  }

  :deep(.u-collapse-item) {
    // padding-bottom: 4rpx;
    margin-bottom: 0;
    box-shadow: none;
    .u-cell {
      padding-bottom: 0;
      .u-cell__body {
        padding: 34rpx 0 34rpx 0 !important;
      }
    }
    .container .u-cell {
      padding-bottom: 34rpx;
      .u-cell__body {
        padding: 0 !important;
        .u-cell__body__content .u-cell__title-text {
          font-weight: normal;
          color: $remark-color;
        }
        .u-cell__value {
          color: $default-color;
        }
      }
    }
    .u-line {
      display: none;
    }
  }
}
.hiden {
  display: none;
}
</style>
