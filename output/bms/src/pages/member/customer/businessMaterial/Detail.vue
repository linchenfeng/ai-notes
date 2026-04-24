<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-08-22 14:58:18
 * @LastEditors  : ran.zhu
 * @LastEditTime : 2025-11-03 16:38:50
 * @Description  : 客户-我的客户-资料进度-详情
-->
<template>
  <NavBar></NavBar>
  <up-sticky v-if="vm.cusBusinessMaterialVo.domesticDqscStatus">
    <state-module
      :state-name="getValueByKey(vm.cusBusinessMaterialVo.domesticDqscStatus, 'dqscStatus')"
      :state-color="stateColor[vm.cusBusinessMaterialVo.domesticDqscStatus]"
    ></state-module>
  </up-sticky>
  <view class="file-progress-detail">
    <template
      v-if="vm.cusBusinessMaterialVo.domesticTaxList || vm.cusBusinessMaterialVo.domesticCertList || vm.cusBusinessMaterialVo.domesticTradeHisList"
    >
      <ty-info-card title="公司信息">
        <view class="item-box">
          <view class="title">{{ '企业名称' }}</view>
          <view class="content">{{ vm.cusBusinessMaterialVo.orgname }}</view>
        </view>
      </ty-info-card>

      <ty-info-card
        v-if="vm.cusBusinessMaterialVo.domesticTaxList && vm.cusBusinessMaterialVo.domesticTaxList.length"
        :show-line="false"
        title="财税信息"
      >
        <view v-for="(item, index) in vm.cusBusinessMaterialVo.domesticTaxList" :key="index">
          <view class="item-box">
            <view class="title">{{ item.fileDesc }}</view>
            <view class="status-concent">
              <view class="status">
                <!-- 发票明细和纳税申报表是从第三方获取的，就显示已授权获取 -->
                {{
                  ['TBEA', 'TBDA'].includes(item.parentFileCode) && item.fileSource?.includes('2')
                    ? getValueByKey(item.fileSource.includes('2') ? '2' : item.fileSource, 'fileSource')
                    : bmsFileTodoTaskStatusVo[item.bmsFileTodoTaskStatus]
                }}
              </view>
              <!--   <view class="download" @tap="downloadFile(item.fileUuid, item.fileDesc)">
                <text v-if="!isEmpty(item.fileUuid)">下载</text>
              </view> -->
            </view>
          </view>
          <view v-if="item.uploadDate" class="item-box small">
            <view class="title">{{ '上传时间' }}</view>
            <view class="concent">{{ dateFormat(item.uploadDate, 2) }}</view>
          </view>
          <view v-if="item.examineOpinion && ['3', '8'].includes(item.bmsFileTodoTaskStatus)" class="item-box small bottom">
            <view class="title">{{ '退回原因' }}</view>
            <view class="concent">
              {{ item.examineOpinion }}
            </view>
          </view>
        </view>
      </ty-info-card>
      <ty-info-card v-if="vm.cusBusinessMaterialVo.domesticCertList && vm.cusBusinessMaterialVo.domesticCertList.length" title="证照信息">
        <view v-for="(item, index) in vm.cusBusinessMaterialVo.domesticCertList" :key="index">
          <view class="item-box">
            <view class="title">{{ item.fileDesc }}</view>
            <view class="status-concent">
              <view class="status">
                {{ bmsFileTodoTaskStatusVo[item.bmsFileTodoTaskStatus] }}
              </view>
              <!--               <view v-if="!isEmpty(item.fileUuid)" class="download" @tap="downloadFile(item.fileUuid, item.fileDesc)">下载</view>
 -->
            </view>
          </view>
          <view v-if="item.uploadDate" class="item-box small">
            <view class="title">{{ '上传时间' }}</view>
            <view class="concent">{{ dateFormat(item.uploadDate, 2) }}</view>
          </view>
          <view v-if="item.examineOpinion && ['3', '8'].includes(item.bmsFileTodoTaskStatus)" class="item-box small bottom">
            <view class="title">{{ '退回原因' }}</view>
            <view class="concent">
              {{ item.examineOpinion }}
            </view>
          </view>
        </view>
      </ty-info-card>
      <ty-info-card
        v-if="vm.cusBusinessMaterialVo.domesticTradeHisList && vm.cusBusinessMaterialVo.domesticTradeHisList.length"
        title="买方历史交易信息"
      >
        <view v-for="(item, index) in vm.cusBusinessMaterialVo.domesticTradeHisList" :key="index">
          <view class="item-box">
            <view class="title">{{ item.counterpartyName }}</view>
            <view class="status-concent">
              <view class="status">
                {{ bmsFileTodoTaskStatusVo[item.bmsFileTodoTaskStatus] }}
              </view>

              <!--               <view v-if="!isEmpty(item.fileUuid)" class="download" @tap="downloadFile(item.fileUuid, item.fileDesc)">下载</view>
 -->
            </view>
          </view>
          <view class="item-box small">
            <!-- <view class="title getName">{{ getName(item) }}</view> -->
            <view class="title">{{ item.fileDesc }}</view>
          </view>
          <view v-if="item.uploadDate" class="item-box small">
            <view class="title">{{ '上传时间' }}</view>
            <view class="concent">{{ dateFormat(item.uploadDate, 2) }}</view>
          </view>
          <view v-if="item.examineOpinion && ['3', '8'].includes(item.bmsFileTodoTaskStatus)" class="item-box small bottom">
            <view class="title">{{ '退回原因' }}</view>
            <view class="concent">
              {{ item.examineOpinion }}
            </view>
          </view>
        </view>
      </ty-info-card>
    </template>
    <u-empty v-else mode="data" :text="'暂无数据'" :icon="empty" width="300" height="244"></u-empty>
  </view>
