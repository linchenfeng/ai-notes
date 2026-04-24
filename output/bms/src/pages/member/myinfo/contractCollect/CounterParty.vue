<!--
 * @Author       : longcan.Yang
 * @Date         : 2023-01-09 15:25:29
 * @LastEditors  : Charon.Lin
 * @LastEditTime : 2025-03-12 16:11:06
 * @Description  : 补充买方企业信息 /member/myinfo/contractCollect/counterParty/:refcode
-->
<template>
  <NavBar />
  <view class="bigBox">
    <view class="detail">
      <u-form label-width="55%">
        <u-form-item label="买方企业名称">
          <u-input v-model="vm.fconDtcMListObj.buyerName" readonly placeholder="请输入买方企业名称" maxlength="450" />
        </u-form-item>
        <u-form-item :label="bussType === 5 ? '企业登记证件号/注册编号' : '统一社会信用代码'" required>
          <u-input
            v-model="vm.fconDtcMListObj.buyerCreditCode"
            :placeholder="`请输入${bussType === 5 ? '企业登记证件号/注册编号' : '统一社会信用代码'}`"
            maxlength="18"
          />
        </u-form-item>
        <u-form-item label="联系人名称" :required="bussType !== 5">
          <u-input v-model="vm.fconDtcMListObj.linkman" label="联系人名称" placeholder="请输入联系人名称" maxlength="30" />
        </u-form-item>
        <u-form-item v-if="bussType !== 5" label="联系电话" required>
          <u-input v-model="vm.fconDtcMListObj.linkmanPhone" placeholder="请输入联系电话" maxlength="20" />
        </u-form-item>
        <u-form-item label="联系邮箱" required>
          <u-input v-model="vm.fconDtcMListObj.linkmanEmail" placeholder="请输入联系邮箱" maxlength="50" />
        </u-form-item>
        <u-form-item label="联系地址" required>
          <u-input v-model="vm.fconDtcMListObj.contactAddress" placeholder="请输入联系地址" maxlength="180" />
        </u-form-item>
        <u-form-item v-if="bussType !== 5" label="传真">
          <u-input v-model="vm.fconDtcMListObj.fax" placeholder="请输入传真" maxlength="20" />
        </u-form-item>
      </u-form>
    </view>
    <view class="button-fixed-bottom">
      <view class="placeholder"></view>
      <view class="fixed">
        <u-button class="submitBtn" block type="primary" native-type="submit" :loading="loading" @click="doSubmit">确定</u-button>
      </view>
    </view>
  </view>

  <u-modal
    :show="dialogShow"
    title="温馨提示"
    cancel-text="取消"
    confirm-text="立即更新"
    show-cancel-button
    @confirm="toUpdate"
    @cancel="dialogShow = false"
  >
    <view class="warmPrompt">{{ tipInfo }}</view>
  </u-modal>
