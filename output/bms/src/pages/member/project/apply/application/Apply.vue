<!--
 * @Author       : Longcan.Yang
 * @Date         : 2024-10-12 14:30:23
 * @LastEditors  : LongCan.Yang
 * @LastEditTime : 2026-03-24 18:46:32
 * @Description  : 项目-业务申请-填报申请书  /member/project/apply/application/apply
-->

<template>
  <NavBar v-if="vm.submitInfo.fintAppM.operator && vm.submitInfo.fintAppM.operator !== '2'">
    <span v-if="['1', '3', '7', '8'].includes(vm.submitInfo.fintAppM.applyStatus)" class="inviteWrite" @click="inviteWrite()">邀请申请人填写</span>
  </NavBar>
  <view class="relative">
    <state-module
      v-if="vm.submitInfo.fintAppM.applyStatus"
      :state-name="stateName[vm.submitInfo.fintAppM.applyStatus]"
      :state-color="stateColor[vm.submitInfo.fintAppM.applyStatus]"
    ></state-module>
    <view id="apply-tip-container" class="apply-tip-container">
      <!-- 客户经理退回原因，客户链接展示 -->
      <view v-if="vm.submitInfo.fintAppM.operator === '2' && vm.submitInfo.fintAppM.applyStatus === '3'" class="returnReason">
        <view>
          <text>退回原因：</text>
          <text class="reasonValue">
            {{ vm.submitInfo.fintAppM.confirmRemark }}
          </text>
        </view>
      </view>
      <view v-if="vm.submitInfo.fintAppM.operator === '1'" class="tip-box">
        <view>
          <span class="text1">
            <i class="iconfont icon-jinggao"></i>
            请务必及时告知申请人：确认如双方最终未实际开展保理
          </span>
        </view>
        <view class="text2">业务，我司无须退还申请人已缴纳的额度设立费及/或征信费用</view>
      </view>
      <!-- 运营端退回，在客户经理端展示 -->
      <view v-if="vm.submitInfo.fintAppM.operator === '1' && vm.submitInfo.fintAppM.applyStatus === '7'" class="returnReason customerManager">
        <view>
          <text>退回原因：</text>
          <text class="reasonValue">
            {{ vm.submitInfo.fintAppM.examineRemark }}
          </text>
        </view>
      </view>
      <!-- 运营端到账退回，在客户经理端展示 -->
      <view v-if="vm.submitInfo.fintAppM.operator === '1' && vm.submitInfo.fintAppM.applyStatus === '8'" class="returnReason customerManager">
        <view>
          <text>退回原因：</text>
          <text class="reasonValue">
            {{ vm.submitInfo.fintAppM.accountConfirmRemark }}
          </text>
        </view>
      </view>
    </view>
    <!-- 编辑模块 -->
    <ApplicationEdit
      v-if="vm.submitInfo.fintAppM.operator && showEditFlag"
      ref="applicationEditRef"
      :submit-info="vm.submitInfo"
      :check-application-buyer="checkApplicationBuyer"
      @do-submit-application-temp="doSubmitApplicationTemp"
      @do-save="doSave"
      @on-delete-buyer="onDeleteBuyer"
    ></ApplicationEdit>
    <!-- 待申请 -->
    <view v-if="['1', '3', '7', '8'].includes(vm.submitInfo.fintAppM.applyStatus)" class="button-fixed-bottom">
      <view class="placeholder"></view>
      <view class="fixed">
        <u-button :loading="loading" block type="success" native-type="submit" @click="doSave()">保存</u-button>
        <u-button :loading="loading" block type="primary" native-type="submit" @click="doCheckApplication('1')">提交</u-button>
      </view>
    </view>
    <!-- 待确认 -->
    <view v-if="vm.submitInfo.fintAppM.applyStatus === '2'" class="button-fixed-bottom">
      <view class="placeholder"></view>
      <view class="fixed">
        <u-button :loading="loading" block type="error" native-type="submit" @click="sendBack">退回</u-button>
        <u-button :loading="loading" block type="primary" native-type="submit" @click="doCheckApplication('2')">确认</u-button>
      </view>
    </view>

    <u-popup :show="showStatement" closeable round="20" @close="showStatement = false">
      <view class="popup-box">
        <view class="popup-title">为保障您的权益，请输入以下声明：</view>
        <view class="popup-statement">申请人确认如贵我双方最终未实际开展保理业务，贵司无须退还申请人已缴纳的额度设立费及/或征信费用。</view>
        <view class="textarea-box">
          <u-textarea v-model="inputValue" :confirm-type="null" class="inputValueClass" placeholder="请输入声明内容"></u-textarea>
          <view class="import" @click="importText">一键输入</view>
        </view>
        <view style="display: none">
          <Uploader
            ref="uploaderRef"
            accept=".jpg,.jpeg,.png,.pdf,.gif"
            :max-size="10"
            :max-count="Infinity"
            :preview-image="false"
            :upload-data="uploadData"
            @upload-success="uploadSuccess"
          ></Uploader>
        </view>
        <view>
          <u-button :loading="loading" block type="primary" native-type="submit" @click="doCheckApplication('3')">提交</u-button>
        </view>
      </view>
    </u-popup>
    <u-modal
      :show="dialogShow"
      mode="center"
      :round="10"
      cancel-text="取消"
      :confirm-text="dialogType === '3' ? '我知道了' : '确定'"
      :show-cancel-button="!['2', '3'].includes(dialogType)"
      show-confirm-button
      @cancel="dialogShow = false"
      @confirm="onConfirm"
    >
      <view class="slot-content">
        <view class="title">{{ ['2', '3'].includes(dialogType) ? '温馨提示' : '确认退回' }}</view>
        <view v-if="dialogType === '2'">数据已被更新，请刷新页面获取最新信息</view>
        <view v-else-if="dialogType === '3'">业务数据已更新，请重新操作</view>
        <view v-else class="textarea-box">
          <u-textarea v-model="confirmRemark" :confirm-type="null" height="125px" maxlength="200" placeholder="请输入退回原因" count></u-textarea>
        </view>
      </view>
    </u-modal>
    <u-modal
      :show="showContinue"
      title="温馨提示"
      confirm-text="确认"
      :show-cancel-button="true"
      @confirm="confirmContiue"
      @cancel="showContinue = false"
    >
      <view class="slot-content">
        <view>开票企业名称与税号不匹配，确认是否继续？</view>
      </view>
    </u-modal>
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import StateModule from '@/plugins/StateModule.vue'
// import { getHasPermissionsById } from '@/utils/permissions'
import { showToast } from '@/utils/uniapp/toast'
import { ApplicationInfo, BuyerList, ShareDataObj } from '@/interfaces/member/project/apply/fillingApplication'
import ApplicationEdit from './components/ApplicationEdit.vue'
import apiFillingApplication from '@/api/member/project/apply/api.fillingApplication'
import { useRoute, useRouter } from '@/uni-simple-router'
import { decodeBase64 } from '@/utils/crypto'
import Uploader from '@/plugins/uploader/components/Uploader.vue'
import { onLoad, onShow, onUnload } from '@dcloudio/uni-app'
import { getStorage, removeStorage } from '@/utils/storages'
import { encodeBase64, getUrlParam } from '@/utils/crypto'
import { checkEmail } from '@/utils/validate'
import { dateFormat } from '@/utils/format'
import { getPlatform } from '@/utils/uniapp'
import { doWxConfig } from '@/utils/weixin/wxConfig'
import wx from 'jweixin-1.6.0'
// import html2canvas from 'html2canvas'
import * as htmlToImage from 'html-to-image'
import { base64toFile } from '@/utils/crypto'
import { getValueByKey } from '@/utils/constant'
import { isEmpty, checkStringIsEn, isNotEmpty } from '@/utils/validate'

