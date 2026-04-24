<!--
 * @Author       : LongCan.Yang
 * @Date         : 2024-06-21 13:42:52
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2026-01-22 16:52:50
 * @Description  : 项目-业务查询-业务准入查询列表 /member/project/query/access
-->
<template>
  <view>
    <NavBar>
      <i v-if="getHasPermissionsById('member:project:query:preLoan:aiCustomerService')" class="iconfont icon-kefu" @click="toKefu"></i>
      <span @click="changeSearchType">
        <i class="iconfont search-icon icon-gaojisousuo"></i>
      </span>
    </NavBar>
    <view class="business-access">
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
      <view class="content">
        <uni-list v-if="vm.fintAplMList && vm.fintAplMList.length">
          <view v-for="(item, index) in vm.fintAplMList" :key="item.refcode" class="list-item">
            <uni-list-item>
              <u-cell-group class="contentData" :border="false" :stop="true" @tap="viewDetail(item.refcode)">
                <view class="financingNo">
                  <u-row>
                    <u-col span="7">
                      <view class="text ellipsis">{{ item.financingNo }}</view>
                    </u-col>
                    <u-col span="5">
                      <view class="flex-box">
                        <view class="status-box">
                          <view class="status" :class="`status${item.intLoanStatus}`">
                            {{
                              item.conditionFlag === '1' && item.intLoanStatus === '3'
                                ? '有条件准入'
                                : ['1'].includes(item.intLoanStatus)
                                ? getValueByKey(item.applyStatus, 'applyStatus')
                                : ['9'].includes(item.intLoanStatus)
                                ? getValueByKey('10', 'applyStatus')
                                : getValueByKey(item.intLoanStatus, 'intLoanStatus')
                            }}
                          </view>
                        </view>
                      </view>
                    </u-col>
                  </u-row>
                </view>
                <u-cell :stop="false" title="客户经理" :value="item.userName" :border="false" />
                <u-cell :stop="false" title="业务主管" :value="item.superiorName" :border="false" />
                <u-cell :stop="false" title="卖方名称" :value="item.orgname" :border="false" />
                <u-cell :stop="false" title="卖方所在国" :value="item.orgctyDesc" :border="false" />
                <u-cell :stop="false" title="买方名称" :value="item.counterpartyNames" :border="false" />
              </u-cell-group>
            </uni-list-item>

            <view class="line" :class="{ lastLine: index + 1 === vm.tabsList[tabIndex].value }"></view>
          </view>

          <view v-if="finished" class="list-is-finished">已经到底了</view>
        </uni-list>
        <u-empty v-else mode="data" :text="'暂无数据'" :icon="empty" width="300" height="244"></u-empty>
      </view>
      <u-picker :show="showStatusFlag" :columns="columns" item-height="88" key-name="value" @confirm="onConfirm" @cancel="showStatusFlag = false" />
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
            v-for="(obj, index) in sendList"
            :key="index"
            v-model="selectedSend"
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
import { ConstantArray } from '@/interfaces/common/constant'
import { getConstant, getValueByKey } from '@/utils/constant'
import apiBusinessQuery from '@/api/member/project/query/api.businessQuery'
import { onReachBottom, onShow, onPullDownRefresh } from '@dcloudio/uni-app'
import { FintAplMList } from '@/interfaces/member/project/audit/businessAccess'
import empty from '@/assets/empty/empty.png'
import { useRouter } from '@/uni-simple-router'
import { encodeBase64 } from '@/utils/crypto'
import apiBusinessAccess from '@/api/member/project/audit/api.businessAccess'
import apiMyInfo from '@/api/member/api.myinfo'
import { getHasPermissionsById } from '@/utils/permissions'
import CustomCheckbox from '../components/CustomCheckbox.vue'
const router = useRouter()
let finished = ref(false) // 数据是否已加载完
let showStatusFlag = ref(false)
let showSearchModal = ref(false)
let tabIndex = ref(3) // 当前选中的持仓状态序号
let userid = '' // 用户userid
let tabsList = [
  {
    name: '全部',
    value: 0
  },
  {
    name: '待准入',
    value: 0
  },
  {
    name: '已暂缓',
    value: 0
  },
  {
    name: '已准入',
    value: 0
  },
  {
    name: '已拒绝',
    value: 0
  }
]
const selectedSearch = ref(['11', '12']) // 默认客户经理及主管
const selectedSend = ref(['23']) // 默认抄送我的
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
const sendList: OptionItem[] = [{ name: '抄送我的', icon: 'icon-chaosongwode2', key: '23' }]
interface SearchState {
  data: {
    orgname: string
    intLoanStatus: string
    queryTypeList: string[] // 指定数组元素类型
  }
  pageNum: number
  pageSize: number
}
const columns: ConstantArray = reactive([[{ key: '', value: '全部' }].concat(getConstant('intLoanStatus'))])
// 用于搜索请求的数据
const search = reactive<SearchState>({
  data: {
    orgname: '',
    intLoanStatus: '3',
    queryTypeList: ['11', '12', '23']
  },
  pageNum: 1,
  pageSize: 10
})
let fintAplMList: FintAplMList[] = []

