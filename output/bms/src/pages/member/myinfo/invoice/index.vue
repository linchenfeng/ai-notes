<!--
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-21 13:42:52
 * @LastEditors  : aolin.qu
 * @LastEditTime : 2026-03-19 17:28:14
 * @Description  : 项目-我的-开票管理 /member/myinfo/invoice
-->
<template>
  <view>
    <NavBar>
      <span @click="changeApplyType">
        <span class="apply">申请开票</span>
      </span>
    </NavBar>
    <view class="business-access">
      <view class="search-box">
        <up-search
          v-model="search.data.queryCondition"
          v-insert-clear:[search.data.queryCondition]="resetSearch"
          :clearabled="false"
          :search-icon-size="0"
          placeholder="请输入开票企业名称/申请开票金额"
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
        <uni-list v-if="vm.invoiceList && vm.invoiceList.length">
          <view v-for="(item, index) in vm.invoiceList" :key="item.refcode" class="list-item">
            <uni-list-item>
              <u-cell-group class="contentData" :border="false" :stop="true" @tap="viewDetail(item.refcode, item.appStatus)">
                <view class="financingNo">
                  <u-row>
                    <u-col span="7">
                      <view class="text ellipsis">{{ item.appNo }}</view>
                    </u-col>
                    <u-col span="5">
                      <view class="flex-box">
                        <view class="status-box">
                          <view class="status" :class="`status${item.showStatus}`">
                            {{ getValueByKey(item.showStatus, 'fgaiAppStatus') }}
                          </view>
                        </view>
                      </view>
                    </u-col>
                  </u-row>
                </view>
                <u-cell :stop="false" title="开票企业名称" :value="item.appOrgName" :border="false" />
                <u-cell :stop="false" title="开票类型" :value="getValueByKey(item.generateType, 'generateType')" :border="false" />
                <u-cell :stop="false" title="申请开票金额(元)" :border="false">
                  <template #value>
                    <view class="apply-amt">
                      <text v-if="item.generateAmt !== 0" class="ccyid">{{ item.ccyid }}</text>
                      <text>{{ item.generateAmt === 0 ? '' : moneyFormat(item.generateAmt) }}</text>
                    </view>
                  </template>
                </u-cell>
                <view v-if="tabIndex === 4" class="re-apply" @click.stop="reApply(item)"><text>重新申请</text></view>
              </u-cell-group>
            </uni-list-item>

            <view class="line" :class="{ lastLine: index + 1 === vm.tabsList[tabIndex].value }"></view>
          </view>

          <view v-if="finished" class="list-is-finished">已经到底了</view>
        </uni-list>
        <u-empty v-else mode="data" :text="'暂无数据'" :icon="empty" width="300" height="244"></u-empty>
      </view>
      <ty-bubble-popup v-if="showSearchModal" width="250rpx">
        <view v-for="(obj, index) in searchList" :key="index" class="item" @click="ApplyBytype(obj.key)">
          <view class="item-icon">
            <i :class="obj.icon" class="iconfont"></i>
          </view>
          <view class="item-name">{{ obj.name }}</view>
        </view>
      </ty-bubble-popup>
    </view>
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import { onReachBottom, onShow, onPullDownRefresh } from '@dcloudio/uni-app'
import { InvoiceList } from '@/interfaces/member/myinfo/invoice'
import empty from '@/assets/empty/empty.png'
import { useRouter } from '@/uni-simple-router'
import { encodeBase64 } from '@/utils/crypto'
import { moneyFormat } from '@/utils/format'
import { getValueByKey } from '@/utils/constant'
import apiInvoice from '@/api/member/myinfo/api.invoice'
const router = useRouter()
let finished = ref(false) // 数据是否已加载完
let tabIndex = ref(0) // 当前选中的持仓状态序号
let tabsList = [
  {
    name: '待提交',
    value: 0,
    appStatus: '10'
  },
  {
    name: '开票中',
    value: 0,
    appStatus: '11'
  },
  {
    name: '已退回',
    value: 0,
    appStatus: '12'
  },
  {
    name: '已开票',
    value: 0,
    appStatus: '4'
  },
  {
    name: '已拒绝',
    value: 0,
    appStatus: '0'
  }
]
// 用于搜索请求的数据
const search = reactive({
  data: {
    queryCondition: '',
    tabStatus: '10'
  },
  pageNum: 1,
  pageSize: 10
})
let invoiceList: InvoiceList[] = []

