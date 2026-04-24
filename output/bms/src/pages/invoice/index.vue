<!--
 * @Author       : Longcan.Yang
 * @Date         : 2024-10-17 10:08:27
 * @LastEditors  : aolin.qu
 * @LastEditTime : 2026-03-18 18:27:33
 * @Description  : 客户补充开票信息 /invoice
-->

<template>
  <view class="box">
    <view class="head">
      <view><cover-image class="bg" src="@/assets/member/myinfo/collect/bg.png"></cover-image></view>
      <view><cover-image class="logo" src="@/assets/member/myinfo/collect/logo.png"></cover-image></view>
      <view><cover-image class="gather" src="@/assets/member/myinfo/collect/gather.png"></cover-image></view>
      <view class="head-text">
        <view class="desc">
          我正在为{{ vm.self.applyOrgname }}申请开发票，
          <text v-if="isNotEmpty(vm.shareDataObj.generateAmt)">申请开票金额{{ vm.shareDataObj.generateAmt }}元，</text>
          请填写以下信息，帮助我完成开票
        </view>
      </view>
    </view>
    <!-- 正常录入 -->
    <ty-info-card v-if="vm.self.appStatus === '10'" title="开票信息" :show-line="false">
      <u-form label-width="50%">
        <!-- 台一展示发票类型 -->
        <u-form-item label="开票币种" label-width="50%" required>
          <view class="unFocus">
            <u-input v-model="vm.self.ccyidDesc" placeholder="请选择开票币种" />
          </view>
        </u-form-item>
        <u-form-item :label="`申请开票金额(元)`" label-width="45%" required>
          <InputNumber v-model:number="vm.self.generateAmt" placeholder="请输入申请开票金额(元)" maxlength="15"></InputNumber>
        </u-form-item>
        <u-form-item v-if="vm.self.bankrollOrgName === '台一国际商业保理（天津）有限公司'" label="发票类型" label-width="45%" required>
          <view class="radio-group">
            <u-button
              v-for="obj in getConstant('billType')"
              :key="obj.key"
              class="check-button"
              :class="{ active: vm.self.billType === obj.key }"
              round
              size="mini"
              @click="handlezzAction(obj.key)"
            >
              {{ obj.value }}
            </u-button>
          </view>
        </u-form-item>
        <u-form-item label="开票企业名称" required>
          <u-input v-model="vm.self.appOrgName" maxlength="20" placeholder="请输入开票企业名称" />
        </u-form-item>
        <u-form-item v-if="vm.self.bankrollOrgName === '台一国际商业保理（天津）有限公司'" label="开票企业税号" required>
          <u-input v-model="vm.self.appCreditCode" maxlength="20" placeholder="请输入开票企业税号" />
        </u-form-item>
        <u-form-item label="开票企业邮箱" required>
          <u-input v-model="vm.self.email" maxlength="20" placeholder="请输入开票企业邮箱" />
        </u-form-item>
      </u-form>
    </ty-info-card>

    <view v-else class="collect-body">
      <view class="no-need-collect">
        <view class="icon">
          <text v-if="vm.self.appStatus === '13'" class="iconfont icon-yiwancheng"></text>
          <text v-else class="iconfont icon-jinggao"></text>
        </view>
        <view class="content">
          <view class="contentInfo">{{ linkrotText }}</view>
          <view v-if="vm.self.appStatus !== '13'" class="contentDesc">可联系微信好友重新发起邀请</view>
        </view>
      </view>
    </view>
  </view>
  <view v-if="vm.self.appStatus === '10'" class="button-fixed-bottom">
    <view class="placeholder"></view>
    <view class="fixed">
      <u-button :loading="loading" block type="success" native-type="submit" @click="getInvoiceDetail('save')">保存</u-button>
      <u-button :loading="loading" block type="primary" native-type="submit" @click="getInvoiceDetail('submit')">提交</u-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { decodeBase64, getUrlParam } from '@/utils/crypto'
