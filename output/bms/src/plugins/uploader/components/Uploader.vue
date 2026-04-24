<!--
 * @Author       : LongCan.Yang
 * @Date         : 2023-11-22 11:10:42
 * @LastEditors  : aolin.qu
 * @LastEditTime : 2026-03-12 14:19:25
 * @Description  : 上传公共组件
-->
<template>
  <view class="upload-file">
    <!-- 横铺展示上传的文件 -->
    <template v-if="imgList.length && props.previewImage">
      <view
        v-for="(item, index) in imgList"
        :key="item.resourceUuid"
        class="successImg"
        :style="{ width: `${upWidth}rpx`, height: `${upHeight}rpx`, marginRight: (index + 1) % 4 === 0 ? '0rpx' : '20rpx' }"
        :class="props.uploadType === 'big-upload' ? 'big-image' : ''"
      >
        <view v-if="props.editable && !props.disabled" class="icon-box">
          <text class="iconfont icon-guanbi" @click.stop="deletePic(index)"></text>
        </view>

        <ImageVue
          v-if="item.resourceUuid"
          :resource-uuid="item.resourceUuid"
          :image-type="props.uploadType === 'big-upload' ? 'big' : 'small'"
          :show-download="props.showDownload"
        ></ImageVue>
      </view>
    </template>
    <!-- 上传框展示条件：1、类型为图片墙、2、类型为大上传框且未上传文件、3 、不预览图片 -->
    <u-upload
      v-if="
        ((props.uploadType === 'picture-card' && imgList.length < props.maxCount) ||
          (props.uploadType === 'big-upload' && !imgList.length) ||
          !props.previewImage) &&
        props.editable
      "
      :file-list="fileList"
      name="1"
      :multiple="props.multiple"
      :max-count="Infinity"
      :disabled="props.disabled || imgList.length >= props.maxCount"
      :deletable="props.editable"
      :accept="props.accept"
      :preview-image="false"
      :preview-full-image="true"
      :class="props.uploadType === 'picture-card' ? 'picture-card' : 'big-upload'"
      :style="{ '--width': `${upWidth}rpx`, '--height': `${upHeight}rpx` }"
      @after-read="afterRead"
      @click="checkCount"
    >
      <view v-if="props.uploadType === 'picture-card'" class="upload-file-add">
        <text class="iconfont icon-tianjia1"></text>
      </view>
      <view v-else class="view-upload" :style="props.bgImgSrc ? { backgroundImage: `url(${props.bgImgSrc})` } : {}">
        <image class="image-upload" src="@/assets/member/image_add.png" alt="上传附件" />
        <view v-if="props.uploadTips" class="title-upload">{{ props.uploadTips }}</view>
      </view>
    </u-upload>
    <view v-if="remarkText" class="remark-text">{{ remarkText }}</view>
  </view>
</template>
<script lang="ts">
export default {
  options: {
    styleIsolation: 'shared' // 解除样式隔离
  }
}
</script>
<script setup lang="ts">
import { API_FILE_URL, PREVIEW_RESOURCE_UUID } from '@/config/file'
import serverConfig from '@/config/serverConfig'
import ImageVue from '@/plugins/Image.vue'
// import { getStorage } from '@/utils/storages'
import { showToast, webLoading } from '@/utils/uniapp/toast'
import { md5, encode64, decrypt } from '@/utils/crypto'
import { reLaunch } from '@/utils/uniapp'
import { CFile, FileItem, ResUuidVo } from '@/interfaces/common/file'
import apiFile from '@/api/common/api.file'
import pdfFile from '@/assets/file/pdf.png'
import otherFile from '@/assets/file/other.png'
import { getPlatform } from '@/utils/uniapp'
let fileList: Array<CFile> = reactive([])
let imgList: Array<CFile> = reactive([])
let miniLoading: any = {}

