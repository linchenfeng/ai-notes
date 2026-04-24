<!--
 * @Author       : Longcan.Yang
 * @Date         : 2024-10-14 14:56:42
 * @LastEditors  : Longcan.Yang
 * @LastEditTime : 2025-07-31 11:19:36
 * @Description  : 项目-业务申请-受理客户申请-补充买方信息 /member/project/apply/acceptCus/buyerInfo
-->
<template>
  <NavBar />

  <view class="application-BuyerInfo">
    <u-form label-width="43%">
      <ty-info-card :show-line="false">
        <u-form-item label="买方名称" required>
          <u-input v-model="vm.buyerItem.counterpartyName" maxlength="90" placeholder="请输入买方名称" />
          <template v-if="vm.buyerList[0].length" #right>
            <text class="iconfont icon-qiyechaxun" @click="selectName()"></text>
          </template>
        </u-form-item>
        <u-form-item label="买方所在国" required>
          <view class="unFocus" @click="showSelectCty()">
            <u-input v-model="vm.buyerItem.ctyDesc" placeholder="请选择买方所在国" />
          </view>
          <template #right>
            <up-icon name="arrow-right" @click="showSelectCty()"></up-icon>
          </template>
        </u-form-item>
        <u-form-item label="交易商品" required>
          <u-input v-model="vm.buyerItem.productName" maxlength="90" placeholder="请输入交易商品" />
        </u-form-item>
        <u-form-item v-if="productType.includes('物流')" label="买方是否有物流管理系统" label-width="60%" required>
          <view class="radio-group">
            <u-button
              v-for="obj in getConstant('yesNo')"
              :key="obj.key"
              class="check-button"
              :class="{ active: vm.buyerItem.logisticsSystemFlag === obj.key }"
              round
              size="mini"
              @click="handlezzAction(obj.key, '1')"
            >
              {{ obj.value }}
            </u-button>
          </view>
        </u-form-item>
        <u-form-item v-if="productType.includes('物流')" label="买卖双方运单对账方式" label-width="50%" required>
          <view v-if="vm.buyerItem.waybillVerifyType !== '9'" class="unFocus" @click="selectPicker('3')">
            <u-input v-model="vm.buyerItem.waybillVerifyDesc" placeholder="请选择买卖双方运单对账方式" />
          </view>
          <view v-else class="otherCcyid">
            <text @click="selectPicker('3')">其他</text>
            <u-input v-model="vm.buyerItem.waybillVerifyDesc" maxlength="50" placeholder="请输入买卖双方运单对账方式" />
          </view>

          <template #right>
            <up-icon name="arrow-down" @click="selectPicker('3')"></up-icon>
          </template>
        </u-form-item>
        <u-form-item v-if="productType.includes('物流')" label="是否公开招投标项目" label-width="60%" required>
          <view class="radio-group">
            <u-button
              v-for="obj in getConstant('yesNo')"
              :key="obj.key"
              class="check-button"
              :class="{ active: vm.buyerItem.publicBiddingFlag === obj.key }"
              round
              size="mini"
              @click="handlezzAction(obj.key, '2')"
            >
              {{ obj.value }}
            </u-button>
          </view>
        </u-form-item>
        <u-form-item label="账期起算日" label-width="50%" required>
          <view v-if="vm.buyerItem.tenorStartType !== '5'" class="unFocus" @click="selectPicker('1')">
            <u-input v-model="vm.buyerItem.tenorStartDesc" placeholder="请选择账期起算日" />
          </view>
          <view v-else class="otherCcyid">
            <text @click="selectPicker('1')">其他</text>
            <u-input v-model="vm.buyerItem.tenorStartDesc" maxlength="50" placeholder="请输入账期起算日" />
          </view>
          <template #right>
            <up-icon name="arrow-down" @click="selectPicker('1')"></up-icon>
          </template>
        </u-form-item>
        <u-form-item label="账期(天)" label-width="50%" required>
          <InputNumber v-model:number="vm.buyerItem.tenor" :format-flag="false" :point="0" placeholder="请输入账期" maxlength="10"></InputNumber>
        </u-form-item>
        <u-form-item label="币种" label-width="50%" required>
          <view v-if="vm.buyerItem.ccyidDesc !== '其他'" class="unFocus" @click="selectPicker('2')">
            <u-input v-model="vm.buyerItem.ccyidDesc" placeholder="请选择币种" />
          </view>
          <view v-else class="otherCcyid">
            <text @click="selectPicker('2')">其他</text>
            <u-input v-model="vm.buyerItem.ccyid" maxlength="50" placeholder="请输入币种" />
          </view>
          <template #right>
            <up-icon name="arrow-down" @click="selectPicker('2')"></up-icon>
          </template>
        </u-form-item>
        <u-form-item :label="`年度交易金额(万元)`" label-width="50%" required>
          <view v-if="vm.buyerItem.ccyid && vm.buyerItem.ccyidDesc !== '其他'" class="appointCcyid">
            <text>{{ vm.buyerItem.ccyid }}</text>
          </view>
          <InputNumber v-model:number="vm.buyerItem.annualTurnover" placeholder="请输入年度交易金额" maxlength="15"></InputNumber>
        </u-form-item>
        <u-form-item :label="`未来年度交易金额(万元)`" label-width="50%" required>
          <view v-if="vm.buyerItem.ccyid && vm.buyerItem.ccyidDesc !== '其他'" class="appointCcyid">
            <text>{{ vm.buyerItem.ccyid }}</text>
          </view>
          <InputNumber v-model:number="vm.buyerItem.futureAnnualTurnover" placeholder="请输入未来年度交易金额" maxlength="15"></InputNumber>
        </u-form-item>
        <u-form-item label="合作年限" required>
          <u-input v-model="vm.buyerItem.transactionYears" maxlength="20" placeholder="请输入合作年限" />
        </u-form-item>
        <u-form-item label="项目来源" required>
          <u-input v-model="vm.buyerItem.projectSource" maxlength="200" placeholder="请输入项目来源" />
        </u-form-item>
      </ty-info-card>
    </u-form>
  </view>
  <view class="button-fixed-bottom">
    <view class="placeholder"></view>
    <view class="fixed">
      <u-button :loading="loading" block type="error" native-type="submit" @click="onDelete">删除</u-button>
      <u-button :loading="loading" block type="primary" native-type="submit" @click="onSubmit">确认</u-button>
    </view>
  </view>
  <!-- 买方信息 -->
  <u-picker :show="showPicker" :columns="vm.nameColumns" item-height="88" key-name="orgname" @confirm="doConfirm" @cancel="showPicker = false" />
  <!-- 币种账期起算日 -->
  <u-picker
    :show="showSelectPicker"
    :columns="vm.columns"
    item-height="88"
    key-name="value"
    @confirm="doSelectConfirm"
    @cancel="showSelectPicker = false"
  />

  <u-popup :show="showSelectCountry" mode="center">
    <SelectCountry
      type="list"
      title="国家地区信息"
      :is-check-white-list="true"
      :data="selectCountryList.data"
      :search-fun="getCountryList"
      @back="close"
      @click-fun="clickFun"
    ></SelectCountry>
  </u-popup>
  <u-modal
    :show="showModalFlag"
    title="温馨提示"
    confirm-text="确定"
    :show-cancel-button="true"
    class="accessModal"
    @confirm="onConfirm"
    @cancel="showModalFlag = false"
  >
    <view class="slot-content">
      <view>是否确认删除？</view>
    </view>
  </u-modal>
