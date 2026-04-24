<!--
 * @Author       : Longcan.Yang
 * @Date         : 2024-10-14 14:56:42
 * @LastEditors  : aolin.qu
 * @LastEditTime : 2026-03-12 16:02:12
 * @Description  : 项目-业务申请-填报申请书-补充买方信息 member/project/apply/application/buyerInfo
-->
<template>
  <NavBar />
  <view class="application-BuyerInfo">
    <view v-if="isManager && vm.buyerItem.conditionFlag === '1'" class="tip-box">
      <view>
        <span class="text1">
          <i class="iconfont icon-jinggao"></i>
          有条件准入信息：{{ vm.buyerItem.conditionRemark }}
        </span>
      </view>
    </view>
    <u-form label-width="43%">
      <ty-info-card title="买方基本信息" :show-line="false">
        <u-form-item label="买方名称" required>
          <view class="unFocus" @click="showBuyer">
            <u-input v-model="vm.buyerItem.aplOrgname" maxlength="90" readonly placeholder="请选择买方名称" />
          </view>
          <template v-if="index === -1" #right>
            <up-icon name="arrow-right" @click="showBuyer"></up-icon>
          </template>
        </u-form-item>
        <u-form-item label="买方全称(英文)" required>
          <u-input v-model="vm.buyerItem.orgname" maxlength="200" placeholder="请输入买方全称" />
        </u-form-item>
        <u-form-item label="买方所在国" required>
          <u-input v-model="vm.buyerItem.ctyDesc" readonly placeholder="请选择买方所在国" />
        </u-form-item>
        <u-form-item label="详细地址(英文)" required>
          <u-input v-model="vm.buyerItem.addressEn" maxlength="200" placeholder="请输入详细地址" />
        </u-form-item>
        <u-form-item label-width="52%" label="公司注册编号(Company Registration No)" required>
          <u-input v-model="vm.buyerItem.companyRegistrationNo" maxlength="35" placeholder="请输入公司注册编号" />
        </u-form-item>
        <u-form-item label="公司联系邮箱" required>
          <u-input v-model="vm.buyerItem.email" maxlength="120" placeholder="请输入公司联系邮箱" />
        </u-form-item>
        <u-form-item label="公司联系电话/分机" label-width="45%">
          <u-input v-model="vm.buyerItem.mobilePhone" maxlength="30" placeholder="请输入公司联系电话/分机" />
        </u-form-item>
        <u-form-item label="联系人姓名" required>
          <u-input v-model="vm.buyerItem.linkman" maxlength="30" placeholder="请输入联系人姓名" />
        </u-form-item>
        <u-form-item label="联系人职务" required>
          <u-input v-model="vm.buyerItem.linkmanPosition" maxlength="60" placeholder="请输入联系人职务" />
        </u-form-item>
        <u-form-item label="联系人手机号/通讯工具号" label-width="60%" required>
          <u-input v-model="vm.buyerItem.linkmanMobilePhone" maxlength="30" placeholder="请输入联系人手机号/通讯工具号" />
        </u-form-item>
      </ty-info-card>
      <ty-info-card title="贸易基本信息">
        <template #subtitle>
          <view v-if="supplementStatusFlag" class="inviteWrite" @click.stop="showSelectPicker('0')">同其他买方贸易信息</view>
        </template>
        <u-form-item label="交易商品名称" required>
          <u-input v-model="vm.buyerItem.tradeName" readonly placeholder="请输入交易商品名称" />
        </u-form-item>
        <u-form-item label="账期起算日" required>
          <u-input v-model="initialDay" readonly placeholder="请输入账期起算日" />
        </u-form-item>
        <u-form-item label="账期(天)" required>
          <u-input v-model="vm.buyerItem.tenor" readonly placeholder="请输入账期(天)" />
        </u-form-item>
        <u-form-item label="最早交易年份" required>
          <view class="unFocus" @click="showSelectPicker('1')">
            <u-input v-model="vm.buyerItem.firstTransactionYear" placeholder="请选择最早交易年份" />
          </view>
          <template #right>
            <up-icon name="arrow-down" @click="showSelectPicker('1')"></up-icon>
          </template>
        </u-form-item>
        <u-form-item label="币种" label-width="55%" required>
          <view v-if="vm.buyerItem.ccyidDesc !== '其他'" class="unFocus" @click="showSelectPicker('2')">
            <u-input v-model="vm.buyerItem.ccyidDesc" placeholder="请选择币种" />
          </view>
          <view v-else class="otherCcyid">
            <text @click="showSelectPicker('2')">其他</text>
            <u-input v-model="vm.buyerItem.ccyid" maxlength="10" placeholder="请输入币种" />
          </view>
          <template #right>
            <up-icon name="arrow-down" @click="showSelectPicker('2')"></up-icon>
          </template>
        </u-form-item>
        <u-form-item label="当前在手订单金额(万元)" label-width="55%" required>
          <view v-if="vm.buyerItem.ccyid && vm.buyerItem.ccyidDesc !== '其他'" class="appointCcyid">
            <text>{{ vm.buyerItem.ccyid }}</text>
          </view>
          <InputNumber
            ref="currentOrderAmtRef"
            v-model:number="vm.buyerItem.currentOrderAmt"
            placeholder="请输入当前在手订单金额"
            maxlength="15"
          ></InputNumber>
        </u-form-item>
        <u-form-item label="当前应收账款余额(万元)" label-width="55%" required>
          <view v-if="vm.buyerItem.ccyid && vm.buyerItem.ccyidDesc !== '其他'" class="appointCcyid">
            <text>{{ vm.buyerItem.ccyid }}</text>
          </view>
          <InputNumber
            ref="accountBalanceRef"
            v-model:number="vm.buyerItem.accountBalance"
            placeholder="请输入当前应收账款余额"
            maxlength="15"
          ></InputNumber>
        </u-form-item>
        <u-form-item label="支付方式" label-width="45%" required>
          <view class="radio-group">
            <u-button
              v-for="obj in getConstant('payType')"
              :key="obj.key"
              class="check-button"
              :class="{ active: vm.buyerItem.payType === obj.key }"
              round
              size="mini"
              @click="handlezzAction(obj.key, '0')"
            >
              {{ obj.value }}
            </u-button>
          </view>
        </u-form-item>
        <u-form-item v-if="vm.buyerItem.payType === '2'" label-width="45%">
          <u-input v-model="vm.buyerItem.payTypeDesc" maxlength="30" placeholder="请输入其他支付方式" />
        </u-form-item>
        <u-form-item label="当前是否有逾期" required label-width="45%">
          <view class="radio-group">
            <u-button
              v-for="obj in getConstant('yesNo')"
              :key="obj.key"
              class="check-button"
              :class="{ active: vm.buyerItem.overdueFlag === obj.key }"
              round
              size="mini"
              @click="handlezzAction(obj.key, '1')"
            >
              {{ obj.value }}
            </u-button>
          </view>
        </u-form-item>
        <u-form-item v-if="vm.buyerItem.overdueFlag === '1'" label="逾期说明" required label-width="45%">
          <u-input v-model="vm.buyerItem.overdueRemark" maxlength="200" placeholder="请输入逾期说明" />
        </u-form-item>
        <u-form-item label="与买方之间有无禁止债权转让的约定" required label-width="45%">
          <view class="radio-group">
            <u-button
              v-for="obj in getConstant('haveOrNot')"
              :key="obj.key"
              class="check-button"
              :class="{ active: vm.buyerItem.debtTransferFlag === obj.key }"
              round
              size="mini"
              @click="handlezzAction(obj.key, '2')"
            >
              {{ obj.value }}
            </u-button>
          </view>
        </u-form-item>
        <u-form-item v-if="!isEmpty(vm.buyerItem.remark) && isManager" class="vertical-form-item" label="备注说明(申请准入)">
          <text class="access-remark">{{ vm.buyerItem.remark }}</text>
        </u-form-item>
        <u-form-item label="备注说明"></u-form-item>
        <u-textarea
          v-model="vm.buyerItem.buyerDescribe"
          :confirm-type="null"
          maxlength="300"
          placeholder-style="font-size: 28rpx;"
          class="inputValueClass"
          count
          auto-height
          placeholder="若有其他说明请备注"
        ></u-textarea>
      </ty-info-card>
    </u-form>
  </view>
  <view class="button-fixed-bottom">
    <view class="placeholder"></view>
    <view class="fixed">
      <u-button v-if="isManager" :loading="loading" block type="error" native-type="submit" @click="onDelete">删除</u-button>
      <u-button :loading="loading" block type="primary" native-type="submit" @click="onSubmit">确认</u-button>
    </view>
  </view>
  <!-- 币种 -->
  <u-picker
    v-if="showPicker"
    :show="showPicker"
    :columns="vm.columns"
    item-height="88"
    key-name="value"
    @confirm="doConfirm"
    @cancel="showPicker = false"
  />
  <u-popup :show="showSelectBuyer" mode="center">
    <OrgList
      type="list"
      title="买方信息"
      id-key="refcode"
      name-key="counterpartyName"
      :data="findBuyerData.list"
      :search-fun="findAplBuyerPage"
      @back="closeOrg"
      @click-fun="clickOrgFun"
    ></OrgList>
  </u-popup>
  <u-modal :show="showConfirm" title="温馨提示" confirm-text="确定" :show-cancel-button="false" @confirm="showConfirm = false">
    <view class="slot-content">
      <rich-text v-if="!isEmpty(orgnameEnStr)" :nodes="orgnameEnStr"></rich-text>
      <view v-if="!isEmpty(addressEnStr)" class="address-en">
        <rich-text :nodes="addressEnStr"></rich-text>
      </view>
    </view>
  </u-modal>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import { BuyerList } from '@/interfaces/member/project/apply/fillingApplication'
