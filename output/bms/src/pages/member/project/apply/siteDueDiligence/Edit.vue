<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-10-11 16:35:05
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-11-13 19:24:58
 * @Description  : 项目-业务申请-现场尽调 /member/project/apply/siteDueDiligence/edit
-->
<template>
  <NavBar></NavBar>
  <view class="site-dueDiligence-edit">
    <view class="signIn">
      <view class="orgname">{{ vm.customerInfo.orgInfo.orgname }}</view>
      <view class="buttom-box">
        <view class="location">
          <text v-if="vm.cddInfo.positionLocation">当前位置：</text>
          {{ vm.cddInfo.positionLocation }}
        </view>
        <view class="sign-botton" @click="toSignIn">{{ vm.cddInfo.positionLocation ? '重新定位' : '现场签到' }}</view>
      </view>
    </view>
    <!-- 客户信息 -->
    <CusInformation :org-info="vm.customerInfo.orgInfo" :org-his-trade-list="vm.customerInfo.orgHisTradeList"></CusInformation>
    <ty-info-card title="尽调任务要求">
      <view class="card-cell-group">
        <u-cell-group>
          <u-cell :stop="false" title="尽调截止日" :value="dateFormat(vm.customerInfo.orgInfo.endDate)" :border="false" />
          <u-cell :stop="false" title="尽调要求" :border="false" />
          <view class="remark-box">{{ vm.customerInfo.orgInfo.remark }}</view>
        </u-cell-group>
      </view>
    </ty-info-card>
    <ty-info-card title="尽调信息">
      <view class="media-container">
        <view class="media-title">
          <text>拍照</text>
        </view>
        <view class="media-big-box">
          <uploader
            ref="photoRef"
            upload-type="photo"
            file-key="photo"
            :file-center="true"
            :break-point="true"
            accept=""
            max-size=""
            :max-count="null"
            :max-show-preview="4"
            :upload-data="uploadData"
            @before-delete="beforeDelete"
            @upload-success="uploadSuccess"
            @handle-click="callback => handleClick(callback, 'photo')"
            @upload-remove="uploadRemove"
          ></uploader>
          <view class="more-icon">
            <text v-if="getFileLength('1')" class="iconfont icon-icon_220" @click="toMoreFile('1')"></text>
          </view>
        </view>
        <view class="media-title">
          <text>录像</text>
          <text class="tip">建议最大时长3分钟</text>
        </view>
        <view class="media-big-box">
          <uploader
            ref="videoRef"
            upload-type="video"
            file-key="video"
            :file-center="true"
            :break-point="true"
            accept=""
            max-size=""
            :max-count="null"
            :max-show-preview="4"
            :upload-data="uploadData"
            @before-delete="beforeDelete"
            @upload-success="uploadSuccess"
            @handle-click="callback => handleClick(callback, 'video')"
            @upload-remove="uploadRemove"
          ></uploader>
          <view class="more-icon">
            <text v-if="getFileLength('2')" class="iconfont icon-icon_220" @click="toMoreFile('2')"></text>
          </view>
        </view>
        <view class="media-title">
          <text>录音</text>
          <text class="tip">建议最大时长3分钟，超过10分钟自动结束录制</text>
        </view>
        <view class="media-big-box">
          <!-- width="88"
          height="88" -->
          <uploader
            ref="recordRef"
            upload-type="record"
            file-key="record"
            :file-center="true"
            :break-point="true"
            accept=""
            max-size=""
            :max-count="null"
            :max-show-preview="4"
            @before-delete="beforeDelete"
            @upload-success="uploadSuccess"
            @handle-click="handleClick"
            @upload-remove="uploadRemove"
          ></uploader>
          <view class="more-icon">
            <text v-if="getFileLength('3')" class="iconfont icon-icon_220" @click="toMoreFile('3')"></text>
          </view>
        </view>
      </view>
    </ty-info-card>
    <ty-info-card title="尽调结论">
      <!-- <u-form> -->
      <view class="content pre-wrap">
        <u-textarea
          v-model="vm.cddInfo.taskConclusion"
          :confirm-type="null"
          auto-height
          maxlength="300"
          count
          class="inputValueClass"
          placeholder="请输入尽调结论"
        ></u-textarea>
      </view>
      <!-- </u-form> -->
    </ty-info-card>
    <view class="button-fixed-bottom">
      <view class="placeholder"></view>
      <view class="fixed">
        <u-button :loading="loading" block type="success" native-type="submit" @click="doSaveCddInfo">保存</u-button>
        <u-button :loading="loading" block type="primary" class="submit" native-type="submit" @click="nextStep">下一步</u-button>
      </view>
    </view>
  </view>
  <u-modal
    :show="dialogShow"
    title="温馨提示"
    cancel-text="取消"
    confirm-text="确定"
    show-cancel-button
    @confirm="doRemove"
    @cancel="dialogShow = false"
  >
    <view class="warmPrompt">是否确认删除？</view>
  </u-modal>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import { useRoute, useRouter } from '@/uni-simple-router'
