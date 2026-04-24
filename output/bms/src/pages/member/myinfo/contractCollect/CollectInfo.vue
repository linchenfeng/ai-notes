<!--
 * @Author       : longcan.Yang
 * @Date         : 2023-01-04 19:45:07
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-06-24 14:20:20
 * @Description  : /member/myinfo/contractCollect/collectInfo 签约信息收集补充页面
-->
<template>
  <!-- <NavBar /> -->
  <NavBar v-if="collectPathObj.verifySign === 0" :show-share="vm.loanOrgInfo.contractInfoStatus === '1'" @on-click-right="doShareInfoGuide" />
  <view class="parentBox">
    <up-sticky v-if="vm.loanOrgInfo.contractInfoStatus && collectPathObj.verifySign === 0" bg-color="#fff">
      <state-module
        :state-name="stateName[vm.loanOrgInfo.contractInfoStatus]"
        :state-color="stateColor[vm.loanOrgInfo.contractInfoStatus]"
      ></state-module>
    </up-sticky>
    <view v-if="collectPathObj.verifySign === 0" class="returnReason">
      <view v-if="vm.loanOrgInfo.contractInfoStatus === '3'">
        <text>退回原因：</text>
        <text class="reasonValue">{{ vm.loanOrgInfo.signConfirmOption }}</text>
      </view>
    </view>
    <ty-info-card title="融资企业基本信息" class="loan-info" background="#fff">
      <view class="basicInfo">
        <u-form :label-width="vm.loanOrgInfo.verifySign === 0 ? '50%' : '52%'">
          <u-form-item label="融资企业名称">
            <u-input v-model="vm.loanOrgInfo.orgname" readonly></u-input>
          </u-form-item>
          <u-form-item label="法定代表人" required>
            <u-input v-model="vm.loanOrgInfo.legalPerson" placeholder="请输入法定代表人" maxlength="30" />
          </u-form-item>
          <view class="reAddressItem">
            <u-form-item label="注册地址" required>
              <!-- <u-input v-model="vm.loanOrgInfo.registeredAddress" placeholder="请输入注册地址" maxlength="180" /> -->
              <u-textarea
                v-model="vm.loanOrgInfo.registeredAddress"
                :confirm-type="null"
                border="false"
                placeholder="请输入注册地址"
                maxlength="180"
              ></u-textarea>
            </u-form-item>
          </view>
          <view class="textRecognition" @click="textRecognition">
            <cover-image src="@/assets/member/myinfo/discernIcon.png" alt="识别" />
            <text class="text">文本智能识别</text>
          </view>
          <u-form-item label="邮政编码" required>
            <u-input v-model="vm.loanOrgInfo.postcode" placeholder="请输入邮政编号" maxlength="7" type="digit" />
          </u-form-item>
          <u-form-item label="联系电话" required>
            <u-input v-model="vm.loanOrgInfo.tel" placeholder="请输入联系电话" maxlength="11" type="digit" />
          </u-form-item>
          <u-form-item label="联系邮箱" required>
            <u-input v-model="vm.loanOrgInfo.contactEmail" placeholder="请输入联系邮箱" maxlength="50" />
          </u-form-item>
          <view class="reAddressItem">
            <u-form-item label="联系地址" required>
              <u-input v-model="vm.loanOrgInfo.contactAddress" placeholder="请输入联系地址" maxlength="180" />
              <!-- <u-textarea :confirm-type="null" v-model="vm.loanOrgInfo.contactAddress" border="false" placeholder="请输入联系地址" maxlength="180"></u-textarea> -->
            </u-form-item>
          </view>
          <u-form-item label="传真">
            <u-input v-model="vm.loanOrgInfo.fax" placeholder="请输入传真" maxlength="20" />
          </u-form-item>
          <u-form-item label="收款账户名称" required>
            <u-input v-model="vm.loanOrgInfo.accountName" :readonly="accountDisabled" placeholder="请输入收款账户名称" maxlength="90" />
          </u-form-item>
          <u-form-item label="收款账户开户行" required>
            <u-input v-model="vm.loanOrgInfo.bankName" placeholder="请输入收款账户开户行" maxlength="90" />
          </u-form-item>
          <u-form-item label="收款银行账号" required>
            <u-input v-model="vm.loanOrgInfo.accountNo" placeholder="请输入收款银行账号" maxlength="32" />
          </u-form-item>
          <u-form-item v-if="vm.loanOrgInfo.bussType === 5" label="币种" required>
            <view class="unFocus" @click="selectTransferMethod">
              <u-input v-model="vm.loanOrgInfo.ccyidText" placeholder="请选择币种" />
            </view>
            <template #right>
              <up-icon name="arrow-right" @click="selectTransferMethod"></up-icon>
              <!-- <cover-image class="rightImg" alt="右箭头" src="@/assets/member/myinfo/youjiantou.png" @click="selectTransferMethod" /> -->
            </template>
          </u-form-item>
          <u-form-item v-if="vm.loanOrgInfo.ccyid === 'CNY'" label="收款账户开户行行号" required>
            <u-input v-model="vm.loanOrgInfo.cnapsCode" placeholder="请输入收款账户开户行行号" maxlength="12" />
          </u-form-item>
          <u-form-item v-if="vm.loanOrgInfo.bussType === 5 && vm.loanOrgInfo.ccyid !== 'CNY'" label="SWIFT NO" required>
            <u-input v-model="vm.loanOrgInfo.swiftNo" placeholder="请输入SWIFT NO" maxlength="11" />
          </u-form-item>
          <u-form-item v-if="vm.loanOrgInfo.bussType === 5 && vm.loanOrgInfo.ccyid !== 'CNY'" label="银行地址" required>
            <u-input v-model="vm.loanOrgInfo.bankAddress" placeholder="请输入银行地址" maxlength="180" />
          </u-form-item>
        </u-form>
      </view>
    </ty-info-card>
    <!-- 融资企业贸易阶段联系人 供应链+保理业务展示该模块-->
    <OrgLinkInfo v-if="vm.loanOrgInfo.bussType === 3" ref="orgLinkInfoRef" :verify-sign="vm.loanOrgInfo.verifySign" :refcode="refcode"></OrgLinkInfo>
    <!-- 买方企业信息 -->
    <BuyerInfoList
      v-if="vm.loanOrgInfo.bussType && vm.loanOrgInfo.bussType !== 0"
      ref="buyerInfoListRef"
      :refcode="refcode"
      :buss-type="vm.loanOrgInfo.bussType"
      :verify-sign="vm.loanOrgInfo.verifySign"
    ></BuyerInfoList>
    <!-- 连带保证公司信息 -->
    <SuretyEnterpriseList
      ref="suretyEnterpriseListRef"
      :verify-sign="vm.loanOrgInfo.verifySign"
      :refcode="refcode"
      :buss-type="vm.loanOrgInfo.bussType"
    ></SuretyEnterpriseList>
    <!-- 连带保证人信息 -->
    <SuretyPersonList
      ref="suretyPersonListRef"
      :verify-sign="vm.loanOrgInfo.verifySign"
      :refcode="refcode"
      :buss-type="vm.loanOrgInfo.bussType"
    ></SuretyPersonList>

    <view class="button-fixed-bottom">
      <view class="placeholder"></view>
      <view class="fixed" :class="collectPathObj.verifySign === 0 ? 'removeBorder' : ''">
        <!-- 客户经理临时保存 -->
        <!-- <u-button class="temSubmitBtn" block type="success" native-type="submit" @click="getMakingContractStatus('0')">
          {{ '保存' }}
        </u-button> -->
        <!--  <view v-if="collectPathObj.verifySign === 0" class="vteam-button" @click="getMakingContractStatus('0')">
          <view class="vteam-button-icon">
            <text class="iconfont icon-baocun"></text>
          </view>
          <view class="vteam-button-text">
            <text>{{ '保存' }}</text>
          </view>
        </view> -->
        <u-button
          v-if="collectPathObj.verifySign === 0"
          class="submitBtn"
          block
          type="success"
          native-type="submit"
          :loading="loading"
          @click="getMakingContractStatus('0')"
        >
          保存
        </u-button>
        <u-button
          class="submitBtn"
          block
          :type="collectPathObj.verifySign === 0 ? 'primary' : 'success'"
          native-type="submit"
          :loading="loading"
          @click="getMakingContractStatus('1')"
        >
          {{ collectPathObj.verifySign === 0 ? '提交' : '保存' }}
        </u-button>
      </view>
    </view>
  </view>
  <view v-if="isGuideFlag" class="guide-group">
    <cover-image class="guide-arrows" src="@/assets/member/myinfo/collect/guide-arrows.png" alt="指引" />
    <cover-image class="guide-tip" src="@/assets/member/myinfo/collect/guide-tip.png" alt="提示" />
    <cover-image class="guide-know" src="@/assets/member/myinfo/collect/guide-know.png" alt="知道了" @click="isGuideFlag = false" />
  </view>
  <u-picker
    :show="showTransferMethod"
    :columns="columns"
    item-height="88"
    key-name="value"
    @confirm="onConfirm"
    @cancel="showTransferMethod = false"
  />
  <u-overlay :show="isGuideFlag" @click="isGuideFlag = false"></u-overlay>
  <view class="modalDialog">
    <u-modal
      :show="dialogShow"
      mode="center"
      :round="10"
      :class="dialogType === '2' ? '' : 'recognitionDialog'"
      cancel-text="取消"
      :confirm-text="dialogType === '1' ? '识别' : ['2', '4'].includes(dialogType) ? '立即更新' : '确定'"
      :show-cancel-button="!['1', '3'].includes(dialogType)"
      :show-confirm-button="showConfirmButton"
      @cancel="cancel"
      @confirm="modalConfirm"
    >
      <view class="slot-content">
        <view class="title">
          <view class="iconfont"><i v-if="['1', '3'].includes(dialogType)" class="iconfont icon-guanbi2" @click="cancel"></i></view>
          <view>{{ ['2', '4'].includes(dialogType) ? '温馨提示' : '文本粘贴识别' }}</view>
        </view>
        <!-- dialogType【1=文本识别/2=运营条件变更，立即更新/3=展示识别成功的数据/4=融资企业保存，获取最新数据】 -->
        <view v-if="['1', '3'].includes(dialogType)" class="importText">
          <view class="fieldBox">
            <u-textarea
              v-model="message"
              :confirm-type="null"
              :placeholder-style="{ 'font-size': '24rpx' }"
              maxlength="200"
              :placeholder="
                vm.loanOrgInfo.bussType === 5
                  ? '识别文本信息，并将业务要素自动拆分至下方账户信息栏位，示例：邮政编码：433000 电话：1997689XXXX 邮箱：91732941@163.com 联系地址：XX省XX市XX区高新大道99号 传真：010-98889388 户名：XXX有限公司 账号：6191100 开户行：中国银行重庆分行 行号：3500 银行地址：XX市XX区中南路109号'
                  : '识别文本信息，并将业务要素自动拆分至下方账户信息栏位，示例：邮政编码：433000 电话：1997689XXXX 邮箱：91732941@163.com 联系地址：XX省XX市XX区高新大道99号 传真：010-98889388 户名：XXX有限公司 账号：6191100 开户行：中国银行重庆分行 行号：3500'
              "
              @change="updateValue()"
            ></u-textarea>
            <view class="iconfontBox"><i v-if="message" class="iconfont icon-guanbi" @click="delMessage"></i></view>
          </view>
          <view v-if="dialogType === '3'" class="recognizeResult">
            <u-form label-width="55%">
              <u-form-item label="邮政编码" required>
                <u-input v-model="recognizeResult.postcode" placeholder="请输入邮政编号" maxlength="7" type="digit" />
              </u-form-item>
              <u-form-item label="联系电话" required>
                <u-input v-model="recognizeResult.tel" placeholder="请输入联系电话" maxlength="11" type="digit" />
              </u-form-item>
              <u-form-item label="联系邮箱" required>
                <u-input v-model="recognizeResult.contactEmail" placeholder="请输入联系邮箱" maxlength="50" />
              </u-form-item>
              <u-form-item label="联系地址" required>
                <u-input v-model="recognizeResult.contactAddress" placeholder="请输入联系地址" maxlength="180" />
              </u-form-item>
              <u-form-item label="传真">
                <u-input v-model="recognizeResult.fax" placeholder="请输入传真" maxlength="20" />
              </u-form-item>
              <u-form-item label="收款账户名称" required>
                <u-input v-model="recognizeResult.accountName" :readonly="accountDisabled" placeholder="请输入收款账户名称" maxlength="90" />
              </u-form-item>
              <u-form-item label="收款账户开户行" required>
                <u-input v-model="recognizeResult.bankName" placeholder="请输入账户开户行" maxlength="90" />
              </u-form-item>
              <u-form-item label="收款银行账号" required>
                <u-input v-model="recognizeResult.accountNo" placeholder="请输入收款银行账号" maxlength="32" />
              </u-form-item>
              <!-- <u-form-item v-if="vm.loanOrgInfo.bussType === 5" label="币种" required>
                <view class="unFocus" @click="selectTransferMethod">
                  <u-input v-model="recognizeResult.ccyidText" placeholder="请选择币种" />
                </view>
                <template #right>
                  <cover-image class="rightImg" alt="右箭头" src="@/assets/member/myinfo/youjiantou.png" @click="selectTransferMethod" />
                </template>
              </u-form-item> -->
              <u-form-item v-if="vm.loanOrgInfo.ccyid === 'CNY'" label="收款账户开户行行号" required>
                <u-input v-model="recognizeResult.cnapsCode" placeholder="请输入收款账户开户行行号" maxlength="12" />
              </u-form-item>
              <u-form-item v-if="vm.loanOrgInfo.bussType === 5 && vm.loanOrgInfo.ccyid !== 'CNY'" label="SWIFT NO" required>
                <u-input v-model="recognizeResult.swiftNo" placeholder="请输入SWIFT NO" maxlength="11" />
              </u-form-item>
              <u-form-item v-if="vm.loanOrgInfo.bussType === 5 && vm.loanOrgInfo.ccyid !== 'CNY'" label="银行地址" required>
                <u-input v-model="recognizeResult.bankAddress" placeholder="请输入银行地址" maxlength="180" />
              </u-form-item>
            </u-form>
          </view>
        </view>
        <view v-else class="warmPrompt" :class="dialogType === '4' ? 'center' : ''">{{ tipInfo }}</view>
      </view>
    </u-modal>
  </view>
