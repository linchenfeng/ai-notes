<!--
 * @Author       : MingChun.Cheng
 * @Date         : 2023-09-07 17:40:22
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-06-19 16:26:17
 * @Description  : 预计回款信息反馈 /member/myinfo/paymentInfoFeedback/FeedBackDetail/:refcode
-->
<template>
  <NavBar />
  <!-- 预计回款信息反馈详情-->
  <view class="wap-paymentinfo-feedback-detail">
    <view class="base-info-container">
      <ty-info-card title="基本信息">
        <u-cell-group :border="false">
          <view class="item-title">
            <u-cell title="融资企业名称" :value="vm.self.orgname" :border="false" />
          </view>
          <view class="item-title">
            <u-cell v-if="vm.self.bussType === '9300'" title="供应链公司名称" :value="vm.self.finalPayName" :border="false" />
          </view>
          <view class="item-title">
            <u-cell title="买方名称" :value="vm.self.buyerName" :border="false" />
          </view>
          <view class="item-title">
            <u-cell title="业务产品" :value="getValueByKey(vm.self.bussType, 'businessProductType')" :border="false" />
          </view>
          <view class="item-title">
            <u-cell title="业务合同号" :value="vm.self.busscontNo" :border="false" />
          </view>
          <view class="item-title">
            <u-cell title="币种" :value="vm.self.ccyid === 'RMB' ? '人民币' : getValueByKey(vm.self.ccyid, 'ccyid')" :border="false" />
          </view>
          <view class="item-title">
            <u-cell
              v-if="vm.self.bussType === '9300'"
              title="未回款金额(元)"
              :value="moneyFormat(vm.self.totalUnpaidAmt)"
              value-class="red-color"
              :border="false"
            />
          </view>
          <view class="item-title">
            <u-cell title="融资余额(元)" :value="moneyFormat(vm.self.totalOtstAmt)" value-class="red-color" :border="false" />
          </view>
        </u-cell-group>
      </ty-info-card>
    </view>
    <view class="detail-link-container">
      <view class="line"></view>
      <view v-if="vm.self.bussType === '9300'" class="liView" @click="buyerDetail">
        <view class="title">买方对账回款明细</view>
        <u-badge :value="vm.self.paidNum" absolute :offset="[20, 450]" max="999" :show-zero="true"></u-badge>
        <up-icon name="arrow-right"></up-icon>
      </view>
      <view v-if="vm.self.bussType === '9300'" class="line"></view>
      <view class="liView" @click="overdueDetail">
        <view class="title">融资企业融资逾期明细</view>
        <u-badge :value="vm.self.overDueNum" absolute :offset="[20, 395]" max="999"></u-badge>
        <up-icon name="arrow-right"></up-icon>
      </view>
    </view>
    <u-form label-width="50%">
      <view class="feedback-container">
        <ty-info-card title="与融资企业沟通预计回款情况并反馈">
          <view class="feedback-info-group">
            <u-form-item label="应回款日" label-width="45%">
              <template #right>
                <view class="item-title red-color">
                  <u-cell :value="dateFormat(vm.self.repaymentDate)" :border="false" />
                </view>
              </template>
            </u-form-item>
            <u-cell-group :border="false">
              <u-form-item label="预计回款日" required>
                <view class="unFocus" @click="showSelectPopup('1')">
                  <u-input v-model="vm.feedBackList[0].predictRepaymentDate" placeholder="请选择预计回款日" />
                </view>
                <template #right>
                  <!-- <u-icon name="arrow-right" @click="showSelectPopup('1')"></u-icon> -->
                  <!-- <cover-image class="rightImg" alt="右箭头" src="@/assets/member/myinfo/youjiantou.png" @click="showSelectPopup('1')" /> -->
                  <up-icon name="arrow-right" @click="showSelectPopup('1')"></up-icon>
                </template>
              </u-form-item>
              <u-form-item label="应回款金额(元)" label-width="45%">
                <template #right>
                  <view class="item-title red-color">
                    <u-cell :value="moneyFormat(vm.self.totalOtstAmt)" />
                  </view>
                </template>
              </u-form-item>
              <u-form-item :label="`预计回款金额(元)`" required>
                <InputNumber v-model:number="vm.feedBackList[0].predictRepaymentAmt" placeholder="请输入预计回款金额" maxlength="16"></InputNumber>
              </u-form-item>

              <u-form-item label="情况说明" required>
                <u-input v-model="vm.feedBackList[0].situationDesc" type="textarea" maxlength="200" placeholder="请输入情况说明" />
              </u-form-item>
            </u-cell-group>
          </view>
        </ty-info-card>
      </view>
      <!-- 按需求在为供应链+保理业务展示(目前仅为9300一种)，否则隐藏-->
      <view v-if="vm.self.bussType === '9300'" class="feedback-container">
        <ty-info-card title="与买方沟通预计回款情况并反馈">
          <view class="feedback-info-group">
            <u-cell-group :border="false" :stop="true">
              <u-form-item label="应回款日" label-width="45%">
                <template #right>
                  <view class="item-title red-color">
                    <u-cell :value="dateFormat(vm.self.repaymentDate)" :border="false" />
                  </view>
                </template>
              </u-form-item>

              <u-form-item label="预计回款日" required>
                <view class="unFocus" @click="showSelectPopup('2')">
                  <u-input v-model="vm.feedBackList[1].predictRepaymentDate" placeholder="请选择预计回款日" />
                </view>
                <template #right>
                  <!-- <cover-image class="rightImg" alt="右箭头" src="@/assets/member/myinfo/youjiantou.png" @click="showSelectPopup('2')" /> -->
                  <up-icon name="arrow-right" @click="showSelectPopup('2')"></up-icon>
                  <!-- <u-icon name="arrow-right" @click="showSelectPopup('2')"></u-icon> -->
                </template>
              </u-form-item>
              <u-form-item label="应回款日" label-width="45%">
                <template #right>
                  <view class="item-title red-color">
                    <u-cell :value="moneyFormat(vm.self.totalOtstAmt)" :border="false" />
                  </view>
                </template>
              </u-form-item>

              <u-form-item :label="`预计回款金额(元)`" required>
                <InputNumber v-model:number="vm.feedBackList[1].predictRepaymentAmt" placeholder="请输入预计回款金额" maxlength="16"></InputNumber>
              </u-form-item>
              <u-form-item label="情况说明" required>
                <u-input v-model="vm.feedBackList[1].situationDesc" maxlength="200" placeholder="请输入情况说明" />
              </u-form-item>
            </u-cell-group>
          </view>
        </ty-info-card>
      </view>

      <view class="button-fixed-bottom">
        <view class="placeholder"></view>
        <view class="fixed">
          <u-button v-if="getHasPermissionsById('member:cal:due')" block type="primary" native-type="submit" :loading="loading" @click="onSubmitForm">
            提交
          </u-button>
        </view>
      </view>
    </u-form>
    <u-datetime-picker
      v-model="temDate"
      :show="finanShowPicker"
      mode="date"
      item-height="88"
      :title="'选择预计回款日'"
      :min-date="date"
      @cancel="finanShowPicker = false"
      @confirm="onFinanConfirm"
    />
  </view>