import InputNumber from '@/plugins/InputNumber.vue'
import { getConstant, getValueByKey } from '@/utils/constant'
import { decodeBase64 } from '@/utils/crypto'
import { setStorage, getStorage } from '@/utils/storages'
import { useRoute, useRouter } from '@/uni-simple-router'
import { checkEmail } from '@/utils/validate'
import { ConstantArray } from '@/interfaces/common/constant'
import wx from 'jweixin-1.6.0'
import { getPlatform } from '@/utils/uniapp'
import { isEmpty, checkStringIsEn, findInvalidChars } from '@/utils/validate'
import { showToast } from '@/utils/uniapp/toast'
import OrgList from './components/OrgList.vue'
import { FindBuyerItem } from '@/interfaces/member/project/apply/fillingApplication'
import apiFillingApplication from '@/api/member/project/apply/api.fillingApplication'
const route = useRoute()
const router = useRouter()
const supplementStatusFlag = ref(false)
const index = Number(decodeBase64(route.value.params.index)) //  为-1时代表新增买方
const orgname = decodeBase64(route.value.params.orgname) // 当前卖方名称
let bizScene = '' //业务大类
let productType = '' //产品类型
const showSelectBuyer = ref(false) //是否显示买方列表页面
let counterpartyName = ref('')
let isManager = ref(false)
const loading = ref(false)
const accountBalanceRef = ref()
const currentOrderAmtRef = ref()
const initialDay = ref('') // 起算日
const selectType = ref('') // [1=最早交易年份/2=选择币种]
const columns: ConstantArray = [getConstant('applyCcyid').concat([{ key: 'qt', value: '其他' }])] // 币种
let showPicker = ref(false)
let showConfirm = ref(false) // 买方英文|地址英文校验框
let orgnameEnStr = ref('') // 买方英文
let addressEnStr = ref('') // 买方地址英文
const buyerItem: BuyerList = {
  orgctyid: '',
  aplOrgname: '',
  orgname: '',
  ctyDesc: '',
  ccyidDesc: '',
  payTypeDesc: '',
  tenorStartType: '',
  tenorStartDesc: '',
  ccyid: '',
  supplementStatus: '',
  aplRefcode: -1,
  accountBalance: '',
  addressEn: '',
  appRefcode: 0,
  buyerRefcode: 0,
  companyRegistrationNo: '',
  currentOrderAmt: '',
  debtTransferFlag: '',
  email: '',
  firstTransactionYear: '',
  linkman: '',
  linkmanMobilePhone: '',
  linkmanPosition: '',
  mobilePhone: '',
  overdueFlag: '',
  overdueRemark: '',
  payType: '',
  refcode: null,
  tenor: '',
  tradeName: '',
  aplDtcRefcode: 0,
  aplFinancingNo: '',
  conditionFlag: '',
  conditionRemark: '',
  remark: ''
}
// 可选择买方列表
let FindBuyer: FindBuyerItem[] = []
let findBuyerData = reactive({
  list: FindBuyer
})
let buyerList: BuyerList[] = []
let vm = reactive({
  buyerItem: buyerItem,
  buyerList: buyerList,
  columns: columns
})