</template>

<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue'
import { OrgListPicker } from '@/interfaces/member/project/apply/businessApply'
import apiBusinessApply from '@/api/member/project/apply/api.businessApply'
import { getConstant } from '@/utils/constant'
import { ConstantArray } from '@/interfaces/common/constant'
import wx from 'jweixin-1.6.0'
import { getPlatform } from '@/utils/uniapp'
import { doWxConfig } from '@/utils/weixin/wxConfig'
import { FintAplDtcVoList } from '@/interfaces/member/project/apply/businessApply'
import apiCommon from '@/api/common/api.common'
import SelectCountry from '@/plugins/SelectCountryNew.vue'
import InputNumber from '@/plugins/InputNumber.vue'
import { useRoute, useRouter } from '@/uni-simple-router'
import { decodeBase64 } from '@/utils/crypto'
import { isEmpty } from '@/utils/validate'
import { setStorage, getStorage } from '@/utils/storages'
import { showToast } from '@/utils/uniapp/toast'
import { getValueByKey } from '@/utils/constant'
const route = useRoute()
const router = useRouter()
let productType = ''
let bizScene = ''
let index = -1
const loading = ref(false)
const selectType = ref('') // [1=最早交易年份/2=选择币种]
const showSelectCountry = ref(false) // 是否显示国家列表
const columns: ConstantArray = [getConstant('applyCcyid').concat([{ key: 'qt', value: '其他' }])] // 币种
let showPicker = ref(false) // 买方泪飙弹窗
let showSelectPicker = ref(false) // 币种账期起算日
let holdName = ref('')
let showModalFlag = ref(false) // 拒绝弹窗
let checkWhiteList = ref(false)
type ListType = {
  code: string
  text: string
  ctyFlag: string
}
let selectCountryList = reactive({
  data: Array<ListType>()
})
const buyerItem: FintAplDtcVoList = {
  refcode: '',
  counterpartyName: '',
  ctyid: '',
  ctyDesc: '',
  productName: '',
  logisticsSystemFlag: '',
  waybillVerifyType: '',
  waybillVerifyDesc: '',
  publicBiddingFlag: '',
  tenorStartType: '',
  tenorStartTypeDesc: '',
  tenorStartDesc: '',
  tenor: '',
  ccyid: '',
  ccyidDesc: '',
  annualTurnover: '',
  futureAnnualTurnover: '',
  transactionYears: '',
  projectSource: '',
  supplementStatus: ''
}
const nameColumns: OrgListPicker = [[]] // 选择买卖方列表
const buyerList: OrgListPicker = [[]] // 买方列表
let fintAplDtcVoList: FintAplDtcVoList[] = []
let vm = reactive({
  buyerItem: buyerItem, //当前买方信息
  buyerList: buyerList, // 买方选择列表
  nameColumns: nameColumns,
  columns: columns,
  fintAplDtcVoList: fintAplDtcVoList //当前买方列表
})
/**
 * @Author: Charon.Lin
 * @Date: 2025-04-03 16:38:30
 * @description: 选择买方名称
 */
