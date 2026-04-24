<!--
 * @Author       : longcan.Yang
 * @Date         : 2022-10-17 10:36:45
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-07-22 15:08:32
 * @Description  : 项目详情
-->
<template>
  <NavBar />
  <view class="projectDetail">
    <u-row>
      <u-col class="ellipsis" span="12">
        <view class="orgName">{{ vm.ProjectDetail.orgname }}</view>
      </u-col>
    </u-row>
    <view class="opponent">
      <u-row>
        <u-col class="describe" span="4">交易对手名称</u-col>
        <u-col class="ellipsis" span="8">{{ vm.ProjectDetail.buyerName }}</u-col>
      </u-row>
    </view>
    <view class="applyDate">
      <u-row>
        <u-col class="describe" span="4">融资申请日</u-col>
        <u-col span="6">
          <text v-if="vm.ProjectDetail.applyDate">{{ dateFormat(vm.ProjectDetail.applyDate) }}</text>
        </u-col>
        <u-col span="2">
          <view class="count">
            <view>{{ vm.ProjectDetail.countTotal }}</view>
            <view class="unit">笔</view>
          </view>
        </u-col>
      </u-row>
    </view>
  </view>
  <view class="financingInfo">
    <view v-for="item in vm.ProjectDetail.floaArpMVoList" :key="item.refcode" :class="['zooid', item.unfoldFlag ? '' : 'unLine']">
      <view>
        <view @tap="item.unfoldFlag = !item.unfoldFlag">
          <u-row class="applyNo">
            <u-col span="4"><view class="describe">融资申请编号</view></u-col>
            <u-col span="7" class="loanNo">{{ item.loanNo }}</u-col>
            <u-col span="1">
              <view class="button">
                <cover-image v-if="item.unfoldFlag" src="@/assets/member/customer/caret-bottom.png" alt="下拉" />
                <cover-image v-if="!item.unfoldFlag" src="@/assets/member/customer/caret-top.png" alt="收起" />
              </view>
            </u-col>
          </u-row>
        </view>
        <view class="status" :class="setClassName(item.approveStatus)">{{ getValueByKey(item.approveStatus, 'approveStatus') }}</view>
        <u-row v-if="item.approveStatus === '5'" class="remark">
          <u-col class="title" span="4">拒绝原因</u-col>
          <u-col class="value" span="8">{{ item.remark }}</u-col>
        </u-row>

        <view v-show="!item.unfoldFlag" class="detail">
          <view class="contain">
            <u-row>
              <u-col span="7"><view class="describeInfo">申请融资金额(元)</view></u-col>
              <u-col span="5">
                <view class="dataInfo">{{ moneyFormat(item.applyAmt) }}</view>
              </u-col>
            </u-row>
          </view>
          <view class="contain">
            <u-row v-if="item.loanSource === '1'">
              <u-col span="7"><view class="describeInfo">应收账款金额(元)</view></u-col>
              <u-col span="5">
                <view class="dataInfo">{{ moneyFormat(item.ttlInvoiceAmt) }}</view>
              </u-col>
            </u-row>
          </view>
          <view class="contain">
            <u-row>
              <u-col span="7"><view class="describeInfo">交易币种</view></u-col>
              <u-col span="5">
                <view class="dataInfo">{{ getValueByKey(item.ccyid, 'ccyid') }}</view>
              </u-col>
            </u-row>
          </view>
          <view v-if="item.approveStatus === '4'">
            <view class="contain">
              <u-row>
                <u-col span="7">
                  <view class="describeInfo">融资金额(元)</view>
                </u-col>
                <u-col span="5">
                  <view class="dataInfo">{{ moneyFormat(item.loanAmt) }}</view>
                </u-col>
              </u-row>
            </view>
            <view class="contain">
              <u-row>
                <u-col span="7">
                  <view class="describeInfo">实际放款日期</view>
                </u-col>
                <u-col span="5">
                  <view class="dataInfo">{{ dateFormat(item.loanDate) }}</view>
                </u-col>
              </u-row>
            </view>
            <view class="contain">
              <u-row>
                <u-col span="7"><view class="describeInfo">计息天数(天)</view></u-col>
                <u-col span="5">
                  <view class="dataInfo">{{ item.loanDays }}</view>
                </u-col>
              </u-row>
            </view>
            <view class="contain">
              <u-row>
                <u-col span="7"><view class="describeInfo">利息金额(元)</view></u-col>
                <u-col span="5">
                  <view class="dataInfo">{{ moneyFormat(item.intAmt) }}</view>
                </u-col>
              </u-row>
            </view>
            <view class="contain">
              <u-row>
                <u-col span="7"><view class="describeInfo">费用金额(元)</view></u-col>
                <u-col span="5">
                  <view class="dataInfo">{{ moneyFormat(item.feeAmt) }}</view>
                </u-col>
              </u-row>
            </view>
            <view class="contain">
              <u-row>
                <u-col span="7"><view class="describeInfo">预缴后金额(元)</view></u-col>
                <u-col span="5">
                  <view class="dataInfo">{{ moneyFormat(item.actualLoanAmt) }}</view>
                </u-col>
              </u-row>
            </view>

            <template v-if="item.loanSource === '1'">
              <view class="contain">
                <u-row>
                  <u-col span="7">
                    <view class="describeInfo">融资余额(元)</view>
                  </u-col>
                  <u-col span="5">
                    <view class="dataInfo">{{ moneyFormat(item.financingAmt) }}</view>
                  </u-col>
                </u-row>
              </view>
              <view class="contain">
                <u-row>
                  <u-col span="7">
                    <view class="describeInfo">已还金额(元)</view>
                  </u-col>
                  <u-col span="5">
                    <view class="dataInfo">{{ moneyFormat(item.totalRepayAmt) }}</view>
                  </u-col>
                </u-row>
              </view>
              <view class="contain">
                <u-row>
                  <u-col span="7">
                    <view class="describeInfo">结清状态</view>
                  </u-col>
                  <u-col span="5">
                    <view class="dataInfo">{{ getValueByKey(item.repayStatus, 'repayStatus') }}</view>
                  </u-col>
                </u-row>
              </view>
            </template>
          </view>
          <view class="contain last-child">
            <u-row>
              <u-col span="7"><view class="describeInfo">融资到期日</view></u-col>
              <u-col span="5">
                <view class="dataInfo">{{ dateFormat(item.loanEndDate) }}</view>
              </u-col>
            </u-row>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script lang="ts">
