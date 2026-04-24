<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-11-03 17:27:07
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-03 15:55:09
 * @Description  : 项目-业务审核-核查企业信息 /member/project/audit/check
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
          :search-icon-size="36"
          :show-action="false"
          placeholder="请输入企业名称"
          @search="searchProjectPage"
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
        <uni-list v-if="vm.fintAplChkVoList && vm.fintAplChkVoList.length">
          <uni-list-item v-for="item in vm.fintAplChkVoList" :key="item.refcode" class="list-item" @tap="viewDetail(item.refcode, item.checkStatus)">
            <u-cell-group class="listData" :border="false">
              <view class="financingNo">
                <u-row>
                  <u-col :span="12">
                    <view class="text ellipsis">{{ item.counterpartyName }}</view>
                  </u-col>
                  <!-- <u-col span="4">
                    <view class="status-box">
                      <view class="status" :class="`status${item.checkStatus}`">
                        {{ getValueByKey(item.checkStatus, 'fintCheckStatus') }}
                      </view>
                    </view>
                  </u-col> -->
                </u-row>
              </view>

              <u-cell :stop="false" title="发起日期" :value="dateFormat(item.applyDate, 1)" :border="false" />
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
import apiCheck from '@/api/member/project/audit/api.check'
import { onReachBottom, onShow, onPullDownRefresh } from '@dcloudio/uni-app'
import { FintAplChkVoList } from '@/interfaces/member/project/audit/check'
import empty from '@/assets/empty/empty.png'
import { useRouter } from '@/uni-simple-router'
import { encodeBase64 } from '@/utils/crypto'
// import { getValueByKey } from '@/utils/constant'
import { dateFormat } from '@/utils/format'
const router = useRouter()
let finished = ref(false) // 数据是否已加载完
let tabIndex = ref(0) // 当前选中的持仓状态序号
let tabsList = [
  {
    name: '待核查'
  },
  {
    name: '已核查'
  }
]
// 用于搜索请求的数据
const search = reactive({
  data: {
    orgname: '',
    checkStatus: '1'
  },
  pageNum: 1,
  pageSize: 10
})
let fintAplChkVoList: FintAplChkVoList[] = []

const vm = reactive({
  fintAplChkVoList: fintAplChkVoList,
  tabsList: tabsList
})
let totalCount = ref(0)
/**
 * @Author: LongCan.Yang
 * @Date: 2024-07-03 19:59:16
 * @description: 获取笔数
 */
const findWaitVerifyCount = () => {
  const data = {
    orgname: search.data.orgname
  }
  apiCheck.findWaitVerifyCount(data).then(res => {
    vm.tabsList = [
      {
        name: '待核查' + '(' + res.data.waitCheckCount + ')'
      },
      {
        name: '已核查' + '(' + res.data.checkedCount + ')'
      }
    ]
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:14:44
 * @description: 获取待核查企业列表
 */
const findWaitVerifyPage = () => {
  apiCheck.findWaitVerifyPage(search).then(res => {
    totalCount.value = res.totalCount as number
    if (res.data.fintAplChkVoList && res.data.fintAplChkVoList.length) {
      vm.fintAplChkVoList.push(...res.data.fintAplChkVoList)
    }
    if (totalCount.value === vm.fintAplChkVoList.length && totalCount.value > 0) {
      finished.value = true
    }
    findWaitVerifyCount()
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:31:01
 * @description: 点击搜索
 */
const searchProjectPage = () => {
  vm.fintAplChkVoList = []
  search.pageNum = 1
  finished.value = false
  findWaitVerifyPage()
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
      search.data.checkStatus = '1'
      break
    case 1:
      search.data.checkStatus = '2'
      break
    default:
      break
  }
  searchProjectPage()
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:32:39
 * @description: 查看详情
 */
const viewDetail = (refcode: number, checkStatus: string) => {
  router.push(`/member/project/audit/check/audit/${encodeBase64(refcode)}/${encodeBase64(checkStatus)}`)
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-09-22 15:29:16
 * @description: 上划加载更多数据
 */
onReachBottom(() => {
  if (search.pageNum < Math.ceil(totalCount.value / search.pageSize)) {
    search.pageNum++
    findWaitVerifyPage()
  }
})
onPullDownRefresh(() => {
  searchProjectPage()
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 600)
})
onMounted(() => {
  findWaitVerifyCount()
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
            &.status2 {
              border-color: $success;
              color: $success;
            }
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
.icon-shenqing {
  color: #fff;
  font-size: 14px;
}
</style>
