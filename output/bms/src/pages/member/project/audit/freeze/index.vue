<!--
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-21 13:43:36
 * @LastEditors  : ran.zhu
 * @LastEditTime : 2025-09-23 17:31:37
 * @Description  : 冻结/解冻申请审批 /member/project/audit/freeze
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
          placeholder="请输入客户名称/客户经理/业务主管"
          :show-action="true"
          :action-style="{ color: '#395fee' }"
          @search="searchSpecialAppPage"
          @custom="searchSpecialAppPage"
        ></up-search>
      </view>
      <!-- <up-sticky bg-color="#fff">
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
      </up-sticky> -->
      <view class="content">
        <uni-list v-if="vm.freezeList && vm.freezeList.length">
          <uni-list-item v-for="item in vm.freezeList" :key="item.refcode" class="list-item" @tap="viewDetail(item.refcode, item.taskRefcode)">
            <u-cell-group class="listData" :border="false">
              <view class="orgname">
                <u-row>
                  <u-col span="8">
                    <view class="text ellipsis">{{ item.orgname }}</view>
                  </u-col>
                  <u-col span="4">
                    <view class="status-box">
                      <view class="status" :class="`status${item.applyStatus}`">
                        {{ getValueByKey(item.applyStatus, 'warningApplyStatus') }}
                      </view>
                    </view>
                  </u-col>
                </u-row>
              </view>
              <u-cell :stop="false" title="申请编号" :value="item.applyNo" :border="false" />
              <u-cell :stop="false" title="申请类型" :value="getValueByKey(item.applyType, 'applyType')" :border="false" />
              <u-cell :stop="false" title="授信产品" :value="getValueByKey(item.creditProduct, 'creditProduct')" :border="false" />
              <u-cell :stop="false" title="申请人" :value="item.createUser" :border="false" />
              <u-cell :stop="false" title="申请日期" :value="dateFormat(item.applyDate)" :border="false" />
              <u-cell :stop="false" title="客户经理" :value="item.clmUserName" :border="false" />
              <u-cell :stop="false" title="业务主管" :value="item.managerUserName" :border="false" />
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
import apiFreezeApprovalAudit from '@/api/member/project/audit/api.freezeApprovalAudit'
import { onReachBottom, onShow, onPullDownRefresh } from '@dcloudio/uni-app'
import { FreezeItem } from '@/interfaces/member/project/audit/freezeApprovalAudit'
import empty from '@/assets/empty/empty.png'
import { useRouter } from '@/uni-simple-router'
import { encodeBase64 } from '@/utils/crypto'
import { getValueByKey } from '@/utils/constant'
const router = useRouter()
let finished = ref(false) // 数据是否已加载完
// let tabIndex = ref(0) // 当前选中的tab
let tabsList = [
  {
    name: '待审批'
  },
  {
    name: '已通过'
  },
  {
    name: '已拒绝'
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
let freezeList: FreezeItem[] = []

const vm = reactive({
  freezeList: freezeList,
  tabsList: tabsList
})
let totalCount = ref(0)
/**
 * @Author: LongCan.Yang
 * @Date: 2024-07-03 19:59:16
 * @description: 获取笔数
 */
const getWarningAppCount = () => {
  const data = {
    queryCondition: search.data.queryCondition
  }
  apiFreezeApprovalAudit.getFreezeAppCount(data).then(res => {
    vm.tabsList = [
      {
        name: '待审批' + '(' + res.data.auditCount + ')'
      },
      {
        name: '已通过' + '(' + res.data.passCount + ')'
      },
      {
        name: '已拒绝' + '(' + res.data.rejectCount + ')'
      }
    ]
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:14:44
 * @description: 获取特批申请列表
 */
const findFreezeAppPage = () => {
  apiFreezeApprovalAudit.findFreezeAppPage(search).then(res => {
    totalCount.value = res.totalCount as number
    if (res.data.freezeList && res.data.freezeList.length) {
      vm.freezeList.push(...res.data.freezeList)
    }
    if (totalCount.value === vm.freezeList.length && totalCount.value > 0) {
      finished.value = true
    }
  })
  getWarningAppCount()
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:31:01
 * @description: 点击搜索
 */
const searchSpecialAppPage = () => {
  vm.freezeList = []
  search.pageNum = 1
  finished.value = false
  findFreezeAppPage()
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
// const selectTab = item => {
//   tabIndex.value = item.index
//   switch (item.index) {
//     case 0:
//       search.data.applyStatus = '1'
//       break
//     case 1:
//       search.data.applyStatus = '3'
//       break
//     case 2:
//       search.data.applyStatus = '4'
//       break
//     default:
//       break
//   }
//   searchSpecialAppPage()
// }
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:32:39
 * @description: 修改
 */
const viewDetail = (refcode: number, taskRefcode: number) => {
  router.push(`/member/project/audit/freeze/audit/${encodeBase64(refcode)}/${encodeBase64(taskRefcode)}`)
}

/**
 * @Author: LongCan.Yang
 * @Date: 2023-09-22 15:29:16
 * @description: 上划加载更多数据
 */
onReachBottom(() => {
  if (search.pageNum < Math.ceil(totalCount.value / search.pageSize)) {
    search.pageNum++
    findFreezeAppPage()
  }
})
onPullDownRefresh(() => {
  searchSpecialAppPage()
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 600)
})
// onMounted(() => {
//   getWarningAppCount()
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
        width: 33.3%;
        box-sizing: border-box;
      }
    }
    &.selectTab0 {
      :deep(.u-tabs) {
        .u-tabs__wrapper__nav__line {
          transform: translate(84rpx) !important;
        }
      }
    }
    &.selectTab1 {
      :deep(.u-tabs) {
        .u-tabs__wrapper__nav__line {
          transform: translate(335rpx) !important;
        }
      }
    }
    &.selectTab2 {
      :deep(.u-tabs) {
        .u-tabs__wrapper__nav__line {
          transform: translate(595rpx) !important;
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
