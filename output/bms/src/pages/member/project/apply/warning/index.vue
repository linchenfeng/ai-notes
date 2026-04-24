<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-06-25 17:19:50
 * @LastEditors  : xujie.yu
 * @LastEditTime : 2025-12-15 16:33:51
 * @Description  : 项目-业务申请-预警解除申请列表 /member/project/apply/warning
-->

<template>
  <view>
    <NavBar></NavBar>
    <view class="warning-approval">
      <view class="search-box">
        <up-search
          v-model="search.data.queryCondition"
          v-insert-clear:[search.data.queryCondition]="resetSearch"
          :clearabled="false"
          :search-icon-size="0"
          placeholder="请输入客户名称/监控对象/预警规则"
          :show-action="true"
          :action-style="{ color: '#395fee' }"
          @search="searchWarningAppPage"
          @custom="searchWarningAppPage"
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
        <uni-list v-if="vm.warningList && vm.warningList.length">
          <uni-list-item v-for="item in vm.warningList" :key="item.refcode" class="list-item" @tap="viewDetail(item.refcode)">
            <u-cell-group class="listData" :border="false">
              <view class="orgname">
                <u-row>
                  <u-col span="8">
                    <view class="text ellipsis">{{ item.customerName }}</view>
                  </u-col>
                  <u-col v-if="tabIndex !== 0" span="4">
                    <view class="status-box">
                      <view class="status" :class="`status${item.applyStatus}`">
                        {{ getValueByKey(item.applyStatus, 'warningApplyStatus') }}
                      </view>
                    </view>
                  </u-col>
                </u-row>
              </view>
              <u-cell v-if="tabIndex === 2" :stop="false" title="申请编号" :value="item.applyNo" :border="false" />
              <u-cell v-if="[1, 2].includes(tabIndex)" :stop="false" title="申请日期" :value="dateFormat(item.applyDate)" :border="false" />
              <u-cell
                v-if="tabIndex === 0"
                :stop="false"
                title="监控对象类型"
                :value="getValueByKey(item.monitorObjectType, 'monitorObjectType')"
                :border="false"
              />
              <u-cell :stop="false" title="监控对象" :value="item.monitorObjectName" :border="false" />
              <u-cell :stop="false" title="预警规则" :value="item.ruleName" :border="false" />
              <u-cell :stop="false" title="风险等级" :value="getValueByKey(item.warningLevel, 'warningLevel')" :border="false" />
              <u-cell :stop="false" title="预警日期" :value="dateFormat(item.warningTriggerTime)" :border="false" />
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
import { dateFormat } from '@/utils/format'
import NavBar from '@/layout/NavBar.vue'
import apiWarningApproval from '@/api/member/project/apply/api.warningApproval'
import { onReachBottom, onShow, onPullDownRefresh } from '@dcloudio/uni-app'
import { WarningListItem } from '@/interfaces/member/project/apply/warningApproval'
import empty from '@/assets/empty/empty.png'
import { useRouter } from '@/uni-simple-router'
import { encodeBase64 } from '@/utils/crypto'
import { getValueByKey } from '@/utils/constant'
const router = useRouter()
let finished = ref(false) // 数据是否已加载完
let tabIndex = ref(0) // 当前选中的tab
let tabsList = [
  {
    name: '待处理'
  },
  {
    name: '待提交'
  },
  {
    name: '已退回'
  }
]
// 用于搜索请求的数据
const search = reactive({
  data: {
    queryCondition: '', // 企业名称/申请类型
    applyStatus: '9'
  },
  pageNum: 1,
  pageSize: 10
})
let warningList: WarningListItem[] = []

const vm = reactive({
  warningList: warningList,
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
  apiWarningApproval.getWarningAppCount(data).then(res => {
    vm.tabsList = [
      {
        name: '待处理' + '(' + res.data.processCount + ')'
      },
      {
        name: '待提交' + '(' + res.data.saveCount + ')'
      },
      {
        name: '已退回' + '(' + res.data.returnedCount + ')'
      }
    ]
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:14:44
 * @description: 获取特批申请列表
 */
const findWarningAppList = () => {
  apiWarningApproval.findWarningAppList(search).then(res => {
    totalCount.value = res.totalCount as number
    if (res.data.warningList && res.data.warningList.length) {
      vm.warningList.push(...res.data.warningList)
    }
    if (totalCount.value === vm.warningList.length && totalCount.value > 0) {
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
const searchWarningAppPage = () => {
  vm.warningList = []
  search.pageNum = 1
  finished.value = false
  findWarningAppList()
}
const resetSearch = () => {
  search.data.queryCondition = ''
  searchWarningAppPage()
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
      search.data.applyStatus = '9'
      break
    case 1:
      search.data.applyStatus = '0'
      break
    case 2:
      search.data.applyStatus = '2'
      break
    default:
      break
  }
  searchWarningAppPage()
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:32:39
 * @description: 修改
 */
const viewDetail = (refcode: number) => {
  router.push(`/member/project/apply/warning/apply/${encodeBase64(refcode)}/${encodeBase64(search.data.applyStatus)}`)
}

/**
 * @Author: LongCan.Yang
 * @Date: 2023-09-22 15:29:16
 * @description: 上划加载更多数据
 */
onReachBottom(() => {
  if (search.pageNum < Math.ceil(totalCount.value / search.pageSize)) {
    search.pageNum++
    findWarningAppList()
  }
})
onPullDownRefresh(() => {
  searchWarningAppPage()
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 600)
})
// onMounted(() => {
//   getWarningAppCount()
// })
onShow(() => {
  searchWarningAppPage()
})
</script>

<style lang="scss" scoped>
.warning-approval {
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
          transform: translate(80rpx) !important;
        }
      }
    }
    &.selectTab1 {
      :deep(.u-tabs) {
        .u-tabs__wrapper__nav__line {
          transform: translate(334rpx) !important;
        }
      }
    }
    &.selectTab2 {
      :deep(.u-tabs) {
        .u-tabs__wrapper__nav__line {
          transform: translate(584rpx) !important;
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
          }
          .status2,
          .status1,
          .status0 {
            border: 1rpx solid $warning;
            color: $warning;
          }
          .status3 {
            border: 1rpx solid $success;
            color: $success;
          }
          .status4 {
            border: 1rpx solid $danger;
            color: $danger;
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
