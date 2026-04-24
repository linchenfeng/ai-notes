<!--
 * @Author       : Longcan.Yang
 * @Date         : 2024-11-23 11:32:17
 * @LastEditors  : ran.zhu
 * @LastEditTime : 2025-09-23 17:22:29
 * @Description  : 项目-业务审核-上会结果复核 /member/project/audit/meetingReview
-->
<template>
  <view>
    <NavBar></NavBar>
    <view class="meeting-review-list">
      <view class="search-box">
        <up-search
          v-model="search.data.sellerOrgName"
          v-insert-clear:[search.data.sellerOrgName]="resetSearch"
          :clearabled="false"
          :search-icon-size="0"
          placeholder="请输入企业名称"
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
        <uni-list v-if="vm.metList && vm.metList.length">
          <uni-list-item v-for="(item, i) in vm.metList" :key="i" class="list-item" @tap="viewDetail(item)">
            <u-cell-group class="contentData" :border="false" :stop="true">
              <view class="financingNo">
                <u-row>
                  <u-col span="12">
                    <view class="text ellipsis">
                      {{ splitByKeywords(item.sellerOrgName).length > 1 ? splitByKeywords(item.sellerOrgName)[0] : item.sellerOrgName }}
                    </view>
                  </u-col>
                </u-row>
              </view>
              <u-cell :stop="false" title="业务申请编号" :value="item.businessNo" :border="false" />
              <u-cell
                :stop="false"
                title="业务大类"
                :value="getValueByKey(isEmpty(item.factoringType) ? item.bizScene : item.bizScene + '-' + item.factoringType, 'intBizScene')"
                :border="false"
              />
              <u-cell :stop="false" title="业务类型" :value="item.bizTypeDesc" :border="false" />
              <u-cell :stop="false" title="申请条件" :value="item.applyConditionDesc" :border="false" />
              <u-cell :stop="false" title="上会日期" :value="dateFormat(item.metDate)" :border="false" />
              <u-cell :stop="false" title="客户经理" :value="item.userName" :border="false" />
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
import { onReachBottom, onShow, onPullDownRefresh } from '@dcloudio/uni-app'
import { MetList } from '@/interfaces/member/project/audit/meetingReview'
import empty from '@/assets/empty/empty.png'
import { useRouter } from '@/uni-simple-router'
import { encodeBase64 } from '@/utils/crypto'
import apiMeetingReview from '@/api/member/project/audit/api.meetingReview'
import apiMeetingApproval from '@/api/member/project/audit/api.meetingApproval'
import { dateFormat } from '@/utils/format'
import { showToast } from '@/utils/uniapp/toast'
import { getValueByKey } from '@/utils/constant'
import { isEmpty, splitByKeywords } from '@/utils/validate'
const router = useRouter()
let finished = ref(false) // 数据是否已加载完
// 用于搜索请求的数据
const search = reactive({
  data: {
    sellerOrgName: '',
    metStatus: '1'
  },
  pageNum: 1,
  pageSize: 10
})
let metList: MetList[] = []
let tabIndex = ref(0) // 当前选中的持仓状态序号
let tabsList = [
  {
    name: '待复核'
  },
  {
    name: '已提交'
  },
  {
    name: '已过会'
  }
]
const vm = reactive({
  metList: metList,
  tabsList: tabsList
})
let totalCount = ref(0)
/**
 * @Author: LongCan.Yang
 * @Date: 2024-07-03 19:59:16
 * @description: 获取笔数
 */
const countMeetingReview = () => {
  apiMeetingReview.countMeetingReview(search.data).then(res => {
    vm.tabsList = [
      {
        name: '待复核' + '(' + res.data.countReview + ')'
      },
      {
        name: '已提交' + '(' + res.data.countSubmit + ')'
      },
      {
        name: '已过会' + '(' + res.data.countPassed + ')'
      }
    ]
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:14:44
 * @description: 获取业务准入列表
 */
const findMeetingPage = () => {
  apiMeetingReview.findMeetingPage(search).then(res => {
    countMeetingReview()
    if (res.data.metList && res.data.metList.length) {
      vm.metList.push(...res.data.metList)
    }
    totalCount.value = res.totalCount as number
    if (totalCount.value === vm.metList.length && totalCount.value > 0) {
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
  vm.metList = []
  search.pageNum = 1
  finished.value = false
  findMeetingPage()
}

const resetSearch = () => {
  search.data.sellerOrgName = ''
  searchProjectPage()
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:32:39
 * @description: 查看详情
 */
const viewDetail = item => {
  apiMeetingApproval.checkStatus(item.refcode).then(res => {
    //运营端删除
    if (!res.data.metStatus) {
      showToast('当前上会结果已被录入人删除，暂无法复核')
      return
    }
    //运营端撤回
    if (res.data.metStatus === '9') {
      showToast('当前上会结果已被录入人撤回，暂无法复核')
      return
    }
    router.push(`/member/project/audit/meetingReview/detail/${encodeBase64(item.refcode)}/${encodeBase64(search.data.metStatus)}`)
  })
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-12 13:31:39
 * @param {*} item
 * @description: 切换tab栏位
 */
const selectTab = item => {
  tabIndex.value = item.index
  switch (item.index) {
    case 0:
      search.data.metStatus = '1'
      break
    case 1:
      search.data.metStatus = '3'
      break
    case 2:
      search.data.metStatus = '8'
      break
    default:
      break
  }
  searchProjectPage()
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-09-22 15:29:16
 * @description: 上划加载更多数据
 */
onReachBottom(() => {
  if (search.pageNum < Math.ceil(totalCount.value / search.pageSize)) {
    search.pageNum++
    findMeetingPage()
  }
})
onMounted(() => {
  countMeetingReview()
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
.meeting-review-list {
  :deep(.u-sticky) {
    top: 44px !important;
  }
  .search-box {
    padding-bottom: 0;
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
  :deep(.contentData) {
    // border-bottom: 1rpx solid #dedede;
    &:last-of-type {
      .line {
        display: none;
      }
    }

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
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