</template>
<script lang="ts">
export default {
  name: 'MyinfoPaymentInfoFeedbackDetail',
  options: {
    styleIsolation: 'shared' // 解除样式隔离
  }
}
</script>
<script lang="ts" setup>
import { showToast } from '@/utils/uniapp/toast'
import InputNumber from '@/plugins/InputNumber.vue'
import { decodeBase64 } from '@/utils/crypto'
import { getValueByKey } from '@/utils/constant'
import { moneyFormat, dateFormat } from '@/utils/format'
import { getHasPermissionsById } from '@/utils/permissions'
import { FadlRemindMVo } from '@/interfaces/member/myinfo/paymentInfoFeedback'
import apiPaymentInfoFeedback from '@/api/member/api.paymentInfoFeedback'
import { encodeBase64 } from '@/utils/crypto'
import { useRouter, useRoute } from '@/uni-simple-router'
import NavBar from '@/layout/NavBar.vue'
import { isEmpty } from '@/utils/validate'
const router = useRouter()
const Detail: FadlRemindMVo = {
  orgname: '',
  bussType: '',
  buyerName: '',
  busscontNo: '',
  finalPayName: '',
  ccyid: '',
  loanDueDate: '',
  repaymentDate: '',
  totalUnpaidAmt: 0,
  totalOtstAmt: 0,
  paidNum: 0,
  overDueNum: 0,
  bybRefcode: 0,
  overDueList: []
}
const loading = ref(false)
// 与融资企业沟通预计回款情况反馈的伸展与收起
const finanShowPicker = ref(false)
// 与买方沟通预计回款情况并反馈的伸展与收起
const dateType = ref('1') // 当前选择的时间类型【1=与融资企业沟通预计回款情况反馈/2=与融资企业沟通预计回款情况反馈】
const temDate = ref('') // 临时时间数据
// 限制回款时间选择
const date = new Date()

