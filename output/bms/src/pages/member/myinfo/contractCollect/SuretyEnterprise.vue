<!--
 * @Author       : longcan.Yang
 * @Date         : 2023-01-09 15:26:28
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2024-12-16 09:44:28
 * @Description  : 补充连带保证公司信息 /member/myinfo/contractCollect/suretyEnterprise
-->

<template>
  <NavBar />
  <view class="bigBox">
    <view class="detail">
      <u-form label-width="40%">
        <u-form-item label="连带保证公司名称">
          <u-input v-model="vm.suretyEnterpriseObj.guaName" readonly maxlength="200" placeholder="请输入公司账号" />
        </u-form-item>
        <view class="textRecognition" @click="textRecognition">
          <cover-image src="@/assets/member/myinfo/discernIcon.png" alt="识别" />
          <text class="text">文本智能识别</text>
        </view>
        <u-form-item label="公司账号" required>
          <u-input v-model="vm.suretyEnterpriseObj.guaAccountNo" maxlength="32" placeholder="请输入公司账号" />
        </u-form-item>
        <u-form-item label="公司开户行" required>
          <u-input v-model="vm.suretyEnterpriseObj.guaBankName" maxlength="90" placeholder="请输入公司开户行" />
        </u-form-item>
        <u-form-item label="经营地址" required>
          <u-input v-model="vm.suretyEnterpriseObj.guaCompanyBusAddress" maxlength="180" placeholder="请输入经营地址" />
        </u-form-item>
        <u-form-item label="联系人名称">
          <u-input v-model="vm.suretyEnterpriseObj.guaCompanyLinkman" maxlength="20" placeholder="请输入联系人名称" />
        </u-form-item>
        <u-form-item label="联系电话">
          <u-input v-model="vm.suretyEnterpriseObj.guaCompanyTel" maxlength="11" placeholder="请输入联系电话" />
        </u-form-item>
        <u-form-item label="联系邮箱">
          <u-input v-model="vm.suretyEnterpriseObj.guaCompanyEmail" maxlength="50" placeholder="请输入联系邮箱" />
        </u-form-item>
        <u-form-item label="联系地址">
          <u-input v-model="vm.suretyEnterpriseObj.guaCompanyAddress" maxlength="180" placeholder="请输入联系地址" />
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
    mode="center"
    :round="10"
    :class="dialogType === '2' ? '' : 'recognitionDialog'"
    cancel-text="取消"
    :confirm-text="dialogType === '1' ? '识别' : dialogType === '2' ? '立即更新' : '确定'"
    :show-cancel-button="!['1', '3'].includes(dialogType)"
    :show-confirm-button="showConfirmButton"
    @cancel="cancel"
    @confirm="modalConfirm"
  >
    <view class="slot-content">
      <view class="title">
        <view class="iconfont"><i v-if="['1', '3'].includes(dialogType)" class="iconfont icon-guanbi2" @click="cancel"></i></view>
        <view>{{ dialogType === '2' ? '温馨提示' : '文本粘贴识别' }}</view>
      </view>
      <!-- dialogType【1=文本识别/3=文本识别完确定/2=数据更新提示】 -->
      <view v-if="['1', '3'].includes(dialogType)" class="importText">
        <view class="fieldBox">
          <u-textarea
            v-model="message"
            :confirm-type="null"
            :placeholder-style="{ 'font-size': '24rpx' }"
            placeholder="识别文本信息，并将业务要素自动拆分至下方连带保证公司信息栏位，示例： 账号：6225099994 开户行：中国银行重庆分行 经营地址：XX省XX市XX区XX街道XX号 联系人：张三 电话：159XXXX6299 邮箱：XXX@163.com 联系地址：XX省XX市XX区XX街道XX号"
            @change="updateValue()"
          ></u-textarea>
          <view class="iconfontBox"><i v-if="message" class="iconfont icon-guanbi" @click="delMessage"></i></view>
        </view>
        <view v-if="dialogType === '3'" class="recognizeResult">
          <u-form label-width="45%">
            <u-form-item label="公司账号" required>
              <u-input v-model="recognizeResult.jointAccount" maxlength="32" placeholder="请输入公司账号" />
            </u-form-item>
            <u-form-item label="公司开户行" required>
              <u-input v-model="recognizeResult.jointBank" maxlength="90" placeholder="请输入公司开户行" />
            </u-form-item>
            <u-form-item label="经营地址" required>
              <u-input v-model="recognizeResult.jointBusinessAddress" maxlength="180" placeholder="请输入经营地址" />
            </u-form-item>
            <u-form-item label="联系人名称">
              <u-input v-model="recognizeResult.jointUsername" maxlength="20" placeholder="请输入联系人名称" />
            </u-form-item>
            <u-form-item label="联系电话">
              <u-input v-model="recognizeResult.jointTel" maxlength="11" placeholder="请输入联系电话" />
            </u-form-item>
            <u-form-item label="联系邮箱">
              <u-input v-model="recognizeResult.jointEmail" maxlength="50" placeholder="请输入联系邮箱" />
            </u-form-item>
            <u-form-item label="联系地址">
              <u-input v-model="recognizeResult.jointContactAccount" maxlength="180" placeholder="请输入联系地址" />
            </u-form-item>
          </u-form>
        </view>
      </view>
      <view v-else class="warmPrompt">{{ tipInfo }}</view>
    </view>
  </u-modal>
