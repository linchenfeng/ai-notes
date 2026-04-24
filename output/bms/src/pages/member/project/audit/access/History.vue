<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-11-05 09:58:39
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-01-21 17:23:47
 * @Description  : 企业核查历程
-->
<template>
  <NavBar></NavBar>
  <view v-if="vm.hisCheckList.length" class="qa-list">
    <u-collapse ref="collapseRef" :value="opinionActive" :border="false">
      <u-collapse-item name="1" :border="false">
        <template #title>
          <view class="collapse-item-title">
            <view class="sub-content">
              <view class="u-cell__title-text orgname">{{ queryVerifyHistory.orgname }}</view>
            </view>
          </view>
        </template>
        <view>
          <view v-if="showApplyCheck && hasVerifyUsers" class="inviteWrite" @click.stop="applyCheck">
            <text class="name">发起核查</text>
          </view>
          <view v-for="(item, index) in vm.hisCheckList" :key="index" class="qa-list-box">
            <view class="left-box">
              <text class="iconfont icon-yiwen"></text>
              <view v-if="index !== vm.hisCheckList.length - 1" class="line"></view>
            </view>
            <view class="right-box">
              <view class="question-title">
                <text class="quiz">
                  <text class="name">{{ cutEnStr(item.applyUsername) }}</text>
                  <text>发起核查：</text>
                </text>
                <text class="time">{{ dateFormat(item.applyDate, 2) }}</text>
              </view>
              <view class="question">
                <text>{{ item.applyRemark }}</text>
              </view>
              <view
                v-for="(obj, i) in item.remarkList"
                :key="i"
                class="answer-box"
                :class="index === vm.hisCheckList.length - 1 && i === item.remarkList.length - 1 ? 'lastAnswer' : ''"
              >
                <view class="answer-title">
                  <text class="iconfont icon-huifu"></text>
                  <text class="quiz text">
                    <text class="name">{{ cutEnStr(obj.checkUsername) }}</text>
                    <text>核查反馈：</text>
                  </text>
                  <text class="time">{{ dateFormat(obj.checkDate, 2) }}</text>
                </view>
                <view class="answersClass">
                  {{ obj.checkRemark }}
                </view>
              </view>
            </view>
          </view>
        </view>
      </u-collapse-item>
    </u-collapse>
  </view>
  <check-org-pop
    v-if="showCheckPop"
    :refcode="refcode"
    :dtc-refcode="dtcRefcode"
    :orgname="queryVerifyHistory.orgname"
    @cancel="showCheckPop = false"
    @confirm="confirmCheck"
  />
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import apiCheck from '@/api/member/project/audit/api.check'
import { useRoute } from '@/uni-simple-router'
import { decodeBase64 } from '@/utils/crypto'
import { dateFormat } from '@/utils/format'
import { QueryVerifyHistory, HisCheckList } from '@/interfaces/member/project/audit/check'
import CheckOrgPop from './components/CheckOrgPop.vue'
import { FintAplMVo } from '@/interfaces/member/project/apply/businessApply'
import apiBusinessApply from '@/api/member/project/apply/api.businessApply'
let loading = ref(false)
const opinionActive = ref(['1'])
const collapseRef = ref()
let showCheckPop = ref(false)
let refcode = '' //准入流水号
let dtcRefcode = '' //买方流水号
const route = useRoute()
let showApplyCheck = ref(false)
let hasVerifyUsers = ref(false) //是否存在核查人员
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
  finalApproval: '',
  approveLevel: 0,
  oneLevelUserName: '',
  oneLevelApproveDate: '',
  customType: '',
  fintAplDtcVoList: []
}
// 历程查询条件
let queryVerifyHistory = reactive<QueryVerifyHistory>({
  orgname: '',
  excludeRemarkRefcodeList: [],
  queryType: '1'
})
let hisCheckList: HisCheckList[] = []
let vm = reactive({
  hisCheckList: hisCheckList,
  self: self
})
const getOrgVerifyHistory = () => {
  loading.value = true
  apiCheck.getOrgVerifyHistory(queryVerifyHistory).then(
    res => {
      if (res) {
        loading.value = false
        vm.hisCheckList = res.data.hisCheckList
        nextTick(() => {
          collapseRef.value.init()
        })
      }
    },
    () => {
      loading.value = false
    }
  )
}
const applyCheck = () => {
  showCheckPop.value = true
}
const confirmCheck = () => {
  showCheckPop.value = false
  getOrgVerifyHistory()
}
const getOverseasBusinessInfo = () => {
  apiBusinessApply.getOverseasBusinessInfo(refcode).then(res => {
    vm.self = res.data
    // eslint-disable-next-line no-extra-parens
    if (
      (vm.self.intLoanStatus === '1' && ((vm.self.examineType === 'F' && vm.self.approvalFlag === '1') || Number(vm.self.operationLevel) > 0)) ||
      vm.self.intLoanStatus === '9'
    ) {
      showApplyCheck.value = true
      nextTick(() => {
        collapseRef.value.init()
      })
    }
  })
}
// 获取核查人员
const getVerifyUserInfo = () => {
  apiCheck.getVerifyUserInfo(refcode).then(res => {
    if (res.data.verifyUsers && res.data.verifyUsers.length) {
      hasVerifyUsers.value = true
      nextTick(() => {
        collapseRef.value.init()
      })
    }
  })
}
const cutEnStr = str => {
  if (!str) {
    return
  }
  const regex = /\([^()]*?\)/g
  const result = str.replace(regex, '')
  return result
}
onMounted(() => {
  // 路由带参
  if (route.value.params) {
    queryVerifyHistory.orgname = decodeBase64(route.value.params.orgname) // 买方名称
    refcode = decodeBase64(route.value.params.refcode) // 准入流水号
    dtcRefcode = decodeBase64(route.value.params.dtcRefcode) // 买方流水号
    getOrgVerifyHistory()
    getOverseasBusinessInfo()
    getVerifyUserInfo()
  }
})
</script>

