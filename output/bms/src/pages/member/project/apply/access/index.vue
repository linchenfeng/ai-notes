<!--
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-21 13:43:36
 * @LastEditors  : aolin.qu
 * @LastEditTime : 2025-12-11 19:27:21
 * @Description  : 项目-业务申请-申请准入列表 /member/project/apply/access
-->
<template>
  <view>
    <NavBar>
      <text class="apply" @click="startApply">
        <i class="iconfont icon-shenqing"></i>
        发起申请
      </text>
    </NavBar>
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
        <uni-list v-if="vm.aplList && vm.aplList.length">
          <uni-list-item v-for="item in vm.aplList" :key="item.refcode" class="list-item" @tap="viewDetail(item.refcode, item.intLoanStatus)">
            <u-cell-group class="listData" :border="false">
              <view class="financingNo">
                <u-row>
                  <u-col :span="tabIndex === 0 ? 8 : 12">
                    <view class="text ellipsis">{{ item.orgname }}</view>
                  </u-col>
                  <u-col v-if="tabIndex === 0" span="4">
                    <view class="status-box">
                      <view class="status" :class="`status${item.intLoanStatus}`">
                        {{ getValueByKey(item.intLoanStatus, 'intLoanStatus') }}
                      </view>
                    </view>
                  </u-col>
                </u-row>
              </view>
              <u-cell :stop="false" title="申请日期" :value="item.applyDate ? dateFormat(item.applyDate, 1) : ''" :border="false" />
              <u-cell :stop="false" title="业务申请编号" :value="item.financingNo" :border="false" />
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
import { getValueByKey } from '@/utils/constant'
const router = useRouter()
let finished = ref(false) // 数据是否已加载完
let buttonLoading = ref(false)
let tabIndex = ref(0) // 当前选中的持仓状态序号
let tabsList = [
  {
    name: '待提交'
  },
  {
    name: '已提交'
  },
  {
    name: '已暂缓'
  }
]
// 用于搜索请求的数据
const search = reactive({
  data: {
    orgname: '',
    intLoanStatus: '0'
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
 * @Date: 2024-07-03 19:59:16
 * @description: 获取笔数
 */
const getBusinessCount = () => {
  const data = {
    orgname: search.data.orgname
  }
  apiBusinessApply.getBusinessCount(data).then(res => {
    vm.tabsList = [
      {
        name: '待提交' + '(' + res.data.saveCount + ')'
      },
      {
        name: '已提交' + '(' + res.data.approvalCount + ')'
      },
      {
        name: '已暂缓' + '(' + res.data.postponeCount + ')'
      }
    ]
  })
}
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
      getBusinessCount()
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
 * @Date: 2024-06-25 15:31:01
 * @description: 切换tab
 */
const selectTab = item => {
  tabIndex.value = item.index
  switch (item.index) {
    case 0:
      search.data.intLoanStatus = '0'
      break
    case 1:
      search.data.intLoanStatus = '1'
      break
    case 2:
      search.data.intLoanStatus = '9'
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
const viewDetail = (refcode: number, intLoanStatus: string) => {
  if (['0', '5', '10'].includes(intLoanStatus)) {
    router.push(`/member/project/apply/access/apply/${encodeBase64(refcode)}`)
  } else {
    router.push(`/member/project/apply/access/detail/${encodeBase64(refcode)}`)
  }
}
/**
 * @Author: Charon.Lin
 * @Date: 2025-03-31 15:00:11
 * @description: 发起申请
 */
const startApply = () => {
  router.push('/member/project/apply/access/apply')
}
/**
 * @Author: LongCan.Yang
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
onMounted(() => {
  getBusinessCount()
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
.icon-shenqing {
  color: #fff;
  font-size: 14px;
}
</style>
