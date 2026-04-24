<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-01-13 16:45:50
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-10-20 14:40:16
 * @Description  : 信息卡片
-->
<template>
  <view class="card">
    <view v-if="showLine" class="border" :style="{ background: props.background }"></view>
    <view v-if="hasHeaderContent" class="card-header">
      <text v-if="props.title">
        <text v-if="props.required" class="required">*</text>
        <text>{{ props.title }}</text>
      </text>
      <slot name="subtitle" />
    </view>
    <view class="card-body" :class="!hasHeaderContent ? 'no-head' : ''">
      <slot></slot>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { defineProps, useSlots } from 'vue'
// 使用 useSlots 函数获取插槽
const slots = useSlots()
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  showLine: {
    type: Boolean,
    default: true
  },
  background: {
    type: String,
    default: '#f6f6f6'
  },
  // 是否必填
  required: {
    type: Boolean,
    default: false
  }
})
// 定义计算属性 hasHeaderContent，用于判断是否显示 card-header
const hasHeaderContent = computed(() => {
  // 如果 props.title 有值，返回 true
  if (props.title) {
    return true
  }
  // 获取 subtitle 插槽的内容
  const subtitleSlot = slots.subtitle
  // 如果 subtitle 插槽存在且有内容，返回 true
  return subtitleSlot && subtitleSlot().length > 0
})
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  background: #fff;
  font-size: 28rpx;
  // line-height: 18rpx;
  overflow: auto;
}
.card-header {
  font-size: 28rpx;
  font-weight: bold;
  text-align: left;
  color: #333333;
  height: 90rpx;
  padding: 0 30rpx;
  display: flex;
  align-items: center;
  position: relative;
  .required {
    position: absolute;
    color: $u-error;
    left: 16rpx;
  }
}
:deep(.inviteWrite) {
  background-color: #e4f2fd;
  border-color: #e4f2fd;
  color: #138bec;
  padding: 13rpx 22rpx;
  border-radius: 6rpx;
  font-weight: normal;
  font-size: 24rpx;
  margin-left: 20rpx;
  line-height: 1;
  .invite {
    font-size: 24rpx;
  }
  .name {
    // padding-left: 10rpx;
    font-size: 26rpx;
  }
}
.initPadding {
  padding-top: 34rpx !important;
}
.card-body {
  padding: 0 30rpx;
}
.border {
  height: 20rpx;
}
.no-head {
  padding-top: 30rpx;
}
</style>