</template>

<script setup lang="ts">
import empty from '@/assets/empty/empty.png'
import NavBar from '@/layout/NavBar.vue'
import { useRoute } from '@/uni-simple-router'
import { decodeBase64 } from '@/utils/crypto'
import apiCustormer from '@/api/member/api.custormer'
import { dateFormat } from '@/utils/format'
import { CusBusinessMaterialVo } from '@/interfaces/member/customer/businessMaterial'
import StateModule from '@/plugins/StateModule.vue'
import { getValueByKey } from '@/utils/constant'
// import apiFile from '@/api/common/api.file'
// import { isEmpty } from '@/utils/validate'
const route = useRoute()
const bmsFileTodoTaskStatusVo = {
  '1': '待上传',
  '2': '已上传',
  // '3': '已退回',
  '8': '未通过',
  '9': '已通过'
}
const stateColor = {
  '1': 'warning',
  '2': 'warning',
  '3': 'warning',
  '8': 'error',
  '9': 'success'
}
let refcode = Number(decodeBase64(String(route.value.params.refcode)))
let type = String(decodeBase64(String(route.value.params.type))) // 【1=国内，2=国际】
const cusBusinessMaterialVo: CusBusinessMaterialVo = {
  businessStatus: '',
  repUuid: '',
  dsqcStatus: '',
  domesticDqscStatus: '',
  overseasDqscStatus: '',
  domesticTaxList: [],
  domesticCertList: [],
  domesticTradeHisList: [],
  overseasTaxList: [],
  overseasCertList: [],
  overseasTradeHisList: [],
  orgname: ''
}
const vm = reactive({
  cusBusinessMaterialVo: cusBusinessMaterialVo
})
const getCusBusinessMaterial = () => {
  apiCustormer.getCusBusinessMaterial(refcode).then(res => {
    vm.cusBusinessMaterialVo = res.data
    if (type === '2') {
      // 将国际赋值展示
      vm.cusBusinessMaterialVo.domesticDqscStatus = res.data.overseasDqscStatus
      vm.cusBusinessMaterialVo.domesticTaxList = res.data.overseasTaxList
      vm.cusBusinessMaterialVo.domesticCertList = res.data.overseasCertList
      vm.cusBusinessMaterialVo.domesticTradeHisList = res.data.overseasTradeHisList
    }
  })
}
// const getName = item => {
//   if (item.fileDesc.includes('资料')) {
//     return '待检查交易资料'
//   }
//   return '待检查交易记录'
// }
/* const downloadFile = (fileUuid, fileDesc) => {
  if (!isEmpty(fileUuid)) {
    apiFile.getFileByUuid(fileUuid, fileUuid.includes(',') ? fileDesc : '-')
  }
} */
onMounted(() => {
  getCusBusinessMaterial()
})
</script>

<style lang="scss" scoped>
:deep(.u-sticky) {
  top: 44px !important;
  z-index: 2 !important;
  .stateModule {
    z-index: 3;
  }
}

.file-progress-detail {
  padding-top: 20rpx;
  .relative {
    margin-bottom: 20rpx;
  }
  .item-box {
    margin-bottom: 16rpx;
    display: flex;
    justify-content: space-between;
    font-size: 28rpx;
    .concent {
      width: 30%;
      text-align: right;
    }

    &:last-child {
      margin-bottom: 30rpx;
    }
    .title {
      word-break: break-all;
    }
    &.small {
      font-size: 24rpx;
      color: #999;
      .title {
        width: 25%;
        flex: none;
        margin-right: 30rpx;
        // &.getName {
        //   width: 30%;
        // }
      }
      .concent {
        width: 75%;
        word-break: break-all;
        text-align: right;
      }
    }
  }
  .status-concent {
    display: flex;

    .status {
      min-width: 150rpx;
      text-align: right;
    }
    .download {
      width: 70rpx;
      color: $primary;
      text-align: right;
    }
  }
}
</style>
