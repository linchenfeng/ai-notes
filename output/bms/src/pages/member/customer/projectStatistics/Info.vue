<!--
 * @Author       : longcan.Yang
 * @Date         : 2022-10-17 10:32:46
 * @LastEditors  : ran.zhu
 * @LastEditTime : 2025-08-06 14:17:07
 * @Description  : 更多项目信息
-->
<template>
  <NavBar />
  <view class="projectInfo">
    <u-row>
      <u-col span="12">
        <view class="orgName">{{ vm.projectInVo.orgname }}</view>
      </u-col>
    </u-row>
    <view class="opponent">
      <u-row>
        <u-col span="4"><view class="describe">审批进度：</view></u-col>
        <u-col span="8">
          <view class="unFocus">
            <u-input
              v-model="search.data.approveStatusText"
              maxlength="20"
              suffix-icon="arrow-down"
              placeholder="请选择审批进度"
              @tap="showScheduleFlag = true"
            />
          </view>
        </u-col>
      </u-row>
    </view>
    <view v-if="search.data.approveStatus === '4'" class="applyDate">
      <u-row>
        <u-col span="4"><view class="describe">实际放款日：</view></u-col>
        <u-col span="8">
          <view class="selectDate unFocus">
            <view class="dateInterval"><u-input v-model="search.data.loanDateStart" placeholder="开始日期" @tap="getDate('LS')" /></view>
            <view class="connect">~</view>
            <view class="dateInterval"><u-input v-model="search.data.loanDateEnd" placeholder="结束日期" @tap="getDate('LE')" /></view>
          </view>
        </u-col>
      </u-row>
    </view>
    <view v-else class="applyDate">
      <u-row>
        <u-col span="4"><view class="describe">融资申请日：</view></u-col>
        <u-col span="8">
          <view class="selectDate unFocus">
            <view class="dateInterval"><u-input v-model="search.data.applyDateStart" placeholder="开始日期" @tap="getDate('S')" /></view>
            <view class="connect">~</view>
            <view class="dateInterval"><u-input v-model="search.data.applyDateEnd" placeholder="结束日期" @tap="getDate('E')" /></view>
          </view>
        </u-col>
      </u-row>
    </view>
    <view class="opponent">
      <u-row>
        <u-col span="4"><view class="describe">交易对手名称：</view></u-col>
        <u-col span="8">
          <u-input
            v-model="search.data.orgname"
            v-insert-clear:[search.data.orgname]="() => (search.data.orgname = '')"
            maxlength="450"
            placeholder="请输入交易对手名称"
          />
        </u-col>
      </u-row>
    </view>
    <view class="search">
      <u-row>
        <!-- <u-config-provider :theme-vars="themeVars"> -->
        <u-col span="12">
          <u-button size="large" block :loading="buttonLoading" type="primary" @click="searchData">
            <cover-image src="@/assets/member/customer/search.png" alt="图片" />
            <text>搜索</text>
          </u-button>
        </u-col>
        <!-- </u-config-provider> -->
      </u-row>
    </view>
  </view>
  <view class="line"></view>

  <view class="detail">
    <u-sticky offset-top="44" custom-nav-height="44">
      <view class="titleView">
        <u-row :wrap="false">
          <u-col span="6"><view class="ttClass">交易对手名称</view></u-col>
          <u-col span="4"><view class="ttClass">融资申请日</view></u-col>
          <u-col span="2"><view class="ttClass">笔数</view></u-col>
        </u-row>
      </view>
    </u-sticky>
    <view class="listView">
      <uni-list v-if="vm.projectInVo.floaArpMVoList && vm.projectInVo.floaArpMVoList.length">
        <uni-list-item v-for="(item, index) in vm.projectInVo.floaArpMVoList" :key="index" class="liView">
          <u-row :wrap="false" @click="viewDetail(item)">
            <u-col class="ellipsis" span="6">
              <view class="ttClass">{{ item.buyerName }}</view>
            </u-col>
            <u-col span="4">
              <view class="ttClass">{{ dateFormat(item.applyDate) }}</view>
            </u-col>
            <u-col class="ellipsis" span="2">
              <view class="ttClass">{{ item.countTotal }}</view>
            </u-col>
          </u-row>
        </uni-list-item>
        <view v-if="finished" class="list-is-finished">已经到底了</view>
      </uni-list>
      <u-empty v-else mode="data" :text="'暂无数据'" :icon="empty" width="300" height="244"></u-empty>
    </view>
  </view>
  <u-datetime-picker
    v-model="temApplyDate"
    :show="showDatePicker"
    :title="dateType === 'S' || dateType === 'LS' ? '开始日期' : '结束日期'"
    :min-date="date.minDate"
    :max-date="date.maxDate"
    mode="date"
    item-height="88"
    @cancel="onCancel"
    @confirm="doConfirm"
  />
  <u-picker :show="showScheduleFlag" :columns="columns" key-name="value" item-height="88" @confirm="onConfirm" @cancel="showScheduleFlag = false" />
