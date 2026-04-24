<!--
 * @Author       : longcan.Yang
 * @Date         : 2022-10-10 22:52:56
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-05-08 11:10:53
 * @Description  :我的客户详情页面 资产统计模块
-->
<template>
  <view class="operationContainer">
    <ty-info-card>
      <template #subtitle>
        <view class="operationName">
          <view>{{ '资产统计' }}</view>
          <view class="badge-margin">
            <u-badge :value="arpCountTotal" max="999" :show-zero="true"></u-badge>
          </view>
        </view>
      </template>
      <view class="detail">
        <view v-if="approvalProcessVo.fastArpMVoList && approvalProcessVo.fastArpMVoList.length">
          <view v-for="(item, index) in approvalProcessVo.fastArpMVoList" :key="index" class="assetDetail">
            <u-row :wrap="false" @click="viewDetail(item)">
              <u-col span="2">
                <view class="icon">
                  <view class="png"><cover-image loading="true" :src="pngVo[item.arpType]" alt="资产类型" /></view>
                  <view class="line">
                    <cover-image src="@/assets/member/customer/assetStatistics/line.png" alt="过渡线" />
                  </view>
                </view>
              </u-col>
              <u-col span="3.5">
                <view class="assetType">{{ getValueByKey(item.arpType, 'arpType') }}</view>
              </u-col>
              <u-col span="4">
                <view class="year" @click.stop="doShowPicker(item, index)">
                  <text class="selectYear">{{ item.selectYear }}</text>
                  <view><cover-image :src="item.showPicker ? dateTop : dateBottom" alt="图片" /></view>
                  <view class="annual">年度</view>
                </view>
              </u-col>
              <u-col span="2.5">
                <view class="count">
                  <text>{{ item.selectCount }}</text>
                  <text class="unit">笔</text>
                </view>
              </u-col>
            </u-row>
          </view>
        </view>
        <u-empty v-else mode="data" :text="'暂无数据'" :icon="empty" width="160" height="130" />
      </view>
    </ty-info-card>
  </view>
  <view>
    <u-picker :show="showYearPicker" :columns="columns" item-height="88" @confirm="doConfirm" @cancel="onCancel" />
  </view>
</template>
<script lang="ts">
export default {
  name: 'AssetStatistics',
  options: {
    styleIsolation: 'shared' // 解除样式隔离
  }
}
</script>
<script setup lang="ts">
import fapiao from '@/assets/member/customer/assetStatistics/fapiao.png'
import huoyundan from '@/assets/member/customer/assetStatistics/huoyundan.png'
import jiesuandan from '@/assets/member/customer/assetStatistics/jiesuandan.png'
import yanhuodan from '@/assets/member/customer/assetStatistics/yanhuodan.png'
import { AssetStatistics, FastArpList } from '@/interfaces/member/customer/assetStatistics'
import dindan from '@/assets/member/customer/assetStatistics/dindan.png'
import hetong from '@/assets/member/customer/assetStatistics/hetong.png'
import qita from '@/assets/member/customer/assetStatistics/qita.png'
import shangpiao from '@/assets/member/customer/assetStatistics/shangpiao.png'
import shouhuodan from '@/assets/member/customer/assetStatistics/shouhuodan.png'
import yinpiao from '@/assets/member/customer/assetStatistics/yinpiao.png'
import empty from '@/assets/empty/empty.png'
import dateBottom from '@/assets/member/customer/assetStatistics/dateBottom.png'
import dateTop from '@/assets/member/customer/assetStatistics/dateTop.png'
import { getValueByKey } from '@/utils/constant'
import apiCustomer from '@/api/member/api.custormer'
import { encodeBase64 } from '@/utils/crypto'

import { useRouter } from '@/uni-simple-router'
let showYearPicker = ref(false)
let arpCountTotal = ref(0)
//企业流水号
const props = defineProps({ refcode: { type: Number, required: true } })
let approvalProcessVo: AssetStatistics = reactive({
  fastArpMVoList: []
})
// 每个资产类型对应的图片
const pngVo = {
  1: hetong, // 合同
  2: dindan, // 订单
  3: fapiao, //发票
  5: qita, //其他
  8: yinpiao, //银票
  9: shangpiao, //商票
  A: huoyundan, // 货运单
  B: shouhuodan, //收货单
  D: yanhuodan, //验货单
  C: jiesuandan //结算单
}
/**
 * @Author: longcan.Yang
 * @Date: 2022-10-13 17:42:51
 * @return {*}
 * @description: 获取资产统计信息
 */
