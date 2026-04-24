<!-- eslint-disable no-extra-parens -->
<!--
 * @Author       : Longcan.Yang
 * @Date         : 2025-08-22 13:51:12
 * @LastEditors  : ran.zhu
 * @LastEditTime : 2025-11-03 15:06:01
 * @Description  : 客户-我的客户-资料进度
-->
<template>
  <view class="operationContainer">
    <ty-info-card>
      <template #subtitle>
        <view class="operation">
          <view class="operationName">
            <view>{{ '收集资料进度' }}</view>
          </view>
          <view v-if="!isEmpty(vm.businessMaterial.businessStatus)" class="autherized">
            {{ businessStatusVo[vm.businessMaterial.businessStatus] }}
          </view>
          <!-- <view v-if="vm.businessMaterial.repUuid" class="preview-text" @click="downFile">
            <text>信用分析报告</text>
          </view> -->
        </view>
      </template>
      <view class="detail">
        <view v-if="vm.businessMaterial.businessStatus === '2' && !isEmpty(vm.businessMaterial.businessMsg)" class="error-msg">
          (失败原因：{{ vm.businessMaterial.businessMsg }})
        </view>
        <view v-if="haveDomestic" class="file-info" @click="viewDetail('1')">
          <view class="file-info-content">
            <cover-image class="file-icon" src="@/assets/member/customer/domestic.png" alt="指引" mode="widthFix" />
            <text>
              <text>国内业务资料</text>
              <text class="tip">
                <text class="count">
                  ({{ domesticVo.isUploadCount }}
                  <text class="interval">/</text>
                  {{ domesticVo.allUploadCount }})
                </text>
              </text>
            </text>
          </view>

          <view class="right-box">
            <text :class="'status' + vm.businessMaterial.domesticDqscStatus">
              {{ getValueByKey(vm.businessMaterial.domesticDqscStatus, 'dqscStatus') }}
            </text>
            <up-icon name="arrow-right" color="#999999"></up-icon>
          </view>
        </view>

        <view v-if="haveOverseas" class="file-info" @click="viewDetail('2')">
          <view class="file-info-content">
            <cover-image class="file-icon" src="@/assets/member/customer/international.png" alt="指引" mode="widthFix" />
            <text>
              <text>国际业务资料</text>
              <text class="tip">
                <text class="count">
                  ({{ overseasVo.isUploadCount }}
                  <text class="interval">/</text>
                  {{ overseasVo.allUploadCount }} )
                </text>
              </text>
            </text>
          </view>

          <view class="right-box">
            <text :class="'status' + vm.businessMaterial.overseasDqscStatus">
              {{ getValueByKey(vm.businessMaterial.overseasDqscStatus, 'dqscStatus') }}
            </text>
            <up-icon name="arrow-right" color="#999999"></up-icon>
          </view>
        </view>
      </view>
      <u-empty v-if="!haveDomestic && !haveOverseas" mode="data" :text="'暂无数据'" :icon="empty" width="160" height="130" />

      <view
        v-if="vm.businessMaterial.businessStatus === '1' && !(isEmpty(vm.creditRepFile.repUploadPdfUuid) && isEmpty(vm.creditRepFile.repAutoPdfUuid))"
        class="operationName"
      >
        <view>{{ '信用分析报告' }}</view>
      </view>
      <view
        v-if="vm.businessMaterial.businessStatus === '1' && !(isEmpty(vm.creditRepFile.repUploadPdfUuid) && isEmpty(vm.creditRepFile.repAutoPdfUuid))"
        class="detail"
      >
        <view v-if="!isEmpty(vm.creditRepFile.repAutoPdfUuid)" class="file-info">
          <view class="file-info-content">
            <cover-image class="file-icon" src="@/assets/member/customer/thirdparty.png" alt="指引" mode="widthFix" />
            <text>
              <text>第三方接口生成</text>
            </text>
          </view>

          <view class="preview" @click="downloadFile(vm.creditRepFile.repAutoPdfUuid)">
            <text>下载</text>
          </view>
        </view>

        <view v-if="!isEmpty(vm.creditRepFile.repUploadPdfUuid)" class="file-info">
          <view class="file-info-content">
            <cover-image class="file-icon" src="@/assets/member/customer/custom.png" alt="指引" mode="widthFix" />
            <text>
              <text>客户上传生成</text>
            </text>
          </view>

          <view class="preview" @click.stop="downloadFile(vm.creditRepFile.repUploadPdfUuid)">
            <text>下载</text>
          </view>
        </view>
      </view>
    </ty-info-card>
  </view>
</template>

