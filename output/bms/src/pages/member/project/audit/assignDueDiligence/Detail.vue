<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-10-27 10:48:09
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-11-11 10:16:47
 * @Description  : 项目-业务审核-指派尽调-指派尽调-详情 /member/project/audit/assignDueDiligence/detail
-->
<template>
  <view>
    <NavBar></NavBar>
    <up-sticky bg-color="#fff">
      <view class="head-tabs" :class="`selectTab${tabIndex}`">
        <view class="tabs-line"></view>
        <u-tabs
          :list="vm.tabsList"
          line-color="#138BEC"
          :active-style="{
            color: '#138BEC',
            fontSize: '32rpx'
          }"
          :inactive-style="{
            color: '#666666',
            fontSize: '28rpx'
          }"
          line-width="50"
          line-height="4"
          @click="selectTab"
        ></u-tabs>
      </view>
    </up-sticky>
    <!-- 基本信息 -->
    <view v-if="tabIndex === 0">
      <ty-info-card title="客户基本信息" :show-line="false">
        <view class="card-cell-group">
          <u-cell-group>
            <u-cell :stop="false" title="客户名称" :value="vm.dueDiligenceInfo.orgname" :border="false" />
            <u-cell :stop="false" title="所在国/地区" :value="vm.dueDiligenceInfo.ctyDesc" :border="false" />
            <u-cell :stop="false" title="主要经营范围" :value="vm.dueDiligenceInfo.businessScope" :border="false" />
            <u-cell :stop="false" title="经营地址" :value="vm.dueDiligenceInfo.operateAddress" :border="false" />
            <u-cell :stop="false" title="成立时间" :value="vm.dueDiligenceInfo.regDate" :border="false" />
            <u-cell :stop="false" title="法人" :value="vm.dueDiligenceInfo.legalPerson" :border="false" />
            <u-cell :stop="false" title="法人联系电话" :value="vm.dueDiligenceInfo.legalPhone" :border="false" />
            <u-cell :stop="false" title="联系人姓名" :value="vm.dueDiligenceInfo.legalLinkman" :border="false" />
            <u-cell :stop="false" title="联系人电话" :value="vm.dueDiligenceInfo.legalLinkmanPhone" :border="false" />
          </u-cell-group>
        </view>
      </ty-info-card>
      <!-- 一期暂时屏蔽交易信息 -->
      <!-- <ty-info-card title="交易信息">
        <OrgHisTradeList v-if="vm.dueDiligenceInfo.orgHisTradeList" :org-his-trade-list="vm.dueDiligenceInfo.orgHisTradeList"></OrgHisTradeList>
      </ty-info-card> -->
      <ty-info-card v-if="vm.dueDiligenceInfo.assistUsers" title="协销人员">
        <view class="assist-superior">{{ vm.dueDiligenceInfo.assistUsers }}</view>
      </ty-info-card>
      <ty-info-card v-if="vm.dueDiligenceInfo.creditUsers" title="征信人员">
        <view class="assist-superior">{{ vm.dueDiligenceInfo.creditUsers }}</view>
      </ty-info-card>
      <!-- 选择协销人员 -->
      <ty-info-card title="现场尽调人员">
        <view class="assist-superior">{{ activeNames }}</view>
      </ty-info-card>
      <ty-info-card title="设置尽调截止日">
        <view class="assist-superior">{{ dateFormat(vm.dueDiligenceInfo.endDate || '') }}</view>
      </ty-info-card>
      <ty-info-card title="尽调任务要求">
        <view class="assist-superior">{{ vm.dueDiligenceInfo.remark }}</view>
      </ty-info-card>
    </view>
    <!-- 尽调结果 -->
    <DueDiligenceResult v-if="tabIndex === 1" :refcode="refcode"></DueDiligenceResult>
    <!-- 尽调历程 -->
    <DueDiligenceHistory v-if="tabIndex === 2" :orgname="vm.dueDiligenceInfo.orgname"></DueDiligenceHistory>

    <view v-if="getHasPermissionsById('member:project:audit:assignDueDiligence:insert') && againCddFlag" class="button-fixed-bottom">
      <view class="placeholder"></view>
      <view class="fixed">
        <u-button block type="primary" class="submit" native-type="submit" @click="onceAgain()">再次尽调</u-button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import { AssignDiligenceInfo, OrgnameList, OptionalCddUserList } from '@/interfaces/member/project/audit/assignDueDiligence'
import apiAssignDueDiligence from '@/api/member/project/audit/api.assignDueDiligence'
import { getHasPermissionsById } from '@/utils/permissions'
import { useRoute, useRouter } from '@/uni-simple-router'
import { encodeBase64, decodeBase64 } from '@/utils/crypto'
// import OrgHisTradeList from './components/OrgHisTradeList.vue'

import { dateFormat } from '@/utils/format'
import DueDiligenceResult from './components/DueDiligenceResult.vue'
import DueDiligenceHistory from './components/DueDiligenceHistory.vue'
// import { redirectTo } from '@/utils/uniapp'
const route = useRoute()
const router = useRouter()
let tabIndex = ref(0) // 当前选中的持仓状态序号
const againCddFlag = ref(false)
let tabsList = [
  {
    name: '基本信息'
  },
  {
    name: '尽调结果'
  },
  {
    name: '尽调历程'
  }
]
let activeNames = ref('') // 选择人员默认活跃态人员

