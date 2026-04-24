<!--
 * @Author       : Codex
 * @Date         : 2026-04-24 17:04:00
 * @LastEditors  : Codex
 * @LastEditTime : 2026-04-24 17:04:00
 * @Description  : 项目-业务审核-开票审核新增 /member/project/audit/invoiceReview
-->
<template>
  <view>
    <NavBar />
    <view class="invoice-review-page">
      <view class="search-box">
        <up-search
          v-model="search.data.queryCondition"
          v-insert-clear:[search.data.queryCondition]="resetSearch"
          :clearabled="false"
          :search-icon-size="0"
          placeholder="请输入开票企业名称/申请书编号"
          :show-action="true"
          :action-style="{ color: '#395fee' }"
          @search="searchProjectPage"
          @custom="searchProjectPage"
        />
      </view>

      <up-sticky bg-color="#fff">
        <view class="head-tabs">
          <view class="tabs-line"></view>
          <ty-tabs :tabs="vm.tabsList" :current="tabIndex" @change="selectTab"></ty-tabs>
        </view>
      </up-sticky>

      <view class="content">
        <uni-list v-if="vm.invoiceReviewList.length">
          <uni-list-item v-for="item in vm.invoiceReviewList" :key="item.refcode" class="list-item">
            <u-cell-group class="contentData" :border="false" :stop="true">
              <view class="header-row">
                <u-row>
                  <u-col span="7">
                    <view class="text ellipsis">{{ item.appOrgName }}</view>
                  </u-col>
                  <u-col span="5">
                    <view class="status-box">
                      <view class="status" :class="`status${item.showStatus}`">
                        {{ getValueByKey(item.showStatus, 'fgaiAppStatus') }}
                      </view>
                    </view>
                  </u-col>
                </u-row>
              </view>

              <u-cell :stop="false" title="申请书编号" :value="item.applyNo" :border="false" />
              <u-cell :stop="false" title="开票类型" :value="getValueByKey(item.generateType, 'generateType')" :border="false" />
              <u-cell :stop="false" title="申请开票金额(元)" :border="false">
                <template #value>
                  <view class="apply-amt">
                    <text v-if="item.generateAmt !== 0" class="ccyid">{{ item.ccyid }}</text>
                    <text>{{ item.generateAmt === 0 ? '' : moneyFormat(item.generateAmt) }}</text>
                  </view>
                </template>
              </u-cell>
            </u-cell-group>
            <view class="line"></view>
          </uni-list-item>

          <view v-if="finished" class="list-is-finished">已经到底了</view>
        </uni-list>

        <u-empty v-else mode="data" text="暂无数据" :icon="empty" width="300" height="244" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import apiInvoiceReview from '@/api/member/project/audit/api.invoiceReview'
import empty from '@/assets/empty/empty.png'
import { InvoiceReviewListItem, Search } from '@/interfaces/member/project/audit/invoiceReview'
import { getValueByKey } from '@/utils/constant'
import { moneyFormat } from '@/utils/format'
import { onReachBottom, onPullDownRefresh, onShow } from '@dcloudio/uni-app'

const finished = ref(false)
const tabIndex = ref(0)
const totalCount = ref(0)

const search = reactive<Search>({
  data: {
    queryCondition: '',
    tabStatus: '11'
  },
  pageNum: 1,
  pageSize: 10
})

const vm = reactive({
  invoiceReviewList: [] as InvoiceReviewListItem[],
  tabsList: [
    { name: '待审核', value: 0, appStatus: '11' },
    { name: '已退回', value: 0, appStatus: '2' },
    { name: '已通过', value: 0, appStatus: '1' },
    { name: '已拒绝', value: 0, appStatus: '0' }
  ]
})

const getInvoiceReviewCount = () => {
  apiInvoiceReview
    .getInvoiceReviewCount({
      queryCondition: search.data.queryCondition
    })
    .then(res => {
      vm.tabsList = [
        { name: '待审核', value: res.data.ingCount, appStatus: '11' },
        { name: '已退回', value: res.data.returnCount, appStatus: '2' },
        { name: '已通过', value: res.data.passedCount, appStatus: '1' },
        { name: '已拒绝', value: res.data.refuseCount, appStatus: '0' }
      ]
    })
}

const findInvoiceReviewPage = () => {
  getInvoiceReviewCount()
  apiInvoiceReview.findInvoiceReviewPage(search).then(res => {
    if (res.data.invoiceReviewList?.length) {
      vm.invoiceReviewList.push(...res.data.invoiceReviewList)
    }
    totalCount.value = res.totalCount as number
    if (totalCount.value === vm.invoiceReviewList.length && totalCount.value > 0) {
      finished.value = true
    }
  })
}

const searchProjectPage = () => {
  vm.invoiceReviewList = []
  search.pageNum = 1
  finished.value = false
  findInvoiceReviewPage()
}

const resetSearch = () => {
  search.data.queryCondition = ''
  searchProjectPage()
}

const selectTab = item => {
  tabIndex.value = item.index
  search.data.tabStatus = item.appStatus
  searchProjectPage()
}

onReachBottom(() => {
  if (search.pageNum < Math.ceil(totalCount.value / search.pageSize)) {
    search.pageNum++
    findInvoiceReviewPage()
  }
})

onPullDownRefresh(() => {
  searchProjectPage()
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 600)
})

onShow(() => {
  searchProjectPage()
})
</script>

<style lang="scss" scoped>
.invoice-review-page {
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
      bottom: 0;
    }
  }

  .list-item {
    .line {
      width: 100%;
      height: 20rpx;
      background: #f6f6f6;
    }
  }

  :deep(.u-cell-group) {
    margin: 0;
  }

  :deep(.u-cell-group__wrapper) {
    padding-left: 30rpx;
    padding-right: 30rpx;
  }
}

.header-row {
  margin-bottom: 20rpx;

  .u-row {
    height: 48rpx;

    .text {
      font-size: 32rpx;
      font-weight: bold;
      text-overflow: ellipsis;
      overflow: hidden;
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

        &.status0 {
          border: 1rpx solid $danger;
          color: $danger;
        }

        &.status1,
        &.status4,
        &.status11-1 {
          border: 1rpx solid $success;
          color: $success;
        }
      }
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
</style>
