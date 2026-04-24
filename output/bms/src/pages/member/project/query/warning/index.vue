<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-06-30 09:28:02
 * @LastEditors  : ran.zhu
 * @LastEditTime : 2025-09-23 17:36:20
 * @Description  : 项目-业务查询-预警解除查询 /member/project/query/warning
-->
<template>
  <view>
    <NavBar>
      <span @click="changeSearchType">
        <i class="iconfont search-icon" :class="searchIcon"></i>
        <span class="search-name">{{ searchName }}</span>
      </span>
    </NavBar>
    <view class="business-access">
      <view class="search-box">
        <up-search
          v-model="search.data.queryCondition"
          v-insert-clear:[search.data.queryCondition]="resetSearch"
          :clearabled="false"
          :search-icon-size="0"
          placeholder="请输入客户名称/客户经理/业务主管/预警规则"
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
        <uni-list v-if="vm.warningList && vm.warningList.length">
          <view v-for="(item, index) in vm.warningList" :key="item.refcode" class="list-item">
            <uni-list-item>
              <u-cell-group class="contentData" :border="false" :stop="true" @tap="viewDetail(item.refcode)">
                <view class="financingNo">
                  <u-row>
                    <u-col span="6.2">
                      <view class="text ellipsis">{{ item.customerName }}</view>
                    </u-col>
                    <u-col span="5.8">
                      <view class="flex-box">
                        <view class="status-box">
                          <view class="status" :class="`status${item.applyStatus}`">
                            {{ getValueByKey(item.applyStatus, 'warningApplyStatus') }}
                          </view>
                        </view>
                      </view>
                    </u-col>
                  </u-row>
                </view>
                <u-cell :stop="false" title="申请编号" :value="item.applyNo" :border="false" />
                <u-cell :stop="false" title="预警规则" :value="item.ruleName" :border="false" />
                <u-cell :stop="false" title="风险等级" :value="getValueByKey(item.warningLevel, 'warningLevel')" :border="false" />
                <u-cell :stop="false" title="预警日期" :value="dateFormat(item.warningTriggerTime)" :border="false" />
                <u-cell :stop="false" title="申请日期" :value="dateFormat(item.applyDate)" :border="false" />
                <u-cell :stop="false" title="客户经理" :value="item.clmUserName" :border="false" />
                <u-cell :stop="false" title="业务主管" :value="item.managerUserName" :border="false" />
                <u-cell v-if="tabIndex === 1" :stop="false" title="当前审批人" :value="item.curApproverName" :border="false" />
              </u-cell-group>
            </uni-list-item>
            <view class="line" :class="{ lastLine: index + 1 === vm.tabsList[tabIndex].value }"></view>
          </view>
          <view v-if="finished" class="list-is-finished">已经到底了</view>
        </uni-list>
        <u-empty v-else mode="data" :text="'暂无数据'" :icon="empty" width="300" height="244"></u-empty>
      </view>
    </view>
    <ty-bubble-popup v-if="showSearchModal">
      <view v-for="(obj, index) in searchList" :key="index" class="item" @click="queryBytype(obj.key, obj.icon, obj.name)">
        <view class="item-icon">
          <i :class="obj.icon" class="iconfont"></i>
        </view>
        <view class="item-name">{{ obj.name }}</view>
      </view>
    </ty-bubble-popup>
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import { getValueByKey } from '@/utils/constant'
import { onReachBottom, onShow, onPullDownRefresh } from '@dcloudio/uni-app'
import { WarningItem } from '@/interfaces/member/project/audit/warningApprovalAudit'
import empty from '@/assets/empty/empty.png'
import { useRouter } from '@/uni-simple-router'
import { encodeBase64 } from '@/utils/crypto'
import apiWarningApprovalQuery from '@/api/member/project/query/api.warningApprovalQuery'
import { dateFormat } from '@/utils/format'
const router = useRouter()
let finished = ref(false) // 数据是否已加载完
let showSearchModal = ref(false)
let tabIndex = ref(0) // 当前选中的持仓状态序号
let tabsList = [
  {
    name: '全部',
    value: 0
  },
  {
    name: '审批中',
    value: 0
  },
  {
    name: '已通过',
    value: 0
  },
  {
    name: '已退回',
    value: 0
  },
  {
    name: '已拒绝',
    value: 0
  }
]
const searchList = [
  { name: '查自己', icon: 'icon-yonghu', key: '1' },
  { name: '查下级', icon: 'icon-chakanxiaji', key: '2' },
  { name: '查全部', icon: 'icon-touxiang', key: 'A' }
]
const searchIcon = ref('icon-touxiang')
const searchName = ref('查全部')
const activeIndex = ref(null) //长按选中的索引
// 用于搜索请求的数据
const search = reactive({
  data: {
    queryCondition: '',
    applyStatus: 'A',
    userName: '',
    queryType: 'A'
  },
  pageNum: 1,
  pageSize: 10
})
let warningList: WarningItem[] = []
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
    queryType: search.data.queryType,
    queryCondition: search.data.queryCondition
  }
  apiWarningApprovalQuery.getWarningAppCount(data).then(res => {
    vm.tabsList = [
      {
        name: '全部',
        value: res.data.totalCount
      },
      {
        name: '审批中',
        value: res.data.auditCount
      },
      {
        name: '已通过',
        value: res.data.passCount
      },
      {
        name: '已退回',
        value: res.data.returnedCount
      },
      {
        name: '已拒绝',
        value: res.data.rejectCount
      }
    ]
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:14:44
 * @description: 获取业务准入列表
 */
const findWarningAppPage = () => {
  apiWarningApprovalQuery.findWarningAppPage(search).then(res => {
    if (res.data.warningList && res.data.warningList.length) {
      vm.warningList.push(...res.data.warningList)
    }
    totalCount.value = res.totalCount as number
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
const searchProjectPage = () => {
  vm.warningList = []
  search.pageNum = 1
  finished.value = false
  activeIndex.value = null
  findWarningAppPage()
}
const resetSearch = () => {
  search.data.queryCondition = ''
  searchProjectPage()
}

/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:32:39
 * @description: 查看详情
 */
const viewDetail = (refcode: number) => {
  router.push(`/member/project/query/warning/detail/${encodeBase64(refcode)}`)
}
/**
 * @Author: Charon.Lin
 * @Date: 2025-16-30 16:32:39
 * @description: 列表切换
 */
const selectTab = item => {
  tabIndex.value = item.index
  switch (item.index) {
    case 0:
      search.data.applyStatus = 'A'
      break
    case 1:
      search.data.applyStatus = '1'
      break
    case 2:
      search.data.applyStatus = '3'
      break
    case 3:
      search.data.applyStatus = '2'
      break
    case 4:
      search.data.applyStatus = '4'
      break
    default:
      break
  }
  searchProjectPage()
}
const changeSearchType = () => {
  showSearchModal.value = !showSearchModal.value
}
const queryBytype = (key: string, icon: string, name: string) => {
  search.data.queryType = key
  searchIcon.value = icon
  searchName.value = name
  showSearchModal.value = false
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
    findWarningAppPage()
  }
})
onPullDownRefresh(() => {
  searchProjectPage()
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 600)
})
// onMounted(() => {
//   getWarningAppCount()
// })
onShow(() => {
  searchProjectPage()
})
</script>

<style lang="scss" scoped>
.iconfont.icon-kefu {
  font-size: 16px;
  color: #fff;
}
.search-icon {
  font-size: 16px;
  color: #fff;
  margin-left: 37rpx;
}
.search-name {
  font-size: 14px;
  color: #fff;
  margin-left: 8rpx;
}
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
      bottom: 0;
    }
    // :deep(.u-tabs) {
    //   // .u-tabs__wrapper__nav {
    //   //   // justify-content: space-around;
    //   // }
    //   .u-tabs__wrapper__nav__item {
    //     padding: 0;
    //     width: 25%;
    //     box-sizing: border-box;
    //   }
    // }
    // &.selectTab0 {
    //   :deep(.u-tabs) {
    //     .u-tabs__wrapper__nav__line {
    //       transform: translate(66rpx) !important;
    //     }
    //   }
    // }
    // &.selectTab1 {
    //   :deep(.u-tabs) {
    //     .u-tabs__wrapper__nav__line {
    //       transform: translate(250rpx) !important;
    //     }
    //   }
    // }
    // &.selectTab2 {
    //   :deep(.u-tabs) {
    //     .u-tabs__wrapper__nav__line {
    //       transform: translate(444rpx) !important;
    //     }
    //   }
    // }
    // &.selectTab3 {
    //   :deep(.u-tabs) {
    //     .u-tabs__wrapper__nav__line {
    //       transform: translate(634rpx) !important;
    //     }
    //   }
    // }
  }
  .list-item {
    .line {
      width: 100%;
      height: 20rpx;
      background: #f6f6f6;
    }
  }
  .lastLine {
    height: 2rpx !important;
  }
  .active {
    background: #f6f6f6;
  }
  :deep(.u-cell-group) {
    margin: 0;
  }
  :deep(.u-cell-group__wrapper) {
    padding-left: 30rpx;
    padding-right: 30rpx;
  }
  .success-status {
    color: #00b050;
  }
  .warning-status {
    color: #e6a23c;
  }
  .list-operate {
    position: absolute;
    z-index: 7;
    width: 280rpx;
    height: 88rpx;
    line-height: 88rpx;
    padding-left: 40rpx;
    font-size: 32rpx;
    background: #fff;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 15rpx;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
  }
  :deep(.contentData) {
    position: relative;
    user-select: none; /* 禁止文本选中 */
    -webkit-user-select: none; /* 兼容iOS */
    -moz-user-select: none; /* 兼容Firefox */
    padding-bottom: 20rpx;
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
        }
        .status-box {
          margin-right: 20rpx;
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
.projectInfo {
  margin: 40rpx 30rpx 0;
  :deep(.u-input) {
    padding: 8rpx 10rpx !important;
    .u-input__content__field-wrapper {
      input {
        font-size: 28rpx !important;
      }
    }
  }
  .userName {
    margin-bottom: 30rpx;
  }
  .userName,
  .orgname {
    font-size: 28rpx;
    .selectDate {
      display: flex;
      .dateInterval {
        width: 44%;
      }
      .connect {
        width: 12%;
        text-align: center;
        line-height: 68rpx;
      }
    }

    .describe {
      text-align: right;
      line-height: 68rpx;
    }
  }
}
.search-box {
  padding-bottom: 0;
}
.flex-box {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.flex-box .status-box:last-child {
  margin-right: 0 !important;
}
</style>