</template>
<script lang="ts">
export default {
  name: 'MyinfoContractCollectInfo',
  options: {
    styleIsolation: 'shared' // 解除样式隔离
  }
}
</script>
<script setup lang="ts">
import { getPlatform } from '@/utils/uniapp'
import StateModule from '@/plugins/StateModule.vue'
import NavBar from '@/layout/NavBar.vue'
// import { getHasPermissionsById } from '@/utils/permissions'
import { encodeBase64, decodeBase64, getUrlParam } from '@/utils/crypto'
import { GatherInfo, LoanOrgInfo, CollectPathObj } from '@/interfaces/member/myinfo/contractCollect'
import { setStorage, getStorage, removeStorage } from '@/utils/storages'
import apiSignInfo from '@/api/member/api.signInfo'
import { ConstantArray } from '@/interfaces/common/constant'
import { getConstant, getValueByKey } from '@/utils/constant'
import { checkEmail, checkMobile } from '@/utils/validate'
import { showToast } from '@/utils/uniapp/toast'
import { useRoute, useRouter, onBeforeRouteLeave } from '@/uni-simple-router'
import { onShow, onHide } from '@dcloudio/uni-app'
import OrgLinkInfo from './components/OrgLinkInfo.vue'
import BuyerInfoList from './components/BuyerInfoList.vue'
import SuretyEnterpriseList from './components/SuretyEnterpriseList.vue'
import SuretyPersonList from './components/SuretyPersonList.vue'
import { doWxConfig } from '@/utils/weixin/wxConfig'
import wx from 'jweixin-1.6.0'
const router = useRouter()
const route = useRoute()
const loading = ref(false)
const orgLinkInfoRef = ref()
const buyerInfoListRef = ref()
const suretyEnterpriseListRef = ref()
const suretyPersonListRef = ref()
const dialogShow = ref(false)
let refcode = Number(decodeBase64(route.value.params.refcode as string)) //客户流水号
let changeIdentity = 0 // 更新状态
let accountDisabled = ref(true) // 默认禁用收款账户名称，若识别则可以修改
const showConfirmButton = ref(true) // 弹框是否展示确定按钮
const dialogType = ref('') // 弹框显示内容dialogType【1=文本识别/2=运营条件变更，立即更新/3=展示识别成功的数据/4=融资企业保存，获取最新数据】
const tipInfo = ref('') // 数据变更时提示
let isGuideFlag = ref(false) // 是否显示遮罩层 分享好友指引时展示
let hideSetFlag = true // onHide事件是否需要缓存数据
let collectPathObj: CollectPathObj = {
  // 融资企业通过分享链接跳入带入的参数
  refcode: 0,
  verifySign: 0,
  shareTime: 0
}
const stateName = {
  '1': '待补充',
  '3': '已退回'
}
const stateColor = {
  '1': 'warning',
  '3': 'error'
}
let message = ref('')
let temSubmitFlag = ref(false) // 是否临时提交
const showTransferMethod = ref(false)
const columns: ConstantArray = reactive([getConstant('ccyid')])
// 智能识别结果，临时展示
const recognizeResult = reactive({
  postcode: '',
  tel: '',
  contactEmail: '',
  contactAddress: '',
  fax: '',
  accountName: '',
  bankName: '',
  accountNo: '',
  cnapsCode: '',
  swiftNo: '',
  bankAddress: ''
})
let Info: GatherInfo = {
  bussType: 0,
  refcode: 0,
  verifySign: 0, // 是否校验数据【0=校验/1=不校验】
  orgname: '',
  legalPerson: '',
  registeredAddress: '',
  postcode: '',
  tel: '',
  bankName: '',
  accountNo: '',
  cnapsCode: '',
  ccyid: 'CNY',
  fconDtcMList: [],
  tradeEmail: '',
  tradePerson: '',
  tradeTel: '',
  tradeWechatNo: '',
  suretyEnterpriseList: [],
  suretyPersonList: [],
  loanOrgTransferLinkInfo: {
    tradeEmail: '',
    tradePerson: '',
    tradeTel: '',
    tradeWechatNo: ''
  },
  fconScmVo: {
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
    assignTraderInfoList: [],
    contractFileList: []
  },
  accountName: '',
  bankAddress: '',
  contactAddress: '',
  contactEmail: '',
  fax: '',
  swiftNo: ''
}
// 融资企业信息
let loanOrgInfo: LoanOrgInfo = {
  accountName: '',
  accountNo: '',
  verifySign: 0,
  bankAddress: '',
  bankName: '',
  ccyid: 'CNY',
  cnapsCode: '',
  contactAddress: '',
  contactEmail: '',
  fax: '',
  legalPerson: '',
  orgname: '',
  postcode: '',
  refcode: 0,
  registeredAddress: '',
  swiftNo: '',
  tel: '',
  ccyidText: '',
  signConfirmOption: '',
  contractInfoStatus: '',
  bussType: 0,
  managerMc: ''
}

