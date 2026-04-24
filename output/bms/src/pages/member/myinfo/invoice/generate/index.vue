<!--
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-21 13:42:52
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-02-12 16:30:38
 * @Description  : 项目-我的-开票管理-开具发票 /member/myinfo/invoice/generate
-->
<template>
  <view>
    <NavBar></NavBar>
    <view class="business-access">
      <view class="search-box">
        <up-search
          v-model="search.data.orgname"
          v-insert-clear:[search.data.orgname]="resetSearch"
          :clearabled="false"
          :search-icon-size="0"
          placeholder="请输入卖方名称"
          :show-action="true"
          :action-style="{ color: '#395fee' }"
          @search="searchProjectPage"
          @custom="searchProjectPage"
        ></up-search>
      </view>
      <view class="content">
        <uni-list v-if="vm.fintAppList && vm.fintAppList.length">
          <view v-for="item in vm.fintAppList" :key="item.refcode" class="list-item">
            <uni-list-item>
              <u-cell-group class="contentData" :border="false" :stop="true" @tap="viewDetail(item.invRefcode)">
                <view class="financingNo">
                  <u-row>
                    <u-col :span="12">
                      <view class="text ellipsis">{{ item.orgname }}</view>
                    </u-col>
                  </u-row>
                </view>

                <u-cell :stop="false" title="业务产品" :value="getProduceType(item.bizScene, item.productType)" :border="false" />
                <u-cell :stop="false" title="卖方所在国" :value="item.ctyDesc" :border="false" />
                <u-cell :stop="false" title="准入买方数" :value="item.count" :border="false" />
              </u-cell-group>
              <view class="line"></view>
            </uni-list-item>
          </view>

          <view v-if="finished" class="list-is-finished">已经到底了</view>
        </uni-list>
        <u-empty v-else mode="data" :text="'暂无数据'" :icon="empty" width="300" height="244"></u-empty>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import apiInvoice from '@/api/member/myinfo/api.invoice'
import { onReachBottom, onShow, onPullDownRefresh } from '@dcloudio/uni-app'
import { FintAppList } from '@/interfaces/member/myinfo/invoice'
import empty from '@/assets/empty/empty.png'
import { useRouter } from '@/uni-simple-router'
import { encodeBase64 } from '@/utils/crypto'
import { getValueByKey } from '@/utils/constant'
const router = useRouter()
let finished = ref(false) // 数据是否已加载完
// 用于搜索请求的数据
const search = reactive({
  data: {
    orgname: ''
  },
  pageNum: 1,
  pageSize: 10
})
let fintAppList: FintAppList[] = []

const vm = reactive({
  fintAppList: fintAppList
})
let totalCount = ref(0)
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:14:44
 * @description: 获取业务准入列表
 */
const findReservePage = () => {
  apiInvoice.findReservePage(search).then(res => {
    if (res.data.fintAppList && res.data.fintAppList.length) {
      vm.fintAppList.push(...res.data.fintAppList)
    }
    totalCount.value = res.totalCount as number
    if (totalCount.value === vm.fintAppList.length && totalCount.value > 0) {
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
  vm.fintAppList = []
  search.pageNum = 1
  finished.value = false
  findReservePage()
}
const resetSearch = () => {
  search.data.orgname = ''
  searchProjectPage()
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:32:39
 * @description: 发票详情
 */
const viewDetail = (refcode: number) => {
  router.push(`/member/myinfo/invoice/generate/apply/${encodeBase64(refcode)}`)
}
const getProduceType = (bizScene, productType) => {
  const bizSceneName = getValueByKey(bizScene, 'intBizScene')
  return bizSceneName ? `${bizSceneName}-${productType}` : productType
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-09-22 15:29:16
 * @description: 上划加载更多数据
 */
onReachBottom(() => {
  if (search.pageNum < Math.ceil(totalCount.value / search.pageSize)) {
    search.pageNum++
    findReservePage()
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
</style>
