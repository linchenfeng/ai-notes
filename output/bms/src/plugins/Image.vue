<!--
 * @Author       : may.ruan
 * @Date         : 2023-04-19 15:06:15
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-10-29 11:20:02
 * @Description  : image/支持图片/PDF/Excel
-->
<template>
  <view class="image-plugin-section">
    <view v-for="item in fileList" :key="item.resourceUuid" class="image-box">
      <text v-if="props.imageType === 'small'" class="iconfont-bms-colorful" :class="item.icon" @click="clickImage(item)"></text>
      <!-- <view class="mask preview">
        <view class="flex">
          <text v-if="item.isImage" class="iconfont icon-sousuo" @click="clickImage(item)"></text>
          <text v-else class="iconfont icon-xiazai" @click="clickImage(item)"></text>
        </view>
      </view> -->
      <view v-else class="vue-background-images" :style="{ backgroundImage: 'url(' + item.src + ')' }" @click="clickImage(item)"></view>
    </view>
    <view v-if="!fileList || !fileList.length" :style="{ width: width, height: height }"></view>
    <!-- 预览 -->
    <filePreview
      v-if="dialogVisible"
      :show-download="props.showDownload"
      :src="props.src"
      :resource-uuid="previewImageUuid"
      @close-dialog="dialogVisible = false"
    ></filePreview>
  </view>
</template>
<script lang="ts" setup>
import apiFile from '@/api/common/api.file'
import filePreview from '@/plugins/filePreview/index.vue'
import { PREVIEW_RESOURCE_UUID } from '@/config/file'
const props = defineProps({
  // 静态资源路径
  src: {
    type: String,
    default: ''
  },
  // 图片fileUuid，1:N
  fileUuid: {
    default: '',
    type: String
  },
  // 图片resourceUuid，1:1
  resourceUuid: {
    default: '',
    type: String
  },
  // 是否可预览（默认给预览功能）
  preview: {
    default: true,
    type: Boolean
  },
  // 图片类型，【small=展示ICON，big=展示大图】
  imageType: {
    default: 'small',
    type: String
  },
  // 是否多文件显示（因fileUuid是1对多关系）
  multiple: {
    default: false,
    type: Boolean
  },
  width: {
    default: '',
    type: String
  },
  height: {
    default: '',
    type: String
  },
  // 是否展示下载按钮
  showDownload: {
    type: Boolean,
    default: false,
    required: false
  }
})

type File = {
  icon?: string // 文件类型icon
  fileName: string // 文件名称
  src?: string // 静态文件路径
  resourceUuid?: string // 文件resourceUuid
  isImage?: boolean // 是否为可预览图片
}
const fileList = ref([] as File[])
const previewImageUuid = ref('') // 图片预览图resourceUuid
const dialogVisible = ref(false) // 是否显示预览弹框
/**
 * @Author: may.ruan
 * @Date: 2024-02-29 10:12:17
 * @param {*} files 文件列表
 * @description: 根据文件类型，显示不同的默认图
 */
const showViewer = (files: File[]) => {
  fileList.value = []
  if (files && files.length) {
    files.forEach(element => {
      const fileName = element.fileName?.toLocaleLowerCase()
      let suffixName = fileName.substring(fileName.lastIndexOf('.')) // 取后缀
      element.isImage = false
      switch (suffixName) {
        case '.jpeg':
        case '.jpg':
          element.icon = 'bms-color-JPG'
          element.src = PREVIEW_RESOURCE_UUID + element?.resourceUuid
          break
        case '.png':
          element.icon = 'bms-color-PNG'
          element.src = PREVIEW_RESOURCE_UUID + element?.resourceUuid
          break
        case '.gif':
          element.icon = 'bms-color-GIF'
          element.src = PREVIEW_RESOURCE_UUID + element?.resourceUuid
          break
        case '.pdf':
          element.icon = 'bms-color-PDF1'
          element.src = PREVIEW_RESOURCE_UUID + element?.resourceUuid
          break
        case '.xls':
        case '.xlsx':
          element.icon = 'bms-color-ECEL'
          break
        case '.doc':
        case '.docx':
          element.icon = 'bms-color-WORD'
          break
        case '.ppt':
          element.icon = 'bms-color-PPT'
          break
        case '.zip':
          element.icon = 'bms-color-ZIP'
          break
        case '.rar':
          element.icon = 'bms-color-RAR'
          break
        default:
          element.icon = 'bms-color-tupianziliao'
      }
      if (['.jpeg', '.jpg', '.png', '.gif', '.pdf'].includes(suffixName)) {
        element.isImage = true
      }
      fileList.value.push(element)
    })
  }
}
/**
 * @Author: may.ruan
 * @Date: 2024-02-29 10:11:46
 * @description: 通过fileUuid获取附件列表信息
 */
