<!--
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-21 13:43:36
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-03-06 16:11:59
 * @Description  : 项目-业务审核-业务准入列表 /member/project/audit/access
-->
<template>
  <view>
    <NavBar />
    <view class="business-access">
      <view class="search-box">
        <up-search
          v-model="search.data.orgname"
          v-insert-clear:[search.data.orgname]="resetSearch"
          :clearabled="false"
          :search-icon-size="0"
          placeholder="请输入卖方名称/买方名称/客户经理"
          :show-action="true"
          :action-style="{ color: '#395fee' }"
          @search="searchProjectPage"
          @custom="searchProjectPage"
        ></up-search>
      </view>
      <up-sticky bg-color="#fff">
        <view class="head-tabs">
          <view class="tabs-line"></view>
          <ty-tabs :tabs="vm.tabsList" :current="tabIndex" @change="selectTab"></ty-tabs>
        </view>
      </up-sticky>
      <view class="content">
        <uni-list v-if="vm.fintAplMList && vm.fintAplMList.length">
          <uni-list-item v-for="item in vm.fintAplMList" :key="item.refcode" class="list-item" @tap="viewDetail(item.refcode)">
            <u-cell-group class="listData" :border="false">
              <view class="financingNo">
                <u-row>
                  <u-col span="8">
                    <view class="text">{{ item.financingNo }}</view>
                  </u-col>
                  <u-col span="4">
                    <view class="status-box">
                      <view class="status" :class="`status${item.applyStatus}`">{{ getValueByKey(item.applyStatus, 'applyStatus') }}</view>
                    </view>
                  </u-col>
                </u-row>
              </view>
              <u-cell :stop="false" title="客户经理" :value="item.userName" :border="false" />
              <u-cell :stop="false" title="业务主管" :value="item.superiorName" :border="false" />
              <u-cell :stop="false" title="卖方名称" :value="item.orgname" :border="false" />
              <u-cell :stop="false" title="卖方所在国" :value="item.orgctyDesc" :border="false" />
              <u-cell :stop="false" title="买方名称" :value="item.counterpartyNames" :border="false" />
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
import { getValueByKey } from '@/utils/constant'
import apiBusinessAccess from '@/api/member/project/audit/api.businessAccess'
import { onReachBottom, onShow, onPullDownRefresh } from '@dcloudio/uni-app'
import { FintAplMList } from '@/interfaces/member/project/audit/businessAccess'
import empty from '@/assets/empty/empty.png'
import { useRouter } from '@/uni-simple-router'
import { encodeBase64 } from '@/utils/crypto'
const router = useRouter()
let finished = ref(false) // 数据是否已加载完
let buttonLoading = ref(false)
let tabIndex = ref(0) // 当前选中的持仓状态序号
let tabsList = [
  {
    name: '已申请',
    value: 0,
    applyStatus: '1'
  },
  {
    name: '已提问',
    value: 0,
    applyStatus: '2'
  },
  {
    name: '已回复',
    value: 0,
    applyStatus: '3'
  },
  {
    name: '已暂缓',
    value: 0,
    applyStatus: '10'
  },
  {
    name: '已准入',
    value: 0,
    applyStatus: '8'
  },
  {
    name: '已拒绝',
    value: 0,
    applyStatus: '9'
  }
]
// 用于搜索请求的数据
const search = reactive({
  data: {
    orgname: '',
    applyStatus: '1'
  },
  pageNum: 1,
  pageSize: 10
})
let fintAplMList: FintAplMList[] = []

const vm = reactive({
  fintAplMList: fintAplMList,
  tabsList: tabsList
})
let totalCount = ref(0)
let hasSubmitCount = ref(false) //是否存在已提交数据
/**
 * @Author: LongCan.Yang
 * @Date: 2024-07-03 19:59:16
 * @description: 获取笔数
 */
const getOverseasBusinessCountInfo = () => {
  const data = {
    orgname: search.data.orgname
  }
  apiBusinessAccess.getOverseasBusinessAccessCount(data).then(res => {
    let newTabsList = [
      { name: '已申请', value: res.data.applyCount, applyStatus: '1' },
      { name: '已提问', value: res.data.quizCount, applyStatus: '2' },
      { name: '已回复', value: res.data.replyCount, applyStatus: '3' },
      { name: '已提交', value: res.data.submitCount, applyStatus: '7' },
      { name: '已暂缓', value: res.data.postponeCount, applyStatus: '10' },
      { name: '已准入', value: res.data.passCount, applyStatus: '8' },
      { name: '已拒绝', value: res.data.refuseCount, applyStatus: '9' }
    ]
    // 判断是否存在已提交数据
    if (search.data.orgname === '') {
      hasSubmitCount.value = res.data.submitCount > 0
    }
    if (!hasSubmitCount.value) {
      newTabsList = newTabsList.filter(item => item.applyStatus !== '7')
    }
    vm.tabsList = newTabsList
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:14:44
 * @description: 获取业务准入列表
 */
const findOverseasBusinessAccessPage = () => {
  apiBusinessAccess.findOverseasBusinessAccessPage(search).then(
    res => {
      totalCount.value = res.totalCount as number
      if (res.data.fintAplMList && res.data.fintAplMList.length) {
        vm.fintAplMList.push(...res.data.fintAplMList)
      }
      if (totalCount.value === vm.fintAplMList.length && totalCount.value > 0) {
        finished.value = true
      }
      getOverseasBusinessCountInfo()
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
  vm.fintAplMList = []
  search.pageNum = 1
  finished.value = false
  findOverseasBusinessAccessPage()
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
  search.data.applyStatus = item.applyStatus
  searchProjectPage()
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:32:39
 * @description: 查看详情
 */
const viewDetail = (refcode: number) => {
  router.push(`/member/project/audit/access/audit/${encodeBase64(refcode)}/${encodeBase64(search.data.applyStatus)}`)
}

/**
 * @Author: LongCan.Yang
 * @Date: 2023-09-22 15:29:16
 * @description: 上划加载更多数据
 */
onReachBottom(() => {
  if (search.pageNum < Math.ceil(totalCount.value / search.pageSize)) {
    search.pageNum++
    findOverseasBusinessAccessPage()
  }
})
onPullDownRefresh(() => {
  searchProjectPage()
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 600)
})
onMounted(() => {
  getOverseasBusinessCountInfo()
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
            &.status8 {
              border: 1rpx solid $u-success;
              color: $u-success;
            }
            &.status9 {
              border: 1rpx solid $danger;
              color: $danger;
            }
          }
        }
      }
    }
  }
}
</style>
