<!--
 * @Author       : Longcan.Yang
 * @Date         : 2024-10-12 10:27:50
 * @LastEditors  : ran.zhu
 * @LastEditTime : 2025-09-23 17:34:34
 * @Description  : 项目-业务查询-申请书查询 /member/project/query/application
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
          v-model="search.data.orgname"
          v-insert-clear:[search.data.orgname]="resetSearch"
          :clearabled="false"
          :search-icon-size="0"
          placeholder="请输入卖方名称/买方名称/客户经理/业务主管"
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
      <!-- <view class="line"></view> -->
      <view class="content">
        <uni-list v-if="vm.appList && vm.appList.length">
          <uni-list-item v-for="(item, i) in vm.appList" :key="i" class="list-item" @tap="viewDetail(item)">
            <u-cell-group class="contentData" :border="false" :stop="true">
              <view class="financingNo">
                <u-row>
                  <u-col span="8">
                    <view class="text">{{ item.applyNo }}</view>
                  </u-col>
                  <u-col span="4">
                    <view class="status-box">
                      <view class="status" :class="`status${item.applyStatus}`">
                        {{ getValueByKey(item.applyStatus, 'applicationApplyStatus') }}
                      </view>
                    </view>
                  </u-col>
                </u-row>
              </view>
              <u-cell :stop="false" title="业务产品" :value="getProduceType(item.bizScene, item.productType)" :border="false" />
              <u-cell :stop="false" title="客户经理" :value="item.userName" :border="false" />
              <u-cell :stop="false" title="业务主管" :value="item.superiorName" :border="false" />
              <u-cell :stop="false" title="申请人全称(卖方)" :value="item.orgname" :border="false" />
              <u-cell :stop="false" title="卖方所在国" :value="item.ctyDesc" :border="false" />
              <u-cell :stop="false" title="买方名称" :value="item.buyerOrgname" :border="false" />
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
import { onReachBottom, onShow, onPullDownRefresh } from '@dcloudio/uni-app'
import { ApplicationList } from '@/interfaces/member/project/apply/fillingApplication'
import empty from '@/assets/empty/empty.png'
import { useRouter } from '@/uni-simple-router'
import { encodeBase64 } from '@/utils/crypto'
import apiApplicationQuery from '@/api/member/project/query/api.applicationQuery'
import CustomCheckbox from '../components/CustomCheckbox.vue'
const router = useRouter()
let finished = ref(false) // 数据是否已加载完
let showSearchModal = ref(false)
let tabsList = [
  {
    name: '全部',
    value: 0
  },
  {
    name: '已申请',
    value: 0
  },
  {
    name: '已退回',
    value: 0
  },
  {
    name: '已通过',
    value: 0
  },
  {
    name: '已拒绝',
    value: 0
  }
]
const selectedSearch = ref(['11', '12']) // 默认都选中客户经理及主管
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
let tabIndex = ref(3) // 当前选中的持仓状态序号
interface SearchState {
  data: {
    orgname: string
    applyStatus: string
    queryTypeList: string[] // 指定数组元素类型
  }
  pageNum: number
  pageSize: number
}
// 用于搜索请求的数据
const search = reactive<SearchState>({
  data: {
    orgname: '',
    queryTypeList: ['11', '12'],
    applyStatus: '9'
  },
  pageNum: 1,
  pageSize: 10
})
let appList: ApplicationList[] = []

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
const getApplicationCount = () => {
  let data = {
    orgname: search.data.orgname,
    queryTypeList: search.data.queryTypeList
  }
  apiApplicationQuery.getApplicationCount(data).then(res => {
    vm.tabsList = [
      {
        name: '全部',
        value: res.data.count
      },
      {
        name: '已申请',
        value: res.data.countApply
      },
      {
        name: '已退回',
        value: res.data.countReturn
      },
      {
        name: '已通过',
        value: res.data.countPass
      },
      {
        name: '已拒绝',
        value: res.data.countRefuse
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
  apiApplicationQuery.findApplicationPage(search).then(res => {
    if (res.data && res.data.length) {
      vm.appList.push(...res.data)
    }
    totalCount.value = res.totalCount as number
    if (totalCount.value === vm.appList.length && totalCount.value > 0) {
      finished.value = true
    }
    getApplicationCount()
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
  search.data.orgname = ''
  searchProjectPage()
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:32:39
 * @description: 查看详情
 */
const viewDetail = item => {
  router.push(`/member/project/query/application/detail/${encodeBase64(item.refcode)}`)
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
      search.data.applyStatus = ''
      break
    case 1:
      search.data.applyStatus = '4'
      break
    case 2:
      search.data.applyStatus = '7'
      break
    case 3:
      search.data.applyStatus = '9'
      break
    case 4:
      search.data.applyStatus = '6'
      break
    default:
      break
  }
  searchProjectPage()
}
const changeSearchType = () => {
  showSearchModal.value = !showSearchModal.value
}
// 关闭筛选弹窗查询数据
const confirmQuery = () => {
  search.data.queryTypeList = selectedSearch.value
  showSearchModal.value = false
  searchProjectPage()
}
// 业务产品
const getProduceType = (bizScene: string, productType: string) => {
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
  getApplicationCount()
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
            &.status9 {
              border: 1rpx solid $u-success;
              color: $u-success;
            }
            &.status3,
            &.status6 {
              border: 1rpx solid $danger;
              color: $danger;
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
