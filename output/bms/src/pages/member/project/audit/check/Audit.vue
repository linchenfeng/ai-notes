<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-11-04 09:27:29
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-01-23 13:37:39
 * @Description  :  项目-业务审核-核查企业信息-核查 /member/project/audit/check/audit
-->
<template>
  <NavBar />
  <view>
    <view class="businessApply-internation">
      <!-- 基本信息 -->
      <ty-info-card title="基本信息" :show-line="false">
        <template #subtitle>
          <view v-if="vm.hisCheckList && vm.hisCheckList.length && vm.fintAplChkVo.counterpartyName" class="inviteWrite" @click.stop="viewHistory">
            <text class="name">核查历程</text>
          </view>
        </template>
        <view class="card-cell-group">
          <u-cell-group>
            <u-cell title="企业名称" :value="vm.fintAplChkVo.counterpartyName" />
            <u-cell title="发起日期" :value="dateFormat(vm.fintAplChkVo.applyDate)" />
            <u-cell v-if="!isEmpty(vm.fintAplChkVo.applyRemark)" title="备注说明" class="vertical-cell">
              <template #value>
                <view class="cell-value">{{ vm.fintAplChkVo.applyRemark }}</view>
              </template>
            </u-cell>
          </u-cell-group>
        </view>
      </ty-info-card>
      <!-- 核查历程 -->
      <ty-info-card v-if="vm.fintAplChkVo.operationFlag === '1'" title="企业核查信息">
        <view class="content pre-wrap">
          <u-textarea
            v-model="submitData.checkRemark"
            :confirm-type="null"
            auto-height
            maxlength="1000"
            count
            class="inputValueClass"
            placeholder-style="font-size: 28rpx;"
            placeholder="请输入企业核查信息"
          ></u-textarea>
        </view>
      </ty-info-card>
      <template v-if="checkStatus === '1'">
        <view v-if="vm.fintAplChkVo.operationFlag === '1' && getHasPermissionsById('member:project:audit:check:submit')" class="button-fixed-bottom">
          <view class="placeholder"></view>
          <view class="fixed">
            <u-button :loading="loading" block type="primary" native-type="submit" @click="getOrgVerifyInfo('check')">提交</u-button>
          </view>
        </view>
      </template>
      <template v-else>
        <view
          v-if="vm.fintAplChkVo.operationFlag === '1' && getHasPermissionsById('member:project:audit:check:supplement')"
          class="button-fixed-bottom"
        >
          <view class="placeholder"></view>
          <view class="fixed">
            <u-button :loading="loading" block type="primary" native-type="submit" @click="getOrgVerifyInfo('check')">补充核查</u-button>
          </view>
        </view>
      </template>
    </view>
  </view>
</template>
<script setup lang="ts">
import { QueryVerifyInfo, FintAplChkVo, SubmitData, QueryVerifyHistory, HisCheckList } from '@/interfaces/member/project/audit/check'
import NavBar from '@/layout/NavBar.vue'
import { reactive } from 'vue'
import { getHasPermissionsById } from '@/utils/permissions'
import { showToast } from '@/utils/uniapp/toast'
import { isEmpty } from '@/utils/validate'
import apiCheck from '@/api/member/project/audit/api.check'
import { decodeBase64 } from '@/utils/crypto'
import { useRouter, useRoute } from '@/uni-simple-router'
import { dateFormat } from '@/utils/format'
import { encodeBase64 } from '@/utils/crypto'
const router = useRouter()
const route = useRoute()
let loading = ref(false)
let refcode: string = decodeBase64(route.value.params.refcode) // 核查流水号
let checkStatus = ref('') // 记录原始状态
let fintAplChkVo: FintAplChkVo = {
  /**
   * 发起时间
   */
  applyDate: '',
  /**
   * 申请备注说明
   */
  applyRemark: '',
  /**
   * 核查时间
   */
  checkDate: '',
  /**
   * 核查企业信息
   */
  checkRemark: '',
  /**
   * 核查状态[1=待核查/2=已核查]
   */
  checkStatus: '',
  /**
   * 交易对手名称
   */
  counterpartyName: '',
  /**
   * 企业名称
   */
  orgname: '',
  /**
   * 流水号
   */
  refcode: '',
  /**
   * 核查意见流水号
   */
  remarkRefcode: '',
  checkUsers: ''
}
let hisCheckList: HisCheckList[] = []
// 提交数据
let submitData = reactive<SubmitData>({
  checkRemark: '',
  checkType: '',
  refcode: refcode
})
// 详情查询条件
let queryVerifyInfo = reactive<QueryVerifyInfo>({
  refcode: refcode
})
// 历程查询条件
let queryVerifyHistory = reactive<QueryVerifyHistory>({
  orgname: '',
  excludeRemarkRefcodeList: [],
  queryType: '2'
})

// 申请详情
let vm = reactive({
  fintAplChkVo: fintAplChkVo, // 详情
  hisCheckList: hisCheckList //历程
})

/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-24 15:33:17
 * @description:国际业务提交
 */
const onSubmit = () => {
  if (isEmpty(submitData.checkRemark)) {
    showToast('请输入企业核查信息')
    return
  }
  submitData.checkType = checkStatus.value
  loading.value = true
  apiCheck.doSubmitVerifyResult(submitData).then(
    res => {
      if (!res.data) {
        showToast('操作成功')
      } else if (res.data.errorFlag === '0') {
        showToast('该买方的准入数据已被删除，暂无法提交')
      } else if (res.data.errorFlag === '1') {
        showToast('该买方的准入数据已撤回，暂无法提交')
      }
      setTimeout(() => {
        router.back(1)
        loading.value = false
      }, 1500)
    },
    () => {
      loading.value = false
    }
  )
}
const getOrgVerifyHistory = () => {
  loading.value = true
  apiCheck.getOrgVerifyHistory(queryVerifyHistory).then(
    res => {
      if (res) {
        loading.value = false
        vm.hisCheckList = res.data.hisCheckList
      }
    },
    () => {
      loading.value = false
    }
  )
}
const getOrgVerifyInfo = (type: string) => {
  loading.value = true
  apiCheck.getOrgVerifyInfo(queryVerifyInfo).then(
    res => {
      if (res) {
        loading.value = false
        vm.fintAplChkVo = res.data.fintAplChkVo
        // 当前数据已被操作
        if (vm.fintAplChkVo.checkStatus !== checkStatus.value) {
          showToast('当前数据已被操作，请勿重复提交')
          setTimeout(() => {
            router.back(1)
          }, 1000)
          return
        }
        if (type === 'query') {
          queryVerifyHistory.orgname = vm.fintAplChkVo.counterpartyName
          getOrgVerifyHistory()
        } else if (type === 'check') {
          onSubmit()
        }
      }
    },
    () => {
      loading.value = false
    }
  )
}
const viewHistory = () => {
  router.push(`/member/project/audit/check/history/${encodeBase64(vm.fintAplChkVo.counterpartyName)}`)
}
onMounted(() => {
  if (route.value.params) {
    refcode = decodeBase64(route.value.params.refcode)
    checkStatus.value = decodeBase64(route.value.params.checkStatus)
    if (!isEmpty(refcode)) {
      submitData.refcode = refcode
      getOrgVerifyInfo('query')
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
.review-item {
  .review-name-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 28rpx;
    margin-bottom: 5rpx;
    .reviewTime {
      font-size: 24rpx;
      color: $remark-color;
    }
  }
}
.inputValueClass {
  min-height: 160rpx;
  // margin-bottom: 30rpx;
  :deep(.u-textarea__field) {
    height: auto !important;
    min-height: 160rpx !important;
  }
}
</style>