// 获取列表页面通过路由传过来的refcode
let route = useRoute()
let refcode = Number(decodeBase64(String(route.value.params.refcode)))

// 定义数据
let vm = reactive({
  // 详情数据
  self: Detail,
  feedBackList: [
    {
      feedBackFlag: '1',
      predictRepaymentDate: '',
      predictRepaymentAmt: '',
      situationDesc: ''
    },
    {
      feedBackFlag: '2',
      predictRepaymentDate: '',
      predictRepaymentAmt: '',
      situationDesc: ''
    }
  ]
})

/**
 * @Author: MingChun.Cheng
 * @Date: 2023-09-07 09:44:36
 * @param {*} void
 * @return {*}
 * @description: 选择与融资企业/买方沟通预计回款情况反馈选择回款日
 */
const showSelectPopup = (type: string): void => {
  dateType.value = type
  finanShowPicker.value = true
}

/**
 * @Author: MingChun.Cheng
 * @Date: 2023-09-07 09:44:36
 * @param {*} void
 * @return {*}
 * @description: 与融资企业沟通预计回款情况反馈选择回款日
 */
const onFinanConfirm = (value): void => {
  if (dateType.value === '1') {
    vm.feedBackList[0].predictRepaymentDate = dateFormat(value.value)
  } else {
    vm.feedBackList[1].predictRepaymentDate = dateFormat(value.value)
  }
  finanShowPicker.value = false
}
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
  apiPaymentInfoFeedback.getPrePaymentInfo(refcode).then(res => {
    if (res.data && res.data.fadlRemindMVo) {
      vm.self = res.data.fadlRemindMVo
      if (vm.self.overDueList && vm.self.overDueList.length > 0) {
        vm.self.loanDueDate = vm.self.overDueList[0].loanDueDate
      }
    }
  })
}

/**
 * @Author: MingChun.Cheng
 * @Date: 2023-09-07 09:44:36
 * @param {*} void
 * @return {*}
 * @description: 提交数据
 */
const onSubmitForm = (): void => {
  // 供应链+保理业务单独校验逻辑
  let financingItem = vm.feedBackList[0]
  let financingFlag = !financingItem.predictRepaymentDate && !financingItem.predictRepaymentAmt && !financingItem.situationDesc
  // 回款情况并反馈数据
  let CollectionItem = vm.feedBackList[1]
  let CollectionFlag = !CollectionItem.predictRepaymentDate && !CollectionItem.predictRepaymentAmt && !CollectionItem.situationDesc
  // 按需求在为供应链+保理业务
  if (vm.self.bussType === '9300') {
    // 融资企业并反馈数据
    if (financingFlag && CollectionFlag) {
      showToast('请至少填写一项预计回款信息')
      return
    }
    if (!financingFlag) {
      if (!financingItem.predictRepaymentDate) {
        showToast('请选择与融资企业沟通的预计回款日')
        return
      }
      if (isEmpty(financingItem.predictRepaymentAmt)) {
        showToast('请输入与融资企业沟通的预计回款金额')
        return
      }
      if (Number(financingItem.predictRepaymentAmt) === 0) {
        showToast('与融资企业沟通的预计回款金额需大于0')
        return
      }
      if (!financingItem.situationDesc) {
        showToast('请输入与融资企业沟通的情况说明')
        return
      }
    }
    if (!CollectionFlag) {
      if (!CollectionItem.predictRepaymentDate) {
        showToast('请选择与买方沟通的预计回款日')
        return
      }
      if (isEmpty(CollectionItem.predictRepaymentAmt)) {
        showToast('请输入与买方沟通的预计回款金额')
        return
      }
      if (Number(CollectionItem.predictRepaymentAmt) === 0) {
        showToast('与买方沟通的预计回款金额需大于0')
        return
      }
      if (!CollectionItem.situationDesc) {
        showToast('请输入与买方沟通的情况说明')
        return
      }
    }
  } else {
    if (!vm.feedBackList[0].predictRepaymentDate) {
      showToast('请选择预计回款日')
      return
    }
    if (isEmpty(vm.feedBackList[0].predictRepaymentAmt)) {
      showToast('请输入预计回款金额')
      return
    }
    if (Number(vm.feedBackList[0].predictRepaymentAmt) === 0) {
      showToast('预计回款金额需大于0')
      return
    }
    if (!vm.feedBackList[0].situationDesc) {
      showToast('请输入情况说明')
      return
    }
  }

  if (vm.self.bussType === '9300') {
    // 第一项填，不填第二项
    if (!financingFlag && CollectionFlag) {
      let data = {
        bussType: vm.self.bussType,
        busscontNo: vm.self.busscontNo,
        feedBackList: [vm.feedBackList[0]]
      }
      doPreRetrunSubmit(data)
      // 第一项不填，填第二项
    } else if (financingFlag && !CollectionFlag) {
      let data = {
        bussType: vm.self.bussType,
        busscontNo: vm.self.busscontNo,
        feedBackList: [vm.feedBackList[1]]
      }
      doPreRetrunSubmit(data)
      // 两项都填
    } else if (!financingFlag && !CollectionFlag) {
      let data = {
        bussType: vm.self.bussType,
        busscontNo: vm.self.busscontNo,
        feedBackList: vm.feedBackList
      }
      doPreRetrunSubmit(data)
    }
  } else {
    let data = {
      bussType: vm.self.bussType,
      busscontNo: vm.self.busscontNo,
      feedBackList: [vm.feedBackList[0]]
    }
    doPreRetrunSubmit(data)
  }
}

