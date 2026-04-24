<!--
 * @Author       : longcan.Yang
 * @Date         : 2022-10-10 22:50:34
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-08-22 15:59:24
 * @Description  : 我的客户详情页面 签约进度模块
-->
<template>
  <view class="operationContainer">
    <ty-info-card>
      <template #subtitle>
        <view class="operationName">
          <view>{{ '签约进度' }}</view>
          <view class="badge-margin">
            <u-badge :value="vm.signProcessVo.waitSignTotal + vm.signProcessVo.signedTotal" max="999" :show-zero="true"></u-badge>
          </view>
        </view>
      </template>
      <view class="detail">
        <view v-if="getHasPermissionsById('member:customer')" class="signDetail" @click="viewDetail('A')">
          <view class="flex">
            <cover-image src="@/assets/member/customer/noSign.png" alt="图片" />
            <text class="describe">待签约</text>
          </view>
          <view class="number">
            {{ vm.signProcessVo.waitSignTotal }}
          </view>
        </view>
        <view class="line">
          <cover-image src="@/assets/member/customer/signLine.png" alt="图片" />
        </view>
        <view v-if="getHasPermissionsById('member:customer')" class="signDetail" @click="viewDetail('B')">
          <view class="flex">
            <cover-image src="@/assets/member/customer/signed.png" alt="图片" />
            <text class="describe">已完成签约</text>
          </view>
          <view class="number">
            {{ vm.signProcessVo.signedTotal }}
          </view>
        </view>
      </view>
    </ty-info-card>
  </view>
</template>
<script lang="ts">
export default {
  name: 'SignProcess'
}
</script>
<script setup lang="ts">
import { SignProcess } from '@/interfaces/member/customer/signProcess'
import apiCustomer from '@/api/member/api.custormer'
import { encodeBase64 } from '@/utils/crypto'
import { getHasPermissionsById } from '@/utils/permissions'

import { useRouter } from '@/uni-simple-router'
const props = defineProps({ refcode: { type: Number, required: true } })
const signProcess: SignProcess = {
  signedTotal: 0,
  waitSignTotal: 0
}
const vm = reactive({
  signProcessVo: signProcess
})
const getCustomSignInfo = () => {
  apiCustomer.getCustomSignInfo(props.refcode).then(res => {
    vm.signProcessVo = res.data
    // vm.signProcessVo = { signedTotal: 28, waitSignTotal: 17 }
  })
}

let router = useRouter()
const viewDetail = type => {
  if (type === 'A' && vm.signProcessVo.waitSignTotal === 0) {
    return
  } else if (type === 'B' && vm.signProcessVo.signedTotal === 0) {
    return
  }
  // type=[A=待签约/B=完成签约]
  router.push(`/member/customer/signProcess/detail/${encodeBase64(props.refcode)}/${encodeBase64(type)}`)
}
onMounted(() => {
  getCustomSignInfo()
})
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
  margin-bottom: 30rpx;
  display: flex;
  justify-content: space-around;
  padding: 20rpx 30rpx 0;
  .signDetail {
    .flex {
      display: flex;
      align-items: center;
    }
    cover-image {
      width: 38rpx;
      height: 38rpx;
      vertical-align: middle;
    }
    .describe {
      font-size: 28rpx;
      color: $remark-color;
      margin-left: 4rpx;
    }
    .number {
      font-size: 48rpx;
      color: #000000;
      margin-top: 20rpx;
      text-align: center;
      // transform: translate(-50%);
      font-weight: bold;
    }
  }
  .line {
    margin-top: 10rpx;
    cover-image {
      height: 80rpx;
      width: 5rpx;
    }
    // width: 1rpx;
    // height: rpx;
    // background-color: $remark-color;
  }
}
</style>
