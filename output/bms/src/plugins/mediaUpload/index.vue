<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-09-18 17:13:04
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-09-28 17:09:08
 * @Description  : 拍照上传
-->
<template>
  <view>
    <view v-show="false">
      <!-- 不限大小不限类型 -->
      <Uploader
        ref="uploaderRef"
        accept=""
        max-size=""
        :max-count="null"
        :break-point="false"
        :preview-image="false"
        :editable="false"
        :file-center="true"
        @upload-success="uploadSuccess"
      ></Uploader>
    </view>
    <view :style="{ width: `${props.width}rpx`, height: `${props.height}rpx` }" class="upload-file-add" @click="getMediaFile">
      <text class="iconfont icon-tianjia1"></text>
    </view>
  </view>
  <Recorder v-if="props.uploadType === 'record' && dialogVisible" @close-dialog="closeDialog" @record-success="recordSuccess"></Recorder>
</template>

<script setup lang="ts">
import Uploader from '@/plugins/uploader/index.vue'
import { showToast } from '@/utils/uniapp/toast'
import Recorder from './Recorder.vue'
const uploaderRef = ref()
const emit = defineEmits(['uploadSuccess'])
const dialogVisible = ref(false)
let recordDuration = 0 // 录音时长

const props = defineProps({
  // 上传类型【photo=照片/record=录音/video=视频】
  uploadType: {
    type: String,
    default: 'photo'
  },
  /**
   * 是否在上传完成后展示预览图
   */
  preview: {
    type: Boolean,
    default: true,
    required: false
  },
  /**
   * 上传文件的唯一hash
   */
  hash: {
    type: String,
    default: '',
    required: false
  },
  width: {
    type: Number,
    default: 140
  },
  height: {
    type: Number,
    default: 140
  }
})
// 判断设备类型
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}
// 拍摄照片
const chooseImage = () => {
  if (isMobileDevice()) {
    uni.chooseImage({
      count: 1,
      sourceType: ['camera'],
      sizeType: ['compressed', 'original'],
      success: function (res) {
        uploaderRef.value.doUploader(res.tempFiles[0])
      }
    })
  } else {
    showToast('PC端不支持拍照')
  }
}
// 拍摄视频
const chooseVideo = () => {
  if (isMobileDevice()) {
    uni.chooseVideo({
      sourceType: ['camera'],
      compressed: false,
      success: function (res) {
        uploaderRef.value.doUploader(res.tempFile)
      }
    })
  } else {
    showToast('PC端不支持拍摄')
  }
}

const closeDialog = () => {
  dialogVisible.value = false
}
// 录音成功回调
const recordSuccess = (file, duration) => {
  closeDialog()
  recordDuration = duration
  uploaderRef.value.doUploader(file)
}
// 获取媒体流上传
const getMediaFile = () => {
  if (props.uploadType === 'photo') {
    chooseImage()
  } else if (props.uploadType === 'video') {
    chooseVideo()
  } else if (props.uploadType === 'record') {
    dialogVisible.value = true
  }
}
// 上传完成
const uploadSuccess = data => {
  if (recordDuration) {
    data.fileDuration = recordDuration
  }
  emit('uploadSuccess', data)
}
</script>

<style lang="scss" scoped>
.upload-file-add {
  width: var(--width);
  height: var(--height);
  background: #fafafa;
  border: 2rpx dashed #d8d8d8;
  border-radius: 10rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  margin-bottom: 20rpx;
  .iconfont {
    font-size: 30rpx;
    justify-content: end;
  }
}
</style>
