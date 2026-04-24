<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-10-14 14:56:51
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-11-11 09:57:46
 * @Description  : 项目-现场尽调-更多文件  /member/project/apply/siteDueDiligence/edit/moreFile
-->
<template>
  <NavBar></NavBar>
  <view class="more-file-box">
    <view v-for="(item, index) in vm.cddUserApxList" :key="index">
      <view class="uploadDate-box">
        <text class="uploadDate">{{ item.uploadDate }}</text>
        <up-checkbox-group v-if="isSelect" v-model="item.checkedAll" size="24" @change="selectAll(item, index)">
          <up-checkbox name="1" shape="circle" label="全选" label-size="14px" label-color="#333"></up-checkbox>
        </up-checkbox-group>
      </view>
      <mediaPreview
        :ref="el => {
          if (el) {
            mediaPreviewRefs[index] = el as InstanceType<typeof mediaPreview>
          }
        }"
        :key="index"
        :is-select="isSelect"
        :media-list="item.cddApxList"
        @change-checked="changeChecked"
      ></mediaPreview>
    </view>
  </view>
  <view class="button-fixed-bottom">
    <view class="placeholder"></view>
    <view class="fixed">
      <template v-if="operationType === '1'">
        <view class="vteam-button" @click="onUpload">
          <view class="vteam-button-icon">
            <text class="iconfont" :class="iconfontVo[fileType]"></text>
          </view>
          <view class="vteam-button-text">{{ operationText[fileType] }}</view>
        </view>
        <u-button block type="primary" class="submit" native-type="submit" @click="doManage">管理</u-button>
      </template>
      <template v-else>
        <view class="vteam-button" @click="download">
          <view class="vteam-button-icon">
            <text class="iconfont icon-xiazai"></text>
          </view>
          <view class="vteam-button-text">下载</view>
        </view>
        <view class="vteam-button" @click="submitRemoveCddApx">
          <view class="vteam-button-icon">
            <text class="iconfont icon-shanchu"></text>
          </view>
          <view class="vteam-button-text">删除</view>
        </view>
        <u-button block class="submit" native-type="submit" @click="doCancel">取消</u-button>
      </template>
    </view>
  </view>
  <view>
    <uploader
      ref="uploaderRef"
      :upload-type="uploadTypeVo[fileType]"
      file-key="record"
      :file-center="true"
      accept=""
      max-size=""
      max-count=""
      :upload-data="uploadData"
      @upload-success="uploadSuccess"
    ></uploader>
  </view>
  <u-modal
    :show="dialogShow"
    title="温馨提示"
    cancel-text="取消"
    confirm-text="确定"
    show-cancel-button
    @confirm="doRemoveCddApx"
    @cancel="dialogShow = false"
  >
    <view class="warmPrompt">是否确认删除？</view>
  </u-modal>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import mediaPreview from '@/plugins/mediaPreview/index.vue'
import { CddUserApxsList } from '@/interfaces/member/project/apply/siteDueDiligence'
import { useRoute, useRouter } from '@/uni-simple-router'
import { decodeBase64 } from '@/utils/crypto'
import apiSiteDueDiligence from '@/api/member/project/apply/api.siteDueDiligence'
import uploader from '@/plugins/uploader/components/FilecenterUploader.vue'
import apiCenterFiles from '@/api/fileCenter/api.files'
import { showToast } from '@/utils/uniapp/toast'
import { dateFormat } from '@/utils/format'
const route = useRoute()
const router = useRouter()
let operationType = ref('1') // 操作类型【1=预览/2=管理】
const mediaPreviewRefs = ref<InstanceType<typeof mediaPreview>[]>([])
const isSelect = ref(false)
const dialogShow = ref(false)
const uploaderRef = ref()

let cddRefcode = -1 // 现场尽调流水号
type CheckFileList = {
  refcode: number
  resourceUuid: string
  fileType: string
}
// 上传传参
const uploadData = ref({
  addWatermark: '01', // 是否添加水印 [01=是/02=否]
  watermarkText: '', // 水印内容，多行以,隔开
  createPreview: '01', // 是否生成预览图(缩略图),缩略视频
  vcStandard: '01', // 目标视频编码格式 【01=h264】
  targetVideoFormat: '01' // 目标视频格式 【01=mp4】
})
let checkFileList: CheckFileList[] = []
const operationText = reactive({
  1: '拍照',
  2: '录像',
  3: '录音'
})
// 媒体上传类型
const uploadTypeVo = reactive({
  1: 'photo',
  2: 'video',
  3: 'record'
})
const iconfontVo = reactive({
  1: 'icon-paizhao',
  2: 'icon-luxiang',
  3: 'icon-luyin'
})
let cddUserRefcode = -1
let fileType = ref('')
const cddUserApxList: CddUserApxsList[] = []
const vm = reactive({
  cddUserApxList: cddUserApxList,
  checkFileList
})

