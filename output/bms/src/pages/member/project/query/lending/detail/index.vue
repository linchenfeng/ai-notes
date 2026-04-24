<!--
 * @Author       : longcan.Yang
 * @Date         : 2022-10-18 16:23:24
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-02-08 09:16:51
 * @Description  : 项目信息 /member/project/detail/:orgname/:cpOrgname/:year/:approveStatus
-->
<template>
  <NavBar />

  <view class="projectInfo">
    <view class="orgName">
      <u-row>
        <u-col span="4"><view class="describe">客户名称：</view></u-col>
        <u-col span="8">
          <u-input
            v-model="search.data.orgname"
            v-insert-clear:[search.data.orgname]="() => (search.data.orgname = '')"
            maxlength="450"
            placeholder="请输入客户名称"
          />
        </u-col>
      </u-row>
    </view>
    <view class="opponent">
      <u-row>
        <u-col span="4"><view class="describe">交易对手名称：</view></u-col>
        <u-col span="8">
          <u-input
            v-model="search.data.cpOrgname"
            v-insert-clear:[search.data.cpOrgname]="() => (search.data.cpOrgname = '')"
            maxlength="450"
            placeholder="请输入交易对手名称"
          />
        </u-col>
      </u-row>
    </view>
    <view class="applyDate">
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

    <view class="search">
      <u-row>
        <u-col span="4">
          <view class="count">
            总计
            <text class="totalCount">{{ totalCount }}</text>
            笔
          </view>
        </u-col>
        <u-col span="8">
          <u-button size="large" block :loading="buttonLoading" type="primary" @click="searchProjectPage">
            <cover-image src="@/assets/member/customer/search.png" alt="图片" />
            <text>搜索</text>
          </u-button>
        </u-col>
      </u-row>
    </view>
  </view>
  <view class="line"></view>
  <view class="content">
    <uni-list v-if="vm.myProjectDetail.floaArpMVoList && vm.myProjectDetail.floaArpMVoList.length">
      <uni-list-item v-for="item in vm.myProjectDetail.floaArpMVoList" :key="item.refcode" @tap="viewDetail(item.refcode)">
        <view class="contentData">
          <view class="orgName">
            <u-row>
              <u-col span="12">
                <view class="describe">{{ item.orgname }}</view>
              </u-col>
            </u-row>
          </view>
          <view class="itemInfo">
            <u-row>
              <u-col span="4">
                <view class="describe">交易对手名称</view>
              </u-col>
              <u-col span="8">
                <view class="definiteData">{{ item.buyerName }}</view>
              </u-col>
            </u-row>
          </view>
          <view class="itemInfo">
            <u-row>
              <u-col span="4">
                <view class="describe">融资申请编号</view>
              </u-col>
              <u-col span="8">
                <view class="definiteData">{{ item.loanNo }}</view>
              </u-col>
            </u-row>
          </view>
          <view class="itemInfo">
            <u-row>
              <u-col span="4">
                <view class="describe">融资申请日</view>
              </u-col>
              <u-col span="8">
                <view class="definiteData">{{ dateFormat(item.applyDate) }}</view>
              </u-col>
            </u-row>
          </view>
        </view>
      </uni-list-item>
      <view v-if="finished" class="list-is-finished">已经到底了</view>
    </uni-list>
    <!-- <u-empty v-else :image="empty" :image-size="[164, 130]" description="暂无数据" /> -->
    <u-empty v-else mode="data" :text="'暂无数据'" :icon="empty" width="300" height="244"></u-empty>
  </view>

  <!-- <u-popup v-model:show="showDatePicker" position="bottom"> -->
  <u-datetime-picker
    v-model="temApplyDate"
    :show="showDatePicker"
    mode="date"
    item-height="88"
    :title="dateType === 'S' ? '开始日期' : '结束日期'"
    :min-date="date.minDate"
    :max-date="date.maxDate"
    @cancel="onCancel"
    @confirm="doConfirm"
  />
  <!-- </u-popup> -->
  <!-- <u-popup v-model:show="showScheduleFlag" position="bottom"> -->
  <u-picker :show="showScheduleFlag" :columns="columns" item-height="88" key-name="value" @confirm="onConfirm" @cancel="showScheduleFlag = false" />
  <!-- </u-popup> -->
</template>
<script lang="ts">
export default {
  name: 'ProjectDetail',
  options: {
    styleIsolation: 'shared' // 解除样式隔离
  }
}
</script>
<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import apiProject from '@/api/member/api.project'
import { MyProjectDetail } from '@/interfaces/member/project/query/projectStatistics'
import { encodeBase64, decodeBase64 } from '@/utils/crypto'
import dayjs from 'dayjs'
// import { showToast } from '@/utils/uniapp/toast'
import empty from '@/assets/empty/empty.png'
import { dateFormat } from '@/utils/format'
import { ConstantArray } from '@/interfaces/common/constant'
import { getConstant, getValueByKey } from '@/utils/constant'
import { useRoute, useRouter } from '@/uni-simple-router'
import { onReachBottom } from '@dcloudio/uni-app'
let showDatePicker = ref(false) // 是否弹出日期选择器
let dateType = ref('') // 选择的日期类型【S=开始时间/E=结束时间】
let finished = ref(false) // 数据是否已加载完
let temApplyDate = ref('') // 时间选择器返回的数据，格式化后展示
let loading = ref(false)
let buttonLoading = ref(false)
// const columnsFieldNames = reactive({ text: 'value' })
let showScheduleFlag = ref(false)
// const columns: Array<Constant> = reactive([{ key: '', value: '全部' }].concat(getConstant('approveStatus')))
const columns: ConstantArray = reactive([[{ key: '', value: '全部' }].concat(getConstant('approveStatus'))])
const date = {
  // 日期选择区间，仅供选择近三年数据
  minDate: new Date(new Date().getFullYear() - 2, 0, 1),
  maxDate: new Date()
}
// let themeVars = {
//   buttonLargeHeight: '34rpx',
//   buttonBorderRadius: '2rpx'
// }
const route = useRoute()
let selectOrgname = decodeBase64(route.value.params.orgname as string) // 客户名称
let selectCpOrgname = decodeBase64(route.value.params.cpOrgname as string) // 交易对手名称
let selectYear = decodeBase64(route.value.params.year as string) // 年份
let approveStatus = decodeBase64(route.value.params.approveStatus as string) // 项目进度
/**
 * @Author: longcan.Yang
 * @Date: 2022-10-19 09:41:58
 * @return {*}
 * @description: 用于搜索请求的数据
 */
