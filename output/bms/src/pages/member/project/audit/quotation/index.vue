<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-07-11 11:19:50
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-01-29 16:56:24
 * @Description  :  项目-业务审核-业务报价 /project/audit/quotation
-->
<template>
  <view>
    <NavBar></NavBar>
    <view class="business-access">
      <view class="search-box">
        <up-search
          v-model="search.data.buyerOrgname"
          v-insert-clear:[search.data.buyerOrgname]="resetSearch"
          :clearabled="false"
          :search-icon-size="0"
          placeholder="请输入买方名称/申请编号/客户经理/业务主管"
          :show-action="true"
          :action-style="{ color: '#395fee' }"
          @search="searchSpecialAppPage"
          @custom="searchSpecialAppPage"
        ></up-search>
      </view>
      <up-sticky bg-color="#fff">
        <view class="head-tabs" :class="`selectTab${tabIndex}`">
          <view class="tabs-line"></view>
          <u-tabs
            v-model:current="tabIndex"
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
      <view class="content">
        <uni-list v-if="vm.quotaList && vm.quotaList.length">
          <uni-list-item v-for="item in vm.quotaList" :key="item.refcode" class="list-item" @tap="viewDetail(item.refcode, item.quotaStatus)">
            <u-cell-group class="listData" :border="false">
              <view class="orgname">
                <u-row>
                  <u-col span="8">
                    <view class="text ellipsis">{{ item.buyerOrgname }}</view>
                  </u-col>
                  <u-col span="4">
                    <view class="status-box">
                      <view class="status" :class="`status${item.quotaStatus}`">
                        {{ getValueByKey(item.quotaStatus, 'intClQuotaStatus') }}
                      </view>
                    </view>
                  </u-col>
                </u-row>
              </view>
              <u-cell :stop="false" title="所在国" :value="item.buyerCtyDesc" :border="false" />
              <u-cell :stop="false" title="申请编号" :value="item.applyNo" :border="false" />
              <u-cell :stop="false" title="客户经理" :value="item.userName" :border="false" />
              <u-cell :stop="false" title="业务主管" :value="item.superiorName" :border="false" />
            </u-cell-group>
            <view class="line"></view>
          </uni-list-item>
          <view v-if="finished" class="list-is-finished">已经到底了</view>
        </uni-list>
        <u-empty v-else mode="data" :text="'暂无数据'" :icon="empty" width="300" height="244"></u-empty>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import apiQuotation from '@/api/member/project/audit/api.quotation'
import { QuotaItem } from '@/interfaces/member/project/audit/quotation'
import { onReachBottom, onShow, onPullDownRefresh } from '@dcloudio/uni-app'
import empty from '@/assets/empty/empty.png'
import { useRouter } from '@/uni-simple-router'
import { getValueByKey } from '@/utils/constant'
import { encodeBase64 } from '@/utils/crypto'
const router = useRouter()
let finished = ref(false) // 数据是否已加载完
let tabIndex = ref(0) // 当前选中的tab
let tabsList = [
  {
    name: '待报价'
  },
  {
    name: '已报价'
  }
]
// 用于搜索请求的数据
const search = reactive({
  data: {
    buyerOrgname: '', // 买方名称/申请书编号
    quotaStatus: '1'
  },
  pageNum: 1,
  pageSize: 10
})
let quotaList: QuotaItem[] = []

const vm = reactive({
  quotaList: quotaList,
  tabsList: tabsList
})
let totalCount = ref(0)
/**
 * @Author: LongCan.Yang
 * @Date: 2024-07-03 19:59:16
 * @description: 获取笔数
 */
const getQuotaStatisticsCount = () => {
  const data = {
    buyerOrgname: search.data.buyerOrgname
  }
  apiQuotation.getQuotaStatisticsCount(data).then(res => {
    vm.tabsList = [
      {
        name: '待报价' + '(' + res.data.waitCount + ')'
      },
      {
        name: '已报价' + '(' + res.data.quotedCount + ')'
      }
    ]
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:14:44
 * @description: 获取业务报价申请列表
 */
const findQuotaReviewPage = () => {
  apiQuotation.findQuotaReviewPage(search).then(res => {
    totalCount.value = res.totalCount as number
    if (res.data.quotaList && res.data.quotaList.length) {
      vm.quotaList.push(...res.data.quotaList)
    }
    if (totalCount.value === vm.quotaList.length && totalCount.value > 0) {
      finished.value = true
    }
  })
  getQuotaStatisticsCount()
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:31:01
 * @description: 点击搜索
 */
const searchSpecialAppPage = () => {
  vm.quotaList = []
  search.pageNum = 1
  finished.value = false
  findQuotaReviewPage()
}
const resetSearch = () => {
  search.data.buyerOrgname = ''
  searchSpecialAppPage()
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:31:01
 * @description: 切换tab
 */
const selectTab = item => {
  tabIndex.value = item.index
  switch (item.index) {
    case 0:
      search.data.quotaStatus = '1'
      break
    case 1:
      search.data.quotaStatus = '2'
      break
    default:
      break
  }
  searchSpecialAppPage()
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:32:39
 * @description: 审核
 */
const viewDetail = (refcode: number, quotaStatus: string) => {
  if (quotaStatus === '1') {
    router.push(`/member/project/audit/quotation/audit/${encodeBase64(refcode)}`)
  } else {
    router.push(`/member/project/audit/quotation/detail/${encodeBase64(refcode)}`)
  }
}

/**
 * @Author: LongCan.Yang
 * @Date: 2023-09-22 15:29:16
 * @description: 上划加载更多数据
 */
onReachBottom(() => {
  if (search.pageNum < Math.ceil(totalCount.value / search.pageSize)) {
    search.pageNum++
    findQuotaReviewPage()
  }
})
onPullDownRefresh(() => {
  searchSpecialAppPage()
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 600)
})
// onMounted(() => {
//   getQuotaStatisticsCount()
// })
onShow(() => {
  searchSpecialAppPage()
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
      // .u-tabs__wrapper__nav {
      //   // justify-content: space-around;
      // }
      .u-tabs__wrapper__nav__item {
        padding: 0;
        width: 50%;
        box-sizing: border-box;
      }
    }
    &.selectTab0 {
      :deep(.u-tabs) {
        .u-tabs__wrapper__nav__line {
          transform: translate(150rpx) !important;
        }
      }
    }
    &.selectTab1 {
      :deep(.u-tabs) {
        .u-tabs__wrapper__nav__line {
          transform: translate(524rpx) !important;
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
        // display: none;
        height: 2rpx;
      }
    }
  }
  :deep(.listData) {
    // border-bottom: 1rpx solid #dedede;
    .u-cell {
      padding-bottom: 20rpx;
      .u-cell__value {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .orgname {
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
              border: 1rpx solid $success;
              color: $success;
            }
          }
        }
      }
    }
  }
}
</style>
