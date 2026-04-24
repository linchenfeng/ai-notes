<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-09-19 13:53:24
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-10-24 17:02:22
 * @Description  : 音频预览
-->
<template>
  <up-popup :show="showPopup" mode="center" @close="closePopup">
    <view class="audioClass"></view>
  </up-popup>
</template>

<script setup lang="ts">
import apiCenterFiles from '@/api/fileCenter/api.files'
const showPopup = ref(true)
const emit = defineEmits(['close-dialog'])
const props = defineProps({
  // 文件唯一标识
  resourceUuid: {
    type: String,
    default: ''
  }
})

const previewAudio = () => {
  const audio = document.createElement('audio')
  audio.controls = true
  audio.style.margin = '0 auto'
  audio.style.width = '350px'
  const audioElement = document.querySelector('.audioClass')
  if (audioElement) {
    audioElement.appendChild(audio)
  }
  audio.src = apiCenterFiles.filecenterPreview(props.resourceUuid, '01')
}

// 关闭预览
const closePopup = () => {
  emit('close-dialog')
}
onMounted(() => {
  previewAudio()
})
</script>

<style lang="scss" scoped>
.audioClass {
  height: 300rpx;
  width: 100vw;
  display: flex;
  align-items: center;
  padding: 20rpx;
  box-sizing: border-box;
}
:deep(.u-transition) {
  background-color: rgba(0, 0, 0, 0.6) !important;
}
</style>
