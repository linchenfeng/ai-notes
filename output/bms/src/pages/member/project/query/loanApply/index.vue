<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-12-03 14:03:39
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-01-14 10:38:00
 * @Description  : 项目-业务查询-融资申请查询 /member/project/query/loanApply
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
          v-model="search.data.approvalQuery"
          v-insert-clear:[search.data.approvalQuery]="resetSearch"
          :clearabled="false"
          :search-icon-size="0"
          placeholder="请输入客户名称/客户经理/业务主管"
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
        <uni-list v-if="vm.fintLoaList && vm.fintLoaList.length">
          <uni-list-item v-for="item in vm.fintLoaList" :key="item.refcode" class="list-item" @tap="viewDetail(item.refcode)">
            <u-cell-group class="listData" :border="false">
              <view class="financingNo">
                <u-row>
                  <u-col :span="8">
                    <view class="text ellipsis">{{ item.orgname }}</view>
                  </u-col>
                  <u-col :span="4">
                    <view class="status-box">
                      <view class="status" :class="`status${item.loanStatus}`">
                        {{ getValueByKey(item.loanStatus, 'fintLoanStatus') }}
                      </view>
                    </view>
                  </u-col>
                </u-row>
              </view>
              <u-cell :stop="false" title="授信产品" :value="getValueByKey(item.creditProducts, 'fintCreditPro')" :border="false" />
              <u-cell :stop="false" title="业务申请编号" :value="item.businessNo" :border="false" />
              <u-cell :stop="false" title="申请日期" :value="item.applyDate ? dateFormat(item.applyDate, 1) : ''" :border="false" />
              <u-cell :stop="false" title="客户经理" :value="item.applyUsername" :border="false" />
              <u-cell :stop="false" title="业务主管" :value="item.superiorUsername" :border="false" />
              <u-cell
                v-if="tabIndex === 1 || (tabIndex === 3 && item.currentHandler)"
                :stop="false"
                title="当前审批人"
                :value="item.currentHandler"
                :border="false"
              />
            </u-cell-group>
            <view class="line"></view>
          </uni-list-item>
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
import { dateFormat } from '@/utils/format'
import apiLoanApply from '@/api/member/project/query/api.loanApply'
import { onReachBottom, onShow, onPullDownRefresh } from '@dcloudio/uni-app'
import { FintLoaList, Search } from '@/interfaces/member/project/query/loanApply'
import empty from '@/assets/empty/empty.png'
import { useRouter } from '@/uni-simple-router'
import { encodeBase64 } from '@/utils/crypto'
import { getValueByKey } from '@/utils/constant'
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
  { name: '查自己', icon: 'icon-yonghu', key: '11' },
  { name: '查下级', icon: 'icon-chakanxiaji', key: '12' },
  { name: '查全部', icon: 'icon-touxiang', key: '' }
]
const searchIcon = ref('icon-touxiang')
const searchName = ref('查全部')
// 用于搜索请求的数据
const search = reactive<Search>({
  data: {
    approvalQuery: '',
    queryType: '',
    loanStatus: ''
  },
  pageNum: 1,
  pageSize: 10
})
let fintLoaList: FintLoaList[] = []
const vm = reactive({
  fintLoaList: fintLoaList,
  tabsList: tabsList
})
let totalCount = ref(0)
/**
 * @Author: LongCan.Yang
 * @Date: 2024-07-03 19:59:16
 * @description: 获取笔数
 */
const getLoanQueryCount = () => {
  const data = {
    approvalQuery: search.data.approvalQuery,
    queryType: search.data.queryType
  }
  apiLoanApply.getLoanQueryCount(data).then(res => {
    vm.tabsList = [
      {
        name: '全部',
        value: res.data.count
      },
      {
        name: '审批中',
        value: res.data.auditCount
      },
      {
        name: '已通过',
        value: res.data.passedCount
      },
      {
        name: '已退回',
        value: res.data.returnCount
      },
      {
        name: '已拒绝',
        value: res.data.refuseCount
      }
    ]
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:14:44
 * @description: 获取列表
 */
const findApprovalPage = () => {
  apiLoanApply.findApprovalPage(search).then(res => {
    totalCount.value = res.totalCount as number
    if (res.data.fintLoaList && res.data.fintLoaList.length) {
      vm.fintLoaList.push(...res.data.fintLoaList)
    }
    if (totalCount.value === vm.fintLoaList.length && totalCount.value > 0) {
      finished.value = true
    }
    getLoanQueryCount()
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:31:01
 * @description: 点击搜索
 */
const searchProjectPage = () => {
  vm.fintLoaList = []
  search.pageNum = 1
  finished.value = false
  findApprovalPage()
}
const resetSearch = () => {
  search.data.approvalQuery = ''
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
 * @Date: 2024-06-25 15:31:01
 * @description: 切换tab
 */
const selectTab = item => {
  tabIndex.value = item.index
  switch (item.index) {
    case 0:
      search.data.loanStatus = ''
      break
    case 1:
      search.data.loanStatus = '1'
      break
    case 2:
      search.data.loanStatus = '9'
      break
    case 3:
      search.data.loanStatus = '2'
      break
    case 4:
      search.data.loanStatus = '3'
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
const viewDetail = (refcode: number) => {
  router.push(`/member/project/query/loanApply/detail/${encodeBase64(refcode)}`)
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-09-22 15:29:16
 * @description: 上划加载更多数据
 */
onReachBottom(() => {
  if (search.pageNum < Math.ceil(totalCount.value / search.pageSize)) {
    search.pageNum++
    findApprovalPage()
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
            &.status9 {
              border: 1rpx solid $u-success;
              color: $u-success;
            }
            &.status3 {
              border: 1rpx solid $u-error;
              color: $u-error;
            }
          }
        }
      }
    }
  }
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
</style>
