<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-07-14 15:20:05
 * @LastEditors  : ran.zhu
 * @LastEditTime : 2025-09-23 17:34:52
 * @Description  : 贷前查询-已开买方额度 /member/project/query/buyerQuota
-->
<template>
  <view>
    <NavBar>
      <span @click="changeSearchType">
        <i class="iconfont search-icon icon-gaojisousuo"></i>
      </span>
    </NavBar>
    <view class="business-access">
      <view class="search-box">
        <up-search
          v-model="search.data.buyerOrgname"
          v-insert-clear:[search.data.buyerOrgname]="resetSearch"
          :clearabled="false"
          :search-icon-size="0"
          placeholder="请输入买方名称/申请编号/客户经理/业务主管"
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
        <uni-list v-if="vm.clList && vm.clList.length">
          <view v-for="(item, index) in vm.clList" :key="item.refcode" class="list-item">
            <uni-list-item>
              <u-cell-group class="contentData" :border="false" :stop="true" @tap="viewDetail(item.refcode)">
                <view class="financingNo">
                  <u-row>
                    <u-col span="6.2">
                      <view class="text ellipsis">{{ item.applyNo }}</view>
                    </u-col>
                    <u-col span="5.8">
                      <view class="flex-box">
                        <view class="status-box">
                          <view class="status" :class="`status${item.finalStatus}`">
                            {{ getValueByKey(item.finalStatus, 'intClFinalStatus') }}
                          </view>
                        </view>
                      </view>
                    </u-col>
                  </u-row>
                </view>
                <u-cell :stop="false" title="买方名称" :value="item.buyerOrgname" :border="false" />

                <u-cell title="额度申请金额(万元)" :border="false">
                  <template #value>
                    <view class="apply-amt">
                      <text class="ccyid">{{ item.applyCcyid }}</text>
                      <text>{{ moneyFormat(item.applyAmt) }}</text>
                    </view>
                  </template>
                </u-cell>
                <u-cell :stop="false" title="客户经理" :value="item.userName" :border="false" />
                <u-cell :stop="false" title="业务主管" :value="item.superiorName" :border="false" />
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
            v-for="(obj, index) in auditList"
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
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import { moneyFormat } from '@/utils/format'
import { getValueByKey } from '@/utils/constant'
import apiQuotaQuery from '@/api/member/project/query/api.buyerQuotaQuery'
import { onReachBottom, onShow, onPullDownRefresh } from '@dcloudio/uni-app'
import { ClList } from '@/interfaces/member/project/query/buyerQuotaQuery'
import empty from '@/assets/empty/empty.png'
import { useRouter } from '@/uni-simple-router'
import { encodeBase64 } from '@/utils/crypto'
import CustomCheckbox from '../components/CustomCheckbox.vue'
const router = useRouter()
let finished = ref(false) // 数据是否已加载完
let showSearchModal = ref(false)
let tabIndex = ref(2) // 当前选中的持仓状态序号
let tabsList = [
  {
    name: '全部',
    value: 0
  },
  {
    name: '开立中',
    value: 0
  },
  {
    name: '已开立',
    value: 0
  },
  {
    name: '不可开立',
    value: 0
  }
]
const selectedSearch = ref(['11', '12']) // 默认都选中客户经理及主管
const selectedAudit = ref(['21']) // 默认都选中我审核的
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
const auditList: OptionItem[] = [{ name: '我审核的', icon: 'icon-yly_shenhe', key: '21', showCheck: true }]
interface SearchState {
  data: {
    buyerOrgname: string
    finalStatus: string
    queryTypeList: string[] // 指定数组元素类型
  }
  pageNum: number
  pageSize: number
}
// 用于搜索请求的数据
const search = reactive<SearchState>({
  data: {
    buyerOrgname: '',
    finalStatus: '99',
    queryTypeList: ['11', '12', '21']
  },
  pageNum: 1,
  pageSize: 10
})
let clList: ClList[] = []

const vm = reactive({
  clList: clList,
  tabsList: tabsList
})
let totalCount = ref(0)
/**
 * @Author: LongCan.Yang
 * @Date: 2024-07-03 19:59:16
 * @description: 获取笔数
 */
const getQuotaStatisticsCount = () => {
  const data = {
    queryTypeList: search.data.queryTypeList,
    buyerOrgname: search.data.buyerOrgname
  }
  apiQuotaQuery.getQuotaStatisticsCount(data).then(res => {
    vm.tabsList = [
      {
        name: '全部',
        value: res.data.count
      },
      {
        name: '开立中',
        value: res.data.ingCount
      },
      {
        name: '已开立',
        value: res.data.openedCount
      },
      {
        name: '不可开立',
        value: res.data.unopenedCount
      }
    ]
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:14:44
 * @description: 获取业务准入列表
 */
const findOverseasBusinessPage = () => {
  apiQuotaQuery.findQuotaPage(search).then(res => {
    if (res.data.clList && res.data.clList.length) {
      vm.clList.push(...res.data.clList)
    }
    totalCount.value = res.totalCount as number
    if (totalCount.value === vm.clList.length && totalCount.value > 0) {
      finished.value = true
    }
    getQuotaStatisticsCount()
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:31:01
 * @description: 点击搜索
 */
const searchProjectPage = () => {
  vm.clList = []
  search.pageNum = 1
  finished.value = false
  findOverseasBusinessPage()
}
const resetSearch = () => {
  search.data.buyerOrgname = ''
  searchProjectPage()
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:32:39
 * @description: 查看详情
 */
const viewDetail = (refcode: number) => {
  router.push(`/member/project/query/buyerQuota/detail/${encodeBase64(refcode)}`)
}
// 关闭筛选弹窗查询数据
const confirmQuery = () => {
  const list: string[] = [...selectedSearch.value, ...selectedAudit.value]
  search.data.queryTypeList = list
  showSearchModal.value = false
  searchProjectPage()
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
      search.data.finalStatus = ''
      break
    case 1:
      search.data.finalStatus = '0'
      break
    case 2:
      search.data.finalStatus = '99'
      break
    case 3:
      search.data.finalStatus = '97'
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
    findOverseasBusinessPage()
  }
})
onPullDownRefresh(() => {
  searchProjectPage()
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 600)
})
onMounted(() => {
  getQuotaStatisticsCount()
})
onShow(() => {
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
            &.status99 {
              border: 1rpx solid $u-success;
              color: $u-success;
            }
            &.status97 {
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
