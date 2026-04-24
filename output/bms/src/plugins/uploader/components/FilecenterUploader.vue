<!--
 * @Author       : LongCan.Yang
 * @Date         : 2023-11-22 11:10:42
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-11-11 17:09:57
 * @Description  : 上传文件中心
-->
<template>
  <view class="upload-file">
    <!-- 拍照、录像、录音 -->
    <view
      v-if="['photo', 'record', 'video'].includes(props.uploadType)"
      :style="{ width: `${props.width}rpx`, height: `${props.height}rpx` }"
      class="media-upload-file-add"
      @click="getMediaFile"
    >
      <text class="iconfont" :class="iconfontVo[props.uploadType]"></text>
    </view>

    <!-- 上传框展示条件：1、类型为图片墙、2、类型为大上传框且未上传文件、3 、不预览图片 -->
    <!-- <u-upload
      v-else-if="
        (props.uploadType === 'picture-card' || (props.uploadType === 'big-upload' && !imgList.length) || !props.previewImage) && props.editable
      "
      :file-list="fileList"
      name="1"
      :multiple="props.multiple"
      :max-count="Infinity"
      :disabled="props.disabled || imgList.length >= Number(props.maxCount)"
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
    </u-upload> -->
    <view
      v-else-if="
        (props.uploadType === 'picture-card' || (props.uploadType === 'big-upload' && !imgList.length) || !props.previewImage) && props.editable
      "
      :class="props.uploadType === 'picture-card' ? 'picture-card' : 'big-upload'"
      :style="{ '--width': `${upWidth}rpx`, '--height': `${upHeight}rpx` } as any"
      class="web-uploader-trigger"
      @click="triggerWebUploader"
    >
      <view v-if="props.uploadType === 'picture-card'" class="upload-file-add">
        <text class="iconfont icon-tianjia1"></text>
      </view>
      <view v-else class="view-upload" :style="props.bgImgSrc ? { backgroundImage: `url(${props.bgImgSrc})` } : {}">
        <image class="image-upload" src="@/assets/member/image_add.png" alt="上传附件" />
        <view v-if="props.uploadTips" class="title-upload">{{ props.uploadTips }}</view>
      </view>
    </view>
    <!-- 横铺展示上传的文件 -->
    <template v-if="imgList.length && props.previewImage">
      <view
        v-for="(item, index) in imgList"
        v-show="!props.maxShowPreview || (props.maxShowPreview && index < props.maxShowPreview)"
        :key="item.resourceUuid"
        class="successImg"
        :style="{ width: `${props.width}rpx`, height: `${props.height}rpx`, marginRight: (index + 1) % 5 === 0 ? '0rpx' : '20rpx' }"
        :class="props.uploadType === 'big-upload' ? 'big-image' : ''"
      >
        <view v-if="props.editable && !props.disabled" class="icon-box">
          <text class="iconfont icon-guanbi" @click.stop="deletePic(index)"></text>
        </view>
        <mediaPreview :media-info="item" :is-delete="false" :width="props.width" :height="props.height"></mediaPreview>
      </view>
    </template>
    <view v-if="remarkText" class="remark-text">{{ remarkText }}</view>
  </view>
  <Recorder v-if="props.uploadType === 'record' && dialogVisible" @close-dialog="closeDialog" @record-success="recordSuccess"></Recorder>
  <up-popup :show="showPopup" mode="center" :round="10" close-on-click-overlay="false">
    <view class="fail-to-upload">
      <view class="title"><text class="iconfont icon-guanbi2" @click="closePopup"></text></view>
      <view>
        <text class="iconfont"></text>
      </view>
      <view class="error-text">上传失败，请重试</view>
      <u-button type="primary" native-type="submit" @click="uploadAgain">重新上传</u-button>
    </view>
  </up-popup>
  <up-notify ref="uNotifyRef"></up-notify>
