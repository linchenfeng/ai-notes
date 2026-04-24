<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-09-06 09:44:39
 * @LastEditors  : ran.zhu
 * @LastEditTime : 2025-09-23 17:31:18
 * @Description  :  项目-业务审核-资料复核 /member/project/audit/documentReview
-->
<template>
  <view>
    <NavBar></NavBar>
    <view class="assist">
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
        <uni-list v-if="vm.documentReviewList && vm.documentReviewList.length">
          <uni-list-item v-for="item in vm.documentReviewList" :key="item.refcode" class="list-item" @tap="viewDetail(item.refcode)">
            <u-cell-group class="listData">
              <view class="financingNo">
                <u-row>
                  <u-col :span="8">
                    <view class="text ellipsis">{{ item.orgname }}</view>
                  </u-col>
                  <u-col :span="4">
                    <view class="status-box">
                      <view class="status" :class="`status${item.examineStatus}`">
                        {{ getValueByKey(item.examineStatus, 'examineStatus') }}
                      </view>
                    </view>
                  </u-col>
                </u-row>
              </view>
              <u-cell :stop="false" title="申请编号" :value="item.dqscNo" />
              <u-cell :stop="false" title="卖方所在国" :value="item.orgctyDesc" />
              <u-cell :stop="false" title="准入买方数" :value="item.count" />
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
import apiDocumentReview from '@/api/member/project/audit/api.documentReview'
import { onReachBottom, onShow, onPullDownRefresh } from '@dcloudio/uni-app'
import empty from '@/assets/empty/empty.png'
import { useRouter } from '@/uni-simple-router'
import { encodeBase64 } from '@/utils/crypto'
import { getValueByKey } from '@/utils/constant'
import { DocumentReviewList, Search } from '@/interfaces/member/project/audit/documentReview'
const router = useRouter()
let finished = ref(false) // 数据是否已加载完
let tabIndex = ref(0) // 当前选中的持仓状态序号
let tabsList = [
  {
    name: '待复核'
  },
  {
    name: '已复核'
  }
]
// 用于搜索请求的数据
const search = reactive<Search>({
  data: {
    orgname: '',
    examineStatus: '12'
  },
  pageNum: 1,
  pageSize: 10
})
let documentReviewList: DocumentReviewList[] = []

const vm = reactive({
  documentReviewList: documentReviewList,
  tabsList: tabsList
})
let totalCount = ref(0)
/**
 * @Author: LongCan.Yang
 * @Date: 2024-07-03 19:59:16
 * @description: 获取笔数
 */
const getDocumentReviewCount = () => {
  const data = {
    orgname: search.data.orgname
  }
  apiDocumentReview.getDocumentReviewCount(data).then(res => {
    vm.tabsList = [
      {
        name: '待复核' + '(' + res.data.reviewCount + ')'
      },
      {
        name: '已复核' + '(' + res.data.reviewedCount + ')'
      }
    ]
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:14:44
 * @description: 获取复核协销/征信列表
 */
const findDocumentReviewPage = () => {
  apiDocumentReview.findDocumentReviewPage(search).then(res => {
    totalCount.value = res.totalCount as number
    if (res.data.documentReviewList && res.data.documentReviewList.length) {
      vm.documentReviewList.push(...res.data.documentReviewList)
    }
    if (totalCount.value === vm.documentReviewList.length && totalCount.value > 0) {
      finished.value = true
    }
    getDocumentReviewCount()
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:31:01
 * @description: 点击搜索
 */
const searchProjectPage = () => {
  vm.documentReviewList = []
  search.pageNum = 1
  finished.value = false
  findDocumentReviewPage()
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
      search.data.examineStatus = '12'
      break
    case 1:
      search.data.examineStatus = '19'
      break
    default:
      break
  }
  searchProjectPage()
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:32:39
 * @description: 跳转至资料复核页
 */
const viewDetail = refcode => {
  let path = ''
  if (tabIndex.value === 0) {
    path = `/member/project/audit/documentReview/audit/${encodeBase64(refcode)}`
  } else {
    path = `/member/project/audit/documentReview/detail/${encodeBase64(refcode)}`
  }
  router.push(path)
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:32:39
 * @description: 拼接产品类型
 */
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
    findDocumentReviewPage()
  }
})
onPullDownRefresh(() => {
  searchProjectPage()
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 600)
})
onMounted(() => {
  getDocumentReviewCount()
})
onShow(() => {
  searchProjectPage()
})
</script>

<style lang="scss" scoped>
.assist {
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
          transform: translate(144rpx) !important;
        }
      }
    }
    &.selectTab1 {
      :deep(.u-tabs) {
        .u-tabs__wrapper__nav__line {
          transform: translate(520rpx) !important;
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
            &.status19 {
              border: 1rpx solid $u-success;
              color: $u-success;
            }
          }
        }
      }
    }
  }
}
</style>
