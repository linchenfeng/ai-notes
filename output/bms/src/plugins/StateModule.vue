<!--
 * @Author       : longcan.Yang
 * @Date         : 2023-08-30 11:22:16
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-04-18 14:34:00
 * @Description  : 右上角状态模块
-->
<template>
  <view class="stateModule">
    <view class="triangle" :class="props.stateColor"></view>
    <view
      class="stateInfo"
      :class="props.stateName && props.stateName.length >= 5 ? 'miniInfo' : props.stateName && props.stateName.length === 4 ? 'mediumInfo' : ''"
    >
      {{ props.stateName }}
    </view>
  </view>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
type Color = 'success' | 'warning' | 'error' | 'primary'
const props = defineProps({
  stateName: { type: String, required: true }, // 状态描述
  stateColor: {
    type: String as PropType<Color>,
    required: true
    // validator(value) {
    //   return ['success', 'warning', 'error', 'primary'].includes(value) //状态颜色
    // }
  }
})
</script>

<style lang="scss" scoped>
// 右上角状态
.stateModule {
  position: absolute;
  top: 0;
  right: 0;
  width: 144rpx;
  height: 126rpx;
  box-sizing: border-box;
  z-index: 10;
  overflow: hidden;
  .triangle {
    width: 0;
    height: 0;
    position: absolute;
    top: 0;
    right: 0;
    border-width: 126rpx 0 0 144rpx;
    border-style: solid;
    box-sizing: border-box;
    &.error {
      border-color: $u-error transparent transparent transparent;
    }
    &.warning {
      border-color: $u-warning transparent transparent transparent;
    }
    &.primary {
      border-color: $u-primary transparent transparent transparent;
    }
    &.success {
      border-color: $u-success transparent transparent transparent;
    }
  }
  .mediumInfo {
    width: 120rpx;
    top: 30rpx !important;
    right: -16rpx !important;
    font-size: 24rpx !important;
    text-align: center;
  }
  .miniInfo {
    width: 90rpx;
    top: 14rpx !important;
    right: 0rpx !important;
    font-size: 24rpx !important;
    text-align: center;
  }
  .stateInfo {
    position: absolute;
    transform: rotate(45deg);
    font-size: 28rpx;
    color: #fff;
    right: 2rpx;
    top: 28rpx;
  }
}
</style>
