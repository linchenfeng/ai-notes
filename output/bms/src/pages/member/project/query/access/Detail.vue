<!--
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-26 09:46:45
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-26 14:57:30
 * @Description  : 项目-业务查询-业务准入查询详情  /member/project/query/access/detail/:refcode
-->
<template>
  <NavBar />
  <view class="bigBox">
    <up-sticky z-index="2" bg-color="#fff">
      <state-module
        v-if="vm.self.intLoanStatus"
        :state-name="['1'].includes(vm.self.intLoanStatus) ? applyStateName[vm.self.applyStatus] : stateName[vm.self.intLoanStatus]"
        :state-color="['1'].includes(vm.self.intLoanStatus) ? applyStateColor[vm.self.applyStatus] : stateColor[vm.self.intLoanStatus]"
      ></state-module>
    </up-sticky>
    <view class="topCell">
      <view v-if="vm.self.postponeRemark" class="returnReason">
        <view>
          <text>暂缓原因：</text>
          <text class="reasonValue">
            {{ vm.self.postponeRemark }}
          </text>
        </view>
      </view>
      <u-cell-group>
        <u-cell title="客户经理" :value="vm.self.userName" />
        <u-cell title="业务主管" :value="vm.self.superiorName" />
        <u-cell title="申请日期" :value="vm.self.applyDate ? dateFormat(vm.self.applyDate, 1) : ''" />
      </u-cell-group>
    </view>
    <view class="business-query-preLoan-detail">
      <!-- 买方基本信息、贸易基本信息 -->
      <BasicInfo ref="basicRef" :self="vm.self"></BasicInfo>

      <!-- 问答列表 -->
      <QaList
        :refcode="submitData.refcode"
        :user-name="vm.self.userName"
        :answer-flag="vm.self.intLoanStatus === '4' ? '0' : '1'"
        type="query"
      ></QaList>
      <ty-info-card v-if="vm.self.conditionFlag === '1'" title="有条件准入信息">
        <view class="content pre-wrap summaryRemark">{{ vm.self.conditionRemark || '有条件准入' }}</view>
      </ty-info-card>
      <!-- 准入历程 -->
      <History v-if="showHistory" />
    </view>

    <template v-if="showModAndDeleteBtn">
      <view class="button-fixed-bottom">
        <view class="placeholder"></view>
        <view class="fixed">
          <u-button :loading="loading" block type="primary" native-type="submit" @click="onMod">修改</u-button>
          <u-button :loading="loading" block type="primary" native-type="submit" @click="onDelete">删除</u-button>
          <u-button
            v-if="vm.self.intLoanStatus === '3' && vm.self.customType === '3' && isManager"
            :loading="loading"
            block
            type="primary"
            native-type="submit"
            @click="doInvite"
          >
            {{ vm.self.entryInvitationStatus === '2' ? '再次邀请' : '邀请入驻' }}
          </u-button>
        </view>
      </view>
    </template>
    <template v-else>
      <view v-if="showDeletebtn || (vm.self.intLoanStatus === '3' && vm.self.customType === '3' && isManager)" class="button-fixed-bottom">
        <view class="placeholder"></view>
        <view class="fixed">
          <u-button v-if="showDeletebtn" :loading="loading" block type="primary" native-type="submit" @click="onDelete">删除</u-button>
          <u-button
            v-if="vm.self.intLoanStatus === '3' && vm.self.customType === '3' && isManager"
            :loading="loading"
            block
            type="primary"
            native-type="submit"
            @click="doInvite"
          >
            {{ vm.self.entryInvitationStatus === '2' ? '再次邀请' : '邀请入驻' }}
          </u-button>
        </view>
      </view>
    </template>
  </view>

  <u-modal
    :show="showModalFlag"
    title="温馨提示"
    confirm-text="确认"
    show-cancel-button="true"
    class="accessModal"
    @confirm="onConfirm"
    @cancel="showModalFlag = false"
  >
    <view class="slot-content">
      <view>删除后需要重新申请，请确认是否删除？</view>
    </view>
  </u-modal>
</template>

<script setup lang="ts">
import StateModule from '@/plugins/StateModule.vue'
import BasicInfo from '../../audit/access/components/BasicInfo.vue'
import NavBar from '@/layout/NavBar.vue'
import { getValueByKey } from '@/utils/constant'
import { FintAplMVo, InternationBackRequest } from '@/interfaces/member/project/apply/businessApply'
import { useRoute } from '@/uni-simple-router'
import apiBusinessApply from '@/api/member/project/apply/api.businessApply'
import { decodeBase64, encodeBase64 } from '@/utils/crypto'
import { onMounted, reactive } from 'vue'
import QaList from '@/pages/member/project/audit/access/components/QaList.vue'
import { getStorage } from '@/utils/storages'
import router from '@/router'
import { showToast } from '@/utils/uniapp/toast'
import { dateFormat } from '@/utils/format'
import History from './History.vue'
import apiBusinessQuery from '@/api/member/project/query/api.businessQuery'
const route = useRoute()
const basicRef = ref()
let showDeletebtn = ref(false)
let showModAndDeleteBtn = ref(false)
let showHistory = ref(false) // 是否展示准入历程
let loading = ref(false)
let showModalFlag = ref(false)
const isManager = ref(false) //是否客户经理

