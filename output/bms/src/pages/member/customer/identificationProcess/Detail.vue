<!--
 * @Author       : jacky.cai
 * @Date         : 2022-10-12 17:22:23
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-12-18 10:20:45
 * @Description  : 认证详情 /member/customer/identificationProcess/detail
-->
<template>
  <NavBar />
  <up-sticky z-index="2" bg-color="#fff">
    <state-module v-if="!isEmpty(vm.self.sigStatus) || !isEmpty(vm.self.sigStatus)" :state-name="vm.picName" :state-color="vm.color"></state-module>
  </up-sticky>
  <!-- <view><cover-image class="statusImg" :src="vm.PicUrl" :alt="vm.picName" /></view> -->
  <view class="view-content">
    <u-row>
      <view class="center-vertical-bottom">
        <view class="main-title">基本信息</view>
        <view class="main-gray">来源于OA</view>
      </view>
    </u-row>
    <u-cell-group inset>
      <view class="item-title">
        <u-cell title="客户名称" :value="vm.self.orgname" />
        <u-cell title="描述" :value="vm.self.orgDesc" />
        <u-cell title="规模" :value="vm.self.managementScale" />
        <u-cell title="行业" :value="vm.self.oaIndustry" />
        <u-cell title="地址" :value="vm.self.oaAddress" />
        <u-cell title="联系人姓名" :value="vm.self.oaLinkman" />
        <u-cell title="联系人电话" :value="vm.self.oaLinkmanphone" />
      </view>
    </u-cell-group>
    <view v-show="vm.self.customType == '1'">
      <view class="line"></view>
      <u-row>
        <view class="center-vertical-bottom">
          <view class="main-title">认证信息</view>
          <view class="main-gray">来源于融逸金链</view>
        </view>
      </u-row>
      <u-cell-group inset>
        <view class="item-title">
          <u-cell v-if="isNotEmpty(vm.self.registOrgname)" title="企业名称" :value="vm.self.registOrgname" />
          <u-cell title="统一社会信用代码" :value="vm.self.companyCreditCode" />
          <u-cell title="法定代表人" :value="vm.self.legalPerson" />
          <u-cell title="详细地址">
            <template #value>
              <text class="u-cell__value">{{ handleAddress() }}</text>
            </template>
          </u-cell>
          <u-cell title="被授权人姓名" :value="vm.self.linkman" />
          <u-cell title="被授权人手机号码" :value="vm.self.linkmanphone" />
          <u-cell title="申请认证日期" :value="vm.self.applyDate ? dateFormat(vm.self.applyDate, 1) : ''" />
          <u-cell title="认证审核日期" :value="vm.self.reviewDate ? dateFormat(vm.self.reviewDate, 1) : ''" />
        </view>
      </u-cell-group>
    </view>
  </view>
</template>
<script lang="ts">
export default {
  name: 'IdentificationDetail',
  options: {
    styleIsolation: 'shared' // 解除样式隔离
  }
}
</script>
<script lang="ts" setup>
import NavBar from '@/layout/NavBar.vue'
import StateModule from '@/plugins/StateModule.vue'
import { getInareaByCode } from '@/utils/constant'
import unregistered from '@/assets/member/customer/unregistered.png'
import registered from '@/assets/member/customer/registered.png'
import underCertification from '@/assets/member/customer/under_certification.png'
import certified from '@/assets/member/customer/certified.png'
import preparedCertificate from '@/assets/member/customer/prepared_certificate.png'
import sent from '@/assets/member/customer/sent.png'
import signedIn from '@/assets/member/customer/signed_in.png'
import { Detail } from '@/interfaces/member/customer/identificationProcess'
import apiCustormer from '@/api/member/api.custormer'
import { decodeBase64 } from '@/utils/crypto'
import { dateFormat } from '@/utils/format'
import { useRoute } from '@/uni-simple-router'
import { isEmpty, isNotEmpty } from '@/utils/validate'
type Color = 'success' | 'warning' | 'error' | 'primary'
const detail: Detail = {
  customType: '',
  orgname: '',
  orgDesc: '',
  managementScale: '',
  oaIndustry: '',
  oaOrgtype: '',
  oaAddress: '',
  oaLinkman: '',
  oaLinkmanphone: '',
  authStatus: '',
  linkman: '',
  linkmanphone: '',
  sigStatus: '',
  inarea: '',
  linkmanemail: '',
  entryInvitationStatus: '',
  entryInvitationEmail: '',
  authOrgtype: '',
  region: '',
  registeredAddress: '',
  registOrgname: ''
}
const authenticationNode = {
  0: '未注册',
  1: '已注册',
  2: '认证中',
  3: '认证中',
  8: '已实名',
  9: '已实名'
}
const authenticationColor = {
  0: 'warning',
  1: 'success',
  2: 'success',
  3: 'success',
  8: 'success',
  9: 'success'
}
const authenticationNodePic = {
  0: unregistered,
  1: registered,
  2: underCertification,
  3: underCertification,
  8: certified,
  9: certified
}
const sigStatusNode = {
  2: '已制证',
  3: '已寄送',
  4: '已签收'
}
const sigStatusColor = {
  2: 'success',
  3: 'success',
  4: 'success'
}
const sigStatusNodePic = {
  2: preparedCertificate,
  3: sent,
  4: signedIn
}
let vm = reactive({
  self: detail,
  picName: '',
  PicUrl: '',
  color: '' as Color
})
// 获取列表页面通过路由传过来的refcode
let route = useRoute()
let refcode = Number(decodeBase64(String(route.value.params.refcode)))

/**
 * @Author: FangFang.Wu
 * @Date: 2023-07-25 17:46:40
 * @return {*}
 * @description: 处理详细地址
 */
const handleAddress = () => {
  if (vm.self.authOrgtype === '9') {
    return `${vm.self.region} ${vm.self.registeredAddress}`
  }
  return getInareaByCode(vm.self.inarea) + vm.self.address
}

// let refcode = Number(route.params.refcode)
onMounted(() => {
  apiCustormer.getCustomAuthInfo(refcode).then(res => {
    if (res.data) {
      // authStatus=8时为绑定ukey此时仅显示已认证
      vm.self = res.data.fbpaOrgMVo
      vm.self.registOrgname = vm.self.registOrgname || ''
      if (Number(vm.self.sigStatus) >= 2 && Number(vm.self.authStatus) !== 8) {
        vm.picName = sigStatusNode[Number(vm.self.sigStatus)]
        vm.PicUrl = sigStatusNodePic[Number(vm.self.sigStatus)]
        vm.color = sigStatusColor[Number(vm.self.sigStatus)] as Color
      } else {
        vm.picName = authenticationNode[Number(vm.self.authStatus)]
        vm.PicUrl = authenticationNodePic[Number(vm.self.authStatus)]
        vm.color = authenticationColor[Number(vm.self.authStatus)] as Color
      }
    }
  })
})
</script>
<style lang="scss" scoped>
// :deep(.u-row) {
//   background: #f4f3f8;
// }
.center-vertical-bottom {
  margin: $spaced $spaced 10rpx;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  height: fit-content;
  .main-title {
    font-size: 28rpx;
    font-weight: 700;
    color: $default-color;
  }
  .main-gray {
    color: $remark-color;
    font-size: 24rpx;
    margin-left: 20rpx;
  }
}
:deep(.u-cell .u-cell__body__content) {
  width: 40%;
}
.line {
  background: #f6f6f6;
  width: 100%;
  height: 20rpx;
}
.orgname {
  padding-left: 20rpx;
}
</style>