import { encodeBase64, decodeBase64 } from '@/utils/crypto'
import apiSiteDueDiligence from '@/api/member/project/apply/api.siteDueDiligence'
import { CustomerInfo, CddInfo, SaveCddInfo } from '@/interfaces/member/project/apply/siteDueDiligence'
import uploader from '@/plugins/uploader/index.vue'
import { onShow } from '@dcloudio/uni-app'
import { getSession, removeSession } from '@/utils/storages'
import { dateFormat } from '@/utils/format'
// import { getHasPermissionsById } from '@/utils/permissions'
import { showToast } from '@/utils/uniapp/toast'
import CusInformation from './components/CusInformation.vue'
import { doWxConfig } from '@/utils/weixin/wxConfig'
import wx from 'jweixin-1.6.0'
const router = useRouter()
const route = useRoute()
let loading = ref(false)
let deleteItem: any = {}
let longitude = '' // 经度
let latitude = '' // 纬度
let refcode = ref(0) // 尽调流水号
let cddUserRefcode = ref(0) // 尽调人员流水号
const dialogShow = ref(false)
const photoRef = ref()
const videoRef = ref()
const recordRef = ref()
const uploadData = ref({
  addWatermark: '01',
  watermarkText: '',
  createPreview: '01',
  vcStandard: '01',
  targetVideoFormat: '01'
})
// 尽调客户详情
const customerInfo: CustomerInfo = {
  orgHisTradeList: [],
  orgInfo: {
    applyDate: '',
    applyUser: '',
    appointStatus: '',
    businessNo: '',
    businessScope: '',
    cddSuperior: '',
    cddSuperiorName: '',
    companyCreditCode: '',
    completionDate: '',
    ctyDesc: '',
    ctyid: '',
    endDate: '',
    legalLinkman: '',
    legalLinkmanPhone: '',
    legalPerson: '',
    legalPhone: '',
    operateAddress: '',
    optionalCddUsers: '',
    orgname: '',
    refcode: 0,
    regDate: '',
    remark: ''
  }
}
//  现场尽调详情
const cddInfo: CddInfo = {
  cddRefcode: -1,
  cddUserApxList: [],
  cddUserid: '',
  positionLatitude: '',
  positionLocation: '',
  positionLongitude: '',
  refcode: 0,
  surveyStatus: '',
  taskConclusion: '',
  cddUserName: ''
}
const vm = reactive({
  customerInfo,
  cddInfo
})

// 判断设备类型
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}
// 前往签到
const toSignIn = () => {
  if (!isMobileDevice()) {
    showToast('PC端不支持定位')
    return
  }
  router.push('/member/project/audit/assignDueDiligence/baiduMap')
}
// 现场尽调客户详情查询
const queryCddCustomerInfo = () => {
  apiSiteDueDiligence.queryCddCustomerInfo(refcode.value).then(res => {
    vm.customerInfo = res.data
    vm.customerInfo.orgInfo.regDate = dateFormat(res.data.orgInfo.regDate || '')
  })
}

