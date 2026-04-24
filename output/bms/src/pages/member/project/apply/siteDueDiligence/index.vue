<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-10-10 17:57:34
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-11-06 13:58:38
 * @Description  : 项目-业务申请-现场尽调 /member/project/apply/siteDueDiligence
-->

<template>
  <view>
    <NavBar></NavBar>
    <view class="business-access">
      <view class="search-box">
        <up-search
          v-model="search.data.orgname"
          v-insert-clear:[search.data.orgname]="resetSearch"
          :clearabled="false"
          :search-icon-size="36"
          :show-action="false"
          placeholder="请输入客户名称/征信主管/尽调人员"
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
          <uni-list-item v-for="item in vm.fintCddList" :key="item.refcode" class="list-item" @tap="viewDetail(item)">
            <u-cell-group class="listData" :border="false">
              <view class="financingNo">
                <u-row>
                  <u-col :span="8">
                    <view class="text ellipsis">{{ item.orgname }}</view>
                  </u-col>
                  <u-col span="4">
                    <view class="status-box">
                      <view class="status" :class="`status${item.surveyStatus}`">
                        {{ getValueByKey(item.surveyStatus, 'fintCddUserStatus') }}
                      </view>
                    </view>
                  </u-col>
                </u-row>
              </view>
              <u-cell :stop="false" title="所在国/地区" :value="item.ctyDesc" :border="false" />
              <u-cell :stop="false" title="尽调人员" :value="item.cddUserNames" :border="false" />
              <u-cell v-if="tabIndex !== 2" :stop="false" title="尽调截止日" :value="dateFormat(item.endDate)" :border="false" />
              <u-cell :stop="false" title="尽调编号" :value="item.businessNo" :border="false" />
              <u-cell
                v-if="item.surveyStatus === '9'"
                :stop="false"
                title="尽调完成时间"
                :value="dateFormat(item.userCompletionDate, 1)"
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
import apiSiteDueDiligence from '@/api/member/project/apply/api.siteDueDiligence'
import { onReachBottom, onShow, onPullDownRefresh } from '@dcloudio/uni-app'
import { FintCddList } from '@/interfaces/member/project/apply/siteDueDiligence'
import empty from '@/assets/empty/empty.png'
import { useRouter } from '@/uni-simple-router'
import { encodeBase64 } from '@/utils/crypto'
import { getValueByKey } from '@/utils/constant'
import { dateFormat } from '@/utils/format'
const router = useRouter()
let finished = ref(false) // 数据是否已加载完
let tabIndex = ref(0) // 当前选中的持仓状态序号
let tabsList = [
  {
    name: '待尽调'
  },
  {
    name: '待提交'
  },
  {
    name: '已完成'
  }
]
// 用于搜索请求的数据
const search = reactive({
  data: {
    orgname: '',
    surveyStatus: '1'
  },
  pageNum: 1,
  pageSize: 10
})
let fintCddList: FintCddList[] = []

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
  apiSiteDueDiligence.findDueDiligenceCount(data).then(res => {
    vm.tabsList = [
      {
        name: '待尽调' + '(' + res.data.waitCddCount + ')'
      },
      {
        name: '待提交' + '(' + res.data.waitSubmitCddCount + ')'
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
  apiSiteDueDiligence.findDueDiligencePage(search).then(res => {
    totalCount.value = res.totalCount as number
    if (res.data.fintCddList && res.data.fintCddList.length) {
      vm.fintCddList.push(...res.data.fintCddList)
    }
    if (totalCount.value === vm.fintCddList.length && totalCount.value > 0) {
      finished.value = true
    }
    findDueDiligenceCount()
  })
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
      search.data.surveyStatus = '1'
      break
    case 1:
      search.data.surveyStatus = '3'
      break
    case 2:
      search.data.surveyStatus = '9'
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
const viewDetail = (item: FintCddList) => {
  // router.push(`/member/project/apply/siteDueDiligence/detail/${encodeBase64(item.refcode)}`)
  // return
  if (item.surveyStatus === '9') {
    // 已完成跳入详情页面
    router.push(`/member/project/apply/siteDueDiligence/detail/${encodeBase64(item.refcode)}`)
  } else {
    router.push(`/member/project/apply/siteDueDiligence/edit/${encodeBase64(item.refcode)}/${encodeBase64(item.cddUserRefcode)}`)
  }
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
// onMounted(() => {
//   findDueDiligenceCount()
// })
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