const props = defineProps({
  /**
   * 上传附带参数
   */
  uploadData: {
    type: Object,
    default: () => {
      return {}
    },
    required: false
  },
  // 上传框类型【picture-card=照片墙/big-upload=大上传框】
  uploadType: {
    type: String,
    default: 'picture-card',
    required: false
  },
  // 上传框宽
  width: {
    type: Number,
    default: 0,
    required: false
  },
  // 上传框高
  height: {
    type: Number,
    default: 0,
    required: false
  },
  // 大上传框背景图片路径
  bgImgSrc: {
    type: String,
    default: '/static/img/businessLicenseBg.png',
    required: false
  },
  /**
   * 限制上传文件具体类型 png,jpg,xls,zip等，逗号分隔
   */
  accept: {
    type: String,
    default: '.png,.jpg,jpeg',
    required: false
  },
  /**
   * 上传地址
   */
  actions: {
    type: String,
    default: API_FILE_URL,
    required: false
  },
  /**
   * 字段名称，用于一个页面多个上传框，删除的标识
   */
  fileKey: {
    type: String,
    required: false,
    default: ''
  },
  /**
   * 是否禁用文件上传
   */
  disabled: {
    type: Boolean,
    default: false,
    required: false
  },
  /**
   * 是否可编辑
   */
  editable: {
    type: Boolean,
    default: true,
    required: false
  },
  /**
   * 文件大小限制，单位为MB
   */
  maxSize: {
    type: Number,
    default: 10,
    required: false
  },
  /**
   * 是否开启图片多选
   */
  multiple: {
    type: Boolean,
    default: false,
    required: false
  },
  /**
   * 文件上传数量限制
   */
  maxCount: {
    type: Number,
    default: 1,
    required: false
  },
  /**
   * 是否在上传完成后展示预览图
   */
  previewImage: {
    type: Boolean,
    default: true,
    required: false
  },
  /**
   * 上传附件的resourceUuid
   */
  resourceUuid: {
    type: String,
    default: '',
    required: false
  },
  /**
   * 上传附件的fileUuid
   */
  fileUuid: {
    type: String,
    default: '',
    required: false
  },
  /**
   * 备注文案（上传框外备注）
   */
  remarkText: {
    type: String,
    default: '',
    required: false
  },
  /**
   * 备注文案（上传框内备注）
   */
  uploadTips: {
    type: String,
    default: '',
    required: false
  },
  // 是否展示预览下载按钮
  showDownload: {
    type: Boolean,
    default: false,
    required: false
  },
  // ResourceUuid集合，回显多文件
  resUuidVo: {
    type: Object as () => ResUuidVo,
    default: () => {
      return { key: '', fileList: [] }
    },
    required: false
  }
})
// 上传框宽度
const upWidth = computed(() => {
  let width = 140 // 小框默认宽度
  if (props.uploadType === 'big-upload') {
    width = 260 // 大框默认宽度
  }
  if (props.width) {
    width = props.width
  }
  return width
})
// 上传框宽度
const upHeight = computed(() => {
  let height = 140 // 小框默认高度
  if (props.uploadType === 'big-upload') {
    height = 190 // 大框默认高度
  }
  if (props.height) {
    height = props.height
  }
  return height
})
const emit = defineEmits(['uploadSuccess', 'uploadRemove'])
/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-23 17:28:31
 * @param {*} file
 * @return {*}
 * @description: 初始化文件列表
 */
const initFileList = file => {
  for (let i = 0; i < imgList.length; i++) {
    if (imgList[i].resourceUuid === file.resourceUuid) {
      return
    }
  }
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
    fileKey: props.fileKey,
    fileSource: ''
  }
  fileList.push(fileItem)
  imgList.push(fileItem)
}

const getApxInfoByUuid = fileUuid => {
  apiFile.getApxInfoByUuid(fileUuid).then(res => {
    if (res.data.apxList && res.data.apxList.length) {
      let item = res.data.apxList[0]
      initFileList(item)
    }
  })
}

/**
 * @Author: FangFang.Wu
 * @Date: 2023-01-11 10:37:41
 * @param {*} void
 * @return {*}
 * @description: 通过resourceUuid获取附件信息
 */