</template>
<script lang="ts">
export default {
  options: {
    styleIsolation: 'shared' // 解除样式隔离
  }
}
</script>
<script setup lang="ts">
import { MediaInfo } from '@/interfaces/common/media'
import { PREVIEW_RESOURCE_UUID } from '@/config/file'
import mediaPreview from '@/plugins/mediaPreview/index.vue'
import { showToast, webLoading } from '@/utils/uniapp/toast'
import { md5, encode64 } from '@/utils/crypto'
import { reLaunch } from '@/utils/uniapp'
import { CFile, FileItem } from '@/interfaces/common/file'
import apiCenterFiles from '@/api/fileCenter/api.files'
import pdfFile from '@/assets/file/pdf.png'
import otherFile from '@/assets/file/other.png'
import { getPlatform } from '@/utils/uniapp'
import WebUploader from 'webuploader'
import { useFileCenterTokenStore } from '@/store/fileCenter/token'
import { storeToRefs } from 'pinia'
import Recorder from './Recorder.vue'
import { useSystemConfigstore } from '@/store/systemConfig'
const { fileCenterToken } = storeToRefs(useFileCenterTokenStore())
const { systemConfig } = useSystemConfigstore()
let fileList: Array<CFile> = reactive([])
let imgList: Array<CFile> = reactive([])
let miniLoading: any = {}
let uNotifyRef = ref()
let defeatedFile = ref<any>(null)
const showPopup = ref(false)
let mediaFileType = '' // 媒体文件类型
let fileHash = '' // 文件hash值
let chunkSize = 1024 * 1024 * 5 // 分片每一片的大小
const uploader = ref<any>(null)
const uploadedChunk = ref(-1)
const dialogVisible = ref(false)
let recordDuration = 0 // 录音时长
const iconfontVo = {
  photo: 'icon-paizhao',
  record: 'icon-luyin',
  video: 'icon-luxiang'
}
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

  // 是否断点续传
  breakPoint: {
    type: Boolean,
    default: false,
    required: false
  },
  // 上传框类型【picture-card=照片墙/big-upload=大上传框/photo=拍摄照片/record=录音/video=拍摄视频】
  uploadType: {
    type: String,
    default: 'picture-card',
    required: false
  },
  // 上传框宽
  width: {
    type: Number,
    default: 110,
    required: false
  },
  // 上传框高
  height: {
    type: Number,
    default: 110,
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
    default: '',
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
    type: [Number, String],
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
    type: [Number, String],
    default: 1,
    required: false
  },
  /**
   * 最多预览的个数
   */
  maxShowPreview: {
    type: Number,
    default: 5,
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
  // 默认显示的数据
  showList: {
    type: Array as () => MediaInfo[],
    default: () => [],
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
const emit = defineEmits(['uploadSuccess', 'uploadRemove', 'handleClick', 'beforeDelete'])
const checkFile = async () => {
  // chunkSize
  const res = await apiCenterFiles.check(fileHash, chunkSize)
  if (res.data && res.data.check) {
    uploadedChunk.value = res.data.check
  } else {
    uploadedChunk.value = -1
  }
}
// 重新上传
const uploadAgain = () => {
  showPopup.value = false
  doUploader(defeatedFile.value)
}

// 获取文件前500kb的hash
// const generatePartialHash = async (file: any) => {
//   const chunkSize = 1024 * 512 // 512KB chunks
//   const maxChunks = 1 // 只读取前500KB，约为1个chunk
//   const fileSize = file.size

//   // 如果文件小于500KB，则读取整个文件
//   const readSize = Math.min(fileSize, 1024 * 500) // 500KB

//   return new Promise((resolve, reject) => {
//     const reader = new FileReader()
//     const blob = file.slice(0, readSize)
//     reader.onload = function (e) {
//       try {
//         const content = e.target?.result as ArrayBuffer
//         const byteArray = new Uint8Array(content)
//         const binaryString = Array.from(byteArray, byte => String.fromCharCode(byte)).join('')
//         const hash = md5(binaryString)
//         // 文件名称+文件大小+文件类型+文件内容hash
//         const fileHash = md5(md5(encode64(file.name + String(file.size) + file.type + hash)))
//         resolve(fileHash)
//       } catch (error) {
//         reject(error)
//       }
//     }

//     reader.onerror = function (e) {
//       reject(e)
//     }

//     reader.readAsArrayBuffer(blob)
//   })
// }
const closePopup = () => {
  showPopup.value = false
}
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
  fileList.push(file)
  imgList.push(file)
}
// 处理上传结果
const handleResponse = (file, response) => {
  return new Promise((resolve, reject) => {
    if (!checkCount()) {
      // 校验上传的数量
      return
    }
    if (getPlatform() === 'H5') {
      miniLoading.close()
    }
    const resData = response
    // try {
    //   // 文件中心不解密
    //   resData.data = JSON.parse(resData.data)
    // } catch (error) {
    //   reject(error)
    // }
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
        let fileSuffix = file.name.split('.')
        const successData = {
          url: fileUrl === otherFile ? otherFile : `${fileUrl}${`?resourceUuid=${resData.data.fileHash}`}`,
          fileName: file.name,
          fileType: mediaFileType,
          fileSuffix: fileSuffix[fileSuffix.length - 1],
          fileUuid: resData.data.fileHash,
          fileHash: resData.data.fileHash,
          uuid: resData.data.fileHash,
          fileDuration: recordDuration,
          resourceUuid: resData.data.fileHash,
          refcode: resData.data.refcode,
          fileKey: props.fileKey,
          status: 'success',
          message: ''
        }

        imgList.unshift(successData)
        fileList.unshift(successData)
        emit('uploadSuccess', successData) // 上传成功回调
        // showToast('上传成功')
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
  })
}
// 组装请求url
const getServerUrl = (file: Blob) => {
  if (props.actions) {
    // 自定义上传地址
    return props.actions
  } else if (file.type.startsWith('image/')) {
    // 图片
    return systemConfig.MINIO_URL + '/openapi/filecenter/file/upload/img'
  } else if (file.type.startsWith('video/')) {
    // 视频
    return systemConfig.MINIO_URL + '/openapi/filecenter/file/upload/video'
  }
  // 默认上传
  return systemConfig.MINIO_URL + '/openapi/filecenter/file/upload'
}

// 初始化WebUploader，H5端采用此上传
const initialize = () => {
  if (props.breakPoint) {
    WebUploader.Uploader.register({
      'before-send': function (block) {
        // 当前上传片数小于等于已上传的分片数，则取消上传
        if (block.chunk <= uploadedChunk.value) {
          return WebUploader.Deferred().reject()
        }
        return WebUploader.Deferred().resolve()
      }
      // beforeSendFile: async function (file) {
      //   try {
      //     // 使用 await 同步获取 MD5 值
      //     fileHash = await uploader.value.md5File(file)
      //   } catch (error) {
      //     fileHash = (await generatePartialHash(file)) as string
      //   }
      //   if (props.breakPoint) {
      //     // 上传云服务器且开启断点上传
      //     await checkFile()
      //   }
      // }
    })
  }

  uploader.value = WebUploader.create({
    auto: false,
    runtimeOrder: 'html5',
    pick: {
      multiple: props.multiple
    },
    compress: {
      // 图片质量，只有type为`image/jpeg`的时候才有效。
      quality: 60,
      // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
      allowMagnify: false,
      // 是否保留头部meta信息。
      preserveHeaders: true,
      // 是否允许裁剪。
      crop: false
    },

    timeout: 60 * 1000 * 30,
    thumb: false,
    resize: false,
    formData: props.uploadData,
    // compress: false,
    disableGlobalDnd: true,
    paste: document.body,
    chunked: true, // 是否要分片处理大文件上传。
    chunkSize: chunkSize, // 如果要分片，分多大一片？
    chunkRetry: 3, // 如果某个分片由于网络问题出错，允许自动重传多少次？
    threads: 5, // 上传并发数。允许同时最大上传进程数。
    duplicate: true, // 可重复上传
    headers: {
      Authorization: 'Bearer ' + fileCenterToken.value
    }
  })

  // 1、当有文件被添加进队列的时候('fileQueued', (file)
  // uploader.value.on('fileQueued', async file => {
  //   console.error(file)
  //   try {
  //     // 使用 await 同步获取 MD5 值
  //     fileHash = await uploader.value.md5File(file)
  //   } catch (error) {
  //     fileHash = (await generatePartialHash(file)) as string
  //   }
  //   console.error(fileHash)

  //   if (props.breakPoint) {
  //     // 上传云服务器且开启断点上传
  //     await checkFile()
  //   }
  // })
  // 2、当开始上传流程时触发。(startUpload)
  uploader.value.on('startUpload', () => {
    if (getPlatform() === 'H5') {
      miniLoading.loading()
    }
    const files = uploader.value.getFiles()
    let firstFile: any = null
    if (files.length) {
      firstFile = files[0]
    }
    uploader.value.options.server = `${getServerUrl(firstFile)}`
  })
  // 3.文件开始上传前触发，一个文件只会触发一次。('uploadStart', (file)
  // 文件开始上传前触发（整个文件级别）

  // 4、文件的分块在发送前触发。('uploadBeforeSend', (block, data, headers))
  uploader.value.on('uploadBeforeSend', async (block, data, headers) => {
    // 动态设置最新的 Authorization token
    headers.Authorization = 'Bearer ' + fileCenterToken.value
    if (props.uploadData) {
      for (const key in props.uploadData) {
        data[key] = props.uploadData[key]
      }
    }
    let file = block.file
    uploader.value.options.server = `${getServerUrl(file)}`
    data.hash = fileHash
    data.chunkSize = []
    block.file.blocks.forEach(i => {
      data.chunkSize.push(i.end - i.start)
    })

    // eslint-disable-next-line no-console
    console.log(`%c文件上传-请求接口：${uploader.value.options.server}`, 'background:#008cd6 ; padding: 2px;  color: #fff')
    // eslint-disable-next-line no-console
    console.log(data)
  })

  // 5/6、文件上传过程中创建进度条实时显示。('uploadProgress', (file, percentage))
  // 7、当文件上传到服务端响应后，派送此事件来询问服务端响应是否有效。('uploadAccept', (file, response))
  // 8.当文件上传成功。
  uploader.value.on('uploadSuccess', (file, response) => {
    if (response) {
      // setTimeout(() => {
      //   showToast('压缩后的图片大小' + file.size)
      // }, 2000)
      handleResponse(file, response)
    }
  })
  // 8.当文件上传失败。('uploadError', file )
  uploader.value.on('uploadError', file => {
    // uploader.value.removeFile(file) // 标记文件状态为已取消、避免重复上传
    if (getPlatform() === 'H5') {
      miniLoading.close()
    }
    defeatedFile.value = file
    showPopup.value = true
  })
  // 9.不管成功或者失败，文件上传完成时触发。
  uploader.value.on('uploadComplete', file => {
    uploader.value.removeFile(file) // 标记文件状态为已取消、避免重复上传
  })
  // 10、当所有文件上传结束时触发。*/
  // uploader.value.on('uploadFinished', () => {
  //   // getFolderName()
  // })
}

// 删除文件
const deletePic = index => {
  let vaild = true // 是否通过校验
  emit('beforeDelete', imgList[index], index, val => {
    vaild = val
  })
  if (!vaild) {
    return
  }
  // 调用uploadRemove 返回值：删除后的文件数组，fileKey，被删除的文件对象
  emit('uploadRemove', imgList, props.fileKey, imgList[index])
  fileList.splice(index, 1)
  imgList.splice(index, 1)
}
const checkCount = () => {
  if (props.maxCount && imgList.length >= Number(props.maxCount)) {
    showToast(`最多支持上传${props.maxCount}份文件`)
    return false
  }
  return true
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
      url: `${getServerUrl(file)}?t=${new Date().getTime()}`,
      filePath: file.url,
      name: 'file',
      file: file,
      // header: {
      //   'Content-Type': 'multipart/form-data'
      // },
      formData: Object.assign({}, { hash: md5(md5(encode64(file.name + String(file.size) + file.type))) }, props.uploadData),
      success: response => {
        const resData = JSON.parse(response.data)
        handleResponse(file, resData).then(successData => {
          resolve(successData)
        })
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
// 上传文件，H5端使用WebUploader，其他端使用uni.uploadFile
const doUploader = async (file: any) => {
  if (getPlatform() === 'H5') {
    let webUploaderFile: Blob = file
    if (file.url) {
      webUploaderFile = new File([await fetch(file.url).then(r => r.blob())], file.name, { type: file.type })
    }
    let time = ''
    if (file.lastModified) {
      time = String(file.lastModified)
    } else if (file.lastModifiedDate) {
      time = String(file.lastModifiedDate.getTime())
    }
    fileHash = md5(md5(encode64(file.name + time + String(file.size) + file.type)))
    if (props.breakPoint) {
      // 上传云服务器且开启断点上传
      await checkFile()
    }
    uploader.value.addFile(webUploaderFile)
    uploader.value.upload()
  } else {
    uploadFilePromise(file)
  }
}
// 检查文件类型
const isAcceptedFileType = (fileName: string) => {
  const fileType = fileName.split('.').pop()?.toLowerCase() || ''
  return props.accept.split(',').some(item => item.toLowerCase().includes(fileType))
}
// 添加一个新的方法来触发WebUploader文件选择
const triggerWebUploader = () => {
  if (!checkCount()) {
    return
  }

  // 创建一个临时的input元素来触发文件选择（备用方案）
  if (getPlatform() === 'H5' && uploader.value) {
    // 直接触发WebUploader的文件选择
    const filePicker = document.createElement('input')
    filePicker.setAttribute('type', 'file')
    filePicker.setAttribute('accept', props.accept)
    if (props.multiple) {
      filePicker.setAttribute('multiple', 'multiple')
    }
    filePicker.onchange = (e: any) => {
      const files = e.target.files
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          // 验证文件类型
          if (props.accept && !isAcceptedFileType(file.name)) {
            showToast('不支持此文件类型')
            continue
          }

          // 验证文件大小
          if (props.maxSize && typeof props.maxSize === 'number') {
            const maxSize = file.size / 1024 / 1024 < props.maxSize
            if (!maxSize) {
              showToast(`文件大小不能超过${props.maxSize}MB`)
              continue
            }
          }

          // 处理文件上传
          doUploader(file)
        }
      }
    }

    filePicker.click()
  }
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
    doUploader(temFileList[i])
  }
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-02-20 19:14:58
 * @param {*} showList  显示file列表
 * @description: 外部调用展示file列表
 */
const showFileList = showList => {
  fileList.splice(0)
  imgList.splice(0)
  if (showList) {
    showList.forEach(item => {
      initFileList(item)
    })
  }
}
onMounted(async () => {
  if (getPlatform() === 'H5') {
    miniLoading = await webLoading()
    initialize()
  }
  if (props.showList && props.showList.length) {
    showFileList(props.showList)
  }
})

/**
 * @Author: FangFang.Wu
 * @Date: 2023-01-11 10:37:07
 * @return {*}
 * @description: props.resUuidVo监听器，获取到值后只调用一次
 */
const unresUuidVoWatch = watch(
  () => props.showList,
  val => {
    if (val && val.length) {
      showFileList(val)
      unresUuidVoWatch()
    }
  },
  {
    deep: true
  }
)
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
      sizeType: ['compressed'],
      success: function (res) {
        // 测试代码
        // showToast('原始图片大小' + res.tempFiles[0].size + '原始图片格式' + res.tempFiles[0].type)
        mediaFileType = '1'
        doUploader(res.tempFiles[0])
      }
    })
  } else {
    showToast('PC端不支持拍照')
  }
}
/**
 * 根据文件大小计算预估上传时间
 * @param fileSize 文件大小（字节）
 * @returns 预估上传时间（分钟）
 */