const vm = reactive({
  fintAplMList: fintAplMList,
  tabsList: tabsList
})
let totalCount = ref(0)
/**
 * @Author: LongCan.Yang
 * @Date: 2024-07-03 19:59:16
 * @description: 获取笔数
 */
const getOverseasBusinessCountInfo = () => {
  const data = {
    queryTypeList: search.data.queryTypeList,
    orgname: search.data.orgname
  }
  apiBusinessAccess.getOverseasBusinessCountInfo(data).then(res => {
    vm.tabsList = [
      {
        name: '全部',
        value: res.data.totalCount
      },
      {
        name: '待准入',
        value: res.data.processCount
      },
      {
        name: '已暂缓',
        value: res.data.postponeCount
      },
      {
        name: '已准入',
        value: res.data.passCount
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
const findOverseasBusinessPage = () => {
  apiBusinessQuery.findOverseasBusinessPage(search).then(res => {
    if (res.data.fintAplMList && res.data.fintAplMList.length) {
      vm.fintAplMList.push(...res.data.fintAplMList)
    }
    totalCount.value = res.totalCount as number
    if (totalCount.value === vm.fintAplMList.length && totalCount.value > 0) {
      finished.value = true
    }
    getOverseasBusinessCountInfo()
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 13:56:49
 * @description: 获取个人信息
 */
const getUserInfo = () => {
  apiMyInfo.getUserInfo().then(res => {
    userid = res.data.loginUser.userid
  })
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-09-29 15:32:48
 * @description: 跳转至小助手ai页面
 */
const toKefu = () => {
  let data = {
    userid,
    platform: 'BMS'
  }
  window.open(`/api-ibusweb/?data=${encodeBase64(JSON.stringify(data))}`, '_blank')
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:31:01
 * @description: 点击搜索
 */
const searchProjectPage = () => {
  vm.fintAplMList = []
  search.pageNum = 1
  finished.value = false
  findOverseasBusinessPage()
}
const resetSearch = () => {
  search.data.orgname = ''
  searchProjectPage()
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:31:24
 * @param {*} value
 * @description: 选择状态确定
 */
const onConfirm = value => {
  search.data.intLoanStatus = value.value[0].key
  showStatusFlag.value = false
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-25 15:32:39
 * @description: 查看详情
 */
const viewDetail = (refcode: number) => {
  router.push(`/member/project/query/access/detail/${encodeBase64(refcode)}`)
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
      search.data.intLoanStatus = ''
      break
    case 1:
      search.data.intLoanStatus = '1'
      break
    case 2:
      search.data.intLoanStatus = '9'
      break
    case 3:
      search.data.intLoanStatus = '3'
      break
    case 4:
      search.data.intLoanStatus = '4'
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
  //  将selectedSearch和selectedSend拼接
  const list: string[] = [...selectedSearch.value, ...selectedSend.value]
  search.data.queryTypeList = list
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
  getOverseasBusinessCountInfo()
  getUserInfo()
})
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
            &.status3 {
              border: 1rpx solid $u-success;
              color: $u-success;
            }
            &.status4 {
              border: 1rpx solid $danger;
              color: $danger;
            }
            &.status2 {
              border: 1rpx solid $danger;
              color: $danger;
            }
            &.fillingStatus1 {
              border: 1rpx solid $u-success;
              color: $u-success;
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
