<!--
 * @Author       : Charon.Lin
 * @Date         : 2026-02-27 11:08:15
 * @LastEditors  : aolin.qu
 * @LastEditTime : 2026-03-18 10:28:11
 * @Description  : 选择已开发票
-->
<template>
  <view>
    <NavBar></NavBar>
    <view class="business-access">
      <view class="search-box">
        <up-search
          v-model="search.data.queryCondition"
          v-insert-clear:[search.data.queryCondition]="resetSearch"
          :clearabled="false"
          :search-icon-size="0"
          placeholder="请输入开票企业名称/开票金额"
          :show-action="true"
          :action-style="{ color: '#395fee' }"
          @search="searchProjectPage"
          @custom="searchProjectPage"
        ></up-search>
      </view>
      <view class="content">
        <uni-list v-if="vm.fgaiAppList && vm.fgaiAppList.length">
          <view v-for="item in vm.fgaiAppList" :key="item.refcode" class="list-item">
            <uni-list-item>
              <u-cell-group class="contentData" :border="false" :stop="true" @tap="viewDetail(item.refcode)">
                <view class="financingNo">
                  <u-row>
                    <u-col :span="8">
                      <view class="text ellipsis">{{ item.appNo }}</view>
                    </u-col>
                    <u-col :span="4">
                      <view class="invoice-select">
                        <checkbox-group @change="value => checkboxChange(item, value)">
                          <checkbox value="1" :checked="item.checked === '1'"></checkbox>
                        </checkbox-group>
                      </view>
                    </u-col>
                  </u-row>
                </view>

                <u-cell :stop="false" title="开票企业名称" :value="item.appOrgName" :border="false" />
                <u-cell :stop="false" title="开票日期" :value="dateFormat(item.appDate)" :border="false" />
                <u-cell :stop="false" title="开票金额(元)" :border="false">
                  <template #value>
                    <view class="apply-amt">
                      <text class="ccyid">{{ item.ccyid }}</text>
                      <text>{{ moneyFormat(item.generateAmt) }}</text>
                    </view>
                  </template>
                </u-cell>
              </u-cell-group>
              <view class="line"></view>
            </uni-list-item>
          </view>

          <view v-if="finished" class="list-is-finished">已经到底了</view>
        </uni-list>
        <u-empty v-else mode="data" :text="'暂无数据'" :icon="empty" width="300" height="244"></u-empty>
      </view>
      <view v-if="vm.fgaiAppList && vm.fgaiAppList.length" class="button-fixed-bottom">
        <view class="placeholder"></view>
        <view class="fixed">
          <u-button block type="primary" native-type="submit" @click="submit">提交</u-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import apiInvoice from '@/api/member/myinfo/api.invoice'
import { onReachBottom, onShow, onPullDownRefresh } from '@dcloudio/uni-app'
import { FgaiAppList, BindInvoice } from '@/interfaces/member/myinfo/invoice'
import empty from '@/assets/empty/empty.png'
import { useRouter, useRoute } from '@/uni-simple-router'
import { encodeBase64, decodeBase64 } from '@/utils/crypto'
import { dateFormat, moneyFormat } from '@/utils/format'
import { showToast } from '@/utils/uniapp/toast'
import { setStorage } from '@/utils/storages'
const route = useRoute()
const applyNo = decodeBase64(route.value.params.applyNo)
const refcode = decodeBase64(route.value.params.refcode)
const orgname = decodeBase64(route.value.params.orgname)
const ctyid = decodeBase64(route.value.params.ctyid)
const ccyid = decodeBase64(route.value.params.ccyid)

const router = useRouter()
let finished = ref(false) // 数据是否已加载完
// 用于搜索请求的数据
const search = reactive({
  data: {
    applyNo: applyNo,
    paymentCcyid: ccyid,
    queryCondition: ''
  },
  pageNum: 1,
  pageSize: 10
})
let fgaiAppList: FgaiAppList[] = []

const vm = reactive({
  fgaiAppList: fgaiAppList
})
let totalCount = ref(0)
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:14:44
 * @description: 获取业务准入列表
 */