const selectName = () => {
  vm.nameColumns = vm.buyerList
  showPicker.value = true
}
/**
 * @Author: Charon.Lin
 * @Date: 2025-04-03 16:38:30
 * @description: 选择买方名称确定
 */
const doConfirm = value => {
  vm.buyerItem.counterpartyName = value.value[0].orgname
  vm.buyerItem.ctyid = bizScene === '1' ? vm.buyerItem.ctyid : value.value[0].orgctyid
  vm.buyerItem.ctyDesc = bizScene === '1' ? vm.buyerItem.ctyDesc : value.value[0].ctyDesc
  showPicker.value = false
}
/**
 * @Author: LongCan.Yang
 * @Date: 2024-06-24 16:56:09
 * @param {*} val isCheckWhiteList是否查询全部国家【true=是/false=否】
 * @description: 分类选择组件查询方法
 */
const getCountryList = (val: string, isCheckWhiteList: boolean) => {
  holdName.value = val
  checkWhiteList.value = isCheckWhiteList
  //citFlag  1=白名单/2=黑名单/-=全部
  const citFlag = isCheckWhiteList ? '1' : '-'
  return new Promise<Array<ListType>>((resolve, reject) => {
    selectCountryList.data = []
    apiCommon.getCountryList(citFlag, val).then(
      res => {
        if (res.data.countryList && res.data.countryList.length) {
          res.data.countryList.forEach(item => {
            selectCountryList.data.push({
              code: item.ctyid,
              text: item.ctyDesc,
              ctyFlag: item.ctyFlag
            })
          })
        } else {
          selectCountryList.data = []
        }

        resolve(selectCountryList.data)
      },
      () => {
        reject(false)
      }
    )
  })
}
const showSelectCty = () => {
  // 若存在holdName或上次查询为白名单此处获取所有国家
  if (holdName.value || checkWhiteList.value) {
    getCountryList('', false)
  }
  showSelectCountry.value = true
}
const close = () => {
  showSelectCountry.value = false
}
const clickFun = (data: ListType) => {
  vm.buyerItem.ctyDesc = data.text
  vm.buyerItem.ctyid = data.code
  showSelectCountry.value = false
}
const handlezzAction = (key: string, type: string) => {
  if (type === '1') {
    vm.buyerItem.logisticsSystemFlag = key
  } else if (type === '2') {
    vm.buyerItem.publicBiddingFlag = key
  }
}
const selectPicker = (type: string) => {
  selectType.value = type
  if (type === '1') {
    vm.columns = [getConstant('tenorStartType')]
  } else if (type === '2') {
    vm.columns = [getConstant('applyCcyid').concat([{ key: 'qt', value: '其他' }])]
  } else {
    vm.columns = [getConstant('waybillType')]
  }
  showSelectPicker.value = true
}
const doSelectConfirm = value => {
  if (selectType.value === '1') {
    vm.buyerItem.tenorStartType = value.value[0].key
    vm.buyerItem.tenorStartDesc = vm.buyerItem.tenorStartType === '5' ? '' : value.value[0].value
  } else if (selectType.value === '2') {
    vm.buyerItem.ccyidDesc = value.value[0].value
    vm.buyerItem.ccyid = value.value[0].key === 'qt' ? '' : value.value[0].key
  } else {
    vm.buyerItem.waybillVerifyType = value.value[0].key
    vm.buyerItem.waybillVerifyDesc = vm.buyerItem.waybillVerifyType === '9' ? '' : value.value[0].value
  }
  showSelectPicker.value = false
}
/**
 * @Author: Charon.Lin
 * @Date: 2025-04-03 17:07:08
 * @description: 买方信息确定
 */
