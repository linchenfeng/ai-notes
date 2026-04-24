<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-09-19 11:37:16
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-09-28 16:27:58
 * @Description  : 媒体文件 照片、录音、视频预览组件
-->
<template>
  <view>
    <!-- 音频预览 -->
    <AudioPreview
      v-if="mediaInfo.fileType === '3' && dialogVisible"
      :resource-uuid="mediaInfo.resourceUuid"
      @close-dialog="colseFilePreview"
    ></AudioPreview>
    <!-- 视频预览 -->
    <VideoPreview
      v-if="mediaInfo.fileType === '2' && dialogVisible"
      :resource-uuid="mediaInfo.resourceUuid"
      @close-dialog="colseFilePreview"
    ></VideoPreview>
  </view>
</template>

<script setup lang="ts">
import apiCenterFiles from '@/api/fileCenter/api.files'
import { MediaInfo } from '@/interfaces/common/media'
import AudioPreview from './components/AudioPreview.vue'
import VideoPreview from './components/VideoPreview.vue'
const emit = defineEmits(['close-dialog'])
let dialogVisible = ref(false)
const props = defineProps({
  // 单个文件
  mediaInfo: {
    type: Object as () => MediaInfo,
    default: () => {
      return { resourceUuid: '' }
    }
  }
})
const colseFilePreview = (): void => {
  emit('close-dialog')
}
const showViewr = (file?) => {
  const imgSrc = apiCenterFiles.filecenterPreview(file.resourceUuid, '02')
  uni.previewImage({
    current: 0,
    urls: [imgSrc],
    complete: function () {
      colseFilePreview()
    }
  })
}
onMounted(() => {
  if (props.mediaInfo && props.mediaInfo.resourceUuid) {
    if (props.mediaInfo.fileType === '1') {
      showViewr(props.mediaInfo)
    } else {
      dialogVisible.value = true
    }
  }
})
</script>

<style lang="scss" scoped></style>