const props = defineProps({
  shareTime: {
    // 客户经理分享的时间
    default: -1,
    type: Number,
    required: false
  }
})
const emit = defineEmits(['getCollectStatus', 'getUserName'])
const vm = reactive({
  loanOrgInfo: loanOrgInfo,
  gatherInfo: Info
})
/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-23 10:21:34
 * @return {*}
 * @description: 查询融资企业基本信息
 */
const getLoanOrgInfo = () => {
  let data = {
    refcode: refcode
  }
  apiSignInfo.getLoanOrgInfo(data).then(res => {
    vm.loanOrgInfo = res.data.loanOrgInfo
    vm.loanOrgInfo.accountName = vm.loanOrgInfo.orgname
    if (!res.data.loanOrgInfo.ccyid) {
      vm.loanOrgInfo.ccyid = 'CNY'
    }
    vm.loanOrgInfo.ccyidText = getValueByKey(res.data.loanOrgInfo.ccyid, 'ccyid')
    if (collectPathObj.verifySign) {
      vm.loanOrgInfo.verifySign = 1
    } else {
      vm.loanOrgInfo.verifySign = 0
    }
  })
}
let firstEntryFlag = true
onShow(() => {
  // 融资企业第一次进入清掉缓存数据
  if (firstEntryFlag) {
    removeStorage('loanOrgInfo')
    removeStorage('loanOrgTransferLinkInfo')
    removeStorage('fconScmVo')
    removeStorage('buyerInfoList')
    removeStorage('suretyEnterpriseList')
    removeStorage('suretyPersonList')
    if (getUrlParam('data')) {
      collectPathObj = JSON.parse(decodeBase64(getUrlParam('data'))) as CollectPathObj
      refcode = collectPathObj.refcode
      // 融资企业链接跳入
    }
    // 获取合同状态
    apiSignInfo.getMakingContractStatus(refcode).then(res => {
      if (res.data.contractInfoStatus !== '1' && collectPathObj.verifySign === 1) {
        emit('getCollectStatus', '2')
      } else if (!['1', '3'].includes(res.data.contractInfoStatus) && vm.loanOrgInfo.verifySign === 0) {
        // 客户经理方
        showToast('当前合同签约信息已补充，请勿重复操作')
        setTimeout(() => {
          router.back(1)
        }, 100)
      } else {
        changeIdentity = res.data.changeIdentity
      }
      // 状态为  签约信息待补录  设置分享链接&菜单
      if (res.data.contractInfoStatus === '1') {
        doShareInfo(0)
      } else if (res.data.contractInfoStatus === '3') {
        // 签约信息退回不允许分享
        doShareInfo(1)
      }
      firstEntryFlag = false
    })
  } else if (vm.loanOrgInfo.contractInfoStatus === '1') {
    // 非第一次进入
    doShareInfo(0)
  } else if (vm.loanOrgInfo.contractInfoStatus === '3') {
    // 非第一次进入
    // 签约信息退回不允许分享
    doShareInfo(1)
  }

  // 融资企业信息
  if (getStorage('loanOrgInfo')) {
    vm.loanOrgInfo = getStorage('loanOrgInfo') as LoanOrgInfo
  } else {
    getLoanOrgInfo()
  }
})

