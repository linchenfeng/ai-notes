<!--
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-21 13:43:36
 * @LastEditors  : ran.zhu
 * @LastEditTime : 2025-09-23 17:25:52
 * @Description  : 项目-业务申请-受理客户申请列表 /member/project/apply/acceptCus
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
          placeholder="请输入卖方名称/买方名称"
          :show-action="true"
          :action-style="{ color: '#395fee' }"
          @search="searchProjectPage"
          @custom="searchProjectPage"
        ></up-search>
      </view>
      <view class="content">
        <uni-list v-if="vm.aplList && vm.aplList.length">
          <uni-list-item v-for="item in vm.aplList" :key="item.refcode" class="list-item" @tap="viewDetail(item.refcode)">
            <u-cell-group class="listData" :border="false">
              <view v-if="item.financingNo" class="financingNo">
                <u-row>
                  <u-col span="8">
                    <view class="text">{{ item.financingNo }}</view>
                  </u-col>
                </u-row>
              </view>
              <u-cell :stop="false" title="申请日期" :value="item.applyDate ? dateFormat(item.applyDate, 1) : ''" :border="false" />
              <u-cell :stop="false" title="卖方名称" :value="item.orgname" :border="false" />
              <u-cell :stop="false" title="买方家数" :value="item.counterpartyCount" :border="false" />
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
import { dateFormat } from '@/utils/format'
import apiBusinessApply from '@/api/member/project/apply/api.businessApply'
import { onReachBottom, onShow, onPullDownRefresh } from '@dcloudio/uni-app'
import { AplList } from '@/interfaces/member/project/apply/businessApply'
import empty from '@/assets/empty/empty.png'
import { useRouter } from '@/uni-simple-router'
import { encodeBase64 } from '@/utils/crypto'
const router = useRouter()
let finished = ref(false) // 数据是否已加载完
let buttonLoading = ref(false)
let tabsList = [
  {
    name: '已保存'
  },
  {
    name: '已提交'
  }
]
// 用于搜索请求的数据
const search = reactive({
  data: {
    orgname: '',
    intLoanStatus: '6' // 6易鲁通企业提交的且待客户经理受理的国际业务申请数据
  },
  pageNum: 1,
  pageSize: 10
})
let aplList: AplList[] = []
const vm = reactive({
  aplList: aplList,
  tabsList: tabsList
})
let totalCount = ref(0)

/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:14:44
 * @description: 获取业务准入列表
 */
const findBusinessPage = () => {
  apiBusinessApply.findBusinessPage(search).then(
    res => {
      totalCount.value = res.totalCount as number
      if (res.data.aplList && res.data.aplList.length) {
        vm.aplList.push(...res.data.aplList)
      }
      if (totalCount.value === vm.aplList.length && totalCount.value > 0) {
        finished.value = true
      }
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
  vm.aplList = []
  search.pageNum = 1
  finished.value = false
  findBusinessPage()
}
const resetSearch = () => {
  search.data.orgname = ''
  searchProjectPage()
}

/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:32:39
 * @description: 查看详情
 */
const viewDetail = (refcode: number) => {
  router.push(`/member/project/apply/acceptCus/apply/${encodeBase64(refcode)}`)
}

/**
 * @Author: LongCan.Yangs
 * @Date: 2023-09-22 15:29:16
 * @description: 上划加载更多数据
 */
onReachBottom(() => {
  if (search.pageNum < Math.ceil(totalCount.value / search.pageSize)) {
    search.pageNum++
    findBusinessPage()
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
    // padding-bottom: 0;
    border-bottom: 2rpx solid #f6f6f6;
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
.apply {
  color: #fff;
  font-size: 14px;
}
</style>