const getCustomAssetStatistics = () => {
  apiCustomer.getCustomAssetStatistics(props.refcode).then(res => {
    approvalProcessVo.fastArpMVoList = res.data.fastArpMVoList
    if (approvalProcessVo.fastArpMVoList && approvalProcessVo.fastArpMVoList.length) {
      approvalProcessVo.fastArpMVoList.forEach(item => {
        item.showPicker = false
        if (item.dateList && item.dateList.length) {
          item.selectYear = item.dateList[0].year
          item.selectCount = item.dateList[0].countTotal
          arpCountTotal.value = arpCountTotal.value + item.dateList[0].countTotal
        }
      })
    }
  })
}

onMounted(() => {
  getCustomAssetStatistics()
})

/**
 * @Author: longcan.Yang
 * @Date: 2022-10-12 15:17:01
 * @param {*} item
 * @return {*}
 * @description: 点击年份显示年份选择器
 */
let currentIndex = '' //当前点击的单据index
type States = {
  [index: number]: Array<string>
}
const columns: States = reactive([[]])
const doShowPicker = (item, index): void => {
  columns[0] = []
  currentIndex = index
  approvalProcessVo.fastArpMVoList[currentIndex].dateList.forEach(itemInfo => {
    columns[0].push(itemInfo.year)
  })
  item.showPicker = true
  showYearPicker.value = true
}
/**
 * @Author: longcan.Yang
 * @Date: 2022-10-13 00:02:51
 * @param {*} void
 * @return {*}
 * @description: 点击取消关闭弹框
 */
const onCancel = (): void => {
  showYearPicker.value = false
  // approvalProcessVo.fastArpList[currentIndex].showPicker = false
}
/**
 * @Author: longcan.Yang
 * @Date: 2022-10-12 17:01:28
 * @param {*} year
 * @return {*}
 * @description: 选中年份确认同步更新视图
 */
const doConfirm = (year): void => {
  let count = 0
  approvalProcessVo.fastArpMVoList[currentIndex].selectYear = year.value[0]
  approvalProcessVo.fastArpMVoList[currentIndex].dateList.forEach(item => {
    if (item.year === year.value[0]) {
      approvalProcessVo.fastArpMVoList[currentIndex].selectCount = item.countTotal
    }
  })
  approvalProcessVo.fastArpMVoList.forEach(item => {
    let currentCount = item.selectCount as number
    count = count + currentCount
  })
  arpCountTotal.value = count
  showYearPicker.value = false
  // approvalProcessVo.fastArpList[currentIndex].showPicker = false
}
/**
 * @Author: longcan.Yang
 * @Date: 2022-10-13 09:24:26
 * @return {*}
 * @description: 解决点击阴影时间选择器消失但是无法触发事件的问题，修改当前资产下拉icon
 */
watch(showYearPicker, (newValue, oldValue) => {
  if (newValue !== oldValue && newValue === false) {
    approvalProcessVo.fastArpMVoList[currentIndex].showPicker = false
  }
})
/**
 * @Author: longcan.Yang
 * @Date: 2022-10-18 16:55:27
 * @return {*}
 * @description: 跳转至资产详情页面
 */
let router = useRouter()
const viewDetail = (item: FastArpList) => {
  let itemstr = JSON.stringify({
    dateList: item.dateList,
    arpType: item.arpType,
    selectYear: item.selectYear,
    selectCount: item.selectCount
  })

  router.push(`/member/customer/assetStatistics/detail/${encodeBase64(props.refcode)}/${encodeBase64(itemstr)}`)
}
</script>

<style lang="scss" scoped>
uni-cover-image {
  overflow: inherit;
}
.badge-margin {
  position: relative;
  left: 10rpx;
  top: -20rpx;
}
.detail {
  .assetDetail {
    font-size: 28rpx;
    &:last-child {
      .line {
        display: none;
      }
    }

    text-align: center;
    .png {
      display: flex;
      cover-image {
        width: 44rpx;
        height: 44rpx;
      }
    }
    .line {
      margin: 9rpx 2rpx;
      padding-left: 14rpx;
      cover-image {
        height: 40rpx;
        width: 4rpx;
      }
    }
    .assetType {
      width: 120rpx;
      height: 44rpx;
      display: flex;
      align-items: center;
      text-align: center;
    }
    .count {
      height: 44rpx;
      display: flex;
      align-items: center;
      justify-content: end;
      .unit {
        margin-left: 3rpx;
      }
    }
    .annual {
      margin-left: 10rpx;
    }
    .year {
      display: flex;
      width: 160rpx;
      padding-top: 1rpx;
      .selectYear {
        margin-top: 2rpx;
      }
      cover-image {
        width: 18rpx;
        height: 12rpx;
        margin-left: 5px;
      }
    }
  }
  :deep(.u-empty) {
    padding: 0;
  }
  :deep(.u-row) {
    align-items: flex-start !important;
  }
}
</style>