// 离开页面缓存数据，避免离开页面导致数据丢失
onHide(() => {
  if (hideSetFlag) {
    setStorage('loanOrgInfo', vm.loanOrgInfo)
  }
})
/**
 * @Author: longcan.Yang
 * @Date: 2023-01-10 14:17:08
 * @return {*}
 * @description: 前往子页面补录信息，缓存数据,跳转至列表页时清除缓存数据
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
    setStorage('loanOrgInfo', vm.loanOrgInfo)
  } else {
    hideSetFlag = false
    removeStorage('loanOrgInfo')
    removeStorage('loanOrgTransferLinkInfo')
    removeStorage('fconScmVo')
    removeStorage('buyerInfoList')
    removeStorage('suretyEnterpriseList')
    removeStorage('suretyPersonList')
    if (getPlatform() === 'H5') {
      // #ifdef H5
      wx.updateAppMessageShareData({
        title: '客户经理移动端', // 分享标题
        desc: '', // 分享描述
        link: `${window.location.origin}/`, // 分享链接
        imgUrl: `${window.location.origin}/static/img/head.png` // 分享图标
      })
      // #endif
    }
  }
})
/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-27 11:19:15
 * @return {*}
 * @description: 分享给融资企业
 */
const doShareInfo = (type: number) => {
  const collectPathObj = {
    refcode: refcode,
    verifySign: 1, // 【1=融资企业收集数据】
    shareTime: props.shareTime && props.shareTime !== -1 ? props.shareTime : new Date().getTime()
  }
  // 融资企业分享不再重新计时
  // console.error(encodeBase64(JSON.stringify(collectPathObj)))

  // H5端分享
  if (getPlatform() === 'H5') {
    // #ifdef H5
    const jsApiList = ['updateAppMessageShareData', 'hideMenuItems', 'onMenuShareAppMessage', 'hideAllNonBaseMenuItem', 'showMenuItems']
    // 要展示的菜单项
    doWxConfig(jsApiList).then(() => {
      // 仅待补充信息能分享朋友
      if (type === 0) {
        wx.hideMenuItems({
          menuList: [
            'menuItem:share:timeline',
            'menuItem:share:qq',
            'menuItem:share:weiboApp',
            'menuItem:favorite',
            'menuItem:share:facebook',
            'menuItem:share:QZone',
            'menuItem:editTag',
            'menuItem:delete',
            'menuItem:copyUrl',
            'menuItem:originPage',
            'menuItem:readMode',
            'menuItem:openWithQQBrowser',
            'menuItem:openWithSafari',
            'menuItem:share:email'
          ]
        })
        wx.showMenuItems({ menuList: ['menuItem:share:appMessage'] })
        // 解决PC端分享链接title、描述不生效
        wx.onMenuShareAppMessage({
          title: '签约信息补充邀请', // 分享标题
          desc: '我正在邀请您补充相关企业信息，快来填写信息吧', // 分享描述
          link: `${window.location.origin}/finFirmCollect?data=${encodeBase64(JSON.stringify(collectPathObj))}`, // 分享链接
          imgUrl: `${window.location.origin}/static/img/head.png` // 分享图标
        })
        wx.updateAppMessageShareData({
          title: '签约信息补充邀请', // 分享标题
          desc: '我正在邀请您补充相关企业信息，快来填写信息吧', // 分享描述
          link: `${window.location.origin}/finFirmCollect?data=${encodeBase64(JSON.stringify(collectPathObj))}`, // 分享链接
          imgUrl: `${window.location.origin}/static/img/head.png` // 分享图标
        })
      } else {
        wx.hideAllNonBaseMenuItem()
      }
    })

    // #endif
  } else {
    // 小程序端分享
    return {
      title: '签约信息收集',
      path: `/#/contractCollect/collectInfo?data=${encodeBase64(JSON.stringify(collectPathObj))}`
    }
  }
}
/**
 * @Author: LongCan.Yang
 * @Date: 2023-11-27 11:19:15
 * @return {*}
 * @description: 分享给朋友指引
 */
