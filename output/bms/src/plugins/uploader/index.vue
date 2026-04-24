<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-09-25 19:09:18
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-10-29 18:59:34
 * @Description  : 上传文件统一入口
-->
<template>
  <view>
    <!-- 上传至文件中心 -->
    <filecenter-uploader v-if="props.fileCenter" ref="fileCenterRef" v-bind="$attrs"></filecenter-uploader>
    <!-- 正常上传 -->
    <uploader v-else ref="uploaderRef" v-bind="$attrs"></uploader>
  </view>
</template>

<script setup lang="ts">
import FilecenterUploader from './components/FilecenterUploader.vue'
import Uploader from './components/Uploader.vue'
import { ResUuidVo } from '@/interfaces/common/file'
const fileCenterRef = ref()
const uploaderRef = ref()
const props = defineProps({
  /**
   * 是否直传文件中心
   */
  fileCenter: {
    type: Boolean,
    default: false,
    required: false
  }
})
/**
 * @Author: LongCan.Yang
 * @Date: 2024-02-20 19:14:58
 * @param {*} resUuidVo  { key: '', fileList: [] }
 * @description: 外部调用展示file列表
 */
const showFileList = (resUuidVo: ResUuidVo) => {
  if (props.fileCenter) {
    fileCenterRef.value.showFileList(resUuidVo)
  } else {
    uploaderRef.value.showFileList(resUuidVo)
  }
}
// 上传文件，H5端使用WebUploader，其他端使用uni.uploadFile
const doUploader = (file: any) => {
  if (props.fileCenter) {
    fileCenterRef.value.doUploader(file)
  } else {
    uploaderRef.value.doUploader(file)
  }
}
// 外部删除文件
const deletePic = index => {
  if (props.fileCenter) {
    fileCenterRef.value.deletePic(index)
  } else {
    uploaderRef.value.deletePic(index)
  }
}
defineExpose({ showFileList, doUploader, deletePic })
</script>

<style scoped></style>