const getApxInfoByUuid = () => {
  apiFile.getApxInfoByUuid(props.fileUuid).then(res => {
    if (res.data.apxList && res.data.apxList.length) {
      if (props.multiple) {
        showViewer(res.data.apxList)
      } else {
        showViewer([res.data.apxList[0]])
      }
    }
  })
}
/**
 * @Author: may.ruan
 * @Date: 2024-02-29 10:14:54
 * @description: 通过resourceUuid获取附件信息
 */
const getApxInfoByResourceUuid = () => {
  apiFile.getApxInfoByResourceUuid(props.resourceUuid).then(res => {
    showViewer([res.data])
  })
}
watch(
  () => props.fileUuid,
  newValue => {
    if (newValue) {
      getApxInfoByUuid()
    }
  }
)
watch(
  () => props.resourceUuid,
  newValue => {
    if (newValue) {
      getApxInfoByResourceUuid()
    }
  }
)
if (props.src) {
  showViewer([{ src: props.src, fileName: '.png' }])
} else if (props.fileUuid) {
  getApxInfoByUuid()
} else if (props.resourceUuid) {
  getApxInfoByResourceUuid()
}

/**
 * @Author: may.ruan
 * @Date: 2023-04-23 10:49:51
 * @param {*} resourceUuid 图片resourceUuid
 * @description: 非图片下载
 */
const handleDownload = (resourceUuid?: string) => {
  if (resourceUuid) {
    apiFile.getFileByResourceUuid(resourceUuid)
  }
}

/**
 * @Author: may.ruan
 * @Date: 2023-04-23 10:05:27
 * @param {*} resourceUuid 图片resourceUuid
 * @description:图片预览
 */
const handlePreview = (resourceUuid?: string) => {
  if (resourceUuid) {
    previewImageUuid.value = resourceUuid
  }
  dialogVisible.value = true
}
/**
 * @Author: may.ruan
 * @Date: 2024-02-29 10:34:01
 * @param {*} file
 * @description: 点击文件，根据是否为图片，调用预览或下载方法
 */
const clickImage = (file: File) => {
  if (file.isImage) {
    handlePreview(file.resourceUuid)
  } else {
    handleDownload(file.resourceUuid)
  }
}
// 在组件卸载前关闭预览
onBeforeUnmount(() => {
  uni.closePreviewImage()
})
</script>
<style lang="scss" scoped>
.vue-background-images {
  background-position: center;
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
  background-size: cover;
}
.image-plugin-section {
  width: 100%;
  height: 100%;
  position: relative;
  .image-box {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .iconfont-bms-colorful {
      font-size: 68rpx;
    }
    /* #ifdef H5 */
    // &:hover {
    //   .preview {
    //     display: block;
    //   }
    // }
    // .preview {
    //   display: none;
    //   .flex {
    //     position: absolute;
    //     left: 0;
    //     top: 0;
    //     width: 100%;
    //     height: 100%;
    //     border-radius: 10rpx;
    //     background: rgba(0, 0, 0, 0.58);
    //     z-index: 10;
    //     display: flex;
    //     justify-content: center;
    //     align-items: center;
    //   }

    //   .iconfont {
    //     color: #fff;
    //     font-size: 28rpx;
    //   }
    // }
    /* #endif */
  }
}
</style>