// 获取现场尽调详情
const queryCddInfo = () => {
  apiSiteDueDiligence.queryCddInfo(cddUserRefcode.value).then(res => {
    vm.cddInfo = res.data.userCddInfo
    if (vm.cddInfo.surveyStatus === '9') {
      showToast('当前尽调状态已变更')
      router.back(1)
    }
    if (!vm.cddInfo.cddUserApxList) {
      vm.cddInfo.cddUserApxList = []
    }
    // 先清空数据
    photoRef.value.showFileList()
    videoRef.value.showFileList()
    recordRef.value.showFileList()
    // nextTick(() => {
    vm.cddInfo.cddUserApxList.forEach(item => {
      if (item.fileType === '1') {
        photoRef.value.showFileList(item.cddApxList)
      } else if (item.fileType === '2') {
        videoRef.value.showFileList(item.cddApxList)
      } else if (item.fileType === '3') {
        recordRef.value.showFileList(item.cddApxList)
      }
    })
    // })
    uploadData.value.watermarkText = sessionStorage.pdfLoginId + '   ' + String(dateFormat(new Date(), 2)) + ',' + vm.cddInfo.positionLocation
  })
}
// 点击上传前置校验
const handleClick = (callBack, type?: string) => {
  if (type === 'video') {
    uploadData.value.createPreview = '02' // 视频不生成预览视频
  } else if (type === 'photo') {
    uploadData.value.createPreview = '01'
  }
  let valid = true
  if (!vm.cddInfo.positionLocation) {
    showToast('请先进行现场签到')
    valid = false
  }
  callBack(valid)
}
// 确认删除
const doRemove = () => {
  if (deleteItem.fileType === '1') {
    photoRef.value.deletePic(deleteItem.deleteIndex)
  } else if (deleteItem.fileType === '2') {
    videoRef.value.deletePic(deleteItem.deleteIndex)
  } else if (deleteItem.fileType === '3') {
    recordRef.value.deletePic(deleteItem.deleteIndex)
  }
  nextTick(() => {
    dialogShow.value = false
  })
}
// 删除文件拦截
const beforeDelete = (item, index, callBack) => {
  deleteItem = { ...item, deleteIndex: index }
  if (dialogShow.value) {
    // 若弹窗显示表示确认删除，则直接删除
    callBack(true)
  } else {
    // 若弹窗不显示表示第一次删除，弹窗进行确认
    dialogShow.value = true
    callBack(false)
  }
}
// 获取当前经纬度
const getLocation = (): Promise<{ longitude: string; latitude: string }> => {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        longitude = res.longitude
        latitude = res.latitude
        resolve({ longitude, latitude }) // 成功时解析Promise
      },
      fail: function (fail) {
        // eslint-disable-next-line no-console
        console.error(fail)
        reject(fail) // 失败时拒绝Promise
      }
    })
  })
}
// 上传成功
const uploadSuccess = async data => {
  const params = {
    cddRefcode: refcode.value,
    cddUserRefcode: cddUserRefcode.value,
    positionLongitude: longitude,
    positionLatitude: latitude,
    ...data
  }
  apiSiteDueDiligence.doSaveCddApx(params).then(() => {
    queryCddInfo()
  })
}
// 删除文件
const uploadRemove = (list, fileKey, fileInfo) => {
  apiSiteDueDiligence.doRemoveCddApx({ cddApxRefcodeList: [fileInfo.refcode] }).then(() => {
    showToast('删除成功')
    queryCddInfo()
  })
}
// 获取类型文件长度
const getFileLength = type => {
  let showFlag = false
  vm.cddInfo.cddUserApxList.forEach(item => {
    if (item.fileType === type && item.cddApxList.length > 4) {
      showFlag = true
    }
  })
  return showFlag
}
// 保存现场尽调信息
//toastFlag 是否提示保存成功  query 是否查询最新数据
const doSaveCddInfo = async (toastFlag = true, query = true) => {
  loading.value = true
  await apiSiteDueDiligence.doSaveCddInfo(vm.cddInfo as SaveCddInfo).then(
    () => {
      if (toastFlag) {
        showToast('保存成功')
      }
      loading.value = false
      if (query) {
        queryCddInfo()
      }
    },
    () => {
      loading.value = false
    }
  )
}
// 查看更多文件
const toMoreFile = (type: string) => {
  router.push(`/member/project/apply/siteDueDiligence/edit/moreFile/${encodeBase64(vm.cddInfo.refcode)}/${encodeBase64(type)}`)
}
// 下一步
const nextStep = async () => {
  if (!vm.cddInfo.positionLocation) {
    showToast('请进行现场签到')
    return
  }
  // if (!vm.cddInfo.taskConclusion) {
  //   showToast('请输入尽调结论')
  //   return
  // }
  if (vm.cddInfo.taskConclusion && vm.cddInfo.taskConclusion.length > 300) {
    showToast('尽调结论字数超长')
    return
  }
  await doSaveCddInfo(false, false)
  router.push(`/member/project/apply/siteDueDiligence/edit/materialQuery/${encodeBase64(refcode.value)}/${encodeBase64(vm.cddInfo.refcode)}`)
}

