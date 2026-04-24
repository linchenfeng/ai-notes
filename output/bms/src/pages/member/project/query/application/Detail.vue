<!--
 * @Author       : Longcan.Yang
 * @Date         : 2024-10-18 14:03:23
 * @LastEditors  : aolin.qu
 * @LastEditTime : 2026-03-17 13:43:08
 * @Description  : 项目-业务查询-申请书查询 /member/project/query/application/detail
-->

<template>
  <NavBar />
  <view class="main">
    <up-sticky z-index="2" bg-color="#fff">
      <state-module
        v-if="vm.submitInfo.fintAppM.applyStatus"
        :state-name="stateName[vm.submitInfo.fintAppM.applyStatus]"
        :state-color="stateColor[vm.submitInfo.fintAppM.applyStatus]"
      ></state-module>
    </up-sticky>
    <view id="apply-tip-container" class="apply-tip-container">
      <view v-if="vm.submitInfo.fintAppM.applyStatus === '6'" class="returnReason">
        <view>
          <text>拒绝原因：</text>
          <text class="reasonValue">
            {{ vm.submitInfo.fintAppM.examineRemark }}
          </text>
        </view>
      </view>
      <view v-if="vm.submitInfo.fintAppM.applyStatus === '7'" class="returnReason">
        <view>
          <text>退回原因：</text>
          <text class="reasonValue">
            {{ vm.submitInfo.fintAppM.examineRemark }}
          </text>
        </view>
      </view>
      <view class="topCell">
        <u-cell-group>
          <u-cell title="客户经理" :value="vm.submitInfo.fintAppM.userName" />
          <u-cell title="业务主管" :value="vm.submitInfo.fintAppM.superiorName" />
          <u-cell title="申请日期" :value="vm.submitInfo.fintAppM.applyDate ? dateFormat(vm.submitInfo.fintAppM.applyDate, 1) : ''" />
          <u-cell title="业务产品" :value="getProduceType(vm.submitInfo.fintAppM.bizScene, vm.submitInfo.fintAppM.productType)" />
        </u-cell-group>
      </view>
    </view>
    <view class="application-application-apply">
      <u-form label-width="35%">
        <ty-info-card v-if="vm.submitInfo.conditionBuyerList && vm.submitInfo.conditionBuyerList.length" title="有条件通过">
          <view class="condition">
            <view v-for="(item, index) in vm.submitInfo.conditionBuyerList" :key="index" class="condition-item">
              <span>
                <span class="condition-orgname">{{ item.orgname }}：</span>
                <span class="condition-remark">{{ item.conditionRemark }}</span>
              </span>
            </view>
          </view>
        </ty-info-card>
        <ty-info-card title="申请人(卖方)信息">
          <view class="internation-info-group">
            <u-cell-group>
              <u-cell title="申请人全称(卖方)" :value="vm.submitInfo.fintAppM.orgname" />
              <u-cell :title="'统一社会信用代码\n(Company Registration\n No.或相关登记号)'" :value="vm.submitInfo.fintAppM.companyCreditCode" />
              <u-cell title="卖方所在国" :value="vm.submitInfo.fintAppM.ctyDesc" />
              <u-cell title="经营地址" :value="vm.submitInfo.fintAppM.operateAddress" />
              <u-cell title="成立时间" :value="dateFormat(vm.submitInfo.fintAppM.regDate)" />
              <u-cell title="主要经营范围" :value="vm.submitInfo.fintAppM.businessScope" />
              <u-cell title="法人" :value="vm.submitInfo.fintAppM.legalPerson" />
              <u-cell title="法人联系电话" :value="vm.submitInfo.fintAppM.legalPhone" />
              <u-cell title="法人通讯工具号" :value="vm.submitInfo.fintAppM.legalCommNo" />
              <u-cell title="联系人姓名" :value="vm.submitInfo.fintAppM.legalLinkman" />
              <u-cell title="联系人电话" :value="vm.submitInfo.fintAppM.legalLinkmanPhone" />
              <u-cell title="联系人通讯工具号" :value="vm.submitInfo.fintAppM.legalLinkmanCommNo" />
            </u-cell-group>
          </view>
        </ty-info-card>
        <ty-info-card title="买方信息">
          <view v-for="(item, i) in vm.submitInfo.buyerList" :key="i" class="buyerList-item" @click="addBuyerInfo(item)">
            <view class="orgname">{{ item.orgname || item.aplOrgname }}</view>
            <view v-if="!isEmpty(item.finalClStatus)" class="clStatus" :class="`clStatus` + item.finalClStatus">
              {{ getValueByKey(item.finalClStatus as string, 'intClStatus') }}
            </view>
            <up-icon name="arrow-right"></up-icon>
          </view>
        </ty-info-card>
        <ty-info-card title="缴纳征信费">
          <view class="internation-info-group">
            <u-cell-group>
              <u-cell title="缴纳征信费" :value="getValueByKey(vm.submitInfo.fintAppM.payCreditType || '', 'payCreditType')" />
              <u-cell
                v-if="vm.submitInfo.fintAppM.payCreditType === '3' && !isEmpty(vm.submitInfo.fintAppM.discount)"
                title="征信费折扣"
                :value="vm.submitInfo.fintAppM.discount + '折'"
              />
              <u-cell
                v-if="['1', '2', '3'].includes(vm.submitInfo.fintAppM.payCreditType)"
                title="付款方式"
                :value="getValueByKey(vm.submitInfo.fintAppM.creditPaymentType || '', 'creditPaymentType')"
              />
              <view
                v-if="['1', '2', '3'].includes(vm.submitInfo.fintAppM.payCreditType || '') && vm.submitInfo.fintAppM.creditPaymentType === '1'"
                class="accountTitle"
              >
                {{ '收款账户信息' }}
              </view>
              <view v-if="['1', '2', '3'].includes(vm.submitInfo.fintAppM.payCreditType || '') && vm.submitInfo.fintAppM.creditPaymentType === '1'">
                <u-cell title="收款企业名称" :value="vm.submitInfo.fintAppM.factoringMerchant" />
                <u-cell title="缴费币种" :value="vm.submitInfo.fintAppM.ccyidDesc" />
                <u-cell title="户名" :value="vm.submitInfo.fintAppM.factoringMerchant" />
                <view v-if="vm.submitInfo.fintAppM.invoiceType === '0'">
                  <u-cell title="账号" :value="vm.submitInfo.fintAppM.factoringAccountNo" />
                  <u-cell title="开户行" :value="vm.submitInfo.fintAppM.factoringBank" />
                </view>
                <view v-else-if="vm.submitInfo.fintAppM.invoiceType === '1'">
                  <u-cell title="开户行(中文)" :value="vm.submitInfo.fintAppM.factoringBank" />
                  <u-cell title="开户行(英文)" :value="vm.submitInfo.fintAppM.factoringBankEn" />
                  <u-cell title="银行地址" :value="vm.submitInfo.fintAppM.factoringBankAddress" />
                  <u-cell title="银行SWIFT CODE" :value="vm.submitInfo.fintAppM.factoringSwiftCode" />
                  <u-cell title="行号(RTGS代码)" :value="vm.submitInfo.fintAppM.bankRtgsCode" />
                  <u-cell title="分行号" :value="vm.submitInfo.fintAppM.bankBranchCode" />
                  <u-cell title="账号" :value="vm.submitInfo.fintAppM.factoringAccountNo" />
                </view>
              </view>
              <u-cell
                v-if="['1', '2', '3'].includes(vm.submitInfo.fintAppM.payCreditType || '') && vm.submitInfo.fintAppM.creditPaymentType === '1'"
                class="margin-10"
                title="征信费银行回单"
              />
              <Uploader
                key="1"
                :editable="false"
                :res-uuid-vo="{ fileList: vm.submitInfo.fintApxList.filter(item => item.fileType === '1') }"
              ></Uploader>
              <u-cell
                v-if="['2', '9'].includes(vm.submitInfo.fintAppM.payCreditType || '') || vm.submitInfo.fintAppM.creditPaymentType === '2'"
                class="margin-10"
                title="主管审批证明"
              />
              <Uploader
                key="2"
                :editable="false"
                :res-uuid-vo="{ fileList: vm.submitInfo.fintApxList.filter(item => item.fileType === '2') }"
              ></Uploader>
            </u-cell-group>
          </view>
        </ty-info-card>
        <ty-info-card v-if="isNotEmpty(vm.submitInfo.fintAppM.billFlag)" title="开票信息" class="billInfo-card">
          <view class="card-cell-group">
            <u-cell-group>
              <u-cell title="开票方式" :value="getValueByKey(vm.submitInfo.fintAppM.billFlag, 'billFlag')" />
            </u-cell-group>
            <u-cell-group v-if="vm.submitInfo.fintAppM.billFlag === '1'">
              <u-cell
                v-if="vm.submitInfo.fintAppM.invoiceType !== '1'"
                title="开票类型"
                :value="getValueByKey(vm.submitInfo.fintAppM.billType, 'billType')"
              />
              <u-cell title="开票企业名称" :value="vm.submitInfo.fintAppM.billOrgname" />
              <u-cell v-if="vm.submitInfo.fintAppM.invoiceType !== '1'" title="开票企业税号" :value="vm.submitInfo.fintAppM.billDutyParagraph" />
              <u-cell title="开票企业邮箱" :value="vm.submitInfo.fintAppM.billEmail" />
            </u-cell-group>
            <u-cell-group v-if="vm.submitInfo.fintAppM.billFlag === '2'">
              <u-cell title="开票申请编号" :value="fgaiAppVo.appNo" />
              <u-cell title="开票金额(元)" :value="moneyFormat(fgaiAppVo.generateAmt)" />
              <u-cell title="开票企业名称" :value="fgaiAppVo.appOrgName" />
              <u-cell v-if="vm.submitInfo.fintAppM.invoiceType !== '1'" title="开票企业税号" :value="fgaiAppVo.appCreditCode" />
              <u-cell title="开票企业邮箱" :value="fgaiAppVo.email" />
            </u-cell-group>
            <u-cell-group>
              <u-cell
                v-if="['1', '2'].includes(vm.submitInfo.fintAppM.billFlag) && vm.submitInfo.fintApxList.filter(item => item.fileType === '3')"
                class="margin-10"
                title="付款委托书"
              />
              <Uploader
                key="3"
                :editable="false"
                :res-uuid-vo="{ fileList: vm.submitInfo.fintApxList.filter(item => item.fileType === '3') }"
              ></Uploader>
              <u-cell v-if="isNotEmpty(vm.submitInfo.fintAppM.remark)" title="备注" class="vertical-cell" :border="false">
                <template #value>
                  <text class="cell-value">{{ vm.submitInfo.fintAppM.remark }}</text>
                </template>
              </u-cell>
            </u-cell-group>
          </view>
        </ty-info-card>
      </u-form>
    </view>
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import StateModule from '@/plugins/StateModule.vue'
import { ApplicationInfo } from '@/interfaces/member/project/apply/fillingApplication'
import { ConstantArray } from '@/interfaces/common/constant'
import { getConstant, getValueByKey } from '@/utils/constant'
import apiApplicationQuery from '@/api/member/project/query/api.applicationQuery'
import { useRoute, useRouter } from '@/uni-simple-router'
import { decodeBase64, encodeBase64 } from '@/utils/crypto'
import { onShow } from '@dcloudio/uni-app'
import { setStorage, removeStorage } from '@/utils/storages'
import { dateFormat, moneyFormat } from '@/utils/format'
import Uploader from '@/plugins/uploader/components/Uploader.vue'
import { isEmpty, isNotEmpty } from '@/utils/validate'
import { FgaiAppVo } from '@/interfaces/member/myinfo/invoice'
import apiInvoice from '@/api/member/myinfo/api.invoice'
const route = useRoute()
const router = useRouter()
let loading = ref(false)
const stateName = {
  '1': '待提交',
  '2': '待确认',
  '3': '待修改',
  '4': '已申请',
  '5': '已申请',
  '6': '已拒绝',
  '7': '已退回',
  '8': '已退回',
  '9': '已通过'
}
const stateColor = {
  '1': 'warning',
  '2': 'warning',
  '3': 'warning',
  '4': 'warning',
  '5': 'warning',
  '6': 'error',
  '7': 'warning',
  '8': 'warning',
  '9': 'success'
}
let refcode: number | string = '-1' // 申请书流水号
const columns: ConstantArray = [getConstant('payCreditType')]
let submitInfo: ApplicationInfo = {
  buyerList: [],
  conditionBuyerList: [],
  fintAppM: {
    operator: '',
    applyStatus: '',
    applyOrgStatus: '',
    regDate: '',
    billFlag: '',
    billType: '',
    payCreditType: '',
    examineRemark: '',
    examineDate: '',
    invoiceType: '',
    billCcyid: '',
    discountDesc: '',
    discount: '',
    creditPaymentType: '',
    creditPaymentTypeDesc: '',
    factoringUsdAccountNo: '',
    factoringBankEn: '',
    factoringBankAddress: '',
    factoringSwiftCode: '',
    bankRtgsCode: '',
    bankBranchCode: '',
    ctyid: '',
    ctyDesc: '',
    userName: '',
    superiorName: '',
    applyDate: '',
    factoringHkdAccountNo: '',
    bizScene: '',
    productType: '',
    paymentCcyid: '',
    ccyidDesc: ''
  },
  fintApxList: [],
  userName: '',
  totalBuyerCount: 0
}
let vm = reactive({
  submitInfo: submitInfo, // 提交信息
  columns: columns // 币种/账期选择列表
})