const search = reactive({
  data: {
    orgname: '',
    cpOrgname: '',
    approveStatus: '',
    approveStatusText: '全部',
    applyDateStart: '',
    applyDateEnd: ''
  },
  pageNum: 1,
  pageSize: 10
})
let data: MyProjectDetail = {
  floaArpMVoList: []
}
const vm = reactive({
  myProjectDetail: data
})
let totalCount = ref(0)
const findCustomProjectPage = () => {
  buttonLoading.value = true
  apiProject.findCustomProjectPage(search).then(
    res => {
      if (res.data.floaArpMVoList && res.data.floaArpMVoList.length) {
        vm.myProjectDetail.floaArpMVoList.push(...res.data.floaArpMVoList)
      }
      totalCount.value = res.totalCount as number
      if (totalCount.value === vm.myProjectDetail.floaArpMVoList.length && totalCount.value > 0) {
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
/**
 * @Author: longcan.Yang
 * @Date: 2023-07-31 10:18:25
 * @param {*} value
 * @return {*}
 * @description: 审批进度确认
 */
const onConfirm = value => {
  search.data.approveStatusText = value.value[0].value
  search.data.approveStatus = value.value[0].key
  showScheduleFlag.value = false
}
onMounted(() => {
  // 初始化,项目进度进入selectOrgname，selectCpOrgname，selectYear均为'0'
  search.data.orgname = selectOrgname !== '0' ? selectOrgname : ''
  search.data.cpOrgname = selectCpOrgname !== '0' ? selectCpOrgname : ''
  if (approveStatus) {
    search.data.approveStatus = approveStatus
    search.data.approveStatusText = getValueByKey(search.data.approveStatus, 'approveStatus')
  }
  if (selectYear === '0') {
    search.data.applyDateStart = new Date().getFullYear() + '-01-01'
    search.data.applyDateEnd = new Date().getFullYear() + '-12-31'
  } else {
    search.data.applyDateStart = selectYear + '-01-01'
    search.data.applyDateEnd = selectYear + '-12-31'
  }
  findCustomProjectPage()
})
/**
 * @Author: longcan.Yang
 * @Date: 2022-10-25 09:54:28
 * @param {*} type
 * @return {*}
 * @description:搜索先清空数据再调接口
 */
const searchProjectPage = () => {
  vm.myProjectDetail.floaArpMVoList = []
  search.pageNum = 1
  finished.value = false
  findCustomProjectPage()
}
const getDate = type => {
  showDatePicker.value = true
  dateType.value = type
}
const doConfirm = value => {
  if (dateType.value === 'S' && value.value) {
    if (search.data.applyDateEnd && dayjs(value.value) > dayjs(search.data.applyDateEnd)) {
      // Toast('开始日期不能大于结束日期')
      return
    }
    search.data.applyDateStart = dateFormat(value.value)
  } else if (dateType.value === 'E' && value.value) {
    if (search.data.applyDateStart && dayjs(value.value) < dayjs(search.data.applyDateStart)) {
      // Toast('结束日期不能小于开始日期')
      return
    }
    search.data.applyDateEnd = dateFormat(value.value)
  }
  showDatePicker.value = false
}
const onCancel = () => {
  showDatePicker.value = false
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-09-22 15:29:16
 * @description: 上划加载更多数据
 */
onReachBottom(() => {
  loading.value = true
  if (search.pageNum < Math.ceil(totalCount.value / search.pageSize)) {
    search.pageNum++
    findCustomProjectPage()
  }
})
/**
 * @Author: longcan.Yang
 * @Date: 2022-10-19 10:58:26
 * @return {*}
 * @description: 查看项目明细
 */
const router = useRouter()
// refcode:融资流水号
const viewDetail = refcode => {
  router.push(`/member/project/query/lending/info/${encodeBase64(refcode)}`)
}
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
  .orgName,
  .opponent,
  .applyDate {
    font-size: 28rpx;
    margin-bottom: 30rpx;

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
  .count {
    // text-align: right;
    height: 68rpx;
    // vertical-align: middle;

    // text-align: left;
    font-size: 28rpx;
    line-height: 68rpx;
    // height: 68rpx;
    .totalCount {
      color: rgb(255, 47, 47);
    }
  }
  .search {
    cover-image {
      width: 24rpx;
      height: 24rpx;
      margin-right: 23rpx;
      // vertical-align: text-bottom;
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
  background: #f6f6f6;
  margin-top: 30rpx;
}
.content {
  padding: 0 30rpx;
  font-size: 28rpx;
  .contentData {
    border-bottom: 1rpx solid $border-color;
  }
  .orgName {
    font-weight: bold;
    margin: 40rpx 0 30rpx 0;
  }
  .itemInfo {
    margin-bottom: 30rpx;
    .describe {
      color: $remark-color;
    }
    .definiteData {
      text-align: right;
    }
  }
}
</style>
