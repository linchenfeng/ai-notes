<!--
 * @Author       : Longcan.Yang
 * @Date         : 2024-11-23 11:32:17
 * @LastEditors  : ran.zhu
 * @LastEditTime : 2025-09-23 17:18:52
 * @Description  : 项目-业务审核-上会结果审批列表 /member/project/audit/meetingApproval
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
      <view class="tabs-line"></view>
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
    sellerOrgName: ''
  },
  pageNum: 1,
  pageSize: 10
})
let metList: MetList[] = []

const vm = reactive({
  metList: metList
})
let totalCount = ref(0)
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:14:44
 * @description: 获取业务准入列表
 */
const findMeetingPage = () => {
  apiMeetingApproval.findMeetingPage(search).then(res => {
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
      showToast('当前上会结果已被录入人删除，暂无法审批')
      return
    }
    //运营端撤回
    if (res.data.metStatus === '9') {
      showToast('当前上会结果已被录入人撤回，暂无法审批')
      return
    }
    //复核人撤回
    if (res.data.metStatus === '1') {
      showToast('当前上会结果已被复核人撤回，暂无法审批')
      return
    }
    //审批通过或审批退回
    if (['4', '5'].includes(res.data.metStatus)) {
      showToast('当前上会结果已被审批')
      return
    }
    router.push(`/member/project/audit/meetingApproval/detail/${encodeBase64(item.refcode)}`)
  })
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
  .search-box {
    position: relative;

    // border-bottom: 1px solid #dedede;
  }
  .tabs-line {
    width: 100%;
    height: 1rpx;
    background-color: #dedede;
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
