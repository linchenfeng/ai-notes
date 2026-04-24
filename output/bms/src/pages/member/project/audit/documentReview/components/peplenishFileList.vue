<!--
 * @Author       : aolin.qu
 * @Date         : 2025-12-25 16:47:01
 * @LastEditors  : aolin.qu
 * @LastEditTime : 2025-12-26 14:52:17
 * @Description  : 补充资料预览组件
-->
<template>
  <view v-if="peplenishFileList.length" class="peplenishFileList">
    <view v-for="(item, index) in peplenishFileList" :key="item.resourceUuid" class="peplenishFile-box" :class="{ mgr: (index + 1) % 2 !== 0 }">
      <view class="peplenishFile-image" :style="{ width: `130rpx`, height: `130rpx`, marginRight: '15rpx' }">
        <ImageVue v-if="item.resourceUuid" :resource-uuid="item.resourceUuid" image-type="small"></ImageVue>
      </view>
      <view class="peplenishFile-title">
        <text class="file-type">{{ item.type }}</text>
        <text class="file-name">{{ item.fileName }}</text>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { PeplenishFileList } from '@/interfaces/member/project/audit/documentReview'
import { PropType } from 'vue'
import ImageVue from '@/plugins/Image.vue'
import apiFile from '@/api/common/api.file'
import { PREVIEW_RESOURCE_UUID } from '@/config/file'
import { CFile } from '@/interfaces/common/file'
import pdfFile from '@/assets/file/pdf.png'
import otherFile from '@/assets/file/other.png'

const peplenishFileList = ref<CFile[]>([])
const props = defineProps({
  docFileUuidList: {
    type: Array as PropType<Array<PeplenishFileList>>,
    default: () => {
      return []
    },
    required: false
  },
  fileList: {
    type: Array as PropType<Array<PeplenishFileList>>,
    default: () => {
      return []
    },
    required: false
  }
})

// 初始化文件信息
const initFileList = (file, type) => {
  let fileUrl = PREVIEW_RESOURCE_UUID + file.resourceUuid
  if (file.fileType === 'pdf') {
    fileUrl = pdfFile
  } else if ('jpeg,jpg,png,gif'.split(',').includes(file.fileType.toLowerCase())) {
    fileUrl = PREVIEW_RESOURCE_UUID + file.resourceUuid
  } else {
    fileUrl = otherFile
  }
  const fileItem = {
    url: fileUrl === otherFile ? otherFile : `${fileUrl}${`?resourceUuid=${file.resourceUuid}`}`,
    fileType: file.fileType,
    fileName: file.fileName,
    fileUuid: file.fileUuid,
    uuid: file.fileUuid,
    resourceUuid: file.resourceUuid,
    refcode: file.refcode,
    fileKey: '',
    fileSource: '',
    type: type === 'doc' ? '核贷书' : '其他补充文件'
  }
  peplenishFileList.value.push(fileItem)
}

// 根据fileUuid获取附件信息
const getApxInfoByResourceUuid = (resourceUuid, type) => {
  return apiFile.getApxInfoByResourceUuid(resourceUuid).then(res => {
    initFileList(res.data, type)
  })
}

// 加载文件列表
const loadFileLists = async () => {
  // 加载核贷书文件
  if (props.docFileUuidList && props.docFileUuidList.length) {
    for (const item of props.docFileUuidList) {
      await getApxInfoByResourceUuid(item['fileUuid'], 'doc')
    }
  }

  // 加载其他补充文件
  if (props.fileList && props.fileList.length) {
    for (const item of props.fileList) {
      await getApxInfoByResourceUuid(item['fileUuid'], 'other')
    }
  }
}

onMounted(() => {
  loadFileLists()
})
</script>
<style lang="scss" scoped>
.peplenishFileList {
  display: flex;
  flex-wrap: wrap;
  .peplenishFile-box {
    display: flex;
    margin-bottom: 15rpx;
    .peplenishFile-image {
      border: 2rpx dashed #d8d8d8;
      box-sizing: border-box;
      position: relative;
      border-radius: 10rpx;
    }
    .peplenishFile-title {
      width: 190rpx;
      height: 130rpx;
      display: flex;
      flex-direction: column;
      gap: 10rpx;
    }
  }
  .mgr {
    margin-right: 15rpx;
  }
  .file-name {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
  }
  .file-type {
    font-size: 24rpx;
    color: #333;
    font-weight: bold;
  }
}
</style>
