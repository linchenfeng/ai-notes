<!--
 * @Author       : LongCan.Yang
 * @Date         : 2023-11-20 14:04:46
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-06-19 11:14:39
 * @Description  : 签约信息收集-供应链 & 供应链+保理买方企业信息补录 /member/myinfo/contractCollect/actualBuyerInfo
-->
<template>
  <NavBar />
  <view class="bigBox">
    <view class="detail">
      <ty-info-card title="基本信息" :show-line="false">
        <view class="basicInfo">
          <u-form label-width="50%">
            <u-form-item label="买方企业名称">
              <u-input v-model="vm.fconScmVo.actualBuyerInfo.actualName" readonly></u-input>
            </u-form-item>
            <u-form-item label="统一社会信用代码" required>
              <u-input v-model="vm.fconScmVo.actualBuyerInfo.actualCreditCode" placeholder="请输入统一社会信用代码" maxlength="18" />
            </u-form-item>
            <u-form-item label="联系人名称" required>
              <u-input v-model="vm.fconScmVo.actualBuyerInfo.actualLinkman" placeholder="请输入联系人名称" maxlength="30" />
            </u-form-item>
            <u-form-item label="联系电话" required>
              <u-input v-model="vm.fconScmVo.actualBuyerInfo.actualLinkmanPhone" placeholder="请输入联系电话" maxlength="11" type="digit" />
            </u-form-item>
            <u-form-item label="联系邮箱" required>
              <u-input v-model="vm.fconScmVo.actualBuyerInfo.actualLinkmanEmail" required placeholder="请输入联系邮箱" maxlength="50" />
            </u-form-item>
            <u-form-item label="联系地址" required>
              <u-input v-model="vm.fconScmVo.actualBuyerInfo.actualContactAddress" required placeholder="请输入联系地址" maxlength="180" />
            </u-form-item>
            <u-form-item label="传真">
              <u-input v-model="vm.fconScmVo.actualBuyerInfo.actualFax" required placeholder="请输入传真" maxlength="20" />
            </u-form-item>
          </u-form>
        </view>
      </ty-info-card>
      <ty-info-card title="开票信息">
        <view class="basicInfo">
          <u-form label-width="50%">
            <u-form-item label="公司名称">
              <u-input v-model="vm.fconScmVo.billingInfo.orgname" readonly></u-input>
            </u-form-item>
            <view class="textRecognition" @click="textRecognition">
              <cover-image src="@/assets/member/myinfo/discernIcon.png" alt="识别" />
              <text class="text">文本智能识别</text>
            </view>
            <u-form-item label="纳税人识别号" required>
              <u-input v-model="vm.fconScmVo.billingInfo.taxpayerIdentificationNumber" placeholder="请输入纳税人识别号" maxlength="20" />
            </u-form-item>
            <u-form-item label="电话" required>
              <u-input v-model="vm.fconScmVo.billingInfo.tel" placeholder="请输入电话" maxlength="15" />
            </u-form-item>
            <u-form-item label="地址" required>
              <u-input v-model="vm.fconScmVo.billingInfo.address" placeholder="请输入地址" maxlength="180" />
            </u-form-item>
            <u-form-item label="开户行" required>
              <u-input v-model="vm.fconScmVo.billingInfo.bankName" placeholder="请输入开户行" maxlength="90" />
            </u-form-item>
            <u-form-item label="账号" required>
              <u-input v-model="vm.fconScmVo.billingInfo.accountNo" placeholder="请输入账号" maxlength="32" />
            </u-form-item>
          </u-form>
        </view>
      </ty-info-card>
      <ty-info-card title="指定交易人信息">
        <view v-for="(item, index) in vm.fconScmVo.assignTraderInfoList" :key="index" class="traderInfo">
          <view v-if="index !== 0" class="cut-lines"></view>
          <view class="actionBar">
            <view class="addItem" @click="addTraderInfoItem">
              <text class="icon-plustianjia iconfont"></text>
              <text class="text">添加</text>
            </view>
            <view v-if="index === 0" class="delItem text" @click="resetTraderInfoItem(index)">
              <i class="icon-qingchu iconfont"></i>
              <text>清空</text>
            </view>
            <view v-if="index !== 0" class="delItem text" @click="delTraderInfoItem(index)">
              <i class="icon-changyonggoupiaorenshanchu iconfont"></i>
              <text>删除</text>
            </view>
          </view>
          <u-form label-width="50%">
            <u-form-item label="交易人类型" :required="item.tradePersonName ? true : false">
              <view class="unFocus" @click="selectTradeType(index)">
                <u-input v-model="item.tradePersonText" placeholder="请选择交易人类型"></u-input>
              </view>
              <template #right>
                <up-icon name="arrow-right" @click="selectTradeType(index)"></up-icon>
                <!-- <cover-image class="rightImg" alt="右箭头" src="@/assets/member/myinfo/youjiantou.png" @click="selectTradeType(index)" /> -->
              </template>
            </u-form-item>
            <u-form-item label="姓名" :required="item.tradePersonType ? true : false">
              <u-input v-model="item.tradePersonName" placeholder="请输入姓名" maxlength="30" />
            </u-form-item>
            <u-form-item label="身份证号">
              <u-input v-model="item.tradePerspnId" placeholder="请输入身份证号" maxlength="18" />
            </u-form-item>
            <u-form-item label="联系电话">
              <u-input v-model="item.tradePerspnTel" placeholder="请输入联系电话" maxlength="11" type="digit" />
            </u-form-item>
            <u-form-item label="联系邮箱">
              <u-input v-model="item.tradePerspnEmail" placeholder="请输入联系邮箱" maxlength="50" />
            </u-form-item>
            <u-form-item label="微信号">
              <u-input v-model="item.guaCompanyWechat" placeholder="请输入微信号" maxlength="30" />
            </u-form-item>
          </u-form>
        </view>
      </ty-info-card>
      <ty-info-card title="上传文件">
        <view class="basicInfo">
          <view class="error">*请上传买方中标通知及买方合同模版</view>
          <u-form label-width="50%">
            <view>
              <Uploader
                accept=".jpg,.jpeg,.png,.pdf,.gif,.doc,.docx,.xls,.xlsx,.zip,.rar"
                :max-size="10"
                :max-count="5"
                remark-text="文件支持图片、WORD、EXCEL、PDF、ZIP、RAR格式，大小不超过10MB"
                :res-uuid-vo="{ fileList: vm.fconScmVo.contractFileList }"
                @upload-success="uploadSuccess"
                @upload-remove="uploadRemove"
              ></Uploader>
            </view>
          </u-form>
        </view>
      </ty-info-card>
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
            placeholder="识别文本信息，并将业务要素自动拆分至下方开票信息栏位，示例：纳税人识别号：9220XXXXXXXXXXXX90 电话：159XXXX6299 地址：XX省XX市XX区XX街道XX号 开户行：中国银行重庆分行 账号：6225099994"
            @change="updateValue()"
          ></u-textarea>
          <view class="iconfontBox"><i v-if="message" class="iconfont icon-guanbi" @click="delMessage"></i></view>
        </view>
        <view v-if="dialogType === '3'" class="recognizeResult">
          <u-form label-width="55%">
            <u-form-item label="纳税人识别号" required>
              <u-input v-model="recognizeResult.taxpayerIdentificationCode" placeholder="请输入纳税人识别号" maxlength="20" />
            </u-form-item>
            <u-form-item label="电话" required>
              <u-input v-model="recognizeResult.taxpayerTel" placeholder="请输入电话" maxlength="15" />
            </u-form-item>
            <u-form-item label="地址" required>
              <u-input v-model="recognizeResult.taxpayerAddress" placeholder="请输入地址" maxlength="180" />
            </u-form-item>
            <u-form-item label="开户行" required>
              <u-input v-model="recognizeResult.taxpayerBank" placeholder="请输入开户行" maxlength="90" />
            </u-form-item>
            <u-form-item label="账号" required>
              <u-input v-model="recognizeResult.taxpayerAccount" placeholder="请输入账号" maxlength="32" />
            </u-form-item>
          </u-form>
        </view>
      </view>
      <view v-else class="warmPrompt">{{ tipInfo }}</view>
    </view>
  </u-modal>
  <u-picker :show="showTradeType" :columns="columns" item-height="88" key-name="value" @confirm="onConfirm" @cancel="showTradeType = false" />
  <FilePreviewVue v-if="showPreview" :resource-uuid="previewUuid" @close-dialog="showPreview = false"></FilePreviewVue>
