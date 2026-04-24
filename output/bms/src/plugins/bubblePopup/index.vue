<!--
 * @Author       : Charon.Lin
 * @Date         : 2025-01-09 10:02:53
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-08-04 11:02:11
 * @Description  : 气泡弹出组件
-->
<template>
  <view class="ty-bubble-popup">
    <transition name="fade">
      <view>
        <view class="search-modal" :style="{ width: props.width }">
          <view>
            <image class="triangle-clip" src="@/assets/member/project/pop.png"></image>
          </view>
          <view class="slot-content">
            <slot></slot>
          </view>
        </view>
      </view>
    </transition>
  </view>
</template>

<script setup lang="ts">
const props = defineProps({
  width: {
    type: String,
    default: '433rpx'
  }
})
</script>

<style lang="scss" scoped>
.search-modal {
  position: fixed;
  top: 44px;
  right: 15rpx;
  z-index: 9999;
  .triangle-clip {
    width: 30rpx;
    height: 30rpx;
    position: absolute;
    top: 0;
    right: 15rpx;
  }
  .slot-content {
    background: #4c4c4c;
    color: #fff;
    width: 100%;
    margin-top: 15rpx;
    border-radius: 10rpx;
  }
}
:deep(.search-list) {
  padding: 19rpx 30rpx 0 30rpx;
  .custom-checkbox-group {
    flex: 1;
    padding: 5rpx 0rpx 20rpx 0;
  }
}
:deep(.operate) {
  display: flex;
  justify-content: space-between;
  padding-bottom: 40rpx;
  margin-top: 20rpx;
  .cancel,
  .confirm {
    width: 170rpx;
    background: rgba(255, 255, 255, 0.25);
    height: 54rpx;
    line-height: 54rpx;
    text-align: center;
    border-radius: 10rpx;
  }
}
:deep(.divide-line) {
  height: 1px;
  background: #ffffff;
  opacity: 0.3;
  margin-left: 50rpx;
  margin-bottom: 20rpx;
}
:deep(.item) {
  height: 72rpx;
  line-height: 72rpx;
  text-align: left;
  display: flex;
  .item-icon {
    margin-left: 31rpx;
    margin-right: 19rpx;
    width: 30rpx;
    .iconfont {
      font-size: 30rpx;
    }
  }
  .item-name {
    font-size: 32rpx;
    flex: 1;
    display: flex;
    justify-content: space-between;
  }
}
/* 定义淡入的过渡样式 */
.fade-enter-active {
  transition: opacity 0.5s;
}
.fade-enter {
  opacity: 0;
}
</style>