</template>
<script lang="ts">
export default {
  name: 'MyinfoContractCollectSuretyEnterprise'
}
</script>
<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import { setStorage, getStorage, removeStorage } from '@/utils/storages'
import {
  GatherInfo,
  JointInfo,
  LoanOrgInfo,
  LoanOrgTransferLinkInfo,
  FconScmVo,
  FconDtcMListObj,
  GuarantorEnterpriseInfo
} from '@/interfaces/member/myinfo/contractCollect'
import { checkEmail, checkMobile } from '@/utils/validate'
import apiSignInfo from '@/api/member/api.signInfo'
import { decodeBase64 } from '@/utils/crypto'
import { useRoute, useRouter } from '@/uni-simple-router'
import { showToast } from '@/utils/uniapp/toast'
import wx from 'jweixin-1.6.0'
import { getPlatform } from '@/utils/uniapp'
// import { onShow } from '@dcloudio/uni-app'
const router = useRouter()
const route = useRoute()
const loading = ref(false)
let refcode = Number(decodeBase64(route.value.params.refcode as string)) //连带保证公司流水号
let tipInfo = ref('')
const message = ref('')
const showConfirmButton = ref(true) // 弹框是否展示确定按钮
const dialogType = ref('') // 弹框显示内容【1=文本识别/3=文本识别完确定/2=数据更新提示】
const dialogShow = ref(false)
let suretyEnterpriseObj: GuarantorEnterpriseInfo = {
  refcode: 0,
  guaAccountNo: '',
  guaBankName: '',
  guaCompanyBusAddress: '',
  guaCompanyLinkman: '',
  guaCompanyTel: '',
  guaCompanyEmail: '',
  guaCompanyAddress: '',
  guaAddress: '',
  guaIdNo: '',
  guaName: '',
  guaTel: ''
}
let suretyEnterpriseList = [] as Array<GuarantorEnterpriseInfo>
const vm = reactive({
  suretyEnterpriseObj: suretyEnterpriseObj
})
const recognizeResult: JointInfo = reactive({
  jointAccount: '',
  jointBank: '',
  jointBusinessAddress: '',
  jointContactAccount: '',
  jointEmail: '',
  jointTel: '',
  jointUsername: ''
})
// onShow(() => {
//   suretyEnterpriseList = getStorage('suretyEnterpriseList') as Array<GuarantorEnterpriseInfo>
//   suretyEnterpriseList.forEach(item => {
//     if (item.refcode === refcode) {
//       vm.suretyEnterpriseObj = item
//     }
//   })
// })
onMounted(() => {
  suretyEnterpriseList = getStorage('suretyEnterpriseList') as Array<GuarantorEnterpriseInfo>
  suretyEnterpriseList.forEach(item => {
    if (item.refcode === refcode) {
      vm.suretyEnterpriseObj = item
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
          if (!vm.suretyEnterpriseObj.guaAccountNo) {
            showToast('请输入公司账号')
            return
          }
          if (!vm.suretyEnterpriseObj.guaBankName) {
            showToast('请输入开户行')
            return
          }
          if (!vm.suretyEnterpriseObj.guaCompanyBusAddress) {
            showToast('请输入经营地址')
            return
          }
          if (vm.suretyEnterpriseObj.guaCompanyTel && !checkMobile(vm.suretyEnterpriseObj.guaCompanyTel)) {
            showToast('请输入正确的联系电话')
            return
          }
          if (vm.suretyEnterpriseObj.guaCompanyEmail && !checkEmail(vm.suretyEnterpriseObj.guaCompanyEmail)) {
            showToast('请输入正确的联系邮箱')
            return
          }
        }
        suretyEnterpriseList.forEach((item, i) => {
          if (refcode === item.refcode) {
            suretyEnterpriseList[i] = vm.suretyEnterpriseObj
          }
        })
        setStorage('suretyEnterpriseList', suretyEnterpriseList)
        router.back(1)
      }
    })
    .catch(() => {
      loading.value = false
    })
}
/**
 * @Author: longcan.Yang
 * @Date: 2023-01-16 09:18:30
 * @return {*}
 * @description: return false阻止关闭弹框  dialogType【1=文本识别/2=立即更新/3=展示识别成功的数据】
 */