</template>
<script lang="ts">
export default {
  name: 'MyinfoContractCollectCounterParty',
  options: {
    styleIsolation: 'shared' // 解除样式隔离
  }
}
</script>
<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import FilePreviewVue from '@/plugins/filePreview/index.vue'
// import apiFile from '@/api/common/api.file'
// import { dateFormat } from '@/utils/format'
import { setStorage, getStorage, removeStorage } from '@/utils/storages'
import {
  FconScmVo,
  AssignTraderInfoList,
  GatherInfo,
  LoanOrgInfo,
  LoanOrgTransferLinkInfo,
  FconDtcMListObj,
  GuarantorEnterpriseInfo,
  RecBillingInfo
} from '@/interfaces/member/myinfo/contractCollect'
import { checkEmail, checkMobile, checkIDCard } from '@/utils/validate'
// import { RecBillingInfo } from '@/interfaces/member/myinfo/contractCollect
import apiSignInfo from '@/api/member/api.signInfo'
import { useRouter } from '@/uni-simple-router'
import { showToast } from '@/utils/uniapp/toast'
// import { onShow } from '@dcloudio/uni-app'
import Uploader from '@/plugins/uploader/components/Uploader.vue'
import { ConstantArray } from '@/interfaces/common/constant'
import { getConstant } from '@/utils/constant'
import wx from 'jweixin-1.6.0'
import { getPlatform } from '@/utils/uniapp'
// import apiFile from '@/api/common/api.file'
const router = useRouter()
const loading = ref(false)
// const route = useRoute()
const dialogShow = ref(false)
const message = ref('')
const showConfirmButton = ref(true) // 弹框是否展示确定按钮
const dialogType = ref('') // 弹框显示内容【1=文本识别/3=文本识别完确定/2=数据更新提示】
const tipInfo = ref('') // 数据变更时提示
const collapse = ref()
const showPreview = ref(false)
const previewUuid = ref('')
let showTradeType = ref(false)
const columns: ConstantArray = reactive([getConstant('transactionType')])
let tradeIndex = -1 // 当先修改的指定交易人序列号
let fconScmVo: FconScmVo = {
  actualBuyerInfo: {
    actualContactAddress: '',
    actualCreditCode: '',
    actualFax: '',
    actualLinkman: '',
    actualLinkmanEmail: '',
    actualLinkmanPhone: '',
    actualName: ''
  },
  billingInfo: {
    accountNo: '',
    address: '',
    bankName: '',
    orgname: '',
    refcode: 0,
    taxpayerIdentificationNumber: '',
    tel: ''
  },
  assignTraderInfoList: [
    {
      refcode: 0,
      guaCompanyWechat: '',
      tradePersonEmail: '',
      tradePerspnId: '',
      tradePersonName: '',
      tradePerspnTel: '',
      tradePersonType: '',
      tradePersonText: '',
      tradePerspnEmail: ''
    }
  ],
  contractFileList: []
}
let assignTraderItem: AssignTraderInfoList = {
  refcode: 0,
  guaCompanyWechat: '',
  tradePersonEmail: '',
  tradePerspnId: '',
  tradePersonName: '',
  tradePerspnTel: '',
  tradePersonType: '',
  tradePerspnEmail: '',
  tradePersonText: ''
}
const vm = reactive({
  fconScmVo: fconScmVo
})
// 智能识别结果，临时展示
const recognizeResult: RecBillingInfo = reactive({
  taxpayerAccount: '',
  taxpayerAddress: '',
  taxpayerBank: '',
  taxpayerIdentificationCode: '',
  taxpayerTel: ''
})
// onShow(() => {
//   vm.fconScmVo = getStorage('fconScmVo') as FconScmVo
// })
onMounted(() => {
  vm.fconScmVo = getStorage('fconScmVo') as FconScmVo
  if (getPlatform() === 'H5') {
    // #ifdef H5
    wx.hideAllNonBaseMenuItem()
    // #endif
  }
})
/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-21 09:45:03
 * @description: 新增指定交易人信息
 */
