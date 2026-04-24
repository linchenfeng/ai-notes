<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-08-22 14:58:18
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-10-22 14:06:50
 * @Description  : 客户-我的客户-资料进度-详情
-->
<template>
  <NavBar></NavBar>
  <view class="file-progress-detail">
    <ty-info-card v-if="vm.fileInfo.taxList && vm.fileInfo.taxList.length" :show-line="false" title="财税信息">
      <view v-for="(item, index) in vm.fileInfo.taxList" :key="index">
        <view class="item-box">
          <view class="title">{{ item.fileDesc }}</view>
          <view v-if="!isEmpty(item.fileUuid)" class="download" @tap="downloadFile(item.fileUuid)">下载</view>
        </view>
        <view v-if="item.uploadDate" class="item-box small">
          <view class="title">{{ '上传时间' }}</view>
          <view class="concent">{{ dateFormat(item.uploadDate, 2) }}</view>
        </view>
      </view>
    </ty-info-card>
    <ty-info-card v-if="vm.fileInfo.certList && vm.fileInfo.certList.length" title="证照信息">
      <view v-for="(item, index) in vm.fileInfo.certList" :key="index">
        <view class="item-box">
          <view class="title">{{ item.fileDesc }}</view>
          <view v-if="!isEmpty(item.fileUuid)" class="download" @tap="downloadFile(item.fileUuid)">下载</view>
        </view>
        <view v-if="item.uploadDate" class="item-box small">
          <view class="title">{{ '上传时间' }}</view>
          <view class="concent">{{ dateFormat(item.uploadDate, 2) }}</view>
        </view>
      </view>
    </ty-info-card>
    <ty-info-card v-if="vm.fileInfo.tradeHisList && vm.fileInfo.tradeHisList.length" title="买方历史交易信息">
      <view v-for="(item, index) in vm.fileInfo.tradeHisList" :key="index">
        <view class="item-box">
          <view class="title">{{ item.counterpartyName }}</view>
          <view v-if="!isEmpty(item.fileUuid)" class="download" @tap="downloadFile(item.fileUuid)">下载</view>
        </view>
        <view class="item-box small">
          <view class="title">{{ item.fileDesc }}</view>
        </view>
        <view v-if="item.uploadDate" class="item-box small">
          <view class="title">{{ '上传时间' }}</view>
          <view class="concent">{{ dateFormat(item.uploadDate, 2) }}</view>
        </view>
      </view>
    </ty-info-card>
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import { useRoute } from '@/uni-simple-router'
import { decodeBase64 } from '@/utils/crypto'
import { dateFormat } from '@/utils/format'
import { FileInfo } from '@/interfaces/member/project/audit/documentReview'
import apiDocumentReview from '@/api/member/project/audit/api.documentReview'
import apiFile from '@/api/common/api.file'
import { isEmpty } from '@/utils/validate'
const route = useRoute()
let orgname = decodeBase64(route.value.params.orgname)
let dqscNo = decodeBase64(route.value.params.dqscNo)
const fileInfo: FileInfo = {
  taxList: [],
  certList: [],
  tradeHisList: []
}
const vm = reactive({
  fileInfo: fileInfo
})
const getCustomerUploadInfo = () => {
  apiDocumentReview.getCustomerUploadInfo({ orgname: orgname, dqscNo: dqscNo }).then(res => {
    vm.fileInfo = res.data
  })
}
const downloadFile = fileUuid => {
  if (!isEmpty(fileUuid)) {
    apiFile.getFileByUuid(fileUuid)
  }
}
onMounted(() => {
  getCustomerUploadInfo()
})
</script>
<style lang="scss" scoped>
.file-progress-detail {
  .relative {
    margin-bottom: 20rpx;
  }
  .item-box {
    margin-bottom: 16rpx;
    display: flex;
    justify-content: space-between;
    font-size: 28rpx;
    .title {
      word-break: break-all;
    }
    .download {
      width: 120rpx;
      color: $primary;
      text-align: right;
    }
    &:last-child {
      margin-bottom: 30rpx;
    }
    &.small {
      font-size: 24rpx;
      color: #999;
      .title {
        width: 25%;
        flex: none;
        margin-right: 30rpx;
      }
      .concent {
        width: 75%;
        word-break: break-all;
        text-align: right;
      }
    }
  }
}
</style>