const modalConfirm = () => {
  if (dialogType.value === '1') {
    if (!message.value) {
      showToast('请输入文本信息')
      return false
    }
    apiSignInfo
      .getJointInfo({
        message: message.value
      })
      .then(res => {
        recognizeResult.jointAccount = res.data.jointAccount ? res.data.jointAccount : vm.suretyEnterpriseObj.guaAccountNo
        recognizeResult.jointBank = res.data.jointBank ? res.data.jointBank : vm.suretyEnterpriseObj.guaBankName
        recognizeResult.jointBusinessAddress = res.data.jointBusinessAddress
          ? res.data.jointBusinessAddress
          : vm.suretyEnterpriseObj.guaCompanyBusAddress
        recognizeResult.jointContactAccount = res.data.jointContactAccount ? res.data.jointContactAccount : vm.suretyEnterpriseObj.guaCompanyAddress
        recognizeResult.jointEmail = res.data.jointEmail ? res.data.jointEmail : vm.suretyEnterpriseObj.guaCompanyEmail
        recognizeResult.jointTel = res.data.jointTel ? res.data.jointTel : vm.suretyEnterpriseObj.guaCompanyTel
        recognizeResult.jointUsername = res.data.jointUsername ? res.data.jointUsername : vm.suretyEnterpriseObj.guaCompanyLinkman
        dialogType.value = '3'
      })
    return false
  } else if (dialogType.value === '3') {
    vm.suretyEnterpriseObj.guaAccountNo = recognizeResult.jointAccount
    vm.suretyEnterpriseObj.guaBankName = recognizeResult.jointBank
    vm.suretyEnterpriseObj.guaCompanyBusAddress = recognizeResult.jointBusinessAddress
    vm.suretyEnterpriseObj.guaCompanyAddress = recognizeResult.jointContactAccount
    vm.suretyEnterpriseObj.guaCompanyEmail = recognizeResult.jointEmail
    vm.suretyEnterpriseObj.guaCompanyTel = recognizeResult.jointTel
    vm.suretyEnterpriseObj.guaCompanyLinkman = recognizeResult.jointUsername
    // 更新输入框值
    message.value = '' // 提交成功后清除文本，关闭弹窗
    dialogShow.value = false
  } else {
    // 立即更新保留企业基本信息数据，重置买方企业，连带保证公司，连带保证人数据
    removeStorage('loanOrgTransferLinkInfo')
    removeStorage('fconScmVo')
    removeStorage('buyerInfoList')
    removeStorage('suretyEnterpriseList')
    removeStorage('suretyPersonList')
    router.back(1)
  }
}
/**
 * @Author: longcan.Yang
 * @Date: 2023-03-13 16:30:01
 * @return {*}
 * @description: 识别弹窗输入框改变事件
 */
const updateValue = () => {
  if (message.value) {
    showConfirmButton.value = true
  } else {
    dialogType.value = '1'
    showConfirmButton.value = false
  }
}
const delMessage = () => {
  message.value = ''
  dialogType.value = '1'
  showConfirmButton.value = false
}
const cancel = () => {
  dialogShow.value = false
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-21 08:57:24
 * @description: 开票信息文本智能识别
 */
const textRecognition = () => {
  dialogType.value = '1'
  dialogShow.value = true
  // 输入框有文本才显示识别按钮
  if (message.value) {
    showConfirmButton.value = true
  } else {
    showConfirmButton.value = false
  }
}
</script>

<style lang="scss" scoped>
@import './style/index.scss';
.bigBox {
  // padding: 0 30rpx;
  .detail {
    // margin: 0 30rpx 85rpx 30rpx;
    padding: 40rpx 30rpx 0;
    // border-radius: 5rpx;
    // box-shadow: 0 0 8rpx 3rpx rgba(0, 0, 0, 0.1);
    :deep(.u-input) {
      .u-input__label {
        width: 40%;
      }
    }
  }
  :deep(.u-cell:after) {
    display: true;
  }
}
</style>