const getBeforeInvoiceList = () => {
  apiInvoice.getBeforeInvoiceList(search).then(res => {
    if (res.data.fgaiAppList && res.data.fgaiAppList.length) {
      vm.fgaiAppList.push(...res.data.fgaiAppList)
    }
    totalCount.value = res.totalCount as number
    if (totalCount.value === vm.fgaiAppList.length && totalCount.value > 0) {
      finished.value = true
    }
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:31:01
 * @description: 点击搜索
 */
const searchProjectPage = () => {
  vm.fgaiAppList = []
  search.pageNum = 1
  finished.value = false
  getBeforeInvoiceList()
}
const resetSearch = () => {
  search.data.queryCondition = ''
  searchProjectPage()
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:32:39
 * @description: 发票详情
 */
const viewDetail = invoiceRefcode => {
  router.push(`/member/myinfo/invoice/detail/${encodeBase64(invoiceRefcode)}`)
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-09-22 15:29:16
 * @description: 上划加载更多数据
 */
onReachBottom(() => {
  if (search.pageNum < Math.ceil(totalCount.value / search.pageSize)) {
    search.pageNum++
    getBeforeInvoiceList()
  }
})
onPullDownRefresh(() => {
  searchProjectPage()
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 600)
})
const checkboxChange = (item, e: any) => {
  item.checked = e.detail.value.includes('1') ? '1' : '0'
}
// 提交数据
let submitData = reactive<BindInvoice>({
  applyNo: applyNo,
  fgaiAppList: []
})
const submit = () => {
  const selectedInvoices = vm.fgaiAppList.filter(item => item.checked === '1')
  if (selectedInvoices.length === 0) {
    showToast('请选择至少一条数据')
    return
  }
  //发票类型，币种，税号，开票企业名称必须一致
  const ccyidSet = new Set(selectedInvoices.map(item => item.ccyid))
  const taxNoSet = new Set(selectedInvoices.map(item => item.appCreditCode))
  const appOrgNameSet = new Set(selectedInvoices.map(item => item.appOrgName))
  const billTypeSet = new Set(selectedInvoices.map(item => item.billType))
  const invoiceTypeList = selectedInvoices.map(item => item.invoiceType)
  // 国际发票业务无需校验税号
  const hasNoType1 = invoiceTypeList.some(type => type !== '1')
  if (appOrgNameSet.size > 1) {
    showToast('开票企业名称不一致')
    return
  }
  if (hasNoType1 && taxNoSet.size > 1) {
    showToast('开票税号不一致')
    return
  }
  if (ccyidSet.size > 1) {
    showToast('开票币种不一致')
    return
  }
  if (billTypeSet.size > 1) {
    showToast('发票类型不一致')
    return
  }
  submitData.fgaiAppList = selectedInvoices.map(item => ({
    refcode: item.refcode,
    appNo: item.appNo
  }))
  apiInvoice.doBindBusinessApp(submitData).then(() => {
    showToast('操作成功')
    const data = {
      refcode,
      orgname,
      ctyid
    }
    setStorage('invoiceData', JSON.stringify(data))
    router.back(1)
  })
}

onShow(() => {
  searchProjectPage()
})
</script>

<style lang="scss" scoped>
.business-access {
  .search-box {
    padding-bottom: 0;
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
  .line {
    margin-top: 20rpx;
    width: 100%;
    height: 20rpx;
    background: #f6f6f6;
  }
  .list-item {
    &:last-of-type {
      .line {
        height: 2rpx;
      }
    }
  }
  :deep(.contentData) {
    .u-cell {
      padding-bottom: 20rpx;
      .u-cell__value {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .financingNo {
      margin-bottom: 20rpx;
      .u-row {
        height: 48rpx;
        .text {
          font-size: 32rpx;
          font-weight: bold;
        }
        .status-box {
          display: flex;
          justify-content: flex-end;
          .status {
            border: 1rpx solid $warning;
            color: $warning;
            border-radius: 5rpx;
            padding: 10rpx 16rpx;
            text-align: center;
            font-size: 26rpx;
            &.status2 {
              border: 1rpx solid $u-success;
              color: $u-success;
            }
            &.status5 {
              border: 1rpx solid $u-error;
              color: $u-error;
            }
          }
        }
      }
    }
  }
}
.invoice-select {
  position: absolute;
  right: 0;
  top: -6rpx;
  :deep(.uni-checkbox-wrapper) {
    .uni-checkbox-input {
      border-color: $primary;
    }
  }
}
.apply-amt {
  line-height: 48rpx;
  font-size: 28rpx;
  display: flex;
  width: 100%;
  justify-content: flex-end;
  .ccyid {
    margin-right: 7rpx;
  }
}
.submit {
  color: #fff;
}
</style>
