<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-09-23 15:27:37
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-11-10 15:43:46
 * @Description  : 项目-业务审核-指派尽调 /member/project/audit/assignDueDiligence
-->
<template>
  <view>
    <NavBar>
      <text v-if="getHasPermissionsById('member:project:audit:assignDueDiligence:insert')" class="apply" @click="startApply">
        <i class="iconfont icon-shenqing"></i>
        新增
      </text>
    </NavBar>
    <view class="business-access">
      <view class="search-box">
        <up-search
          v-model="search.data.orgname"
          v-insert-clear:[search.data.orgname]="resetSearch"
          :clearabled="false"
          :search-icon-size="36"
          :show-action="false"
          placeholder="请输入客户名称"
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
        <uni-list v-if="vm.fintCddList && vm.fintCddList.length">
          <uni-list-item v-for="item in vm.fintCddList" :key="item.refcode" class="list-item" @tap="viewDetail(item.refcode, item.appointStatus)">
            <u-cell-group class="listData" :border="false">
              <view class="financingNo">
                <u-row>
                  <u-col :span="8">
                    <view class="text ellipsis">{{ item.orgname }}</view>
                  </u-col>
                  <u-col span="4">
                    <view class="status-box">
                      <view class="status" :class="`status${item.appointStatus}`">
                        {{ getValueByKey(item.appointStatus, 'fintCddStatus') }}
                      </view>
                    </view>
                  </u-col>
                </u-row>
              </view>
              <u-cell :stop="false" title="所在国/地区" :value="item.ctyDesc" :border="false" />
              <u-cell :stop="false" title="指派人员" :value="item.cddUserNames" :border="false" />
              <u-cell :stop="false" title="尽调编号" :value="item.businessNo" :border="false" />
              <u-cell
                v-if="item.appointStatus === '9'"
                :stop="false"
                title="尽调完成时间"
                :value="dateFormat(item.completionDate, 1)"
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
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import apiAssignDueDiligence from '@/api/member/project/audit/api.assignDueDiligence'
import { onReachBottom, onShow, onPullDownRefresh } from '@dcloudio/uni-app'
import { FintCddItem } from '@/interfaces/member/project/audit/assignDueDiligence'
import empty from '@/assets/empty/empty.png'
import { useRouter } from '@/uni-simple-router'
import { encodeBase64 } from '@/utils/crypto'
import { getValueByKey } from '@/utils/constant'
import { getHasPermissionsById } from '@/utils/permissions'
import { dateFormat } from '@/utils/format'
const router = useRouter()
let finished = ref(false) // 数据是否已加载完
let buttonLoading = ref(false)
let tabIndex = ref(0) // 当前选中的持仓状态序号
let tabsList = [
  // {
  //   name: '全部'
  // },
  {
    name: '已指派'
  },
  {
    name: '已完成'
  }
]
// 用于搜索请求的数据
const search = reactive({
  data: {
    orgname: '',
    appointStatus: '2'
  },
  pageNum: 1,
  pageSize: 10
})
let fintCddList: FintCddItem[] = []

const vm = reactive({
  fintCddList: fintCddList,
  tabsList: tabsList
})
let totalCount = ref(0)
/**
 * @Author: LongCan.Yang
 * @Date: 2024-07-03 19:59:16
 * @description: 获取笔数
 */
const findDueDiligenceCount = () => {
  const data = {
    orgname: search.data.orgname
  }
  apiAssignDueDiligence.findDueDiligenceCount(data).then(res => {
    vm.tabsList = [
      // {
      //   name: '全部' + '(' + res.data.fintCddCount + ')'
      // },
      {
        name: '已指派' + '(' + res.data.assignCddCount + ')'
      },
      {
        name: '已完成' + '(' + res.data.finishCddCount + ')'
      }
    ]
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:14:44
 * @description: 获取业务准入列表
 */
const findDueDiligencePage = () => {
  apiAssignDueDiligence.findDueDiligencePage(search).then(
    res => {
      totalCount.value = res.totalCount as number
      if (res.data.fintCddList && res.data.fintCddList.length) {
        vm.fintCddList.push(...res.data.fintCddList)
      }
      if (totalCount.value === vm.fintCddList.length && totalCount.value > 0) {
        finished.value = true
      }
      findDueDiligenceCount()
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
  vm.fintCddList = []
  search.pageNum = 1
  finished.value = false
  findDueDiligencePage()
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
      search.data.appointStatus = '2'
      break
    case 1:
      search.data.appointStatus = '9'
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
const viewDetail = (refcode: number, appointStatus: string) => {
  if (appointStatus === '9') {
    router.push(`/member/project/audit/assignDueDiligence/detail/${encodeBase64(refcode)}`)
  } else {
    router.push(`/member/project/audit/assignDueDiligence/edit/${encodeBase64(refcode)}`)
  }
}
/**
 * @Author: Charon.Lin
 * @Date: 2025-03-31 15:00:11
 * @description: 发起申请
 */
const startApply = () => {
  router.push('/member/project/audit/assignDueDiligence/add')
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-09-22 15:29:16
 * @description: 上划加载更多数据
 */
onReachBottom(() => {
  if (search.pageNum < Math.ceil(totalCount.value / search.pageSize)) {
    search.pageNum++
    findDueDiligencePage()
  }
})
onPullDownRefresh(() => {
  searchProjectPage()
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 600)
})
onMounted(() => {
  findDueDiligenceCount()
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
          transform: translate(524rpx) !important;
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