const doShareInfoGuide = () => {
  isGuideFlag.value = true
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
/**
 * @Author: longcan.Yang
 * @Date: 2023-03-13 16:25:25
 * @param {*} void
 * @return {*}
 * @description: 点击识别弹出识别框
 */
const textRecognition = (): void => {
  dialogType.value = '1'
  dialogShow.value = true
  // 输入框有文本才显示识别按钮
  if (message.value) {
    showConfirmButton.value = true
  } else {
    showConfirmButton.value = false
  }
}
const cancel = () => {
  dialogShow.value = false
}
const selectTransferMethod = (): void => {
  showTransferMethod.value = true
}
/**
 * @Author: longcan.Yang
 * @Date: 2023-01-09 13:18:57
 * @param {*} value
 * @return {*}
 * @description: 币种
 */
const onConfirm = (value): void => {
  vm.loanOrgInfo.ccyidText = value.value[0].value
  vm.loanOrgInfo.ccyid = value.value[0].key
  showTransferMethod.value = false
}

/**
 * @Author: longcan.Yang
 * @Date: 2023-01-16 09:18:30
 * @return {*}
 * @description: return false阻止关闭弹框  dialogType【1=文本识别/2=运营条件变更，立即更新/3=展示识别成功的数据/4=融资企业保存，获取最新数据】
 */
const modalConfirm = () => {
  if (dialogType.value === '1') {
    if (!message.value) {
      showToast('请输入文本信息')
      return false
    }
    apiSignInfo
      .getEnterpriseInfo({
        bussType: vm.loanOrgInfo.bussType,
        message: message.value
      })
      .then(res => {
        // recognizeResult.accountName = res.data.user ? res.data.user : vm.loanOrgInfo.accountName
        if (res.data.user) {
          recognizeResult.accountName = res.data.user
          accountDisabled.value = false // 文本识别出收款账户名称，可以修改
        } else {
          recognizeResult.accountName = vm.loanOrgInfo.accountName
        }
        recognizeResult.bankName = res.data.bank ? res.data.bank : vm.loanOrgInfo.bankName
        recognizeResult.cnapsCode = res.data.bankNo ? res.data.bankNo : vm.loanOrgInfo.cnapsCode
        recognizeResult.contactEmail = res.data.email ? res.data.email : vm.loanOrgInfo.contactEmail
        recognizeResult.tel = res.data.tel ? res.data.tel : vm.loanOrgInfo.tel
        recognizeResult.postcode = res.data.postcode ? res.data.postcode : vm.loanOrgInfo.postcode
        recognizeResult.accountNo = res.data.account ? res.data.account : vm.loanOrgInfo.accountNo
        recognizeResult.contactAddress = res.data.contactAddress ? res.data.contactAddress : vm.loanOrgInfo.contactAddress
        recognizeResult.fax = res.data.fax ? res.data.fax : vm.loanOrgInfo.fax
        recognizeResult.swiftNo = res.data.swiftNo ? res.data.swiftNo : vm.loanOrgInfo.swiftNo
        recognizeResult.bankAddress = res.data.bankAddress ? res.data.bankAddress : vm.loanOrgInfo.bankAddress
        dialogType.value = '3'
      })
    return false
  } else if (dialogType.value === '3') {
    vm.loanOrgInfo.accountName = recognizeResult.accountName
    vm.loanOrgInfo.bankName = recognizeResult.bankName
    vm.loanOrgInfo.cnapsCode = recognizeResult.cnapsCode
    vm.loanOrgInfo.contactEmail = recognizeResult.contactEmail
    vm.loanOrgInfo.tel = recognizeResult.tel
    vm.loanOrgInfo.postcode = recognizeResult.postcode
    vm.loanOrgInfo.accountNo = recognizeResult.accountNo
    vm.loanOrgInfo.contactAddress = recognizeResult.contactAddress
    vm.loanOrgInfo.fax = recognizeResult.fax
    vm.loanOrgInfo.swiftNo = recognizeResult.swiftNo
    vm.loanOrgInfo.bankAddress = recognizeResult.bankAddress
    // 更新输入框值
    message.value = '' // 提交成功后清除文本，关闭弹窗
    dialogShow.value = false
  } else {
    // 更新数据,保留企业基本信息数据，重置买方企业，连带保证公司，连带保证人数据
    if (orgLinkInfoRef && orgLinkInfoRef.value) {
      orgLinkInfoRef.value.getLoanOrgTransferLinkInfo()
    }
    if ([3, 4].includes(vm.loanOrgInfo.bussType)) {
      buyerInfoListRef.value.getSupplyActualBuyerInfo()
    } else {
      buyerInfoListRef.value.getCounterpartyList()
    }
    if (suretyEnterpriseListRef && suretyEnterpriseListRef.value) {
      suretyEnterpriseListRef.value.getSuretyEnterpriseList()
    }
    if (suretyPersonListRef && suretyPersonListRef.value) {
      suretyPersonListRef.value.getsuretyPersonList()
    }
    if (dialogType.value === '4') {
      changeIdentity = temChangeIdentity
      getLoanOrgInfo()
    }
    dialogShow.value = false
  }
}
/**
 * @Author: longcan.Yang
 * @Date: 2023-01-12 13:45:49
 * @param {*} void
 * @return {*}
 * @description: 提交签约信息收集数据
 */
const doSubmitMakingContractInfo = (): void => {
  // 客户经理&提交才须交验
  if (vm.gatherInfo.verifySign === 0 && !temSubmitFlag.value) {
    if (!vm.gatherInfo.legalPerson) {
      showToast('请输入法定代表人')
      return
    }
    if (!vm.gatherInfo.registeredAddress) {
      showToast('请输入注册地址')
      return
    }
    if (!vm.gatherInfo.postcode) {
      showToast('请输入邮政编码')
      return
    }
    if (!vm.gatherInfo.tel) {
      showToast('请输入联系电话')
      return
    }
    if (!checkMobile(vm.gatherInfo.tel)) {
      showToast('请输入正确的联系电话')
      return
    }
    if (!vm.gatherInfo.contactEmail) {
      showToast('请输入联系邮箱')
      return
    }
    if (!checkEmail(vm.gatherInfo.contactEmail)) {
      showToast('请输入正确的联系邮箱')
      return
    }
    if (!vm.gatherInfo.contactAddress) {
      showToast('请输入联系地址')
      return
    }
    // if (!vm.gatherInfo.fax) {
    //   showToast('请输入传真')
    //   return
    // }
    if (!vm.gatherInfo.accountName) {
      showToast('请输入收款账户名称')
      return
    }
    if (vm.gatherInfo.accountName !== vm.gatherInfo.orgname) {
      showToast('收款账户名称不正确')
      return
    }
    if (!vm.gatherInfo.bankName) {
      showToast('请输入收款账户开户行')
      return
    }
    if (!vm.gatherInfo.accountNo) {
      showToast('请输入收款银行账号')
      return
    }
    if (vm.gatherInfo.bussType === 5) {
      if (!vm.gatherInfo.ccyid) {
        showToast('请选择币种')
        return
      }
      if (vm.gatherInfo.ccyid !== 'CNY') {
        if (!vm.gatherInfo.swiftNo) {
          showToast('请输入SWIFT NO')
          return
        }
        if (!vm.gatherInfo.bankAddress) {
          showToast('请输入银行地址')
          return
        }
      }
    }
    if (vm.gatherInfo.ccyid === 'CNY') {
      if (!vm.gatherInfo.cnapsCode) {
        showToast('请输入收款账户开户行行号')
        return
      }
    }
    //
    if (vm.gatherInfo.bussType === 3) {
      if (!vm.gatherInfo.tradePerson) {
        showToast('请输入贸易阶段联系人名称')
        return
      }
      if (!vm.gatherInfo.tradeTel) {
        showToast('请输入贸易阶段联系人电话')
        return
      }
      if (!checkMobile(vm.gatherInfo.tradeTel)) {
        showToast('请输入正确的贸易阶段联系人电话')
        return
      }
      if (!vm.gatherInfo.tradeEmail) {
        showToast('请输入贸易阶段联系人邮箱')
        return
      }
      if (!checkEmail(vm.gatherInfo.tradeEmail)) {
        showToast('请输入正确的贸易阶段联系人邮箱')
        return
      }
    }

    // 非供应链业务买方企业信息
    if ([1, 2, 5].includes(vm.gatherInfo.bussType)) {
      // 校验买方企业
      if (vm.gatherInfo.fconDtcMList && vm.gatherInfo.fconDtcMList.length) {
        let unfilledObject = '' // 的对象
        let unfilledFlag = false // 是否有的值
        for (let item of vm.gatherInfo.fconDtcMList) {
          unfilledObject = item.buyerName
          // 统一社会信用代码||联系地址
          if (!item.buyerCreditCode || !item.contactAddress) {
            unfilledFlag = true
            break
          }
          // 非国际保理业务必输
          if (vm.gatherInfo.bussType !== 5) {
            if (!item.linkman || !item.linkmanPhone) {
              unfilledFlag = true
              break
            }
          }
        }
        if (unfilledFlag) {
          showToast(`买方企业[${unfilledObject}]信息填写不完整，请先填写完整再提交`)
          return
        }
      }
    } else if ([3, 4].includes(vm.gatherInfo.bussType)) {
      if (
        !vm.gatherInfo.fconScmVo.actualBuyerInfo.actualCreditCode ||
        !vm.gatherInfo.fconScmVo.actualBuyerInfo.actualLinkman ||
        !vm.gatherInfo.fconScmVo.billingInfo.taxpayerIdentificationNumber ||
        !vm.gatherInfo.fconScmVo.contractFileList.length
      ) {
        showToast(`买方企业[${vm.gatherInfo.fconScmVo.actualBuyerInfo.actualName}]信息填写不完整，请先填写完整再提交`)
        return
      }
    }

    // 校验连带保证公司
    if (vm.gatherInfo.suretyEnterpriseList && vm.gatherInfo.suretyEnterpriseList.length) {
      let unfilledObject = '' // 的对象
      let unfilledFlag = false // 是否有的值
      for (let item of vm.gatherInfo.suretyEnterpriseList) {
        if (!item.guaAccountNo || !item.guaBankName) {
          unfilledObject = item.guaName as string
          unfilledFlag = true
          break
        }
      }
      if (unfilledFlag) {
        showToast(`连带保证公司[${unfilledObject}]信息填写不完整，请先填写完整再提交`)
        return
      }
    }
    // 校验连带保证人
    if (vm.gatherInfo.suretyPersonList && vm.gatherInfo.suretyPersonList.length) {
      let unfilledObject = '' // 的对象
      let unfilledFlag = false // 是否有的值
      for (let item of vm.gatherInfo.suretyPersonList) {
        if (!item.guaTel || !item.guaIdNo || !item.guaAddress) {
          unfilledObject = item.guaName as string
          unfilledFlag = true
          break
        }
      }
      if (unfilledFlag) {
        showToast(`连带保证人[${unfilledObject}]信息填写不完整，请先填写完整再提交`)
        return
      }
    }
  }
  let data = JSON.parse(JSON.stringify(vm.gatherInfo))
  if (temSubmitFlag.value) {
    // 客户经理临时保存，不校验数据
    data.verifySign = 1
  }
  loading.value = true
  apiSignInfo
    .doSubmitMakingContractInfo(data)
    .then(res => {
      loading.value = false
      if (vm.loanOrgInfo.verifySign === 0 && !temSubmitFlag.value) {
        // 客户经理提交
        showToast('提交成功')
        setTimeout(() => {
          router.back(1)
          // router.push('/member/myinfo/contractCollect')
        }, 100)
      } else if (vm.loanOrgInfo.verifySign === 0 && temSubmitFlag.value) {
        // 客户经理临时保存
        showToast('保存成功')
        changeIdentity++ // 自己保存更新状态+1
      } else {
        // 融资企业保存
        emit('getCollectStatus', '3')
      }
      // router.push('/member/myinfo/contractCollect')
    })
    .catch(() => {
      loading.value = false
    })
}
/**
 * @Author: longcan.Yang
 * @Date: 2023-01-13 09:46:12
 * @param {*} void
 * @return {*}
 * @description: 校验运营条件是否有变更
 */
const doCheckMakingContractInfo = (): void => {
  let orgLinkInfo = orgLinkInfoRef.value ? orgLinkInfoRef.value.getData() : {}
  vm.gatherInfo = {
    ...vm.loanOrgInfo,
    tradeEmail: orgLinkInfo.tradeEmail,
    tradePerson: orgLinkInfo.tradePerson,
    tradeTel: orgLinkInfo.tradeTel,
    tradeWechatNo: orgLinkInfo.tradeWechatNo,
    fconDtcMList: buyerInfoListRef.value ? buyerInfoListRef.value.getData().buyerInfoList : [],
    fconScmVo: buyerInfoListRef.value ? buyerInfoListRef.value.getData().fconScmVo : {},
    loanOrgTransferLinkInfo: orgLinkInfoRef.value ? orgLinkInfoRef.value.getData() : {},
    suretyEnterpriseList: suretyEnterpriseListRef.value ? suretyEnterpriseListRef.value.getData() : [],
    suretyPersonList: suretyPersonListRef.value ? suretyPersonListRef.value.getData() : []
  }
  apiSignInfo.doCheckMakingContractInfo(vm.gatherInfo).then(res => {
    // 数据是否变更[0=否/1=是(数据已变更)]
    if (res.data.result === '1') {
      dialogType.value = '2'
      tipInfo.value = res.data.tipInfo
      showConfirmButton.value = true
      dialogShow.value = true
    } else {
      doSubmitMakingContractInfo()
    }
  })
}
let temChangeIdentity = 0
/**
 * @Author: longcan.Yang
 * @Date: 2023-01-13 09:51:07
 * @return {*}
 * @description: 校验合同状态是否为“待补充信息”、“签约信息退回”
 */
const getMakingContractStatus = type => {
  if (type === '0') {
    temSubmitFlag.value = true // 客户经理临时保存
  } else {
    temSubmitFlag.value = false
  }
  loading.value = false
  apiSignInfo
    .getMakingContractStatus(refcode)
    .then(res => {
      loading.value = false
      if (!['1', '3'].includes(res.data.contractInfoStatus) && vm.loanOrgInfo.verifySign === 0) {
        // 客户经理方
        showToast('当前合同签约信息已补充，请勿重复操作')
        setTimeout(() => {
          router.back(1)
        }, 100)
      } else if (res.data.contractInfoStatus !== '1' && vm.loanOrgInfo.verifySign === 1) {
        // 融资企业方
        emit('getCollectStatus', '2')
      } else if (changeIdentity !== res.data.changeIdentity) {
        temChangeIdentity = res.data.changeIdentity
        dialogType.value = '4'
        if (vm.loanOrgInfo.verifySign === 0) {
          tipInfo.value = `签约信息已更新，请先更新页面数据后再${temSubmitFlag.value ? '保存' : '提交'}`
        } else {
          tipInfo.value = '数据已被更新，请刷新页面获取最新信息'
        }
        showConfirmButton.value = true
        dialogShow.value = true
        // showToast('数据已被更新，请刷新页面获取最新信息')
      } else {
        doCheckMakingContractInfo()
      }
    })
    .catch(() => {
      loading.value = false
    })
}
</script>

<style lang="scss" scoped>
@import './style/index.scss';
.button-fixed-bottom {
  .vteam-button {
    padding: 0 70rpx;
  }
}
:deep(.u-sticky) {
  top: 44px !important;
  z-index: 2 !important;
  .stateModule {
    z-index: 3;
  }
}
.guide-group {
  z-index: 10072;
  .guide-arrows {
    position: fixed;
    z-index: 10072;
    width: 117rpx;
    height: 101rpx;
    top: 8rpx;
    right: 66rpx;
  }
  .guide-tip {
    position: fixed;
    z-index: 10072;
    width: 382rpx;
    height: 70rpx;
    top: 86rpx;
    right: 43rpx;
  }
  .guide-know {
    position: fixed;
    z-index: 10072;
    width: 194rpx;
    height: 78rpx;
    top: 600rpx;
    right: 290rpx;
  }
}
.view-image {
  cover-image {
    width: 24rpx;
    height: 12rpx;
  }
}
:deep(.reAddressItem .u-form-item) {
  .u-form-item__body {
    align-items: start;
  }
}
.parentBox {
  position: relative;
  padding: 0 0 30rpx 0;
  .state5 {
    @include mixin-statusSign(9);
  }
  .state1 {
    @include mixin-statusSign(0);
  }
  .returnReason {
    min-height: 20rpx;
    padding: 40rpx 50rpx 40rpx 29rpx;
    font-size: 28rpx;
    .reasonValue {
      color: $danger;
      word-break: break-all;
      & :first-child {
        word-break: break-all;
      }
    }
  }
  .counterParty {
    border-bottom: 1rpx solid #ededed;
    margin-bottom: 30rpx;
    font-size: 28rpx;
    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }
    .orgName {
      font-size: 28rpx;
      font-weight: 400;
      color: $default-color;
    }
    .creditCode {
      // display: flex;
      margin-top: 25rpx;
    }
    .accountNumber,
    .openingBank {
      // margin-top: 8rpx;
      color: $default-color;
    }
    .default-color {
      color: $default-color;
    }
    .information {
      margin-top: 10rpx;
      margin-bottom: 30rpx;
    }
    .identityNo,
    .personName {
      margin-top: 10rpx;
    }
    .iconfont {
      opacity: 0.4;
      vertical-align: bottom;
      font-size: 36rpx;
      margin-right: 10rpx;
    }
  }
  .loan-info {
    margin-top: -40rpx;
  }
}
</style>