/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-24 15:24:23
 * @description: 选择币种 type【0=同其他买方贸易数据/1=最早交易年份/2=选择币种/3=账期起算日】
 */
const showSelectPicker = (type: string) => {
  selectType.value = type
  if (type === '0') {
    let temList: ConstantArray = [[]]
    vm.buyerList.forEach(item => {
      if (item.aplRefcode !== vm.buyerItem.aplRefcode && item.supplementStatus === '1') {
        temList[0].push({ key: String(item.aplRefcode), value: item.orgname })
      }
    })
    vm.columns = temList
  } else if (type === '1') {
    let currentYear = new Date().getFullYear()
    let temList: ConstantArray = [[]]
    for (let i = 0; i < 30; i++) {
      let year = String(currentYear--)
      temList[0].push({ key: year, value: year })
    }
    vm.columns = temList
  } else if (type === '2') {
    vm.columns = [getConstant('applyCcyid').concat([{ key: 'qt', value: '其他' }])]
  } else if (type === '3') {
    vm.columns = [getConstant('tenorStartType')]
  }
  showPicker.value = true
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-24 15:30:47
 * @description: 选择币种确定 selectType【0=选择其他买方同步贸易数据/1=最早交易年份/2=选择币种】
 */
const doConfirm = value => {
  if (selectType.value === '0') {
    vm.buyerList.forEach(item => {
      if (item.aplRefcode === Number(value.value[0].key)) {
        vm.buyerItem.firstTransactionYear = item.firstTransactionYear
        vm.buyerItem.ccyid = item.ccyid
        vm.buyerItem.ccyidDesc = item.ccyidDesc
        vm.buyerItem.currentOrderAmt = item.currentOrderAmt
        vm.buyerItem.accountBalance = item.accountBalance
        vm.buyerItem.payType = item.payType
        vm.buyerItem.payTypeDesc = item.payTypeDesc
        vm.buyerItem.overdueFlag = item.overdueFlag
        vm.buyerItem.overdueRemark = item.overdueRemark
        vm.buyerItem.debtTransferFlag = item.debtTransferFlag
      }
    })
  } else if (selectType.value === '1') {
    vm.buyerItem.firstTransactionYear = value.value[0].value
  } else if (selectType.value === '2') {
    vm.buyerItem.ccyidDesc = value.value[0].value
    vm.buyerItem.ccyid = value.value[0].key === 'qt' ? '' : value.value[0].key
  }
  showPicker.value = false
}

/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-14 14:30:49
 * @param {*} key
 * @param {*} type 【1=是否有逾期/2=有无禁止债权转让的约定
 * @description:
 */
const handlezzAction = (key: string, type: string) => {
  if (type === '0') {
    vm.buyerItem.payType = key
  } else if (type === '1') {
    vm.buyerItem.overdueFlag = key
  } else {
    vm.buyerItem.debtTransferFlag = key
  }
}
/**
 * @Author: Longcan.Yang
 * @Date: 2024-10-14 15:26:59
 * @description:确认保存
 */
const onSubmit = () => {
  let filloutFlag = true
  if (
    !vm.buyerItem.aplOrgname ||
    !vm.buyerItem.orgname ||
    !checkStringIsEn(vm.buyerItem.orgname) ||
    !vm.buyerItem.ctyDesc ||
    !vm.buyerItem.addressEn ||
    !checkStringIsEn(vm.buyerItem.addressEn) ||
    !vm.buyerItem.companyRegistrationNo ||
    !vm.buyerItem.email ||
    !checkEmail(vm.buyerItem.email) ||
    !vm.buyerItem.linkman ||
    !vm.buyerItem.linkmanPosition ||
    !vm.buyerItem.linkmanMobilePhone ||
    !vm.buyerItem.firstTransactionYear ||
    !vm.buyerItem.ccyid ||
    isEmpty(vm.buyerItem.currentOrderAmt) ||
    isEmpty(vm.buyerItem.accountBalance) ||
    !vm.buyerItem.payType ||
    // eslint-disable-next-line no-extra-parens
    (vm.buyerItem.payType === '2' && !vm.buyerItem.payTypeDesc) ||
    !vm.buyerItem.overdueFlag ||
    // eslint-disable-next-line no-extra-parens
    (vm.buyerItem.overdueFlag === '1' && !vm.buyerItem.overdueRemark) ||
    !vm.buyerItem.debtTransferFlag
  ) {
    filloutFlag = false
  }
  if (isEmpty(vm.buyerItem.aplOrgname)) {
    showToast('请选择买方名称')
    return
  }
  /*   if (isEmpty(vm.buyerItem.orgname)) {
    showToast('请输入买方全称(英文)')
    return
  } */
  orgnameEnStr.value = ''
  addressEnStr.value = ''
  if (!isEmpty(vm.buyerItem.orgname) && !checkStringIsEn(vm.buyerItem.orgname)) {
    const tempStr = findInvalidChars(vm.buyerItem.orgname)
    orgnameEnStr.value = `<span>买方全称(英文)只允许填写字母、数字、空格和常见英文符号：</sapn>${tempStr}`
  }
  if (!isEmpty(vm.buyerItem.addressEn) && !checkStringIsEn(vm.buyerItem.addressEn)) {
    const tempStr = findInvalidChars(vm.buyerItem.addressEn)
    addressEnStr.value = `<span>详细地址(英文)只允许填写字母、数字、空格和常见英文符号：</sapn>${tempStr}`
  }
  if (!isEmpty(orgnameEnStr.value) || !isEmpty(addressEnStr.value)) {
    showConfirm.value = true
    return
  }
  if (filloutFlag) {
    vm.buyerItem.supplementStatus = '1'
  } else {
    vm.buyerItem.supplementStatus = '0'
  }
  //客户经理新增买方
  if (index === -1) {
    vm.buyerList.push(vm.buyerItem)
  } else {
    vm.buyerList.forEach(item => {
      if (item.aplRefcode === index) {
        // eslint-disable-next-line no-param-reassign
        item = vm.buyerItem
      }
    })
  }

  setStorage('application-buyerInfo', vm.buyerList)
  setStorage('enter-type', 'confirm')
  router.back(1)
}
// 客户经理删除买方
const onDelete = () => {
  if (vm.buyerItem.refcode) {
    const data = {
      aplDtcRefcode: vm.buyerItem.aplDtcRefcode, //准入交易对手流水号
      appRefcode: vm.buyerItem.appRefcode, //申请表流水号
      refcode: vm.buyerItem.refcode //准入交易对手流水号
    }
    loading.value = true
    apiFillingApplication
      .doRemoveAplBuyer(data)
      .then(() => {
        vm.buyerList = vm.buyerList.filter(item => item.refcode !== vm.buyerItem.refcode)
        loading.value = false
        showToast('删除成功')
        setStorage('application-buyerInfo', vm.buyerList)
        setStorage('enter-type', 'confirm')
        setTimeout(() => {
          router.back(1)
        }, 1000)
      })
      .catch(() => {
        loading.value = false
      })
  } else {
    if (index !== -1) {
      //根据索引删除
      vm.buyerList.splice(index, 1)
    }
    setStorage('application-buyerInfo', vm.buyerList)
    setStorage('enter-type', 'confirm')
    showToast('删除成功')
    router.back(1)
  }
}
const findAplBuyerPage = (val: string) => {
  counterpartyName.value = val
  const data = { counterpartyName: val || '', orgname, bizScene, productType }
  return new Promise<Array<FindBuyerItem>>((resolve, reject) => {
    findBuyerData.list = []
    apiFillingApplication.findAplBuyerPage(data).then(
      res => {
        findBuyerData.list = res.data.appList
        resolve(res.data.appList)
      },
      () => {
        reject(false)
      }
    )
  })
}
const showBuyer = () => {
  if (index === -1) {
    showSelectBuyer.value = true
  }
}
const closeOrg = () => {
  showSelectBuyer.value = false
}
const clickOrgFun = (data: FindBuyerItem) => {
  vm.buyerItem.aplOrgname = data.counterpartyName
  vm.buyerItem.orgctyid = data.ctyid
  vm.buyerItem.ctyDesc = data.ctyDesc
  vm.buyerItem.tradeName = data.productName
  vm.buyerItem.tenor = data.tenor
  vm.buyerItem.remark = data.remark
  vm.buyerItem.tenorStartType = data.tenorStartType || ''
  vm.buyerItem.tenorStartDesc = data.tenorStartDesc || ''
  vm.buyerItem.aplDtcRefcode = data.refcode
  vm.buyerItem.aplFinancingNo = data.subFinancingNo || ''
  vm.buyerItem.conditionFlag = data.conditionFlag || ''
  vm.buyerItem.conditionRemark = data.conditionRemark || ''
  if (checkStringIsEn(vm.buyerItem.aplOrgname)) {
    vm.buyerItem.orgname = vm.buyerItem.aplOrgname
  } else {
    vm.buyerItem.orgname = ''
  }
  if (vm.buyerItem.tenorStartType === '5') {
    initialDay.value = vm.buyerItem.tenorStartDesc
  } else {
    initialDay.value = getValueByKey(vm.buyerItem.tenorStartType, 'tenorStartType')
  }
  showSelectBuyer.value = false
}
onMounted(() => {
  isManager.value = route.value.name === 'ProjectApplicationBuyerInfo' ? true : false
  if (getPlatform() === 'H5') {
    wx.hideAllNonBaseMenuItem()
  }
  bizScene = getStorage('bizScene') as string //业务大类
  productType = getStorage('productType') as string // 产品类型
  //客户经理新增买方
  if (index === -1) {
    findAplBuyerPage('')
  }

  vm.buyerList = getStorage('application-buyerInfo') as BuyerList[]
  vm.buyerList = vm.buyerList || []
  if (vm.buyerList && vm.buyerList.length && index !== -1) {
    vm.buyerList.forEach((item, sindex) => {
      if (sindex === index) {
        vm.buyerItem = item
        initialDay.value =
          vm.buyerItem.tenorStartType !== '5' ? getValueByKey(vm.buyerItem.tenorStartType, 'tenorStartType') : vm.buyerItem.tenorStartDesc
      }
      if (item.supplementStatus === '1' && sindex !== index) {
        supplementStatusFlag.value = true
      }
    })
  }
})
</script>

<style lang="scss" scoped>
.application-BuyerInfo {
  :deep(.u-icon__icon) {
    color: $remark-color !important;
  }
  .internation-info-group {
    :deep(.u-cell-group) {
      padding-top: 0;
      margin: 0;
    }
  }
  .collapse-item-title {
    display: flex;
    justify-content: space-between;
    font-size: 24rpx;
    .inviteWrite {
      background-color: #e4f2fd;
      border-color: #e4f2fd;
      color: #138bec !important;
      padding: 8rpx 20rpx;
      border-radius: 6rpx;
      font-weight: normal;
    }
  }
  .otherCcyid {
    display: flex;
    align-items: center;
  }
  .appointCcyid {
    margin-right: 6rpx;
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
:deep(.u-form-item__body__right__content__slot) {
  justify-content: end;
}
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
.inputValueClass {
  min-height: 160rpx;
  position: relative;
  top: -20rpx;
  :deep(.u-textarea__field) {
    height: auto !important;
    min-height: 160rpx !important;
  }
}
.error {
  background: $danger;
  color: #fff;
}
.slot-content {
  text-align: left;
}
.address-en {
  margin-top: 20rpx;
}
.access-remark {
  font-size: 28rpx;
}
</style>