</template>
<script lang="ts">
export default {
  name: 'ProjectStatisticsInfo',
  options: {
    styleIsolation: 'shared' // 解除样式隔离
  }
}
</script>
<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import { ProjectInfo } from '@/interfaces/member/project/query/projectStatistics'
import apiCustomer from '@/api/member/api.custormer'
import { encodeBase64, decodeBase64 } from '@/utils/crypto'
// import { onActivated, onDeactivated } from 'vue'
import dayjs from 'dayjs'
import { showToast } from '@/utils/uniapp/toast'
import { dateFormat } from '@/utils/format'
import empty from '@/assets/empty/empty.png'
import { ConstantArray } from '@/interfaces/common/constant'
import { getConstant, getValueByKey } from '@/utils/constant'
import { useRoute, useRouter } from '@/uni-simple-router'
import { onReachBottom } from '@dcloudio/uni-app'
const columns: ConstantArray = reactive([[{ key: '', value: '全部' }].concat(getConstant('approveStatus'))])
let showDatePicker = ref(false) // 是否弹出日期选择器
let dateType = ref('') // 选择的日期类型【S=开始时间/E=结束时间】
let finished = ref(false) // 数据是否已加载完
let temApplyDate = ref('') // 时间选择器返回的数据，格式化后展示
let loading = ref(false)
let buttonLoading = ref(false)
let showScheduleFlag = ref(false)
const date = {
  // 日期选择区间，仅供选择近三年数据
  minDate: new Date(new Date().getFullYear() - 2, 0, 1),
  maxDate: new Date()
}
let route = useRoute()
const search = reactive({
  data: {
    orgname: '',
    applyDateStart: '',
    applyDateEnd: '',
    loanDateStart: '',
    loanDateEnd: '',
    approveStatus: '4', // 运营状态
    approveStatusText: '财务已放款', // 状态描述
    refcode: Number(decodeBase64(route.value.params.refcode as string)) //客户流水号
  },
  pageNum: 1,
  pageSize: 10
})
const data: ProjectInfo = {
  projectCountTotal: 0,
  orgname: '',
  floaArpMVoList: [],
  loanAmtTotal: 0, // 融资金额
  financingAmtTotal: 0, // 融资金额
  repayAmtTotal: 0 // 还款金额
}
const vm = reactive({
  projectInVo: data
})
/**
 * @Author: longcan.Yang
 * @Date: 2022-10-17 15:57:26
 * @return {*}
 * @description: 获取客户更多项目信息
 */
let totalCount = 0
const findProjectStatisticsPage = () => {
  // 初始化显示今年整年区间
  buttonLoading.value = true
  apiCustomer.findProjectStatisticsPage(search).then(
    res => {
      vm.projectInVo.orgname = res.data.orgname
      if (res.data.floaArpMVoList && res.data.floaArpMVoList.length) {
        vm.projectInVo.floaArpMVoList.push(...res.data.floaArpMVoList)
      }
      totalCount = res.totalCount as number
      if (vm.projectInVo.floaArpMVoList.length === totalCount && totalCount > 0) {
        finished.value = true
      }
      buttonLoading.value = false
      loading.value = false
    },
    () => {
      buttonLoading.value = false
      loading.value = false
    }
  )
}
onMounted(() => {
  // 初始化
  search.data.loanDateStart = new Date().getFullYear() + '-01-01'
  search.data.loanDateEnd = new Date().getFullYear() + '-12-31'
  if (decodeBase64(route.value.params.approveStatus as string)) {
    // 审批进度跳入初始化状态
    search.data.approveStatus = decodeBase64(route.value.params.approveStatus as string)
    search.data.approveStatusText = getValueByKey(search.data.approveStatus, 'approveStatus')
  }
  if (search.data.approveStatus === '4') {
    search.data.applyDateStart = ''
    search.data.applyDateEnd = ''
  } else {
    search.data.loanDateStart = ''
    search.data.loanDateEnd = ''
  }
  findProjectStatisticsPage()
})
/**
 * @Author: longcan.Yang
 * @Date: 2022-10-25 09:51:42
 * @return {*}
 * @description: 搜索先清空数据再push
 */
const searchData = () => {
  vm.projectInVo.floaArpMVoList = []
  search.pageNum = 1
  finished.value = false
  findProjectStatisticsPage()
}
/**
 * @Author: longcan.Yang
 * @Date: 2022-10-17 13:51:22
 * @return {*}
 * @description: 查看项目详情
 */
