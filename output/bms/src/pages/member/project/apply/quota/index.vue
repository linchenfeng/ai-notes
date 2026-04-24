<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-08-25 13:28:34
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-01-29 16:46:07
 * @Description  : 项目-业务申请-申请买方额度 /member/project/apply/quota
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
      <view class="content">
        <uni-list v-if="vm.quotaList && vm.quotaList.length">
          <uni-list-item v-for="item in vm.quotaList" :key="item.refcode" class="list-item" @tap="viewDetail(item.refcode, item.appRefcode)">
            <u-cell-group class="listData">
              <view class="financingNo">
                <u-row>
                  <u-col :span="8">
                    <view class="text ellipsis">{{ item.orgname }}</view>
                  </u-col>
                  <u-col :span="4">
                    <view class="status-box">
                      <view class="status">
                        {{ getValueByKey(item.finalStatus, 'applicationApplyStatus') }}
                      </view>
                    </view>
                  </u-col>
                </u-row>
              </view>
              <u-cell :stop="false" title="卖方所在国" :value="item.ctyDesc" />
              <u-cell :stop="false" title="准入买方数" :value="item.buyerCount" />
              <u-cell :stop="false" title="业务产品" :value="getProduceType(item.bizScene, item.productType)" />
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
import apiQuota from '@/api/member/project/apply/api.quota'
import { onReachBottom, onShow, onPullDownRefresh } from '@dcloudio/uni-app'
import empty from '@/assets/empty/empty.png'
import { useRouter } from '@/uni-simple-router'
import { encodeBase64 } from '@/utils/crypto'
import { getValueByKey } from '@/utils/constant'
import { QuotaList, Search } from '@/interfaces/member/project/apply/quota'
import { isEmpty } from '@/utils/validate'
const router = useRouter()
let finished = ref(false) // 数据是否已加载完
let buttonLoading = ref(false)
let tabIndex = ref(0) // 当前选中的持仓状态序号
let tabsList = [
  {
    name: '待申请'
  },
  {
    name: '待提交'
  }
]
// 用于搜索请求的数据
const search = reactive<Search>({
  data: {
    orgname: '',
    finalStatus: '0'
  },
  pageNum: 1,
  pageSize: 10
})
let quotaList: QuotaList[] = []

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
const getBusinessCount = () => {
  const data = {
    orgname: search.data.orgname
  }
  apiQuota.getQuotaStatisticsCount(data).then(res => {
    vm.tabsList = [
      {
        name: '待申请' + '(' + res.data.waitApplyCount + ')'
      },
      {
        name: '待提交' + '(' + res.data.waitSubmitCount + ')'
      }
    ]
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:14:44
 * @description: 获取业务准入列表
 */
const findWaitQuotaPage = () => {
  apiQuota.findWaitQuotaPage(search).then(
    res => {
      totalCount.value = res.totalCount as number
      if (res.data.quotaList && res.data.quotaList.length) {
        vm.quotaList.push(...res.data.quotaList)
      }
      if (totalCount.value === vm.quotaList.length && totalCount.value > 0) {
        finished.value = true
      }
      getBusinessCount()
      buttonLoading.value = false
    },
    () => {
      buttonLoading.value = false
    }
  )
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:31:01
 * @description: 点击搜索
 */
const searchProjectPage = () => {
  vm.quotaList = []
  search.pageNum = 1
  finished.value = false
  findWaitQuotaPage()
}
const resetSearch = () => {
  search.data.orgname = ''
  searchProjectPage()
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
      search.data.finalStatus = '0'
      break
    case 1:
      search.data.finalStatus = '1'
      break
    default:
      break
  }
  searchProjectPage()
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:32:39
 * @description: 申请买方额度
 */
const viewDetail = (aplRefcode, appRefcode) => {
  const path = isEmpty(appRefcode)
    ? `/member/project/apply/quota/apply/${encodeBase64(aplRefcode)}`
    : `/member/project/apply/quota/apply/${encodeBase64(aplRefcode)}/${encodeBase64(appRefcode)}`
  router.push(path)
}
const getProduceType = (bizScene: string, productType: string) => {
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
    findWaitQuotaPage()
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
          transform: translate(534rpx) !important;
        }
      }
    }
    &.selectTab2 {
      :deep(.u-tabs) {
        .u-tabs__wrapper__nav__line {
          transform: translate(594rpx) !important;
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
          }
        }
      }
    }
  }
}
</style>
