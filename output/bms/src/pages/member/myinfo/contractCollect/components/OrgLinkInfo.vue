<!--
 * @Author       : LongCan.Yang
 * @Date         : 2023-11-23 18:52:19
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-03-03 17:31:25
 * @Description  : 签约信息收集-融资企业贸易阶段联系人
-->

<template>
  <view>
    <ty-info-card title="融资企业贸易阶段联系人">
      <u-form label-width="50%">
        <u-form-item label="联系人名称" required>
          <u-input v-model="vm.loanOrgTransferLinkInfo.tradePerson" placeholder="请输入联系人名称" maxlength="30"></u-input>
        </u-form-item>
        <u-form-item label="联系电话" required>
          <u-input v-model="vm.loanOrgTransferLinkInfo.tradeTel" placeholder="请输入联系电话" maxlength="11" />
        </u-form-item>
        <u-form-item label="联系邮箱" required>
          <u-input v-model="vm.loanOrgTransferLinkInfo.tradeEmail" placeholder="请输入联系邮箱" maxlength="50" />
        </u-form-item>
        <u-form-item label="微信号">
          <u-input v-model="vm.loanOrgTransferLinkInfo.tradeWechatNo" placeholder="请输入微信号" maxlength="30" />
        </u-form-item>
      </u-form>
    </ty-info-card>
  </view>
</template>
<script lang="ts">
export default {
  name: 'OrgLinkInfo'
}
</script>
<script setup lang="ts">
import { LoanOrgTransferLinkInfo } from '@/interfaces/member/myinfo/contractCollect'
import apiSignInfo from '@/api/member/api.signInfo'
import { getStorage, setStorage } from '@/utils/storages'
import { onShow, onHide } from '@dcloudio/uni-app'
import { onBeforeRouteLeave } from '@/uni-simple-router'
let hideSetFlag = true // onHide事件是否需要缓存数据
// 融资企业贸易阶段联系人
const loanOrgTransferLinkInfo: LoanOrgTransferLinkInfo = {
  tradeEmail: '',
  tradePerson: '',
  tradeTel: '',
  tradeWechatNo: ''
}
const vm = reactive({
  loanOrgTransferLinkInfo: loanOrgTransferLinkInfo
})
const props = defineProps({
  /**
   * 合同制作流水号
   */
  refcode: {
    type: Number,
    default: 0,
    required: true
  }
})
/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-23 10:21:34
 * @return {*}
 * @description: 查询融资企业贸易阶段联系人信息
 */
const getLoanOrgTransferLinkInfo = () => {
  apiSignInfo.getLoanOrgTransferLinkInfo({ refcode: props.refcode }).then(res => {
    vm.loanOrgTransferLinkInfo = res.data.loanOrgTransferLinkInfo
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-23 19:21:10
 * @return {*}
 * @description: 返回所有数据
 */
const getData = () => {
  return vm.loanOrgTransferLinkInfo
}
onShow(() => {
  if (getStorage('loanOrgTransferLinkInfo')) {
    vm.loanOrgTransferLinkInfo = getStorage('loanOrgTransferLinkInfo') as LoanOrgTransferLinkInfo
  } else {
    getLoanOrgTransferLinkInfo()
  }
})
onHide(() => {
  if (hideSetFlag) {
    setStorage('loanOrgTransferLinkInfo', vm.loanOrgTransferLinkInfo)
  }
})
/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-24 15:09:51
 * @return {*}
 * @description: 前往子页面补录信息，缓存数据
 */
onBeforeRouteLeave((to, from) => {
  if (
    to.name === 'MyinfoContractCollectCounterParty' ||
    to.name === 'MyinfoContractCollectSuretyEnterprise' ||
    to.name === 'MyinfoContractCollectSuretyPerson' ||
    to.name === 'MyinfoContractCollectActualBuyerInfo' ||
    to.name === 'FinFirmCollectCounterParty' ||
    to.name === 'FinFirmCollectSuretyEnterprise' ||
    to.name === 'FinFirmCollectSuretyPerson' ||
    to.name === 'FinFirmCollectActualBuyerInfo'
  ) {
    setStorage('loanOrgTransferLinkInfo', vm.loanOrgTransferLinkInfo)
  } else {
    hideSetFlag = false
  }
})
// 暴露方法
defineExpose({
  getData,
  getLoanOrgTransferLinkInfo
})
</script>

<style lang="scss" scoped></style>