/**
 * @Author: MingChun.Cheng
 * @Date: 2023-09-07 09:44:36
 * @param {*} void
 * @return {*}
 * @description: 跳转至买方对账回款明细界面
 */
const doPreRetrunSubmit = (data): void => {
  loading.value = true
  apiPaymentInfoFeedback
    .doPreRetrunSubmit(data)
    .then(res => {
      loading.value = false
      showToast('提交成功')
      router.push('/member/myinfo/paymentInfoFeedback')
    })
    .catch(err => {
      loading.value = false
    })
}

/**
 * @Author: MingChun.Cheng
 * @Date: 2023-09-07 09:44:36
 * @param {*} void
 * @return {*}
 * @description: 跳转至买方对账回款明细界面
 */
const buyerDetail = (): void => {
  router.push(`/member/myinfo/paymentInfoFeedback/BuyerDetail/${encodeBase64(vm.self.busscontNo)}`)
}
/**
 * @Author: MingChun.Cheng
 * @Date: 2023-09-07 09:44:36
 * @param {*} void
 * @return {*}
 * @description: 跳转至融资企业融资逾期明细界面
 */
const overdueDetail = (): void => {
  router.push(`/member/myinfo/paymentInfoFeedback/OverdueDetail/${encodeBase64(refcode)}`)
}
</script>
<style lang="scss" scoped>
.wap-paymentinfo-feedback-detail {
  padding: 0 0 60rpx 0;
  margin-top: -20rpx;
  .liView {
    display: flex;
    justify-content: space-between;
    padding: 40rpx 20rpx 5rpx 29rpx;
    font-size: 32rpx;
    border-radius: 10rpx;
    position: relative;
    .title {
      font-size: 28rpx;
      font-weight: bold;
    }
    :deep(.u-badge) {
      padding: 4rpx 14rpx;
      background-color: #fce5e7;
      color: $danger;
      font-size: 24rpx;
      border-radius: 16rpx 16rpx 16rpx 0;
    }
    .rightImg {
      width: 14rpx;
      height: 24rpx;
      margin-right: 0;
      margin-top: 12rpx;
    }
  }
  .feedback-container {
    margin-top: 30rpx;
  }
  :deep(.u-collapse-item) {
    margin-bottom: 0 !important;
  }
  :deep(.u-cell-group) {
    padding-top: 0 !important;
    margin: 0 !important;
  }
}
.line {
  margin-top: 20rpx;
  width: 100%;
  height: 20rpx;
  background: #f6f6f6;
}
.feedback-info-group {
  :deep(.u-cell__body) {
    padding: 10px 0;
  }
}
</style>
