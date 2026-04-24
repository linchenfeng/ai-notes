<!--
 * @Author       : may.ruan
 * @Date         : 2022-12-06 15:04:31
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-12-11 13:54:08
 * @Description  : 文件预览组件
-->
<template>
  <u-overlay :show="showPdf && getPlatform() === 'H5'">
    <PdfVue v-if="showPdf && getPlatform() === 'H5'" :file-uuid="props.fileUuid" :resource-uuid="props.resourceUuid" />
    <div v-if="props.showDownload" class="download-icon" @click="downloadFile">
      <u-icon name="arrow-downward" bold="true" color="#4a4a4b" />
    </div>
    <div class="close-icon" @click="colseFilePreview">
      <u-icon name="close" color="#4a4a4b" bold="true" />
    </div>
  </u-overlay>
  <PdfVue v-if="showPdf && getPlatform() !== 'H5'" :file-uuid="props.fileUuid" :resource-uuid="props.resourceUuid" @close-dialog="colseFilePreview" />
</template>

<script lang="ts" setup>
import apiFile from '@/api/common/api.file'
import PdfVue from './Pdf.vue'
import { PREVIEW_RESOURCE_UUID } from '@/config/file'
import { getPlatform } from '@/utils/uniapp'
import { isEmpty } from '@/utils/validate'
const emit = defineEmits(['close-dialog'])
const showPdf = ref(false)
const colseFilePreview = (): void => {
  showPdf.value = false
  emit('close-dialog')
}

const props = defineProps({
  // 静态资源路径
  src: {
    type: String,
    default: '',
    required: false
  },
  // resourceUuid
  resourceUuid: {
    type: String,
    default: '',
    required: false
  },
  // fileUuid
  fileUuid: {
    type: String,
    default: '',
    required: false
  },
  // 是否展示下载按钮
  showDownload: {
    type: Boolean,
    default: false,
    required: false
  }
})
const downloadFile = () => {
  if (!isEmpty(props.fileUuid)) {
    apiFile.getFileByUuid(props.fileUuid)
  } else {
    apiFile.getFileByResourceUuid(props.resourceUuid)
  }
}
const showViewr = (file?) => {
  const imgSrc = file ? PREVIEW_RESOURCE_UUID + file.resourceUuid : props.src
  uni.previewImage({
    current: 0,
    urls: [imgSrc],
    complete: function () {
      colseFilePreview()
    }
  })
}
// 通过fileUuid获取附件信息
const getApxInfoByUuid = (): void => {
  apiFile.getApxInfoByUuid(props.fileUuid).then(
    res => {
      if (res.data && res.data.apxList && res.data.apxList.length) {
        let item = res.data.apxList[0]
        if (item.fileType.toLocaleLowerCase() === 'pdf') {
          showPdf.value = true
        } else {
          showViewr(item)
        }
      } else {
        colseFilePreview()
      }
    },
    () => {
      colseFilePreview()
    }
  )
}
// 通过resourceUuid获取附件信息
const getApxInfoByResourceUuid = (): void => {
  apiFile.getApxInfoByResourceUuid(props.resourceUuid).then(
    res => {
      if (res.data && res.data.fileType.toLocaleLowerCase() === 'pdf') {
        showPdf.value = true
      } else {
        showViewr(res.data)
      }
    },
    () => {
      colseFilePreview()
    }
  )
}
if (props.src) {
  showViewr()
} else if (props.resourceUuid) {
  getApxInfoByResourceUuid()
} else if (props.fileUuid) {
  getApxInfoByUuid()
}
</script>
<style lang="scss" scoped>
.download-icon {
  position: fixed;
  top: 3px;
  right: 42px;
  z-index: 999;
  background-color: #f9f9fa;
  height: 30px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  i {
    font-size: 32rpx;
  }
}
.close-icon {
  position: fixed;
  width: 30px;
  top: 3px;
  right: 6px;
  z-index: 999;
  background-color: #f9f9fa;
  height: 30px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  :deep(.u-icon) {
    font-size: 32rpx;
    font-weight: bold;
    :deep(u-icon__icon) {
      font-weight: bold;
    }
  }
}
</style>
