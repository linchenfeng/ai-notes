<!--
 * @Author       : may.ruan
 * @Date         : 2022-12-07 14:57:40
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2024-12-18 18:02:42
 * @Description  : PDF在线预览公共组件
-->
<template>
  <iframe v-if="showPdf" id="previewPdf" :src="baseUrl" height="100%" width="100%"></iframe>
</template>
<script lang="ts">
export default {
  name: 'Pdf'
}
</script>

<script lang="ts" setup>
import { getStorage } from '@/utils/storages'

import apiFile from '@/api/common/api.file'
import { PREVIEW_RESOURCE_UUID, DOWNLOAD_RESOURCE_UUID } from '@/config/file'
import { /** encode64 ,*/ encodeBase64 } from '@/utils/crypto'
import { getPlatform } from '@/utils/uniapp'
const emit = defineEmits(['close-dialog'])
const baseUrl = ref('/static/libary/pdf/web/viewer.html?file=')
const props = defineProps({
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
  }
})
// 通过fileUuid获取附件信息
const getApxInfoByUuid = (): void => {
  apiFile.getApxInfoByUuid(props.fileUuid).then(res => {
    if (res.data.apxList && res.data.apxList.length) {
      let item = res.data.apxList[0]
      showPdfDialog(item)
    }
  })
}
// 通过resourceUuid获取附件信息
const getApxInfoByResourceUuid = (): void => {
  apiFile.getApxInfoByResourceUuid(props.resourceUuid).then(res => {
    showPdfDialog(res.data)
  })
}
if (props.fileUuid) {
  getApxInfoByUuid()
} else if (props.resourceUuid) {
  getApxInfoByResourceUuid()
}

const showPdf = ref(false)
const showPdfDialog = (item): void => {
  const params = `?name=${encodeBase64(item.fileName)}&t=${new Date().getTime()}`
  // H5
  if (getPlatform() === 'H5') {
    const url = `${PREVIEW_RESOURCE_UUID}${item.resourceUuid}` + params
    baseUrl.value = baseUrl.value + encodeURIComponent(url)
    showPdf.value = true
  } else {
    uni.downloadFile({
      url: `${DOWNLOAD_RESOURCE_UUID}${encodeBase64(item.resourceUuid)}` + params,
      success: function (res) {
        uni.openDocument({
          filePath: res.tempFilePath,
          showMenu: true
        })
      },
      complete: function () {
        emit('close-dialog')
      }
    })
  }
}
</script>
