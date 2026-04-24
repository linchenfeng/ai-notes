<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-09-19 13:53:06
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-10-24 17:02:27
 * @Description  : 视频预览
-->
<template>
  <up-popup :show="showPopup" mode="center" :round="10" @close="closePopup">
    <video :src="videoSrc" controls autoplay @waiting="onWaiting" @timeupdate="onTimeUpdate"></video>
    <view v-if="isLoading" class="loading-tip">缓冲中...</view>
  </up-popup>
</template>

<script setup lang="ts">
import apiCenterFiles from '@/api/fileCenter/api.files'
const emit = defineEmits(['close-dialog'])
const isLoading = ref(false)
const videoSrc = ref('')
const showPopup = ref(true)
const props = defineProps({
  // 文件唯一hash值
  resourceUuid: {
    type: String,
    default: ''
  }
})

// 关闭预览
const closePopup = () => {
  emit('close-dialog')
}
const onWaiting = () => {
  isLoading.value = true
}

const onTimeUpdate = () => {
  // 如果仍在显示加载但有时间更新，说明已经在播放
  if (isLoading.value) {
    isLoading.value = false
  }
}
onMounted(() => {
  // 播放转换格式后的视频
  videoSrc.value = apiCenterFiles.filecenterPreview(props.resourceUuid, '02')
})
</script>

<style lang="scss" scoped>
.loading-tip {
  position: absolute;
  color: #fff;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
:deep(.u-popup__content) {
  width: 100vw;
  uni-video {
    width: 100vw;
  }
  .uni-video-container {
    width: 100vw;
  }
}
:deep(.u-transition) {
  background-color: rgba(0, 0, 0, 0.6) !important;
}
</style>