// import apiFile from '@/api/common/api.file'
const route = useRoute()
const router = useRouter()
let loading = ref(false)
let showStatement = ref(false) // 客户提交展示声明
let showContinue = ref(false) // “开票企业名称与税号不匹配确认提交
const inputValue = ref('') // 声明输入的内容
const dialogShow = ref(false) // 展示退回原因弹窗
const dialogType = ref('1') // 弹窗类型【1=退回/2=状态变更刷新页面/买方信息变更刷新数据】
const uploaderRef = ref()
const showEditFlag = ref(true) // 是否展示编辑模块
const confirmRemark = ref('')
const isCanInput = ref(true)
const applicationEditRef = ref()
let isConfig = false // 是否配置了分享链接
let checkType = ref('') //submit提交|confirm确认
let ocrPayeeAcctName = ref('')
let uploadData = reactive({
  watermark: 'Y',
  watermarkText: ''
})
const props = defineProps({
  shareTime: {
    // 客户经理分享的时间
    default: -1,
    type: Number,
    required: false
  }
})
const emit = defineEmits(['getApplyStatus', 'getUserName'])
// 分享链接带参
let shareDataObj: ShareDataObj = {
  orgname: '',
  refcode: '',
  operator: '',
  ctyid: '',
  shareTime: 0
}
let refcode: number | string = '-1' // 申请书流水号
let orgname = '' // 卖方企业名称
let ctyid = '' // 申请人国家
let bizScene = '' // 业务大类
let productType = '' // 产品类型

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
    discount: '',
    discountDesc: '',
    creditPaymentType: '',
    creditPaymentTypeDesc: '',
    invoiceType: '',
    billCcyid: '',
    factoringUsdAccountNo: '',
    factoringBankEn: '',
    factoringBankAddress: '',
    factoringSwiftCode: '',
    bankRtgsCode: '',
    bankBranchCode: '',
    ctyid: '',
    ctyDesc: '',
    superiorName: '',
    userName: '',
    applyDate: '',
    factoringHkdAccountNo: '',
    productType: '',
    bizScene: '',
    paymentCcyid: '',
    ccyidDesc: ''
  },
  fintApxList: [],
  userName: '',
  totalBuyerCount: 0
}
let vm = reactive({
  submitInfo: submitInfo // 提交信息
})
const stateName = computed(() => ({
  '1': vm.submitInfo.fintAppM.refcode ? '待提交' : '待申请',
  '2': '待确认',
  '3': '待修改',
  '7': '已退回',
  '8': '已退回'
}))
const stateColor = {
  '1': 'warning',
  '2': 'warning',
  '3': 'warning',
  '7': 'warning',
  '8': 'warning'
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-22 16:50:01
 * @description: 仅作为回调，无实际作用
 */
const uploadSuccess = data => {
  if (!data.fileKey) {
    return
  }
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-17 15:41:04
 * @return {*}
 * @description: 校验数据
 */
const validData = () => {
  if (!vm.submitInfo.fintAppM.orgname) {
    showToast('请输入申请人全称')
    return false
  }
  if (!vm.submitInfo.fintAppM.companyCreditCode) {
    showToast('请输入统一社会信用代码')
    return false
  }
  if (!vm.submitInfo.fintAppM.operateAddress) {
    showToast('请输入经营地址')
    return false
  }

  if (!vm.submitInfo.fintAppM.regDate) {
    showToast('请选择成立时间')
    return false
  }

  if (!vm.submitInfo.fintAppM.businessScope) {
    showToast('请输入主要经营范围')
    return false
  }

  if (!vm.submitInfo.fintAppM.legalPerson) {
    showToast('请输入法人')
    return false
  }

  if (!vm.submitInfo.fintAppM.legalPhone) {
    showToast('请输入法人联系电话')
    return false
  }

  if (!vm.submitInfo.fintAppM.legalPhone) {
    showToast('请输入法人联系电话')
    return false
  }

  if (!vm.submitInfo.fintAppM.legalLinkman) {
    showToast('请输入联系人姓名')
    return false
  }

  if (!vm.submitInfo.fintAppM.legalLinkmanPhone) {
    showToast('请输入联系人电话')
    return false
  }
  // 校验是否买方
  if (vm.submitInfo.buyerList && vm.submitInfo.buyerList.length === 0) {
    showToast('请至少添加一个买方信息')
    return false
  }
  for (let item of vm.submitInfo.buyerList) {
    if (
      !item.aplOrgname ||
      !item.orgname ||
      !item.ctyDesc ||
      !item.addressEn ||
      !item.companyRegistrationNo ||
      !item.email ||
      !item.linkman ||
      !item.linkmanPosition ||
      !item.linkmanMobilePhone
    ) {
      showToast(`请补充${item.orgname || item.aplOrgname}的信息`)
      return false
    } else if (item.orgname && !checkStringIsEn(item.orgname)) {
      showToast(`请补充正确的的买方全称(英文)`)
      return false
    } else if (item.addressEn && !checkStringIsEn(item.addressEn)) {
      showToast(`请补充正确的${item.orgname}的详细地址(英文)`)
      return false
    } else if (item.email && !checkEmail(item.email)) {
      showToast(`请补充正确的${item.orgname}的公司联系邮箱`)
      return false
    } else if (
      !item.firstTransactionYear ||
      !item.ccyid ||
      isEmpty(item.currentOrderAmt) ||
      isEmpty(item.accountBalance) ||
      !item.payType ||
      // eslint-disable-next-line no-extra-parens
      (item.payType === '2' && !item.payTypeDesc) ||
      !item.overdueFlag ||
      // eslint-disable-next-line no-extra-parens
      (item.overdueFlag === '1' && !item.overdueRemark) ||
      !item.debtTransferFlag
    ) {
      showToast(`请补充${item.orgname}的信息`)
      return false
    }
  }

  let typeList: string[] = [] // 附件类型集合
  vm.submitInfo.fintApxList.forEach(item => {
    typeList.push(item.fileType)
  })
  if (vm.submitInfo.fintAppM.operator === '2') {
    if (
      ['1', '2', '3'].includes(vm.submitInfo.fintAppM.payCreditType || '') &&
      vm.submitInfo.fintAppM.creditPaymentType === '1' &&
      !typeList.includes('1')
    ) {
      showToast('请至少上传一笔征信费银行回单')
      return false
    }
  }

  if (vm.submitInfo.fintAppM.operator === '1') {
    // 客户经理必填
    if (!vm.submitInfo.fintAppM.payCreditTypeDesc) {
      showToast('请选择缴纳征信费')
      return false
    }

    if (vm.submitInfo.fintAppM.payCreditType === '3' && !vm.submitInfo.fintAppM.discountDesc) {
      showToast('请选择征信费折扣')
      return false
    }
    if (!vm.submitInfo.fintAppM.creditPaymentTypeDesc && ['1', '2', '3'].includes(vm.submitInfo.fintAppM.payCreditType)) {
      showToast('请选择付款方式')
      return false
    }
    if (
      ['1', '2', '3'].includes(vm.submitInfo.fintAppM.payCreditType || '') &&
      vm.submitInfo.fintAppM.creditPaymentType === '1' &&
      !vm.submitInfo.fintAppM.factoringName
    ) {
      showToast('请选择收款企业名称')
      return false
    }

    if (
      vm.submitInfo.fintAppM.payCreditType !== '9' &&
      vm.submitInfo.fintAppM.creditPaymentType === '1' &&
      isEmpty(vm.submitInfo.fintAppM.paymentCcyid)
    ) {
      showToast('请选择缴费币种')
      return false
    }
    if (
      ['1', '2', '3'].includes(vm.submitInfo.fintAppM.payCreditType || '') &&
      vm.submitInfo.fintAppM.creditPaymentType === '1' &&
      !typeList.includes('1')
    ) {
      showToast('请至少上传一笔征信费银行回单')
      return false
    }
    if (
      // eslint-disable-next-line no-extra-parens
      (['2', '9'].includes(vm.submitInfo.fintAppM.payCreditType || '') || vm.submitInfo.fintAppM.creditPaymentType === '2') &&
      !typeList.includes('2')
    ) {
      showToast('请至少上传一笔主管审批证明')
      return false
    }
  } else if (vm.submitInfo.fintAppM.billFlag === '1' && !typeList.includes('1')) {
    // 客户链接若开票则必填
    showToast('请至少上传一笔征信费银行回单')
    return false
  }
  // 非豁免||客户链接提交
  // eslint-disable-next-line no-extra-parens
  if (vm.submitInfo.fintAppM.payCreditType !== '9' && vm.submitInfo.fintAppM.creditPaymentType === '1') {
    if (!vm.submitInfo.fintAppM.billFlag) {
      showToast('请选择开票方式')
      return false
    }
    if (vm.submitInfo.fintAppM.billFlag === '1') {
      if (vm.submitInfo.fintAppM.invoiceType !== '1' && !vm.submitInfo.fintAppM.billType) {
        showToast('请选择开票类型')
        return false
      }
      if (!vm.submitInfo.fintAppM.billOrgname) {
        showToast('请输入开票企业名称')
        return false
      }
      if (vm.submitInfo.fintAppM.invoiceType !== '1' && !vm.submitInfo.fintAppM.billDutyParagraph) {
        showToast('请输入开票企业税号')
        return false
      }
      if (!vm.submitInfo.fintAppM.billEmail) {
        showToast('请输入开票企业邮箱')
        return false
      }
      if (!checkEmail(vm.submitInfo.fintAppM.billEmail)) {
        showToast('请输入正确的开票企业邮箱')
        return false
      }
      if (vm.submitInfo.fintAppM.factoringName && vm.submitInfo.fintAppM.factoringName.trim() === vm.submitInfo.fintAppM.billOrgname.trim()) {
        showToast('开票企业名称与收款企业名称不能一致')
        return false
      }
      if (getStorage('payeeAcctName')) {
        ocrPayeeAcctName.value = getStorage('payeeAcctName') as string
        if (isNotEmpty(ocrPayeeAcctName.value) && !typeList.includes('3') && ocrPayeeAcctName.value !== vm.submitInfo.fintAppM.billOrgname) {
          uni.hideToast()
          uni.showToast({
            title: '付款人名称与开票企业名称不一致，请上传付款委托书', // 提示的内容
            icon: 'none',
            duration: 1000 // 提示的延迟时间，单位毫秒
          })
        }
        removeStorage('payeeAcctName')
      }
    }
    if (vm.submitInfo.fintAppM.billFlag === '2') {
      if (applicationEditRef && applicationEditRef.value) {
        const invoiceInfo = applicationEditRef.value.getInvoiceInfo()
        if (!invoiceInfo.ccyid) {
          showToast('请选择已开发票')
          return false
        }
        if (getStorage('payeeAcctName')) {
          ocrPayeeAcctName.value = getStorage('payeeAcctName') as string
          if (isNotEmpty(ocrPayeeAcctName.value) && !typeList.includes('3') && ocrPayeeAcctName.value !== invoiceInfo.appOrgName) {
            uni.hideToast()
            uni.showToast({
              title: '付款人名称与开票企业名称不一致，请上传付款委托书', // 提示的内容
              icon: 'none',
              duration: 1000 // 提示的延迟时间，单位毫秒
            })
          }
          removeStorage('payeeAcctName')
        }
      }
    }
  }
  if (vm.submitInfo.fintAppM.payCreditType === '9') {
    // 豁免清空已选数据
    vm.submitInfo.fintAppM.creditPaymentType = ''
    vm.submitInfo.fintAppM.creditPaymentTypeDesc = ''
    vm.submitInfo.fintAppM.factoringName = ''
    vm.submitInfo.fintAppM.paymentCcyid = ''
  }
  if (vm.submitInfo.fintAppM.creditPaymentType === '2') {
    // 先付
    vm.submitInfo.fintAppM.factoringName = ''
    vm.submitInfo.fintAppM.paymentCcyid = ''
  }
  return true
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-18 10:08:24
 * @description: 调用接口提交数据
 */
const doSubmitApplication = (type?: string) => {
  let data = {
    ...vm.submitInfo,
    ...vm.submitInfo.fintAppM,
    ctyid: vm.submitInfo.fintAppM.ctyid,
    refcode
  }
  loading.value = true
  apiFillingApplication.doSubmitApplication(data).then(
    () => {
      if (type === 'client') {
        // 关闭当前页面的提示
        uni.hideToast()
        // 客户提交成功
        emit('getApplyStatus', '1')
        loading.value = false
      } else {
        // 关闭当前页面的提示
        uni.hideToast()
        // 客户经理提交成功
        uni.redirectTo({
          url: '/member/project/apply/application/success',
          success: () => {
            loading.value = false
          }
        })
      }
    },
    () => {
      loading.value = false
      // eslint-disable-next-line no-use-before-define
      doSave('auto')
    }
  )
}
const finalSubmit = () => {
  loading.value = true
  showContinue.value = false
  if (vm.submitInfo.fintAppM.operator === '1') {
    // 客户经理直接提交
    doSubmitApplication()
  } else {
    loading.value = false
    // 客户展示声明
    showStatement.value = true
  }
}
const finalDoSubmitConfirm = (applyStatus: string) => {
  loading.value = true
  showContinue.value = false
  let data = {
    ...vm.submitInfo,
    ...vm.submitInfo.fintAppM,
    ctyid: vm.submitInfo.fintAppM.ctyid,
    refcode,
    applyStatus,
    confirmRemark: confirmRemark.value
  }
  apiFillingApplication.doSubmitConfirm(data).then(
    () => {
      if (applyStatus === '3') {
        showToast('退回成功')
      } else {
        showToast('确认成功')
      }
      setTimeout(() => {
        loading.value = false
        router.back(1)
      }, 1500)
    },
    () => {
      loading.value = false
    }
  )
}
/**
 * @Author: Charon.Lin
 * @Date: 2025-01-16 11:31:44
 * @param {*} type submit客户经理或客户提交|confirm客户经理确认
 * @return {*}
 * @description: 校验开票企业税号
 */
const getApplyOrgInfo = (type: string) => {
  if (isEmpty(vm.submitInfo.fintAppM.billOrgname)) {
    showToast('请输入开票企业名称')
    loading.value = false
    return
  }
  apiFillingApplication.getApplyOrgInfo(vm.submitInfo.fintAppM.billOrgname, '2').then(res => {
    if (res.data.companyCreditCode !== vm.submitInfo.fintAppM.billDutyParagraph) {
      showContinue.value = true
    } else if (type === 'submit') {
      finalSubmit()
    } else {
      finalDoSubmitConfirm('4')
    }
  })
}
const confirmContiue = () => {
  if (checkType.value === 'submit') {
    finalSubmit()
  } else {
    finalDoSubmitConfirm('4')
  }
}
const submitData = (base64: string) => {
  let file = base64toFile(base64, '快照')
  uploaderRef.value.uploadFilePromise(file).then(data => {
    let fileItem = {
      refcode: data.refcode,
      fileName: data.fileName,
      remark: data.remark || '',
      fileUuid: data.fileUuid,
      resourceUuid: data.resourceUuid,
      suffixalType: data.fileType,
      fileType: '9' /// 9=声明截图
    }
    // 过滤历史声明截图，取最新快照
    vm.submitInfo.fintApxList = vm.submitInfo.fintApxList.filter(item => item.fileType !== '9')
    vm.submitInfo.fintApxList.push(fileItem)
    doSubmitApplication('client')
  })
}
//检查申请书买方
const checkApplicationBuyer = async () => {
  try {
    const res = await apiFillingApplication.checkApplicationBuyer(refcode as string, shareDataObj.operator !== '2')
    loading.value = false
    // 客户查看买方信息为空
    if (res.data.count === 0 && vm.submitInfo.fintAppM.operator === '2') {
      emit('getApplyStatus', '9')
      return false
    }
    // 客户经理查看买方信息为空
    if (res.data.count === 0 && vm.submitInfo.fintAppM.operator === '1') {
      showToast('买方数据已更新')
      router.back(1)
    }
    //当卖方信息不一致时
    if (vm.submitInfo.buyerList.length !== res.data.count) {
      dialogShow.value = true
      dialogType.value = '3'
      return false
    }
    return true
  } catch (error) {
    loading.value = false
    // eslint-disable-next-line no-use-before-define
    doSave('auto')
    return false
  }
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-17 16:39:04
 * @description: 客户输入声明后提交
 */
const onClientSubmit = () => {
  if (!inputValue.value) {
    showToast('请输入声明内容')
    loading.value = false
    return
  }
  if (inputValue.value !== '申请人确认如贵我双方最终未实际开展保理业务，贵司无须退还申请人已缴纳的额度设立费及/或征信费用。') {
    showToast('请正确填写声明内容')
    loading.value = false
    return
  }
  // 返回顶部，方便截图截全
  scrollTo(0, 0)
  loading.value = true
  uploadData.watermarkText = vm.submitInfo.fintAppM.orgname + '  ' + dateFormat(new Date(), 2)
  nextTick(() => {
    let appDom = document.getElementById('app')
    if (appDom) {
      htmlToImage.toPng(appDom).then(base64 => {
        if (getPlatform() === 'H5' && !/iPad|iPhone|iPod/.test(navigator.userAgent)) {
          // 非IOS直接提交
          submitData(base64)
        } else {
          // IOS多次调用，解决端本地图片生成失败问题
          htmlToImage.toPng(appDom).then(() => {
            htmlToImage.toPng(appDom).then(base64A => {
              submitData(base64A)
            })
          })
        }
      })
    }
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-27 11:19:15
 * @return {*}type 【0=展示分享/1=禁止分享】
 * @description: 分享给融资企业
 */
const doShareInfo = (type: number) => {
  const shareData = {
    orgname,
    refcode,
    ctyid: vm.submitInfo.fintAppM.ctyid,
    operator: '2', // 【1=客户经理/ 2=客户】
    shareTime: new Date().getTime()
  }

  // H5端分享
  if (getPlatform() === 'H5') {
    // #ifdef H5
    const jsApiList = ['updateAppMessageShareData', 'hideMenuItems', 'onMenuShareAppMessage', 'hideAllNonBaseMenuItem', 'showMenuItems']
    // 要展示的菜单项
    doWxConfig(jsApiList).then(() => {
      // 仅待补充信息能分享朋友
      if (type === 0) {
        wx.hideAllNonBaseMenuItem()
        wx.showMenuItems({ menuList: ['menuItem:share:appMessage'] })
        isConfig = true
        // 解决PC端分享链接title、描述不生效
        wx.onMenuShareAppMessage({
          title: '申请书信息补充', // 分享标题
          desc: '邀请您填写业务申请书', // 分享描述
          link: `${window.location.origin}/clientApplication?data=${encodeBase64(JSON.stringify(shareData))}`, // 分享链接
          imgUrl: `${window.location.origin}/static/img/head.png` // 分享图标
        })
        wx.updateAppMessageShareData({
          title: '申请书信息补充', // 分享标题
          desc: '邀请您填写业务申请书', // 分享描述
          link: `${window.location.origin}/clientApplication?data=${encodeBase64(JSON.stringify(shareData))}`, // 分享链接
          imgUrl: `${window.location.origin}/static/img/head.png` // 分享图标
        })
      } else {
        wx.hideAllNonBaseMenuItem()
      }
    })

    // #endif
  }
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-14 14:48:25
 * @description: 临时保存 type|invoice 选择已开发票自动保存并跳转发票列表页
 */
const doSubmitApplicationTemp = (type?: string) => {
  // 校验是否买方
  if (vm.submitInfo.buyerList && vm.submitInfo.buyerList.length === 0) {
    showToast('请至少添加一个买方信息')
    return
  }
  loading.value = true
  let data = {
    ...vm.submitInfo,
    ...vm.submitInfo.fintAppM,
    ctyid: vm.submitInfo.fintAppM.ctyid,
    refcode,
    operator: shareDataObj.operator ? shareDataObj.operator : '1',
    initFlag: type === 'init' ? '1' : '0'
  }
  // 第一次没有申请书refcode，需要带token
  apiFillingApplication
    .doSubmitApplicationTemp(data, !vm.submitInfo.fintAppM.refcode, ['auto', 'confirm'].includes(type as string) ? false : true)
    .then(
      res => {
        loading.value = false
        refcode = res.data.refcode
        // 待申请临时保存获取refcode后支持分享，调用一次
        if (!isConfig) {
          doShareInfo(0)
        }
        // 暂存后如果选择缴纳征信费和开票方式，显示分享
        if (
          isNotEmpty(vm.submitInfo.fintAppM.payCreditType) &&
          isNotEmpty(vm.submitInfo.fintAppM.billFlag) &&
          !(vm.submitInfo.fintAppM.billFlag === '2' && isEmpty(vm.submitInfo.fintAppM.invRefcode))
        ) {
          wx.showMenuItems({ menuList: ['menuItem:share:appMessage'] })
        }
        if (['init', 'autoAndRefresh', 'confirm'].includes(type as string)) {
          // 初始化
          // eslint-disable-next-line no-use-before-define
          getApplicationInfo(['autoAndRefresh', 'confirm'].includes(type as string) ? 'update' : '')
        } else if (type === 'invoice') {
          // eslint-disable-next-line no-use-before-define
          getApplicationInfo(type)
        } else if (!type) {
          showToast('保存成功')
        }
      },
      () => {
        loading.value = false
        if (type === 'confirm') {
          showEditFlag.value = false
          nextTick(() => {
            showEditFlag.value = true
          })
        }
      }
    )
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-18 11:02:43
 * @description: 客户经理申请书确认
 */
const doSubmitConfirm = applyStatus => {
  if (applyStatus === '3' && loading.value) {
    return
  }
  if (applyStatus === '3') {
    // 退回
    if (!confirmRemark.value) {
      showToast('请输入退回原因')
      return
    }
  } else if (!validData()) {
    loading.value = false
    // 确认
    return
  }
  dialogShow.value = false
  // [arm-10466]若承做保理商选择的是台一，且开票方式选择为是时校验税号
  if (applyStatus === '4' && vm.submitInfo.fintAppM.factoringName === '台一国际商业保理（天津）有限公司' && vm.submitInfo.fintAppM.billFlag === '1') {
    loading.value = false
    getApplyOrgInfo('confirm')
  } else {
    finalDoSubmitConfirm(applyStatus)
  }
}

/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-18 11:08:13
 * @description: 退回
 */
const sendBack = () => {
  dialogType.value = '1'
  dialogShow.value = true
}
// 弹窗确认
const onConfirm = async () => {
  if (dialogType.value === '1') {
    doSubmitConfirm('3')
  } else if (dialogType.value === '3') {
    dialogShow.value = false
    // eslint-disable-next-line no-use-before-define
    doSave('autoAndRefresh')
  } else {
    dialogShow.value = false
    // eslint-disable-next-line no-use-before-define
    getApplicationInfo('update')
  }
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-23 15:57:37
 * @param {*} content
 * @description: 一键输入动画
 */
const appendLastMessageContent = content => {
  let length = content.length

  const appendChunk = () => {
    if (length <= 0) {
      return
    }

    const chunk = content.slice(0, 8)
    inputValue.value += chunk
    // eslint-disable-next-line no-param-reassign
    content = content.slice(8)
    length -= 8
    // 使用 nextTick 确保每次更新后立即更新 DOM
    nextTick(() => {
      if (length > 0) {
        setTimeout(appendChunk, 100)
      } else {
        isCanInput.value = true
      }
    })
  }
  appendChunk()
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-17 16:35:03
 * @description: 一键输入
 */
const importText = () => {
  if (isCanInput.value) {
    inputValue.value = ''
    isCanInput.value = false
    appendLastMessageContent('申请人确认如贵我双方最终未实际开展保理业务，贵司无须退还申请人已缴纳的额度设立费及/或征信费用。')
  }
}
//校验当前征信费折扣是否在规则内,3个买方可以打8折;选了5个买方可以打7折；选了10个买方及以上可以打6折
const checkDiscount = () => {
  // 3个买方以内不存在折扣
  if (vm.submitInfo.totalBuyerCount < 3) {
    vm.submitInfo.fintAppM.discount = ''
  }
  // 5个以内只能选择8折
  if (vm.submitInfo.totalBuyerCount >= 3 && vm.submitInfo.totalBuyerCount < 5 && ['6', '7', 6, 7].includes(vm.submitInfo.fintAppM.discount)) {
    vm.submitInfo.fintAppM.discount = ''
  }
  // 10个以内可选择7,8折
  if (vm.submitInfo.totalBuyerCount >= 5 && vm.submitInfo.totalBuyerCount < 10 && [6, '6'].includes(vm.submitInfo.fintAppM.discount)) {
    vm.submitInfo.fintAppM.discount = ''
  }
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-17 13:40:49
 * @param {*} type 临时保存后获取每个买方流水号
 * @description: 获取详情
 */
const getApplicationInfo = (type?: string) => {
  const data = {
    refcode,
    orgname,
    operator: shareDataObj.operator ? shareDataObj.operator : '1',
    timestamp: props.shareTime // 客户经理分享的时间
  }
  // 客户经理传token
  apiFillingApplication.getApplicationInfo(data, shareDataObj.operator !== '2').then(
    res => {
      if (shareDataObj.operator === '2' && !res.data.fintAppM) {
        emit('getApplyStatus', '9')
        return
      }
      vm.submitInfo = res.data
      vm.submitInfo.fintAppM.orgname = vm.submitInfo.fintAppM.orgname || orgname
      vm.submitInfo.fintAppM.ctyid = vm.submitInfo.fintAppM.ctyid || ctyid
      vm.submitInfo.fintAppM.bizScene = vm.submitInfo.fintAppM.bizScene || bizScene
      vm.submitInfo.fintAppM.productType = vm.submitInfo.fintAppM.productType || productType
      // 当征信费折扣非空时,3个买方可以打8折;选了5个买方可以打7折；选了10个买方及以上可以打6折
      if (!isEmpty(vm.submitInfo.fintAppM.discount)) {
        checkDiscount()
      }
      // 当买方不超过3条且历史数据选了标准折扣时清空缴纳征信费类型
      if (vm.submitInfo.totalBuyerCount < 3 && vm.submitInfo.fintAppM.payCreditType === '3') {
        vm.submitInfo.fintAppM.payCreditType = ''
        vm.submitInfo.fintAppM.payCreditTypeDesc = ''
      }
      vm.submitInfo.fintAppM.discountDesc = vm.submitInfo.fintAppM.discount ? vm.submitInfo.fintAppM.discount + '折' : ''
      vm.submitInfo.fintAppM.creditPaymentType = vm.submitInfo.fintAppM.creditPaymentType ? vm.submitInfo.fintAppM.creditPaymentType : '1'
      vm.submitInfo.fintAppM.creditPaymentTypeDesc = getValueByKey(vm.submitInfo.fintAppM.creditPaymentType || '', 'creditPaymentType')
      vm.submitInfo.fintAppM.payCreditTypeDesc = getValueByKey(vm.submitInfo.fintAppM.payCreditType || '', 'payCreditType')
      vm.submitInfo.fintAppM.regDate = dateFormat(res.data.fintAppM.regDate)
      vm.submitInfo.buyerList.forEach(item => {
        if (item.ccyid) {
          item.ccyidDesc = getValueByKey(item.ccyid, 'applyCcyid') ? getValueByKey(item.ccyid, 'applyCcyid') : '其他'
        }
      })
      vm.submitInfo.fintApxList = vm.submitInfo.fintApxList ? vm.submitInfo.fintApxList : []
      if (['1', '3', '7', '8'].includes(vm.submitInfo.fintAppM.applyStatus) && refcode) {
        // 先开票且未选关联发票禁止分享
        if (vm.submitInfo.fintAppM.billFlag === '2' && isEmpty(vm.submitInfo.fintAppM.invRefcode)) {
          doShareInfo(1)
        } else if (
          vm.submitInfo.buyerList &&
          vm.submitInfo.buyerList.length > 0 &&
          vm.submitInfo.fintAppM.payCreditType &&
          isNotEmpty(vm.submitInfo.fintAppM.billFlag)
        ) {
          doShareInfo(0)
        } else {
          doShareInfo(1)
        }
      } else {
        doShareInfo(1)
      }
      vm.submitInfo.fintAppM.operator = shareDataObj.operator ? shareDataObj.operator : '1'
      if (vm.submitInfo.fintAppM.operator === '2') {
        // 客户进入
        emit('getUserName', vm.submitInfo.userName)
        if (['7', '8'].includes(vm.submitInfo.fintAppM.applyStatus)) {
          // 运营退回
          emit('getApplyStatus', '7', vm.submitInfo.fintAppM.examineDate)
        } else if (['1', '3'].includes(vm.submitInfo.fintAppM.applyStatus)) {
          // 待补充/已退回
          emit('getApplyStatus', '0')
        } else if (!vm.submitInfo.fintAppM.customerSubmitDate) {
          // 客户经理已完善信息
          emit('getApplyStatus', '2')
        } else {
          // 链接页面展示已提交
          emit('getApplyStatus', '1')
        }
      }
      // 页面数据更新或从买方信息确认跳转过来
      if (['update', 'confirm'].includes(type as string)) {
        showEditFlag.value = false
        nextTick(() => {
          showEditFlag.value = true
        })
      }
      // 选择已开发票自动保存并跳转发票列表页
      if (type === 'invoice') {
        showEditFlag.value = false
        nextTick(() => {
          showEditFlag.value = true
        })
        router.push(
          `/member/project/apply/application/invoice/${encodeBase64(vm.submitInfo.fintAppM.applyNo as string)}/${encodeBase64(
            vm.submitInfo.fintAppM.refcode as string
          )}/${encodeBase64(vm.submitInfo.fintAppM.orgname as string)}/${encodeBase64(vm.submitInfo.fintAppM.ctyid)}/${encodeBase64(
            vm.submitInfo.fintAppM.paymentCcyid as string
          )}`
        )
      }
      //删除买方后刷新数据
      if (type === 'delete') {
        showEditFlag.value = false
        nextTick(() => {
          showEditFlag.value = true
        })
        showToast('删除成功')
      }
      loading.value = false
    },
    () => {
      loading.value = false
    }
  )
}
const onConfirmClick = () => {
  if (!validData()) {
    loading.value = false
    // eslint-disable-next-line no-use-before-define
    doSave('auto')
    return
  }
  // [arm-10466]若承做保理商选择的是台一，且开票方式选择为是时校验税号
  if (vm.submitInfo.fintAppM.factoringName === '台一国际商业保理（天津）有限公司' && vm.submitInfo.fintAppM.billFlag === '1') {
    loading.value = false
    getApplyOrgInfo('submit')
  } else {
    finalSubmit()
  }
}
const CheckApplication = async (type: string) => {
  let data = {
    refcode
  }
  // 若loading则不执行，避免loading中点了保存
  if (loading.value) {
    return
  }
  loading.value = true
  apiFillingApplication.doCheckApplication(data).then(
    res => {
      if (!['1', '2', '3', '7', '8'].includes(res.data.applyStatus)) {
        if (vm.submitInfo.fintAppM.operator === '1') {
          showToast('额度申请已被提交')
          setTimeout(() => {
            router.back(1)
          }, 1500)
          loading.value = false
          return
        }
      }
      // 客户提交时检验当前状态
      if (!['1', '3', '7', '8'].includes(res.data.applyStatus) && vm.submitInfo.fintAppM.operator === '2') {
        showToast('数据已更新,请刷新后重试')
        loading.value = false
        return
      }
      if (res.data.applyStatus !== vm.submitInfo.fintAppM.applyStatus) {
        dialogType.value = '2'
        dialogShow.value = true
        loading.value = false
        return
      }
      //申请书状态非待确认状态且是已分享状态时，客户经理校验时需要拦截
      if (res.data.pushReadStatus === '1' && res.data.applyStatus !== '2' && vm.submitInfo.fintAppM.operator === '1') {
        showToast('申请书分享后无法修改')
        setTimeout(() => {
          router.back(1)
        }, 1500)
        loading.value = false
        return
      }
      if (type === '0') {
        // 点击临时保存
        doSubmitApplicationTemp()
      } else if (['autoAndRefresh', 'auto', 'confirm', 'invoice'].includes(type)) {
        // 邀请分享自动保存
        doSubmitApplicationTemp(type)
      } else if (type === '1') {
        // 客户/客户经理提交
        checkType.value = 'submit'
        // eslint-disable-next-line no-use-before-define
        onSubmit()
      } else if (type === '2') {
        // 客户经理确认
        checkType.value = 'confirm'
        doSubmitConfirm('4')
      } else if (type === '3') {
        // 客户填写声明后提交
        onClientSubmit()
      }
    },
    () => {
      loading.value = false
    }
  )
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-21 13:23:48
 * @param {*} type 【0=临时保存/1=填报申请书提交/2=客户经理确认/3=客户填写声明后提交/auto=邀请自动保存/autoAndrefresh=自动保存刷新/invoice=自动保存跳转发票选择页】
 * @description: 检查申请书状态
 */
const doCheckApplication = async (type: string) => {
  if (['0', '1'].includes(type)) {
    try {
      //先校验买方信息
      const flag = await checkApplicationBuyer()
      if (flag) {
        //校验状态
        CheckApplication(type)
      }
    } catch (error) {
      // eslint-disable-next-line no-use-before-define
      doSave('auto')
    }
  } else {
    CheckApplication(type)
  }
}

// 点击保存
const doSave = (type?: string) => {
  // 校验是否买方
  if (vm.submitInfo.buyerList && vm.submitInfo.buyerList.length === 0) {
    showToast('请至少添加一个买方信息')
    return
  }
  if (vm.submitInfo.fintAppM.refcode) {
    if (vm.submitInfo.fintAppM.operator !== '2') {
      // 有流水号先校验状态
      apiFillingApplication.doCheckApplication({ refcode: vm.submitInfo.fintAppM.refcode }).then(res => {
        if (res.data.pushReadStatus === '1' && res.data.applyStatus !== '2') {
          showToast('申请书分享后无法修改')
          setTimeout(() => {
            router.back(1)
          }, 1500)
        } else {
          doCheckApplication(type || '0')
        }
      })
    } else {
      doCheckApplication(type || '0')
    }
  } else {
    // 无流水号直接保存
    doSubmitApplicationTemp(type)
  }
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-24 15:33:17
 * @description:提交
 */
const onSubmit = async () => {
  onConfirmClick()
}
const inviteWrite = () => {
  if (applicationEditRef && applicationEditRef.value) {
    applicationEditRef.value.inviteWrite()
  }
}
const onDeleteBuyer = buyerItem => {
  if (buyerItem.refcode) {
    const data = {
      aplDtcRefcode: buyerItem.aplDtcRefcode, //准入交易对手流水号
      appRefcode: buyerItem.appRefcode, //申请表流水号
      refcode: buyerItem.refcode //准入交易对手流水号
    }
    loading.value = true
    apiFillingApplication
      .doRemoveAplBuyer(data)
      .then(() => {
        getApplicationInfo('delete')
        loading.value = false
      })
      .catch(() => {
        loading.value = false
      })
  } else {
    vm.submitInfo.buyerList = vm.submitInfo.buyerList.filter(item => item !== buyerItem)
  }
}
onLoad(() => {
  // 在 H5 环境下，尽可能早地执行 hideAllNonBaseMenuItem
  if (getPlatform() === 'H5') {
    wx.hideAllNonBaseMenuItem()
  }
  // 路由带参
  if (route.value.params) {
    refcode = decodeBase64(route.value.params.refcode) === '-1' ? '' : decodeBase64(route.value.params.refcode) // 申请书编号，临时保存后存在
    orgname = decodeBase64(route.value.params.orgname)
    ctyid = decodeBase64(route.value.params.ctyid)
    bizScene = decodeBase64(route.value.params.bizScene)
    productType = decodeBase64(route.value.params.productType)
  }
  // 分享链接带参
  if (getUrlParam('data')) {
    shareDataObj = JSON.parse(decodeBase64(getUrlParam('data'))) as ShareDataObj
    refcode = shareDataObj.refcode
    orgname = shareDataObj.orgname
    ctyid = shareDataObj.ctyid
  }
  // 如果是客户经理填报页面需要检验token
  if (route.value.name === 'ProjectApplicationApply') {
    const token = getStorage('token')
    if (isEmpty(token)) {
      // 跳转到链接失效页面
      router.replace('/member/project/apply/application/failure')
      return
    }
  }
  //初始化默认关闭所有分享菜单
  doShareInfo(1)
  getApplicationInfo()
  // 数据加载完成后，定位到开票信息卡片
  if (getStorage('invoiceData')) {
    nextTick(() => {
      setTimeout(() => {
        if (applicationEditRef.value && applicationEditRef.value.getBillingInfoTop()) {
          try {
            // 调用子组件方法获取开票信息卡片距离顶部的位置
            const top = applicationEditRef.value.getBillingInfoTop()
            scrollTo(0, top)
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('定位失败', error)
          }
        }
      }, 500)
    })
    removeStorage('invoiceData')
  }
})
// 定义发票数据类型
type InvoiceData = {
  refcode: string
  orgname: string
  ctyid: string
}
let firstEntryFlag = true
onShow(() => {
  if (firstEntryFlag) {
    removeStorage('application-buyerInfo')
    removeStorage('submit-info')
    firstEntryFlag = false
  }
  removeStorage('bizScene')
  removeStorage('productType')
  if (getStorage('application-buyerInfo')) {
    vm.submitInfo.buyerList = getStorage('application-buyerInfo') as BuyerList[]
    removeStorage('application-buyerInfo')
  }
  removeStorage('share-data')
  // 从卖方信息确认或删除回到页面暂存后刷新数据
  if (getStorage('enter-type') === 'confirm') {
    removeStorage('enter-type')
    doSave('confirm')
  }
  // 解决选择已开票列表提交后 点击返回箭头跳转页面不对问题
  if (getStorage('invoiceData')) {
    const invoiceData = JSON.parse(getStorage('invoiceData') as string) as InvoiceData
    // removeStorage('invoiceData')
    refcode = invoiceData.refcode
    orgname = invoiceData.orgname
    ctyid = invoiceData.ctyid
    router.replace({
      name: 'ProjectApplicationApply',
      params: {
        refcode: encodeBase64(refcode),
        orgname: encodeBase64(orgname),
        ctyid: encodeBase64(ctyid)
      }
    })
  }
})
onUnload(() => {
  //离开该页面关闭分享
  doShareInfo(1)
})
</script>

<style lang="scss" scoped>
.apply-tip-container {
  position: relative;
  background: #fff;
  .tip-box {
    background-color: #fcf5e2;
    color: $sub-color;
    padding: 48rpx 50rpx 30rpx 30rpx;
    font-size: 24rpx;
    line-height: 34rpx;
    .iconfont {
      font-size: 24rpx;
      margin-right: 6rpx;
    }
  }
  .share-tip-box {
    padding: 36rpx 30rpx 0 40rpx;
    font-size: 28rpx;
    line-height: 34rpx;
    margin-bottom: 20rpx;
  }
}
.returnReason {
  background: #fff;
  min-height: 20rpx;
  margin-bottom: -10rpx;
  padding: 48rpx 50rpx 0 30rpx;
  font-size: 28rpx;
  &.customerManager {
    margin-bottom: 20rpx;
    padding-top: 20rpx;
  }
  .reasonValue {
    color: $danger;
    word-break: break-all;
    & :first-child {
      word-break: break-all;
    }
  }
}

.popup-box {
  padding: 30rpx 30rpx 20rpx;
  .popup-title {
    font-size: 30rpx;
    margin-bottom: 20rpx;
  }
  .popup-statement {
    font-size: 26rpx;
    color: $primary;
    margin-bottom: 20rpx;
  }
  :deep(.textarea-box) {
    border: 1px solid #dadbde;
    border-radius: 8rpx;
    padding-bottom: 18rpx;
    margin-bottom: 20rpx;
    .inputValueClass {
      height: 140rpx;
      font-size: 28rpx;
      padding: 10rpx 18rpx;
      // margin-bottom: 10rpx;
      .uni-textarea-wrapper {
        height: 140rpx;
        .uni-textarea-textarea {
          color: red;
        }
      }
    }
    .u-textarea {
      height: 140rpx;
      border: none;
    }
    .input-placeholder,
    textarea {
      font-size: 28rpx;
    }
    .import {
      margin-left: 18rpx;
      width: fit-content;
      background-color: #e4f2fd;
      border-color: #e4f2fd;
      color: #138bec;
      padding: 8rpx 20rpx;
      font-size: 26rpx;
      border-radius: 6rpx;
    }
  }
}
.slot-content {
  color: #646566;
  .title {
    margin-bottom: 30rpx;
  }
  :deep(.u-textarea) {
    padding: 18rpx 18rpx 32rpx;
    text-align: left;
    // height: 220rpx;
    // .uni-textarea-wrapper {
    //   height: 200rpx;
    // }
  }
}
.inviteWrite {
  color: #fff;
  font-size: 14px;
}
.relative {
  position: relative;
}
</style>