const getApxInfoByResourceUuid = resourceUuid => {
  apiFile.getApxInfoByResourceUuid(resourceUuid).then(res => {
    initFileList(res.data)
  })
}
// 删除文件
const deletePic = index => {
  // 调用uploadRemove 返回值：删除后的文件数组，fileKey，被删除的文件对象
  emit('uploadRemove', imgList, props.fileKey, imgList[index])
  fileList.splice(index, 1)
  imgList.splice(index, 1)
}
const checkCount = () => {
  if (imgList.length >= props.maxCount) {
    showToast(`最多支持上传${props.maxCount}份文件`)
  }
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-18 09:56:48
 * @param {*} file
 * @description:上传文件
 */
const uploadFilePromise = file => {
  return new Promise((resolve, reject) => {
    if (getPlatform() === 'H5') {
      miniLoading.loading()
    }
    uni.uploadFile({
      url: `${serverConfig.API_BASE_URL}${props.actions}?t=${new Date().getTime()}`,
      filePath: file.url,
      name: 'file',
      file: file,
      // header: {
      //   'Content-Type': 'multipart/form-data'
      // },
      formData: Object.assign({}, { hash: md5(md5(encode64(file.name))), size: file.size }, props.uploadData),
      success: response => {
        if (getPlatform() === 'H5') {
          miniLoading.close()
        }
        const resData = JSON.parse(response.data)
        try {
          // 判断是否开启开密
          if (serverConfig.ENCRYPT === true) {
            if (resData.data) {
              resData.data = JSON.parse(decrypt(resData.data))
            }
          } else {
            resData.data = JSON.parse(resData.data)
          }
        } catch (error) {
          reject(error)
        }
        switch (resData.code) {
          case 1:
          case 100:
          case 200:
            let fileUrl = ''
            if (file.type === 'application/pdf') {
              fileUrl = pdfFile
            } else if (file.type.startsWith('image/')) {
              fileUrl = PREVIEW_RESOURCE_UUID + resData.data.resourceUuid
            } else {
              fileUrl = otherFile
            }
            let fileType = file.name.split('.')
            const successData = {
              url: fileUrl === otherFile ? otherFile : `${fileUrl}${`?resourceUuid=${resData.data.resourceUuid}`}`,
              fileName: file.name,
              fileType: fileType[fileType.length - 1],
              fileUuid: resData.data.uuid,
              uuid: resData.data.uuid,
              resourceUuid: resData.data.resourceUuid,
              refcode: resData.data.refcode,
              fileKey: props.fileKey,
              status: 'success',
              message: ''
            }
            imgList.push(successData)
            fileList.push(successData)
            emit('uploadSuccess', successData) // 上传成功回调
            resolve(successData)
            break
          // 没有权限
          case 401:
            reLaunch('/login')
            break
          // Authorization认证失败、认证过期
          case 400:
          case 402:
          case 403:
            const msg = '您很久未操作已自动退出，请重新登录'
            showToast(msg)
            break
          case 500:
          default:
            if (resData && resData.msg) {
              showToast(resData.msg)
            } else {
              const msg1 = '网络不稳定,请稍候再试'
              showToast(msg1)
            }
        }
      },
      fail: error => {
        if (getPlatform() === 'H5') {
          miniLoading.close()
        }
        reject(error)
      }
    })
  })
}
// 读取后的处理函数
const afterRead = async event => {
  let file: FileItem = {
    name: '',
    size: 0,
    type: '',
    url: ''
  }
  let temFileList: FileItem[] = []
  if (props.multiple) {
    // 支持多选上传
    temFileList = event.file
  } else {
    temFileList = [event.file]
  }
  // 检查文件类型
  const isAcceptedFileType = (fileName: string) => {
    const fileType = fileName.split('.').pop()?.toLowerCase() || ''
    return props.accept.split(',').some(item => item.toLowerCase().includes(fileType))
  }
  for (let i = 0; i < temFileList.length; i++) {
    file = temFileList[i]
    if (props.accept && !isAcceptedFileType(file.name)) {
      showToast('不支持此文件类型')
      return false
    }
    // 检查文件大小
    if (props.maxSize && typeof props.maxSize === 'number') {
      let maxSize = file.size / 1024 / 1024 < props.maxSize
      if (!maxSize) {
        const msg = `文件大小不能超过${props.maxSize}MB`
        showToast(msg)
        return false
      }
    }
  }

  for (let i = 0; i < temFileList.length; i++) {
    uploadFilePromise(temFileList[i])
  }
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-02-20 19:14:58
 * @param {*} resUuidVo  { key: '', fileList: [] }
 * @description: 外部调用展示file列表
 */
const showFileList = (resUuidVo: ResUuidVo) => {
  if (resUuidVo.fileList) {
    resUuidVo.fileList.forEach(item => {
      getApxInfoByResourceUuid(resUuidVo.key ? item[resUuidVo.key] : item['resourceUuid'])
    })
  }
}
onMounted(async () => {
  if (getPlatform() === 'H5') {
    miniLoading = await webLoading()
  }
  if (props.fileUuid) {
    getApxInfoByUuid(props.fileUuid)
  } else if (props.resourceUuid) {
    getApxInfoByResourceUuid(props.resourceUuid)
  }
  if (props.resUuidVo && props.resUuidVo.fileList && props.resUuidVo.fileList.length) {
    showFileList(props.resUuidVo)
  }
})
/**
 * @Author: FangFang.Wu
 * @Date: 2023-01-11 10:36:34
 * @return {*}
 * @description: props.fileUuid监听器，获取到值后只调用一次
 */
const unFileUuidWatch = watch(
  () => props.fileUuid,
  val => {
    if (val) {
      getApxInfoByUuid(val)
      unFileUuidWatch()
    }
  }
)
/**
 * @Author: FangFang.Wu
 * @Date: 2023-01-11 10:37:07
 * @return {*}
 * @description: props.resourceUuid监听器，获取到值后只调用一次
 */
const unResourceUuidWatch = watch(
  () => props.resourceUuid,
  val => {
    if (val) {
      getApxInfoByResourceUuid(val)
      unResourceUuidWatch()
    }
  }
)
/**
 * @Author: FangFang.Wu
 * @Date: 2023-01-11 10:37:07
 * @return {*}
 * @description: props.resUuidVo监听器，获取到值后只调用一次
 */
const unresUuidVoWatch = watch(
  () => props.resUuidVo,
  val => {
    if (val && val.fileList && val.fileList.length) {
      showFileList(val)
      unresUuidVoWatch()
    }
  },
  {
    deep: true
  }
)
defineExpose({ afterRead, uploadFilePromise, showFileList })
</script>
<style lang="scss" scoped>
.upload-file {
  display: flex;
  flex-wrap: wrap;
  .remark-text {
    width: 100%;
    color: #999;
    font-size: 24rpx;
  }
  .successImg {
    border: 2rpx dashed #d8d8d8;
    box-sizing: border-box;
    position: relative;
    margin-right: 20rpx;
    margin-bottom: 20rpx;
    border-radius: 10rpx;
    .icon-box {
      position: absolute;
      right: -10rpx;
      top: -12rpx;
      display: inline-block;
      background-color: #fff;
      line-height: 26rpx;
      z-index: 9;
    }
    .icon-guanbi {
      font-size: 26rpx;
    }
    &.big-image {
      // 大上传框展示样式
      border: 2rpx dashed $primary;
      border-radius: 20rpx;
      padding: 2rpx;
      :deep(.image-plugin-section) {
        border-radius: 20rpx;
        overflow: hidden;
      }
    }
  }
  :deep(.u-upload) {
    &.picture-card {
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
    }
    &.big-upload {
      margin-bottom: 20rpx;
      .u-upload__wrap .u-upload__wrap__preview .u-upload__wrap__preview__other {
        width: 262rpx;
        height: 192rpx;
      }
      .view-upload {
        // background: url('.\businessLicenseBg.png');
        // background: #e4eefd;
        background-repeat: no-repeat;
        background-size: cover;
        border: 2rpx dashed $primary;
        border-radius: 20rpx;
        padding: 20rpx 30rpx;
        width: 200rpx;
        height: 150rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        .image-upload {
          margin-bottom: 20rpx;
          width: 62rpx;
          height: 62rpx;
        }
        image {
          width: 62rpx;
          height: 62rpx;
        }
        .title-upload {
          font-size: 22rpx;
          color: $default-color;
        }
      }
    }
  }
}
</style>
