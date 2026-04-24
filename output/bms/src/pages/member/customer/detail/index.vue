<!--
 * @Author       : longcan.Yang
 * @Date         : 2022-10-11 09:53:13
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-18 13:59:54
 * @Description  : 我的客户详情 /member/customer/detail
-->
<template>
  <NavBar />
  <view class="member-customer-detail">
    <view>
      <CompanyInfo :company-info="companyData" source="detail" />
    </view>
    <view class="moduleDetail">
      <!-- 融资进度 -->
      <ApprovalProcess :refcode="companyData.refcode" />
      <!-- 认证进度 -->
      <IdentificationProcess :refcode="companyData.refcode" :auth-status="companyData.authStatus" :sig-status="companyData.sigStatus" />
      <!-- 收集资料进度 -->
      <BusinessMaterial :refcode="companyData.refcode" :orgname="companyData.orgname"></BusinessMaterial>
      <!-- 签约进度 -->
      <SignProcess :refcode="companyData.refcode" />
      <!--额度概况 -->
      <QuotaOverview :refcode="companyData.refcode" />
      <!-- 资产统计 -->
      <AssetStatistics :refcode="companyData.refcode" />
      <!-- 项目统计 -->
      <ProjectStatistics :refcode="companyData.refcode" />
    </view>
    <view v-if="companyData.customType === '3'" class="button-fixed-bottom">
      <view class="placeholder"></view>
      <view class="fixed">
        <u-button block type="primary" @click="gotoInvited">{{ companyData.entryInvitationStatus === '2' ? '再次邀请' : '邀请入驻' }}</u-button>
      </view>
    </view>
  </view>
</template>
<script lang="ts">
export default {
  name: 'CustomerDetail',
  options: {
    styleIsolation: 'shared' // 解除样式隔离
  }
}
</script>
<script lang="ts" setup>
import NavBar from '@/layout/NavBar.vue'
import { decodeBase64, encodeBase64 } from '@/utils/crypto'
import CompanyInfo from '../components/CompanyInfo.vue'
import ApprovalProcess from '../approvalProcess/index.vue'
import AssetStatistics from '../assetStatistics/index.vue'
import IdentificationProcess from '../identificationProcess/index.vue'
import ProjectStatistics from '../projectStatistics/index.vue'
import SignProcess from '../signProcess/index.vue'
import QuotaOverview from '../quotaOverview/index.vue'
import BusinessMaterial from '../businessMaterial/index.vue'
import apiCustormer from '@/api/member/api.custormer'
import { CustomerInfo } from '@/interfaces/member/customer'
import { useRoute, useRouter } from '@/uni-simple-router'
// import { Detail } from '@/interfaces/member/customer/identificationProcess'
const route = useRoute()
const router = useRouter()
type TempInfo = {
  sigStatus: string
  registOrgname: string
}
let companyData = reactive<CustomerInfo & TempInfo>({
  refcode: Number(decodeBase64(route.value.params.refcode as string)), // 客户流水号,
  orgname: '',
  customType: '',
  managementScale: '',
  oaIndustry: '',
  authStatus: '',
  entryInvitationStatus: '',
  sigStatus: '',
  registOrgname: ''
})

const getCustomAuthInfo = () => {
  apiCustormer.getCustomAuthInfo(companyData.refcode).then(res => {
    companyData.orgname = res.data.fbpaOrgMVo.orgname
    companyData.authStatus = res.data.fbpaOrgMVo.authStatus
    companyData.customType = res.data.fbpaOrgMVo.customType
    companyData.managementScale = res.data.fbpaOrgMVo.managementScale
    companyData.sigStatus = res.data.fbpaOrgMVo.sigStatus
    companyData.oaIndustry = res.data.fbpaOrgMVo.oaIndustry
    companyData.entryInvitationStatus = res.data.fbpaOrgMVo.entryInvitationStatus
    companyData.registOrgname = res.data.fbpaOrgMVo.registOrgname || ''
  })
}

const gotoInvited = () => {
  router.push(`/member/customer/invited/${encodeBase64(companyData.refcode)}`)
}

onBeforeMount(() => {
  getCustomAuthInfo()
})
</script>
<style lang="scss" scoped>
.member-customer-detail {
  padding-bottom: 40rpx;
  .companyInfoBox {
    border-bottom: none;
  }
  .moduleDetail {
    margin-top: 5rpx;
    :deep(.operationContainer) {
      margin: 28rpx 0 0;
      border-radius: 5rpx;
      .operation {
        display: flex;
        justify-content: flex-start;
        font-size: 28rpx;
        font-weight: 700;

        .button {
          margin-left: auto;
          cover-image {
            width: 22rpx;
            height: 15rpx;
          }
        }
      }
    }
  }
}
:deep(.autherized) {
  font-size: 24rpx;
  background-color: #ebf0ff;
  color: #437fff;
  margin: auto 10rpx;
  padding: 2px 5px;
  border-radius: 16rpx 16rpx 16rpx 0;
  position: relative;
  top: -10rpx;
  font-weight: 700;
}
:deep(.operationName) {
  display: flex;
  position: relative;
  margin-top: 15rpx;
  .u-badge {
    background-color: #ebf0ff;
    color: #437fff;
    font-size: 24rpx;
    border-radius: 16rpx 16rpx 16rpx 0;
  }
}
:deep(.u-empty) {
  padding-top: 0;
}
</style>