const initWechatConfig = () => {
  const jsApiList = ['getLocation']
  doWxConfig(jsApiList)
    .then(() => {
      getLocation()
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.error(error)
    })
}
onMounted(() => {
  initWechatConfig()
  refcode.value = Number(decodeBase64(route.value.params.refcode)) // 尽调流水号
  cddUserRefcode.value = Number(decodeBase64(route.value.params.cddUserRefcode)) // 尽调人员流水号
  queryCddCustomerInfo()
  queryCddInfo()
})
onShow(() => {
  const baiDuMapInfo = getSession('baiDuMapInfo') as any
  if (baiDuMapInfo) {
    vm.cddInfo.positionLocation = baiDuMapInfo.address
    vm.cddInfo.positionLatitude = baiDuMapInfo.latitude
    vm.cddInfo.positionLongitude = baiDuMapInfo.longitude
    removeSession('baiDuMapInfo')
    doSaveCddInfo(false)
  } else if (cddUserRefcode.value) {
    queryCddInfo()
  }
  if (getSession('diligencefillInFlag') === '1') {
    removeSession('diligencefillInFlag')
    setTimeout(() => {
      scrollTo(0, 99999)
    }, 100)
  }
})
</script>

<style lang="scss" scoped>
.remark-box {
  margin: -24rpx 0 34rpx;
}
.u-textarea {
  min-height: 160rpx;
  // padding-bottom: 40rpx;
  // margin-bottom: 15px;
  :deep(.u-textarea__field) {
    height: auto !important;
    min-height: 160rpx !important;
    .input-placeholder {
      font-size: 28rpx;
    }
  }
}
.site-dueDiligence-edit {
  .signIn {
    padding: 30rpx;
    margin: 40rpx 30rpx 20rpx;
    width: auto;
    min-height: 220rpx;
    background: #3a63fb;
    border-radius: 15rpx;
    background-image: url('@/static/img/map.png');
    background-repeat: no-repeat;
    background-size: contain;
    background-position: right;
    box-sizing: border-box;
    color: #ffffff;
    .orgname {
      font-size: 32rpx;
    }

    .buttom-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 30rpx;
      gap: 10rpx;
      .location {
        min-height: 80rpx;
        font-size: 26rpx;
        line-height: 44rpx;
        // display: -webkit-box;
        // -webkit-box-orient: vertical;
        // -webkit-line-clamp: 2;
        // overflow: hidden;
        // text-overflow: ellipsis;
      }
      .sign-botton {
        height: 68rpx;
        background: #f7ba2a;
        border-radius: 36rpx;
        text-align: center;
        line-height: 68rpx;
        padding: 0 34rpx;
        flex: none;
      }
    }
  }
  .task-require {
    font-size: 28rpx;
    color: #333333;
    margin-bottom: 34rpx;
  }
  .media-title {
    color: #666666;
    font-size: 28rpx;
    margin-bottom: 20rpx;
    .tip {
      font-size: 24rpx;
      color: #ff0000;
      margin-left: 30rpx;
    }
  }
  .media-big-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .more-icon {
      padding: 26rpx 0;
      margin-bottom: 20rpx;
      .icon-icon_220 {
        color: #138bec;
      }
    }
  }
}
.media-container {
  padding-bottom: 10rpx;
}
</style>