import { FgaiAppVo } from '@/interfaces/member/myinfo/invoice'
import apiInvoice from '@/api/member/myinfo/api.invoice'
import { showToast } from '@/utils/uniapp/toast'
import tyInfoCard from '@/plugins/infoCard/index.vue'
import { isEmpty, checkEmail, isNotEmpty } from '@/utils/validate'
import { getConstant, getValueByKey } from '@/utils/constant'
import InputNumber from '@/plugins/InputNumber.vue'
let loading = ref(false)
const linkrotText = ref('')
type ShareDataObj = {
  // 融资企业通过分享链接跳入带入的参数
  refcode: ''
  generateAmt: ''
}
let shareDataObj: ShareDataObj = {
  refcode: '',
  generateAmt: ''
}
// 表单数据初始化
const self: FgaiAppVo = {
  appStatus: '10'
} as FgaiAppVo
// 业务申请信息状态管理
let vm = reactive({
  self: self, // 表单数据
  shareDataObj: shareDataObj
})
const doSave = () => {
  loading.value = true
  vm.self.generateType = '2' // 开票类型固定为征信费
  vm.self.submitFlag = '0' // 0表示保存
  vm.self.operatorType = '2'
  apiInvoice.doSubmitInfo(vm.self, false).then(
    () => {
      loading.value = false
      showToast('保存成功')
    },
    () => {
      loading.value = false
    }
  )
}
const doSubmit = () => {
  if (isEmpty(vm.self.generateAmt)) {
    showToast('请输入申请开票金额')
  }
  if (Number(vm.self.generateAmt) <= 0) {
    showToast('申请开票金额需大于0')
  }
  if (isEmpty(vm.self.billType) && vm.self.bankrollOrgName === '台一国际商业保理（天津）有限公司') {
    showToast('请选择发票类型')
    return
  }
  if (isEmpty(vm.self.appOrgName)) {
    showToast('请输入企业名称')
    return
  }
  if (isEmpty(vm.self.appCreditCode)) {
    showToast('请输入企业税号')
    return
  }
  if (isEmpty(vm.self.email)) {
    showToast('请输入企业邮箱')
    return
  }
  if (isNotEmpty(vm.self.email) && !checkEmail(vm.self.email)) {
    showToast('请输入正确的开票企业邮箱')
    return
  }
  loading.value = true
  vm.self.generateType = '2' // 开票类型固定为征信费
  vm.self.submitFlag = '1' // 1表示提交
  vm.self.operatorType = '2'
  apiInvoice.doSubmitInfo(vm.self, false).then(
    () => {
      loading.value = false
      // eslint-disable-next-line no-use-before-define
      getInvoiceDetail('init')
    },
    () => {
      loading.value = false
    }
  )
}
const getInvoiceDetail = (type: string) => {
  apiInvoice.getInvoiceDetail(vm.shareDataObj.refcode, false).then(res => {
    if (type === 'init') {
      vm.self = res.data.fgaiAppVo
      vm.self.generateAmt = vm.self.generateAmt === 0 ? '' : vm.self.generateAmt
      vm.self.ccyidDesc = getValueByKey(vm.self.ccyid, 'applyCcyid') ? getValueByKey(vm.self.ccyid, 'applyCcyid') : vm.self.ccyid
    }
    if (vm.self.appStatus !== '10') {
      linkrotText.value = '邀请已过期'
    }
    if (vm.self.appStatus === '13') {
      linkrotText.value = '提交成功'
    }
    if (type === 'save') {
      doSave()
    } else if (type === 'submit') {
      doSubmit()
    }
  })
}

const handlezzAction = (key: string) => {
  vm.self.billType = key
}
onMounted(() => {
  if (getUrlParam('data')) {
    vm.shareDataObj = JSON.parse(decodeBase64(getUrlParam('data'))) as ShareDataObj
    getInvoiceDetail('init')
  }
})
</script>

<style lang="scss" scoped>
.box {
  min-height: calc(100vh - 60px);
  // background-color: rgba(242, 242, 242);
}

.head {
  width: 100%;
  position: relative;
  height: 365rpx;
  .bg {
    position: absolute;
    width: 100%;
    height: 365rpx;
    // z-index: -1;
  }
  .logo {
    position: absolute;
    width: 76rpx;
    height: 76rpx;
    top: 60rpx;
    left: 30rpx;
  }
  .gather {
    position: absolute;
    width: 271rpx;
    height: 158rpx;
    top: 115rpx;
    right: 0;
    // opacity: 0.3;
  }
  .head-text {
    position: relative;
    color: #fff;
    padding-top: 56rpx;
    padding-left: 126rpx;
    .title {
      font-size: 28rpx;
    }
    .desc {
      margin-top: 16rpx;
      line-height: 38rpx;
      font-size: 28rpx;
      padding-right: 30rpx;
    }
  }
}

.collect-body {
  margin: -90rpx 0 0;
  background: #ffffff;
  position: relative;
  &.meeting-review-detail {
    padding-top: 22rpx;
    :deep(.u-cell-group__title) {
      background-color: #fff;
      margin-bottom: 10rpx;
      .u-cell-group__title__text {
        span {
          font-size: 32rpx;
          font-weight: bold;
        }
      }
    }
    .line {
      width: 100%;
      height: 20rpx;
      background-color: #f6f6f6;
    }
    .title {
      font-size: 32rpx;
      font-weight: bold;
      margin-bottom: 30rpx;
    }
    .content {
      font-size: 28rpx;
      line-height: 46rpx;
      margin-bottom: 30rpx;
    }
    .u-textarea {
      min-height: 160rpx;
      // padding-bottom: 40rpx;
      :deep(.u-textarea__field) {
        height: auto !important;
        min-height: 160rpx !important;
      }
    }
  }
  .no-need-collect {
    padding: 90rpx 30rpx 300rpx;
    height: 750rpx;
    box-sizing: border-box;
    text-align: center;
    .icon {
      .iconfont {
        font-size: 90rpx;
      }
      .icon-jinggao {
        color: $danger;
      }
      .icon-yiwancheng {
        color: $primary;
      }
    }
    .contentInfo {
      margin-top: 50rpx;
      font-weight: bold;
      font-size: 36rpx;
    }
    .contentDesc {
      margin-top: 30rpx;
      font-size: 30rpx;
      color: $sub-color;
    }
  }
}
.slot-content {
  color: #646566;
  .title {
    margin-bottom: 30rpx;
  }
}
.baseinfo {
  margin-top: -20rpx;
}
.reviewTime {
  font-size: 24rpx;
  color: $remark-color;
  margin-left: 20rpx;
}
:deep(.u-form-item__body__right__content__slot) {
  justify-content: end;
}
</style>