const vm = reactive({
  invoiceList: invoiceList,
  tabsList: tabsList
})
let totalCount = ref(0)
/**
 * @Author: LongCan.Yang
 * @Date: 2024-07-03 19:59:16
 * @description: 获取笔数
 */
const getInvoiceCount = () => {
  const data = {
    queryCondition: search.data.queryCondition
  }
  apiInvoice.getInvoiceCount(data).then(res => {
    vm.tabsList = [
      {
        name: '待提交',
        value: res.data.waitCount,
        appStatus: '10'
      },
      {
        name: '开票中',
        value: res.data.ingCount,
        appStatus: '11'
      },
      {
        name: '已退回',
        value: res.data.returnCount,
        appStatus: '12'
      },
      {
        name: '已开票',
        value: res.data.passedCount,
        appStatus: '4'
      },
      {
        name: '已拒绝',
        value: res.data.refuseCount,
        appStatus: '0'
      }
    ]
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:14:44
 * @description: 获取业务准入列表
 */
const findInvoicePage = () => {
  getInvoiceCount()
  apiInvoice.findInvoicePage(search).then(res => {
    if (res.data.invoiceList && res.data.invoiceList.length) {
      vm.invoiceList.push(...res.data.invoiceList)
    }
    totalCount.value = res.totalCount as number
    if (totalCount.value === vm.invoiceList.length && totalCount.value > 0) {
      finished.value = true
    }
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:31:01
 * @description: 点击搜索
 */
const searchProjectPage = () => {
  vm.invoiceList = []
  search.pageNum = 1
  finished.value = false
  findInvoicePage()
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
const viewDetail = (refcode: number, appStatus?: string) => {
  if (tabIndex.value === 0 || tabIndex.value === 2) {
    if (appStatus && appStatus === '14') {
      router.push(`/member/myinfo/invoice/detail/${encodeBase64(refcode)}`)
    } else {
      router.push(`/member/myinfo/invoice/apply/${encodeBase64('apply')}/${encodeBase64(refcode)}`)
    }
  } else {
    router.push(`/member/myinfo/invoice/detail/${encodeBase64(refcode)}`)
  }
}
const reApply = (item: InvoiceList) => {
  router.push(`/member/myinfo/invoice/apply/${encodeBase64('reApply')}/${encodeBase64(item.refcode)}`)
}
let showSearchModal = ref(false)
const searchList = [
  { name: '先开发票', icon: 'icon-fapiaodengji', key: '1' },
  { name: '补开发票', icon: 'icon-fapiao1', key: '2' }
]
const changeApplyType = () => {
  showSearchModal.value = !showSearchModal.value
}
const ApplyBytype = type => {
  showSearchModal.value = false
  if (type === '1') {
    router.push(`/member/myinfo/invoice/apply/${encodeBase64('apply')}`)
  } else if (type === '2') {
    router.push('/member/myinfo/invoice/generate')
  }
}
/**
 * @Author: Charon.Lin
 * @Date: 2025-16-30 16:32:39
 * @description: 列表切换
 */
const selectTab = item => {
  tabIndex.value = item.index
  search.data.tabStatus = item.appStatus
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
    findInvoicePage()
  }
})
onPullDownRefresh(() => {
  searchProjectPage()
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 600)
})
onShow(() => {
  showSearchModal.value = false
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
      bottom: 0;
    }
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
}
.financingNo {
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
          &.status0 {
            border: 1rpx solid $danger;
            color: $danger;
          }
          &.status4 {
            border: 1rpx solid $success;
            color: $success;
          }
        }
      }
    }
  }
}
.re-apply {
  text-align: right;
  color: $primary;
  position: relative;
  top: -30rpx;
  font-size: 28rpx;
}
.apply {
  color: #fff;
  font-size: 14px;
}
.apply-amt {
  line-height: 48rpx;
  font-size: 28rpx;
  display: flex;
  width: 100%;
  justify-content: flex-end;
  .ccyid {
    margin-right: 7rpx;
  }
}
</style>
