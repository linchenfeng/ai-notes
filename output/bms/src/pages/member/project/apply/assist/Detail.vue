<!--
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-21 13:45:24
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-25 16:12:21
 * @Description  : 项目-业务申请-申请协销/征信详情 /member/project/apply/assist/detail
-->
<template>
  <NavBar />
  <view>
    <view class="businessApply-internation">
      <view v-if="['4', '5'].includes(vm.assistInfo.applyStatus)" class="returnReason">
        <view>
          <text>{{ vm.assistInfo.applyStatus === '4' ? '退回' : '拒绝' }}原因：</text>
          <text class="reasonValue">
            {{ vm.assistInfo.refuseReason }}
          </text>
        </view>
        <view>
          <text>{{ vm.assistInfo.applyStatus === '4' ? '退回' : '拒绝' }}人员：</text>
          <text class="reasonValue">
            {{ vm.assistInfo.refuseUser }}
          </text>
        </view>
      </view>
      <!-- 申请协销/征信基础信息 -->
      <base-info :assist-info="vm.assistInfo" type="apply" />
      <ty-info-card title="协销主管">
        <view class="assist-superior">{{ vm.assistInfo.assistSuperior }}</view>
      </ty-info-card>
      <ty-info-card v-if="!isEmpty(vm.assistInfo.applyRemark)" title="备注说明">
        <view class="content pre-wrap summaryRemark">{{ vm.assistInfo.applyRemark }}</view>
      </ty-info-card>
      <ty-info-card v-if="!isEmpty(vm.assistInfo.assistUsers)" title="协销人员">
        <view class="assist-superior">{{ vm.assistInfo.assistUsers }}</view>
      </ty-info-card>
      <ty-info-card v-if="!isEmpty(vm.assistInfo.creditSuperior)" title="征信主管">
        <view class="assist-superior">{{ vm.assistInfo.creditSuperior }}</view>
      </ty-info-card>
      <ty-info-card v-if="!isEmpty(vm.assistInfo.creditUsers) && vm.assistInfo.appointStatus === '9'" title="征信人员">
        <view class="assist-superior">{{ vm.assistInfo.creditUsers }}</view>
      </ty-info-card>
    </view>
    <view
      v-if="
        getHasPermissionsById('member:project:apply:assist') &&
        vm.assistInfo.appointStatus === '1' &&
        !['3', '4', '5'].includes(vm.assistInfo.applyStatus)
      "
      class="button-fixed-bottom"
    >
      <view class="placeholder"></view>
      <view class="fixed">
        <u-button :loading="loading" block type="primary" native-type="submit" @click="onCancel">撤回</u-button>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { AssistInfo } from '@/interfaces/member/project/apply/assist'
import NavBar from '@/layout/NavBar.vue'
import { reactive } from 'vue'
import { isEmpty } from '@/utils/validate'
import apiAssist from '@/api/member/project/apply/api.assist'
import { decodeBase64 } from '@/utils/crypto'
import BaseInfo from './components/BaseInfo.vue'
import { getHasPermissionsById } from '@/utils/permissions'
import { showToast } from '@/utils/uniapp/toast'
import { useRouter, useRoute } from '@/uni-simple-router'
const router = useRouter()
const route = useRoute()
let refcode: number | string = '' // 业务准入流水号
let loading = ref(false)
let assistInfo: AssistInfo = {
  /**
   * 申请状态，1=待申请/2=已申请
   */
  applyStatus: '',
  /**
   * 准入流水号
   */
  aplRefcode: '',
  /**
   * 申请日期
   */
  applyDate: '',
  /**
   * 指派日期
   */
  appointDate: '',
  /**
   * 申请备注
   */
  applyRemark: '',
  /**
   * 指派状态[1=待指派协销/2=待指派征信/9=已指派]
   */
  appointStatus: '',
  /**
   * 协销主管
   */
  assistSuperior: '',
  /**
   * 协销人员
   */
  assistUsers: '',
  /**
   * 业务大类，[1=国内业务/2=国际业务/3=跨境电商]
   */
  bizScene: '',
  /**
   * 征信人员
   */
  creditUsers: '',
  /**
   * 业务申请编号
   */
  financingNo: '',
  /**
   * 卖方国家描述
   */
  ctyDesc: '',
  /**
   * 卖方所在国
   */
  orgctyid: '',
  /**
   * 卖方名称
   */
  orgname: '',
  /**
   * 产品类型
   */
  productType: '',
  /**
   * 申请人主管名称
   */
  superiorUserid: '',
  /**
   * 客户经理
   */
  clmUserName: ''
}
// 申请详情
let vm = reactive({
  assistInfo: assistInfo // 提交信息
})

const getApplyAssistInfo = () => {
  apiAssist.getApplyAssistInfo(refcode).then(res => {
    if (res) {
      vm.assistInfo = res.data.assistAppointM
    }
  })
}
const onCancel = () => {
  loading.value = true
  apiAssist.doWithdrawApplyAssist({ refcode }).then(
    () => {
      loading.value = false
      showToast('撤回成功')
      setTimeout(() => {
        router.back(1)
      }, 1500)
    },
    () => {
      loading.value = false
    }
  )
}
onMounted(() => {
  if (route.value.params) {
    refcode = decodeBase64(route.value.params.refcode)
    if (!isEmpty(refcode)) {
      getApplyAssistInfo()
    }
  }
})
</script>

<style lang="scss" scoped>
.content {
  font-size: 28rpx;
  line-height: 46rpx;
  color: $sub-color;
  padding-bottom: 30rpx;
  &.summaryRemark {
    color: #333;
    margin-top: 0;
  }
}
.assist-superior {
  margin-bottom: 30rpx;
}
.returnReason {
  background: #fff;
  padding: 30rpx 30rpx 0 30rpx;
  margin-bottom: -20rpx;
  font-size: 28rpx;
  .reasonValue {
    color: $danger;
    word-break: break-all;
    & :first-child {
      word-break: break-all;
    }
  }
}
</style>
