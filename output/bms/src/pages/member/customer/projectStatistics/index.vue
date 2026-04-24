<!--
 * @Author       : longcan.Yang
 * @Date         : 2022-10-10 22:54:18
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-06-19 13:48:45
 * @Description  : 我的客户详情页面 项目统计模块
-->
<template>
  <view class="operationContainer">
    <ty-info-card @click="toToggle">
      <template #subtitle>
        <view class="operationName">
          <view>{{ '项目统计' }}</view>
          <view class="badge-margin">
            <u-badge :value="vm.projectStatistics.projectCountTotal" max="999" :show-zero="true"></u-badge>
          </view>
          <view
            v-if="getHasPermissionsById('member:customer') && vm.projectStatistics.floaArpMVoList && vm.projectStatistics.floaArpMVoList.length"
            class="toMore"
          >
            <text class="link" @click="viewInfo">更多</text>
          </view>
        </view>
      </template>
      <view class="detail">
        <view class="opponent">
          <u-row>
            <u-col class="describe" span="4">融资余额(元)</u-col>
            <u-col class="ellipsis" span="8">{{ moneyFormat(vm.projectStatistics.financingAmtTotal) }}</u-col>
          </u-row>
          <u-row>
            <u-col class="describe" span="4">放款金额(元)</u-col>
            <u-col class="ellipsis" span="8">{{ moneyFormat(vm.projectStatistics.loanAmtTotal) }}</u-col>
          </u-row>
          <u-row>
            <u-col class="describe" span="4">已还金额(元)</u-col>
            <u-col class="ellipsis" span="8">{{ moneyFormat(vm.projectStatistics.repayAmtTotal) }}</u-col>
          </u-row>
        </view>
        <view class="content">
          <view class="mainView">
            <view class="titleView">
              <u-row :wrap="false">
                <u-col class="ttClass" span="6.7">交易对手名称</u-col>
                <u-col class="ttClass" span="4">融资申请日</u-col>
                <u-col class="ttClass ta-center" span="1.3">笔数</u-col>
              </u-row>
            </view>
            <view v-if="vm.projectStatistics.floaArpMVoList && vm.projectStatistics.floaArpMVoList.length" class="listView">
              <view v-for="(item, index) in vm.projectStatistics.floaArpMVoList" :key="index" class="liView">
                <u-row :wrap="false" @click="viewDetail(item)">
                  <u-col class="ttClass ellipsis" span="6.7">{{ item.buyerName }}</u-col>
                  <u-col class="ttClass" span="4">
                    {{ dateFormat(item.applyDate) }}
                  </u-col>
                  <u-col class="ttClass ta-center" span="1.2">{{ item.countTotal }}</u-col>
                </u-row>
              </view>
            </view>
            <u-empty v-else mode="data" :text="'暂无数据'" :icon="empty" width="160" height="130" />
          </view>
        </view>
      </view>
    </ty-info-card>
  </view>
</template>
<script lang="ts">
export default {
  name: 'ProjectStatistics',
  options: {
    styleIsolation: 'shared' // 解除样式隔离
  }
}
</script>
<script setup lang="ts">
import { ProjectInfo } from '@/interfaces/member/project/query/projectStatistics'
import apiCustomer from '@/api/member/api.custormer'
import { encodeBase64 } from '@/utils/crypto'
import { dateFormat, moneyFormat } from '@/utils/format'
import { getHasPermissionsById } from '@/utils/permissions'

import empty from '@/assets/empty/empty.png'
import { useRouter } from '@/uni-simple-router'
let unfoldFlag = ref(true)
//企业流水号
const props = defineProps({ refcode: { type: Number, required: true } })
const projectStatistics: ProjectInfo = {
  orgname: '',
  projectCountTotal: 0,
  floaArpMVoList: [],
  loanAmtTotal: 0,
  financingAmtTotal: 0,
  repayAmtTotal: 0
}
const vm = reactive({
  projectStatistics: projectStatistics
})
/**
 * @Author: longcan.Yang
 * @Date: 2022-10-14 11:44:44
 * @param {*} void
 * @return {*}
 * @description: 获取项目统计数据
 */
const findProjectStatisticsPage = (): void => {
  let search = {
    data: {
      orgname: '',
      applyDateStart: '',
      applyDateEnd: '',
      refcode: props.refcode
    },
    pageNum: 1,
    pageSize: 10
  }

  apiCustomer.findProjectStatisticsPage(search).then(res => {
    vm.projectStatistics = res.data
  })
}
onMounted(() => {
  findProjectStatisticsPage()
})
const toToggle = () => {
  unfoldFlag.value = !unfoldFlag.value
}
/**
 * @Author: longcan.Yang
 * @Date: 2022-10-17 10:41:41
 * @return {*}
 * @description: 查看详情
 */
let router = useRouter()
const viewInfo = () => {
  router.push(`/member/customer/projectStatistics/info/${encodeBase64(props.refcode)}`)
}
const viewDetail = item => {
  //refcode:客户流水号，buyerName：交易对手名称,applyDate:融资申请日
  router.push(
    `/member/customer/projectStatistics/detail/${encodeBase64(props.refcode)}/${encodeBase64(item.buyerName)}/${encodeBase64(item.applyDate)}`
  )
}
</script>

<style lang="scss" scoped>
uni-cover-image {
  overflow: inherit;
}
.operationName {
  width: 100%;
  position: relative;
}
.toMore {
  text-align: right;
  font-size: 28rpx;
  position: absolute;
  font-weight: normal;
  right: 0;
  .link {
    color: #2491ec;
  }
}
.badge-margin {
  position: relative;
  left: 10rpx;
  top: -20rpx;
}
.detail {
  .content {
    border: 1rpx solid $border-color;
    margin-top: 20rpx;
    .mainView {
      .titleView {
        padding: 30rpx 20rpx;
        border-bottom: 1rpx solid $border-color;
        color: $sub-color;
        font-size: 28rpx;
      }
    }
    .liView {
      font-size: 28rpx;
      padding: 30rpx 20rpx;
      &:nth-of-type(even) {
        background: var(--u-stripe);
      }
    }
  }
  .opponent {
    font-size: 28rpx;
    margin-bottom: 30rpx;
    .describe {
      text-align: left !important;
      color: $remark-color;
      margin-top: 15rpx;
      margin-bottom: 20rpx;
    }
    .ellipsis {
      text-align: right !important;
    }
  }
  :deep(.u-row) {
    padding: 0 !important;
    .u-col-4,
    .u-col-2 {
      text-align: left !important;
    }
  }
  :deep(.u-empty) {
    padding: 10rpx;
  }
}
.ta-center {
  text-align: center !important;
}
</style>