const addTraderInfoItem = () => {
  vm.fconScmVo.assignTraderInfoList.push(Object.assign({}, assignTraderItem))
  nextTick(() => {
    collapse.value.init()
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-21 10:43:07
 * @return {*}
 * @description: 删除指定交易人信息
 */
const delTraderInfoItem = index => {
  vm.fconScmVo.assignTraderInfoList.splice(index, 1)
  nextTick(() => {
    collapse.value.init()
  })
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-12-20 14:16:00
 * @return {*}
 * @description: 重置首位指定交易人
 */
const resetTraderInfoItem = index => {
  vm.fconScmVo.assignTraderInfoList[index] = Object.assign({}, assignTraderItem)
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
      .getBillingInfo({
        message: message.value
      })
      .then(res => {
        recognizeResult.taxpayerIdentificationCode = res.data.taxpayerIdentificationCode
          ? res.data.taxpayerIdentificationCode
          : vm.fconScmVo.billingInfo.taxpayerIdentificationNumber
        recognizeResult.taxpayerTel = res.data.taxpayerTel ? res.data.taxpayerTel : vm.fconScmVo.billingInfo.tel
        recognizeResult.taxpayerAddress = res.data.taxpayerAddress ? res.data.taxpayerAddress : vm.fconScmVo.billingInfo.address
        recognizeResult.taxpayerBank = res.data.taxpayerBank ? res.data.taxpayerBank : vm.fconScmVo.billingInfo.bankName
        recognizeResult.taxpayerAccount = res.data.taxpayerAccount ? res.data.taxpayerAccount : vm.fconScmVo.billingInfo.accountNo
        dialogType.value = '3'
      })
    return false
  } else if (dialogType.value === '3') {
    vm.fconScmVo.billingInfo.taxpayerIdentificationNumber = recognizeResult.taxpayerIdentificationCode
    vm.fconScmVo.billingInfo.tel = recognizeResult.taxpayerTel
    vm.fconScmVo.billingInfo.address = recognizeResult.taxpayerAddress
    vm.fconScmVo.billingInfo.bankName = recognizeResult.taxpayerBank
    vm.fconScmVo.billingInfo.accountNo = recognizeResult.taxpayerAccount
    // 更新输入框值
    message.value = '' // 提交成功后清除文本，关闭弹窗
    dialogShow.value = false
  } else {
    // 立即更新保留企业基本信息数据，重置买方基本信息，连带保证公司，连带保证人数据
    removeStorage('loanOrgTransferLinkInfo')
    removeStorage('fconScmVo')
    removeStorage('buyerInfoList')
    removeStorage('suretyEnterpriseList')
    removeStorage('suretyPersonList')
    router.back(1)
  }
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-22 16:50:01
 * @return {*}
 * @description: 上传文件成功
 */

const uploadSuccess = data => {
  let item = {
    refcode: data.refcode,
    fileName: data.fileName,
    remark: data.remark || '',
    resourceUuid: data.resourceUuid,
    suffixalType: data.fileType,
    fileUploadMethod: '1' // 文件上传方式[1=BMS/2=运营端]
  }
  vm.fconScmVo.contractFileList.push(item)
  nextTick(() => {
    collapse.value.init()
  })
}
// 删除数组
const uploadRemove = (fileList, fileKey, file) => {
  vm.fconScmVo.contractFileList.forEach((item, i) => {
    if (item.resourceUuid === file.resourceUuid) {
      vm.fconScmVo.contractFileList.splice(i, 1)
    }
  })
  nextTick(() => {
    collapse.value.init()
  })
}
// const getBmsFileByResourceUuid = url => {
//   apiFile.getBmsFileByResourceUuid(url)
// }
/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-22 18:33:16
 * @param {*} index
 * @return {*}
 * @description: 删除文件
 */
// const delFile = (item, index: number) => {
//   // getBmsFileByResourceUuid(item.fileName)
//   vm.fconScmVo.contractFileList.splice(index, 1)
//   nextTick(() => {
//     collapse.value.init()
//   })
// }
/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-18 15:34:20
 * @description: 下载文件
 */
// const downloadFile = item => {
//   apiFile.getFileByResourceUuid(item.resourceUuid)
// }
// const previewImg = data => {
//   showPreview.value = true
//   previewUuid.value = data.resourceUuid
// }
/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-21 09:58:23
 * @param {*} void
 * @return {*}
 * @description: 提交买方企业信息
 */
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
        if (gatherInfo.verifySign === 0) {
          if (!vm.fconScmVo.actualBuyerInfo.actualCreditCode) {
            showToast('请输入统一社会信用代码')
            return
          }
          if (vm.fconScmVo.actualBuyerInfo.actualCreditCode && vm.fconScmVo.actualBuyerInfo.actualCreditCode.length < 18) {
            showToast('统一社会信用代码必须18位')
            return
          }
          if (!vm.fconScmVo.actualBuyerInfo.actualLinkman) {
            showToast('请输入联系人名称')
            return
          }
          if (!vm.fconScmVo.actualBuyerInfo.actualLinkmanPhone) {
            showToast('请输入联系电话')
            return
          }
          if (!checkMobile(vm.fconScmVo.actualBuyerInfo.actualLinkmanPhone)) {
            showToast('请输入正确的联系电话')
            return
          }
          if (!vm.fconScmVo.actualBuyerInfo.actualLinkmanEmail) {
            showToast('请输入联系邮箱')
            return
          }
          if (vm.fconScmVo.actualBuyerInfo.actualLinkmanEmail) {
            if (!checkEmail(vm.fconScmVo.actualBuyerInfo.actualLinkmanEmail)) {
              showToast('请输入正确的联系邮箱')
              return
            }
          }
          // 开票信息
          if (!vm.fconScmVo.billingInfo.orgname) {
            showToast('请输入公司名称')
            return
          }
          if (!vm.fconScmVo.billingInfo.taxpayerIdentificationNumber) {
            showToast('请输入纳税人识别号')
            return
          }
          if (!vm.fconScmVo.billingInfo.tel) {
            showToast('请输入开票信息电话')
            return
          }
          // if (!checkMobile(vm.fconScmVo.billingInfo.tel)) {
          //   showToast('请输入正确的开票信息电话')
          //   return
          // }
          if (!vm.fconScmVo.billingInfo.bankName) {
            showToast('请输入开户行')
            return
          }
          if (!vm.fconScmVo.billingInfo.accountNo) {
            showToast('请输入账号')
            return
          }
          for (let item of vm.fconScmVo.assignTraderInfoList) {
            // 姓名填写时，交易人类型必填
            if (!item.tradePersonType && item.tradePersonName) {
              showToast('请选择交易人类型')
              return
            }
            // 交易人类型填写时，姓名必填
            if (item.tradePersonType && !item.tradePersonName) {
              showToast('请输入交易人姓名')
              return
            }
            if (item.tradePerspnId) {
              if (!checkIDCard(item.tradePerspnId)) {
                showToast('请输入正确的交易人身份证号码')
                return
              }
            }
            if (item.tradePerspnTel) {
              if (!checkMobile(item.tradePerspnTel)) {
                showToast('请输入正确的交易人联系电话')
                return
              }
            }
            if (item.tradePerspnEmail) {
              if (!checkEmail(item.tradePerspnEmail)) {
                showToast('请输入正确的交易人联系邮箱')
                return
              }
            }
          }
          if (!vm.fconScmVo.contractFileList || !vm.fconScmVo.contractFileList.length) {
            showToast('请上传文件')
            return
          }
        }
        setStorage('fconScmVo', vm.fconScmVo)
        router.back(1)
      }
    })
    .catch(() => {
      loading.value = false
    })
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
/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-29 09:57:18
 * @return {*}
 * @description: 弹出指定交易人类型选项层
 */
const selectTradeType = index => {
  tradeIndex = index
  showTradeType.value = true
}
/**
 * @Author: longcan.Yang
 * @Date: 2023-01-09 13:18:57
 * @param {*} value
 * @return {*}
 * @description: 选择指定交易人类型
 */
const onConfirm = (value): void => {
  vm.fconScmVo.assignTraderInfoList[tradeIndex].tradePersonText = value.value[0].value
  vm.fconScmVo.assignTraderInfoList[tradeIndex].tradePersonType = value.value[0].key
  showTradeType.value = false
}
</script>

<style lang="scss" scoped>
@import './style/index.scss';
.bigBox {
  .detail {
    border-radius: 5rpx;
    :deep(.u-input) {
      .u-input__label {
        width: 40%;
      }
    }
    .error {
      color: $danger;
      font-size: 24rpx;
      margin-bottom: 20rpx;
    }
    .cut-lines {
      margin-bottom: 30rpx;
      width: 100%;
      height: 2rpx;
      background-color: #ededed;
    }
    .actionBar {
      display: flex;
      padding: 4rpx;
      margin-bottom: $spaced;
      color: #138bec;

      .text {
        font-size: 28rpx;
      }
      .addItem,
      .delItem {
        background: #f7f7f7;
        border: 2rpx solid #e8f0fd;
        border-radius: 5rpx;
        padding: 2rpx 14rpx;
        margin-right: 30rpx;
        .iconfont {
          font-size: 30rpx;
          margin-right: 4rpx;
        }
      }
    }
  }
}
.upload-file-list {
  display: flex;
  justify-content: space-between;
  padding-bottom: 15px;
  .content {
    display: flex;
    align-items: center;
  }
}
:deep(.remark-text) {
  margin-bottom: 30rpx;
}
</style>