const onSubmit = () => {
  if (isEmpty(vm.buyerItem.counterpartyName)) {
    showToast('请填写买方名称')
    return
  }
  let filloutFlag = true
  if (
    isEmpty(vm.buyerItem.counterpartyName) ||
    isEmpty(vm.buyerItem.ctyid) ||
    isEmpty(vm.buyerItem.productName) ||
    isEmpty(vm.buyerItem.tenorStartType) ||
    // eslint-disable-next-line no-extra-parens
    (productType.includes('物流') &&
      (isEmpty(vm.buyerItem.logisticsSystemFlag) ||
        isEmpty(vm.buyerItem.waybillVerifyType) ||
        // eslint-disable-next-line no-extra-parens
        (vm.buyerItem.waybillVerifyType === '9' && isEmpty(vm.buyerItem.waybillVerifyDesc)) ||
        isEmpty(vm.buyerItem.publicBiddingFlag))) ||
    // eslint-disable-next-line no-extra-parens
    (vm.buyerItem.tenorStartType === '5' && isEmpty(vm.buyerItem.tenorStartDesc)) ||
    isEmpty(vm.buyerItem.tenor) ||
    isEmpty(vm.buyerItem.ccyid) ||
    isEmpty(vm.buyerItem.annualTurnover) ||
    isEmpty(vm.buyerItem.futureAnnualTurnover) ||
    isEmpty(vm.buyerItem.transactionYears) ||
    isEmpty(vm.buyerItem.projectSource)
  ) {
    filloutFlag = false
  }
  if (filloutFlag) {
    vm.buyerItem.supplementStatus = '1'
  } else {
    vm.buyerItem.supplementStatus = '0'
  }
  if (index === -1) {
    //买方列表第一个插入
    vm.fintAplDtcVoList.unshift(vm.buyerItem)
  } else {
    vm.fintAplDtcVoList[index] = vm.buyerItem
  }
  setStorage('application-fintAplDtcVoList', vm.fintAplDtcVoList)
  setStorage('enter-type', 'confirm')
  router.back(1)
}
/**
 * @Author: Charon.Lin
 * @Date: 2025-04-03 17:07:08
 * @description: 买方信息删除
 */
