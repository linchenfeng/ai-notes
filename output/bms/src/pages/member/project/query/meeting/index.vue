<!--
 * @Author       : Longcan.Yang
 * @Date         : 2024-10-12 10:27:50
 * @LastEditors  : ran.zhu
 * @LastEditTime : 2025-09-23 17:35:44
 * @Description  : 项目-业务查询-贷前-上会结果查询 /member/project/query/meeting
-->
<template>
  <view>
    <NavBar>
      <span @click="changeSearchType">
        <i class="iconfont search-icon icon-gaojisousuo"></i>
      </span>
    </NavBar>
    <view class="application-list">
      <view class="search-box">
        <up-search
          v-model="search.data.sellerOrgName"
          v-insert-clear:[search.data.sellerOrgName]="resetSearch"
          :clearabled="false"
          :search-icon-size="0"
          placeholder="请输入企业名称/客户经理"
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
        <uni-list v-if="vm.appList && vm.appList.length">
          <uni-list-item v-for="(item, i) in vm.appList" :key="i" class="list-item" @tap="viewDetail(item)">
            <u-cell-group class="contentData" :border="false" :stop="true">
              <view class="financingNo">
                <u-row>
                  <u-col span="8">
                    <view class="text ellipsis">
                      {{ splitByKeywords(item.sellerOrgName).length > 1 ? splitByKeywords(item.sellerOrgName)[0] : item.sellerOrgName }}
                    </view>
                  </u-col>
                  <u-col span="4">
                    <view class="status-box">
                      <view class="status" :class="`status${item.metStatus}`">
                        {{ getValueByKey(item.metStatus, 'metStatus') }}
                      </view>
                    </view>
                  </u-col>
                </u-row>
              </view>
              <u-cell :stop="false" title="业务申请编号" :value="item.businessNo" :border="false" />
              <u-cell
                :stop="false"
                title="业务大类"
                :value="getValueByKey(isEmpty(item.factoringType) ? item.bizScene : item.bizScene + '-' + item.factoringType, 'intBizScene')"
                :border="false"
              />
              <u-cell :stop="false" title="业务类型" :value="item.bizTypeDesc" :border="false" />
              <u-cell :stop="false" title="申请条件" :value="item.applyConditionDesc" :border="false" />
              <u-cell :stop="false" title="客户经理" :value="item.userName" :border="false" />
              <u-cell :stop="false" title="上会日期" :value="item.metDate ? dateFormat(item.metDate, 1) : ''" :border="false" />
            </u-cell-group>
            <view class="line"></view>
          </uni-list-item>
          <view v-if="finished" class="list-is-finished">已经到底了</view>
        </uni-list>
        <u-empty v-else mode="data" :text="'暂无数据'" :icon="empty" width="300" height="244"></u-empty>
      </view>
      <ty-bubble-popup v-if="showSearchModal">
        <view class="search-list">
          <view class="custom-checkbox-group">
            <custom-checkbox
              v-for="(obj, index) in searchList"
              :key="index"
              v-model="selectedSearch"
              :icon="obj.icon"
              :value="obj.key"
              :label="obj.name"
              :show-check="obj.showCheck"
              :is-group="true"
            />
          </view>
          <view class="divide-line"></view>
          <view class="custom-checkbox-group">
            <custom-checkbox
              v-for="(obj, index) in AuditList"
              :key="index"
              v-model="selectedAudit"
              :icon="obj.icon"
              :value="obj.key"
              :label="obj.name"
              :show-check="obj.showCheck"
              :is-group="true"
            />
          </view>
          <view class="operate">
            <view class="cancel" @tap="showSearchModal = false">取消</view>
            <view class="confirm" @tap="confirmQuery">确定</view>
          </view>
        </view>
      </ty-bubble-popup>
    </view>
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import { getValueByKey } from '@/utils/constant'
import { dateFormat } from '@/utils/format'
import { onReachBottom, onShow, onPullDownRefresh } from '@dcloudio/uni-app'
import { MeetingList } from '@/interfaces/member/project/query/meetingQuery'
import empty from '@/assets/empty/empty.png'
import { useRouter } from '@/uni-simple-router'
import { encodeBase64 } from '@/utils/crypto'
import apiMeetingQuery from '@/api/member/project/query/api.meetingQuery'
import { isEmpty, splitByKeywords } from '@/utils/validate'
import CustomCheckbox from '../components/CustomCheckbox.vue'
const router = useRouter()
let finished = ref(false) // 数据是否已加载完
let showSearchModal = ref(false)
let tabIndex = ref(4) // 当前选中的持仓状态序号
let tabsList = [
  {
    name: '全部',
    value: 0
  },
  {
    name: '已撤回',
    value: 0
  },
  {
    name: '审核中',
    value: 0
  },
  {
    name: '已退回',
    value: 0
  },
  {
    name: '已过会',
    value: 0
  }
]
const selectedSearch = ref(['11', '12']) // 默认都选中客户经理及主管
const selectedAudit = ref(['21', '22']) // 默认都选中我审核的
interface OptionItem {
  name: string // 名称，必选
  key?: string // 标识，可选
  icon?: string // 图标，可选
  showCheck?: boolean // 是否显示复选框，可选
}
const searchList: OptionItem[] = [
  { name: '客户经理及主管', icon: 'icon-jingliren_o', showCheck: false },
  { name: '查自己', key: '11' },
  { name: '查下级', key: '12' }
]
const AuditList: OptionItem[] = [
  { name: '我审核的', icon: 'icon-yly_shenhe', showCheck: false },
  { name: '我是审核人', key: '21' },
  { name: '我是信审委员', key: '22' }
]
interface SearchState {
  data: {
    sellerOrgName: string
    metStatus: string
    queryTypeList: string[] // 指定数组元素类型
  }
  pageNum: number
  pageSize: number
}
// 用于搜索请求的数据
const search = reactive<SearchState>({
  data: {
    sellerOrgName: '',
    metStatus: '8',
    queryTypeList: ['11', '12', '21', '22']
  },
  pageNum: 1,
  pageSize: 10
})
let appList: MeetingList[] = []
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
const getStatusCount = () => {
  let data = {
    sellerOrgName: search.data.sellerOrgName,
    queryTypeList: search.data.queryTypeList
  }
  apiMeetingQuery.getStatusCount(data).then(res => {
    vm.tabsList = [
      {
        name: '全部',
        value: res.data.count
      },
      {
        name: '已撤回',
        value: res.data.revokeCount
      },
      {
        name: '审核中',
        value: res.data.approvalCount
      },
      {
        name: '已退回',
        value: res.data.returnCount
      },
      {
        name: '已过会',
        value: res.data.passCount
      }
    ]
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:14:44
 * @description: 获取业务准入列表
 */
const findApplicationPage = () => {
  apiMeetingQuery.findApplicationPage(search).then(res => {
    if (res.data && res.data.length) {
      vm.appList.push(...res.data)
    }
    totalCount.value = res.totalCount as number
    if (totalCount.value === vm.appList.length && totalCount.value > 0) {
      finished.value = true
    }
    getStatusCount()
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
  findApplicationPage()
}
const resetSearch = () => {
  search.data.sellerOrgName = ''
  searchProjectPage()
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:32:39
 * @description: 查看详情
 */
const viewDetail = item => {
  router.push(`/member/project/query/meeting/detail/${encodeBase64(item.refcode)}`)
}
// 关闭筛选弹窗查询数据
const confirmQuery = () => {
  const list: string[] = [...selectedSearch.value, ...selectedAudit.value]
  search.data.queryTypeList = list
  showSearchModal.value = false
  searchProjectPage()
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
      search.data.metStatus = ''
      break
    case 1:
      search.data.metStatus = '9'
      break
    case 2:
      search.data.metStatus = '3'
      break
    case 3:
      search.data.metStatus = '4'
      break
    case 4:
      search.data.metStatus = '8'
      break
    default:
      break
  }
  searchProjectPage()
}
const changeSearchType = () => {
  showSearchModal.value = !showSearchModal.value
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-09-22 15:29:16
 * @description: 上划加载更多数据
 */
onReachBottom(() => {
  if (search.pageNum < Math.ceil(totalCount.value / search.pageSize)) {
    search.pageNum++
    findApplicationPage()
  }
})

onPullDownRefresh(() => {
  searchProjectPage()
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 600)
})
onMounted(() => {
  getStatusCount()
})
onShow(() => {
  showSearchModal.value = false
  searchProjectPage()
})
</script>

<style lang="scss" scoped>
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
      bottom: 0;
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
        // display: none;
        height: 2rpx;
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
          display: flex;
          justify-content: flex-end;
          .status {
            border: 1rpx solid $warning;
            color: $warning;
            border-radius: 5rpx;
            padding: 10rpx 16rpx;
            text-align: center;
            font-size: 26rpx;
            &.status8 {
              border: 1rpx solid $u-success;
              color: $u-success;
            }
          }
        }
      }
    }
  }
}
</style>