const orgnameList: OrgnameList[] = []
const optionalCddUserList: OptionalCddUserList[] = []
const cddUserNameList: string[] = [] // 已开始尽调的人员
const dueDiligenceInfo: AssignDiligenceInfo = {
  cddUserList: [],
  optionalCddUsers: '',
  appointStatus: '',
  orgname: '',
  creditUsers: '',
  assistUsers: '',
  refcode: '',
  ctyDesc: ''
}
let refcode = ref(0)
let vm = reactive({
  dueDiligenceInfo,
  orgnameList,
  optionalCddUserList,
  tabsList: tabsList,
  cddUserNameList,
  alreadyJoinCddUserList: optionalCddUserList // 已选择的尽调人员
})
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:31:01
 * @description: 切换tab
 */
const selectTab = item => {
  tabIndex.value = item.index
  switch (item.index) {
    default:
      break
  }
}
// 指派尽调可选协销人员查询
const queryOptionalCddUserList = () => {
  const data = {
    orgname: vm.dueDiligenceInfo.orgname
  }
  apiAssignDueDiligence.queryOptionalCddUserList(data).then(res => {
    vm.optionalCddUserList = res.data.optionalCddUserList
    // 初始化默认选中
    let temList: string[] = []
    let selectIds: { cddUserid: string }[] = []
    if (refcode.value) {
      // 修改指派||再次尽调
      vm.alreadyJoinCddUserList.forEach(item => {
        const index = vm.optionalCddUserList.findIndex(obj => item.cddUserName === obj.cddUserName)
        if (index !== -1) {
          // 修改指派尽调||再次尽调 带入选中的尽调人员
          vm.optionalCddUserList.splice(index, 1, item)
          temList.push(item.cddUserName)
          selectIds.push(item)
        } else {
          // 修改指派尽调，未匹配上也带入
          temList.push(item.cddUserName)
          selectIds.push(item)
        }
      })
    }
    activeNames.value = temList.join(',') // 展示
    vm.dueDiligenceInfo.cddUserList = selectIds // 提交服务端
  })
}
// 指派尽调详情查询
const queryDueDiligenceInfo = () => {
  apiAssignDueDiligence.queryDueDiligenceInfo(refcode.value).then(res => {
    // 正常列表进入
    vm.dueDiligenceInfo = {
      ...res.data.orgInfo,
      regDate: dateFormat(res.data.orgInfo.regDate || ''),
      orgHisTradeList: res.data.orgHisTradeList
    }
    vm.alreadyJoinCddUserList = res.data.alreadyJoinCddUserList
    queryOptionalCddUserList()
  })
}
const checkOrgAgainCddFlag = () => {
  apiAssignDueDiligence.checkOrgAgainCddFlag(refcode.value).then(res => {
    againCddFlag.value = res.data.orgAgainCddFlag
  })
}
// 再次尽调
const onceAgain = () => {
  router.push(`/member/project/audit/assignDueDiligence/edit/${encodeBase64(refcode.value)}/${encodeBase64(vm.dueDiligenceInfo.orgname)}`)
  // redirectTo(`/member/project/audit/assignDueDiligence/edit/${encodeBase64(refcode.value)}/${encodeBase64(vm.dueDiligenceInfo.orgname)}`)
}
watch(
  () => route.value.fullPath,
  newPath => {
    if (newPath) {
      refcode.value = Number(decodeBase64(route.value.params.refcode)) // 指派尽调流水号
      if (refcode.value) {
        tabIndex.value = 0
        // 列表进入查详情，
        queryDueDiligenceInfo()
        checkOrgAgainCddFlag()
      }
    }
  }
)
onMounted(async () => {
  refcode.value = Number(decodeBase64(route.value.params.refcode)) // 指派尽调流水号
  if (refcode.value) {
    // 列表进入查详情，
    queryDueDiligenceInfo()
    checkOrgAgainCddFlag()
  }
})
</script>

<style lang="scss" scoped>
.assist-superior {
  min-height: 30rpx;
  margin-bottom: 30rpx;
  line-height: 40rpx;
}

:deep(.u-sticky) {
  top: 44px !important;
}
.head-tabs {
  margin-top: 10rpx;
  position: relative;
  .tabs-line {
    position: absolute;
    width: 100%;
    height: 1rpx;
    background-color: #dedede;
    bottom: 4rpx;
  }
  :deep(.u-tabs) {
    // .u-tabs__wrapper__nav {
    //   // justify-content: space-around;
    // }
    .u-tabs__wrapper__nav__item {
      padding: 0;
      width: 33.3%;
      box-sizing: border-box;
    }
  }
  &.selectTab0 {
    :deep(.u-tabs) {
      .u-tabs__wrapper__nav__line {
        transform: translate(90rpx) !important;
      }
    }
  }
  &.selectTab1 {
    :deep(.u-tabs) {
      .u-tabs__wrapper__nav__line {
        transform: translate(352rpx) !important;
      }
    }
  }
  &.selectTab2 {
    :deep(.u-tabs) {
      .u-tabs__wrapper__nav__line {
        transform: translate(602rpx) !important;
      }
    }
  }
}
:deep(.u-cell-group__wrapper) {
  .u-cell {
    padding-bottom: 20rpx;
  }
}
</style>