let router = useRouter()
const viewDetail = item => {
  //refcode:客户流水号，buyerName：交易对手名称,applyDate:融资申请日
  router.push(
    `/member/customer/projectStatistics/detail/${encodeBase64(search.data.refcode)}/${encodeBase64(item.buyerName)}/${encodeBase64(
      item.applyDate
    )}/${encodeBase64(search.data.approveStatus)}`
  )
}
/**
 * @Author: longcan.Yang
 * @Date: 2022-10-18 17:46:22
 * @param {*} type
 * @return {*}
 * @description: 选择时间搜索区间
 */
const getDate = type => {
  showDatePicker.value = true
  dateType.value = type
}
/**
 * @Author: longcan.Yang
 * @Date: 2022-10-18 17:47:03
 * @return {*}
 * @description: 确认日期时调用
 */
const doConfirm = value => {
  if (dateType.value === 'S' && value.value) {
    if (search.data.applyDateEnd && dayjs(value.value) > dayjs(search.data.applyDateEnd)) {
      showToast('开始日期不能大于结束日期')
      return
    }
    search.data.applyDateStart = dateFormat(value.value)
  } else if (dateType.value === 'E' && value.value) {
    if (search.data.applyDateStart && dayjs(value.value) < dayjs(search.data.applyDateStart)) {
      showToast('结束日期不能小于开始日期')
      return
    }
    search.data.applyDateEnd = dateFormat(value.value)
  } else if (dateType.value === 'LS' && value.value) {
    if (search.data.loanDateEnd && dayjs(value.value) > dayjs(search.data.loanDateEnd)) {
      showToast('开始日期不能大于结束日期')
      return
    }
    search.data.loanDateStart = dateFormat(value.value)
  } else if (dateType.value === 'LE' && value.value) {
    if (search.data.loanDateStart && dayjs(value.value) < dayjs(search.data.loanDateStart)) {
      showToast('结束日期不能小于开始日期')
      return
    }
    search.data.loanDateEnd = dateFormat(value.value)
  }
  showDatePicker.value = false
}
const onCancel = () => {
  showDatePicker.value = false
}
/**
 * @Author: longcan.Yang
 * @Date: 2022-10-18 17:47:58
 * @return {*}
 * @description: 上划列表时调用
 */
onReachBottom(() => {
  if (search.pageNum < Math.ceil(totalCount / search.pageSize)) {
    loading.value = true
    search.pageNum++
    findProjectStatisticsPage()
  }
})

// let whether = ref(false)
// const handleScroll = () => {
//   let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
//   let offsetTop = 190
//   whether.value = scrollTop > offsetTop
// }
const onConfirm = value => {
  search.data.approveStatusText = value.value[0].value
  search.data.approveStatus = value.value[0].key
  // 财务已放款清空申请日期
  if (search.data.approveStatus === '4') {
    search.data.applyDateStart = ''
    search.data.applyDateEnd = ''
  } else {
    // 非财务已放款清空融资日期
    search.data.loanDateStart = ''
    search.data.loanDateEnd = ''
  }
  showScheduleFlag.value = false
}
// onActivated(() => {
//   window.addEventListener('scroll', handleScroll)
//   handleScroll()
// })
// onDeactivated(() => {
//   window.removeEventListener('scroll', handleScroll)
// })
</script>

<style lang="scss" scoped>
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
  .orgName {
    font-size: 32rpx !important;
    margin-bottom: 35rpx;
  }
  .opponent,
  .applyDate {
    font-size: 28rpx !important;
    margin-bottom: 30rpx;
    .selectDate {
      display: flex;
      .dateInterval {
        width: 44%;
      }
    }
    .connect {
      width: 12%;
      text-align: center;
      line-height: 68rpx;
    }
    .describe {
      // padding-right: 20rpx;
      text-align: right;
      line-height: 68rpx;
    }
  }
  .search {
    cover-image {
      width: 24rpx;
      height: 24rpx;
      color: white;
      margin-right: 23rpx;
    }
    span {
      font-size: 28rpx;
    }
    :deep(.u-button) {
      height: 80rpx;
    }
  }
}
.line {
  width: 100%;
  height: 20rpx;
  background: $bg-color;
  margin-top: 30rpx;
}
.detail {
  .titleView {
    padding: 30rpx;
    border-bottom: 1rpx solid $border-color;
    color: $sub-color;
    background-color: #fff;
  }
  .listView {
    padding: 0 30rpx;
    .liView {
      padding: 30rpx;
      &:nth-of-type(even) {
        background: var(--u-stripe);
      }
    }
  }
}

:deep(.u-col) {
  font-size: 28rpx;
  white-space: nowrap;
  &.u-col-2,
  &.u-col-4 {
    text-align: center !important;
  }
}
</style>
