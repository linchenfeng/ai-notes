<!--
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-21 13:43:36
 * @LastEditors  : ran.zhu
 * @LastEditTime : 2025-09-23 17:33:23
 * @Description  : 项目-业务审核-特批申请审批 /member/project/specialAudit
-->
<template>
  <view>
    <NavBar></NavBar>
    <view class="business-access">
      <view class="search-box">
        <up-search
          v-model="search.data.queryCondition"
          v-insert-clear:[search.data.queryCondition]="resetSearch"
          :clearabled="false"
          :search-icon-size="0"
          placeholder="请输入卖方名称/客户经理/业务主管/申请类型"
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
        <uni-list v-if="vm.saaList && vm.saaList.length">
          <uni-list-item v-for="item in vm.saaList" :key="item.refcode" class="list-item" @tap="viewDetail(item.refcode, item.taskRefcode)">
            <u-cell-group class="listData" :border="false">
              <view class="orgname">
                <u-row>
                  <u-col span="9">
                    <view class="text ellipsis">{{ item.orgname }}</view>
                  </u-col>
                  <u-col span="3">
                    <view class="status-box">
                      <view class="status" :class="`status${item.applyStatus}`">
                        {{ getValueByKey(item.applyStatus, 'saaApplyStatus') }}
                      </view>
                    </view>
                  </u-col>
                </u-row>
              </view>
              <u-cell :stop="false" title="申请编号" :value="item.financingNo" :border="false" />
              <u-cell :stop="false" title="申请类型" :value="getDesc(item)" :border="false" />
              <u-cell :stop="false" title="申请日期" :value="item.applyDate ? dateFormat(item.applyDate, 1) : ''" :border="false" />
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
import { dateFormat } from '@/utils/format'
import apiSpecialApprovalAudit from '@/api/member/project/audit/api.specialApprovalAudit'
import { onReachBottom, onShow, onPullDownRefresh } from '@dcloudio/uni-app'
import { SaaListItem } from '@/interfaces/member/project/audit/specialApprovalAudit'
import empty from '@/assets/empty/empty.png'
import { useRouter } from '@/uni-simple-router'
import { encodeBase64 } from '@/utils/crypto'
import { getValueByKey } from '@/utils/constant'
const router = useRouter()
let finished = ref(false) // 数据是否已加载完
let tabIndex = ref(0) // 当前选中的tab
let tabsList = [
  {
    name: '待审批'
  },
  // {
  //   name: '已退回'
  // },
  {
    name: '已提问'
  },
  {
    name: '已回复'
  },
  {
    name: '已处理'
  }
]
// 用于搜索请求的数据
const search = reactive({
  data: {
    queryCondition: '', // 企业名称/申请类型
    applyStatus: '1'
  },
  pageNum: 1,
  pageSize: 10
})
let saaList: SaaListItem[] = []

const vm = reactive({
  saaList: saaList,
  tabsList: tabsList
})
let totalCount = ref(0)
// 获取申请类型描述
const getDesc = (item: SaaListItem) => {
  if (item.bizScene === '1') {
    return getValueByKey(item.applyType, 'saaApplyTypeEf')
  } else if (item.bizScene === '2') {
    return getValueByKey(item.applyType, 'saaApplyTypeIf')
  } else if (item.bizScene === '3') {
    return getValueByKey(item.applyType, 'saaApplyTypeCbe')
  }
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-07-03 19:59:16
 * @description: 获取笔数
 */
const getSpecialAppCount = () => {
  const data = {
    queryCondition: search.data.queryCondition
  }
  apiSpecialApprovalAudit.getSpecialAppCount(data).then(res => {
    vm.tabsList = [
      {
        name: '待审批' + '(' + res.data.auditCount + ')'
      },
      // {
      //   name: '已退回' + '(' + res.data.returnedCount + ')'
      // },
      {
        name: '已提问' + '(' + res.data.quizCount + ')'
      },
      {
        name: '已回复' + '(' + res.data.replyCount + ')'
      },
      {
        name: '已处理' + '(' + res.data.pendingCount + ')'
      }
    ]
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:14:44
 * @description: 获取特批申请列表
 */
const findSpecialAppPage = () => {
  apiSpecialApprovalAudit.findSpecialAppPage(search).then(res => {
    totalCount.value = res.totalCount as number
    if (res.data.saaList && res.data.saaList.length) {
      vm.saaList.push(...res.data.saaList)
    }
    if (totalCount.value === vm.saaList.length && totalCount.value > 0) {
      finished.value = true
    }
  })
  getSpecialAppCount()
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:31:01
 * @description: 点击搜索
 */
const searchSpecialAppPage = () => {
  vm.saaList = []
  search.pageNum = 1
  finished.value = false
  findSpecialAppPage()
}
const resetSearch = () => {
  search.data.queryCondition = ''
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
      search.data.applyStatus = '1'
      break
    case 1:
      search.data.applyStatus = '92'
      break
    case 2:
      search.data.applyStatus = '93'
      break
    case 3:
      search.data.applyStatus = '94'
      break
    default:
      break
  }
  searchSpecialAppPage()
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:32:39
 * @description: 修改
 */
const viewDetail = (refcode: number, taskRefcode: number) => {
  router.push(`/member/project/audit/special/audit/${encodeBase64(refcode)}/${encodeBase64(taskRefcode)}/${encodeBase64(search.data.applyStatus)}`)
}

/**
 * @Author: LongCan.Yang
 * @Date: 2023-09-22 15:29:16
 * @description: 上划加载更多数据
 */
onReachBottom(() => {
  if (search.pageNum < Math.ceil(totalCount.value / search.pageSize)) {
    search.pageNum++
    findSpecialAppPage()
  }
})
onPullDownRefresh(() => {
  searchSpecialAppPage()
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 600)
})
// onMounted(() => {
//   getSpecialAppCount()
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
        width: 25%;
        box-sizing: border-box;
      }
    }
    &.selectTab0 {
      :deep(.u-tabs) {
        .u-tabs__wrapper__nav__line {
          transform: translate(40rpx) !important;
        }
      }
    }
    &.selectTab1 {
      :deep(.u-tabs) {
        .u-tabs__wrapper__nav__line {
          transform: translate(240rpx) !important;
        }
      }
    }
    &.selectTab2 {
      :deep(.u-tabs) {
        .u-tabs__wrapper__nav__line {
          transform: translate(426rpx) !important;
        }
      }
    }
    &.selectTab3 {
      :deep(.u-tabs) {
        .u-tabs__wrapper__nav__line {
          transform: translate(614rpx) !important;
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
            &.status0 {
              border: 1rpx solid $primary;
              color: $primary;
            }
            &.status2,
            &.status1 {
              border: 1rpx solid $warning;
              color: $warning;
            }
            &.status3 {
              border: 1rpx solid $success;
              color: $success;
            }

            &.status4 {
              border: 1rpx solid $danger;
              color: $danger;
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