// 全选所有项目
const selectAll = (item, index) => {
  // mediaPreviewRefs.value.forEach(ref => {
  //   if (ref && typeof ref.checkAll === 'function') {
  //     ref.checkAll()
  //   }
  // })
  if (item.checkedAll && item.checkedAll.length) {
    mediaPreviewRefs.value[index].clearAll()
    vm.checkFileList = []
  } else {
    // vm.checkFileList = []
    mediaPreviewRefs.value[index].checkAll()
  }
}

// 清空所有选择
const clearAll = () => {
  vm.cddUserApxList.forEach(item => {
    item.checkedAll = []
  })
  mediaPreviewRefs.value.forEach(ref => {
    if (ref && typeof ref.clearAll === 'function') {
      ref.clearAll()
    }
  })
}
// 管理
const doManage = () => {
  operationType.value = '2'
  isSelect.value = true
}
// 取消管理
const doCancel = () => {
  operationType.value = '1'
  clearAll()
  isSelect.value = false
}
// 下载材料
const download = () => {
  if (!vm.checkFileList.length) {
    showToast('请选择要下载的附件')
    return
  }
  let temList: { hash: string; fileType: string }[] = []
  vm.checkFileList.forEach(item => {
    let obj = { hash: item.resourceUuid, fileType: '' }
    if (item.fileType === '3') {
      obj.fileType = '01'
    } else {
      obj.fileType = '02'
    }
    temList.push(obj)
  })
  apiCenterFiles.batchDownload(temList)
}

// 更改勾选
const changeChecked = item => {
  if (item.checked && item.checked.length) {
    vm.checkFileList.push(item)
  } else {
    vm.checkFileList = vm.checkFileList.filter(item1 => item1.resourceUuid !== item.resourceUuid)
  }
  // 反选全选
  vm.cddUserApxList.forEach(item1 => {
    const allChecked = item1.cddApxList.every(subItem => subItem.checked && subItem.checked.length)
    item1.checkedAll = allChecked ? ['1'] : []
  })
}
// 上传文件
const onUpload = () => {
  uploaderRef.value.getMediaFile()
}
// 现场尽调信息更多查询
const queryCddApxInfo = () => {
  const data = {
    cddUserRefcode,
    fileType: fileType.value
  }
  apiSiteDueDiligence.queryCddApxInfo(data).then(res => {
    vm.cddUserApxList = res.data.cddApxInfo.cddUserApxList || []
    if (!vm.cddUserApxList.length) {
      router.back(1)
    }
    // vm.cddUserApxList.forEach((item, i) => {
    //   mediaPreviewRefs.value[i].initMediaData(item.cddApxList)
    // })
  })
}
const doSaveCddApx = data => {
  const params = {
    cddRefcode,
    cddUserRefcode,
    ...data
  }
  apiSiteDueDiligence.doSaveCddApx(params).then(() => {
    queryCddApxInfo()
  })
}
// 上传成功
const uploadSuccess = data => {
  doSaveCddApx(data)
}
// 批量删除
const submitRemoveCddApx = () => {
  if (!vm.checkFileList.length) {
    showToast('请选择要删除的附件')
    return
  }
  dialogShow.value = true
}
// 批量删除材料
const doRemoveCddApx = () => {
  let cddApxRefcodeList: number[] = vm.checkFileList.map(item => item.refcode)
  apiSiteDueDiligence.doRemoveCddApx({ cddApxRefcodeList }).then(() => {
    showToast('删除成功')
    vm.checkFileList = []
    dialogShow.value = false
    queryCddApxInfo()
  })
}

// 获取现场尽调详情
const queryCddInfo = () => {
  apiSiteDueDiligence.queryCddInfo(cddUserRefcode).then(res => {
    cddRefcode = res.data.userCddInfo.cddRefcode
    uploadData.value.watermarkText =
      sessionStorage.pdfLoginId + '   ' + String(dateFormat(new Date(), 2)) + ',' + res.data.userCddInfo.positionLocation
  })
}
onMounted(() => {
  cddUserRefcode = Number(decodeBase64(route.value.params.cddUserRefcode)) // 尽调人员流水号
  fileType.value = decodeBase64(route.value.params.fileType) // 文件类型[1=照片，2=视频，3=音频]
  if (fileType.value === '2') {
    uploadData.value.createPreview = '02' // 视频不生成预览视频
  }
  queryCddApxInfo()
  queryCddInfo()
})
</script>

<style lang="scss" scoped>
:deep(.upload-file) {
  .media-upload-file-add {
    display: none;
  }
  .successImg {
    display: none;
  }
}

:deep(.u-checkbox-group) {
  flex-flow: row;
  .u-checkbox {
    margin: 0;
    .u-icon__icon {
      font-size: 24rpx !important;
    }
    .u-checkbox__icon-wrap {
      margin: 6rpx 14rpx 0 0;
    }
  }
}
.more-file-box {
  margin: 30rpx;
  .uploadDate-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .uploadDate {
      margin-top: 20rpx;
      font-weight: bold;
      font-size: 32rpx;
      margin-bottom: 30rpx;
    }
  }
}
</style>
