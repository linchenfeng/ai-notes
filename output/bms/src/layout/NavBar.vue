<!--
 * @Author       : may.ruan
 * @Date         : 2022-10-08 15:27:11
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-02-14 13:52:08
 * @Description  : 导航栏
-->
<template>
  <!-- <view class="status-bar-height"></view> -->
  <view class="vteam-navbar">
    <u-navbar :bg-color="props.bgColor" placeholder>
      <template #left>
        <view class="u-nav-slot">
          <u-icon v-if="route.meta && route.meta.showNavBarLeftArrow" name="arrow-left" color="#fff" size="36" @click="goBack"></u-icon>
        </view>
      </template>
      <template #center>
        <text class="nav-bar-title">{{ route.meta.title }}</text>
      </template>
      <template #right>
        <u-icon v-if="props.showIcon" name="share-square" color="#ffffff" size="18" @click="onClickRight"></u-icon>
        <button v-if="props.showShare" class="shareButton" open-type="share" @click="onClickRight">
          <!-- <u-icon name="share-square" color="#ffffff" size="18"></u-icon> -->
          邀请好友填写
        </button>
        <slot></slot>
      </template>
    </u-navbar>
  </view>
</template>
<script lang="ts">
export default {
  name: 'NavBar',
  options: {
    styleIsolation: 'shared' // 解除样式隔离
  }
}
</script>
<script lang="ts" setup>
import { useRoute /* useRouter */ } from '@/uni-simple-router'
import { getPlatform } from '@/utils/uniapp'
const route = useRoute()
// const router = useRouter()
/**
 * @Author: may.ruan
 * @Date: 2023-08-15 15:41:05
 * @description: 返回上一页
 */
const goBack = () => {
  if (props.customPath) {
    uni.redirectTo({ url: props.customPath })
  } else if (getPlatform() === 'H5') {
    history.back()
  } else {
    uni.navigateBack()
  }
}
const props = defineProps({
  // 展示分享icon，仅走平台逻辑
  showIcon: {
    type: Boolean,
    default: false
  },
  // 展示分享按钮，拉起微信好友
  showShare: {
    type: Boolean,
    default: false
  },
  // 背景颜色
  bgColor: {
    type: String,
    default: '#395fee'
  },
  // 点击返回跳入自定义路径
  customPath: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['onClickRight'])
const onClickRight = () => {
  emit('onClickRight')
}
</script>
<style lang="scss" scoped>
.vteam-navbar {
  :deep(.u-navbar) {
    .u-navbar__placeholder {
      height: 44px !important;
      background-color: #0022bb;
    }
    .u-status-bar {
      display: none;
    }
    .nav-bar-title {
      color: #fff;
    }
    .u-navbar__content__right .u-icon__icon {
      font-size: 36rpx !important;
    }
    .shareButton {
      background: none;
      color: #fff;
      font-size: 24rpx;
      padding-right: 0;
      &:after {
        border: none;
      }
    }
  }
}
</style>
