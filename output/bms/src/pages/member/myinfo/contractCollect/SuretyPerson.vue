<!--
 * @Author       : longcan.Yang
 * @Date         : 2023-01-09 15:26:46
 * @LastEditors  : ran.zhu
 * @LastEditTime : 2024-02-20 18:30:06
 * @Description  :  补充连带保证人信息 /member/myinfo/contractCollect/suretyPerson
-->

<template>
  <NavBar />
  <view class="bigBox">
    <view class="detail">
      <u-form label-width="50%">
        <u-form-item label="连带保证人">
          <u-input v-model="vm.suretyPersonObj.guaName" maxlength="30" readonly placeholder="请输入连带保证人" />
        </u-form-item>
        <u-form-item label="连带保证人电话" required>
          <u-input v-model="vm.suretyPersonObj.guaTel" label="连带保证人电话" maxlength="11" placeholder="请输入连带保证人电话" type="digit" />
        </u-form-item>
        <u-form-item label="连带保证人身份证号" required>
          <u-input v-model="vm.suretyPersonObj.guaIdNo" maxlength="18" placeholder="请输入连带保证人身份号" />
        </u-form-item>
        <u-form-item label="连带保证人身份证地址" required>
          <u-input v-model="vm.suretyPersonObj.guaAddress" maxlength="180" placeholder="请输入连带保证人地址" />
        </u-form-item>
        <u-form-item label="银行账号">
          <u-input v-model="vm.suretyPersonObj.guaAccountNo" maxlength="32" placeholder="请输入银行账号" />
        </u-form-item>
        <u-form-item label="开户行">
          <u-input v-model="vm.suretyPersonObj.guaBankName" maxlength="90" placeholder="请输入开户行" />
        </u-form-item>
      </u-form>
    </view>
    <view class="button-fixed-bottom">
      <view class="placeholder"></view>
      <view class="fixed">
        <u-button class="submitBtn" block type="primary" native-type="submit" :loading="loading" @click="submitBtn">确定</u-button>
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
  name: 'MyinfoContractCollectSuretyPerson'
}
</script>
<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import { checkIDCard, checkMobile } from '@/utils/validate'
import { setStorage, getStorage, removeStorage } from '@/utils/storages'
import apiSignInfo from '@/api/member/api.signInfo'
import {
  GatherInfo,
  LoanOrgInfo,
  LoanOrgTransferLinkInfo,
  FconScmVo,
  FconDtcMListObj,
  GuarantorEnterpriseInfo
} from '@/interfaces/member/myinfo/contractCollect'
import { decodeBase64 } from '@/utils/crypto'
import { useRoute, useRouter } from '@/uni-simple-router'
import { showToast } from '@/utils/uniapp/toast'
import wx from 'jweixin-1.6.0'
import { getPlatform } from '@/utils/uniapp'
// import { onShow } from '@dcloudio/uni-app'
const router = useRouter()
const route = useRoute()
const loading = ref(false)
let refcode = Number(decodeBase64(route.value.params.refcode as string)) //连带保证人流水号
let tipInfo = ref('')
const dialogShow = ref(false)
let suretyPersonObj: GuarantorEnterpriseInfo = {
  refcode: 0,
  guaName: '',
  guaAccountNo: '',
  guaAddress: '',
  guaBankName: '',
  guaCompanyAddress: '',
  guaCompanyBusAddress: '',
  guaCompanyEmail: '',
  guaCompanyLinkman: '',
  guaCompanyTel: '',
  guaIdNo: '',
  guaTel: ''
}
let suretyPersonList = [] as Array<GuarantorEnterpriseInfo>
const vm = reactive({
  suretyPersonObj: suretyPersonObj
})
// onShow(() => {
//   suretyPersonList = getStorage('suretyPersonList') as Array<GuarantorEnterpriseInfo>
//   suretyPersonList.forEach(item => {
//     if (refcode === item.refcode) {
//       vm.suretyPersonObj = item
//     }
//   })
// })
onMounted(() => {
  suretyPersonList = getStorage('suretyPersonList') as Array<GuarantorEnterpriseInfo>
  suretyPersonList.forEach(item => {
    if (refcode === item.refcode) {
      vm.suretyPersonObj = item
    }
  })
  if (getPlatform() === 'H5') {
    // #ifdef H5
    wx.hideAllNonBaseMenuItem()
    // #endif
  }
})
const submitBtn = (): void => {
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
        if (gatherInfo.verifySign === 0) {
          if (!vm.suretyPersonObj.guaTel) {
            showToast('请输入连带保证人电话')
            return
          }
          if (!checkMobile(vm.suretyPersonObj.guaTel)) {
            showToast('请输入正确的连带保证人电话')
            return
          }
          if (!vm.suretyPersonObj.guaIdNo) {
            showToast('请输入连带保证人身份证号')
            return
          }
          if (!checkIDCard(vm.suretyPersonObj.guaIdNo)) {
            showToast('请输入正确的身份证号码')
            return
          }
          if (!vm.suretyPersonObj.guaAddress) {
            showToast('请输入连带保证人身份证地址')
            return
          }
        }
        suretyPersonList.forEach((item, i) => {
          if (refcode === item.refcode) {
            suretyPersonList[i] = vm.suretyPersonObj
          }
        })
        setStorage('suretyPersonList', suretyPersonList)
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
  // padding: 0 30rpx;
  .detail {
    // margin: 0 30rpx 85rpx 30rpx;
    padding: 40rpx 30rpx 540rpx;
    // border-radius: 5rpx;
    // box-shadow: 0 0 8rpx 3rpx rgba(0, 0, 0, 0.1);
    :deep(.u-input) {
      .u-input__label {
        width: 50%;
      }
    }
    // :deep(.u-cell:after) {
    //   content: 'target-after';
    //   color: #33b5e5;
    //   position: absolute;
    // }
  }
}
.warmPrompt {
  padding: 0 30rpx;
}
</style>