const calculateUploadTime = (fileSize: number): number => {
  const sizeInMB = fileSize / (1024 * 1024)
  // 从100M开始计算时间，每100M需要1.5分钟
  if (sizeInMB < 100) {
    return 1 // 不到100M按1分钟计算
  }
  // 计算时间（分钟）
  // eslint-disable-next-line no-extra-parens
  const timeInMinutes = (sizeInMB / 100) * 1.5
  // 不到一分钟按1分钟计算，向上取整
  return Math.ceil(timeInMinutes)
}
// 拍摄视频
const chooseVideo = () => {
  if (isMobileDevice()) {
    uni.chooseVideo({
      sourceType: ['camera'],
      compressed: true,
      success: function (res) {
        mediaFileType = '2'
        let estimatedTime = calculateUploadTime(res.size)
        if (estimatedTime > 1) {
          uNotifyRef.value.show({
            top: 120,
            bgColor: '#111111b3',
            color: '#fff',
            message: `上传时间大概需要${estimatedTime}分钟，上传期间请不要退出页面`,
            duration: 1000 * 4,
            fontSize: 26,
            safeAreaInsetTop: true
          })
        }
        doUploader(res.tempFile)
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
  mediaFileType = '3'
  nextTick(() => {
    try {
      doUploader(file)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('上传过程中发生错误:', error)
      showToast('上传失败，请重试')
    }
  })
}
// 获取媒体流上传
const getMediaFile = () => {
  let vaild = true // 是否通过校验
  emit('handleClick', val => {
    vaild = val
  })
  if (!vaild) {
    return
  }
  if (props.uploadType === 'photo') {
    chooseImage()
  } else if (props.uploadType === 'video') {
    chooseVideo()
  } else if (props.uploadType === 'record') {
    dialogVisible.value = true
  }
}
defineExpose({ afterRead, uploadFilePromise, showFileList, doUploader, getMediaFile, deletePic })
</script>
<style lang="scss" scoped>
.media-upload-file-add {
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
  margin-right: 20rpx;
  .iconfont {
    font-size: 34rpx;
    justify-content: end;
    color: #999;
  }
}
.upload-file {
  display: flex;
  flex-wrap: wrap;
  .remark-text {
    width: 100%;
    color: #999;
    font-size: 24rpx;
  }
  .successImg {
    // border: 2rpx dashed #d8d8d8;
    box-sizing: border-box;
    position: relative;
    margin-right: 20rpx;
    margin-bottom: 20rpx;
    border-radius: 10rpx;
    :deep(.successImg) {
      margin-right: 0 !important;
    }
    .icon-box {
      position: absolute;
      right: -10rpx;
      top: -12rpx;
      display: inline-block;
      // background-color: #fff;
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
  .web-uploader-trigger {
    cursor: pointer;

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

      .view-upload {
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
.fail-to-upload {
  width: calc(100vw - 60rpx);
  // height: 50vh;
  padding: 30rpx 30rpx 60rpx;
  box-sizing: border-box;
  .title {
    text-align: right;
  }
  .error-text {
    text-align: center;
    font-size: 36rpx;
    margin: 50rpx 0;
  }
  .again-btn {
    height: 68rpx;
    line-height: 68rpx;
    text-align: center;
    border-radius: 10rpx;
    border: 1px solid #ededed;
  }
}
</style>