</template>
<script lang="ts">
export default {
  name: 'MyinfoContractCollectCounterParty'
}
</script>
<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import { setStorage, getStorage, removeStorage } from '@/utils/storages'
import {
  GatherInfo,
  LoanOrgInfo,
  LoanOrgTransferLinkInfo,
  FconScmVo,
  FconDtcMListObj,
  GuarantorEnterpriseInfo
} from '@/interfaces/member/myinfo/contractCollect'
import { decodeBase64 } from '@/utils/crypto'
import { checkEmail, checkMobile } from '@/utils/validate'
import apiSignInfo from '@/api/member/api.signInfo'
import { useRoute, useRouter } from '@/uni-simple-router'
import { showToast } from '@/utils/uniapp/toast'
// import { onShow } from '@dcloudio/uni-app'
import wx from 'jweixin-1.6.0'
import { getPlatform } from '@/utils/uniapp'
const router = useRouter()
const route = useRoute()
const loading = ref(false)
const dialogShow = ref(false)
let refcode = Number(decodeBase64(route.value.params.refcode as string)) //买方企业流水号
const bussType = Number(decodeBase64(route.value.params.bussType as string)) // 业务大类
let tipInfo = ref('')
let fconDtcMListObj: FconDtcMListObj = {
  refcode: 0,
  buyerCreditCode: '',
  buyerName: '',
  contactAddress: '',
  fax: '',
  linkman: '',
  linkmanEmail: '',
  linkmanPhone: ''
}
let buyerInfoList = [] as Array<FconDtcMListObj>
const vm = reactive({
  fconDtcMListObj: fconDtcMListObj
})
// onShow(() => {
//   buyerInfoList = getStorage('buyerInfoList') as Array<FconDtcMListObj>
//   buyerInfoList.forEach(item => {
//     if (item.refcode === refcode) {
//       vm.fconDtcMListObj = item
//     }
//   })
// })
onMounted(() => {
  buyerInfoList = getStorage('buyerInfoList') as Array<FconDtcMListObj>
  buyerInfoList.forEach(item => {
    if (item.refcode === refcode) {
      vm.fconDtcMListObj = item
    }
  })
  if (getPlatform() === 'H5') {
    // #ifdef H5
    wx.hideAllNonBaseMenuItem()
    // #endif
  }
})
const doSubmit = (): void => {
  const loanOrgInfo = getStorage('loanOrgInfo') as LoanOrgInfo
  const fconScmVo = getStorage('fconScmVo') as FconScmVo
  const buyerInfoList = getStorage('buyerInfoList') as Array<FconDtcMListObj>
  const orgLinkInfo = getStorage('loanOrgTransferLinkInfo') as LoanOrgTransferLinkInfo
  const suretyEnterpriseList = getStorage('suretyEnterpriseList') as Array<GuarantorEnterpriseInfo>
  const suretyPersonList = getStorage('suretyPersonList') as Array<GuarantorEnterpriseInfo>
  const gatherInfo: GatherInfo = {
    ...loanOrgInfo,
    tradeEmail: orgLinkInfo ? orgLinkInfo.tradeEmail : '',
    tradePerson: orgLinkInfo ? orgLinkInfo.tradePerson : '',
    tradeTel: orgLinkInfo ? orgLinkInfo.tradeTel : '',
    tradeWechatNo: orgLinkInfo ? orgLinkInfo.tradeWechatNo : '',
    fconDtcMList: buyerInfoList,
    fconScmVo: fconScmVo,
    loanOrgTransferLinkInfo: orgLinkInfo,
    suretyEnterpriseList: suretyEnterpriseList,
    suretyPersonList: suretyPersonList
  }
  loading.value = true
  apiSignInfo
    .doCheckMakingContractInfo(gatherInfo)
    .then(res => {
      loading.value = false
      if (res.data.result === '1') {
        tipInfo.value = res.data.tipInfo
        dialogShow.value = true
      } else {
        // 融资企业无需校验
        if (gatherInfo.verifySign === 0) {
          if (bussType !== 5 && !vm.fconDtcMListObj.buyerCreditCode) {
            showToast('请输入统一社会信用代码')
            return
          }
          if (bussType === 5 && !vm.fconDtcMListObj.buyerCreditCode) {
            showToast('请输入企业登记证件号/注册编号')
            return
          }
          if (bussType !== 5 && vm.fconDtcMListObj.buyerCreditCode && vm.fconDtcMListObj.buyerCreditCode.length < 18) {
            showToast('统一社会信用代码必须18位')
            return
          }
          // 非国际保理业务联系人必填
          if (bussType !== 5 && !vm.fconDtcMListObj.linkman) {
            showToast('请输入联系人名称')
            return
          }
          if (bussType !== 5 && !vm.fconDtcMListObj.linkmanPhone) {
            showToast('请输入联系电话')
            return
          }
          if (bussType !== 5 && vm.fconDtcMListObj.linkmanPhone && !checkMobile(vm.fconDtcMListObj.linkmanPhone)) {
            showToast('请输入正确的联系电话')
            return
          }
          if (!vm.fconDtcMListObj.linkmanEmail) {
            showToast('请输入联系邮箱')
            return
          }
          if (vm.fconDtcMListObj.linkmanEmail && !checkEmail(vm.fconDtcMListObj.linkmanEmail)) {
            showToast('请输入正确的联系邮箱')
            return
          }
          if (!vm.fconDtcMListObj.contactAddress) {
            showToast('请输入联系地址')
            return
          }
        }
        buyerInfoList.forEach((item, i) => {
          if (refcode === item.refcode) {
            buyerInfoList[i] = vm.fconDtcMListObj
          }
        })
        setStorage('buyerInfoList', buyerInfoList)
        router.back(1)
      }
    })
    .catch(() => {
      loading.value = false
    })
}
/**
 * @Author: longcan.Yang
 * @Date: 2023-01-11 13:27:44
 * @param {*} void
 * @return {*}
 * @description: 更新数据,保留企业基本信息数据，重置买方企业，连带保证公司，连带保证人数据
 */
const toUpdate = (): void => {
  removeStorage('loanOrgTransferLinkInfo')
  removeStorage('fconScmVo')
  removeStorage('buyerInfoList')
  removeStorage('suretyEnterpriseList')
  removeStorage('suretyPersonList')
  router.back(1)
}
</script>

<style lang="scss" scoped>
.bigBox {
  .detail {
    padding: 40rpx 30rpx 40rpx;
    border-radius: 5rpx;
    :deep(.u-input) {
      .u-input__label {
        width: 40%;
      }
    }
  }
}
.warmPrompt {
  padding: 0 30rpx;
}
</style>