const onDelete = () => {
  const hasInput = Object.values(vm.buyerItem).some(val => !isEmpty(val))
  if (!hasInput) {
    showToast('当前未填写任何信息')
    return
  }
  showModalFlag.value = true
}
/**
 * @Author: Charon.Lin
 * @Date: 2025-04-03 17:07:08
 * @description: 买方信息删除确认
 */
const onConfirm = () => {
  if (index !== -1) {
    vm.fintAplDtcVoList.splice(index, 1)
  }
  setStorage('application-fintAplDtcVoList', vm.fintAplDtcVoList)
  setStorage('enter-type', 'confirm')
  showToast('删除成功')
  router.back(1)
}
const doShareInfo = () => {
  // H5端分享
  if (getPlatform() === 'H5') {
    // #ifdef H5
    const jsApiList = ['updateAppMessageShareData', 'hideMenuItems', 'onMenuShareAppMessage', 'hideAllNonBaseMenuItem', 'showMenuItems']
    // 要展示的菜单项
    doWxConfig(jsApiList).then(() => {
      wx.hideAllNonBaseMenuItem()
    })
    // #endif
  }
}
const getApplyOrgInfo = (type: string) => {
  apiBusinessApply.getApplyOrgInfo(type).then(res => {
    vm.buyerList = [res.data.orgList]
  })
}
onMounted(() => {
  if (getStorage('application-fintAplDtcVoList')) {
    vm.fintAplDtcVoList = getStorage('application-fintAplDtcVoList') as FintAplDtcVoList[]
  }
  if (route.value.params) {
    productType = decodeBase64(route.value.params.productType)
    bizScene = decodeBase64(route.value.params.bizScene)
    const indexStr = decodeBase64(route.value.params.index) // 获取索引值
    index = Number(indexStr)
    if (index !== -1) {
      vm.buyerItem = vm.fintAplDtcVoList[index]
    }
  }
  //业务产品为“物流”时交易商品默认填入物流运输服务
  if (productType.includes('物流') && isEmpty(vm.buyerItem.productName)) {
    vm.buyerItem.productName = '物流运输服务'
  }
  if (productType.includes('物流') && isEmpty(vm.buyerItem.tenorStartType)) {
    vm.buyerItem.tenorStartType = '2'
    vm.buyerItem.tenorStartDesc = '发票日'
  }
  if (productType.includes('物流') && isEmpty(vm.buyerItem.ccyid)) {
    vm.buyerItem.ccyid = 'CNY'
    vm.buyerItem.ccyidDesc = getConstant('applyCcyid').find(item => item.key === 'CNY')?.value || ''
  }
  if (vm.buyerItem.ccyid && !vm.buyerItem.ccyidDesc) {
    vm.buyerItem.ccyidDesc = getValueByKey(vm.buyerItem.ccyid, 'applyCcyid') || '其他'
  }
  if (vm.buyerItem.tenorStartType) {
    vm.buyerItem.tenorStartDesc = getValueByKey(vm.buyerItem.tenorStartType, 'tenorStartType') || ''
  }
  doShareInfo()
  getCountryList('', false) // 获取国家列表
  getApplyOrgInfo('2') // 回去买方名称数据
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
      color: #138bec;
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
.inviteWrite {
  color: #fff;
  font-size: 14px;
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
.icon-qiyechaxun {
  color: #999;
}
</style>