const addBuyerInfo = item => {
  setStorage('application-buyerInfo', vm.submitInfo.buyerList)
  router.push(`/member/project/query/application/buyerInfo/${encodeBase64(item.refcode)}`)
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-18 15:34:20
 * @description: 下载文件
 */
// const downloadFile = item => {
//   apiFile.getFileByResourceUuid(item.resourceUuid)
// }
let fgaiAppVo = ref<FgaiAppVo>({} as FgaiAppVo)
const getBusinessInvoiceApp = () => {
  const data = {
    applyNo: vm.submitInfo.fintAppM.applyNo
  }
  apiInvoice.getBusinessInvoiceApp(data).then(res => {
    fgaiAppVo.value = res.data.fgaiAppVo
  })
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-17 13:40:49
 * @param {*} type 临时保存后获取每个买方流水号
 * @description: 获取详情
 */
const getApplicationInfo = () => {
  apiApplicationQuery.getApplicationInfo(refcode).then(
    res => {
      vm.submitInfo = res.data
      vm.submitInfo.buyerList.forEach(item => {
        if (item.ccyid) {
          item.ccyidDesc = getValueByKey(item.ccyid, 'applyCcyid') ? getValueByKey(item.ccyid, 'applyCcyid') : item.ccyid
        }
        // 先开票查询关联的开票信息
        if (vm.submitInfo.fintAppM.billFlag === '2') {
          getBusinessInvoiceApp()
        }
      })
    },
    () => {
      loading.value = false
    }
  )
}
// 业务产品
const getProduceType = (bizScene: string, productType: string) => {
  const bizSceneName = getValueByKey(bizScene, 'intBizScene')
  return bizSceneName ? `${bizSceneName}-${productType}` : productType
}
let firstEntryFlag = true
onShow(() => {
  if (firstEntryFlag) {
    removeStorage('application-buyerInfo')
    // 路由带参
    if (route.value.params) {
      refcode = decodeBase64(route.value.params.refcode) // 申请书编号，临时保存后存在
    }
    getApplicationInfo()
    firstEntryFlag = false
  }
})
</script>

<style lang="scss" scoped>
.main {
  background: #fff;
  margin-bottom: 20rpx;
  position: relative;
}
.apply-tip-container {
  position: relative;
  background: #fff;
  padding-top: 70rpx;
}
.returnReason {
  min-height: 20rpx;
  padding: 48rpx 50rpx 0 30rpx;
  font-size: 28rpx;
  .reasonValue {
    color: $danger;
    word-break: break-all;
    & :first-child {
      word-break: break-all;
    }
  }
}
.application-application-apply {
  padding: 0;
  .internation-info-group {
    :deep(.u-cell-group) {
      padding-top: 0;
      margin: 0;
      .iconfont,
      .u-icon__icon {
        color: $remark-color !important;
      }
      .u-form-item__body__right__content__slot {
        justify-content: flex-end;
      }
      .u-cell__body {
        align-items: flex-start;
        .u-cell__value {
          overflow: hidden;
          white-space: pre-wrap;
        }
      }
    }
  }
  .u-cell.margin-10 {
    margin-bottom: -14rpx;
  }
  .upload-file-list {
    display: flex;
    justify-content: space-between;
    // padding-top: 20rpx;
    margin-bottom: 20rpx;
    #iconfont.icon-xiazai {
      color: $primary !important;
    }
    &:last-of-type {
      margin-bottom: 34rpx;
    }
  }
  .buyerList-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 8rpx;
    padding: 34rpx 0 34rpx 0rpx;
    margin-bottom: 30rpx;
    &:first-of-type {
      margin-top: 2px;
    }
    &:last-of-type {
      margin-bottom: 40rpx;
    }
    .orgname {
      width: 470rpx;
      color: $default-color;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .clStatus {
      color: $u-warning;
    }
    .clStatus2297 {
      color: $u-error !important;
    }
    .clStatus9899 {
      color: $u-success !important;
    }
  }

  .accountTitle {
    margin-top: 12rpx;
    color: $default-color;
    margin-bottom: 34rpx;
    font-weight: bold;
    font-size: 28rpx;
  }
}
.condition {
  line-height: 40rpx;
  margin-bottom: 30rpx;
  .condition-item {
    span {
      word-break: break-all !important;
    }
  }
  .condition-orgname {
    color: #666666;
  }
}
.billInfo-card {
  overflow: visible;
}
:deep(.u-sticky) {
  top: 44px !important;
  z-index: 2 !important;
  .stateModule {
    z-index: 3;
  }
  .topCell {
    padding-top: 70rpx;
  }
}
</style>
