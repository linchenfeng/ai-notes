<!--
 * @Author       : Longcan.Yang
 * @Date         : 2024-10-12 10:27:50
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-01-29 16:36:44
 * @Description  : 项目-业务申请-填报申请书 /member/project/apply/application
-->
<template>
  <view>
    <NavBar></NavBar>
    <view class="application-list">
      <view class="search-box">
        <up-search
          v-model="search.data.orgname"
          v-insert-clear:[search.data.orgname]="resetSearch"
          :clearabled="false"
          :search-icon-size="0"
          placeholder="请输入卖方名称"
          :show-action="true"
          :action-style="{ color: '#395fee' }"
          @search="searchProjectPage"
          @custom="searchProjectPage"
        ></up-search>
      </view>
      <up-sticky bg-color="#fff">
        <view class="head-tabs" :class="`selectTab${tabIndex}`">
          <ty-tabs :tabs="vm.tabsList" :current="tabIndex" @change="selectTab"></ty-tabs>
          <view class="tabs-line"></view>
        </view>
      </up-sticky>
      <view class="content">
        <uni-list v-if="vm.appList && vm.appList.length">
          <uni-list-item v-for="(item, i) in vm.appList" :key="i" class="list-item" @tap="viewDetail(item)">
            <u-cell-group class="contentData" :border="false" :stop="true">
              <view class="financingNo">
                <u-row>
                  <u-col span="7.5">
                    <view class="text">{{ item.orgname }}</view>
                  </u-col>
                  <u-col span="4.5">
                    <view class="flex-box">
                      <view v-if="item.pushReadStatus === '1' && item.applyStatus === '1'" class="share-status-box">
                        <text class="iconfont-bms-colorful bms-color-yifenxiang1"></text>
                      </view>
                      <view class="status-box">
                        <view class="status" :class="`status${item.applyStatus}`">
                          {{ getValueByKey(item.applyStatus, 'applicationApplyStatus') }}
                        </view>
                      </view>
                    </view>
                  </u-col>
                </u-row>
              </view>

              <u-cell :stop="false" title="卖方所在国" :value="item.ctyDesc" :border="false" />
              <u-cell :stop="false" title="准入买方数" :value="item.count" :border="false" />
              <u-cell :stop="false" title="业务产品" :value="getProduceType(item.bizScene, item.productType)" :border="false" />
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
import { onReachBottom, onShow, onPullDownRefresh } from '@dcloudio/uni-app'
import { AppList } from '@/interfaces/member/project/apply/fillingApplication'
import empty from '@/assets/empty/empty.png'
import { useRouter } from '@/uni-simple-router'
import { encodeBase64 } from '@/utils/crypto'
import apiFillingApplication from '@/api/member/project/apply/api.fillingApplication'
const router = useRouter()
let finished = ref(false) // 数据是否已加载完
// let buttonLoading = ref(false)
let tabIndex = ref(0) // 当前选中的持仓状态序号
let tabsList = [
  {
    name: '待申请',
    value: 0
  },
  {
    name: '待提交',
    value: 0
  },
  {
    name: '待确认',
    value: 0
  },
  {
    name: '已退回',
    value: 0
  }
]
// 用于搜索请求的数据
const search = reactive({
  data: {
    orgname: '',
    applyStatus: '0',
    applyStatusText: '全部'
  },
  pageNum: 1,
  pageSize: 10
})
let appList: AppList[] = []

const vm = reactive({
  appList: appList,
  tabsList: tabsList
})
let totalCount = ref(0)
/**
 * @Author: LongCan.Yang
 * @Date: 2024-07-03 19:59:16
 * @description: 获取笔数
 */
const getFinanceCount = () => {
  apiFillingApplication.getFinanceCount(search.data).then(res => {
    vm.tabsList = [
      {
        name: '待申请',
        value: res.data.countWait
      },
      {
        name: '待提交',
        value: res.data.countNot
      },
      {
        name: '待确认',
        value: res.data.countConfirm
      },
      {
        name: '已退回',
        value: res.data.countReturn
      }
    ]
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:14:44
 * @description: 获取业务准入列表
 */
const findFinancePage = () => {
  apiFillingApplication.findFinancePage(search).then(res => {
    if (res.data.appList && res.data.appList.length) {
      vm.appList.push(...res.data.appList)
    }
    totalCount.value = res.totalCount as number
    if (totalCount.value === vm.appList.length && totalCount.value > 0) {
      finished.value = true
    }
    getFinanceCount()
  })
}

/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:31:01
 * @description: 点击搜索
 */
const searchProjectPage = () => {
  vm.appList = []
  search.pageNum = 1
  finished.value = false
  findFinancePage()
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
const viewDetail = item => {
  // 已分享的数据不允许跳到编辑页，跳详情
  if (item.pushReadStatus === '1' && ['1', '3', '7', '8'].includes(item.applyStatus)) {
    router.push(`/member/project/apply/application/detail/${encodeBase64(item.refcode)}/${encodeBase64(item.orgname)}/${encodeBase64(item.ctyid)}`)
  } else {
    router.push(
      `/member/project/apply/application/apply/${encodeBase64(item.refcode || -1)}/${encodeBase64(item.orgname)}/${encodeBase64(
        item.ctyid
      )}/${encodeBase64(item.bizScene)}/${encodeBase64(item.productType)}`
    )
  }
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-12 13:31:39
 * @param {*} item
 * @description: 切换tab栏位
 */
const selectTab = item => {
  tabIndex.value = item.index
  switch (item.index) {
    case 0:
      search.data.applyStatus = '0'
      break
    case 1:
      search.data.applyStatus = '1'
      break
    case 2:
      search.data.applyStatus = '2'
      break
    case 3:
      search.data.applyStatus = '7'
      break
    default:
      break
  }
  searchProjectPage()
}
const getProduceType = (bizScene, productType) => {
  const bizSceneName = getValueByKey(bizScene, 'intBizScene')
  return bizSceneName ? `${bizSceneName}-${productType}` : productType
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-09-22 15:29:16
 * @description: 上划加载更多数据
 */
onReachBottom(() => {
  if (search.pageNum < Math.ceil(totalCount.value / search.pageSize)) {
    search.pageNum++
    findFinancePage()
  }
})

onPullDownRefresh(() => {
  searchProjectPage()
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 600)
})
onMounted(() => {
  getFinanceCount()
})
onShow(() => {
  searchProjectPage()
})
</script>

<style lang="scss" scoped>
.iconfont.icon-kefu {
  font-size: 18px;
  color: #fff;
}
.application-list {
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
      bottom: 0rpx;
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
          transform: translate(66rpx) !important;
        }
      }
    }
    &.selectTab1 {
      :deep(.u-tabs) {
        .u-tabs__wrapper__nav__line {
          transform: translate(250rpx) !important;
        }
      }
    }
    &.selectTab2 {
      :deep(.u-tabs) {
        .u-tabs__wrapper__nav__line {
          transform: translate(444rpx) !important;
        }
      }
    }
    &.selectTab3 {
      :deep(.u-tabs) {
        .u-tabs__wrapper__nav__line {
          transform: translate(634rpx) !important;
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
      margin-top: 20rpx;
      margin-bottom: 20rpx;
      .u-row {
        height: 48rpx;
        .text {
          font-size: 32rpx;
          font-weight: bold;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .flex-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .share-status-box {
            position: absolute;
            left: -34rpx;
            top: -36rpx;
            color: #000;
            .bms-color-yifenxiang1 {
              font-size: 94rpx;
            }
          }
          .status-box {
            margin-left: auto;
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
}
</style>
