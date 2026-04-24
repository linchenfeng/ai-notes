<!--
 * @Author       : ran.zhu
 * @Date         : 2022-10-13 09:14:01
 * @LastEditors  : LongCan.Yang
 * @LastEditTime : 2024-07-01 16:12:56
 * @Description  : 资产详情界面
-->
<template>
  <NavBar />
  <view class="mainView">
    <view class="head-container">
      <view class="compnayNameClass">
        {{ dataInfo.obj.fastArpMVoList && dataInfo.obj.fastArpMVoList.length ? dataInfo.obj.fastArpMVoList[0].orgname : '' }}
      </view>
      <view class="titleTop">
        <text class="typeLabel">单据类型：</text>
        <text class="leftSpan">{{ getValueByKey(item.arpType, 'arpType') }}</text>
        <view class="midView" @click="handelYear">
          <text class="midSpan">{{ obj.data.year }}</text>
          <text class="iconfont icon-caret-bottom"></text>
          <text class="annual">年度</text>
        </view>
        <text class="szSpan">{{ detailInfo.count }}</text>
        <text class="lastSpan">笔</text>
      </view>
    </view>

    <!-- 列表 -->
    <view class="scrollView">
      <uni-list>
        <uni-list-item v-for="(items, index) in dataInfo.obj.fastArpMVoList" :key="index">
          <view class="uview">
            <u-cell-group inset>
              <view class="subtitle">
                <u-cell :title="items.payOrgname" />
              </view>
              <view class="item-title">
                <u-cell title="单据日期" :value="dateFormat(items.drawDate)"></u-cell>
              </view>
              <view class="item-title">
                <u-cell title="单据金额" :value="moneyFormat(items.payAmt)"></u-cell>
              </view>
              <view class="item-title">
                <u-cell title="单据编号" :value="items.arpNo"></u-cell>
              </view>
            </u-cell-group>
          </view>
        </uni-list-item>
      </uni-list>
    </view>
  </view>
  <view>
    <u-picker :show="showYearPicker" :columns="columns" item-height="88" @confirm="doConfirm" @cancel="onCancel" />
  </view>
</template>
<script lang="ts">
export default {
  name: 'AssetStatisticsDetail'
}
</script>
<script lang="ts" setup>
import NavBar from '@/layout/NavBar.vue'
import { ASDetailModel } from '@/interfaces/member/customer/asDetail'
import apiCustormer from '@/api/member/api.custormer'
import { decodeBase64 } from '@/utils/crypto'
import { FastArpList } from '@/interfaces/member/customer/assetStatistics'
import { getValueByKey } from '@/utils/constant'
// import { PickerInstance } from 'vant'
import { dateFormat, moneyFormat } from '@/utils/format'
import { useRoute } from '@/uni-simple-router'
import { onReachBottom } from '@dcloudio/uni-app'
let showYearPicker = ref(false)
// const picker = ref<PickerInstance>()
type States = {
  [index: number]: Array<string>
}
const columns: States = reactive([[]])
const route = useRoute()
let refcode = Number(decodeBase64(route.value.params.refcode as string)) //客户流水号
let str = String(decodeBase64(route.value.params.itemstr))
let item: FastArpList = JSON.parse(str) as FastArpList
let totalCount = 0 //总条数

const detailInfo = reactive({
  arpType: item.arpType,
  year: item.selectYear,
  count: item.selectCount
})

let obj = {
  data: {
    arpType: item.arpType,
    orgRefcode: refcode,
    year: item.selectYear
  },
  pageNum: 1, //页码
  pageSize: 10 // 每页条数
}

const asdetailModel: ASDetailModel = {
  fastArpMVoList: []
}

const dataInfo = reactive({
  obj: asdetailModel
})

/**
 * @Author: ran.zhu
 * @Date: 2022-10-17 13:59:37
 * @param {*} void
 * @return {*}
 * @description: 获取统计详情列表接口
 */
const getListAPI = (): void => {
  apiCustormer.getAssetStatisticDetailListAPI(obj).then(res => {
    totalCount = res.totalCount as number
    if (res.data.fastArpMVoList && res.data.fastArpMVoList.length) {
      dataInfo.obj.fastArpMVoList.push(...res.data.fastArpMVoList)
    }
  })
}
onMounted(() => {
  getListAPI()
})
/**
 * @Author: ran.zhu
 * @Date: 2022-10-17 14:19:21
 * @param {*} void
 * @return {*}
 * @description: 弹框选择日期
 */
const handelYear = (): void => {
  if (item.dateList.length !== 0) {
    columns[0] = []
    for (let yearInfo of item.dateList) {
      columns[0].push(String(yearInfo.year))
    }
    // picker.value?.setColumnValues(0, columns)
    showYearPicker.value = true
  }
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-09-22 15:00:17
 * @return {*}
 * @description: 下滑加载更多的数据
 */
onReachBottom(() => {
  if (dataInfo.obj && dataInfo.obj.fastArpMVoList && dataInfo.obj.fastArpMVoList.length < totalCount) {
    obj.pageNum++
    getListAPI()
  }
})
const onCancel = () => {
  showYearPicker.value = false
}
const doConfirm = value => {
  obj.data.year = value.value[0]
  detailInfo.year = value.value[0]
  detailInfo.count = item.dateList[value.indexs[0]].countTotal
  showYearPicker.value = false
  obj.pageNum = 1
  dataInfo.obj.fastArpMVoList = []
  getListAPI()
}
</script>
<style lang="scss" scoped>
.mainView {
  .head-container {
    padding: $spaced;
    border-bottom: 2rpx solid #dedede;
    .compnayNameClass {
      font-size: 32rpx;
      margin-bottom: 20rpx;
    }
    .titleTop {
      display: flex;
      flex-direction: row;
      align-items: center;
      .typeLabel {
        font-size: 28rpx;
        color: $remark-color;
      }

      .leftSpan {
        text-align: left;
        font-size: 28rpx;
        color: $default-color;
      }

      .midView {
        position: absolute;
        font-size: 28rpx;
        margin: auto;
        left: 45%;
        .midSpan {
          color: #1a89f2;
          font-size: 28rpx;
        }
        .iconfont {
          font-size: 30rpx;
        }
        .annual {
          margin-left: 10rpx;
        }
      }
      .szSpan {
        font-size: 48rpx;
        margin-right: 6rpx;
        flex: 1;
        text-align: right;
      }
      .lastSpan {
        color: $remark-color;
        font-size: 27rpx;
        margin-right: 0;
        margin-top: 15rpx;
      }
    }
  }
  :deep(.u-cell-group) {
    border-bottom: 1px solid #ebedf0;
    .subtitle .u-cell__body__content {
      width: 60%;
    }
    .item-title .u-cell__body__content {
      width: 30%;
    }
  }
}
</style>