<script setup lang="ts">
import { useRouter } from '@/uni-simple-router'
import apiCustomer from '@/api/member/api.custormer'
import { encodeBase64 } from '@/utils/crypto'
import { CusBusinessMaterialVo, CreditRepFileVo } from '@/interfaces/member/customer/businessMaterial'
import apiFile from '@/api/common/api.file'
import empty from '@/assets/empty/empty.png'
import { getValueByKey } from '@/utils/constant'
import { isEmpty } from '@/utils/validate'
const router = useRouter()
const props = defineProps({ refcode: { type: Number, required: true }, orgname: { type: String, required: true } })
const haveDomestic = ref(false) // 存在国内业务资料数据
const haveOverseas = ref(false) // 存在国际业务资料数据
interface Count {
  isUploadCount: number
  allUploadCount: number
}
const domesticVo: Count = reactive({
  isUploadCount: 0,
  allUploadCount: 0
})
const overseasVo: Count = reactive({
  isUploadCount: 0,
  allUploadCount: 0
})
const businessMaterial: CusBusinessMaterialVo = {
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
const creditRepFile: CreditRepFileVo = {
  repAutoPdfUuid: '',
  repUploadPdfUuid: ''
}
const vm = reactive({
  businessMaterial: businessMaterial,
  creditRepFile: creditRepFile
})
const businessStatusVo = {
  0: '未税票授权',
  1: '已税票授权',
  2: '税票授权失败'
}
// 计算已上传、未上传个数
const getCount = (array, obj: Count) => {
  array.forEach(item => {
    obj['allUploadCount']++
    if (item.bmsFileTodoTaskStatus !== '1') {
      obj['isUploadCount']++
    }
  })
}
const downloadFile = fileUuid => {
  if (!isEmpty(fileUuid)) {
    apiFile.getFileByResourceUuid(fileUuid)
  }
}
const getCreditRepFile = () => {
  apiCustomer.getCreditRepFile(props.orgname).then(res => {
    vm.creditRepFile = res.data
  })
}

const getCusBusinessMaterial = () => {
  apiCustomer.getCusBusinessMaterial(props.refcode).then(res => {
    vm.businessMaterial = res.data
    getCreditRepFile()
    const businessConfigs = [
      {
        listNames: ['domesticTaxList', 'domesticCertList', 'domesticTradeHisList'],
        flag: haveDomestic,
        vo: domesticVo
      },
      {
        listNames: ['overseasTaxList', 'overseasCertList', 'overseasTradeHisList'],
        flag: haveOverseas,
        vo: overseasVo
      }
    ]

    // 处理两种业务类型
    businessConfigs.forEach(config => {
      let hasData = false
      config.listNames.forEach(listName => {
        const list = res.data[listName] || []
        if (list.length > 0) {
          hasData = true
        }
        getCount(list, config.vo)
      })
      config.flag.value = hasData
    })
  })
}

// 查看详情
const viewDetail = type => {
  router.push(`/member/customer/businessMaterial/detail/${encodeBase64(props.refcode)}/${encodeBase64(type)}`)
}
// 下载
// const downFile = () => {
//   // showPreview.value = true
//   apiFile.getFileByResourceUuid(vm.businessMaterial.repUuid)
// }
onMounted(() => {
  if (props.refcode) {
    getCusBusinessMaterial()
  }
})
</script>

<style lang="scss" scoped>
.operation {
  width: 100%;
  box-sizing: border-box;
  .preview-text {
    margin-top: 15rpx;
    margin-left: auto;
    color: $primary;
    font-weight: normal;
    position: relative;
    :deep(.search-modal) {
      position: absolute;
      top: 30rpx;
    }
  }
}
.file-info {
  display: flex;
  height: 108rpx;
  align-items: center;
  padding: 0 33rpx;
  box-shadow: 0 2px 10px 0 rgba(204, 204, 204, 0.4);
  border-radius: 10rpx;
  margin-bottom: 21rpx;
  justify-content: space-between;
  .file-info-content {
    display: flex;
    align-items: center;
  }
  .file-icon {
    width: 40rpx;
    height: 40rpx;
    margin-right: 15rpx;
  }
  .tip {
    color: #333333;
    margin-left: 10rpx;
    // .interval {
    //   margin: 0 4rpx;
    // }
  }
  // .count {
  //   margin: 0 4rpx;
  // }
  .right-box {
    display: flex;
    gap: 12rpx;
    float: right;
    .status1,
    .status2,
    .status3 {
      color: $u-warning;
    }
    .status8 {
      color: $u-error;
    }
    .status9 {
      color: $u-success;
    }
  }
}
.error-msg {
  color: $danger;
  font-size: 28rpx;
  min-height: 20rpx;
  word-break: break-all;
  padding-bottom: 30rpx;
  & :first-child {
    word-break: break-all;
  }
}
.operationName {
  font-weight: 700;
  font-size: 28rpx;
  margin-bottom: 30rpx;
}
.preview {
  color: $primary;
}
</style>