const stateColor = {
  '1': 'warning',
  '3': 'success',
  '4': 'error',
  '6': 'warning',
  '5': 'warning',
  '0': 'warning',
  '2': 'error',
  '7': 'warning',
  '8': 'error',
  '9': 'warning',
  '10': 'warning'
}
const applyStateName = {
  '1': '已申请',
  '2': '已提问',
  '3': '已回复'
}
const applyStateColor = {
  '1': 'warning',
  '2': 'warning',
  '3': 'warning'
}
const self: FintAplMVo = {
  intLoanStatus: '',
  returnReason: '',
  rejectReason: '',
  annualTurnover: '',
  ccyid: '',
  counterpartyName: '',
  ctyid: '',
  futureAnnualTurnover: '',
  orgctyid: '',
  orgname: '',
  productName: '',
  projectSource: '',
  tenor: '',
  ctyDesc: '',
  orgctyDesc: '',
  ccyidDesc: '',
  superiorName: '',
  superior: '',
  userName: '',
  applyStatus: '',
  referFlag: '',
  applyDate: '',
  tenorStartType: '',
  tenorStartDesc: '',
  transactionYears: '',
  productType: '',
  isSubmit: '',
  answerFlag: '',
  fintAplDtcVoList: [],
  customType: ''
}

// 提交的数据
const submitData = {
  refcode: Number(decodeBase64(route.value.params.refcode)),
  intLoanStatus: '' // 【3=拒绝/4=同意】
}
// 业务申请信息
let vm = reactive({
  self: self
})
const stateName = computed(() => ({
  '1': '待准入',
  '3': vm.self.conditionFlag === '1' ? '有条件准入' : '已准入',
  '4': '已拒绝',
  '6': '待受理',
  '5': '已撤回',
  '0': '已保存',
  '2': '已退回',
  '7': '受理退回',
  '8': '已拒绝',
  '9': '已暂缓',
  '10': '解除暂缓'
}))
/**
 * @Author: ran.zhu
 * @Date: 2024-07-16 14:37:45
 * @return {*}
 * @description: 删除
 */
const onDelete = () => {
  showModalFlag.value = true
}
/**
 * @Author: ran.zhu
 * @Date: 2024-07-22 14:16:42
 * @return {*}
 * @description: 修改
 */
const onMod = () => {
  const str = JSON.stringify(vm.self)
  router.push({ path: '/member/project/apply/access', query: { data: encodeBase64(str) } })
}

// 邀请
const doInvite = () => {
  router.push(`/member/customer/invited/${encodeBase64(vm.self.orgRefcode as number)}/2`) // 2=准入详情
}

const doWithdrawOverseasBusinessInfo = () => {
  loading.value = true
  const data: InternationBackRequest = {
    financingNo: vm.self.financingNo as string,
    refcode: submitData.refcode,
    delFlag: '1'
  }
  apiBusinessApply.doWithdrawOverseasBusinessInfo(data).then(
    () => {
      loading.value = false
      showToast('删除成功')
      setTimeout(() => {
        router.back(1)
      }, 1500)
    },
    () => {
      loading.value = false
    }
  )
}

const onConfirm = () => {
  showModalFlag.value = false
  doWithdrawOverseasBusinessInfo()
}

/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 16:53:32
 * @description: 获取境外
 */
const getOverseasBusinessInfo = () => {
  apiBusinessApply.getOverseasBusinessInfo(submitData.refcode).then(res => {
    vm.self = res.data
    const userName = getStorage('userName')
    showDeletebtn.value = vm.self.userName === userName && ['11', '21'].includes(res.data.intLoanStatus)
    isManager.value = vm.self.userName === userName

    // ARM-9241 最新要求屏蔽修改按钮
    // showModAndDeleteBtn.value = showDeletebtn.value && res.data.fintAplM.referFlag === '0'
    // 若字典项存在则展示字典项，不存在说明选的其他,自己手填
    vm.self.ccyidDesc = getValueByKey(vm.self.ccyid, 'applyCcyid') ? getValueByKey(vm.self.ccyid, 'applyCcyid') : vm.self.ccyid
  })
}
const getInternationalHistoryInfo = () => {
  apiBusinessQuery.getInternationalHistoryInfo(submitData.refcode).then(res => {
    showHistory.value = res.data.historyList && res.data.historyList.length > 0 ? true : false
  })
}
onMounted(() => {
  getOverseasBusinessInfo()
  getInternationalHistoryInfo()
})
</script>

<style lang="scss" scoped>
:deep(.u-sticky) {
  top: 44px !important;
  z-index: 2 !important;
  .stateModule {
    z-index: 3;
  }
}
.topCell {
  padding-top: 70rpx;
  .returnReason {
    min-height: 20rpx;
    padding: 48rpx 50rpx 0 30rpx;
    font-size: 28rpx;
    .reasonValue {
      color: $danger;
      word-break: break-all;
      & :first-child {
        word-break: break-all;
      }
    }
  }
}
.button-view {
  padding: 0 30rpx 30rpx;
}
.content {
  font-size: 28rpx;
  line-height: 46rpx;
  color: $sub-color;
  padding-bottom: 30rpx;
  &.summaryRemark {
    color: #333;
  }
}
</style>