export default {
  name: 'ProjectStatisticsDetail',
  options: {
    styleIsolation: 'shared' // 解除样式隔离
  }
}
</script>
<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import apiCustomer from '@/api/member/api.custormer'
import { dateFormat, moneyFormat } from '@/utils/format'
import { decodeBase64 } from '@/utils/crypto'
import { getValueByKey } from '@/utils/constant'
import { ProjectDetailVo } from '@/interfaces/member/project/query/projectStatistics'
import { useRoute } from '@/uni-simple-router'
const data: ProjectDetailVo = {
  orgname: '',
  buyerName: '',
  applyDate: '',
  countTotal: 0,
  floaArpMVoList: []
}
const vm = reactive({
  ProjectDetail: data
})
const route = useRoute()
const search = {
  refcode: Number(decodeBase64(route.value.params.refcode as string)), //客户流水号
  cpOrgname: decodeBase64(route.value.params.buyerName as string), // 交易对手名称
  applyDate: decodeBase64(route.value.params.applyDate as string),
  approveStatus: decodeBase64(route.value.params.approveStatus as string) // 审批进度
}
const getCustomProjectList = () => {
  apiCustomer.getCustomProjectList(search).then(res => {
    res.data.floaArpMVoList.forEach(item => {
      item.unfoldFlag = true
    })
    vm.ProjectDetail = res.data
  })
}
onMounted(() => {
  getCustomProjectList()
})
const setClassName = (status, className = 'status') => {
  return `${className}${status}`
}
</script>

<style lang="scss" scoped>
.projectDetail {
  padding: 40rpx 30rpx 0;
  border-bottom: 1rpx solid $border-color;
  margin-bottom: 40rpx;

  .orgName {
    font-size: 32rpx;
    margin-bottom: 30rpx;
  }
  .applyDate,
  .opponent {
    font-size: 28rpx;
    margin-bottom: 30rpx;
    .describe {
      color: $remark-color;
    }
    .count {
      display: flex;
      text-align: right;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      .unit {
        margin-left: 2rpx;
        // margin-top: -4rpx;
      }
    }
  }
}
.financingInfo {
  margin: 40rpx 30rpx 0;
  .zooid {
    border-bottom: 1rpx solid $border-color;
    margin-bottom: 40rpx;
    &.unLine {
      border-bottom: none;
    }
  }
  .applyNo {
    font-size: 28rpx;
    align-items: flex-start !important;
    .loanNo {
      white-space: pre-wrap;
    }
    .button {
      text-align: right;
      cover-image {
        width: 22rpx;
      }
    }
  }
  .status {
    margin: 30rpx 0 20rpx 0;
    font-size: 24rpx;
    &.status1 {
      color: #09a269;
    }
    &.status2 {
      color: #1a89f2;
    }
    &.status3 {
      color: #1a89f2;
    }
    &.status4 {
      color: #09a269;
    }
    &.status5 {
      color: $danger;
    }
  }
  .remark {
    font-size: 24rpx;
    margin-bottom: 30rpx;
    font-size: 28rpx;
    align-items: flex-start !important;
    .title {
      color: $remark-color;
    }
    .value {
      color: #000;
      white-space: pre-wrap;
    }
  }
  .detail {
    padding: 0 30rpx;
    box-shadow: 0 2rpx 6rpx 0 rgba(0, 0, 0, 0.1);
    .contain {
      font-size: 28rpx;
      padding: 30rpx 19rpx 27rpx 18rpx;
      border-bottom: 1rpx solid $border-color;
      &.last-child {
        border-bottom: none;
      }
      .dataInfo {
        text-align: right;
      }
      .describeInfo {
        color: $remark-color;
      }
    }
  }
}
</style>