<style lang="scss" scoped>
.content {
  font-size: 28rpx;
  line-height: 46rpx;
  color: $sub-color;
  &.summaryRemark {
    color: #333;
    margin-top: 0;
  }
}
.review-item {
  margin-bottom: 30rpx;
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
.qa-list {
  padding: 0;
  background-color: #f6f6f6;
  :deep(.u-cell__left-icon-wrap) {
    margin-right: 0 !important;
  }
  :deep(.u-cell__body) {
    padding: 27rpx 30rpx !important;
  }
  :deep(.u-collapse-item) {
    background-color: #fff;
    box-shadow: none;
    margin-bottom: 0;
    .u-cell--clickable.u-cell {
      background-color: #fff;
    }
  }
  .qa-list-box {
    display: flex;
    align-items: stretch;
    .left-box {
      height: inherit;
      .iconfont {
        height: 32rpx;
        color: #e75934;
      }
      .line {
        width: 1rpx;
        height: calc(100% - 32rpx - 20rpx);
        border-left: 1rpx dashed #d2d2d2;
        margin: 8rpx 0 0 50%;
        transform: translateX(-50%);
      }
    }
    .right-box {
      width: calc(100% - 32rpx - 30rpx);
      // margin-bottom: 10rpx;
      margin-left: 15rpx;
      .quiz {
        color: $sub-color;
        .name {
          margin-right: 6rpx;
          font-weight: bold;
          color: $default-color;
        }
      }
      .time {
        color: $remark-color;
      }
      .question-title {
        font-size: 26rpx;
        margin-bottom: 18rpx;
        display: flex;
        justify-content: space-between;
      }
      .question {
        font-size: 28rpx;
        margin-bottom: 26rpx;
        line-height: 44rpx;
        color: $default-color;
        // line-height: 26rpx;
        .iconfont {
          display: inline-block;
          margin-left: 10rpx;
          vertical-align: middle;
          font-size: 28rpx;
          color: $sub-color;
          line-height: 44rpx;
          height: 44rpx;
        }
      }
      .answer-box {
        background-color: #f6f6f6;
        border-radius: 10rpx;
        padding: 20rpx 10rpx;
        margin-bottom: 26rpx;
        .answer-title {
          display: flex;
          margin-bottom: 18rpx;
          font-size: 26rpx;
          // justify-content: space-between;
          .iconfont {
            // font-size: 36rpx;
            color: #1a98ff;
          }
          .text {
            margin-left: 15rpx;
          }
          .time {
            margin-left: auto;
          }
        }
        .answersClass {
          margin: 0 0 0 51rpx;
          color: $default-color;
          line-height: 44rpx;
          white-space: pre-wrap;
        }
        &.lastAnswer {
          margin-bottom: 34rpx;
        }
      }
    }
  }
}
.sub-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .orgname {
    word-break: break-all;
  }
}
.inviteWrite {
  background-color: #e4f2fd;
  border-color: #e4f2fd;
  color: #138bec;
  padding: 15rpx;
  border-radius: 6rpx;
  font-weight: normal;
  text-align: center;
  margin-bottom: 20rpx;
}
</style>
